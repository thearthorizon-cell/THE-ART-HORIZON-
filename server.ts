import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  DEFAULT_ANNOUNCEMENTS,
  DEFAULT_FOUNDER_PROFILE,
  DEFAULT_ONLINE_COURSES,
  DEFAULT_SITE_CONTENT,
} from './src/data/siteConfig.ts';
import { GALLERY_DATA } from './src/data/galleryData.ts';
import type {
  AnnouncementItem,
  CMSState,
  FounderProfileData,
  GalleryItem,
  NewsletterSubscriber,
  OnlineCourseProgram,
  SiteContentConfig,
} from './src/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// Persistent Uploaded Images Directory (served in both dev & production)
const UPLOADS_DIR = path.resolve(__dirname, 'public', 'uploads');
fs.mkdirSync(UPLOADS_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOADS_DIR));

// Persistent Enquiries Storage (Server-side JSON DB - preserved intact)
const ENQUIRIES_FILE = path.resolve(__dirname, 'server_enquiries.json');
// Persistent CMS & Newsletter Storage (Server-side JSON DB)
const CMS_FILE = path.resolve(__dirname, 'server_cms.json');

interface StoredEnquiry {
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

interface StoredCMSDatabase extends CMSState {
  subscribers: NewsletterSubscriber[];
}

const loadEnquiries = (): StoredEnquiry[] => {
  try {
    if (fs.existsSync(ENQUIRIES_FILE)) {
      const data = fs.readFileSync(ENQUIRIES_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to load enquiries from file:', err);
  }
  return [];
};

const saveEnquiries = (enquiries: StoredEnquiry[]): void => {
  try {
    fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(enquiries, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write enquiries to file:', err);
  }
};

const getDefaultCMSDatabase = (): StoredCMSDatabase => ({
  founder: { ...DEFAULT_FOUNDER_PROFILE },
  announcements: [...DEFAULT_ANNOUNCEMENTS],
  onlineCourses: [...DEFAULT_ONLINE_COURSES],
  galleryPhotos: [...GALLERY_DATA],
  siteContent: { ...DEFAULT_SITE_CONTENT },
  subscribers: [],
});

const loadCMSDatabase = (): StoredCMSDatabase => {
  const defaults = getDefaultCMSDatabase();
  try {
    if (fs.existsSync(CMS_FILE)) {
      const raw = fs.readFileSync(CMS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);

      let hydrated = false;
      const mergedCourses: OnlineCourseProgram[] =
        Array.isArray(parsed.onlineCourses) && parsed.onlineCourses.length > 0
          ? parsed.onlineCourses.map((existing: OnlineCourseProgram) => {
              const defMatch = defaults.onlineCourses.find(
                (d) => d.id === existing.id || d.slug === existing.slug
              );
              if (
                defMatch &&
                existing.curriculumPendingPdf &&
                (!existing.curriculumModules || existing.curriculumModules.length === 0)
              ) {
                hydrated = true;
                return {
                  ...existing,
                  overview: defMatch.overview,
                  duration: defMatch.duration,
                  classFormat: defMatch.classFormat,
                  scheduleSummary: defMatch.scheduleSummary,
                  whatChildrenLearn: defMatch.whatChildrenLearn,
                  curriculumModules: defMatch.curriculumModules,
                  techniques: defMatch.techniques,
                  skillsDeveloped: defMatch.skillsDeveloped,
                  learningOutcomes: defMatch.learningOutcomes,
                  benefits: defMatch.benefits,
                  curriculumPdfUrl: defMatch.curriculumPdfUrl,
                  curriculumPendingPdf: false,
                };
              }
              return {
                ...existing,
                curriculumPdfUrl: existing.curriculumPdfUrl || defMatch?.curriculumPdfUrl,
              };
            })
          : defaults.onlineCourses;

      const dbObj: StoredCMSDatabase = {
        founder: { ...defaults.founder, ...(parsed.founder || {}) },
        announcements: Array.isArray(parsed.announcements) ? parsed.announcements : defaults.announcements,
        onlineCourses: mergedCourses,
        galleryPhotos:
          Array.isArray(parsed.galleryPhotos) && parsed.galleryPhotos.length > 0
            ? parsed.galleryPhotos
            : defaults.galleryPhotos,
        siteContent: { ...defaults.siteContent, ...(parsed.siteContent || {}) },
        subscribers: Array.isArray(parsed.subscribers) ? parsed.subscribers : [],
      };
      if (hydrated) {
        saveCMSDatabase(dbObj);
      }
      return dbObj;
    }
  } catch (err) {
    console.error('Failed to load CMS DB from file, using defaults:', err);
  }
  saveCMSDatabase(defaults);
  return defaults;
};

const saveCMSDatabase = (db: StoredCMSDatabase): void => {
  try {
    fs.writeFileSync(CMS_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write CMS DB to file:', err);
  }
};

// Studio PIN Authentication & Per-IP Rate Limiting
const ALLOWED_STUDIO_PINS = new Set(['83598', '1998', '9981883598', '99818 83598']);
const MAX_PIN_ATTEMPTS = 5;
const PIN_LOCKOUT_MS = 15 * 60 * 1000;
const pinAttemptTracker = new Map<string, { count: number; firstAttemptAt: number; lockedUntil?: number }>();

const getClientIp = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || 'unknown';
};

const requireStudioAdmin = (req: Request, res: Response): boolean => {
  const clientIp = getClientIp(req);
  const now = Date.now();
  const record = pinAttemptTracker.get(clientIp);

  if (record?.lockedUntil && record.lockedUntil > now) {
    const minsLeft = Math.ceil((record.lockedUntil - now) / 60000);
    res.status(429).json({
      error: `Too many invalid Studio PIN attempts. Please wait ${minsLeft} minute(s) before trying again.`,
    });
    return false;
  }

  const pinHeader = String(req.headers['x-studio-pin'] || (req.body && req.body.pin) || '').trim();

  if (ALLOWED_STUDIO_PINS.has(pinHeader)) {
    pinAttemptTracker.delete(clientIp);
    return true;
  }

  // Record failed PIN attempt only when an actual PIN was provided (or even empty unauthorized access)
  const freshWindow = !record || now - record.firstAttemptAt > PIN_LOCKOUT_MS;
  const nextCount = freshWindow ? 1 : record.count + 1;
  const nextRecord: { count: number; firstAttemptAt: number; lockedUntil?: number } = {
    count: nextCount,
    firstAttemptAt: freshWindow ? now : record.firstAttemptAt,
  };
  if (nextCount >= MAX_PIN_ATTEMPTS) {
    nextRecord.lockedUntil = now + PIN_LOCKOUT_MS;
  }
  pinAttemptTracker.set(clientIp, nextRecord);

  if (nextRecord.lockedUntil) {
    res.status(429).json({
      error: 'Too many invalid Studio PIN attempts. Access temporarily locked for 15 minutes.',
    });
    return false;
  }

  res.status(401).json({ error: 'Unauthorized: Valid Studio PIN required.' });
  return false;
};

// ============================================================
// PUBLIC CMS & NEWSLETTER ROUTES (Zero Private Data Exposed)
// ============================================================

const getTodayIsoDate = (): string => new Date().toISOString().slice(0, 10);

app.get('/api/cms', (_req: Request, res: Response): void => {
  const db = loadCMSDatabase();
  const today = getTodayIsoDate();

  const publicAnnouncements = [...db.announcements]
    .filter((item) => {
      if (item.status === 'draft') return false;
      const pubDate = (item.publishedAt || '').slice(0, 10);
      if (item.status === 'scheduled' && pubDate && pubDate > today) return false;
      if (item.expiresAt && item.expiresAt.trim() && item.expiresAt.slice(0, 10) < today) return false;
      return true;
    })
    .sort((a, b) => (b.publishedAt || b.createdAt).localeCompare(a.publishedAt || a.createdAt));

  const publicCourses = db.onlineCourses.filter((c) => c.visible !== false);

  res.json({
    founder: db.founder,
    announcements: publicAnnouncements,
    onlineCourses: publicCourses,
    galleryPhotos: db.galleryPhotos,
    siteContent: db.siteContent,
  });
});

app.post('/api/newsletter/subscribe', (req: Request, res: Response): void => {
  try {
    const emailRaw = String(req.body?.email || '').trim().toLowerCase();
    const nameRaw = String(req.body?.name || '').trim();
    const consent = Boolean(req.body?.consent);
    const source = String(req.body?.source || 'newsletter-page').trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(emailRaw)) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    if (!consent) {
      res.status(400).json({ error: 'Please confirm subscription consent to join the newsletter.' });
      return;
    }

    const db = loadCMSDatabase();
    const existing = db.subscribers.find((s) => s.email.toLowerCase() === emailRaw);
    if (existing) {
      res.json({
        success: true,
        alreadySubscribed: true,
        message: 'This email address is already subscribed to The Art Horizon announcements.',
      });
      return;
    }

    const newSub: NewsletterSubscriber = {
      id: 'sub-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      email: emailRaw,
      name: nameRaw || undefined,
      consent: true,
      subscribedAt: new Date().toISOString(),
      source,
    };

    db.subscribers.unshift(newSub);
    saveCMSDatabase(db);

    res.status(201).json({
      success: true,
      alreadySubscribed: false,
      message: 'Thank you for subscribing! You will receive upcoming workshop and academy updates.',
    });
  } catch (err) {
    console.error('Newsletter subscribe error:', err);
    res.status(500).json({ error: 'Could not save subscription right now.' });
  }
});

// ============================================================
// ENQUIRIES ROUTES (Public Submit + PIN-Protected Management)
// ============================================================

// GET /api/enquiries - Retrieve all enquiries for Vikas Gothi / Admin (PIN protected)
app.get('/api/enquiries', (req: Request, res: Response): void => {
  if (!requireStudioAdmin(req, res)) return;
  const enquiries = loadEnquiries();
  res.json({
    enquiries,
    total: enquiries.length,
    newCount: enquiries.filter((e) => e.status === 'new').length,
  });
});

// POST /api/enquiries - Submit a new inquiry / free trial booking (public form submission)
app.post('/api/enquiries', (req: Request, res: Response): void => {
  try {
    const {
      name,
      email = '',
      phone,
      serviceCategory = 'general',
      serviceDetail = '',
      countryOrCity = '',
      studentAge = '',
      timeSlotPreference = '',
      message = '',
    } = req.body;

    if (!name || !phone) {
      res.status(400).json({ error: 'Name and contact phone are required.' });
      return;
    }

    const currentList = loadEnquiries();
    const newEnquiry: StoredEnquiry = {
      id: 'enq-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      serviceCategory: String(serviceCategory),
      serviceDetail: String(serviceDetail),
      countryOrCity: String(countryOrCity),
      studentAge: String(studentAge).trim() || undefined,
      timeSlotPreference: String(timeSlotPreference),
      message: String(message).trim(),
      status: 'new',
    };

    currentList.unshift(newEnquiry);
    saveEnquiries(currentList);

    console.log(`[The Art Horizon] New Inquiry Saved: ${newEnquiry.name} (${newEnquiry.phone}) - ${newEnquiry.serviceDetail}`);

    res.status(201).json({
      success: true,
      enquiry: newEnquiry,
      message: 'Inquiry saved successfully on server.',
    });
  } catch (error: any) {
    console.error('Failed to save enquiry:', error);
    res.status(500).json({ error: 'Failed to record inquiry on server.' });
  }
});

// PATCH /api/enquiries/:id - Update status (PIN protected)
app.patch('/api/enquiries/:id', (req: Request, res: Response): void => {
  if (!requireStudioAdmin(req, res)) return;
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'contacted', 'reviewed', 'resolved'].includes(status)) {
      res.status(400).json({ error: 'Invalid status value.' });
      return;
    }

    const currentList = loadEnquiries();
    const index = currentList.findIndex((e) => e.id === id);

    if (index === -1) {
      res.status(404).json({ error: 'Inquiry not found.' });
      return;
    }

    currentList[index].status = status;
    saveEnquiries(currentList);

    res.json({ success: true, enquiry: currentList[index] });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update inquiry status.' });
  }
});

