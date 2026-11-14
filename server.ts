import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '2mb' }));
app.use('/api', (req: Request, res: Response, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-studio-pin');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
});

// Persistent Enquiries Storage (Server-side JSON DB)
const ENQUIRIES_FILE = path.resolve(__dirname, 'server_enquiries.json');

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

// Studio PIN Authentication & Per-IP Rate Limiting
const ALLOWED_STUDIO_PINS = new Set(['83598', '1998', '9981883598', '99818 83598']);
const MAX_PIN_ATTEMPTS = 12;
const PIN_LOCKOUT_MS = 15 * 60 * 1000;
const pinAttemptTracker = new Map<string, { count: number; firstAttemptAt: number; lockedUntil?: number }>();

const normalizeStudioPin = (raw: string): string => {
  const trimmed = raw.trim();
  if (ALLOWED_STUDIO_PINS.has(trimmed)) return trimmed;
  const compact = trimmed.replace(/[\s-]+/g, '');
  if (ALLOWED_STUDIO_PINS.has(compact)) return compact;
  return trimmed;
};

const extractStudioPin = (req: Request): string => {
  const headerPin = req.headers['x-studio-pin'];
  if (typeof headerPin === 'string' && headerPin.trim()) {
    return headerPin.trim();
  }
  const authHeader = req.headers.authorization;
  if (typeof authHeader === 'string' && authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7).trim();
  }
  if (req.body && typeof req.body.pin === 'string' && req.body.pin.trim()) {
    return req.body.pin.trim();
  }
  return '';
};

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

  const rawPin = extractStudioPin(req);
  const normalizedPin = normalizeStudioPin(rawPin);

  if (normalizedPin && ALLOWED_STUDIO_PINS.has(normalizedPin)) {
    pinAttemptTracker.delete(clientIp);
    return true;
  }

  if (rawPin) {
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
  }

  res.status(401).json({ error: 'Unauthorized: Valid Studio PIN required.' });
  return false;
};

const getActiveEnquiries = async (): Promise<StoredEnquiry[]> => {
  return loadEnquiries();
};

// ============================================================
// ENQUIRIES ROUTES (Public Submit + PIN-Protected Management)
// ============================================================

app.get('/api/enquiries', async (req: Request, res: Response): Promise<void> => {
  if (!requireStudioAdmin(req, res)) return;
  const enquiries = await getActiveEnquiries();
  res.json({
    enquiries,
    total: enquiries.length,
    newCount: enquiries.filter((e) => e.status === 'new').length,
  });
});

app.post('/api/enquiries', async (req: Request, res: Response): Promise<void> => {
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

    const currentList = await getActiveEnquiries();
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

app.patch('/api/enquiries/:id', async (req: Request, res: Response): Promise<void> => {
  if (!requireStudioAdmin(req, res)) return;
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'contacted', 'reviewed', 'resolved'].includes(status)) {
      res.status(400).json({ error: 'Invalid status value.' });
      return;
    }

    const currentList = await getActiveEnquiries();
    const index = currentList.findIndex((e) => e.id === id);

    if (index === -1) {
      res.status(404).json({ error: 'Inquiry not found.' });
      return;
    }

    currentList[index].status = status;
    saveEnquiries(currentList);

    res.json({ success: true, enquiry: currentList[index] });
  } catch {
    res.status(500).json({ error: 'Failed to update inquiry status.' });
  }
});

app.delete('/api/enquiries/:id', async (req: Request, res: Response): Promise<void> => {
  if (!requireStudioAdmin(req, res)) return;
  try {
    const { id } = req.params;
    let currentList = await getActiveEnquiries();
    currentList = currentList.filter((e) => e.id !== id);
    saveEnquiries(currentList);
    res.json({ success: true, message: 'Inquiry deleted.' });
  } catch {
    res.status(500).json({ error: 'Failed to delete inquiry.' });
  }
});

// ============================================================
// PIN-PROTECTED STUDIO INQUIRIES PORTAL AUTH ROUTES
// ============================================================

app.post('/api/admin/verify-pin', (req: Request, res: Response): void => {
  if (!requireStudioAdmin(req, res)) return;
  res.json({ valid: true });
});

app.post('/api/admin/login', async (req: Request, res: Response): Promise<void> => {
  if (!requireStudioAdmin(req, res)) return;
  const enquiries = await getActiveEnquiries();
  res.json({ ok: true, enquiries });
});

// ============================================================
// GEMINI AI ART ADVISOR
// ============================================================

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

const SYSTEM_INSTRUCTIONS: Record<string, string> = {
  general: `You are the official AI Art Advisor for "The Art Horizon", a premier fine art studio and academy founded by master artist Vikas Gothi in Indore, Madhya Pradesh, India.
Website: https://www.thearthorizon.com | Phone/WhatsApp: +91 99818 83598 | Email: Info@thearthorizon.com
Studio Address: 266, Ganesh Villa, Usha Nagar Extension, Ranjit Hanuman Road, Indore.

Key Studio Facts you MUST uphold accurately:
1. International Online Art Classes:
   - Live interactive Zoom classes, 8 live classes per month, 3-month structured courses.
   - Small batches (Max 4–5 Students) for personalized attention.
   - English-language instruction with step-by-step guidance.
   - Three age-based programs:
     * Junior Artists: 6–8 Years
     * Young Artists: 9–11 Years
     * Senior Artists: 12–15 Years
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
  * Junior Artists: 6–8 Years
  * Young Artists: 9–11 Years
  * Senior Artists: 12–15 Years
- Small live interactive Zoom batches (Max 4–5 Students), 8 live classes per month, 3-month structured courses, English-language instruction.
- Mention that 1-on-1 private sessions are also available for dedicated individual pacing (with different fee structure).
- Help them choose according to their local timezone (USA, UK, UAE, Oman, Kuwait, or any country worldwide).`,
};

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
    persistence: 'local-json',
    modelsAvailable: ['gemini-4-hydrogen', 'gemini-3.1-flash-lite'],
  });
});

app.use('/api', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'API endpoint not found.' });
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
