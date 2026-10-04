import { VerticalPractice, KnowledgeItem, DocumentTemplate, ClientInquiryPreset } from '../types';

export const INITIAL_PRACTICES: VerticalPractice[] = [
  {
    id: 'legal',
    name: 'Vance, Thorne & Hastings LLP',
    profession: 'Commercial Litigation & Corporate Law Practice',
    tagline: 'Specialized corporate advocacy, contract litigation, and fiduciary counsel.',
    heroImage: '/src/assets/images/legal_practice_interior_1791136619005.jpg',
    tone: 'Judicious, authoritative, rigorous, and strictly grounded in statutory precedent',
    jurisdiction: 'State of California & 9th Federal Circuit',
    disclaimer: 'DISCLAIMER: Communications via this vertical assistant provide general legal orientation based on firm records. No attorney-client relationship is created until a written Engagement Agreement is fully executed by an authorized partner.',
    escalationContact: 'intake@vancethorne.law · (415) 882-9400',
    emergencyNotice: 'For urgent court filing deadlines or ex parte applications, contact the managing partner desk directly.',
    primaryColor: '#0F172A',
    accentBg: 'bg-slate-900',
  },
  {
    id: 'clinic',
    name: 'Aura Integrative Medicine & Pediatrics',
    profession: 'Multidisciplinary Clinical Health & Pediatric Practice',
    tagline: 'Evidence-based preventive care, clinical diagnostics, and pediatric wellness.',
    heroImage: '/src/assets/images/clinical_practice_interior_1791136639418.jpg',
    tone: 'Compassionate, clinically precise, reassuring, and safety-first',
    jurisdiction: 'California Medical Board & HIPAA Standards',
    disclaimer: 'CLINICAL NOTICE: This assistant provides practice administrative guidance and pre-visit preparation based on clinical protocols. It does NOT provide formal medical diagnosis, triage emergency symptoms, or prescribe medication. In case of emergency or severe pain, dial 911 immediately.',
    escalationContact: 'clinical-triage@auraintegrative.org · (650) 412-8800',
    emergencyNotice: 'Emergency Warning: If experiencing chest pressure, acute breathlessness, or severe allergic reaction, proceed to the nearest Emergency Department.',
    primaryColor: '#065F46',
    accentBg: 'bg-emerald-900',
  },
  {
    id: 'realty',
    name: 'Meridian Prime Realty & Advisory',
    profession: 'Luxury Residential Brokerage & Escrow Advisory',
    tagline: 'Premier residential representation, contractual due diligence, and portfolio transactions.',
    heroImage: '/src/assets/images/realty_brokerage_interior_1791136658165.jpg',
    tone: 'Diplomatic, consultative, accurate regarding MLS/HOA data, and consumer-protective',
    jurisdiction: 'California Department of Real Estate (DRE #02094811)',
    disclaimer: 'BROKERAGE DISCLOSURE: All property data, HOA covenants, and timelines are derived from registered MLS listings and seller disclosures. Prospective buyers must verify all material facts during statutory contingency periods. Compliant with the Federal Fair Housing Act.',
    escalationContact: 'advisory@meridianprime.realty · (310) 594-2200',
    emergencyNotice: 'Escrow wiring instructions must ALWAYS be verbally verified with the closing officer to prevent wire fraud.',
    primaryColor: '#1E293B',
    accentBg: 'bg-sky-950',
  },
  {
    id: 'accounting',
    name: 'Apex Ledger Tax & Strategic Advisory',
    profession: 'Boutique CPA & Corporate Tax Practice',
    tagline: 'Strategic tax compliance, corporate entity structuring, and IRS controversy representation.',
    heroImage: '/src/assets/images/legal_practice_interior_1791136619005.jpg',
    tone: 'Meticulous, objective, quantitatively exact, and audit-conscious',
    jurisdiction: 'Internal Revenue Service & AICPA Professional Standards',
    disclaimer: 'CIRCULAR 230 DISCLOSURE: Any tax advice contained herein is grounded in firm guidance memoranda. It cannot be used for avoiding penalties under the Internal Revenue Code without a formal written opinion letter signed by a licensed CPA.',
    escalationContact: 'partners@apexledger.cpa · (212) 773-1900',
    primaryColor: '#1E1B4B',
    accentBg: 'bg-indigo-950',
  }
];

