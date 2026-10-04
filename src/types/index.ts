export type VerticalId = 'legal' | 'clinic' | 'realty' | 'accounting' | string;

export interface VerticalPractice {
  id: VerticalId;
  name: string;
  profession: string;
  tagline: string;
  heroImage: string;
  tone: string;
  jurisdiction: string;
  disclaimer: string;
  escalationContact: string;
  emergencyNotice?: string;
  primaryColor: string;
  accentBg: string;
}

export interface KnowledgeItem {
  id: string;
  verticalId: VerticalId;
  title: string;
  category: string;
  content: string;
  sourceRef: string;
  lastUpdated: string;
  isClientSafe: boolean; // Accessible to client Q&A assistant
  tags: string[];
}

export interface TemplateVariable {
  key: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
  type?: 'text' | 'textarea' | 'date' | 'number';
}

export interface DocumentTemplate {
  id: string;
  verticalId: VerticalId;
  title: string;
  documentType: string;
  description: string;
  suggestedJurisdiction?: string;
  variables: TemplateVariable[];
  defaultMatterDetails: string;
  relevantKnowledgeCategories: string[];
}

export interface DraftMetrics {
  documentTitle: string;
  summary: string;
  clausesIntegrated: string[];
  complianceScore: 'Pass' | 'Requires Attorney/Physician Signoff' | 'Revisions Recommended';
  keyProtectionsIncluded: string[];
  wordCount: number;
}

export interface AuditFinding {
  clauseOrSection: string;
  severity: 'info' | 'warning' | 'critical';
  observation: string;
  recommendedRevision: string;
}

export interface ComplianceAuditReport {
  overallStatus: 'Approved' | 'Caution' | 'Revisions Recommended';
  riskRating: 'Low' | 'Medium' | 'High';
  auditFindings: AuditFinding[];
  disclaimerPresent: boolean;
  summaryAudit: string;
}

export interface DraftedDocument {
  id: string;
  verticalId: VerticalId;
  title: string;
  documentType: string;
  clientOrTarget: string;
  content: string;
  createdAt: string;
  metrics?: DraftMetrics;
  auditReport?: ComplianceAuditReport;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: string[];
  confidence?: 'High' | 'Medium' | 'Low';
  requiresStaffFollowup?: boolean;
  followupReason?: string | null;
  complianceCategory?: string;
}

export interface ClientInquiryPreset {
  id: string;
  label: string;
  question: string;
  category: string;
}
