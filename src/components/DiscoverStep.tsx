import React, { useState } from 'react';
import { Compass, Clock, Footprints, Loader2, Leaf, Shield, Terminal, AlertCircle } from 'lucide-react';
import { Environment, DurationMinutes, ActivityType, OllamaStatus } from '../types';

interface DiscoverStepProps {
  onGenerateMission: (params: {
    environment: Environment;
    durationMinutes: DurationMinutes;
    activity: ActivityType;
  }) => void;
  isLoading: boolean;
  ollamaStatus?: OllamaStatus | null;
  onOpenSettings?: () => void;
}

const ENVIRONMENTS: { id: Environment; label: string; desc: string; icon: string }[] = [
  { id: 'Campus', label: 'Campus', desc: 'Courtyards, brick pathways, quad trees', icon: '🏛️' },
  { id: 'Street', label: 'Street', desc: 'Sidewalk cracks, lampposts, curb moss', icon: '🚶' },
  { id: 'Park', label: 'Park', desc: 'Open lawn, tree lines, soil edges', icon: '🌲' },
  { id: 'Garden', label: 'Garden', desc: 'Flowerbeds, shrub borders, soil moisture', icon: '🌱' },
  { id: 'Balcony', label: 'Balcony', desc: 'Skyline view, breeze, potted flora', icon: '🪴' },
];

const DURATIONS: DurationMinutes[] = [5, 10, 15];

const ACTIVITIES: { id: ActivityType; label: string; desc: string }[] = [
  { id: 'Walking', label: 'Walking', desc: 'Slow, receptive pace noticing transitions' },
  { id: 'Staying in One Place', label: 'Staying in One Place', desc: 'Anchored in a single vantage point' },
];

