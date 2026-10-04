import React, { useState } from 'react';
import { VerticalPractice } from '../types';
import { X, Check, Building2, Stethoscope, Home, Calculator, Plus, Scale } from 'lucide-react';

interface PracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  practices: VerticalPractice[];
  activePractice: VerticalPractice;
  onSelectPractice: (practice: VerticalPractice) => void;
  onAddCustomPractice: (practice: VerticalPractice) => void;
}

export const PracticeModal: React.FC<PracticeModalProps> = ({
  isOpen,
  onClose,
  practices,
  activePractice,
  onSelectPractice,
  onAddCustomPractice,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customProfession, setCustomProfession] = useState('');
  const [customTagline, setCustomTagline] = useState('');
  const [customTone, setCustomTone] = useState('');
  const [customJurisdiction, setCustomJurisdiction] = useState('');
  const [customDisclaimer, setCustomDisclaimer] = useState('');

  if (!isOpen) return null;

  const getIconForVertical = (id: string) => {
    switch (id) {
      case 'legal':
        return <Scale className="w-5 h-5 text-slate-700" />;
      case 'clinic':
        return <Stethoscope className="w-5 h-5 text-emerald-700" />;
      case 'realty':
        return <Home className="w-5 h-5 text-sky-700" />;
      case 'accounting':
        return <Calculator className="w-5 h-5 text-indigo-700" />;
      default:
        return <Building2 className="w-5 h-5 text-neutral-700" />;
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customProfession.trim()) return;

    const newPractice: VerticalPractice = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      profession: customProfession.trim(),
      tagline: customTagline.trim() || `Specialized AI assistant for ${customProfession}`,
      heroImage: '/src/assets/images/legal_practice_interior_1791136619005.jpg',
      tone: customTone.trim() || 'Professional, precise, and grounded in firm standards',
      jurisdiction: customJurisdiction.trim() || 'Standard Industry Practice',
      disclaimer: customDisclaimer.trim() || `Information provided by this assistant is based on ${customName}'s internal operational standards.`,
      escalationContact: `office@${customName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      primaryColor: '#0F172A',
      accentBg: 'bg-neutral-900',
    };

    onAddCustomPractice(newPractice);
    onSelectPractice(newPractice);
    setShowCreateForm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              Select Vertical Profession
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Each vertical assistant operates on proprietary domain documents, ethical guardrails, and drafting templates.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {!showCreateForm ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                {practices.map((practice) => {
                  const isSelected = activePractice.id === practice.id;
                  return (
                    <button
                      key={practice.id}
                      onClick={() => {
                        onSelectPractice(practice);
                        onClose();
                      }}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4 ${
                        isSelected
                          ? 'border-neutral-900 bg-neutral-50/80 ring-1 ring-neutral-900'
                          : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'
                      }`}
                    >
                      <div className="p-2.5 rounded-lg bg-white border border-neutral-200 shadow-sm shrink-0">
                        {getIconForVertical(practice.id)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-bold text-neutral-900 truncate">
                            {practice.name}
                          </h3>
                          {isSelected && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-900">
                              <Check className="w-3.5 h-3.5" />
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-neutral-600 mt-0.5">
                          {practice.profession}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                          {practice.tagline}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-[11px] text-neutral-400">
                          <span>Jurisdiction: {practice.jurisdiction}</span>
                          <span aria-hidden="true">·</span>
                          <span>Escalation: {practice.escalationContact.split('·')[0].trim()}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Vertical Button */}
              <div className="pt-2">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full py-3 px-4 rounded-xl border border-dashed border-neutral-300 text-neutral-600 hover:text-neutral-900 hover:border-neutral-400 hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2 text-xs font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Configure a Custom Practice or Profession (e.g. Architecture, Dental, Veterinary)</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  New Custom Profession Setup
                </span>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="text-xs text-neutral-500 hover:text-neutral-800"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Practice / Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cornerstone Architectural Studio"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Profession / Domain Specialization *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Commercial Architecture & Structural Permitting"
                  value={customProfession}
                  onChange={(e) => setCustomProfession(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  One-Line Mission / Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sustainable building design, IBC code compliance, and municipal approvals."
                  value={customTagline}
                  onChange={(e) => setCustomTagline(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Regulatory Standard / Jurisdiction
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. California Title 24 & AIA Guidelines"
                    value={customJurisdiction}
                    onChange={(e) => setCustomJurisdiction(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Assistant Voice / Tone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Technical, precise, and design-minded"
                    value={customTone}
                    onChange={(e) => setCustomTone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Mandatory Legal / Practice Disclaimer
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Informational guidance only. Formal architectural stamping requires signed principal review."
                  value={customDisclaimer}
                  onChange={(e) => setCustomDisclaimer(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-sm"
                >
                  Create & Launch Vertical Assistant
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
