import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CONFIG_PATH = path.resolve(ROOT_DIR, 'firebase-applet-config.json');

export interface StoredEnquiry {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  serviceCategory: string;
  serviceDetail?: string;
  countryOrCity?: string;
  studentAge?: string;
  timeSlotPreference?: string;
  message: string;
  status: 'new' | 'contacted' | 'reviewed' | 'resolved';
}

interface FirebaseAppletConfig {
  projectId: string;
  firestoreDatabaseId?: string;
  storageBucket?: string;
}

let adminDb: Firestore | null = null;
let firestoreAvailable = false;
let initAttempted = false;

const loadFirebaseConfig = (): FirebaseAppletConfig | null => {
  try {
    if (!fs.existsSync(CONFIG_PATH)) return null;
    const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as FirebaseAppletConfig;
    if (!parsed.projectId || parsed.projectId === 'remixed-project-id') return null;
    return parsed;
  } catch {
    return null;
  }
};

export const isFirestoreActive = (): boolean => firestoreAvailable && adminDb !== null;

export async function initFirestorePersistence(
  seedEnquiries: () => StoredEnquiry[]
): Promise<boolean> {
  if (initAttempted) return firestoreAvailable;
  initAttempted = true;

  const cfg = loadFirebaseConfig();
  if (!cfg) {
    console.log('[The Art Horizon] No Firebase config found; using local JSON storage.');
    return false;
  }

  try {
    const app =
      getApps().length > 0
        ? getApps()[0]
        : initializeApp({
            projectId: cfg.projectId,
            storageBucket: cfg.storageBucket,
          });

    const db = cfg.firestoreDatabaseId
      ? getFirestore(app, cfg.firestoreDatabaseId)
      : getFirestore(app);

    // Quick connectivity + IAM credential probe (4s cap so dev sandbox never hangs)
    const probe = db.collection('enquiries').limit(1).get();
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore startup probe timed out')), 4000)
    );
    await Promise.race([probe, timeout]);

    adminDb = db;
    firestoreAvailable = true;
    console.log(
      `[The Art Horizon] Firestore persistent storage active (${cfg.projectId}/${cfg.firestoreDatabaseId || '(default)'}).`
    );

    const enqSnap = await db.collection('enquiries').limit(1).get();
    if (enqSnap.empty) {
      const enquiries = seedEnquiries();
      if (enquiries.length > 0) {
        const batch = db.batch();
        for (const enq of enquiries) {
          batch.set(db.collection('enquiries').doc(enq.id), enq);
        }
        await batch.commit();
        console.log(`[The Art Horizon] Migrated ${enquiries.length} enquiries into Firestore.`);
      }
    }
    return true;
  } catch (err: any) {
    adminDb = null;
    firestoreAvailable = false;
    console.warn(
      `[The Art Horizon] Firestore Admin unavailable in current runtime (${err?.message || 'no credentials'}); using local JSON storage.`
    );
    return false;
  }
}

export async function loadEnquiriesFromFirestore(): Promise<StoredEnquiry[]> {
  if (!adminDb || !firestoreAvailable) return [];
  const snap = await adminDb.collection('enquiries').get();
  return snap.docs
    .map((d) => d.data() as StoredEnquiry)
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
}

export async function upsertEnquiryInFirestore(enquiry: StoredEnquiry): Promise<void> {
  if (!adminDb || !firestoreAvailable) return;
  await adminDb.collection('enquiries').doc(enquiry.id).set(enquiry);
}

export async function deleteEnquiryInFirestore(id: string): Promise<void> {
  if (!adminDb || !firestoreAvailable) return;
  await adminDb.collection('enquiries').doc(id).delete();
}
