import React from 'react';
import { VerticalPractice, KnowledgeItem, DocumentTemplate, DraftedDocument } from '../types';
import { MessageSquareText, FileEdit, Database, ShieldCheck, ArrowRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface OverviewViewProps {
  practice: VerticalPractice;
  knowledgeItems: KnowledgeItem[];
  templates: DocumentTemplate[];
  draftedDocuments: DraftedDocument[];
  onNavigateTab: (tab: 'simulator' | 'drafter' | 'vault' | 'compliance') => void;
  onSelectTemplateToDraft: (template: DocumentTemplate) => void;
  onOpenPracticeSelector: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  practice,
  knowledgeItems,
  templates,
  draftedDocuments,
  onNavigateTab,
  onSelectTemplateToDraft,
  onOpenPracticeSelector,
}) => {
  const practiceKnowledge = knowledgeItems.filter((k) => k.verticalId === practice.id);
  const practiceTemplates = templates.filter((t) => t.verticalId === practice.id);
  const practiceDrafts = draftedDocuments.filter((d) => d.verticalId === practice.id);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Banner Section */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-900 text-white shadow-sm">
        <div className="absolute inset-0 z-0">
          <img
            src={practice.heroImage}
            alt={practice.name}
            className="w-full h-full object-cover opacity-25"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 lg:p-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-neutral-300 mb-3">
            <span>Specialized Vertical AI</span>
            <span aria-hidden="true">·</span>
            <span>{practice.profession}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-sans text-balance">
            {practice.name}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
            {practice.tagline} Powered by proprietary business data, standard clauses, fee structures, and strict professional ethics guardrails.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('simulator')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-white text-neutral-900 hover:bg-neutral-100 transition-colors shadow-sm"
            >
              <MessageSquareText className="w-4 h-4 text-neutral-900" />
              <span>Simulate Client Inquiries</span>
            </button>

            <button
              onClick={() => onNavigateTab('drafter')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
            >
              <FileEdit className="w-4 h-4" />
              <span>Draft Practice Document</span>
            </button>

            <button
              onClick={onOpenPracticeSelector}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white transition-colors"
            >
              <span>Change Vertical Domain</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* High-Density Metric Strip (Tabular Figures) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>Grounded Knowledge Base</span>
            <Database className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-neutral-900 tabular-nums">
            {practiceKnowledge.length}
            <span className="text-xs font-normal text-neutral-500 ml-1">documents</span>
          </div>
          <p className="mt-1 text-[11px] text-neutral-500">
            {practiceKnowledge.filter((k) => k.isClientSafe).length} client-accessible · {practiceKnowledge.filter((k) => !k.isClientSafe).length} internal-only
          </p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>Citation Verification</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 tabular-nums">
            100%
            <span className="text-xs font-normal text-neutral-500 ml-1">grounded</span>
          </div>
          <p className="mt-1 text-[11px] text-neutral-500">
            Zero hallucination unknown protocol active
          </p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>Practice Templates</span>
            <FileEdit className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-neutral-900 tabular-nums">
            {practiceTemplates.length}
            <span className="text-xs font-normal text-neutral-500 ml-1">specialized</span>
          </div>
          <p className="mt-1 text-[11px] text-neutral-500">
            Jurisdiction: {practice.jurisdiction.split('&')[0].trim()}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>Foundation Engine</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-neutral-900">
            Gemini 3.8
            <span className="text-xs font-normal text-neutral-500 ml-1">Flash</span>
          </div>
          <p className="mt-1 text-[11px] text-neutral-500">
            Server-side RAG pipeline via Google GenAI SDK
          </p>
        </div>
      </div>

      {/* Mechanism-to-Outcome Storytelling Block */}
      <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-700 mb-4">
          How This Vertical AI Operates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-neutral-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] flex items-center justify-center font-bold">1</span>
              <span>Proprietary Knowledge Vault</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Upload your firm's retainer minimums, fee schedules, clinical fasting protocols, HOA covenants, or master contracts. The assistant learns only what your business provides.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-neutral-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] flex items-center justify-center font-bold">2</span>
              <span>Client Q&A with Strict Grounding</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Clients inquire via your website or portal. Answers cite specific clauses directly from your vault. If details are not in your data, it admits it and routes to human staff.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-neutral-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] flex items-center justify-center font-bold">3</span>
              <span>Domain-Specific Document Drafter</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Draft demand letters, retainers, prior auth appeals, or purchase counter-offers in seconds with standard firm protections and automated compliance audit inspection.
            </p>
          </div>
        </div>
      </div>

      {/* Two-Column Section: Available Templates & Recent Drafts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Specialized Document Templates for this Practice */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-900">
              Specialized Drafting Templates
            </h2>
            <button
              onClick={() => onNavigateTab('drafter')}
              className="text-xs font-semibold text-neutral-700 hover:text-neutral-950 flex items-center gap-1"
            >
              <span>View All Drafter Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {practiceTemplates.map((template) => (
              <div
                key={template.id}
                className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 transition-colors flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-neutral-900">
                      {template.title}
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {template.description}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 pt-1">
                    <span>{template.documentType}</span>
                    <span aria-hidden="true">·</span>
                    <span>{template.variables.length} parameters</span>
                    {template.suggestedJurisdiction && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{template.suggestedJurisdiction}</span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onSelectTemplateToDraft(template)}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors shrink-0 whitespace-nowrap"
                >
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Grounded Proprietary Knowledge Snapshot */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-900">
              Active Knowledge Vault
            </h2>
            <button
              onClick={() => onNavigateTab('vault')}
              className="text-xs font-semibold text-neutral-700 hover:text-neutral-950 flex items-center gap-1"
            >
              <span>Manage Vault</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {practiceKnowledge.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-neutral-200 bg-white space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-neutral-900 truncate">
                    {item.title}
                  </h4>
                  <span className={`text-[10px] font-semibold ${item.isClientSafe ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {item.isClientSafe ? 'Client Safe' : 'Internal Only'}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                  {item.content}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                  <span>{item.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.sourceRef}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Compliance Reminder Box */}
          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-600 space-y-1">
            <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-neutral-800" />
              <span>Practice Ethics & Disclaimer</span>
            </div>
            <p className="text-[11px] leading-relaxed text-neutral-500">
              {practice.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
