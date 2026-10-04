import React, { useState } from 'react';
import { VerticalPractice, KnowledgeItem } from '../types';
import { extractKnowledgeFromText } from '../services/api';
import { Search, Plus, Sparkles, Database, Lock, Eye, Trash2, Edit3, X, Check, BookOpen, AlertCircle } from 'lucide-react';

interface KnowledgeVaultViewProps {
  practice: VerticalPractice;
  knowledgeItems: KnowledgeItem[];
  onAddKnowledge: (item: KnowledgeItem) => void;
  onUpdateKnowledge: (item: KnowledgeItem) => void;
  onDeleteKnowledge: (id: string) => void;
}

export const KnowledgeVaultView: React.FC<KnowledgeVaultViewProps> = ({
  practice,
  knowledgeItems,
  onAddKnowledge,
  onUpdateKnowledge,
  onDeleteKnowledge,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeItemDetail, setActiveItemDetail] = useState<KnowledgeItem | null>(null);

  // Add Item Form State
  const [entryMode, setEntryMode] = useState<'manual' | 'ai-ingest'>('manual');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Practice Policy');
  const [newContent, setNewContent] = useState('');
  const [newSourceRef, setNewSourceRef] = useState('');
  const [newIsClientSafe, setNewIsClientSafe] = useState(true);
  const [newTags, setNewTags] = useState('');

  // AI Ingest State
  const [rawIngestText, setRawIngestText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedPreview, setExtractedPreview] = useState<any[]>([]);

  // Filter items for current practice
  const practiceItems = knowledgeItems.filter((k) => k.verticalId === practice.id);

  // Distinct categories
  const categories = ['all', ...Array.from(new Set(practiceItems.map((k) => k.category)))];

  const filteredItems = practiceItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newItem: KnowledgeItem = {
      id: `doc-${Date.now()}`,
      verticalId: practice.id,
      title: newTitle.trim(),
      category: newCategory.trim() || 'General Policy',
      content: newContent.trim(),
      sourceRef: newSourceRef.trim() || 'Internal Practice Archive',
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isClientSafe: newIsClientSafe,
      tags: newTags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    };

    onAddKnowledge(newItem);
    resetForm();
    setShowAddModal(false);
  };

  const handleRunAiExtraction = async () => {
    if (!rawIngestText.trim()) return;
    setIsExtracting(true);
    try {
      const response = await extractKnowledgeFromText({
        rawText: rawIngestText,
        profession: practice.profession,
        categorySuggestion: newCategory,
      });
      setExtractedPreview(response.extractedItems || []);
    } catch (err: any) {
      console.error('Ingest error:', err);
      alert('Failed to extract knowledge from text.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSaveExtractedItem = (item: any) => {
    const newItem: KnowledgeItem = {
      id: `doc-ext-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      verticalId: practice.id,
      title: item.title,
      category: item.category || 'Practice Policy',
      content: item.content,
      sourceRef: `Extracted from ${practice.name} Document Memo`,
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isClientSafe: item.isClientSafe ?? true,
      tags: item.tags || ['extracted', 'policy'],
    };

    onAddKnowledge(newItem);
    setExtractedPreview((prev) => prev.filter((p) => p !== item));
    if (extractedPreview.length <= 1) {
      setShowAddModal(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setNewTitle('');
    setNewContent('');
    setNewSourceRef('');
    setNewTags('');
    setRawIngestText('');
    setExtractedPreview([]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            <span>Proprietary Business Data</span>
            <span aria-hidden="true">·</span>
            <span className="text-neutral-900 font-bold">{practice.name}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-1">
            Knowledge Vault & Document Grounding
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
            The single source of truth for your vertical assistant. Client inquiries and drafted documents only rely on the documents stored here.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Practice Document</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vault clauses, fees, policies, or tags..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>

        {/* Category Filters (Segmented Controls) */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Knowledge Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 transition-colors flex flex-col justify-between shadow-xs space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                  {item.category}
                </span>
                <span
                  className={`text-[10px] font-semibold flex items-center gap-1 ${
                    item.isClientSafe ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {item.isClientSafe ? (
                    <>
                      <Eye className="w-3 h-3" />
                      Client Accessible
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" />
                      Internal Drafting Only
                    </>
                  )}
                </span>
              </div>

              <h3 className="text-sm font-bold text-neutral-900 leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                {item.content}
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-100 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span className="truncate max-w-[170px]">{item.sourceRef}</span>
                <span className="tabular-nums font-mono">{item.lastUpdated}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setActiveItemDetail(item)}
                  className="text-xs font-semibold text-neutral-800 hover:text-neutral-950 flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Inspect Excerpt</span>
                </button>

                <button
                  onClick={() => onDeleteKnowledge(item.id)}
                  className="p-1 text-neutral-400 hover:text-red-600 rounded transition-colors"
                  title="Remove document from vault"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="py-16 text-center rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2">
          <Database className="w-8 h-8 text-neutral-400 mx-auto" />
          <h4 className="text-sm font-bold text-neutral-900">
            No Documents Matched Your Criteria
          </h4>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Try adjusting your search terms or category filter, or click "Add Practice Document" to introduce new clauses.
          </p>
        </div>
      )}

      {/* Item Detail Modal */}
      {activeItemDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-500">
                  {activeItemDetail.category} · {activeItemDetail.isClientSafe ? 'Client Safe' : 'Internal Drafting'}
                </span>
                <h3 className="text-base font-bold text-neutral-900 mt-0.5">
                  {activeItemDetail.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveItemDetail(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Full Vault Content
              </span>
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 font-mono leading-relaxed whitespace-pre-wrap">
                {activeItemDetail.content}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-100">
              <span>Source: {activeItemDetail.sourceRef}</span>
              <span>Updated: {activeItemDetail.lastUpdated}</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveItemDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Knowledge Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Add Document to {practice.name}'s Vault
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Provide verified business policies, clauses, or fee structures.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Entry Mode Switcher */}
            <div className="px-6 pt-4">
              <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setEntryMode('manual')}
                  className={`flex-1 py-1.5 rounded-md transition-colors ${
                    entryMode === 'manual'
                      ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Manual Structured Entry
                </button>
                <button
                  type="button"
                  onClick={() => setEntryMode('ai-ingest')}
                  className={`flex-1 py-1.5 rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                    entryMode === 'ai-ingest'
                      ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>AI Ingest & Auto-Segment</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              {entryMode === 'manual' ? (
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Document / Policy Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. 2026 Emergency Litigation Fee Surcharges"
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="e.g. Billing, Intake, Clinical Protocol, HOA"
                        className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        Source Reference / Binder ID
                      </label>
                      <input
                        type="text"
                        value={newSourceRef}
                        onChange={(e) => setNewSourceRef(e.target.value)}
                        placeholder="e.g. Firm Operations Handbook § 4.8"
                        className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Exact Clause / Policy Text *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Enter exact verbatim policy language, statutory deadlines, or fee formulas..."
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-[11px] leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Search Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      placeholder="e.g. fee, rush, emergency, litigation"
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="isClientSafeCheckbox"
                      checked={newIsClientSafe}
                      onChange={(e) => setNewIsClientSafe(e.target.checked)}
                      className="rounded text-neutral-900 focus:ring-neutral-900"
                    />
                    <label htmlFor="isClientSafeCheckbox" className="text-xs text-neutral-700 cursor-pointer">
                      <strong>Client Safe:</strong> Allow the Client Q&A assistant to answer questions using this document directly.
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm"
                    >
                      Save Document to Vault
                    </button>
                  </div>
                </form>
              ) : (
                /* AI Auto-Ingest Mode */
                <div className="space-y-4">
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Paste unformatted document text (such as an office policy memo, clinic handbook chapter, or listing rider). Gemini will parse it into atomic, grounded knowledge chunks.
                  </p>

                  <textarea
                    rows={6}
                    value={rawIngestText}
                    onChange={(e) => setRawIngestText(e.target.value)}
                    placeholder="Paste raw unformatted text here..."
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 leading-relaxed"
                  />

                  <button
                    type="button"
                    onClick={handleRunAiExtraction}
                    disabled={isExtracting || !rawIngestText.trim()}
                    className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isExtracting ? 'Analyzing with Gemini...' : 'Extract & Segment into Knowledge Items'}</span>
                  </button>

                  {/* Extracted Preview List */}
                  {extractedPreview.length > 0 && (
                    <div className="space-y-3 pt-3 border-t border-neutral-200">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
                        Extracted Atomic Items ({extractedPreview.length}):
                      </span>

                      <div className="space-y-2">
                        {extractedPreview.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/60 space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-neutral-900">{item.title}</span>
                              <span className="text-[10px] text-neutral-500 uppercase">{item.category}</span>
                            </div>
                            <p className="text-xs text-neutral-700 leading-relaxed">{item.content}</p>
                            <div className="flex justify-end pt-1">
                              <button
                                onClick={() => handleSaveExtractedItem(item)}
                                className="px-3 py-1 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-md transition-colors flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                <span>Add to Vault</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
