// Cloudflare Worker + Static Assets Entry Point for The Art Horizon
// Handles /api/* routes (Inquiries with Cloudflare KV + PIN auth + AI chat)
// and serves SPA static assets from ./dist via env.ASSETS.

export interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

export interface AssetsFetcher {
  fetch(request: Request | string): Promise<Response>;
}

export interface WorkerEnv {
  ASSETS?: AssetsFetcher;
  STUDIO_KV?: KVNamespace;
  GEMINI_API_KEY?: string;
}

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

const ALLOWED_STUDIO_PINS = new Set(['83598', '1998', '9981883598', '99818 83598']);
const ENQUIRIES_KV_KEY = 'enquiries';

const SYSTEM_INSTRUCTIONS: Record<string, string> = {
  general: `You are the official AI Art Advisor for "The Art Horizon", a premier fine art studio and academy founded by master artist Vikas Gothi in Indore, Madhya Pradesh, India.
Website: https://www.thearthorizon.com | Phone/WhatsApp: +91 99818 83598 | Email: Info@thearthorizon.com
Studio Address: 266, Ganesh Villa, Usha Nagar Extension, Ranjit Hanuman Road, Indore.

Key Studio Facts:
1. International Online Art Classes:
   - Live interactive Zoom classes, 8 live classes per month, 3-month structured courses.
   - Small batches of 4 to 6 students for personalized attention.
   - English-language instruction with step-by-step guidance.
   - Three age-based programs:
     * Junior Artist Program (Age: 6–8 Years)
     * Young Artist Program (Age: 9–11 Years)
     * Senior Artist Program (Age: 12–15 Years)
   - One-on-one (1-on-1) private classes are also available.
   - Welcoming students from USA, UK, UAE, Oman, Kuwait, Canada, Australia, Singapore, Europe, and worldwide.
   - Free demo class is available before enrolling.
2. In-Studio Art Classes in Indore:
   - Kids drawing & painting, teen portfolio prep, adult hobby & master classes, classical fine art diploma, portrait drawing & anatomy.
3. Custom Commissions & Professional Art Services:
   - Custom portraits in Charcoal, Graphite, Colour Pencil, Acrylic on Canvas, Oil Painting, and Watercolor.
   - Commercial art: Large-scale wall murals, festival floor rangoli, Lippan art, resin art.
Provide warm, inspiring, concise, helpful answers and encourage users to book a Free Demo or contact via WhatsApp (+91 99818 83598).`,

  critique: `You are a Classical Fine Art Mentor and Technique Critic representing Vikas Gothi's The Art Horizon atelier.
Guide students with actionable advice on academic realism, portrait proportions, chiaroscuro shading, pencil pressure (2B to 8B graphite/charcoal), edge control, and color mixing with warm encouragement.`,

  placement: `You are an Admissions & Batch Placement Specialist for The Art Horizon's Online Art Academy.
Help parents and students choose between:
- Junior Artist Program (Age: 6–8 Years)
- Young Artist Program (Age: 9–11 Years)
- Senior Artist Program (Age: 12–15 Years)
- 1-on-1 private mentorship or In-Studio Indore classes.
Explain batches of 4 to 6 students, 8 live Zoom classes/month, and flexible international timezones (USA, UK, UAE, Oman, Kuwait).`,
};

function buildCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('origin');
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-studio-pin',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  };
  if (origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Vary'] = 'Origin';
    headers['Access-Control-Allow-Credentials'] = 'true';
  } else {
    headers['Access-Control-Allow-Origin'] = '*';
  }
  return headers;
}

function jsonResponse(request: Request, data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...buildCorsHeaders(request),
    },
  });
}

function normalizeStudioPin(raw: string): string {
  const trimmed = raw.trim();
  if (ALLOWED_STUDIO_PINS.has(trimmed)) return trimmed;
  const compact = trimmed.replace(/[\s-]+/g, '');
  if (ALLOWED_STUDIO_PINS.has(compact)) return compact;
  return trimmed;
}

function extractStudioPin(request: Request, body?: Record<string, unknown> | null): string {
  const headerPin = request.headers.get('x-studio-pin');
  if (headerPin && headerPin.trim()) return headerPin.trim();
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7).trim();
  }
  if (body && typeof body.pin === 'string' && body.pin.trim()) {
    return body.pin.trim();
  }
  return '';
}

