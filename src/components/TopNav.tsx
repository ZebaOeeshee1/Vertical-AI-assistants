import React from 'react';
import { VerticalPractice } from '../types';
import { Shield, Sparkles, ChevronDown, FileText } from 'lucide-react';

interface TopNavProps {
  activeTab: 'overview' | 'simulator' | 'drafter' | 'vault' | 'compliance';
  setActiveTab: (tab: 'overview' | 'simulator' | 'drafter' | 'vault' | 'compliance') => void;
  activePractice: VerticalPractice;
  onOpenPracticeSelector: () => void;
  onNewDraftClick: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  activePractice,
  onOpenPracticeSelector,
  onNewDraftClick,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 rounded"
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-base font-bold tracking-tight text-neutral-900 font-sans">
              Praxis Vertical AI
            </span>
          </button>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
            <button
              onClick={() => setActiveTab('overview')}
              className={`transition-colors py-1 relative ${
                activeTab === 'overview'
                  ? 'text-neutral-950 font-semibold'
                  : 'hover:text-neutral-950'
              }`}
            >
              Overview
              {activeTab === 'overview' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`transition-colors py-1 relative ${
                activeTab === 'simulator'
                  ? 'text-neutral-950 font-semibold'
                  : 'hover:text-neutral-950'
              }`}
            >
              Client Simulator
              {activeTab === 'simulator' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('drafter')}
              className={`transition-colors py-1 relative ${
                activeTab === 'drafter'
                  ? 'text-neutral-950 font-semibold'
                  : 'hover:text-neutral-950'
              }`}
            >
              Document Drafter
              {activeTab === 'drafter' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('vault')}
              className={`transition-colors py-1 relative ${
                activeTab === 'vault'
                  ? 'text-neutral-950 font-semibold'
                  : 'hover:text-neutral-950'
              }`}
            >
              Knowledge Vault
              {activeTab === 'vault' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('compliance')}
              className={`transition-colors py-1 relative ${
                activeTab === 'compliance'
                  ? 'text-neutral-950 font-semibold'
                  : 'hover:text-neutral-950'
              }`}
            >
              Compliance Audit
              {activeTab === 'compliance' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 rounded-full" />
              )}
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            {/* Practice Selector Button */}
            <button
              onClick={onOpenPracticeSelector}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors border border-neutral-200/80"
              title="Switch vertical practice or profession"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span className="max-w-[130px] sm:max-w-[180px] truncate font-semibold">
                {activePractice.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            </button>

            {/* Quick Action: New Draft */}
            <button
              onClick={onNewDraftClick}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-sm whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Draft Document</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
