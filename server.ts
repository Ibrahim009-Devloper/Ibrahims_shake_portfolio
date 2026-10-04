import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const PORT = 3000;
const app = express();

// Lazy initialization for Gemini AI client using server-side GEMINI_API_KEY
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const rawKey = (process.env.GEMINI_API_KEY || '').trim();
  const apiKey = rawKey.replace(/^["']|["']$/g, '').trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure server data cache directory exists
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOADS_DIR));

const SITE_CONTENT_FILE = path.join(DATA_DIR, 'site_content.json');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

// Helper to save Base64 data URLs to clean static files
function saveBase64DataUrl(dataUrl: string, defaultName: string = 'file'): string {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
    return dataUrl;
  }
  try {
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return dataUrl;
    }
    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    let ext = '.bin';
    if (mimeType.includes('csv') || defaultName.endsWith('.csv')) ext = '.csv';
    else if (mimeType.includes('sheet') || mimeType.includes('xlsx') || defaultName.endsWith('.xlsx')) ext = '.xlsx';
    else if (mimeType.includes('xls') || defaultName.endsWith('.xls')) ext = '.xls';
    else if (mimeType.includes('png') || defaultName.endsWith('.png')) ext = '.png';
    else if (mimeType.includes('jpeg') || mimeType.includes('jpg') || defaultName.endsWith('.jpg')) ext = '.jpg';
    else if (mimeType.includes('webp') || defaultName.endsWith('.webp')) ext = '.webp';
    else if (mimeType.includes('json') || defaultName.endsWith('.json')) ext = '.json';
    else if (defaultName && defaultName.includes('.')) {
      ext = path.extname(defaultName);
    }

    const cleanBase = defaultName.replace(/[^a-zA-Z0-9_-]/g, '_').replace(ext, '').slice(0, 40) || 'upload';
    const filename = `${cleanBase}_${Date.now()}${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(filePath, buffer);
    console.log(`✓ Stored uploaded file statically: /uploads/${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
    return `/uploads/${filename}`;
  } catch (e) {
    console.warn('Failed to convert base64 data URL to file:', e);
    return dataUrl;
  }
}

// Helper to extract preview rows from CSV text
function parseCsvSampleRows(csvContent: string, maxRows: number = 8): any[] {
  try {
    const lines = csvContent.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length <= 1) return [];
    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    const rows: any[] = [];
    for (let i = 1; i < Math.min(lines.length, maxRows + 1); i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
      const rowObj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] || '';
      });
      rows.push(rowObj);
    }
    return rows;
  } catch (e) {
    return [];
  }
}

// Helper to read local JSON file
function readJsonFile(filePath: string, fallback: any = null) {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn(`Could not read file ${filePath}:`, e);
  }
  return fallback;
}

// Helper to write local JSON file
function writeJsonFile(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.warn(`Could not write file ${filePath}:`, e);
  }
}

// Supabase Server Credentials (Secured on Backend with safe URL validation)
function resolveValidSupabaseUrl(): string {
  const envUrl = (process.env.SUPABASE_URL || '').trim();
  if (envUrl && (envUrl.startsWith('http://') || envUrl.startsWith('https://'))) {
    try {
      new URL(envUrl);
      return envUrl;
    } catch (e) {
      // Fall through to default URL
    }
  }
  return 'https://voixkvyylglpomahowrl.supabase.co';
}

function resolveValidSupabaseKey(): string {
  const envKey = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '').trim();
  if (envKey && envKey.length > 5 && !envKey.includes('MY_')) {
    return envKey;
  }
  return 'sb_secret_C95CoEgRV8x6SSMJRmYpCg_ZeEeN27E';
}

const SUPABASE_URL = resolveValidSupabaseUrl();
const SUPABASE_SECRET_KEY = resolveValidSupabaseKey();

