import React, { useState } from 'react';
import { Trash2, Calendar, GitCommit, Search, Download, Compass, Copy, Check, Filter } from 'lucide-react';
import { Patchnote, Environment } from '../types';

interface JournalViewProps {
  entries: Patchnote[];
  onDeleteEntry: (id: string) => void;
  onGoToDiscover: () => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
  entries,
  onDeleteEntry,
  onGoToDiscover,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnv, setSelectedEnv] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [allCopied, setAllCopied] = useState(false);

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.observed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.originalObservation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.missionTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEnv = selectedEnv === 'All' || entry.environment === selectedEnv;
    return matchesSearch && matchesEnv;
  });

  const handleCopySingle = (entry: Patchnote) => {
    const md = `### ${entry.title}
*Date: ${new Date(entry.date).toLocaleDateString()} | ${entry.environment}*
*Mission: ${entry.missionTitle}*

**Observed:**
${entry.observed}

**Interpretation:**
${entry.interpretation}

**Next Visit:**
${entry.nextVisitCue}

**Raw Note:**
"${entry.originalObservation}"
`;
    navigator.clipboard.writeText(md);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportAll = () => {
    if (entries.length === 0) return;
    const content = `# MY PATCHNOTES — Nature Changelog
Generated via Patchnotes (Touch Grass AI Challenge)
Exported on ${new Date().toLocaleDateString()}

${entries
  .map(
    (e, idx) => `## [${e.title}]
- Date: ${new Date(e.date).toLocaleDateString()}
- Environment: ${e.environment} (${e.durationMinutes}m, ${e.activityType})
- Mission: ${e.missionTitle}
- Model: ${e.model}

### + Observed:
${e.observed}

### ~ Interpretation:
${e.interpretation}

### → Look For Next Time:
${e.nextVisitCue}

### Raw Field Observation:
> ${e.originalObservation}

---
`
  )
  .join('\n')}`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `patchnotes-export-${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-changelog text-[#5E7A6B] mb-1">
            <GitCommit className="w-3.5 h-3.5 text-[#1B382B]" />
            <span>Local Nature Log</span>
          </div>
          <h1 className="font-serif-nature text-3xl sm:text-4xl font-medium text-[#1B382B]">
            My Patchnotes
          </h1>
          <p className="text-xs sm:text-sm text-[#5E7A6B] mt-1">
            Persisted securely on your device. Every commit documents real nature in transition.
          </p>
        </div>

        {entries.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportAll}
              className="px-3 py-1.5 rounded-lg border border-[#D8E3DC] hover:border-[#1B382B] text-xs font-medium text-[#1B382B] flex items-center gap-1.5 bg-white transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#5E7A6B]" />
              <span>Export All (.md)</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar (if has entries) */}
      {entries.length > 0 && (
        <div className="bg-white border border-[#D8E3DC] rounded-xl p-3 mb-6 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#8FA89B] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search observations, cues, or titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs text-[#1B382B] placeholder:text-[#8FA89B] bg-transparent focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-[#F4F1EA] rounded-lg">
            {['All', 'Campus', 'Street', 'Park', 'Garden', 'Balcony'].map((env) => (
              <button
                key={env}
                onClick={() => setSelectedEnv(env)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  selectedEnv === env
                    ? 'bg-white text-[#1B382B] shadow-2xs font-semibold'
                    : 'text-[#5E7A6B] hover:text-[#1B382B]'
                }`}
              >
                {env}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {entries.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white border border-[#D8E3DC] rounded-2xl shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-[#E7EFEA] text-[#1B382B] flex items-center justify-center mx-auto mb-4">
            <Compass className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 className="font-serif-nature text-2xl text-[#1B382B] mb-2 font-medium">
            No patchnotes logged yet.
          </h3>
          <p className="text-sm text-[#5E7A6B] max-w-md mx-auto mb-6 leading-relaxed">
            Step outside for five or ten minutes, notice a leaf pattern, shadow shift, or bird sound, and commit your first observation.
          </p>
          <button
            onClick={onGoToDiscover}
            className="px-6 py-3 rounded-xl bg-[#1B382B] hover:bg-[#142B21] text-[#FBF8F1] font-medium text-xs sm:text-sm inline-flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Compass className="w-4 h-4 text-[#8FA89B]" />
            <span>Find an Observation Mission</span>
          </button>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-12 bg-white border border-[#D8E3DC] rounded-xl text-[#5E7A6B] text-xs">
          No entries matched your search filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => {
            const isExpanded = expandedId === entry.id;
            return (
              <article
                key={entry.id}
                className="bg-white border border-[#D8E3DC] hover:border-[#8FA89B] transition-colors rounded-xl p-5 sm:p-6 shadow-2xs relative"
              >
                {/* Meta unboxed */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-xs font-mono-changelog text-[#6B5B4D]">
                    <span>
                      {new Date(entry.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{entry.environment}</span>
                    <span aria-hidden="true">·</span>
                    <span>{entry.activityType}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#8FA89B]">{entry.model}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopySingle(entry)}
                      title="Copy note"
                      className="p-1 text-[#8FA89B] hover:text-[#1B382B] transition-colors cursor-pointer"
                    >
                      {copiedId === entry.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete patchnote "${entry.title}"?`)) {
                          onDeleteEntry(entry.id);
                        }
                      }}
                      title="Delete entry"
                      className="p-1 text-[#8FA89B] hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-serif-nature text-xl sm:text-2xl text-[#1B382B] font-medium mb-1">
                  {entry.title}
                </h3>
                <p className="text-[11px] font-mono-changelog text-[#5E7A6B] mb-4">
                  Prompt: {entry.missionTitle}
                </p>

                {/* Observed */}
                <div className="text-sm text-[#2E2822] mb-3 leading-relaxed">
                  <span className="font-mono-changelog text-[10px] uppercase tracking-wider text-[#5E7A6B] block mb-0.5">
                    What was noticed
                  </span>
                  <p>{entry.observed}</p>
                </div>

                {/* Interpretation */}
                <div className="p-3 rounded-lg bg-[#F7F4EB] border border-[#E7EFEA] text-xs text-[#2E2822] mb-3 leading-relaxed">
                  <span className="font-mono-changelog text-[10px] uppercase tracking-wider text-[#6B5B4D] block mb-0.5">
                    Field Theory
                  </span>
                  <p>{entry.interpretation}</p>
                </div>

                {/* Next Visit Cue */}
                <div className="text-xs text-[#1B382B] mb-3">
                  <span className="font-mono-changelog text-[10px] uppercase tracking-wider text-[#5E7A6B] block mb-0.5">
                    Next visit cue
                  </span>
                  <p className="italic">→ {entry.nextVisitCue}</p>
                </div>

                {/* Original Observation Toggle */}
                <div className="pt-3 border-t border-[#D8E3DC]/60 flex items-center justify-between text-[11px] text-[#5E7A6B]">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                    className="hover:text-[#1B382B] transition-colors cursor-pointer"
                  >
                    {isExpanded ? 'Hide raw observation' : 'View raw observation'}
                  </button>

                  <span className="font-mono-changelog text-[#8FA89B]">
                    {entry.durationMinutes}m observation
                  </span>
                </div>

                {isExpanded && (
                  <div className="mt-2 p-2.5 bg-[#FCFAF5] rounded border border-[#D8E3DC]/60 text-xs text-[#5E7A6B] italic">
                    "{entry.originalObservation}"
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
