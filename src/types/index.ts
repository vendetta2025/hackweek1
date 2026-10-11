export type Environment = 'Campus' | 'Street' | 'Park' | 'Garden' | 'Balcony';

export type DurationMinutes = 5 | 10 | 15;

export type ActivityType = 'Walking' | 'Staying in One Place';

export interface Mission {
  title: string;
  activity: string;
  noticeItems: [string, string, string] | string[];
  question: string;
  environment: Environment;
  durationMinutes: DurationMinutes;
  activityType: ActivityType;
  generatedAt: string;
  model: string;
}

export interface Patchnote {
  id: string;
  date: string;
  missionTitle: string;
  originalObservation: string;
  title: string;
  observed: string;
  interpretation: string;
  nextVisitCue: string;
  environment: Environment;
  durationMinutes: DurationMinutes;
  activityType: ActivityType;
  model: string;
}

export interface AIProviderStatus {
  connected: boolean;
  provider: string;
  model: string;
  isOpenWeight: boolean;
  isFreeTier?: boolean;
  error?: string;
  instructions?: string;
  checkedAt?: string;
}

export type OllamaStatus = AIProviderStatus;
