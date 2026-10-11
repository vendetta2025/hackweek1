import React, { useState } from 'react';
import { Eye, ArrowLeft, Send, Sparkles, Loader2, HelpCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { Mission } from '../types';

interface ObserveStepProps {
  mission: Mission;
  onSubmitObservation: (observation: string) => void;
  onBackToDiscover: () => void;
  isLoading: boolean;
}

export const ObserveStep: React.FC<ObserveStepProps> = ({
  mission,
  onSubmitObservation,
  onBackToDiscover,
  isLoading,
}) => {
  const [hasReturned, setHasReturned] = useState(false);
  const [observationText, setObservationText] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!observationText.trim()) {
      setValidationError('Please share a sentence or two of what you actually noticed.');
      return;
    }
    setValidationError('');
    onSubmitObservation(observationText.trim());
  };

  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={onBackToDiscover}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 text-xs text-[#5E7A6B] hover:text-[#1B382B] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Choose another environment or duration</span>
        </button>
      </div>

      {/* Mission Card */}
      <div className="bg-white border border-[#D8E3DC] rounded-2xl p-6 sm:p-8 shadow-xs mb-6 relative overflow-hidden">
        {/* Subtle decorative nature watermark icon */}
        <div className="absolute right-4 top-4 text-[#E7EFEA]/60 pointer-events-none">
          <Eye className="w-24 h-24 stroke-[0.7]" />
        </div>

        {/* Quiet unboxed metadata */}
        <div className="flex items-center gap-2 text-xs font-mono-changelog text-[#5E7A6B] mb-3">
          <span>{mission.environment}</span>
          <span aria-hidden="true">·</span>
          <span>{mission.durationMinutes} min</span>
          <span aria-hidden="true">·</span>
          <span>{mission.activityType}</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#8FA89B]">{mission.model}</span>
        </div>

        {/* Mission Title */}
        <h2 className="font-serif-nature text-2xl sm:text-3xl text-[#1B382B] font-medium leading-snug mb-5">
          {mission.title}
        </h2>

        {/* Primary Activity */}
        <div className="mb-6 p-4 rounded-xl bg-[#F7F4EB] border border-[#E7EFEA]">
          <span className="block text-[11px] font-mono-changelog uppercase text-[#5E7A6B] tracking-wider mb-1">
            Core Action
          </span>
          <p className="text-sm sm:text-base text-[#1B382B] font-medium leading-relaxed">
            {mission.activity}
          </p>
        </div>

        {/* Three Things to Notice */}
        <div className="mb-6">
          <h3 className="text-xs font-mono-changelog uppercase text-[#5E7A6B] tracking-wider mb-3">
            Three Things to Notice
          </h3>
          <ul className="space-y-2.5">
            {mission.noticeItems.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm text-[#2E2822] leading-relaxed"
              >
                <span className="w-5 h-5 rounded-full bg-[#E7EFEA] text-[#1B382B] font-mono-changelog text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* One Question to Think About */}
        <div className="pt-4 border-t border-[#D8E3DC]/60">
          <div className="flex items-start gap-2.5 text-xs text-[#5E7A6B]">
            <HelpCircle className="w-4 h-4 text-[#8FA89B] shrink-0 mt-0.5" />
            <div>
              <span className="font-mono-changelog text-[10px] uppercase tracking-wider block mb-0.5">
                Reflective Thought
              </span>
              <p className="font-serif-nature italic text-sm text-[#1B382B]">
                "{mission.question}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Observation Flow Toggle */}
      {!hasReturned ? (
        <div className="text-center p-8 bg-[#F7F4EB] border border-[#E7EFEA] rounded-2xl">
          <p className="text-base sm:text-lg text-[#1B382B] font-medium mb-2 font-serif-nature">
            Your mission is ready. Put your phone away and go explore.
          </p>
          <p className="text-xs sm:text-sm text-[#5E7A6B] max-w-md mx-auto mb-6">
            Take {mission.durationMinutes} minutes outdoors without screens. Look closely, breathe, and return when you are done.
          </p>
          <button
            type="button"
            onClick={() => setHasReturned(true)}
            className="py-3 px-8 rounded-xl bg-[#1B382B] hover:bg-[#142B21] text-[#FBF8F1] font-medium text-sm transition-all shadow-sm hover:shadow cursor-pointer inline-flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-[#8FA89B]" />
            <span>I'm Back</span>
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#D8E3DC] rounded-2xl p-6 sm:p-8 shadow-xs animate-in fade-in duration-300"
        >
          <div className="mb-4">
            <label
              htmlFor="observation"
              className="block font-serif-nature text-xl text-[#1B382B] font-medium mb-1.5"
            >
              What did you notice?
            </label>
            <p className="text-xs text-[#5E7A6B] leading-relaxed">
              Write a few honest sentences about what you actually observed. No need to sound poetic—describe textures, sounds, movement, or light.
            </p>
          </div>

          <textarea
            id="observation"
            rows={4}
            value={observationText}
            onChange={(e) => {
              setObservationText(e.target.value);
              if (validationError) setValidationError('');
            }}
            disabled={isLoading}
            placeholder="e.g. Under the large oak tree, the soil was dry on the surface but dark brown beneath the leaves. Two sparrows landed near the water sprinkler and paused for several seconds before darting away..."
            className="w-full p-4 rounded-xl border border-[#D8E3DC] focus:border-[#1B382B] bg-[#FCFAF5] text-sm text-[#1B382B] placeholder:text-[#A0B0A7] transition-all focus:outline-none resize-none leading-relaxed"
          />

          {validationError && (
            <p className="text-xs text-rose-600 mt-2 font-medium">
              {validationError}
            </p>
          )}

          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setHasReturned(false)}
              disabled={isLoading}
              className="text-xs text-[#5E7A6B] hover:text-[#1B382B] transition-colors"
            >
              Back to mission card
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="py-3 px-6 rounded-xl bg-[#1B382B] hover:bg-[#142B21] text-[#FBF8F1] font-medium text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm hover:shadow disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8FA89B]" />
                  <span>Generating Field Note...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-[#8FA89B]" />
                  <span>Create My Patchnote</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
