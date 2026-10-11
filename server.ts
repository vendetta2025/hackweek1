import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Default open-weight model hosted on Google AI Studio's free tier
const DEFAULT_MODEL = 'models/gemma-4-26b-a4b-it';
const PROVIDER_NAME = 'Google AI Studio (Gemma Open-Weight)';

// Allowed configuration values
const ALLOWED_ENVIRONMENTS = ['Campus', 'Street', 'Park', 'Garden', 'Balcony'];
const ALLOWED_DURATIONS = [5, 10, 15];
const ALLOWED_ACTIVITIES = ['Walking', 'Staying in One Place'];

app.use(express.json({ limit: '1mb' }));

// Helper to get Gemini client
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

// Clean model string output of markdown code fences and isolate JSON
function extractCleanJson(raw: string): any {
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  const startIdx = cleaned.indexOf('{');
  const endIdx = cleaned.lastIndexOf('}');
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }
  return JSON.parse(cleaned);
}

// Sanitize string to remove any HTML tags
function sanitizeText(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
}

// Health / Status endpoint to test hosted AI connection
app.get('/api/status', async (req: Request, res: Response) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    res.json({
      connected: false,
      provider: PROVIDER_NAME,
      model: DEFAULT_MODEL,
      isOpenWeight: true,
      error: 'GEMINI_API_KEY is not configured in environment secrets.',
      instructions: 'Configure GEMINI_API_KEY in the AI Studio Secrets panel or .env file (100% free tier, ₹0 cost).',
    });
    return;
  }

  try {
    const ai = getGenAIClient();
    if (!ai) throw new Error('Could not initialize AI client');

    res.json({
      connected: true,
      provider: PROVIDER_NAME,
      model: 'gemma-4-26b (Open-Weight)',
      modelId: DEFAULT_MODEL,
      isOpenWeight: true,
      isFreeTier: true,
    });
  } catch (err: any) {
    res.json({
      connected: false,
      provider: PROVIDER_NAME,
      model: DEFAULT_MODEL,
      isOpenWeight: true,
      error: err.message || 'Cannot connect to hosted inference API.',
    });
  }
});

// Quest generation endpoint
app.post('/api/quest', async (req: Request, res: Response) => {
  const { environment, durationMinutes, activity } = req.body;

  // Validate inputs
  if (!environment || !ALLOWED_ENVIRONMENTS.includes(environment)) {
    res.status(400).json({
      error: `Invalid environment '${environment}'. Must be one of: ${ALLOWED_ENVIRONMENTS.join(', ')}`,
    });
    return;
  }

  const durationNum = parseInt(durationMinutes, 10);
  if (!ALLOWED_DURATIONS.includes(durationNum)) {
    res.status(400).json({
      error: `Invalid duration '${durationMinutes}'. Must be 5, 10, or 15 minutes.`,
    });
    return;
  }

  if (!activity || !ALLOWED_ACTIVITIES.includes(activity)) {
    res.status(400).json({
      error: `Invalid activity '${activity}'. Must be one of: ${ALLOWED_ACTIVITIES.join(', ')}`,
    });
    return;
  }

  const ai = getGenAIClient();
  if (!ai) {
    res.status(503).json({
      error: 'Hosted AI provider is not configured. GEMINI_API_KEY is missing.',
      setupInstructions: 'Set GEMINI_API_KEY in your environment or Secrets panel (free tier, ₹0).',
    });
    return;
  }

  const prompt = `You are PATCHNOTES, a mindful outdoor observation guide creating small nature observation missions. Follow the Touch Grass philosophy: safe, achievable within the time limit, screen-free, noticing subtle natural changes (nature changelogs).
CRITICAL RULES:
- Never suggest touching wildlife, tasting or eating plants, entering private property, damaging plants, or any dangerous activities.
- Keep activities realistic for ${environment} in ${durationNum} minutes while ${activity}.
- Reply strictly with a single valid JSON object. No markdown ticks, no commentary.

Generate 1 outdoor observation mission for:
- Environment: ${environment}
- Duration: ${durationNum} minutes
- Activity: ${activity}

Respond with this exact JSON schema:
{
  "title": "A memorable, engaging 3-6 word mission title",
  "activity": "One specific, calming observational activity",
  "noticeItems": [
    "First specific detail to notice",
    "Second specific detail to notice",
    "Third specific detail to notice"
  ],
  "question": "One reflective, grounding question to contemplate"
}`;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
    });

    const content = response.text || '';
    const parsed = extractCleanJson(content);

    if (!parsed.title || !parsed.activity || !Array.isArray(parsed.noticeItems)) {
      throw new Error('Incomplete JSON structure from model');
    }

    res.json({
      success: true,
      mission: {
        title: sanitizeText(parsed.title),
        activity: sanitizeText(parsed.activity),
        noticeItems: parsed.noticeItems.slice(0, 3).map((item: any) => sanitizeText(String(item))),
        question: sanitizeText(parsed.question || 'What small rhythm in this place will continue after you leave?'),
        environment,
        durationMinutes: durationNum,
        activityType: activity,
        generatedAt: new Date().toISOString(),
        model: 'Gemma 4 (Open-Weight)',
      },
    });
  } catch (err: any) {
    const isQuota = err.status === 429 || err.message?.includes('quota') || err.message?.includes('RESOURCE_EXHAUSTED');
    const message = isQuota
      ? 'Free inference quota temporarily exhausted. Please wait 30 seconds and retry.'
      : err.message || 'Failed to generate mission from hosted open-weight model.';

    res.status(isQuota ? 429 : 502).json({
      error: message,
      details: err.message,
      setupInstructions: 'The application uses the free tier of Google AI Studio for open-weight Gemma inference (₹0 budget).',
    });
  }
});

