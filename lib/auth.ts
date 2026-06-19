// Mock auth context — swap for Supabase when ready
export type Role = "admin" | "associate";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  associateId?: string;
  tier?: string;
}

// Mock users — replace with Supabase auth
export const MOCK_USERS: Record<string, AuthUser & { password: string }> = {
  "admin@solvanta.in": {
    id: "admin-1",
    name: "Admin User",
    email: "admin@solvanta.in",
    password: "admin123",
    role: "admin",
  },
  "mohan@mail.com": {
    id: "SOL-2025-003",
    name: "Mohan Verma",
    email: "mohan@mail.com",
    password: "assoc123",
    role: "associate",
    associateId: "SOL-2025-003",
    tier: "silver",
  },
};

export function mockLogin(email: string, password: string): AuthUser | null {
  const user = MOCK_USERS[email.toLowerCase()];
  if (!user || user.password !== password) return null;
  const { password: _, ...authUser } = user;
  return authUser;
}

// Session helpers (localStorage-based for mock, swap with Supabase sessions)
export const SESSION_KEY = "solvanta_user";

export function saveSession(user: AuthUser) {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }
}

export function getSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function clearSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}
