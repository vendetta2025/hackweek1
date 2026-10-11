import React from 'react';
import { Sparkles, Terminal, BookOpen, Compass, ShieldCheck } from 'lucide-react';
import { OllamaStatus } from '../types';

interface NavbarProps {
  currentTab: 'discover' | 'journal';
  onSelectTab: (tab: 'discover' | 'journal') => void;
  savedCount: number;
  ollamaStatus: OllamaStatus | null;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  savedCount,
  ollamaStatus,
  onOpenSettings,
}) => {
  return (
    <header className="border-b border-[#D8E3DC] bg-[#FBF8F1]/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('discover')}
            className="flex items-center gap-2.5 text-left group"
          >
            {/* Minimalist Botanical Leaf SVG */}
            <div className="w-8 h-8 rounded-lg bg-[#1B382B] text-[#FBF8F1] flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 4 13C4 9.13 7.13 6 11 6c4.97 0 9 4.03 9 9a7 7 0 0 1-7 5z" />
                <path d="M11 6v14" />
                <path d="M7 10l4-4 4 4" />
              </svg>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono-changelog text-sm tracking-wider font-semibold text-[#1B382B]">
                  PATCHNOTES
                </span>
                <span className="text-[10px] font-mono-changelog text-[#6B5B4D] hidden sm:inline">
                  v0.1
                </span>
              </div>
              <p className="text-[11px] text-[#5E7A6B] leading-none hidden sm:block">
                Nature has commits, too.
              </p>
            </div>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onSelectTab('discover')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-all relative ${
              currentTab === 'discover'
                ? 'text-[#1B382B] font-semibold after:content-[""] after:absolute after:bottom-[-16px] after:left-0 after:right-0 after:h-[2px] after:bg-[#1B382B]'
                : 'text-[#5E7A6B] hover:text-[#1B382B]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              Discover
            </span>
          </button>

          <button
            onClick={() => onSelectTab('journal')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-all relative ${
              currentTab === 'journal'
                ? 'text-[#1B382B] font-semibold after:content-[""] after:absolute after:bottom-[-16px] after:left-0 after:right-0 after:h-[2px] after:bg-[#1B382B]'
                : 'text-[#5E7A6B] hover:text-[#1B382B]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              My Patchnotes
              {savedCount > 0 && (
                <span className="font-mono-changelog text-[11px] text-[#5E7A6B]">
                  ({savedCount})
                </span>
              )}
            </span>
          </button>
        </nav>

        {/* AI Engine Status Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSettings}
            title="Hosted Open-Weight AI Provider Info"
            className="flex items-center gap-2 px-2.5 py-1 text-xs border border-[#D8E3DC] rounded-md bg-white hover:bg-[#F7F4EB] transition-colors text-[#1B382B] shadow-2xs cursor-pointer"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                ollamaStatus?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="font-mono-changelog text-[11px] hidden md:inline">
              {ollamaStatus?.connected ? 'Gemma 4 (Open-Weight)' : 'Hosted AI'}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#5E7A6B]" />
          </button>
        </div>
      </div>
    </header>
  );
};