export const DiscoverStep: React.FC<DiscoverStepProps> = ({
  onGenerateMission,
  isLoading,
  ollamaStatus,
  onOpenSettings,
}) => {
  const [environment, setEnvironment] = useState<Environment>('Park');
  const [duration, setDuration] = useState<DurationMinutes>(10);
  const [activity, setActivity] = useState<ActivityType>('Walking');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    // Validate selections
    if (!environment) {
      setValidationError('Please select an environment.');
      return;
    }
    if (!duration) {
      setValidationError('Please select a duration.');
      return;
    }
    if (!activity) {
      setValidationError('Please select an activity.');
      return;
    }

    setValidationError(null);
    onGenerateMission({
      environment,
      durationMinutes: duration,
      activity,
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4">
      {/* Hero Welcome Header */}
      <div className="text-center mb-10 sm:mb-12 relative">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-[#E7EFEA] text-[#1B382B] flex items-center justify-center">
            <Leaf className="w-6 h-6 stroke-[1.5]" />
          </div>
        </div>

        <h1 className="font-serif-nature text-3xl sm:text-4xl md:text-5xl font-normal text-[#1B382B] tracking-tight leading-tight">
          Nature has commits, too.
        </h1>

        <p className="mt-3.5 text-base sm:text-lg text-[#5E7A6B] max-w-lg mx-auto font-normal leading-relaxed">
          Step outside. Notice something small. Document the world changing around you.
        </p>

        {/* Quiet Meta Line */}
        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs font-mono-changelog text-[#6B5B4D]">
          <span>Touch Grass AI Challenge</span>
          <span aria-hidden="true">·</span>
          <span>Open-Weight Gemma 4</span>
          <span aria-hidden="true">·</span>
          <span>Free Hosted Tier (₹0)</span>
        </div>
      </div>

      {/* Configuration Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#D8E3DC] rounded-2xl p-6 sm:p-8 shadow-xs"
      >
        {/* 1. Environment Selection */}
        <div className="mb-7">
          <label className="block text-xs font-mono-changelog uppercase tracking-wider text-[#5E7A6B] mb-2.5">
            01 / Select Your Environment
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {ENVIRONMENTS.map((env) => {
              const selected = environment === env.id;
              return (
                <button
                  type="button"
                  key={env.id}
                  onClick={() => {
                    setEnvironment(env.id);
                    setValidationError(null);
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selected
                      ? 'border-[#1B382B] bg-[#E7EFEA]/60 text-[#1B382B] font-semibold shadow-2xs'
                      : 'border-[#D8E3DC]/70 hover:border-[#8FA89B] text-[#5E7A6B] hover:bg-[#FBF8F1]'
                  }`}
                >
                  <span className="text-xl mb-1" role="img" aria-label={env.label}>
                    {env.icon}
                  </span>
                  <span className="text-xs">{env.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Duration & Activity Grid */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          {/* Duration */}
          <div>
            <label className="block text-xs font-mono-changelog uppercase tracking-wider text-[#5E7A6B] mb-2.5">
              02 / Duration
            </label>
            <div className="flex rounded-xl bg-[#F4F1EA] p-1 border border-[#D8E3DC]/60">
              {DURATIONS.map((mins) => {
                const selected = duration === mins;
                return (
                  <button
                    type="button"
                    key={mins}
                    onClick={() => {
                      setDuration(mins);
                      setValidationError(null);
                    }}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      selected
                        ? 'bg-white text-[#1B382B] shadow-xs font-semibold'
                        : 'text-[#5E7A6B] hover:text-[#1B382B]'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {mins} minutes
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activity Type */}
          <div>
            <label className="block text-xs font-mono-changelog uppercase tracking-wider text-[#5E7A6B] mb-2.5">
              03 / Activity Mode
            </label>
            <div className="flex rounded-xl bg-[#F4F1EA] p-1 border border-[#D8E3DC]/60">
              {ACTIVITIES.map((act) => {
                const selected = activity === act.id;
                return (
                  <button
                    type="button"
                    key={act.id}
                    onClick={() => {
                      setActivity(act.id);
                      setValidationError(null);
                    }}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      selected
                        ? 'bg-white text-[#1B382B] shadow-xs font-semibold'
                        : 'text-[#5E7A6B] hover:text-[#1B382B]'
                    }`}
                  >
                    {act.id === 'Walking' ? (
                      <Footprints className="w-3.5 h-3.5" />
                    ) : (
                      <Compass className="w-3.5 h-3.5" />
                    )}
                    {act.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Safety & Mission Philosophy Reminder */}
        <div className="mb-6 p-3.5 rounded-xl bg-[#F7F4EB] border border-[#E7EFEA] text-[12px] text-[#5E7A6B] flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-[#8FA89B] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            All missions are purely observational, respectful, and safe. Never touch wildlife, ingest plants, or cross onto private property.
          </p>
        </div>

        {/* Validation error if any */}
        {validationError && (
          <div className="mb-4 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2.5 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Hosted AI status notice bar */}
        <div className="mb-5 flex items-center justify-between text-xs font-mono-changelog text-[#6B5B4D] px-1">
          <span className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                ollamaStatus?.connected ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span>
              {ollamaStatus?.connected
                ? `Hosted AI Ready: ${ollamaStatus.model || 'Gemma 4 (Open-Weight)'}`
                : 'Hosted AI: Connecting to free tier...'}
            </span>
          </span>

          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="text-[#1B382B] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Terminal className="w-3 h-3 text-[#5E7A6B]" />
              <span>Provider Info</span>
            </button>
          )}
        </div>

        {/* Prominent Action Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-xl bg-[#1B382B] hover:bg-[#142B21] active:scale-[0.99] text-[#FBF8F1] font-medium text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-sm hover:shadow disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#8FA89B]" />
              <span>Synthesizing Observation Mission with Gemma 4...</span>
            </>
          ) : (
            <>
              <Compass className="w-4 h-4 text-[#8FA89B] group-hover:rotate-45 transition-transform" />
              <span>Find Something to Notice</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