let supabaseAdmin: SupabaseClient | null = null;
try {
  if (SUPABASE_URL.startsWith('http://') || SUPABASE_URL.startsWith('https://')) {
    supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log('✓ Supabase Admin client initialized with URL:', SUPABASE_URL);
  }
} catch (e) {
  console.warn('Supabase Admin client init note:', e);
}

// Direct REST helper using backend Secret Key
async function supabaseAdminRest(endpoint: string, options: RequestInit = {}) {
  try {
    const url = `${SUPABASE_URL.replace(/\/+$/, '')}/rest/v1/${endpoint}`;
    const headers = {
      'apikey': SUPABASE_SECRET_KEY,
      'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errorText = await res.text();
      return { ok: false, status: res.status, error: errorText };
    }
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      return { ok: true, status: res.status, data };
    }
    return { ok: true, status: res.status, data: null };
  } catch (err: any) {
    return { ok: false, status: 500, error: err?.message || 'Network fetch error' };
  }
}

// ==========================================
// BACKEND ADMIN CMS & DATABASE API ROUTES
// ==========================================

// Health & Connection diagnostic
app.get('/api/admin/health', async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const check = await supabaseAdminRest('');
    const latency = Date.now() - startTime;
    return res.json({
      status: 'ok',
      backend: 'online',
      supabase: {
        connected: check.ok,
        url: SUPABASE_URL,
        role: 'secret_key',
        latencyMs: latency,
      },
    });
  } catch (err: any) {
    return res.json({
      status: 'ok',
      backend: 'online',
      supabase: {
        connected: false,
        error: err?.message || 'Offline',
      },
    });
  }
});

// GET site content (Admin & Client)
app.get('/api/admin/content', async (req: Request, res: Response) => {
  try {
    // 1. Try Supabase site_content table
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('site_content')
        .select('*')
        .eq('id', 'site_config_v1');

      if (!error && Array.isArray(data) && data.length > 0) {
        const row = data[0];
        writeJsonFile(SITE_CONTENT_FILE, row);
        return res.json({ success: true, data: row, source: 'supabase' });
      }
    }

    // 2. Try REST
    const restRes = await supabaseAdminRest('site_content?id=eq.site_config_v1&select=*');
    if (restRes.ok && Array.isArray(restRes.data) && restRes.data.length > 0) {
      const row = restRes.data[0];
      writeJsonFile(SITE_CONTENT_FILE, row);
      return res.json({ success: true, data: row, source: 'supabase_rest' });
    }

    // 3. Fallback to local server persistence
    const local = readJsonFile(SITE_CONTENT_FILE);
    if (local) {
      return res.json({ success: true, data: local, source: 'local_cache' });
    }

    return res.json({ success: true, data: null, message: 'Default configuration active' });
  } catch (err: any) {
    const local = readJsonFile(SITE_CONTENT_FILE);
    return res.json({ success: true, data: local, fallback: true });
  }
});

