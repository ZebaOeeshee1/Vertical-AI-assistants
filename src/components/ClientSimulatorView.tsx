import React, { useState, useRef, useEffect } from 'react';
import { VerticalPractice, KnowledgeItem, ChatMessage, ClientInquiryPreset } from '../types';
import { chatWithAssistant } from '../services/api';
import { Send, Sparkles, BookOpen, AlertTriangle, CheckCircle, Code, MessageSquare, RefreshCw, Copy, Check, ExternalLink } from 'lucide-react';

interface ClientSimulatorViewProps {
  practice: VerticalPractice;
  knowledgeItems: KnowledgeItem[];
  presets: ClientInquiryPreset[];
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export const ClientSimulatorView: React.FC<ClientSimulatorViewProps> = ({
  practice,
  knowledgeItems,
  presets,
  chatMessages,
  setChatMessages,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'simulator' | 'embed'>('simulator');
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCitationDoc, setSelectedCitationDoc] = useState<KnowledgeItem | null>(null);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter client-safe knowledge items for grounded search
  const clientSafeKnowledge = knowledgeItems.filter(
    (k) => k.verticalId === practice.id && k.isClientSafe
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isLoading]);

  const handleSendQuestion = async (questionText: string) => {
    const q = questionText.trim();
    if (!q || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const historyPayload = chatMessages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await chatWithAssistant({
        businessName: practice.name,
        profession: practice.profession,
        clientQuestion: q,
        chatHistory: historyPayload,
        knowledgeItems: clientSafeKnowledge,
        tone: practice.tone,
      });

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: response.metadata.citedDocuments,
        confidence: response.metadata.confidence,
        requiresStaffFollowup: response.metadata.requiresStaffFollowup,
        followupReason: response.metadata.followupReason,
        complianceCategory: response.metadata.complianceCategory,
      };

      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: `I apologize, but I encountered an error communicating with our verification service: ${err.message || 'Network error'}. Please contact our office directly at ${practice.escalationContact}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: 'Low',
        requiresStaffFollowup: true,
        followupReason: 'API request failure',
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetClick = (preset: ClientInquiryPreset) => {
    setInputQuestion(preset.question);
    handleSendQuestion(preset.question);
  };

  const handleResetChat = () => {
    setChatMessages([
      {
        id: `msg-welcome`,
        role: 'assistant',
        content: `Welcome to ${practice.name}. I am the specialized practice assistant, grounded in our verified office records, fee structures, and service guidelines. How may I assist you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: ['Practice Master Guidelines'],
        confidence: 'High',
      },
    ]);
  };

  const embedSnippet = `<!-- ${practice.name} Vertical AI Client Assistant Embed -->
<script
  src="https://cdn.praxis-ai.network/v1/vertical-assistant.js"
  data-practice-id="${practice.id}"
  data-profession="${practice.profession}"
  data-primary-color="${practice.primaryColor}"
  data-grounding-strictness="high"
  async
></script>
<div id="praxis-assistant-widget" data-theme="light"></div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedSnippet);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            <span>Client Inquiry Engine</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700">Grounded RAG Active</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-1">
            Client & Patient Q&A Simulator
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
            Test how clients experience your vertical assistant. Every answer is strictly grounded in your business data with verified source citations.
          </p>
        </div>

        {/* Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('simulator')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'simulator'
                ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Live Simulator
          </button>
          <button
            onClick={() => setActiveSubTab('embed')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'embed'
                ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Embed Widget Code
          </button>
        </div>
      </div>

      {activeSubTab === 'simulator' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Chat Interface */}
          <div className="lg:col-span-8 flex flex-col bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden h-[680px]">
            {/* Simulator Window Bar */}
            <div className="px-5 py-3.5 border-b border-neutral-200 bg-neutral-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-neutral-900">
                  {practice.name} Assistant
                </span>
                <span className="text-xs text-neutral-400">|</span>
                <span className="text-[11px] text-neutral-500 truncate max-w-[200px]">
                  {practice.profession}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetChat}
                  className="p-1.5 text-neutral-500 hover:text-neutral-800 rounded-md hover:bg-neutral-200/60 transition-colors text-xs flex items-center gap-1"
                  title="Reset conversation"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Clear</span>
                </button>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {chatMessages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-neutral-400">
                      <span>{isUser ? 'Client Inquiry' : `${practice.name} Assistant`}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{msg.timestamp}</span>
                    </div>

                    <div
                      className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed max-w-[85%] whitespace-pre-wrap ${
                        isUser
                          ? 'bg-neutral-900 text-white rounded-tr-xs'
                          : 'bg-neutral-100 text-neutral-900 border border-neutral-200/70 rounded-tl-xs'
                      }`}
                    >
                      {msg.content}

                      {/* Verified Citation Strip for Assistant Answers */}
                      {!isUser && msg.citations && msg.citations.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-neutral-200/80 text-[11px] text-neutral-600">
                          <div className="font-semibold text-neutral-700 flex items-center gap-1 mb-1">
                            <BookOpen className="w-3.5 h-3.5 text-neutral-500" />
                            <span>Verified Business Source Citations:</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.citations.map((cite, idx) => {
                              // Find corresponding document in vault
                              const matchingDoc = knowledgeItems.find(
                                (k) => k.title.toLowerCase().includes(cite.toLowerCase()) ||
                                       cite.toLowerCase().includes(k.title.toLowerCase())
                              );

                              return (
                                <button
                                  key={idx}
                                  onClick={() => matchingDoc && setSelectedCitationDoc(matchingDoc)}
                                  className="text-[11px] text-neutral-700 hover:text-neutral-950 font-medium underline underline-offset-2 flex items-center gap-1 text-left"
                                >
                                  <span>{cite}</span>
                                  {matchingDoc && <ExternalLink className="w-2.5 h-2.5 opacity-60" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Human Staff Escalation Notice if flagged */}
                      {!isUser && msg.requiresStaffFollowup && (
                        <div className="mt-2.5 p-2 rounded-lg bg-amber-50 border border-amber-200/80 text-[11px] text-amber-800 flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold">Practice Escalation Flag: </span>
                            <span>{msg.followupReason || 'Requires direct review by licensed staff.'} </span>
                            <span className="font-medium text-amber-900 block mt-0.5">
                              Routing: {practice.escalationContact}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-neutral-400">
                    <span>{practice.name} Assistant</span>
                    <span aria-hidden="true">·</span>
                    <span>Consulting Knowledge Vault...</span>
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-neutral-100 border border-neutral-200/70 rounded-tl-xs text-xs text-neutral-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.4s]" />
                    <span className="ml-1 text-neutral-500">Cross-referencing proprietary documents...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3.5 border-t border-neutral-200 bg-neutral-50/50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendQuestion(inputQuestion);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                  placeholder={`Ask ${practice.name} a question (e.g. fees, fasting, policies, lease rules)...`}
                  disabled={isLoading}
                  className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 placeholder:text-neutral-400"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputQuestion.trim()}
                  className="px-4 py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 disabled:opacity-50 disabled:pointer-events-none transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2 px-1">
                <span>Grounding: {clientSafeKnowledge.length} client-safe docs loaded</span>
                <span>Tone: {practice.tone.split(',')[0]}</span>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Preset Test Inquiries & Citation Inspector */}
          <div className="lg:col-span-4 space-y-4">
            {/* Quick Test Inquiries for the active vertical */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Sample Client Inquiries
                </h3>
                <span className="text-[11px] text-neutral-400 font-medium">Click to test</span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Pre-calibrated test cases demonstrating zero hallucination, exact pricing extraction, and policy enforcement.
              </p>

              <div className="space-y-2 pt-1">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetClick(preset)}
                    disabled={isLoading}
                    className="w-full text-left p-2.5 rounded-lg border border-neutral-200/80 hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-xs space-y-1 group"
                  >
                    <div className="flex items-center justify-between gap-1 text-[10px] font-semibold text-neutral-500">
                      <span>{preset.category}</span>
                      <span className="group-hover:text-neutral-900 text-neutral-400 transition-colors">Run →</span>
                    </div>
                    <p className="text-neutral-800 font-medium line-clamp-2 leading-snug">
                      "{preset.question}"
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Citation Inspector Drawer / Card */}
            {selectedCitationDoc ? (
              <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/50 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Proprietary Vault Source</span>
                  </div>
                  <button
                    onClick={() => setSelectedCitationDoc(null)}
                    className="text-xs text-emerald-700 hover:text-emerald-900 font-medium"
                  >
                    Close
                  </button>
                </div>
                <h4 className="text-xs font-bold text-neutral-900">
                  {selectedCitationDoc.title}
                </h4>
                <div className="p-2.5 rounded-lg bg-white border border-emerald-200 text-xs text-neutral-700 font-mono text-[11px] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {selectedCitationDoc.content}
                </div>
                <div className="text-[11px] text-emerald-800">
                  Reference: {selectedCitationDoc.sourceRef}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/60 text-xs text-neutral-500 space-y-1">
                <div className="font-semibold text-neutral-800 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Interactive Source Inspector</span>
                </div>
                <p className="text-[11px] leading-relaxed text-neutral-500">
                  When the assistant answers, click any underlined citation to inspect the raw excerpt from your proprietary vault.
                </p>
              </div>
            )}

            {/* Emergency & Disclaimer Notice Card */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-white text-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Statutory Disclaimer Injected
              </span>
              <p className="text-[11px] text-neutral-600 leading-relaxed">
                {practice.disclaimer}
              </p>
              {practice.emergencyNotice && (
                <div className="pt-2 border-t border-neutral-100 text-[11px] text-red-700 font-medium">
                  {practice.emergencyNotice}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Embed Widget Tab */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-xl border border-neutral-200 bg-white shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-neutral-900" />
                  <h3 className="text-sm font-bold text-neutral-900">
                    Embed on {practice.name}'s Website
                  </h3>
                </div>
                <button
                  onClick={copyEmbedCode}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  {copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmbed ? 'Copied to Clipboard' : 'Copy Embed Snippet'}</span>
                </button>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                Place this snippet in your client portal, WordPress header, or React application. The widget will float in the bottom-right corner, allowing clients and patients to ask questions 24/7 grounded strictly in your vault.
              </p>

              <pre className="p-4 rounded-xl bg-neutral-950 text-neutral-200 text-xs font-mono overflow-x-auto leading-relaxed border border-neutral-800">
                {embedSnippet}
              </pre>

              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-neutral-900">
                  Integration Features:
                </h4>
                <ul className="text-xs text-neutral-600 space-y-1.5 list-disc list-inside">
                  <li>Zero setup for clients: loads responsive widget in 45ms.</li>
                  <li>Automatic practice branding ({practice.name}).</li>
                  <li>Strict privacy mode: Client chats are never shared across tenants.</li>
                  <li>Configured with emergency escalation: {practice.escalationContact}.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Widget Mockup */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Client Portal Appearance Preview
            </span>
            <div className="rounded-2xl border border-neutral-300 shadow-md bg-white overflow-hidden max-w-sm mx-auto">
              <div className="p-4 bg-neutral-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
                    <MessageSquare className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">{practice.name}</div>
                    <div className="text-[10px] text-neutral-300">Verified Client Assistant</div>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>

              <div className="p-4 bg-neutral-50 space-y-3 text-xs min-h-[220px]">
                <div className="p-3 bg-white rounded-xl border border-neutral-200 text-neutral-700 shadow-2xs leading-relaxed text-[11px]">
                  Hello! I am the automated administrative assistant for {practice.name}. Ask me about our service scope, consultation rates, or preparation instructions.
                </div>
                <div className="text-[10px] text-neutral-400 text-center">
                  Protected by Praxis Vertical Ethics Guardrails
                </div>
              </div>

              <div className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2">
                <input
                  type="text"
                  disabled
                  placeholder="Type an inquiry..."
                  className="flex-1 px-2.5 py-1.5 text-xs bg-neutral-100 rounded-lg border border-neutral-200"
                />
                <button
                  disabled
                  className="p-1.5 bg-neutral-900 text-white rounded-lg"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
