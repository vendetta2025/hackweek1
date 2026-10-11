import React, { useState } from 'react';
import { Bookmark, Check, Copy, ArrowRight, RotateCcw, GitCommit, Calendar, Sparkles } from 'lucide-react';
import { Patchnote } from '../types';

interface DocumentStepProps {
  patchnote: Patchnote;
  onSaveToJournal: (patchnote: Patchnote) => void;
  onStartNewMission: () => void;
  isSaved: boolean;
}

export const DocumentStep: React.FC<DocumentStepProps> = ({
  patchnote,
  onSaveToJournal,
  onStartNewMission,
  isSaved,
}) => {
  const [copied, setCopied] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const handleCopy = () => {
    const text = `# ${patchnote.title}
*Date: ${new Date(patchnote.date).toLocaleDateString()} | ${patchnote.environment} | ${patchnote.durationMinutes}min*
*Mission: ${patchnote.missionTitle}*

## What Was Observed
${patchnote.observed}

## Possible Interpretation
${patchnote.interpretation}

## Next Visit Cue
${patchnote.nextVisitCue}

---
Generated with local open-weight AI (${patchnote.model}) · PATCHNOTES`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4">
      {/* Success banner */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-xs font-mono-changelog text-[#5E7A6B]">
          <GitCommit className="w-4 h-4 text-[#1B382B]" />
          <span>Commit ready to merge to your field journal</span>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs text-[#5E7A6B] hover:text-[#1B382B] transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Copied note</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy as Markdown</span>
            </>
          )}
        </button>
      </div>

      {/* Field Note Card */}
      <article className="bg-white border border-[#D8E3DC] rounded-2xl p-6 sm:p-9 shadow-xs mb-8 relative">
        {/* Header Metadata (unboxed, separated by middots) */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono-changelog text-[#6B5B4D] mb-4">
          <span>{new Date(patchnote.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <span aria-hidden="true">·</span>
          <span>{patchnote.environment}</span>
          <span aria-hidden="true">·</span>
          <span>{patchnote.activityType}</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#8FA89B]">{patchnote.model}</span>
        </div>

        {/* Patch Title */}
        <h2 className="font-serif-nature text-2xl sm:text-3xl font-medium text-[#1B382B] mb-2 leading-snug">
          {patchnote.title}
        </h2>

        {/* Mission Kicker */}
        <p className="text-xs text-[#5E7A6B] font-mono-changelog mb-7">
          Mission prompt: {patchnote.missionTitle}
        </p>

        {/* Section 1: Observed */}
        <div className="mb-6">
          <span className="block text-[11px] font-mono-changelog uppercase tracking-wider text-[#5E7A6B] mb-1.5">
            + What Was Observed
          </span>
          <p className="text-sm sm:text-base text-[#1B382B] leading-relaxed">
            {patchnote.observed}
          </p>
        </div>

        {/* Section 2: Interpretation */}
        <div className="mb-6 p-4 rounded-xl bg-[#F7F4EB] border border-[#E7EFEA]">
          <span className="block text-[11px] font-mono-changelog uppercase tracking-wider text-[#6B5B4D] mb-1.5">
            ~ Possible Interpretation (Unverified Field Theory)
          </span>
          <p className="text-sm text-[#2E2822] leading-relaxed">
            {patchnote.interpretation}
          </p>
        </div>

        {/* Section 3: Next Visit Cue */}
        <div className="mb-6">
          <span className="block text-[11px] font-mono-changelog uppercase tracking-wider text-[#5E7A6B] mb-1.5">
            → What to Look For Next Visit
          </span>
          <p className="text-sm text-[#1B382B] leading-relaxed">
            {patchnote.nextVisitCue}
          </p>
        </div>

        {/* Toggle Original Observation */}
        <div className="pt-4 border-t border-[#D8E3DC]/60">
          <button
            type="button"
            onClick={() => setShowOriginal(!showOriginal)}
            className="text-xs text-[#5E7A6B] hover:text-[#1B382B] transition-colors cursor-pointer"
          >
            {showOriginal ? 'Hide original raw observation' : 'Show original raw observation'}
          </button>
          {showOriginal && (
            <p className="mt-2 text-xs italic text-[#6B5B4D] bg-[#FCFAF5] p-3 rounded-lg border border-[#D8E3DC]/60">
              "{patchnote.originalObservation}"
            </p>
          )}
        </div>
      </article>

      {/* Action Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={onStartNewMission}
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#D8E3DC] hover:border-[#1B382B] text-[#1B382B] font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#5E7A6B]" />
          <span>Start Another Mission</span>
        </button>

        <button
          type="button"
          onClick={() => onSaveToJournal(patchnote)}
          disabled={isSaved}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs ${
            isSaved
              ? 'bg-[#E7EFEA] text-[#1B382B] border border-[#D8E3DC] cursor-default opacity-90'
              : 'bg-[#1B382B] hover:bg-[#142B21] text-[#FBF8F1] cursor-pointer'
          }`}
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Saved to My Patchnotes</span>
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4 text-[#8FA89B]" />
              <span>Save to My Patchnotes</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