function isPinAuthorized(request: Request, body?: Record<string, unknown> | null): boolean {
  const rawPin = extractStudioPin(request, body);
  const normalized = normalizeStudioPin(rawPin);
  return Boolean(normalized && ALLOWED_STUDIO_PINS.has(normalized));
}

async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const text = await request.text();
    if (!text.trim()) return {};
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

async function loadEnquiriesFromKV(kv: KVNamespace): Promise<StoredEnquiry[]> {
  try {
    const raw = await kv.get(ENQUIRIES_KV_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredEnquiry[]) : [];
  } catch {
    return [];
  }
}

async function saveEnquiriesToKV(kv: KVNamespace, list: StoredEnquiry[]): Promise<void> {
  await kv.put(ENQUIRIES_KV_KEY, JSON.stringify(list));
}

export async function handleApiRequest(request: Request, env: WorkerEnv): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: buildCorsHeaders(request),
    });
  }

  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/+$/, '') || '/';
  const kv = env?.STUDIO_KV;

  // GET /api/health
  if (pathname === '/api/health' && request.method === 'GET') {
    return jsonResponse(request, {
      status: 'ok',
      studio: 'The Art Horizon',
      founder: 'Vikas Gothi',
      persistence: kv ? 'cloudflare-kv' : 'browser-fallback',
    });
  }

  // POST /api/admin/verify-pin
  if (pathname === '/api/admin/verify-pin' && request.method === 'POST') {
    const body = await readJsonBody(request);
    if (!isPinAuthorized(request, body)) {
      return jsonResponse(request, { error: 'Unauthorized: Valid Studio PIN required.' }, 401);
    }
    return jsonResponse(request, { valid: true });
  }

  // POST /api/admin/login
  if (pathname === '/api/admin/login' && request.method === 'POST') {
    const body = await readJsonBody(request);
    if (!isPinAuthorized(request, body)) {
      return jsonResponse(request, { error: 'Unauthorized: Valid Studio PIN required.' }, 401);
    }
    if (!kv) {
      return jsonResponse(request, {
        ok: true,
        mode: 'browser-fallback',
        enquiries: [],
      });
    }
    const enquiries = await loadEnquiriesFromKV(kv);
    return jsonResponse(request, {
      ok: true,
      mode: 'kv',
      enquiries,
    });
  }

  // GET /api/enquiries
  if (pathname === '/api/enquiries' && request.method === 'GET') {
    if (!isPinAuthorized(request)) {
      return jsonResponse(request, { error: 'Unauthorized: Valid Studio PIN required.' }, 401);
    }
    if (!kv) {
      return jsonResponse(request, {
        enquiries: [],
        total: 0,
        newCount: 0,
        mode: 'browser-fallback',
      });
    }
    const enquiries = await loadEnquiriesFromKV(kv);
    return jsonResponse(request, {
      enquiries,
      total: enquiries.length,
      newCount: enquiries.filter((e) => e.status === 'new').length,
      mode: 'kv',
    });
  }

  // POST /api/enquiries
  if (pathname === '/api/enquiries' && request.method === 'POST') {
    const body = await readJsonBody(request);
    const name = String(body.name || '').trim();
    const phone = String(body.phone || '').trim();

    if (!name || !phone) {
      return jsonResponse(request, { error: 'Name and contact phone are required.' }, 400);
    }

    const newEnquiry: StoredEnquiry = {
      id: 'enq-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      name,
      email: String(body.email || '').trim(),
      phone,
      serviceCategory: String(body.serviceCategory || 'general'),
      serviceDetail: String(body.serviceDetail || ''),
      countryOrCity: String(body.countryOrCity || ''),
      studentAge: String(body.studentAge || '').trim() || undefined,
      timeSlotPreference: String(body.timeSlotPreference || ''),
      message: String(body.message || '').trim(),
      status: 'new',
    };

    if (!kv) {
      return jsonResponse(
        request,
        {
          success: true,
          mode: 'browser-fallback',
          enquiry: newEnquiry,
          message: 'Inquiry recorded.',
        },
        201
      );
    }

    const currentList = await loadEnquiriesFromKV(kv);
    currentList.unshift(newEnquiry);
    await saveEnquiriesToKV(kv, currentList);

    return jsonResponse(
      request,
      {
        success: true,
        mode: 'kv',
        enquiry: newEnquiry,
        message: 'Inquiry saved successfully on server.',
      },
      201
    );
  }

  // PATCH /api/enquiries/:id or DELETE /api/enquiries/:id
  const enquiryIdMatch = pathname.match(/^\/api\/enquiries\/([^/]+)$/);
  if (enquiryIdMatch) {
    const id = decodeURIComponent(enquiryIdMatch[1]);

    if (request.method === 'PATCH') {
      const body = await readJsonBody(request);
      if (!isPinAuthorized(request, body)) {
        return jsonResponse(request, { error: 'Unauthorized: Valid Studio PIN required.' }, 401);
      }
      const status = String(body.status || '');
      if (!['new', 'contacted', 'reviewed', 'resolved'].includes(status)) {
        return jsonResponse(request, { error: 'Invalid status value.' }, 400);
      }
      if (!kv) {
        return jsonResponse(request, {
          success: true,
          mode: 'browser-fallback',
          id,
          status,
        });
      }
      const currentList = await loadEnquiriesFromKV(kv);
      const index = currentList.findIndex((e) => e.id === id);
      if (index === -1) {
        return jsonResponse(request, { error: 'Inquiry not found.' }, 404);
      }
      currentList[index].status = status as StoredEnquiry['status'];
      await saveEnquiriesToKV(kv, currentList);
      return jsonResponse(request, { success: true, mode: 'kv', enquiry: currentList[index] });
    }

    if (request.method === 'DELETE') {
      if (!isPinAuthorized(request)) {
        return jsonResponse(request, { error: 'Unauthorized: Valid Studio PIN required.' }, 401);
      }
      if (!kv) {
        return jsonResponse(request, { success: true, mode: 'browser-fallback', id });
      }
      const currentList = await loadEnquiriesFromKV(kv);
      const filtered = currentList.filter((e) => e.id !== id);
      await saveEnquiriesToKV(kv, filtered);
      return jsonResponse(request, { success: true, mode: 'kv', message: 'Inquiry deleted.' });
    }
  }

  // POST /api/chat (AI Advisor via Gemini REST API when GEMINI_API_KEY is configured)
  if (pathname === '/api/chat' && request.method === 'POST') {
    const body = await readJsonBody(request);
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    if (!message) {
      return jsonResponse(request, { error: 'A valid message string is required.' }, 400);
    }

    const apiKey = env?.GEMINI_API_KEY;
    if (!apiKey) {
      return jsonResponse(request, {
        reply:
          'Welcome to The Art Horizon! For instant course details, fee structure, or to schedule a Free Live Demo Class with Vikas Gothi, please reach us directly on WhatsApp at +91 99818 83598 or submit the Book Free Demo form on this page.',
        modelUsed: 'studio-assistant',
      });
    }

    const role = typeof body.role === 'string' && SYSTEM_INSTRUCTIONS[body.role] ? body.role : 'general';
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(body.history)) {
      for (const item of body.history) {
        if (item && typeof item === 'object') {
          const itemObj = item as Record<string, unknown>;
          if (itemObj.role && itemObj.text) {
            contents.push({
              role: itemObj.role === 'model' || itemObj.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: String(itemObj.text) }],
            });
          }
        }
      }
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
          apiKey
        )}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: SYSTEM_INSTRUCTIONS[role] }],
            },
            contents,
          }),
        }
      );

      const geminiData = (await geminiRes.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };

      const reply =
        geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Thank you for reaching out to The Art Horizon! Please connect directly via WhatsApp at +91 99818 83598 for immediate guidance.';

      return jsonResponse(request, { reply, modelUsed: 'gemini-2.5-flash' });
    } catch {
      return jsonResponse(request, {
        reply:
          'Please connect with Vikas Gothi directly on WhatsApp (+91 99818 83598) or book a Free Demo Class above for immediate assistance!',
        modelUsed: 'studio-assistant',
      });
    }
  }

  return jsonResponse(request, { error: 'API endpoint not found.' }, 404);
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env);
    }
    if (env?.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return new Response('Not Found', { status: 404 });
  },
};
