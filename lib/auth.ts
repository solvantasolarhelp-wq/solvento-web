// ─── Supabase Auth helpers ────────────────────────────────────────────────────
import { supabase } from "./supabase";

export type Role = "admin" | "associate";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  associateId?: string;
  tier?: string;
}

export const SESSION_KEY = "solvanta_user";

export function saveSession(user: AuthUser) {
  if (typeof window !== "undefined")
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function clearSession() {
  if (typeof window !== "undefined")
    localStorage.removeItem(SESSION_KEY);
}

// ─── Admin Login — whitelist by email ────────────────────────────────────────
const ADMIN_EMAILS = ["admin@solvanta.in"];

export async function adminLogin(
  email: string,
  password: string
): Promise<{ user: AuthUser | null; error?: string }> {
  const trimmedEmail = email.toLowerCase().trim();

  if (!ADMIN_EMAILS.includes(trimmedEmail))
    return { user: null, error: "Access denied. Not an admin account." };

  const { data, error } = await supabase.auth.signInWithPassword({
    email: trimmedEmail,
    password,
  });

  if (error || !data.user)
    return { user: null, error: "Invalid email or password." };

  const authUser: AuthUser = {
    id:    data.user.id,
    name:  "Solvanta Admin",
    email: data.user.email!,
    role:  "admin",
  };

  saveSession(authUser);
  return { user: authUser };
}

export async function signOut() {
  await supabase.auth.signOut();
  clearSession();
}

// ─── Associate mock login (will migrate to Supabase Auth later) ──────────────
export function mockLogin(email: string, password: string): AuthUser | null {
  const MOCK: Record<string, AuthUser & { password: string }> = {
    "mohan@mail.com": {
      id: "SOL-2025-003", name: "Mohan Verma", email: "mohan@mail.com",
      password: "assoc123", role: "associate", associateId: "SOL-2025-003", tier: "silver",
    },
  };
  const user = MOCK[email.toLowerCase()];
  if (!user || user.password !== password) return null;
  const { password: _, ...authUser } = user;
  return authUser;
}
