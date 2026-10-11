import { Environment, DurationMinutes, ActivityType, Mission, Patchnote, AIProviderStatus } from '../types';

export interface AIProviderError {
  isAIError: true;
  title: string;
  message: string;
  setupInstructions: string;
  terminalCommand?: string;
  timestamp: string;
  rawDetails?: string;
}

export function isAIProviderError(error: any): error is AIProviderError {
  return error && error.isAIError === true;
}

/**
 * Checks connectivity to the hosted AI provider
 */
export async function checkAIProviderStatus(): Promise<AIProviderStatus> {
  try {
    const res = await fetch('/api/status');
    if (res.ok) {
      const data = await res.json();
      return {
        ...data,
        checkedAt: new Date().toLocaleTimeString(),
      };
    }
  } catch (err: any) {
    // Backend unreachable
  }

  return {
    connected: false,
    provider: 'Google AI Studio (Gemma)',
    model: 'gemma-4-26b (Open-Weight)',
    isOpenWeight: true,
    isFreeTier: true,
    error: 'Backend API service is not reachable.',
    checkedAt: new Date().toLocaleTimeString(),
  };
}

// Backwards-compatible alias
export const checkOllamaStatus = checkAIProviderStatus;

/**
 * Generates an outdoor observation mission using hosted open-weight model (Gemma)
 */
export async function generateMission(params: {
  environment: Environment;
  durationMinutes: DurationMinutes;
  activity: ActivityType;
}): Promise<Mission> {
  try {
    const res = await fetch('/api/quest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        environment: params.environment,
        durationMinutes: params.durationMinutes,
        activity: params.activity,
      }),
    });

    let data: any = {};
    try {
      data = await res.json();
    } catch {
      data = { error: `Server returned non-JSON response (HTTP ${res.status})` };
    }

    if (!res.ok || !data.success) {
      const isQuota = res.status === 429;
      const err: AIProviderError = {
        isAIError: true,
        title: isQuota ? 'Free Quota Reached' : 'Mission Generation Failed',
        message:
          data.error ||
          (isQuota
            ? 'The free inference quota is temporarily busy. Please wait 30 seconds and retry.'
            : 'Could not generate mission from hosted open-weight Gemma model.'),
        setupInstructions:
          data.setupInstructions ||
          'Patchnotes uses the free tier of Google AI Studio for open-weight Gemma inference (₹0 budget).',
        timestamp: new Date().toLocaleTimeString(),
        rawDetails: data.details || JSON.stringify(data),
      };
      throw err;
    }

    return data.mission;
  } catch (err: any) {
    if (isAIProviderError(err)) {
      throw err;
    }

    const aiErr: AIProviderError = {
      isAIError: true,
      title: 'Inference Service Unavailable',
      message: 'Could not connect to the backend mission generation service.',
      setupInstructions:
        'Ensure the application server is running with GEMINI_API_KEY set in server-side environment variables.',
      timestamp: new Date().toLocaleTimeString(),
      rawDetails: err?.message || String(err),
    };
    throw aiErr;
  }
}

/**
 * Transforms user's real observation into a nature field note (patchnote)
 */
export async function generatePatchnote(params: {
  missionTitle: string;
  observation: string;
  environment: Environment;
  durationMinutes: DurationMinutes;
  activity: ActivityType;
}): Promise<Patchnote> {
  if (!params.observation || params.observation.trim().length === 0) {
    const emptyErr: AIProviderError = {
      isAIError: true,
      title: 'Observation is Empty',
      message: 'Please write a sentence or two about what you actually observed outdoors.',
      setupInstructions: 'Take a moment to recall one small detail: light patterns, bark fissures, bird calls, soil dampness, or leaf veins.',
      timestamp: new Date().toLocaleTimeString(),
    };
    throw emptyErr;
  }

  try {
    const res = await fetch('/api/patchnote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        missionTitle: params.missionTitle,
        observation: params.observation,
        environment: params.environment,
        durationMinutes: params.durationMinutes,
        activity: params.activity,
      }),
    });

    let data: any = {};
    try {
      data = await res.json();
    } catch {
      data = { error: `Server returned non-JSON response (HTTP ${res.status})` };
    }

    if (!res.ok || !data.success) {
      const isQuota = res.status === 429;
      const err: AIProviderError = {
        isAIError: true,
        title: isQuota ? 'Free Quota Reached' : 'Field Note Generation Failed',
        message:
          data.error ||
          (isQuota
            ? 'The free inference quota is temporarily busy. Please wait 30 seconds and retry.'
            : 'Could not generate field note from hosted open-weight Gemma model.'),
        setupInstructions:
          data.setupInstructions ||
          'Patchnotes uses the free tier of Google AI Studio for open-weight Gemma inference (₹0 budget).',
        timestamp: new Date().toLocaleTimeString(),
        rawDetails: data.details || JSON.stringify(data),
      };
      throw err;
    }

    const note = data.patchnote;
    const finalPatchnote: Patchnote = {
      id: `patch-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      date: new Date().toISOString(),
      missionTitle: note.missionTitle || params.missionTitle,
      originalObservation: params.observation.trim(),
      title: note.title,
      observed: note.observed,
      interpretation: note.interpretation,
      nextVisitCue: note.nextVisitCue,
      environment: params.environment,
      durationMinutes: params.durationMinutes,
      activityType: params.activity,
      model: 'Gemma 4 (Open-Weight)',
    };

    return finalPatchnote;
  } catch (err: any) {
    if (isAIProviderError(err)) {
      throw err;
    }

    const aiErr: AIProviderError = {
      isAIError: true,
      title: 'Inference Service Unavailable',
      message: 'Could not connect to the backend field note generation service.',
      setupInstructions:
        'Ensure the server is running with GEMINI_API_KEY configured in environment variables (free tier, ₹0).',
      timestamp: new Date().toLocaleTimeString(),
      rawDetails: err?.message || String(err),
    };
    throw aiErr;
  }
}