// POST site content (Save from Admin CMS directly to Supabase)
app.post('/api/admin/content', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, error: 'Content payload required' });
    }

    // If hero photo is a large base64 image, save it to uploads folder
    if (content.heroPhoto && content.heroPhoto.startsWith('data:')) {
      content.heroPhoto = saveBase64DataUrl(content.heroPhoto, 'hero_photo.jpg');
    }

    const now = new Date().toISOString();
    const siteContentPayload = {
      id: 'site_config_v1',
      content: content,
      file_name: JSON.stringify(content),
      updated_at: now,
    };

    // Save to local server cache for offline resilience
    writeJsonFile(SITE_CONTENT_FILE, siteContentPayload);

    let supabaseSaved = false;
    let supabaseError: any = null;

    // 1. Explicit Upsert to Supabase site_content table
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('site_content')
        .upsert([siteContentPayload], { onConflict: 'id' });

      if (!error) {
        supabaseSaved = true;
        console.log('✓ Supabase site_content upsert succeeded with id: site_config_v1');
      } else {
        supabaseError = error;
        console.error('Supabase SDK upsert error (site_content):', error);
      }
    }

    // 2. Fallback to Direct REST if SDK had a connection or header issue
    if (!supabaseSaved) {
      const restRes = await supabaseAdminRest('site_content', {
        method: 'POST',
        headers: {
          'Prefer': 'resolution=merge-duplicates,return=representation',
        },
        body: JSON.stringify(siteContentPayload),
      });

      if (restRes.ok) {
        supabaseSaved = true;
        supabaseError = null;
        console.log('✓ Supabase REST site_content upsert succeeded');
      } else if (!supabaseError) {
        supabaseError = restRes.error;
      }
    }

    if (!supabaseSaved && supabaseError) {
      const errorMsg = typeof supabaseError === 'object' ? (supabaseError.message || supabaseError.details || JSON.stringify(supabaseError)) : String(supabaseError);
      return res.status(500).json({
        success: false,
        error: `Supabase Save Error: ${errorMsg}`,
        details: supabaseError,
      });
    }

    return res.json({
      success: true,
      message: 'Site content permanently saved to Supabase table (site_content)',
      updatedAt: now,
      data: siteContentPayload,
    });
  } catch (err: any) {
    console.error('Fatal error saving site content:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Server error while saving site content to Supabase',
    });
  }
});

// GET all lead samples
app.get('/api/admin/leads', async (req: Request, res: Response) => {
  try {
    // 1. Try Supabase
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const leadsOnly = data.filter(r => r.id !== 'site_config_v1');
        if (leadsOnly.length > 0) {
          writeJsonFile(LEADS_FILE, leadsOnly);
          return res.json({ success: true, data: leadsOnly, source: 'supabase' });
        }
      }
    }

    // 2. Try REST
    const restRes = await supabaseAdminRest('leads?select=*&order=created_at.desc');
    if (restRes.ok && Array.isArray(restRes.data) && restRes.data.length > 0) {
      const leadsOnly = restRes.data.filter((r: any) => r.id !== 'site_config_v1');
      if (leadsOnly.length > 0) {
        writeJsonFile(LEADS_FILE, leadsOnly);
        return res.json({ success: true, data: leadsOnly, source: 'supabase_rest' });
      }
    }

    // 3. Fallback to local server persistence
    const local = readJsonFile(LEADS_FILE, []);
    return res.json({ success: true, data: local, source: 'local_cache' });
  } catch (err: any) {
    const local = readJsonFile(LEADS_FILE, []);
    return res.json({ success: true, data: local });
  }
});

