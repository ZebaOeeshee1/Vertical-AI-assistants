import React, { useState } from 'react';
import { VerticalPractice, ComplianceAuditReport } from '../types';
import { analyzeCompliance } from '../services/api';
import { ShieldCheck, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, RefreshCw, Lock, Sliders, Bell } from 'lucide-react';

interface ComplianceAuditViewProps {
  practice: VerticalPractice;
  onUpdatePractice: (updated: VerticalPractice) => void;
}

export const ComplianceAuditView: React.FC<ComplianceAuditViewProps> = ({
  practice,
  onUpdatePractice,
}) => {
  const [sandboxText, setSandboxText] = useState(
    practice.id === 'legal'
      ? `Dear Mr. Henderson: We have reviewed your breach of contract claim against Apex Logistics. We guarantee a full recovery of the $150,000 claim plus attorneys fees. By sending this email, our firm has initiated formal representation.`
      : practice.id === 'clinic'
      ? `Hello Sarah: Based on your reported symptoms of severe chest tightness and elevated blood sugar of 380, you should double your evening glipizide dose to 10mg and take two aspirins. No need to visit the hospital tonight.`
      : `Dear Prospective Buyer: The 742 Evergreen neighborhood is quiet and peaceful, primarily occupied by married families with few renters. We recommend avoiding neighboring districts due to demographic changes.`
  );

  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<ComplianceAuditReport | null>(null);

  // Settings State
  const [disclaimerText, setDisclaimerText] = useState(practice.disclaimer);
  const [escalationContact, setEscalationContact] = useState(practice.escalationContact);
  const [savedSettings, setSavedSettings] = useState(false);

  const handleRunAudit = async () => {
    if (!sandboxText.trim()) return;
    setIsAuditing(true);
    try {
      const res = await analyzeCompliance({
        documentText: sandboxText,
        profession: practice.profession,
        verticalId: practice.id,
      });
      setAuditResult(res);
    } catch (err: any) {
      console.error('Audit failed:', err);
      alert('Failed to analyze compliance.');
    } finally {
      setIsAuditing(false);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePractice({
      ...practice,
      disclaimer: disclaimerText,
      escalationContact: escalationContact,
    });
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          <span>Regulatory Governance</span>
          <span aria-hidden="true">·</span>
          <span className="text-neutral-900 font-bold">{practice.name}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-1">
          Compliance & Ethics Guardrails
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
          Enforces domain-specific ethics, non-diagnostic disclaimers, Fair Housing standards, and statutory citations.
        </p>
      </div>

      {/* Guardrails Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900">Proprietary RAG Grounding</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Strict factual boundary enabled. AI refuses to answer questions regarding unlisted fees, exotic medical conditions, or off-book covenants.
          </p>
          <div className="text-[11px] text-emerald-700 font-semibold pt-1">
            Status: Active & Enforced
          </div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900">Statutory Disclaimer Injector</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Every client response and drafted document is automatically injected with the mandatory {practice.jurisdiction} disclaimer.
          </p>
          <div className="text-[11px] text-emerald-700 font-semibold pt-1">
            Status: Standard Protocol
          </div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900">Emergency Staff Escalation</span>
            <Bell className="w-4 h-4 text-neutral-800" />
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Inquiries with high liability or acute distress automatically flag the practice routing desk: {practice.escalationContact}.
          </p>
          <div className="text-[11px] text-neutral-700 font-semibold pt-1">
            Escalation Desk Active
          </div>
        </div>
      </div>

      {/* Interactive Compliance Audit Sandbox */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              Interactive Compliance Audit Sandbox
            </h2>
            <p className="text-xs text-neutral-500">
              Paste any proposed draft, client communication, or response to test against {practice.profession} ethical rules.
            </p>
          </div>
          <button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm flex items-center gap-1.5 disabled:opacity-50 self-start sm:self-auto"
          >
            {isAuditing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Audit Text with Gemini</span>
              </>
            )}
          </button>
        </div>

        <textarea
          rows={4}
          value={sandboxText}
          onChange={(e) => setSandboxText(e.target.value)}
          placeholder="Paste draft or client response text to audit..."
          className="w-full px-3.5 py-2.5 text-xs font-mono border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 leading-relaxed"
        />

        {/* Audit Results Presentation */}
        {auditResult && (
          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-500">
                  Compliance Assessment
                </span>
                <div className="text-sm font-bold text-neutral-900 mt-0.5">
                  Status: {auditResult.overallStatus} · Risk Level: {auditResult.riskRating}
                </div>
              </div>
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                auditResult.riskRating === 'Low'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-900'
              }`}>
                {auditResult.riskRating} Risk
              </span>
            </div>

            <p className="text-xs text-neutral-700 leading-relaxed">
              {auditResult.summaryAudit}
            </p>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
                Flagged Observations & Mandatory Revisions:
              </span>
              {auditResult.auditFindings.map((finding, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-lg border border-neutral-200 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-bold text-neutral-900">
                    <span>{finding.clauseOrSection}</span>
                    <span className="text-[10px] text-amber-700 uppercase">{finding.severity}</span>
                  </div>
                  <p className="text-neutral-600">{finding.observation}</p>
                  <div className="text-[11px] text-neutral-800 pt-1 font-medium">
                    Adjustment: {finding.recommendedRevision}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Practice Disclaimer & Escalation Config */}
      <form onSubmit={handleSaveSettings} className="p-6 rounded-xl border border-neutral-200 bg-white shadow-xs space-y-4">
        <h2 className="text-base font-bold text-neutral-900">
          Guardrail Settings for {practice.name}
        </h2>

        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">
            Mandatory Disclaimer Template
          </label>
          <textarea
            rows={2}
            value={disclaimerText}
            onChange={(e) => setDisclaimerText(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">
            Staff Escalation Routing Contact
          </label>
          <input
            type="text"
            value={escalationContact}
            onChange={(e) => setEscalationContact(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedSettings ? (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Settings Updated Successfully
            </span>
          ) : <span />}

          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm"
          >
            Save Guardrail Policies
          </button>
        </div>
      </form>
    </div>
  );
};
