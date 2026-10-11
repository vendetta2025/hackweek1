import React, { useState } from 'react';
import { AlertCircle, Terminal, Copy, Check, ChevronDown, ChevronUp, RefreshCw, Laptop } from 'lucide-react';
import { AIProviderError } from '../services/aiProvider';

interface ErrorBannerProps {
  error: AIProviderError | string | null;
  onDismiss?: () => void;
  onRetry?: () => void;
  onOpenSettings?: () => void;
  isRetrying?: boolean;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  error,
  onDismiss,
  onRetry,
  onOpenSettings,
  isRetrying = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  if (!error) return null;

  const isStructured = typeof error === 'object' && 'isAIError' in error;
  const title = isStructured ? error.title : 'Action Could Not Complete';
  const message = isStructured ? error.message : String(error);
  const command = isStructured ? (error.terminalCommand || '') : '';
  const instructions = isStructured ? error.setupInstructions : '';
  const timestamp = isStructured ? error.timestamp : '';
  const rawDetails = isStructured ? error.rawDetails : '';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="alert"
      className="bg-[#FFFDF7] border border-[#E8DCC4] rounded-2xl p-5 sm:p-6 mb-6 text-[#2E2822] shadow-xs animate-in fade-in duration-200"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-[#FAF0D9] text-[#8C6212]">
          <AlertCircle className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h4 className="font-serif-nature font-medium text-base sm:text-lg text-[#1B382B]">
                {title}
              </h4>
              {timestamp && (
                <span className="text-[11px] font-mono-changelog text-[#8FA89B] hidden sm:inline">
                  [{timestamp}]
                </span>
              )}
            </div>

            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="text-xs text-[#6B5B4D] hover:text-[#1B382B] transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            )}
          </div>

          <p className="text-sm text-[#4E443B] mt-1.5 leading-relaxed">
            {message}
          </p>

          {instructions && (
            <div className="mt-3 text-xs text-[#5E5144] whitespace-pre-line bg-[#F8F5EE] border border-[#E8DCC4]/70 rounded-xl p-3.5 font-sans leading-relaxed">
              {instructions}
            </div>
          )}

          {command && (
            <div className="mt-3 flex items-center justify-between gap-2 bg-[#1B382B] text-[#E7EFEA] rounded-xl px-3.5 py-2.5 font-mono-changelog text-xs">
              <span className="truncate flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#8FA89B] shrink-0" />
                <code>{command}</code>
              </span>
              <button
                type="button"
                onClick={() => handleCopy(command)}
                className="flex items-center gap-1 text-[11px] text-[#A6C4B4] hover:text-white px-2.5 py-1 rounded-md bg-[#244A39] hover:bg-[#2D5A46] transition-colors shrink-0 cursor-pointer"
                title="Copy terminal command"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                disabled={isRetrying}
                className="px-3 py-1.5 rounded-lg bg-[#1B382B] hover:bg-[#142B21] text-[#FBF8F1] font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
                <span>{isRetrying ? 'Retrying...' : 'Retry Request'}</span>
              </button>
            )}

            {onOpenSettings && (
              <button
                type="button"
                onClick={onOpenSettings}
                className="text-[#1B382B] font-medium underline underline-offset-2 hover:text-[#142B21] transition-colors cursor-pointer"
              >
                Local Provider Settings & Guide →
              </button>
            )}

            {rawDetails && (
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="text-[#6B5B4D] hover:text-[#1B382B] flex items-center gap-1 transition-colors ml-auto cursor-pointer"
              >
                <span>{showDetails ? 'Hide details' : 'Show details'}</span>
                {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>

          {showDetails && rawDetails && (
            <pre className="mt-3 p-3 bg-neutral-900 text-neutral-300 rounded-lg font-mono-changelog text-[10px] overflow-x-auto max-h-36">
              {rawDetails}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