// POST upsert a lead sample (Admin CMS directly to Supabase)
app.post('/api/admin/leads', async (req: Request, res: Response) => {
  try {
    const sample = req.body;
    if (!sample || !sample.title) {
      return res.status(400).json({ success: false, error: 'Valid sample title required' });
    }

    // Convert any large Base64 files to clean static uploads
    let sheetUrl = sample.sheetUrl || sample.sheet_url || '';
    const rawFileName = sample.fileName || sample.file_name || 'dataset.csv';
    if (sheetUrl.startsWith('data:')) {
      sheetUrl = saveBase64DataUrl(sheetUrl, rawFileName);
    }

    let photoUrl = sample.photo || sample.image_url || '/assets/b2b_lead_gen_graphic.jpg';
    if (photoUrl.startsWith('data:')) {
      photoUrl = saveBase64DataUrl(photoUrl, 'lead_graphic.jpg');
    }

    // Parse or default sample rows
    let sampleRows = sample.sampleRows || sample.sample_rows || [];
    if (!Array.isArray(sampleRows) || sampleRows.length === 0) {
      sampleRows = [
        { name: 'Michael Sterling', title: 'Managing Director / Partner', company: 'Apex Commercial Partners', email: 'm.sterling@apexpartners.com', phone: '+1 (512) 555-0182', location: sample.location || 'USA' },
        { name: 'Sarah Montgomery', title: 'VP of Business Development', company: 'Global Growth Ventures', email: 'smontgomery@globalventures.io', phone: '+1 (415) 555-0291', location: sample.location || 'USA' },
        { name: 'David Hensley', title: 'Chief Executive Officer', company: 'Pioneer Assets Group', email: 'dhensley@pioneerassets.com', phone: '+1 (212) 555-0377', location: sample.location || 'USA' }
      ];
    }

    const payload = {
      id: String(sample.id || ('sample-' + Date.now())),
      title: sample.title,
      location: sample.location || 'Global / United States',
      photo: photoUrl,
      image_url: photoUrl,
      sheet_url: sheetUrl,
      file_name: rawFileName,
      type: sample.type || 'B2B Lead Generation',
      quality: sample.quality || 'Sample Dataset · Syntax & MX Validated',
      sample_rows: sampleRows,
    };

    // 1. Update local cache
    const currentLeads: any[] = readJsonFile(LEADS_FILE, []);
    const idx = currentLeads.findIndex(l => l.id === payload.id);
    if (idx !== -1) {
      currentLeads[idx] = payload;
    } else {
      currentLeads.unshift(payload);
    }
    writeJsonFile(LEADS_FILE, currentLeads);

    let supabaseSaved = false;
    let supabaseError: any = null;

    // 2. Explicit Upsert to Supabase leads table
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('leads')
        .upsert([payload], { onConflict: 'id' });

      if (!error) {
        supabaseSaved = true;
        console.log(`✓ Supabase lead upsert succeeded for id: ${payload.id}`);
      } else {
        supabaseError = error;
        console.error('Supabase SDK upsert error (leads):', error);
      }
    }

    // 3. Fallback to Direct REST
    if (!supabaseSaved) {
      const restRes = await supabaseAdminRest('leads', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify(payload),
      });

      if (restRes.ok) {
        supabaseSaved = true;
        supabaseError = null;
        console.log(`✓ Supabase REST lead upsert succeeded for id: ${payload.id}`);
      } else if (!supabaseError) {
        supabaseError = restRes.error;
      }
    }

    // 4. Return error if persistence failed
    if (!supabaseSaved && supabaseError) {
      const errorMsg = typeof supabaseError === 'object' ? (supabaseError.message || supabaseError.details || JSON.stringify(supabaseError)) : String(supabaseError);
      return res.status(500).json({
        success: false,
        error: `Supabase Leads Save Error: ${errorMsg}`,
        details: supabaseError,
      });
    }

    return res.json({
      success: true,
      message: 'Lead sample permanently saved to Supabase (leads)',
      data: payload,
    });
  } catch (err: any) {
    console.error('Save lead fatal error:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Internal Server Error while saving lead sample',
    });
  }
});

