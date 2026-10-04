import React, { useState } from 'react';
import { VerticalPractice, KnowledgeItem, DocumentTemplate, DraftedDocument, ComplianceAuditReport } from '../types';
import { draftDocument, analyzeCompliance } from '../services/api';
import { FileEdit, Sparkles, Copy, Check, Download, Printer, ShieldAlert, CheckCircle2, RefreshCw, AlertTriangle, ArrowRight, Eye, Edit3 } from 'lucide-react';

interface DocumentDrafterViewProps {
  practice: VerticalPractice;
  knowledgeItems: KnowledgeItem[];
  templates: DocumentTemplate[];
  selectedTemplate: DocumentTemplate | null;
  setSelectedTemplate: (template: DocumentTemplate | null) => void;
  onSaveDraft: (doc: DraftedDocument) => void;
}

export const DocumentDrafterView: React.FC<DocumentDrafterViewProps> = ({
  practice,
  knowledgeItems,
  templates,
  selectedTemplate,
  setSelectedTemplate,
  onSaveDraft,
}) => {
  const practiceTemplates = templates.filter((t) => t.verticalId === practice.id);
  const currentTemplate = selectedTemplate || practiceTemplates[0] || null;

  // Form State
  const [recipient, setRecipient] = useState(
    currentTemplate?.variables?.find((v) => v.key.toLowerCase().includes('client') || v.key.toLowerCase().includes('buyer') || v.key.toLowerCase().includes('target') || v.key.toLowerCase().includes('patient'))?.defaultValue || 'Prospective Counterparty LLC'
  );
  const [matterDetails, setMatterDetails] = useState(currentTemplate?.defaultMatterDetails || '');
  const [jurisdiction, setJurisdiction] = useState(currentTemplate?.suggestedJurisdiction || practice.jurisdiction);
  const [variableValues, setVariableValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    currentTemplate?.variables.forEach((v) => {
      init[v.key] = v.defaultValue || '';
    });
    return init;
  });
  const [selectedKnowledgeIds, setSelectedKnowledgeIds] = useState<string[]>(() => {
    // Select relevant knowledge items for this practice
    return knowledgeItems
      .filter((k) => k.verticalId === practice.id)
      .slice(0, 3)
      .map((k) => k.id);
  });
  const [customInstructions, setCustomInstructions] = useState('');

  // Output State
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftedText, setDraftedText] = useState<string | null>(null);
  const [draftMetrics, setDraftMetrics] = useState<any>(null);
  const [activeOutputTab, setActiveOutputTab] = useState<'document' | 'compliance' | 'metrics'>('document');
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [copied, setCopied] = useState(false);
  const [auditReport, setAuditReport] = useState<ComplianceAuditReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  // Update form fields when template changes
  const handleSelectTemplate = (tmpl: DocumentTemplate) => {
    setSelectedTemplate(tmpl);
    setMatterDetails(tmpl.defaultMatterDetails);
    if (tmpl.suggestedJurisdiction) setJurisdiction(tmpl.suggestedJurisdiction);
    const newVars: Record<string, string> = {};
    tmpl.variables.forEach((v) => {
      newVars[v.key] = v.defaultValue || '';
    });
    setVariableValues(newVars);
  };

  const handleVariableChange = (key: string, val: string) => {
    setVariableValues((prev) => ({ ...prev, [key]: val }));
  };

  const toggleKnowledgeDoc = (id: string) => {
    setSelectedKnowledgeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleGenerateDraft = async () => {
    if (!currentTemplate) return;
    setIsDrafting(true);
    setAuditReport(null);

    const activeGroundingDocs = knowledgeItems.filter((k) =>
      selectedKnowledgeIds.includes(k.id)
    );

    try {
      const response = await draftDocument({
        businessName: practice.name,
        profession: practice.profession,
        documentType: currentTemplate.documentType,
        templateTitle: currentTemplate.title,
        clientOrTarget: recipient,
        matterDetails,
        variables: variableValues,
        knowledgeItems: activeGroundingDocs,
        customInstructions,
        jurisdiction,
      });

      setDraftedText(response.document);
      setDraftMetrics(response.metrics);
      setActiveOutputTab('document');

      // Auto-save to session drafts
      onSaveDraft({
        id: `draft-${Date.now()}`,
        verticalId: practice.id,
        title: `${currentTemplate.documentType} - ${recipient || 'Matter'}`,
        documentType: currentTemplate.documentType,
        clientOrTarget: recipient,
        content: response.document,
        createdAt: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
        metrics: response.metrics,
      });
    } catch (err: any) {
      console.error('Draft error:', err);
      alert(`Failed to draft document: ${err.message}`);
    } finally {
      setIsDrafting(false);
    }
  };

  const handleRunAudit = async () => {
    if (!draftedText) return;
    setIsAuditing(true);
    try {
      const report = await analyzeCompliance({
        documentText: draftedText,
        profession: practice.profession,
        verticalId: practice.id,
      });
      setAuditReport(report);
      setActiveOutputTab('compliance');
    } catch (err: any) {
      console.error('Audit error:', err);
      alert('Failed to audit document compliance.');
    } finally {
      setIsAuditing(false);
    }
  };

  const handleCopy = () => {
    if (!draftedText) return;
    navigator.clipboard.writeText(draftedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!draftedText || !currentTemplate) return;
    const blob = new Blob([draftedText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentTemplate.documentType.replace(/\s+/g, '_')}_${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            <span>Specialized Document Engine</span>
            <span aria-hidden="true">·</span>
            <span className="text-neutral-900 font-bold">{practice.name}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-1">
            Vertical Document Drafter
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
            Generates execution-ready contracts, demand letters, clinical prior auth appeals, and counter-offers conforming to your business data and standard clauses.
          </p>
        </div>

        {/* Template Selector Pill Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {practiceTemplates.map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelectTemplate(t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentTemplate?.id === t.id
                  ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {t.title.split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Grounding Inputs (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-xl border border-neutral-200 bg-white shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                1. Drafting Parameters
              </span>
              <span className="text-[11px] text-neutral-500">
                {currentTemplate?.documentType}
              </span>
            </div>

            {/* Recipient / Counterparty */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Recipient / Client / Target Entity *
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. Vortex Media Group LLC / Sarah Jenkins"
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            {/* Dynamic Template Variables */}
            {currentTemplate && currentTemplate.variables.length > 0 && (
              <div className="space-y-3 pt-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block">
                  Template-Specific Variables
                </span>
                {currentTemplate.variables.map((v) => (
                  <div key={v.key}>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      {v.label}
                    </label>
                    <input
                      type={v.type === 'number' ? 'number' : 'text'}
                      value={variableValues[v.key] || ''}
                      onChange={(e) => handleVariableChange(v.key, e.target.value)}
                      placeholder={v.placeholder}
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Matter / Factual Details */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Matter Details & Factual Recitals *
              </label>
              <textarea
                rows={3}
                value={matterDetails}
                onChange={(e) => setMatterDetails(e.target.value)}
                placeholder="Provide factual chronology, invoices breached, symptoms, or property terms..."
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 leading-relaxed"
              />
            </div>

            {/* Jurisdiction / Standards */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Governing Jurisdiction / Standard
              </label>
              <input
                type="text"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            {/* Custom Instructions */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Special Instructions (Optional)
              </label>
              <input
                type="text"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="e.g. Include 10-day cure deadline; emphasize statutory interest under § 3289"
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>

          {/* Proprietary Grounding Context Selector */}
          <div className="p-5 rounded-xl border border-neutral-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                2. Enforced Business Data
              </span>
              <span className="text-[11px] text-neutral-500 font-mono tabular-nums">
                {selectedKnowledgeIds.length} active
              </span>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Select which proprietary knowledge clauses and fee schedules to enforce in the draft:
            </p>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {knowledgeItems
                .filter((k) => k.verticalId === practice.id)
                .map((k) => {
                  const isChecked = selectedKnowledgeIds.includes(k.id);
                  return (
                    <label
                      key={k.id}
                      className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? 'border-neutral-900 bg-neutral-50/80 font-medium text-neutral-900'
                          : 'border-neutral-200 hover:bg-neutral-50 text-neutral-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleKnowledgeDoc(k.id)}
                        className="mt-0.5 rounded text-neutral-900 focus:ring-neutral-900"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold truncate">{k.title}</div>
                        <div className="text-[10px] text-neutral-400 truncate">{k.category} · {k.sourceRef}</div>
                      </div>
                    </label>
                  );
                })}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateDraft}
            disabled={isDrafting || !matterDetails.trim()}
            className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            {isDrafting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Drafting with Gemini 3.8 Flash...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Draft Complete {currentTemplate?.documentType || 'Document'}</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Interactive Document Canvas & Inspection (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden flex flex-col min-h-[640px]">
            {/* Canvas Header & Action Controls */}
            <div className="px-5 py-3 border-b border-neutral-200 bg-neutral-50 flex flex-wrap items-center justify-between gap-3">
              {/* Output Sub-Tabs */}
              <div className="flex items-center gap-1 p-1 bg-neutral-200/60 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setActiveOutputTab('document')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    activeOutputTab === 'document'
                      ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Document Text
                </button>
                <button
                  onClick={() => setActiveOutputTab('compliance')}
                  className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1 ${
                    activeOutputTab === 'compliance'
                      ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Compliance Audit</span>
                  {auditReport && (
                    <span className={`w-1.5 h-1.5 rounded-full ${auditReport.riskRating === 'Low' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  )}
                </button>
                {draftMetrics && (
                  <button
                    onClick={() => setActiveOutputTab('metrics')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      activeOutputTab === 'metrics'
                        ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    Metrics & Clauses
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                {draftedText && (
                  <>
                    <button
                      onClick={() => setIsEditingDraft(!isEditingDraft)}
                      className={`p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                        isEditingDraft ? 'bg-neutral-200 text-neutral-900' : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                      title={isEditingDraft ? 'View formatted output' : 'Edit raw draft'}
                    >
                      {isEditingDraft ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline text-[11px]">{isEditingDraft ? 'Preview' : 'Edit'}</span>
                    </button>

                    <button
                      onClick={handleCopy}
                      className="p-1.5 text-neutral-600 hover:text-neutral-900 rounded-md hover:bg-neutral-100 transition-colors text-xs flex items-center gap-1"
                      title="Copy to clipboard"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={handleDownload}
                      className="p-1.5 text-neutral-600 hover:text-neutral-900 rounded-md hover:bg-neutral-100 transition-colors text-xs flex items-center gap-1"
                      title="Download Markdown"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={handlePrint}
                      className="p-1.5 text-neutral-600 hover:text-neutral-900 rounded-md hover:bg-neutral-100 transition-colors text-xs flex items-center gap-1"
                      title="Print document"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={handleRunAudit}
                      disabled={isAuditing}
                      className="px-2.5 py-1 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors flex items-center gap-1 ml-1"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-neutral-700" />
                      <span>{isAuditing ? 'Auditing...' : 'Run Audit'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Canvas Body */}
            <div className="flex-1 p-6 overflow-y-auto">
              {draftedText ? (
                <>
                  {activeOutputTab === 'document' && (
                    <div>
                      {isEditingDraft ? (
                        <textarea
                          rows={24}
                          value={draftedText}
                          onChange={(e) => setDraftedText(e.target.value)}
                          className="w-full h-full p-4 font-mono text-xs text-neutral-800 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 leading-relaxed resize-y"
                        />
                      ) : (
                        <div className="prose prose-neutral max-w-none text-xs sm:text-sm leading-relaxed space-y-4 font-sans text-neutral-800">
                          <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm bg-transparent border-0 p-0 text-neutral-800 leading-relaxed">
                            {draftedText}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}

                  {activeOutputTab === 'compliance' && (
                    <div className="space-y-5">
                      {auditReport ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 bg-neutral-50">
                            <div>
                              <div className="text-xs font-bold text-neutral-900">
                                Overall Practice Compliance Rating:
                              </div>
                              <div className="text-sm font-extrabold text-neutral-900 mt-0.5">
                                {auditReport.overallStatus}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[11px] text-neutral-500 block">Risk Rating</span>
                              <span className={`text-xs font-bold ${
                                auditReport.riskRating === 'Low' ? 'text-emerald-700' : 'text-amber-700'
                              }`}>
                                {auditReport.riskRating} Risk
                              </span>
                            </div>
                          </div>

                          <div className="text-xs text-neutral-700 p-3 bg-white border border-neutral-200 rounded-lg">
                            <span className="font-semibold block mb-1">Executive Audit Summary:</span>
                            {auditReport.summaryAudit}
                          </div>

                          <div className="space-y-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
                              Detailed Clause Inspections
                            </span>
                            {auditReport.auditFindings.map((finding, idx) => (
                              <div
                                key={idx}
                                className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${
                                  finding.severity === 'critical'
                                    ? 'border-red-200 bg-red-50/50'
                                    : finding.severity === 'warning'
                                    ? 'border-amber-200 bg-amber-50/50'
                                    : 'border-neutral-200 bg-neutral-50/50'
                                }`}
                              >
                                <div className="flex items-center justify-between font-bold text-neutral-900">
                                  <span>{finding.clauseOrSection}</span>
                                  <span className="text-[10px] uppercase font-semibold text-neutral-500">
                                    {finding.severity}
                                  </span>
                                </div>
                                <p className="text-neutral-700">{finding.observation}</p>
                                <div className="text-[11px] text-neutral-600 bg-white p-2 rounded border border-neutral-200/80">
                                  <span className="font-medium text-neutral-900">Recommended Adjustment: </span>
                                  {finding.recommendedRevision}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-16 space-y-3">
                          <ShieldAlert className="w-8 h-8 text-neutral-400 mx-auto" />
                          <h4 className="text-sm font-bold text-neutral-900">
                            Run Practice Risk & Compliance Audit
                          </h4>
                          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                            Examines this draft against {practice.profession} ethical rules, statutory disclaimers, and liability carve-outs.
                          </p>
                          <button
                            onClick={handleRunAudit}
                            disabled={isAuditing}
                            className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm"
                          >
                            {isAuditing ? 'Auditing with Gemini...' : 'Analyze Document Now'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {activeOutputTab === 'metrics' && draftMetrics && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-center">
                          <span className="text-[10px] text-neutral-500 uppercase font-semibold">Total Word Count</span>
                          <div className="text-lg font-bold text-neutral-900 font-mono tabular-nums mt-0.5">
                            {draftMetrics.wordCount}
                          </div>
                        </div>
                        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-center">
                          <span className="text-[10px] text-neutral-500 uppercase font-semibold">Compliance Rating</span>
                          <div className="text-sm font-bold text-emerald-700 mt-1">
                            {draftMetrics.complianceScore}
                          </div>
                        </div>
                        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-center col-span-2 sm:col-span-1">
                          <span className="text-[10px] text-neutral-500 uppercase font-semibold">Standard Clauses</span>
                          <div className="text-lg font-bold text-neutral-900 font-mono tabular-nums mt-0.5">
                            {draftMetrics.clausesIntegrated?.length || 0}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                          Integrated Clauses from Vault:
                        </span>
                        <ul className="text-xs text-neutral-700 space-y-1 list-disc list-inside">
                          {draftMetrics.clausesIntegrated?.map((c: string, i: number) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>

                      {draftMetrics.keyProtectionsIncluded?.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-neutral-100">
                          <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                            Key Protections & Statutory Citations:
                          </span>
                          <ul className="text-xs text-neutral-700 space-y-1 list-disc list-inside">
                            {draftMetrics.keyProtectionsIncluded.map((p: string, i: number) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                /* Empty Canvas State */
                <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                    <FileEdit className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">
                      Document Canvas Empty
                    </h3>
                    <p className="text-xs text-neutral-500 max-w-sm mt-1 leading-relaxed">
                      Select your template parameters on the left and click "Draft Complete Document" to generate an authoritative document grounded in {practice.name}'s proprietary vault.
                    </p>
                  </div>
                  <button
                    onClick={handleGenerateDraft}
                    disabled={isDrafting}
                    className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm"
                  >
                    Draft with Sample Parameters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