export const INITIAL_KNOWLEDGE: KnowledgeItem[] = [
  // --- LEGAL PRACTICE KNOWLEDGE ---
  {
    id: 'leg-1',
    verticalId: 'legal',
    title: 'Standard Fee Schedule & Retainer Minimums (2026)',
    category: 'Billing & Retainers',
    content: `Senior Managing Partner Rate: $750/hour.
Litigation Partner Rate: $625/hour.
Senior Associate Rate: $425/hour.
Paralegal Rate: $185/hour.
Initial Litigation Retainer: $10,000 for standard commercial dispute matters, $25,000 for complex multi-party or federal litigation.
Evergreen Retainer Provision: Retainer must be replenished when balance falls below $3,500. Unearned retainer funds remain in client trust (IOLTA) account until billed against approved monthly invoices.`,
    sourceRef: 'Practice Master Agreement 2026, Section 4.2',
    lastUpdated: 'Jan 15, 2026',
    isClientSafe: true,
    tags: ['billing', 'rates', 'retainer', 'fees']
  },
  {
    id: 'leg-2',
    verticalId: 'legal',
    title: 'Client Intake & Conflict Clearance Protocol',
    category: 'Intake & Ethics',
    content: `All prospective representation requires a mandatory electronic conflict check across our litigation database covering past 7 years.
No attorney-client relationship is established during preliminary intake calls or written Q&A.
Under California State Bar Rule 1.7, any direct adversity with existing or recent former corporate clients precludes retention without express written informed consent from both entities.
Conflict turnaround time is standard 24 to 48 business hours.`,
    sourceRef: 'Firm Governance Policy § 2.1',
    lastUpdated: 'Feb 1, 2026',
    isClientSafe: true,
    tags: ['intake', 'conflict', 'ethics', 'representation']
  },
  {
    id: 'leg-3',
    verticalId: 'legal',
    title: 'Standard Breach of Contract Demand Provisions',
    category: 'Litigation Clauses',
    content: `Standard Notice of Default & Opportunity to Cure: Opposing party is granted ten (10) business days from confirmed delivery of written demand to remedy default.
Statutory Pre-Judgment Interest: Cal. Civ. Code § 3289 stipulates prejudgment interest at 10% per annum on liquidated contract balances from date of breach.
Attorneys\' Fees Clause: Under firm model clause, the prevailing party in any action to enforce agreement is entitled to reasonable attorneys\' fees and expert costs.
Statute of Limitations: Written contracts in CA have a 4-year statute of limitations from breach (Cal. Code Civ. Proc. § 337).`,
    sourceRef: 'Litigation Practice Manual 2026, Chapter 8',
    lastUpdated: 'Mar 10, 2026',
    isClientSafe: false, // Internal drafting clause
    tags: ['litigation', 'breach', 'demand', 'clauses']
  },
  {
    id: 'leg-4',
    verticalId: 'legal',
    title: 'Mutual Non-Disclosure Agreement (Bilateral Core Terms)',
    category: 'Contract Standards',
    content: `Term of Confidentiality: Two (2) years from the effective date; trade secrets protected indefinitely under Defend Trade Secrets Act and California UTSA.
Permitted Purpose: Strictly for evaluating potential commercial joint venture or supply agreement.
Carve-outs: Information independently developed without reference to disclosed materials, publicly known without breach, or rightfully obtained from third party without restriction.
Remedies: Acknowledgment that monetary damages are inadequate and immediate injunctive relief is warranted without posting bond.`,
    sourceRef: 'Model Corporate Forms Library, NDA-2026',
    lastUpdated: 'Jan 20, 2026',
    isClientSafe: true,
    tags: ['nda', 'confidentiality', 'contracts']
  },
  {
    id: 'leg-5',
    verticalId: 'legal',
    title: 'Settlement Authority & Release Standards',
    category: 'Litigation Clauses',
    content: `No settlement agreement or memorandum of understanding shall be entered into without signed written authorization from client principal.
All general releases must include express California Civil Code § 1542 waiver acknowledging that the releasor knowingly waives claims not currently known or suspected to exist at execution.`,
    sourceRef: 'Dispute Resolution Protocol § 6.4',
    lastUpdated: 'Jan 10, 2026',
    isClientSafe: false,
    tags: ['settlement', 'release', 'civil code 1542']
  },

  // --- CLINICAL PRACTICE KNOWLEDGE ---
  {
    id: 'cln-1',
    verticalId: 'clinic',
    title: 'In-Network Insurance & Co-Pay Schedule (2026)',
    category: 'Billing & Insurance',
    content: `Contracted In-Network Commercial Plans:
- Blue Shield of California (PPO / EPO)
- Aetna Choice POS II and Open Access PPO
- UnitedHealthcare Choice Plus
- Medicare Part B (Direct Assignment)
Out-of-Network Plans: Cigna (superbill provided), Kaiser Permanente (not accepted; HMO referral required).
Standard Specialist Visit Co-Pay: $45. Preventive well-child and annual physical visits covered at 100% under ACA for in-network plans without deductible.
Self-Pay Initial Consultation Fee: $285; Follow-up 30-min visit: $165.`,
    sourceRef: 'Aura Practice Billing Guide v4.1',
    lastUpdated: 'Feb 15, 2026',
    isClientSafe: true,
    tags: ['insurance', 'copay', 'billing', 'plans']
  },
  {
    id: 'cln-2',
    verticalId: 'clinic',
    title: 'Comprehensive Metabolic Panel (CMP) & Lipid Fasting Protocol',
    category: 'Pre-Visit Preparation',
    content: `Required Fasting Duration: 10 to 12 hours prior to scheduled morning venous blood collection.
Permitted Intake: Plain water ONLY. Black coffee, tea, zero-calorie sodas, gum, mints, and juices are strictly prohibited as they alter serum glucose and hepatic enzyme readings.
Medication Instructions: Prescribed morning antihypertensive (blood pressure) and thyroid medications may be taken with a small sip of water. Diabetic insulin/oral hypoglycemics should be held until after blood draw and meal; consult doctor if unclear.`,
    sourceRef: 'Clinical Lab Protocol #104',
    lastUpdated: 'Jan 08, 2026',
    isClientSafe: true,
    tags: ['fasting', 'lab', 'blood test', 'preparation']
  },
  {
    id: 'cln-3',
    verticalId: 'clinic',
    title: 'Prescription Refill & Controlled Substances Policy',
    category: 'Clinical Policies',
    content: `Refill Processing Timeline: Standard maintenance medications require 48 to 72 business hours notice. Submit request via patient portal or contact pharmacy directly.
Controlled Substances (Schedule II-IV, e.g. ADHD stimulants, sedatives, prescription opioids):
- California CURES mandate requires an in-person or telehealth visit every 6 months.
- No early refills permitted under any circumstances.
- Zero refills called in over the weekend or by after-hours on-call service.`,
    sourceRef: 'Pharmacy Compliance Directive § 3.2',
    lastUpdated: 'Mar 01, 2026',
    isClientSafe: true,
    tags: ['prescriptions', 'refills', 'controlled substances', 'pharmacy']
  },
  {
    id: 'cln-4',
    verticalId: 'clinic',
    title: 'Prior Authorization Appeal Documentation Standard',
    category: 'Insurance Appeals',
    content: `When drafting insurance prior-authorization appeals for specialized biologicals, diagnostic MRIs, or GLP-1 therapies:
1. Document failure or intolerable adverse side effects of at least two (2) formulary first-line generic agents (specify trial dates, dosages, and exact clinical reason for discontinuation).
2. Reference specific clinical biomarkers: HbA1c > 8.0%, elevated hs-CRP, or specific biopsy findings.
3. Cite FDA approved indications and current peer-reviewed society guidelines (e.g., ADA, AHA).
4. State explicit prognosis and imminent acute risk if patient is denied coverage.`,
    sourceRef: 'Appeals & Utilization Committee Standard #18',
    lastUpdated: 'Feb 20, 2026',
    isClientSafe: false, // Internal drafting protocol
    tags: ['prior authorization', 'appeals', 'denial', 'insurance']
  },
  {
    id: 'cln-5',
    verticalId: 'clinic',
    title: 'Pediatric Fever & Triage Escalation Guidelines',
    category: 'Pediatric Care',
    content: `Infants under 3 months of age with a rectal temperature of 100.4°F (38°C) or higher require immediate Emergency Room evaluation for neonatal sepsis workup; do not give antipyretics without physician direction.
Children 3 months to 3 years: Fever lasting over 72 hours, lethargy, poor hydration, or persistent vomiting requires same-day in-office evaluation.
Nurse triage line is available 24/7 for existing active patients at (650) 412-8800 ext 4.`,
    sourceRef: 'Pediatric Clinical Guidelines § 7.1',
    lastUpdated: 'Jan 12, 2026',
    isClientSafe: true,
    tags: ['pediatrics', 'fever', 'triage', 'emergency']
  },

  // --- REAL ESTATE BROKERAGE KNOWLEDGE ---
  {
    id: 'rea-1',
    verticalId: 'realty',
    title: 'Brokerage Representation Commission Standards (2026)',
    category: 'Brokerage Terms',
    content: `Post-NAR Settlement Compliance:
- Mandatory Written Buyer Agreement: California law requires execution of a written Broker-Buyer Representation Agreement prior to an agent touring any residential property with a prospective buyer.
- Professional Fee: Standard negotiated buyer representation fee is 2.5% of total purchase price.
- Seller Concessions: The brokerage will negotiate for seller-paid buyer broker concessions in the purchase offer. If seller concedes less than agreed fee, client is responsible for remainder pursuant to agreement.`,
    sourceRef: 'Brokerage Compliance Manual § 1.4',
    lastUpdated: 'Feb 10, 2026',
    isClientSafe: true,
    tags: ['commission', 'buyer agreement', 'fees', 'nar settlement']
  },
  {
    id: 'rea-2',
    verticalId: 'realty',
    title: '742 Evergreen Terrace HOA Covenants & Restrictions',
    category: 'Property Specific',
    content: `HOA Dues: $485/month. Covers exterior building maintenance, roof reserves, water/sewer, earthquake insurance rider, and heated pool/clubhouse.
Pet Restrictions: Maximum two (2) domestic pets (dogs/cats) per unit, combined weight not to exceed 50 lbs. Aggressive breeds prohibited by HOA master insurer.
Rental Cap & Leasing Rules: Maximum 20% rental density in complex (currently at 14% occupancy cap, waitlist inactive). Minimum lease term is six (6) consecutive months. Short-term rentals (Airbnb, VRBO) are strictly banned with $1,000 fine per violation.
Quiet Hours: 10:00 PM to 8:00 AM daily.`,
    sourceRef: '742 Evergreen Terrace HOA CC&Rs recorded Book 891, Page 22',
    lastUpdated: 'Jan 28, 2026',
    isClientSafe: true,
    tags: ['hoa', 'pets', 'rentals', 'restrictions', 'condo']
  },
  {
    id: 'rea-3',
    verticalId: 'realty',
    title: 'Standard Purchase Contract Timelines & Contingency Windows',
    category: 'Transaction Protocols',
    content: `Earnest Money Deposit (EMD): 3% of purchase price must be wired to Fidelity National Title / Escrow within three (3) business days of mutual acceptance.
Inspection Contingency: Standard default is seventeen (17) calendar days for physical inspection, sewer scope, and termite (Wood Destroying Pest) inspection.
Appraisal Contingency: Seventeen (17) calendar days from acceptance.
Loan Contingency: Twenty-one (21) calendar days for full loan underwriting commitment.
Liquidated Damages: Under Cal. Civ. Code § 1675, buyer liability upon default is capped at 3% of purchase price.`,
    sourceRef: 'California Residential Purchase Agreement (C.A.R. Form RPA) Manual',
    lastUpdated: 'Feb 22, 2026',
    isClientSafe: true,
    tags: ['escrow', 'contingency', 'earnest money', 'timelines']
  },
  {
    id: 'rea-4',
    verticalId: 'realty',
    title: 'Fair Housing Act Strict Non-Demographic Policy',
    category: 'Ethics & Compliance',
    content: `All agents and AI assistants must strictly uphold federal, state, and local Fair Housing laws.
Under no circumstances may the assistant provide answers or opinions regarding neighborhood racial makeup, religious demographics, safety ratings based on stereotypes, or school quality characterizations that could be interpreted as steering.
Inquirers seeking neighborhood statistics must be directed to official municipal census databases and Department of Education public school portals.`,
    sourceRef: 'Equal Housing Opportunity Compliance Directive 2026',
    lastUpdated: 'Jan 05, 2026',
    isClientSafe: true,
    tags: ['fair housing', 'compliance', 'ethics', 'demographics']
  },

  // --- ACCOUNTING KNOWLEDGE ---
  {
    id: 'acc-1',
    verticalId: 'accounting',
    title: '2026 Statutory Tax Deadlines & Extension Rules',
    category: 'Tax Deadlines',
    content: `March 16, 2026: S-Corporation (Form 1120-S) and Partnership (Form 1065) calendar-year returns or 6-month extension requests (Form 7004) due.
April 15, 2026: Individual income tax returns (Form 1040), C-Corporations (Form 1120), and Q1 Estimated Tax Payments due.
Extension Caveat: An extension of time to file is NOT an extension of time to pay. Failure to pay at least 90% of tax liability by April 15 incurs IRC § 6651 late payment penalties and compounded interest.`,
    sourceRef: 'Apex Tax Calendar Memorandum 2026',
    lastUpdated: 'Jan 10, 2026',
    isClientSafe: true,
    tags: ['deadlines', 'extensions', 'irs', 'corporate tax']
  },
  {
    id: 'acc-2',
    verticalId: 'accounting',
    title: 'Standard Business Vehicle Mileage & Deduction Standards',
    category: 'Deductions & Compliance',
    content: `IRS Standard Mileage Rate (2026): 67 cents per mile for business use of a personal vehicle.
Audit Documentation Mandate: Contemporaneous mileage log required under IRC § 274(d). Log must record date, destination, business purpose, and odometer readings. Credit card receipts for gas do not substitute for a mileage log.`,
    sourceRef: 'IRS Notice 2026-02 Compliance Memo',
    lastUpdated: 'Jan 18, 2026',
    isClientSafe: true,
    tags: ['mileage', 'deductions', 'audit', 'irs']
  }
];

