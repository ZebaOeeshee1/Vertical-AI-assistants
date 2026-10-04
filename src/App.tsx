import React, { useState } from 'react';
import {
  INITIAL_PRACTICES,
  INITIAL_KNOWLEDGE,
  INITIAL_TEMPLATES,
  CLIENT_INQUIRY_PRESETS,
} from './data/seedData';
import {
  VerticalPractice,
  KnowledgeItem,
  DocumentTemplate,
  DraftedDocument,
  ChatMessage,
} from './types';
import { TopNav } from './components/TopNav';
import { PracticeModal } from './components/PracticeModal';
import { OverviewView } from './components/OverviewView';
import { ClientSimulatorView } from './components/ClientSimulatorView';
import { DocumentDrafterView } from './components/DocumentDrafterView';
import { KnowledgeVaultView } from './components/KnowledgeVaultView';
import { ComplianceAuditView } from './components/ComplianceAuditView';

export default function App() {
  const [practices, setPractices] = useState<VerticalPractice[]>(INITIAL_PRACTICES);
  const [activePractice, setActivePractice] = useState<VerticalPractice>(INITIAL_PRACTICES[0]);
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>(INITIAL_KNOWLEDGE);
  const [templates, setTemplates] = useState<DocumentTemplate[]>(INITIAL_TEMPLATES);
  const [draftedDocuments, setDraftedDocuments] = useState<DraftedDocument[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'simulator' | 'drafter' | 'vault' | 'compliance'>('overview');
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);

  // Initialize chat messages for the active practice
  const getInitialChatMessage = (practice: VerticalPractice): ChatMessage => ({
    id: `msg-welcome-${practice.id}`,
    role: 'assistant',
    content: `Welcome to ${practice.name}. I am the specialized vertical AI assistant, strictly grounded in our proprietary office records, fee structures, and service guidelines. How may I assist you today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    citations: ['Practice Master Records'],
    confidence: 'High',
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    getInitialChatMessage(INITIAL_PRACTICES[0]),
  ]);

  const handleSelectPractice = (practice: VerticalPractice) => {
    setActivePractice(practice);
    setChatMessages([getInitialChatMessage(practice)]);
    // Reset selected template to first template of new practice
    const practiceTemplates = templates.filter((t) => t.verticalId === practice.id);
    setSelectedTemplate(practiceTemplates[0] || null);
  };

  const handleAddCustomPractice = (newPractice: VerticalPractice) => {
    setPractices((prev) => [...prev, newPractice]);
  };

  const handleUpdatePractice = (updated: VerticalPractice) => {
    setPractices((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setActivePractice(updated);
  };

  const handleAddKnowledge = (newItem: KnowledgeItem) => {
    setKnowledgeItems((prev) => [newItem, ...prev]);
  };

  const handleUpdateKnowledge = (updated: KnowledgeItem) => {
    setKnowledgeItems((prev) => prev.map((k) => (k.id === updated.id ? updated : k)));
  };

  const handleDeleteKnowledge = (id: string) => {
    setKnowledgeItems((prev) => prev.filter((k) => k.id !== id));
  };

  const handleSaveDraft = (newDoc: DraftedDocument) => {
    setDraftedDocuments((prev) => [newDoc, ...prev]);
  };

  const handleSelectTemplateToDraft = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setActiveTab('drafter');
  };

  return (
    <div className="min-h-screen bg-neutral-100/70 text-neutral-900 font-sans flex flex-col selection:bg-neutral-900 selection:text-white">
      {/* Top Bar adhering to Top Bar Contract */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activePractice={activePractice}
        onOpenPracticeSelector={() => setIsPracticeModalOpen(true)}
        onNewDraftClick={() => {
          setActiveTab('drafter');
        }}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'overview' && (
          <OverviewView
            practice={activePractice}
            knowledgeItems={knowledgeItems}
            templates={templates}
            draftedDocuments={draftedDocuments}
            onNavigateTab={setActiveTab}
            onSelectTemplateToDraft={handleSelectTemplateToDraft}
            onOpenPracticeSelector={() => setIsPracticeModalOpen(true)}
          />
        )}

        {activeTab === 'simulator' && (
          <ClientSimulatorView
            practice={activePractice}
            knowledgeItems={knowledgeItems}
            presets={CLIENT_INQUIRY_PRESETS[activePractice.id] || []}
            chatMessages={chatMessages}
            setChatMessages={setChatMessages}
          />
        )}

        {activeTab === 'drafter' && (
          <DocumentDrafterView
            practice={activePractice}
            knowledgeItems={knowledgeItems}
            templates={templates}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            onSaveDraft={handleSaveDraft}
          />
        )}

        {activeTab === 'vault' && (
          <KnowledgeVaultView
            practice={activePractice}
            knowledgeItems={knowledgeItems}
            onAddKnowledge={handleAddKnowledge}
            onUpdateKnowledge={handleUpdateKnowledge}
            onDeleteKnowledge={handleDeleteKnowledge}
          />
        )}

        {activeTab === 'compliance' && (
          <ComplianceAuditView
            practice={activePractice}
            onUpdatePractice={handleUpdatePractice}
          />
        )}
      </main>

      {/* Subtle, Compliant Footer (no fake engines or buzzword telemetry) */}
      <footer className="border-t border-neutral-200 bg-white/70 py-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-800">Praxis Vertical AI</span>
            <span aria-hidden="true">·</span>
            <span>Grounding: {activePractice.name}</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <span>Powered by Gemini 3.8 Flash RAG</span>
            <span aria-hidden="true">·</span>
            <span>{activePractice.jurisdiction}</span>
          </div>
        </div>
      </footer>

      {/* Practice Switcher Modal */}
      <PracticeModal
        isOpen={isPracticeModalOpen}
        onClose={() => setIsPracticeModalOpen(false)}
        practices={practices}
        activePractice={activePractice}
        onSelectPractice={handleSelectPractice}
        onAddCustomPractice={handleAddCustomPractice}
      />
    </div>
  );
}
