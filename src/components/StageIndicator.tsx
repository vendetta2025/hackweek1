import React from 'react';
import { Check } from 'lucide-react';

export type Stage = 'discover' | 'observe' | 'document';

interface StageIndicatorProps {
  currentStage: Stage;
  onSelectStage?: (stage: Stage) => void;
  canNavigateToObserve?: boolean;
  canNavigateToDocument?: boolean;
}

export const StageIndicator: React.FC<StageIndicatorProps> = ({
  currentStage,
  onSelectStage,
  canNavigateToObserve = false,
  canNavigateToDocument = false,
}) => {
  const stages: { id: Stage; label: string; number: string; enabled: boolean }[] = [
    { id: 'discover', label: 'Discover', number: '01', enabled: true },
    { id: 'observe', label: 'Observe', number: '02', enabled: canNavigateToObserve },
    { id: 'document', label: 'Document', number: '03', enabled: canNavigateToDocument },
  ];

  return (
    <div className="py-4 border-b border-[#D8E3DC]/60">
      <div className="max-w-2xl mx-auto px-4 flex items-center justify-between text-xs">
        {stages.map((stage, idx) => {
          const isCurrent = currentStage === stage.id;
          const isPassed =
            (currentStage === 'observe' && stage.id === 'discover') ||
            (currentStage === 'document' && (stage.id === 'discover' || stage.id === 'observe'));

          return (
            <React.Fragment key={stage.id}>
              <button
                disabled={!stage.enabled}
                onClick={() => onSelectStage && stage.enabled && onSelectStage(stage.id)}
                className={`flex items-center gap-2 transition-colors ${
                  isCurrent
                    ? 'text-[#1B382B] font-semibold cursor-default'
                    : isPassed
                    ? 'text-[#5E7A6B] hover:text-[#1B382B] cursor-pointer'
                    : 'text-[#8FA89B]/70 cursor-not-allowed'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-mono-changelog text-[10px] transition-colors ${
                    isCurrent
                      ? 'bg-[#1B382B] text-[#FBF8F1]'
                      : isPassed
                      ? 'bg-[#E7EFEA] text-[#1B382B]'
                      : 'border border-[#D8E3DC] text-[#8FA89B]'
                  }`}
                >
                  {isPassed ? <Check className="w-3 h-3 stroke-[2.5]" /> : stage.number}
                </span>
                <span className="tracking-wide">{stage.label}</span>
              </button>

              {idx < stages.length - 1 && (
                <div
                  className={`flex-1 mx-3 h-[1px] ${
                    isPassed ? 'bg-[#5E7A6B]/40' : 'bg-[#D8E3DC]'
                  }`}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
