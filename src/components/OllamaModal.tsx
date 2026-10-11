import React from 'react';
import { X, Sparkles, RefreshCw, ShieldCheck, Cpu, CheckCircle2 } from 'lucide-react';
import { AIProviderStatus } from '../types';

interface ProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: AIProviderStatus | null;
  onRefreshStatus: () => Promise<void>;
  isChecking: boolean;
}

export const OllamaModal: React.FC<ProviderModalProps> = ({
  isOpen,
  onClose,
  status,
  onRefreshStatus,
  isChecking,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white border border-[#D8E3DC] rounded-2xl w-full max-w-xl shadow-xl overflow-hidden text-[#1B382B]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="provider-modal-title"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#D8E3DC] flex items-center justify-between bg-[#FBF8F1]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1B382B] text-[#FBF8F1] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 id="provider-modal-title" className="font-serif-nature text-lg sm:text-xl font-medium">
                Hosted Open-Weight AI Architecture
              </h3>
              <p className="text-xs text-[#5E7A6B]">
                Free Hosted Inference (₹0 Budget) · Touch Grass AI Challenge
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5E7A6B] hover:text-[#1B382B] hover:bg-[#E7EFEA] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto space-y-5">
          {/* Status Box */}
          <div className="p-4 rounded-xl border border-[#D8E3DC] bg-[#FCFAF5]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono-changelog uppercase tracking-wider text-[#5E7A6B]">
                Inference API Status
              </span>
              <button
                onClick={onRefreshStatus}
                disabled={isChecking}
                className="flex items-center gap-1 text-xs text-[#1B382B] hover:underline cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
                <span>Test Connection</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <span
                className={`w-3 h-3 rounded-full shrink-0 ${
                  status?.connected ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span className="font-medium text-sm">
                {status?.connected
                  ? 'Connected to Hosted Open-Weight Gemma API'
                  : 'Checking Hosted Inference Connection...'}
              </span>
            </div>

            <div className="mt-2 text-xs text-[#5E7A6B] flex items-center gap-2">
              <span>Model:</span>
              <span className="font-mono-changelog text-[#1B382B] font-medium">
                Gemma 4 Open-Weight (gemma-4-26b-a4b-it)
              </span>
            </div>
          </div>

          {/* Architecture Highlights */}
          <div className="space-y-3 text-xs">
            <h4 className="font-mono-changelog uppercase tracking-wider text-[#5E7A6B]">
              System Specifications
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-[#F7F4EB] border border-[#E7EFEA]">
                <span className="block font-semibold text-[#1B382B] mb-0.5">Budget & Cost</span>
                <span className="text-[#5E7A6B]">₹0 permanent free tier. Zero paid subscriptions or credit card requirements.</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F4EB] border border-[#E7EFEA]">
                <span className="block font-semibold text-[#1B382B] mb-0.5">Model Weights</span>
                <span className="text-[#5E7A6B]">Genuinely open-weight Google Gemma model family.</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F4EB] border border-[#E7EFEA]">
                <span className="block font-semibold text-[#1B382B] mb-0.5">Zero Local Setup</span>
                <span className="text-[#5E7A6B]">No Ollama daemons, port forwarding, or local model weight downloads required.</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F4EB] border border-[#E7EFEA]">
                <span className="block font-semibold text-[#1B382B] mb-0.5">Key Security</span>
                <span className="text-[#5E7A6B]">Server-side proxy strictly protects API keys. Never sent to browser client.</span>
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3.5 rounded-xl bg-[#F7F4EB] border border-[#E7EFEA] flex items-start gap-2.5 text-xs text-[#5E7A6B]">
            <ShieldCheck className="w-4 h-4 text-[#1B382B] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Local Journal Privacy:</strong> All personal field notes, observations, and timestamps remain exclusively inside your browser's <code className="font-mono-changelog text-[#1B382B]">localStorage</code>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#D8E3DC] bg-[#FCFAF5] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1B382B] hover:bg-[#142B21] text-[#FBF8F1] text-xs font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
