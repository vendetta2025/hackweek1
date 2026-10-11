/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StageIndicator, Stage } from './components/StageIndicator';
import { DiscoverStep } from './components/DiscoverStep';
import { ObserveStep } from './components/ObserveStep';
import { DocumentStep } from './components/DocumentStep';
import { JournalView } from './components/JournalView';
import { OllamaModal } from './components/OllamaModal';
import { ErrorBanner } from './components/ErrorBanner';
import {
  Environment,
  DurationMinutes,
  ActivityType,
  Mission,
  Patchnote,
  OllamaStatus,
} from './types';
import {
  generateMission,
  generatePatchnote,
  checkOllamaStatus,
  AIProviderError,
} from './services/aiProvider';
import {
  getSavedPatchnotes,
  savePatchnote,
  deletePatchnote,
} from './services/storage';

export default function App() {
  // Navigation & Workflow state
  const [currentTab, setCurrentTab] = useState<'discover' | 'journal'>('discover');
  const [currentStage, setCurrentStage] = useState<Stage>('discover');

  // Mission & Field Note state
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [currentPatchnote, setCurrentPatchnote] = useState<Patchnote | null>(null);
  const [savedPatchnotes, setSavedPatchnotes] = useState<Patchnote[]>([]);

  // Track last used mission parameters for seamless retry
  const [lastMissionParams, setLastMissionParams] = useState<{
    environment: Environment;
    durationMinutes: DurationMinutes;
    activity: ActivityType;
  } | null>(null);

  // Async states
  const [isGeneratingMission, setIsGeneratingMission] = useState(false);
  const [isGeneratingPatchnote, setIsGeneratingPatchnote] = useState(false);
  const [error, setError] = useState<AIProviderError | string | null>(null);

  // Ollama provider diagnostics state
  const [ollamaStatus, setOllamaStatus] = useState<OllamaStatus | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load saved notes & verify local provider on mount
  useEffect(() => {
    setSavedPatchnotes(getSavedPatchnotes());
    refreshProviderStatus();
  }, []);

  const refreshProviderStatus = async () => {
    setIsCheckingStatus(true);
    try {
      const status = await checkOllamaStatus();
      setOllamaStatus(status);
    } catch {
      // Ignored - status handles unreachable state
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Step 1: Generate Mission via local Ollama
  const handleGenerateMission = async (params: {
    environment: Environment;
    durationMinutes: DurationMinutes;
    activity: ActivityType;
  }) => {
    setLastMissionParams(params);
    setIsGeneratingMission(true);
    setError(null);

    try {
      const mission = await generateMission(params);
      setActiveMission(mission);
      setCurrentStage('observe');
    } catch (err: any) {
      setError(err);
      refreshProviderStatus();
    } finally {
      setIsGeneratingMission(false);
    }
  };

  // Retry mission generation
  const handleRetryMission = () => {
    if (lastMissionParams) {
      handleGenerateMission(lastMissionParams);
    } else {
      handleGenerateMission({
        environment: 'Park',
        durationMinutes: 10,
        activity: 'Walking',
      });
    }
  };

  // Step 2: Generate Field Note from real observation
  const handleSubmitObservation = async (observation: string) => {
    if (!activeMission) return;
    setIsGeneratingPatchnote(true);
    setError(null);

    try {
      const note = await generatePatchnote({
        missionTitle: activeMission.title,
        observation,
        environment: activeMission.environment,
        durationMinutes: activeMission.durationMinutes,
        activity: activeMission.activityType,
      });
      setCurrentPatchnote(note);
      setCurrentStage('document');
    } catch (err: any) {
      setError(err);
      refreshProviderStatus();
    } finally {
      setIsGeneratingPatchnote(false);
    }
  };

  // Step 3: Save Field Note to localStorage
  const handleSavePatchnote = (note: Patchnote) => {
    const updated = savePatchnote(note);
    setSavedPatchnotes(updated);
  };

  // Delete from Journal
  const handleDeletePatchnote = (id: string) => {
    const updated = deletePatchnote(id);
    setSavedPatchnotes(updated);
  };

  const isCurrentNoteSaved = Boolean(
    currentPatchnote && savedPatchnotes.some((p) => p.id === currentPatchnote.id)
  );

  return (
    <div className="min-h-screen bg-[#FBF8F1] flex flex-col font-sans selection:bg-[#E7EFEA] selection:text-[#1B382B]">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setError(null);
        }}
        savedCount={savedPatchnotes.length}
        ollamaStatus={ollamaStatus}
        onOpenSettings={() => setIsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 botanical-grain">
        {currentTab === 'discover' ? (
          <div>
            {/* 3-Stage Progress Indicator */}
            <StageIndicator
              currentStage={currentStage}
              onSelectStage={(stage) => setCurrentStage(stage)}
              canNavigateToObserve={Boolean(activeMission)}
              canNavigateToDocument={Boolean(currentPatchnote)}
            />

            <div className="max-w-2xl mx-auto px-4 pt-6">
              {/* Friendly Error Banner with Retry */}
              <ErrorBanner
                error={error}
                onDismiss={() => setError(null)}
                onRetry={handleRetryMission}
                isRetrying={isGeneratingMission}
                onOpenSettings={() => setIsModalOpen(true)}
              />
            </div>

            {/* Stages */}
            {currentStage === 'discover' && (
              <DiscoverStep
                onGenerateMission={handleGenerateMission}
                isLoading={isGeneratingMission}
                ollamaStatus={ollamaStatus}
                onOpenSettings={() => setIsModalOpen(true)}
              />
            )}

            {currentStage === 'observe' && activeMission && (
              <ObserveStep
                mission={activeMission}
                onSubmitObservation={handleSubmitObservation}
                onBackToDiscover={() => setCurrentStage('discover')}
                isLoading={isGeneratingPatchnote}
              />
            )}

            {currentStage === 'document' && currentPatchnote && (
              <DocumentStep
                patchnote={currentPatchnote}
                onSaveToJournal={handleSavePatchnote}
                onStartNewMission={() => {
                  setActiveMission(null);
                  setCurrentPatchnote(null);
                  setCurrentStage('discover');
                }}
                isSaved={isCurrentNoteSaved}
              />
            )}
          </div>
        ) : (
          <JournalView
            entries={savedPatchnotes}
            onDeleteEntry={handleDeletePatchnote}
            onGoToDiscover={() => {
              setCurrentTab('discover');
              setCurrentStage('discover');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#D8E3DC] py-6 px-4 bg-[#FBF8F1] text-xs text-[#5E7A6B]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono-changelog text-[11px]">
            <span className="font-semibold text-[#1B382B]">PATCHNOTES</span>
            <span aria-hidden="true">·</span>
            <span>Touch Grass Open-Source AI Hackathon</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Model: Gemma 4 (Open-Weight)</span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="hover:text-[#1B382B] underline underline-offset-2 transition-colors cursor-pointer"
            >
              Provider Info
            </button>
          </div>
        </div>
      </footer>

      {/* Local Ollama Configuration Modal */}
      <OllamaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        status={ollamaStatus}
        onRefreshStatus={refreshProviderStatus}
        isChecking={isCheckingStatus}
      />
    </div>
  );
}