export const INITIAL_TEMPLATES: DocumentTemplate[] = [
  // --- LEGAL TEMPLATES ---
  {
    id: 'tmpl-leg-demand',
    verticalId: 'legal',
    title: 'Breach of Contract Formal Demand & Cure Notice',
    documentType: 'Legal Demand Letter',
    description: 'Statutory demand letter to breaching party alleging default, itemizing damages, and establishing a 10-day cure window before civil litigation.',
    suggestedJurisdiction: 'California Superior Court',
    variables: [
      { key: 'targetEntity', label: 'Breaching Party Name', placeholder: 'e.g. Apex Industrial Solutions Inc.', defaultValue: 'Vortex Media Group LLC', type: 'text' },
      { key: 'contractDate', label: 'Original Agreement Date', placeholder: 'e.g. June 14, 2025', defaultValue: 'August 12, 2025', type: 'text' },
      { key: 'amountOwed', label: 'Outstanding Liquidated Amount ($)', placeholder: 'e.g. $142,500.00', defaultValue: '$87,450.00', type: 'text' },
      { key: 'curePeriodDays', label: 'Cure Period (Business Days)', placeholder: '10', defaultValue: '10', type: 'number' },
    ],
    defaultMatterDetails: 'Breach of Section 3.2 Master Services Agreement for non-payment of deliverable invoices #2026-104 and #2026-108 despite full client milestone acceptance. Client has delivered formal notice without cure.',
    relevantKnowledgeCategories: ['Litigation Clauses', 'Billing & Retainers', 'Contract Standards']
  },
  {
    id: 'tmpl-leg-retainer',
    verticalId: 'legal',
    title: 'Attorney-Client Engagement & Retainer Agreement',
    documentType: 'Engagement Agreement',
    description: 'Full-form professional legal representation agreement detailing scope of advocacy, partner hourly rates, IOLTA escrow minimums, and dispute resolution.',
    suggestedJurisdiction: 'State of California',
    variables: [
      { key: 'clientName', label: 'Client / Corporate Entity', placeholder: 'e.g. Horizon Therapeutics Inc.', defaultValue: 'Pacifica Biotech Ventures LLC', type: 'text' },
      { key: 'matterScope', label: 'Scope of Representation', placeholder: 'e.g. Defense of breach of licensing agreement', defaultValue: 'Defense and representation in commercial licensing dispute against MedCore Inc.', type: 'text' },
      { key: 'initialRetainerAmount', label: 'Initial Retainer ($)', placeholder: '$10,000.00', defaultValue: '$10,000.00', type: 'text' },
      { key: 'leadAttorney', label: 'Lead Supervising Partner', placeholder: 'e.g. Eleanor Thorne, Esq.', defaultValue: 'Eleanor Thorne, Esq.', type: 'text' },
    ],
    defaultMatterDetails: 'Representation in ongoing vendor dispute including pre-litigation correspondence, mediation proceedings, and if necessary filing of civil complaints.',
    relevantKnowledgeCategories: ['Billing & Retainers', 'Intake & Ethics']
  },
  {
    id: 'tmpl-leg-nda',
    verticalId: 'legal',
    title: 'Mutual Non-Disclosure Agreement (Bilateral)',
    documentType: 'Non-Disclosure Agreement',
    description: 'Bilateral protective covenant safeguarding proprietary algorithms, customer lists, and financial projections with 2-year survival clause.',
    suggestedJurisdiction: 'California / Federal DTSA',
    variables: [
      { key: 'disclosingParty', label: 'Party A Name', placeholder: 'e.g. Vance Thorne Client Corp.', defaultValue: 'Acuity Systems Corp.', type: 'text' },
      { key: 'receivingParty', label: 'Party B Name', placeholder: 'e.g. Prospective Buyer Corp.', defaultValue: 'Starlight Global Capital Inc.', type: 'text' },
      { key: 'durationYears', label: 'Confidentiality Term (Years)', placeholder: '2', defaultValue: '2', type: 'number' },
    ],
    defaultMatterDetails: 'Mutual exchange of proprietary financial models, source code documentation, and strategic enterprise client rosters for proposed M&A transaction.',
    relevantKnowledgeCategories: ['Contract Standards']
  },

  // --- CLINICAL TEMPLATES ---
  {
    id: 'tmpl-cln-priorauth',
    verticalId: 'clinic',
    title: 'Medical Necessity Prior Authorization Appeal',
    documentType: 'Medical Necessity Appeal Letter',
    description: 'Formal physician clinical appeal letter contesting insurer denial for medication or advanced diagnostic procedure, citing failed conservative treatments and biomarker criteria.',
    suggestedJurisdiction: 'HIPAA & ACA Utilization Review Standards',
    variables: [
      { key: 'patientName', label: 'Patient Full Name', placeholder: 'e.g. Sarah Jenkins', defaultValue: 'Sarah Jenkins', type: 'text' },
      { key: 'patientDOB', label: 'Date of Birth', placeholder: 'MM/DD/YYYY', defaultValue: '04/18/1978', type: 'text' },
      { key: 'insuranceCompany', label: 'Insurer / Plan Name', placeholder: 'e.g. Aetna Choice POS II', defaultValue: 'Aetna Choice POS II', type: 'text' },
      { key: 'denialReference', label: 'Denial Reference / Case #', placeholder: 'e.g. PA-981240-2026', defaultValue: 'PA-981240-2026', type: 'text' },
      { key: 'requestedTreatment', label: 'Requested Therapy / Procedure', placeholder: 'e.g. Dupixent (dupilumab) 300mg bi-weekly', defaultValue: 'Dupixent (dupilumab) 300mg subcutaneous injection', type: 'text' },
    ],
    defaultMatterDetails: 'Patient presents with severe refractory atopic dermatitis (EASI score 28) failing consecutive 12-week trials of high-potency topical corticosteroids (clobetasol) and oral methotrexate with liver enzyme elevation.',
    relevantKnowledgeCategories: ['Insurance Appeals', 'Billing & Insurance']
  },
  {
    id: 'tmpl-cln-discharge',
    verticalId: 'clinic',
    title: 'Clinical Care Plan & Discharge Instructions',
    documentType: 'Patient Discharge Instructions',
    description: 'Clear, patient-centered clinical care plan detailing post-visit regimen, medication adjustments, red-flag symptoms, and scheduled follow-up visits.',
    suggestedJurisdiction: 'Outpatient Clinical Standards',
    variables: [
      { key: 'patientName', label: 'Patient Name', placeholder: 'e.g. Robert Chen', defaultValue: 'Robert Chen', type: 'text' },
      { key: 'primaryDiagnosis', label: 'Primary Clinical Diagnosis', placeholder: 'e.g. Type 2 Diabetes & Hypertension', defaultValue: 'Essential Hypertension & Early Diabetic Nephropathy', type: 'text' },
      { key: 'physicianName', label: 'Attending Physician', placeholder: 'e.g. Dr. Julian Vance, MD', defaultValue: 'Dr. Evelyn Martinez, MD', type: 'text' },
    ],
    defaultMatterDetails: 'In-office blood pressure controlled at 134/82 on adjusted Lisinopril 20mg daily. Scheduled CMP and Microalbumin lab panel in 6 weeks.',
    relevantKnowledgeCategories: ['Pre-Visit Preparation', 'Clinical Policies']
  },

  // --- REAL ESTATE TEMPLATES ---
  {
    id: 'tmpl-rea-counter',
    verticalId: 'realty',
    title: 'Purchase & Sale Agreement Counter-Offer #1',
    documentType: 'Purchase Agreement Counter-Offer',
    description: 'Contractual counter-offer modifying offer price, escrow duration, earnest deposit timing, and contingency release windows pursuant to C.A.R. regulations.',
    suggestedJurisdiction: 'California Association of Realtors (C.A.R.)',
    variables: [
      { key: 'propertyAddress', label: 'Property Address', placeholder: 'e.g. 742 Evergreen Terrace, Unit 4B', defaultValue: '742 Evergreen Terrace, Unit 4B, Pasadena, CA 91101', type: 'text' },
      { key: 'buyerName', label: 'Prospective Buyer(s)', placeholder: 'e.g. David and Claire Miller', defaultValue: 'David and Claire Miller', type: 'text' },
      { key: 'counterPrice', label: 'Counter-Offer Price ($)', placeholder: '$1,285,000.00', defaultValue: '$1,295,000.00', type: 'text' },
      { key: 'escrowDays', label: 'Escrow Period (Calendar Days)', placeholder: '30', defaultValue: '25', type: 'number' },
    ],
    defaultMatterDetails: 'Seller counters initial purchase offer: counter price $1,295,000; earnest money deposit increased to 3% wired within 3 business days; inspection contingency shortened to 12 calendar days; seller credit for closing costs capped at $5,000.',
    relevantKnowledgeCategories: ['Property Specific', 'Transaction Protocols', 'Brokerage Terms']
  },
  {
    id: 'tmpl-rea-buyer-rep',
    verticalId: 'realty',
    title: 'Exclusive Buyer-Broker Representation Agreement',
    documentType: 'Representation Agreement',
    description: 'Compliant post-settlement buyer representation agreement detailing brokerage duties, 2.5% negotiated representation fee, and scope of property showings.',
    suggestedJurisdiction: 'California DRE Standards',
    variables: [
      { key: 'buyerName', label: 'Buyer Name(s)', placeholder: 'e.g. Marcus Vance', defaultValue: 'Marcus Vance', type: 'text' },
      { key: 'geographicalScope', label: 'Target Search Territory', placeholder: 'e.g. West Los Angeles, Santa Monica', defaultValue: 'Pasadena, San Marino, and South Pasadena, CA', type: 'text' },
      { key: 'agreementTermMonths', label: 'Agreement Duration (Months)', placeholder: '6', defaultValue: '6', type: 'number' },
    ],
    defaultMatterDetails: 'Exclusive representation for single-family residential properties up to $2,500,000. Broker fee 2.5% to be requested as seller concession in purchase offer.',
    relevantKnowledgeCategories: ['Brokerage Terms', 'Ethics & Compliance']
  }
];

