# PATCHNOTES
> **"Nature has commits, too."**  
> *A nature journal powered by hosted open-weight AI for the Touch Grass Hackathon.*

---

## 1. Project Overview

**Patchnotes** encourages people to step away from screens and observe the living world around them. Using a software changelog metaphor for nature, users receive a brief outdoor observation mission, head outside to observe, record their real findings, and generate a concise, grounded nature field note (a "patchnote").

All AI reasoning is powered by a free hosted open-weight model: **Google Gemma 4** (`models/gemma-4-26b-a4b-it`) via the free tier of Google AI Studio (₹0 budget, no local downloads or background daemons required).

---

## 2. Key Features

- **Micro-Missions (Discover)**: Generate safe, engaging outdoor observation prompts customized by environment (*Campus, Street, Park, Garden, Balcony*), duration (*5, 10, or 15 minutes*), and activity (*Walking vs. Staying in One Place*).
- **Mindful Observation Flow (Observe)**: Put your device away while exploring. When you return, log your raw, unfiltered observations.
- **Natural Changelogs (Document)**: Converts real user observations into a structured nature changelog:
  - Creative release title (e.g., `patch-v0.2: afternoon-moss-growth`)
  - Faithful summary of what was observed (no fabricated facts or hallucinations)
  - Thoughtful interpretation with explicit epistemic humility
  - One specific cue to look for on the next visit
- **Local-First Journal (My Patchnotes)**: Stored securely in browser `localStorage`. Review, search, filter, delete, or export your changelog to Markdown.
- **Zero Local AI Daemons**: No Ollama installation, no local model weight downloads, and no complex GPU/RAM requirements.

---

## 3. Technology Stack & Zero-Cost Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons
- **Backend**: Express, Node.js (`server.ts`)
- **AI Model**: Open-weight [Google Gemma 4](https://deepmind.google/technologies/gemma/) (`models/gemma-4-26b-a4b-it`)
- **Hosting / Inference Provider**: Google AI Studio Free Tier (₹0 budget, free permanent tier, no credit card required)
- **Key Security**: Server-side proxy protects the `GEMINI_API_KEY`. API keys are never exposed in browser JavaScript.
- **Persistence**: Browser `localStorage` (no database required)

---

## 4. Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Free Google AI Studio API key (`GEMINI_API_KEY`) from [aistudio.google.com](https://aistudio.google.com/) (100% free tier, ₹0 cost)

### Quick Start
1. Clone or download the repository:
   ```bash
   git clone <repo-url>
   cd patchnotes
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set your free API key in your environment or a `.env` file:
   ```bash
   # In .env:
   GEMINI_API_KEY="your_free_gemini_api_key_here"
   ```
   *(Note: In the AI Studio preview environment, this is automatically injected into server-side environment secrets.)*

4. Start the application:
   ```bash
   npm start
   ```

5. Open your browser:
   ```
   http://localhost:3000
   ```

---

## 5. Privacy & Security

- **Server-Side API Calls**: AI inference requests are proxied securely through the Node.js backend. Secret keys are never delivered to client-side bundles.
- **Local Persistence**: User observations and field notes remain exclusively in browser `localStorage`.
- **No Geolocation or Photo Tracking**: The application does not collect camera feeds, GPS coordinates, or personal tracking data.
- **Honest Epistemics**: Observations are summarized faithfully without fabricating species identifications or hallucinatory claims.

---

## 6. Free Tier Quota Handling

- The free tier provides generous request limits at ₹0 cost.
- If the rate limit is temporarily reached, the application displays a friendly notification asking you to wait a brief moment and provides a one-click **Retry Request** button. Fake responses are never substituted for real inference.
