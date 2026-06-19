// ─── BRAND COLORS ────────────────────────────────────────────────────────────
export const BRAND = {
  navy:  "#1B2A4A",
  teal:  "#2BA8A0",
  gold:  "#F5B800",
  dark:  "#0E1A30",
  lt:    "#EAF4F4",
  sl:    "#D8E6EC",
  gray:  "#8A9BB0",
} as const;

// ─── TYPES ───────────────────────────────────────────────────────────────────
export type KYCStatus = "pending" | "approved" | "rejected";
export type ProjectStatus = "new" | "docs_pending" | "in_progress" | "completed";
export type Tier = "starter" | "silver" | "gold" | "platinum";
export type PayoutStatus = "processing" | "paid" | "pending";

export interface Associate {
  id: string;
  name: string;
  email: string;
  mobile: string;
  region: string;
  tier: Tier;
  kyc: KYCStatus;
  customers: number;
  kwpSold: number;
  revenue: number;
  commissionEarned: number;
  commissionPending: number;
  joinedAt: string;
  bankAccount: string;
  ifsc: string;
}

export interface Customer {
  id: string;
  associateId: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  discom: string;
  systemKwp: number;
  phase: "Single Phase" | "3 Phase";
  systemType: "ON Grid" | "OFF Grid" | "Hybrid";
  status: ProjectStatus;
  docsUploaded: number;
  docsRequired: number;
  gpsLat?: number;
  gpsLng?: number;
  createdAt: string;
}

export interface Quote {
  id: string;
  associateId: string;
  customerId: string;
  customerName: string;
  kwp: number;
  phase: string;
  panelBrand: string;
  panelDesc: string;
  totalCost: number;
  subsidy: number;
  netAmount: number;
  createdAt: string;
  status: "draft" | "sent" | "accepted" | "rejected";
}

export interface CommissionSlab {
  tier: Tier;
  label: string;
  salesRange: string;
  amount: number;
  targetBonus: number;
  annualBonus: number;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  type: "cash" | "trip" | "gift" | "referral";
  bonus: number;
  target: number;
  tier: string;
  expiresAt: string;
  active: boolean;
  tag: "HOT" | "NEW" | "BONUS" | "SPECIAL";
}