export const CLIENT_INQUIRY_PRESETS: Record<string, ClientInquiryPreset[]> = {
  legal: [
    {
      id: 'pre-leg-1',
      label: 'Hourly Rates & Retainers',
      category: 'Billing',
      question: 'What are your hourly billing rates for contract disputes, and how much is the initial litigation retainer required?'
    },
    {
      id: 'pre-leg-2',
      label: 'Conflict Clearance Check',
      category: 'Intake',
      question: 'Can your firm represent me if the opposing party worked with Vance & Thorne three years ago?'
    },
    {
      id: 'pre-leg-3',
      label: 'Breach Notice Cure Window',
      category: 'Litigation',
      question: 'How many days does the other party get to cure a contract breach under your standard demand notice?'
    },
    {
      id: 'pre-leg-4',
      label: 'Mutual NDA Duration',
      category: 'Contracts',
      question: 'How long do confidentiality protections last under your standard mutual NDA?'
    }
  ],
  clinic: [
    {
      id: 'pre-cln-1',
      label: 'Blood Test Fasting Rules',
      category: 'Preparation',
      question: 'I have a comprehensive metabolic and lipid blood draw tomorrow at 9 AM. Can I drink black coffee or take my morning blood pressure pill?'
    },
    {
      id: 'pre-cln-2',
      label: 'Accepted Insurance & Co-Pays',
      category: 'Insurance',
      question: 'Do you take Blue Shield of California PPO, and what is the standard co-pay for a specialist consultation?'
    },
    {
      id: 'pre-cln-3',
      label: 'Prescription Refill Timelines',
      category: 'Pharmacy',
      question: 'How much notice is needed to refill my regular maintenance medication, and can the assistant call in an urgent weekend refill?'
    },
    {
      id: 'pre-cln-4',
      label: 'Pediatric Infant Fever',
      category: 'Triage',
      question: 'My 7-week-old baby has a 100.8°F rectal fever. What should I give them and should we wait until morning?'
    }
  ],
  realty: [
    {
      id: 'pre-rea-1',
      label: '742 Evergreen Pet & Rental HOA Rules',
      category: 'HOA & CC&Rs',
      question: 'What are the pet weight limits and rental restrictions for the condo at 742 Evergreen Terrace?'
    },
    {
      id: 'pre-rea-2',
      label: 'Earnest Money Deposit Deadline',
      category: 'Escrow',
      question: 'Once our purchase offer is accepted, how much earnest money is required and what is the deadline to wire it to escrow?'
    },
    {
      id: 'pre-rea-3',
      label: 'Buyer Agreement Requirement',
      category: 'Representation',
      question: 'Do I have to sign a buyer representation agreement before our agent takes us to view homes this weekend?'
    },
    {
      id: 'pre-rea-4',
      label: 'Neighborhood Demographics Query',
      category: 'Compliance',
      question: 'Can you tell me what kind of families live in this neighborhood and what the ethnic breakdown is?'
    }
  ],
  accounting: [
    {
      id: 'pre-acc-1',
      label: 'S-Corp Filing Deadline',
      category: 'Tax Deadlines',
      question: 'When is the 2026 tax filing deadline for our S-Corporation Form 1120-S, and does filing an extension give us more time to pay?'
    },
    {
      id: 'pre-acc-2',
      label: 'Mileage Deduction Documentation',
      category: 'Deductions',
      question: 'What is the standard IRS business mileage rate for 2026 and what documentation is required if we get audited?'
    }
  ]
};
