import { KnowledgeItem, ComplianceAuditReport, DraftMetrics } from '../types';

export interface ChatResponse {
  reply: string;
  metadata: {
    confidence: 'High' | 'Medium' | 'Low';
    citedDocuments: string[];
    requiresStaffFollowup: boolean;
    followupReason: string | null;
    complianceCategory: string;
  };
}

export interface DraftResponse {
  document: string;
  metrics: DraftMetrics;
}

export async function chatWithAssistant(params: {
  businessName: string;
  profession: string;
  clientQuestion: string;
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  knowledgeItems: KnowledgeItem[];
  tone: string;
}): Promise<ChatResponse> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${res.status}`);
  }

  return res.json();
}

export async function draftDocument(params: {
  businessName: string;
  profession: string;
  documentType: string;
  templateTitle: string;
  clientOrTarget: string;
  matterDetails: string;
  variables: Record<string, string>;
  knowledgeItems: KnowledgeItem[];
  customInstructions?: string;
  jurisdiction?: string;
}): Promise<DraftResponse> {
  const res = await fetch('/api/draft', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${res.status}`);
  }

  return res.json();
}

export async function analyzeCompliance(params: {
  documentText: string;
  profession: string;
  verticalId: string;
}): Promise<ComplianceAuditReport> {
  const res = await fetch('/api/analyze-compliance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${res.status}`);
  }

  return res.json();
}

export async function extractKnowledgeFromText(params: {
  rawText: string;
  profession: string;
  categorySuggestion?: string;
}): Promise<{
  extractedItems: Array<{
    title: string;
    category: string;
    content: string;
    tags: string[];
    isClientSafe: boolean;
  }>;
}> {
  const res = await fetch('/api/extract-knowledge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${res.status}`);
  }

  return res.json();
}