export interface PricingConfig {
  ratePerKwpSinglePhase: number;
  ratePerKwp3Phase: number;
  fixedPrices: Record<number, number>;
  subsidy1kw: number;
  subsidy2kw: number;
  subsidy3kwPlus: number;
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
export const mockAssociates: Associate[] = [
  {
    id: "SOL-2025-001", name: "Anita Joshi",     email: "anita@mail.com",
    mobile: "9876543210", region: "Kota",   tier: "gold",
    kyc: "approved",  customers: 22, kwpSold: 84,
    revenue: 680000,  commissionEarned: 156000, commissionPending: 0,
    joinedAt: "2024-01-15", bankAccount: "XXXX4421", ifsc: "SBIN0001234",
  },
  {
    id: "SOL-2025-002", name: "Sunil Meena",     email: "sunil@mail.com",
    mobile: "9876543211", region: "Jaipur", tier: "gold",
    kyc: "approved",  customers: 18, kwpSold: 68,
    revenue: 540000,  commissionEarned: 132000, commissionPending: 18000,
    joinedAt: "2024-02-20", bankAccount: "XXXX5532", ifsc: "HDFC0001234",
  },
  {
    id: "SOL-2025-003", name: "Mohan Verma",     email: "mohan@mail.com",
    mobile: "8114404945", region: "Ajmer", tier: "silver",
    kyc: "approved",  customers: 14, kwpSold: 52,
    revenue: 420000,  commissionEarned: 47000,  commissionPending: 24000,
    joinedAt: "2024-03-10", bankAccount: "XXXX4421", ifsc: "SBIN0001234",
  },
  {
    id: "SOL-2025-004", name: "Ramesh Kumar",    email: "ramesh@mail.com",
    mobile: "9988776655", region: "Jaipur", tier: "starter",
    kyc: "pending",   customers: 0,  kwpSold: 0,
    revenue: 0,       commissionEarned: 0,       commissionPending: 0,
    joinedAt: "2025-06-10", bankAccount: "XXXX6643", ifsc: "HDFC0005678",
  },
  {
    id: "SOL-2025-005", name: "Priya Sharma",    email: "priya@mail.com",
    mobile: "9977665544", region: "Jodhpur", tier: "starter",
    kyc: "pending",   customers: 0,  kwpSold: 0,
    revenue: 0,       commissionEarned: 0,       commissionPending: 0,
    joinedAt: "2025-06-15", bankAccount: "XXXX7754", ifsc: "ICIC0001234",
  },
];

export const mockCustomers: Customer[] = [
  {
    id: "CUST-001", associateId: "SOL-2025-003",
    name: "Suresh Agarwal",  mobile: "9800112233", email: "suresh@gmail.com",
    address: "Village Nasirabad", city: "Ajmer", discom: "RVV-JA-045821",
    systemKwp: 5, phase: "Single Phase", systemType: "ON Grid",
    status: "in_progress", docsUploaded: 6, docsRequired: 7,
    gpsLat: 26.4499, gpsLng: 74.6399, createdAt: "2025-06-01",
  },
  {
    id: "CUST-002", associateId: "SOL-2025-003",
    name: "Geeta Devi",      mobile: "8765544321", email: "geeta@gmail.com",
    address: "Beawar Town",  city: "Beawar",  discom: "RVV-BW-012345",
    systemKwp: 3, phase: "Single Phase", systemType: "ON Grid",
    status: "completed",    docsUploaded: 7, docsRequired: 7,
    createdAt: "2025-05-20",
  },
  {
    id: "CUST-003", associateId: "SOL-2025-003",
    name: "Hari Singh",      mobile: "9934121234", email: "hari@gmail.com",
    address: "Nasirabad Road", city: "Ajmer", discom: "RVV-JA-098765",
    systemKwp: 7, phase: "3 Phase",       systemType: "ON Grid",
    status: "docs_pending",  docsUploaded: 3, docsRequired: 7,
    createdAt: "2025-06-10",
  },
  {
    id: "CUST-004", associateId: "SOL-2025-001",
    name: "Kavita Meena",    mobile: "9450055678", email: "kavita@gmail.com",
    address: "Kota Main",    city: "Kota",    discom: "RVV-KT-054321",
    systemKwp: 3, phase: "Single Phase", systemType: "ON Grid",
    status: "completed",     docsUploaded: 7, docsRequired: 7,
    createdAt: "2025-05-15",
  },
  {
    id: "CUST-005", associateId: "SOL-2025-002",
    name: "Rajendra Patel",  mobile: "9011234567", email: "raj@gmail.com",
    address: "Jaipur North", city: "Jaipur", discom: "RVV-JP-087654",
    systemKwp: 10, phase: "3 Phase",      systemType: "ON Grid",
    status: "in_progress",   docsUploaded: 7, docsRequired: 7,
    createdAt: "2025-06-05",
  },
];

export const mockQuotes: Quote[] = [
  {
    id: "SOL-QT-2025-089", associateId: "SOL-2025-003",
    customerId: "CUST-001",   customerName: "Suresh Agarwal",
    kwp: 5, phase: "Single Phase", panelBrand: "INA",
    panelDesc: "INA DCR (TOPCON Bifacial) 600 Wp",
    totalCost: 256250, subsidy: 78000, netAmount: 178250,
    createdAt: "2025-06-12", status: "sent",
  },
  {
    id: "SOL-QT-2025-088", associateId: "SOL-2025-001",
    customerId: "CUST-004",   customerName: "Kavita Meena",
    kwp: 3, phase: "Single Phase", panelBrand: "Waaree",
    panelDesc: "Waaree (Mono PERC) 545 Wp",
    totalCost: 153750, subsidy: 78000, netAmount: 75750,
    createdAt: "2025-06-10", status: "accepted",
  },
  {
    id: "SOL-QT-2025-087", associateId: "SOL-2025-002",
    customerId: "CUST-005",   customerName: "Rajendra Patel",
    kwp: 10, phase: "3 Phase", panelBrand: "Tata Power",
    panelDesc: "Tata Power (Mono PERC) 550 Wp",
    totalCost: 512500, subsidy: 78000, netAmount: 434500,
    createdAt: "2025-06-08", status: "accepted",
  },
];

export const mockCommissionSlabs: CommissionSlab[] = [
  { tier: "starter",  label: "Starter",  salesRange: "1–4 / month",  amount: 8000,  targetBonus: 0,     annualBonus: 0 },
  { tier: "silver",   label: "Silver",   salesRange: "5–9 / month",  amount: 10000, targetBonus: 2000,  annualBonus: 0 },
  { tier: "gold",     label: "Gold",     salesRange: "10–14 / month", amount: 12000, targetBonus: 5000, annualBonus: 0 },
  { tier: "platinum", label: "Platinum", salesRange: "15+ / month",  amount: 15000, targetBonus: 0,    annualBonus: 50000 },
];

export const mockOffers: Offer[] = [
  {
    id: "OFF-001", title: "June Star Performer — ₹5,000 Bonus + Jaipur Trip",
    description: "Complete 10 installations in June 2025 and win ₹5,000 cash bonus + all-expenses-paid family trip to Jaipur sponsored by Solvanta Solar Energy.",
    type: "trip", bonus: 5000, target: 10, tier: "All Tiers",
    expiresAt: "2025-06-30", active: true, tag: "HOT",
  },
  {
    id: "OFF-002", title: "Referral Bonus — ₹3,000 per Referral",
    description: "Refer a friend as associate. Once they complete 3 installations, you earn ₹3,000. No limit on referrals.",
    type: "referral", bonus: 3000, target: 3, tier: "All Tiers",
    expiresAt: "2099-12-31", active: true, tag: "BONUS",
  },
  {
    id: "OFF-003", title: "Digital Champion — Smartphone Prize",
    description: "Upload all customer documents within 48 hours of installation for 3 consecutive months. Win Redmi smartphone worth ₹15,000.",
    type: "gift", bonus: 15000, target: 3, tier: "Silver & Above",
    expiresAt: "2025-09-30", active: true, tag: "NEW",
  },
];

export const mockPricing: PricingConfig = {
  ratePerKwpSinglePhase: 52000,
  ratePerKwp3Phase: 51250,
  fixedPrices: {
    1: 52000, 2: 104000, 3: 153750, 4: 205000,
    5: 256250, 6: 307500, 7: 358750, 8: 410000,
    9: 461250, 10: 512500,
  },
  subsidy1kw: 30000,
  subsidy2kw: 60000,
  subsidy3kwPlus: 78000,
};

export const mockRegionRevenue = [
  { region: "Jaipur",  revenue: 3200000 },
  { region: "Jodhpur", revenue: 1900000 },
  { region: "Ajmer",   revenue: 1500000 },
  { region: "Kota",    revenue: 1100000 },
  { region: "Bikaner", revenue: 760000  },
];

export const PANEL_OPTIONS = [
  { brand: "INA",       desc: "INA DCR (TOPCON Bifacial) 600 Wp",  watt: 600 },
  { brand: "X-Watt",   desc: "X-Watt (TOPCON) 550 Wp",            watt: 550 },
  { brand: "Waaree",   desc: "Waaree (Mono PERC) 545 Wp",          watt: 545 },
  { brand: "Tata Power",desc: "Tata Power (Mono PERC) 550 Wp",     watt: 550 },
  { brand: "Adani",    desc: "Adani (Mono PERC) 540 Wp",           watt: 540 },
  { brand: "Luminous", desc: "Luminous (Poly) 380 Wp",             watt: 380 },
];

export const DOCS_REQUIRED = [
  { id: "aadhaar",   label: "Aadhaar Card",                  hint: "Front & Back" },
  { id: "pan",       label: "PAN Card",                      hint: "Clear scan" },
  { id: "elecbill",  label: "Electricity Bill",              hint: "Latest 1–3 months" },
  { id: "cheque",    label: "Cancelled Cheque",              hint: "Account name visible" },
  { id: "gmail",     label: "Gmail ID",                      hint: "Screenshot of Gmail" },
  { id: "mobile",    label: "Mobile Number Proof",           hint: "Mobile bill / OTP" },
  { id: "sitePhoto", label: "Site Photo with Client",        hint: "GPS camera required" },
];