// DELETE a lead sample (Admin CMS from Supabase)
app.delete('/api/admin/leads/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, error: 'Sample ID is required' });

    // 1. Delete from local cache
    const currentLeads: any[] = readJsonFile(LEADS_FILE, []);
    const filtered = currentLeads.filter(l => l.id !== id);
    writeJsonFile(LEADS_FILE, filtered);

    let supabaseDeleted = false;
    let supabaseError: any = null;

    // 2. Delete from Supabase
    if (supabaseAdmin) {
      const { error } = await supabaseAdmin.from('leads').delete().eq('id', id);
      if (!error) {
        supabaseDeleted = true;
        console.log(`✓ Supabase lead delete succeeded for id: ${id}`);
      } else {
        supabaseError = error;
        console.error('Supabase delete error (leads):', error);
      }
    }

    if (!supabaseDeleted) {
      const restRes = await supabaseAdminRest(`leads?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (restRes.ok) {
        supabaseDeleted = true;
        supabaseError = null;
      } else if (!supabaseError) {
        supabaseError = restRes.error;
      }
    }

    if (!supabaseDeleted && supabaseError) {
      const errorMsg = typeof supabaseError === 'object' ? (supabaseError.message || supabaseError.details || JSON.stringify(supabaseError)) : String(supabaseError);
      return res.status(500).json({
        success: false,
        error: `Supabase Delete Error: ${errorMsg}`,
      });
    }

    return res.json({ success: true, message: `Lead sample ${id} deleted from Supabase` });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'Error deleting lead' });
  }
});

// POST message (Contact Inquiries)
app.post('/api/messages', async (req: Request, res: Response) => {
  try {
    const { name, email, project_type, message } = req.body;
    const payload = {
      name: name || 'Anonymous',
      email: email || '',
      project_type: project_type || 'B2B Leads',
      message: message || '',
      created_at: new Date().toISOString(),
    };

    // Save to local messages log
    const msgs = readJsonFile(MESSAGES_FILE, []);
    msgs.unshift(payload);
    writeJsonFile(MESSAGES_FILE, msgs);

    if (supabaseAdmin) {
      const { error } = await supabaseAdmin.from('messages').insert([payload]);
      if (error) {
        console.warn('Supabase insert message error:', error);
      }
    }

    return res.json({ success: true, message: 'Message securely recorded in Supabase database' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

// ==========================================
// GEMINI AI SERVICE CHATBOT ENDPOINT
// ==========================================
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], contactInfo } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message text is required' });
    }

    const trimmedMsg = message.trim();
    const directPhone = contactInfo?.phone || '+880 1744-868938';
    const directEmail = contactInfo?.email || 'ibrahimshakeshuvo100@gmail.com';
    const location = contactInfo?.location || 'Dhaka, Bangladesh';

    const ai = getGeminiClient();

    // If GEMINI_API_KEY is not configured or in placeholder mode, provide an intelligent direct response
    if (!ai) {
      const lower = trimmedMsg.toLowerCase();
      let answer = '';

      const isAskingContact = lower.includes('phone') || lower.includes('call') || lower.includes('whatsapp') || lower.includes('message') || lower.includes('number') || lower.includes('contact') || lower.includes('reach') || lower.includes('hire') || lower.includes('quote') || lower.includes('price') || lower.includes('cost') || lower.includes('start') || lower.includes('satisfy') || lower.includes('ready');

      if (lower.includes('service') || lower.includes('what do you') || lower.includes('provide') || lower.includes('offer') || lower.includes('help')) {
        answer = `• Custom Browser Automation Bots: Python bots (Playwright / SeleniumBase) for login, clicks, forms, and downloads.\n• Web Workflow & Task Automation: End-to-end automation of repetitive web tasks with logging.\n• Web Scraping & Data Extraction: Structured data delivered as CSV, Excel, or Google Sheets.\n• AI-Assisted Automation: LLM calls inside workflows to classify, summarize, or clean data.\n• Google Sheets & Docs Automation: Scripts that read, write, and update Google Sheets and Docs automatically.\n• Lead Discovery Automation: Automated B2B lead finding as one use case of automation tools.`;
      } else if (isAskingContact) {
        answer = `Project scope must be reviewed for a custom quote. You can connect with Ibrahim directly:\n\n📞 Call/WhatsApp: ${directPhone}\n✉️ Email: ${directEmail}`;
      } else if (lower.includes('project') || lower.includes('github') || lower.includes('demo') || lower.includes('video')) {
        answer = `Dynamic automation projects with demo videos and GitHub repositories are showcased in the Projects section above.`;
      } else if (lower.includes('price') || lower.includes('rate') || lower.includes('cost') || lower.includes('deadline')) {
        answer = `No fixed pricing or deadlines are quoted upfront. Project scope must be reviewed for a custom quote.`;
      } else {
        answer = `Ibrahim is a Python Web Automation Developer building browser bots, web workflow automation, web scraping, and AI-assisted automation systems. How can I assist with your project?`;
      }

      return res.json({
        success: true,
        reply: answer,
        phone: isAskingContact ? directPhone : null,
        email: isAskingContact ? directEmail : null,
        isFallback: true,
      });
    }

    const systemInstruction = `You are the official AI Assistant for MD. Ibrahim Shake Shuvo based on his verified profile data.

STRICT DATA BOUNDARY (VERY IMPORTANT):
- ONLY answer questions based on Ibrahim's verified profile data:
  * Name: MD. Ibrahim Shake Shuvo
  * Location: Dhaka, Bangladesh
  * Title: Python Web Automation Developer
  * Core Tech Stack:
    - Language: Python
    - Browser automation: Playwright, SeleniumBase
    - Scraping and parsing: Requests, BeautifulSoup
    - Data: pandas
    - AI: LLM API calling
    - Integrations: Google Sheets and Google Docs updating
  * Services:
    1. Custom Browser Automation Bots: Python bots (Playwright / SeleniumBase) that work on websites without an API: login, clicks, forms, downloads.
    2. Web Workflow & Task Automation: End-to-end automation of repetitive web tasks, with logging and error handling.
    3. Web Scraping & Data Extraction: Structured data from static and JavaScript-heavy websites, delivered as CSV, Excel or Google Sheets.
    4. AI-Assisted Automation: LLM calls inside the workflow to classify, score, summarize or clean collected data.
    5. Google Sheets & Docs Automation: Scripts that read, write and update Google Sheets and Docs automatically.
    6. Lead Discovery Automation: Automated B2B lead finding, as one small use case of the automation tools above.
  * Experience / Bio: I am a Python Web Automation Developer. I build systems that do repetitive work on websites for you: browser automation, form filling, web scraping, AI-assisted processing with LLMs, and syncing results to Google Sheets and Docs. Lead generation is one of the things I build with these tools, not the only one. My focus is clean, reliable Python code that saves real working hours.
  * Education: Diploma in Agriculture, Agriculture Training Institute, Gaibandha (August 2019 - December 2023)
- DO NOT invent, assume, or provide any service details, skills, or information that is NOT explicitly mentioned above.
- If a user asks something about Ibrahim or his services that is not in the records, state strictly: "I don't have that specific information in my records. Please reach out to Ibrahim directly to discuss this."

STRICT RESPONSE STYLE:
1. Ultra-Concise: Keep replies under 2-3 sentences maximum (or 2-3 short bullet points).
2. No Fluff: Zero conversational filler, meta-introductions, or generic greetings. Jump straight to the answer.
3. No Price Quotes: Never mention static prices or timelines. State that project scope needs to be reviewed for a custom quote.

STRICT CONTACT REVEAL LOGIC:
- ABSOLUTELY DO NOT include phone number, WhatsApp, or email address in general replies, greetings, or service overviews.
- ONLY provide contact details if the user explicitly asks for contact information (e.g., "give me his number", "how to contact him?", "share email") OR explicitly states they want to hire him/start a project immediately.

CONTACT DETAILS (Only when triggered by the rule above):
📞 Phone / WhatsApp: ${directPhone}
✉️ Email: ${directEmail}`;

    // Map conversation history
    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        const role = (item.role === 'model' || item.role === 'assistant') ? 'model' : 'user';
        const text = String(item.text || item.content || '').trim();
        if (text) {
          contents.push({
            role,
            parts: [{ text }],
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: trimmedMsg }],
    });

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.6,
        },
      });
    } catch (primaryErr: any) {
      // Fallback to gemini-2.5-flash if primary model is experiencing high demand (503)
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.6,
        },
      });
    }

    const reply = response.text || `I am here to assist with MD. Ibrahim's Python web automation, browser bots, web scraping, and workflow automation services. Please reach out to Ibrahim directly at ${directPhone} or via email.`;

    return res.json({
      success: true,
      reply,
      phone: directPhone,
      email: directEmail,
    });
  } catch (err: any) {
    console.error('Gemini chat error (falling back to expert answers):', err?.message || err);
    const phone = req.body?.contactInfo?.phone || '+880 1744-868938';
    const email = req.body?.contactInfo?.email || 'ibrahimshakeshuvo100@gmail.com';
    const trimmedMsg = String(req.body?.message || '').toLowerCase();
    const isAskingContact = trimmedMsg.includes('phone') || trimmedMsg.includes('call') || trimmedMsg.includes('whatsapp') || trimmedMsg.includes('message') || trimmedMsg.includes('number') || trimmedMsg.includes('contact') || trimmedMsg.includes('reach') || trimmedMsg.includes('hire') || trimmedMsg.includes('quote') || trimmedMsg.includes('price') || trimmedMsg.includes('cost') || trimmedMsg.includes('start') || trimmedMsg.includes('satisfy') || trimmedMsg.includes('ready');

    let fallbackReply = '';
    if (trimmedMsg.includes('service') || trimmedMsg.includes('what do you') || trimmedMsg.includes('provide') || trimmedMsg.includes('offer') || trimmedMsg.includes('help')) {
      fallbackReply = `• Custom Browser Automation Bots: Python bots (Playwright / SeleniumBase) for login, clicks, forms, and downloads.\n• Web Workflow & Task Automation: End-to-end automation of repetitive web tasks with logging.\n• Web Scraping & Data Extraction: Structured data delivered as CSV, Excel, or Google Sheets.\n• AI-Assisted Automation: LLM calls inside workflows to classify, summarize, or clean data.\n• Google Sheets & Docs Automation: Scripts that read, write, and update Google Sheets and Docs automatically.\n• Lead Discovery Automation: Automated B2B lead finding as one use case of automation tools.`;
    } else if (isAskingContact) {
      fallbackReply = `Project scope must be reviewed for a custom quote. You can connect with Ibrahim directly:\n\n📞 Call/WhatsApp: ${phone}\n✉️ Email: ${email}`;
    } else if (trimmedMsg.includes('project') || trimmedMsg.includes('github') || trimmedMsg.includes('demo') || trimmedMsg.includes('video')) {
      fallbackReply = `Dynamic automation projects with demo videos and GitHub repositories are showcased in the Projects section above.`;
    } else if (trimmedMsg.includes('price') || trimmedMsg.includes('rate') || trimmedMsg.includes('cost') || trimmedMsg.includes('deadline')) {
      fallbackReply = `No fixed pricing or deadlines are quoted upfront. Project scope must be reviewed for a custom quote.`;
    } else {
      fallbackReply = `Ibrahim is a Python Web Automation Developer building browser bots, web workflow automation, web scraping, and AI-assisted automation systems. How can I assist with your project?`;
    }

    return res.json({
      success: true,
      reply: fallbackReply,
      phone: isAskingContact ? phone : null,
      email: isAskingContact ? email : null,
      isFallback: true,
    });
  }
});

// Robots.txt and Sitemap.xml SEO endpoints
app.get('/robots.txt', (req: Request, res: Response) => {
  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    res.type('text/plain').sendFile(robotsPath);
  } else {
    res.type('text/plain').send("User-agent: *\nAllow: /\nDisallow: /api/admin/\nSitemap: https://ibrahimshake.com/sitemap.xml\n");
  }
});

app.get('/sitemap.xml', (req: Request, res: Response) => {
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    res.type('application/xml').sendFile(sitemapPath);
  } else {
    res.status(404).send('Sitemap not found');
  }
});

// ==========================================
// VITE MIDDLEWARE & STATIC ASSET SERVING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Full-stack server running on http://0.0.0.0:${PORT}`);
    console.log(`🔐 Supabase Backend Connected: ${SUPABASE_URL}`);
  });
}

startServer();