// DELETE /api/enquiries/:id - Delete an inquiry (PIN protected)
app.delete('/api/enquiries/:id', (req: Request, res: Response): void => {
  if (!requireStudioAdmin(req, res)) return;
  try {
    const { id } = req.params;
    let currentList = loadEnquiries();
    currentList = currentList.filter((e) => e.id !== id);
    saveEnquiries(currentList);
    res.json({ success: true, message: 'Inquiry deleted.' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete inquiry.' });
  }
});

// ============================================================
// PIN-PROTECTED STUDIO ADMIN CMS & MEDIA UPLOAD ROUTES
// ============================================================

app.post('/api/admin/verify-pin', (req: Request, res: Response): void => {
  if (!requireStudioAdmin(req, res)) return;
  res.json({ valid: true });
});

app.get('/api/admin/dashboard', (req: Request, res: Response): void => {
  if (!requireStudioAdmin(req, res)) return;
  const db = loadCMSDatabase();
  const enquiries = loadEnquiries();

  res.json({
    founder: db.founder,
    announcements: [...db.announcements].sort((a, b) =>
      (b.publishedAt || b.createdAt).localeCompare(a.publishedAt || a.createdAt)
    ),
    onlineCourses: db.onlineCourses,
    galleryPhotos: db.galleryPhotos,
    siteContent: db.siteContent,
    subscribers: db.subscribers,
    stats: {
      totalEnquiries: enquiries.length,
      newEnquiries: enquiries.filter((e) => e.status === 'new').length,
      totalSubscribers: db.subscribers.length,
      publishedAnnouncements: db.announcements.filter((a) => a.status === 'published').length,
      visibleOnlineCourses: db.onlineCourses.filter((c) => c.visible !== false).length,
      totalGalleryPhotos: db.galleryPhotos.length,
    },
  });
});

// Upload image file (validated MIME type + max 8MB binary) into public/uploads/
app.post('/api/admin/upload', (req: Request, res: Response): void => {
  if (!requireStudioAdmin(req, res)) return;
  try {
    const dataUrl = String(req.body?.dataUrl || '');
    const originalName = String(req.body?.fileName || 'studio-photo');

    const match = dataUrl.match(/^data:image\/(jpeg|jpg|png|webp);base64,([A-Za-z0-9+/=\s]+)$/i);
    if (!match) {
      res.status(400).json({
        error: 'Invalid image format. Please upload a valid JPG, PNG, or WebP photograph.',
      });
      return;
    }

    const rawExt = match[1].toLowerCase();
    const ext = rawExt === 'jpeg' ? 'jpg' : rawExt;
    const base64Data = match[2].replace(/\s+/g, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const maxBytes = 8 * 1024 * 1024;
    if (buffer.length === 0 || buffer.length > maxBytes) {
      res.status(400).json({ error: 'Image file size must be between 1KB and 8MB.' });
      return;
    }

    const safeStem =
      originalName
        .replace(/\.[^/.]+$/, '')
        .toLowerCase()
        .replace(/[^a-z0-9-_]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40) || 'artwork';

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${safeStem}.${ext}`;
    const destPath = path.resolve(UPLOADS_DIR, fileName);
    fs.writeFileSync(destPath, buffer);

    res.status(201).json({
      success: true,
      url: `/uploads/${fileName}`,
      sizeBytes: buffer.length,
    });
  } catch (err) {
    console.error('Admin image upload failed:', err);
    res.status(500).json({ error: 'Failed to store uploaded image on server.' });
  }
});

// Update Founder Profile & Portrait Image
app.put('/api/admin/founder', (req: Request, res: Response): void => {
  if (!requireStudioAdmin(req, res)) return;
  try {
    const db = loadCMSDatabase();
    const body = req.body as Partial<FounderProfileData>;
    db.founder = {
      name: String(body.name ?? db.founder.name).trim() || db.founder.name,
      title: String(body.title ?? db.founder.title).trim() || db.founder.title,
      portraitImage: String(body.portraitImage ?? db.founder.portraitImage).trim() || db.founder.portraitImage,
      quote: String(body.quote ?? db.founder.quote).trim(),
      bioParagraph1: String(body.bioParagraph1 ?? db.founder.bioParagraph1).trim(),
      bioParagraph2: String(body.bioParagraph2 ?? db.founder.bioParagraph2).trim(),
    };
    saveCMSDatabase(db);
    res.json({ success: true, founder: db.founder });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update founder profile.' });
  }
});

// Update Website Content
app.put('/api/admin/site-content', (req: Request, res: Response): void => {
  if (!requireStudioAdmin(req, res)) return;
  try {
    const db = loadCMSDatabase();
    const body = req.body as Partial<SiteContentConfig>;
    db.siteContent = {
      ...db.siteContent,
      promoBannerText: String(body.promoBannerText ?? db.siteContent.promoBannerText).trim(),
      promoBannerEnabled:
        typeof body.promoBannerEnabled === 'boolean'
          ? body.promoBannerEnabled
          : db.siteContent.promoBannerEnabled,
      homeHeroHeadline: String(body.homeHeroHeadline ?? db.siteContent.homeHeroHeadline).trim(),
      homeHeroSubtext: String(body.homeHeroSubtext ?? db.siteContent.homeHeroSubtext).trim(),
      homeHeroPrimaryCta: String(body.homeHeroPrimaryCta ?? db.siteContent.homeHeroPrimaryCta).trim(),
      homeHeroSecondaryCta: String(body.homeHeroSecondaryCta ?? db.siteContent.homeHeroSecondaryCta).trim(),
      onlineHeroHeading: String(body.onlineHeroHeading ?? db.siteContent.onlineHeroHeading).trim(),
      onlineHeroSubtext: String(body.onlineHeroSubtext ?? db.siteContent.onlineHeroSubtext).trim(),
      onlineHeroPrimaryCta: String(body.onlineHeroPrimaryCta ?? db.siteContent.onlineHeroPrimaryCta).trim(),
      onlineHeroSecondaryCta:
        String(body.onlineHeroSecondaryCta ?? db.siteContent.onlineHeroSecondaryCta).trim(),
      newsletterHeading: String(body.newsletterHeading ?? db.siteContent.newsletterHeading).trim(),
      newsletterSubheading: String(body.newsletterSubheading ?? db.siteContent.newsletterSubheading).trim(),
    };
    saveCMSDatabase(db);
    res.json({ success: true, siteContent: db.siteContent });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update site content.' });
  }
});

// Announcements CRUD
app.post('/api/admin/announcements', (req: Request, res: Response): void => {
  if (!requireStudioAdmin(req, res)) return;
  try {
    const body = req.body;
    if (!body?.title || !body?.shortDescription) {
      res.status(400).json({ error: 'Title and short description are required.' });
      return;
    }

    const nowIso = new Date().toISOString();
    const newItem: AnnouncementItem = {
      id: 'ann-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      title: String(body.title).trim(),
      category: body.category || 'Announcement',
      featuredImage: String(body.featuredImage || DEFAULT_FOUNDER_PROFILE.portraitImage).trim(),
      shortDescription: String(body.shortDescription).trim(),
      fullDescription: String(body.fullDescription || body.shortDescription).trim(),
      publishedAt: String(body.publishedAt || nowIso.slice(0, 10)).trim(),
      expiresAt: body.expiresAt ? String(body.expiresAt).trim() : undefined,
      ctaLabel: body.ctaLabel ? String(body.ctaLabel).trim() : undefined,
      ctaUrl: body.ctaUrl ? String(body.ctaUrl).trim() : undefined,
      status: ['published', 'draft', 'scheduled'].includes(body.status) ? body.status : 'published',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const db = loadCMSDatabase();
    db.announcements.unshift(newItem);
    saveCMSDatabase(db);
    res.status(201).json({ success: true, announcement: newItem });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create announcement.' });
  }
});

app.put('/api/admin/announcements/:id', (req: Request, res: Response): void => {
  if (!requireStudioAdmin(req, res)) return;
  try {
    const { id } = req.params;
    const db = loadCMSDatabase();
    const index = db.announcements.findIndex((a) => a.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Announcement not found.' });
      return;
    }

    const prev = db.announcements[index];
    const body = req.body;
    const updated: AnnouncementItem = {
      ...prev,
      title: body.title !== undefined ? String(body.title).trim() : prev.title,
      category: body.category ?? prev.category,
      featuredImage: body.featuredImage !== undefined ? String(body.featuredImage).trim() : prev.featuredImage,
      shortDescription:
        body.shortDescription !== undefined ? String(body.shortDescription).trim() : prev.shortDescription,
      fullDescription:
        body.fullDescription !== undefined ? String(body.fullDescription).trim() : prev.fullDescription,
      publishedAt: body.publishedAt !== undefined ? String(body.publishedAt).trim() : prev.publishedAt,
      expiresAt: body.expiresAt ? String(body.expiresAt).trim() : undefined,
      ctaLabel: body.ctaLabel ? String(body.ctaLabel).trim() : undefined,
      ctaUrl: body.ctaUrl ? String(body.ctaUrl).trim() : undefined,
      status: ['published', 'draft', 'scheduled'].includes(body.status) ? body.status : prev.status,
      updatedAt: new Date().toISOString(),
    };

    db.announcements[index] = updated;
    saveCMSDatabase(db);
    res.json({ success: true, announcement: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update announcement.' });
  }
});

app.delete('/api/admin/announcements/:id', (req: Request, res: Response): void => {
  if (!requireStudioAdmin(req, res)) return;
  try {
    const { id } = req.params;
    const db = loadCMSDatabase();
    db.announcements = db.announcements.filter((a) => a.id !== id);
    saveCMSDatabase(db);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete announcement.' });
  }
});

// Delete Newsletter Subscriber
app.delete('/api/admin/subscribers/:id', (req: Request, res: Response): void => {
  if (!requireStudioAdmin(req, res)) return;
  try {
    const { id } = req.params;
    const db = loadCMSDatabase();
    db.subscribers = db.subscribers.filter((s) => s.id !== id);
    saveCMSDatabase(db);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove subscriber.' });
  }
});

// Gallery Photos CRUD
app.post('/api/admin/gallery', (req: Request, res: Response): void => {
  if (!requireStudioAdmin(req, res)) return;
  try {
    const body = req.body;
    if (!body?.title || !body?.image) {
      res.status(400).json({ error: 'Artwork title and image are required.' });
      return;
    }

    const newItem: GalleryItem = {
      id: 'g-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      title: String(body.title).trim(),
      category: ['portraits', 'murals', 'rangoli', 'student-work', 'fine-art'].includes(body.category)
        ? body.category
        : 'student-work',
      medium: String(body.medium || 'Fine Art Medium').trim(),
      dimensions: body.dimensions ? String(body.dimensions).trim() : undefined,
      year: body.year ? String(body.year).trim() : undefined,
      artist: String(body.artist || 'The Art Horizon').trim(),
      description: String(body.description || '').trim(),
      image: String(body.image).trim(),
    };

    const db = loadCMSDatabase();
    db.galleryPhotos.unshift(newItem);
    saveCMSDatabase(db);
    res.status(201).json({ success: true, item: newItem });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add gallery photo.' });
  }
});

app.put('/api/admin/gallery/:id', (req: Request, res: Response): void => {
  if (!requireStudioAdmin(req, res)) return;
  try {
    const { id } = req.params;
    const db = loadCMSDatabase();
    const idx = db.galleryPhotos.findIndex((g) => g.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Gallery photo not found.' });
      return;
    }

    const prev = db.galleryPhotos[idx];
    const body = req.body;
    const updated: GalleryItem = {
      ...prev,
      title: body.title !== undefined ? String(body.title).trim() : prev.title,
      category: ['portraits', 'murals', 'rangoli', 'student-work', 'fine-art'].includes(body.category)
        ? body.category
        : prev.category,
      medium: body.medium !== undefined ? String(body.medium).trim() : prev.medium,
      dimensions: body.dimensions !== undefined ? String(body.dimensions).trim() || undefined : prev.dimensions,
      year: body.year !== undefined ? String(body.year).trim() || undefined : prev.year,
      artist: body.artist !== undefined ? String(body.artist).trim() : prev.artist,
      description: body.description !== undefined ? String(body.description).trim() : prev.description,
      image: body.image !== undefined ? String(body.image).trim() : prev.image,
    };

    db.galleryPhotos[idx] = updated;
    saveCMSDatabase(db);
    res.json({ success: true, item: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update gallery photo.' });
  }
});

app.delete('/api/admin/gallery/:id', (req: Request, res: Response): void => {
  if (!requireStudioAdmin(req, res)) return;
  try {
    const { id } = req.params;
    const db = loadCMSDatabase();
    db.galleryPhotos = db.galleryPhotos.filter((g) => g.id !== id);
    saveCMSDatabase(db);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete gallery photo.' });
  }
});

// Online Course Programs Update
app.put('/api/admin/courses/:id', (req: Request, res: Response): void => {
  if (!requireStudioAdmin(req, res)) return;
  try {
    const { id } = req.params;
    const db = loadCMSDatabase();
    const idx = db.onlineCourses.findIndex((c) => c.id === id || c.slug === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Online course program not found.' });
      return;
    }

    const prev = db.onlineCourses[idx];
    const body = req.body as Partial<OnlineCourseProgram>;
    const updated: OnlineCourseProgram = {
      ...prev,
      title: body.title !== undefined ? String(body.title).trim() : prev.title,
      ageGroup: body.ageGroup !== undefined ? String(body.ageGroup).trim() : prev.ageGroup,
      badge: body.badge !== undefined ? String(body.badge).trim() : prev.badge,
      heroImage: body.heroImage !== undefined ? String(body.heroImage).trim() : prev.heroImage,
      referenceImages: Array.isArray(body.referenceImages) ? body.referenceImages : prev.referenceImages,
      overview: body.overview !== undefined ? String(body.overview).trim() : prev.overview,
      duration: body.duration !== undefined ? String(body.duration).trim() : prev.duration,
      classFormat: body.classFormat !== undefined ? String(body.classFormat).trim() : prev.classFormat,
      scheduleSummary: body.scheduleSummary !== undefined ? String(body.scheduleSummary).trim() : prev.scheduleSummary,
      language: body.language !== undefined ? String(body.language).trim() : prev.language,
      whatChildrenLearn: Array.isArray(body.whatChildrenLearn) ? body.whatChildrenLearn : prev.whatChildrenLearn,
      curriculumModules: Array.isArray(body.curriculumModules) ? body.curriculumModules : prev.curriculumModules,
      techniques: Array.isArray(body.techniques) ? body.techniques : prev.techniques,
      skillsDeveloped: Array.isArray(body.skillsDeveloped) ? body.skillsDeveloped : prev.skillsDeveloped,
      learningOutcomes: Array.isArray(body.learningOutcomes) ? body.learningOutcomes : prev.learningOutcomes,
      benefits: Array.isArray(body.benefits) ? body.benefits : prev.benefits,
      curriculumPdfUrl:
        body.curriculumPdfUrl !== undefined ? String(body.curriculumPdfUrl).trim() || undefined : prev.curriculumPdfUrl,
      curriculumPendingPdf:
        typeof body.curriculumPendingPdf === 'boolean' ? body.curriculumPendingPdf : prev.curriculumPendingPdf,
      visible: typeof body.visible === 'boolean' ? body.visible : prev.visible,
      updatedAt: new Date().toISOString(),
    };

    db.onlineCourses[idx] = updated;
    saveCMSDatabase(db);
    res.json({ success: true, course: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update online course.' });
  }
});

// Initialize GoogleGenAI server-side with standard API key and telemetry header
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured on the server.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
  });
};

// System instructions tailored for The Art Horizon
const SYSTEM_INSTRUCTIONS: Record<string, string> = {
  general: `You are the official AI Art Advisor for "The Art Horizon", a premier fine art studio and academy founded by master artist Vikas Gothi in Indore, Madhya Pradesh, India.
Website: https://thearthorizon.com | Phone/WhatsApp: +91 99818 83598 | Email: Info@thearthorizon.com
Studio Address: 266, Ganesh Villa, Usha Nagar Extension, Ranjit Hanuman Road, Indore.

Key Studio Facts you MUST uphold accurately:
1. International Online Art Classes:
   - Live interactive Zoom classes, 8 live classes per month, 3-month structured courses.
   - Small batches of 4 to 6 students for personalized attention.
   - English-language instruction with step-by-step guidance.
   - Three age-based programs:
     * Junior Artist Program (Age: 6–8 Years)
     * Young Artist Program (Age: 9–11 Years)
     * Senior Artist Program (Age: 12–15 Years)
   - One-on-one (1-on-1) private classes are also available and can be booked with tailored schedules; fee for 1-on-1 sessions is different from group batches.
   - Welcoming students from ANY country worldwide (USA, UK, UAE, Oman, Kuwait, Canada, Australia, Singapore, Europe, etc.).
   - Free demo class is available to try before enrolling.

2. In-Studio Art Classes in Indore:
   - Kids drawing & painting, teen portfolio prep, adult hobby & master classes, classical fine art diploma, portrait drawing & anatomy.
   - Visits by prior appointment at 266 Ganesh Villa, Indore.

3. Custom Commissions & Professional Art Services:
   - We create custom portraits in ALL mediums: Charcoal, Graphite, Colour Pencil, Acrylic on Canvas, Oil Painting, and Watercolor.
   - Commercial art: Large-scale wall murals (cafes, hotels, corporate), festival floor rangoli, Lippan art installations, resin art.

4. Pricing:
   - Transparent, personalized quotes provided upon request ("Contact Us for Pricing" or "Book Free Demo").

Provide warm, inspiring, artistic, concise, and helpful answers. Format your response cleanly with bullet points when listing details. Encourage users to book a free demo or contact via WhatsApp.`,

  critique: `You are a Classical Fine Art Mentor and Technique Critic representing Vikas Gothi's The Art Horizon atelier.
You have deep expertise in academic realism, Loomis/Reilly portrait construction, anatomical landmarks, chiaroscuro shading, color mixing (acrylics, oils, watercolors), and observational drawing.
When students ask about technique, guide them with actionable advice:
- Explain pencil pressure, grip, and value scales (2B to 8B graphite/nitram charcoal).
- Discuss edge control (sharp, firm, soft, lost edges).
- Clarify anatomical proportions and sighting techniques.
- Offer warm encouragement while upholding high standards of atelier craftsmanship.`,

  placement: `You are an Admissions & Batch Placement Specialist for The Art Horizon's Online Art Academy.
Your role is to help parents and students choose the perfect class:
- Three structured programs for children aged 6 to 15 years old:
  * Junior Artist Program (Age: 6–8 Years)
  * Young Artist Program (Age: 9–11 Years)
  * Senior Artist Program (Age: 12–15 Years)
- Small live interactive Zoom batches of 4 to 6 students, 8 live classes per month, 3-month structured courses, English-language instruction.
- Mention that 1-on-1 private sessions are also available for dedicated individual pacing (with different fee structure).
- Help them choose according to their local timezone (USA, UK, UAE, Oman, Kuwait, or any country worldwide).`,
};

// POST /api/chat - Multi-turn conversational endpoint
app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, history, model, role = 'general' } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'A valid message string is required.' });
      return;
    }

    let selectedModel = 'gemini-4-hydrogen';
    if (model === 'gemini-3.1-flash-lite') {
      selectedModel = 'gemini-3.1-flash-lite';
    } else if (model === 'gemini-4-hydrogen' || model === 'gemini-3.8-flash') {
      selectedModel = 'gemini-4-hydrogen';
    }

    const ai = getAIClient();

    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const item of history) {
        if (item && item.role && item.text) {
          contents.push({
            role: item.role === 'model' || item.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: String(item.text) }],
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const systemInstruction = SYSTEM_INSTRUCTIONS[role] || SYSTEM_INSTRUCTIONS.general;

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction,
      },
    });

    const reply =
      response.text ||
      'Thank you for reaching out to The Art Horizon! Feel free to connect directly via WhatsApp at +91 99818 83598 for immediate guidance.';

    res.json({
      reply,
      modelUsed: selectedModel,
    });
  } catch (error: any) {
    console.error('Gemini API Error in /api/chat:', error);
    const errorMessage = error?.message || 'Failed to process chat request.';
    res.status(500).json({
      error: errorMessage,
      reply:
        'We are experiencing high interest at The Art Horizon. Please connect with Vikas Gothi directly on WhatsApp (+91 99818 83598) or book a Free Demo Class above!',
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    studio: 'The Art Horizon',
    founder: 'Vikas Gothi',
    modelsAvailable: ['gemini-4-hydrogen', 'gemini-3.1-flash-lite'],
  });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[The Art Horizon] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[The Art Horizon] Failed to start server:', err);
  process.exit(1);
});
