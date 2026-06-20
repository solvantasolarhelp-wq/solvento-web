// ─── Supabase DB helpers — replaces mock-data.ts calls ───────────────────────
import { supabase, Associate, Customer, Quote, Commission, Offer } from "./supabase";

// ── ASSOCIATES ────────────────────────────────────────────────────────────────
export async function getAssociates(): Promise<Associate[]> {
  const { data, error } = await supabase.from("associates").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getAssociate(id: string): Promise<Associate | null> {
  const { data, error } = await supabase.from("associates").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function createAssociate(payload: Pick<Associate, "name" | "email" | "mobile" | "aadhaar">): Promise<Associate> {
  const { data, error } = await supabase.from("associates").insert([{ ...payload, tier: "starter", kyc: "pending" }]).select().single();
  if (error) throw error;
  return data;
}

export async function updateAssociate(id: string, payload: Partial<Associate>): Promise<void> {
  const { error } = await supabase.from("associates").update(payload).eq("id", id);
  if (error) throw error;
}

// ── CUSTOMERS ─────────────────────────────────────────────────────────────────
export async function getCustomers(associateId?: string): Promise<Customer[]> {
  let query = supabase.from("customers").select("*").order("created_at", { ascending: false });
  if (associateId) query = query.eq("associate_id", associateId);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createCustomer(payload: Omit<Customer, "id" | "created_at">): Promise<Customer> {
  const { data, error } = await supabase.from("customers").insert([payload]).select().single();
  if (error) throw error;
  return data;
}

export async function updateCustomer(id: string, payload: Partial<Customer>): Promise<void> {
  const { error } = await supabase.from("customers").update(payload).eq("id", id);
  if (error) throw error;
}

// ── QUOTES ────────────────────────────────────────────────────────────────────
export async function getQuotes(associateId?: string): Promise<Quote[]> {
  let query = supabase.from("quotes").select("*").order("created_at", { ascending: false });
  if (associateId) query = query.eq("associate_id", associateId);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createQuote(payload: Omit<Quote, "id" | "created_at">): Promise<Quote> {
  const { data, error } = await supabase.from("quotes").insert([payload]).select().single();
  if (error) throw error;
  return data;
}

export async function updateQuoteStatus(id: string, status: Quote["status"]): Promise<void> {
  const { error } = await supabase.from("quotes").update({ status }).eq("id", id);
  if (error) throw error;
}

// ── COMMISSIONS ───────────────────────────────────────────────────────────────
export async function getCommissions(associateId?: string): Promise<Commission[]> {
  let query = supabase.from("commissions").select("*").order("created_at", { ascending: false });
  if (associateId) query = query.eq("associate_id", associateId);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

// ── OFFERS ────────────────────────────────────────────────────────────────────
export async function getOffers(): Promise<Offer[]> {
  const { data, error } = await supabase.from("offers").select("*").eq("active", true).order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// ── REGISTER ASSOCIATE (from signup form) ─────────────────────────────────────
export async function registerAssociate(form: { name: string; aadhaar: string; email: string; mobile: string }): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("associates").insert([{
    name: form.name,
    aadhaar: form.aadhaar,
    email: form.email,
    mobile: form.mobile,
    tier: "starter",
    kyc: "pending",
  }]);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── DOCUMENT UPLOAD (Supabase Storage) ───────────────────────────────────────
export async function uploadDoc(
  file: File,
  customerId: string,
  docId: string
): Promise<{ url: string | null; error?: string }> {
  const ext  = file.name.split(".").pop();
  const path = `${customerId}/${docId}.${ext}`;

  const { error } = await supabase.storage
    .from("kyc-docs")
    .upload(path, file, { upsert: true });

  if (error) return { url: null, error: error.message };

  const { data } = supabase.storage.from("kyc-docs").getPublicUrl(path);
  return { url: data.publicUrl };
}

export async function getDocUrl(customerId: string, docId: string, ext = "jpg"): Promise<string | null> {
  const { data } = supabase.storage
    .from("kyc-docs")
    .getPublicUrl(`${customerId}/${docId}.${ext}`);
  return data?.publicUrl ?? null;
}