// Patchnote generation endpoint
app.post('/api/patchnote', async (req: Request, res: Response) => {
  const { missionTitle, observation, environment, durationMinutes, activity } = req.body;

  if (!observation || typeof observation !== 'string' || observation.trim().length === 0) {
    res.status(400).json({ error: 'Observation text is required.' });
    return;
  }

  const cleanObservation = sanitizeText(observation.slice(0, 3000));

  const ai = getGenAIClient();
  if (!ai) {
    res.status(503).json({
      error: 'Hosted AI provider is not configured. GEMINI_API_KEY is missing.',
      setupInstructions: 'Set GEMINI_API_KEY in your environment or Secrets panel (free tier, ₹0).',
    });
    return;
  }

  const prompt = `You are PATCHNOTES, an authentic nature journal changelog engine. Transform the user's real outdoor observation into a concise, meaningful field note structured like a natural changelog.
CRITICAL INTEGRITY RULES:
1. FAITHFUL OBSERVATION: Summarize only what the user actually observed. NEVER invent observations or claim something happened when the user did not report it.
2. NO HALLUCINATED IDENTIFICATIONS: Do not invent species identifications, weather conditions, scientific facts, or environmental changes not supported by their text.
3. EPISTEMIC HUMILITY: Offer a thoughtful, possible interpretation, and explicitly qualify it as uncertain when appropriate (e.g., "This might indicate...", "Likely...", "Perhaps...").
4. NEXT VISIT CUE: Suggest one specific detail or change to look for on their next visit to the same spot.
5. WRITING STYLE: Thoughtful, quiet, specific, and grounded. Avoid generic AI motivational prose.
6. TITLE: Creative changelog-inspired or poetic title (e.g. 'patch-v0.2: afternoon-moss-growth' or 'commit: cedar-bark-fissures').
7. Reply strictly with valid JSON without markdown ticks or explanation.

Mission: ${sanitizeText(missionTitle || 'Outdoor Observation')}
Environment: ${sanitizeText(environment || 'Outdoor')} (${durationMinutes || 10} min, ${sanitizeText(activity || 'Walking')})
User's Real Observation:
"${cleanObservation}"

Respond with this exact JSON schema:
{
  "title": "Changelog or poetic patch title",
  "observed": "Concise, faithful summary of what the user actually noticed",
  "interpretation": "A thoughtful possible interpretation, clearly qualified as uncertain where appropriate",
  "nextVisitCue": "One specific detail to look for on the next visit"
}`;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
    });

    const content = response.text || '';
    const parsed = extractCleanJson(content);

    if (!parsed.title || !parsed.observed) {
      throw new Error('Incomplete JSON structure from model');
    }

    res.json({
      success: true,
      patchnote: {
        title: sanitizeText(parsed.title),
        observed: sanitizeText(parsed.observed),
        interpretation: sanitizeText(parsed.interpretation || 'No interpretation provided.'),
        nextVisitCue: sanitizeText(parsed.nextVisitCue || 'Look for subtle lighting and moisture changes in this area.'),
        missionTitle: sanitizeText(missionTitle || 'Nature Mission'),
        originalObservation: cleanObservation,
        environment: environment || 'Outdoors',
        date: new Date().toISOString(),
        model: 'Gemma 4 (Open-Weight)',
      },
    });
  } catch (err: any) {
    const isQuota = err.status === 429 || err.message?.includes('quota') || err.message?.includes('RESOURCE_EXHAUSTED');
    const message = isQuota
      ? 'Free inference quota temporarily exhausted. Please wait 30 seconds and retry.'
      : err.message || 'Failed to generate field note from hosted open-weight model.';

    res.status(isQuota ? 429 : 502).json({
      error: message,
      details: err.message,
      setupInstructions: 'The application uses the free tier of Google AI Studio for open-weight Gemma inference (₹0 budget).',
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const hasDist = fs.existsSync(distPath);

  if (process.env.NODE_ENV === 'production' && hasDist) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌿 PATCHNOTES server running on port ${PORT} using hosted open-weight Gemma`);
  });
}

startServer();
