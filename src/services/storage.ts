import { Patchnote } from '../types';

const STORAGE_KEY = 'patchnotes_saved_entries_v1';
const SETTINGS_KEY = 'patchnotes_settings_v1';

export interface UserSettings {
  ollamaEndpoint: string;
  ollamaModel: string;
}

const DEFAULT_SETTINGS: UserSettings = {
  ollamaEndpoint: 'http://127.0.0.1:11434',
  ollamaModel: 'qwen2.5:1.5b',
};

export function getSavedPatchnotes(): Patchnote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Error reading patchnotes from localStorage:', err);
    return [];
  }
}

export function savePatchnote(entry: Patchnote): Patchnote[] {
  try {
    const current = getSavedPatchnotes();
    // Prepend new entry
    const updated = [entry, ...current.filter((item) => item.id !== entry.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error saving patchnote to localStorage:', err);
    return getSavedPatchnotes();
  }
}

export function deletePatchnote(id: string): Patchnote[] {
  try {
    const current = getSavedPatchnotes();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error deleting patchnote from localStorage:', err);
    return getSavedPatchnotes();
  }
}

export function getSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ollamaEndpoint: parsed.ollamaEndpoint || DEFAULT_SETTINGS.ollamaEndpoint,
      ollamaModel: parsed.ollamaModel || DEFAULT_SETTINGS.ollamaModel,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Partial<UserSettings>): UserSettings {
  try {
    const current = getSettings();
    const updated: UserSettings = {
      ...current,
      ...settings,
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
