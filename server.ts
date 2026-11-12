import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Persistent Enquiries Storage (Server-side JSON DB)
const ENQUIRIES_FILE = path.resolve(__dirname, 'server_enquiries.json');

interface StoredEnquiry {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  serviceCategory: string;
  serviceDetail?: string;
  countryOrCity?: string;
  timeSlotPreference?: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
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

// GET /api/enquiries - Retrieve all enquiries for Vikas Gothi / Admin
app.get('/api/enquiries', (_req: Request, res: Response) => {
  const enquiries = loadEnquiries();
  res.json({
    enquiries,
    total: enquiries.length,
    newCount: enquiries.filter((e) => e.status === 'new').length,
  });
});

// POST /api/enquiries - Submit a new inquiry / free trial booking
app.post('/api/enquiries', (req: Request, res: Response): void => {
  try {
    const {
      name,
      email = '',
      phone,
      serviceCategory = 'general',
      serviceDetail = '',
      countryOrCity = '',
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

// PATCH /api/enquiries/:id - Update status (e.g. marked as contacted or resolved)
app.patch('/api/enquiries/:id', (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'contacted', 'resolved'].includes(status)) {
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

// DELETE /api/enquiries/:id - Delete an inquiry
app.delete('/api/enquiries/:id', (req: Request, res: Response): void => {
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
1. Online Classes for International & Remote Students:
   - Live interactive 1-hour Zoom sessions, 2 classes per week.
   - For children aged 6 to 15 years old.
   - Intimate small batches: strictly max 4 to 5 students per batch for individual focus.
   - Three structured age groups:
     * 6 to 8 years (Beginner, Intermediate, Advanced)
     * 9 to 11 years (Beginner, Intermediate, Advanced)
     * 12 to 15 years (Beginner, Intermediate, Advanced)
   - One-on-one (1-on-1) private classes are also available and can be booked with tailored schedules; fee for 1-on-1 sessions is different from group batches.
   - Welcoming students from ANY country worldwide (USA, UK, UAE, Canada, Australia, Singapore, Europe, etc.).
   - Free 45-minute live demo class is available to try before enrolling.

2. In-Studio Art Classes in Indore:
   - Kids drawing & painting, teen portfolio prep, adult hobby & master classes, classical fine art diploma, portrait drawing & anatomy.
   - Visits by prior appointment at 266 Ganesh Villa, Indore.

3. Custom Commissions & Professional Art Services:
   - We create custom portraits in ALL mediums: Charcoal, Graphite, Colour Pencil, Acrylic on Canvas, Oil Painting, and Watercolor (not only charcoal!).
   - Commercial art: Large-scale wall murals (cafes, hotels, corporate), festival floor rangoli, Lippan art installations, resin art.

4. Pricing:
   - Transparent, personalized quotes provided upon request ("Contact Us for Pricing" or "Book Free Trial").

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
- For children aged 6 to 15 years old:
  * 6 to 8 years: Beginner (motor skills, basic shapes, color joy), Intermediate (proportions, blending), Advanced (textures, multi-medium compositions).
  * 9 to 11 years: Beginner (foundational sketching), Intermediate (light & shadow cast, perspective), Advanced (character realism, still life).
  * 12 to 15 years: Beginner (drawing fundamentals), Intermediate (shading gradients, anatomy introduction), Advanced (fine art realism, portfolio prep).
- Highlight that group batches have only 4 to 5 students for personal attention.
- Mention that 1-on-1 private sessions are also available for dedicated individual pacing (with different fee structure).
- Help them choose according to their local timezone (US EST/PST, UK GMT, UAE GST, etc.).`,
};

// POST /api/chat - Multi-turn conversational endpoint
app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, history, model, role = 'general' } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'A valid message string is required.' });
      return;
    }

    // Model selection mapping with strict allowed values:
    // gemini-4-carbon (deep reasoning), gemini-4-argon (complex interactive),
    // gemini-3.8-flash (general tasks - default), gemini-3.1-flash-lite (fast tasks)
    let selectedModel = 'gemini-3.8-flash';
    if (model === 'gemini-4-carbon') {
      selectedModel = 'gemini-4-carbon';
    } else if (model === 'gemini-4-argon') {
      selectedModel = 'gemini-4-argon';
    } else if (model === 'gemini-3.1-flash-lite') {
      selectedModel = 'gemini-3.1-flash-lite';
    } else if (model === 'gemini-3.8-flash') {
      selectedModel = 'gemini-3.8-flash';
    }

    const ai = getAIClient();

    // Map conversation history into Gemini format
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

    // Append the latest user message
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
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Thank you for reaching out to The Art Horizon! Feel free to connect directly via WhatsApp at +91 99818 83598 for immediate guidance.';

    res.json({
      reply,
      modelUsed: selectedModel,
    });
  } catch (error: any) {
    console.error('Gemini API Error in /api/chat:', error);
    const errorMessage = error?.message || 'Failed to process chat request.';
    res.status(500).json({
      error: errorMessage,
      reply: 'We are experiencing high interest at The Art Horizon. Please connect with Vikas Gothi directly on WhatsApp (+91 99818 83598) or book a Free Demo Class above!',
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    studio: 'The Art Horizon',
    founder: 'Vikas Gothi',
    modelsAvailable: ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-4-argon', 'gemini-4-carbon'],
  });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    // Dynamically mount Vite middlewares in development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
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
