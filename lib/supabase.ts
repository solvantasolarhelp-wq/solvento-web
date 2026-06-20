import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Database Types ───────────────────────────────────────────────────────────
export type KYCStatus = "pending" | "approved" | "rejected";
export type ProjectStatus = "new" | "docs_pending" | "in_progress" | "completed";
export type Tier = "starter" | "silver" | "gold" | "platinum";
export type PayoutStatus = "processing" | "paid" | "pending";
export type QuoteStatus = "draft" | "sent" | "accepted" | "rejected";

export interface Associate {
  id: string;
  name: string;
  email: string;
  mobile: string;
  aadhaar: string;
  region: string;
  tier: Tier;
  kyc: KYCStatus;
  customers: number;
  kwp_sold: number;
  revenue: number;
  commission_earned: number;
  commission_pending: number;
  joined_at: string;
  bank_account?: string;
  ifsc?: string;
  created_at?: string;
}

export interface Customer {
  id: string;
  associate_id: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  discom: string;
  system_kwp: number;
  phase: "Single Phase" | "3 Phase";
  system_type: "ON Grid" | "OFF Grid" | "Hybrid";
  status: ProjectStatus;
  docs_uploaded: number;
  docs_required: number;
  gps_lat?: number;
  gps_lng?: number;
  created_at: string;
}

export interface Quote {
  id: string;
  associate_id: string;
  customer_id: string;
  customer_name: string;
  kwp: number;
  phase: string;
  panel_brand: string;
  panel_desc: string;
  total_cost: number;
  subsidy: number;
  net_amount: number;
  created_at: string;
  status: QuoteStatus;
}

export interface Commission {
  id: string;
  associate_id: string;
  associate_name: string;
  amount: number;
  type: "sale" | "bonus" | "referral";
  status: PayoutStatus;
  description: string;
  created_at: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  type: "cash" | "trip" | "gift" | "referral";
  bonus: number;
  target: number;
  tier: string;
  expires_at: string;
  active: boolean;
  tag: "HOT" | "NEW" | "BONUS" | "SPECIAL";
}
