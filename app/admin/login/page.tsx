"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { mockLogin, saveSession } from "@/lib/auth";
import { Mail, Lock, ArrowRight, ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@solvanta.in");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 500));
    const user = mockLogin(email, password);
    if (!user || user.role !== "admin") {
      setError("Invalid admin credentials."); setLoading(false); return;
    }
    saveSession(user);
    router.push("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 gradient-bg-dark relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sol-teal/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sol-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-panel-dark rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-sol-lt mx-auto mb-3 p-0.5 shadow-lg border border-white/10">
              <Image src="/logo.jpg" alt="Solvanta" width={64} height={64} className="object-contain rounded-full" />
            </div>
            <h2 className="font-extrabold text-white text-xl tracking-tight">Admin Portal</h2>
            <p className="text-sol-teal text-[10px] uppercase font-bold tracking-widest leading-none mt-1.5">Solvanta Solar Energy</p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 mb-5 font-semibold">
            <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="leading-tight">Restricted access — Solvanta Admin authorization required.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-white/70 block mb-1.5 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-white/30" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-sol-teal focus:bg-white/10 focus:ring-4 focus:ring-sol-teal/10 transition-all font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-white/70 block mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-white/30" />
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-sol-teal focus:bg-white/10 focus:ring-4 focus:ring-sol-teal/10 transition-all font-semibold"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" /> 
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} variant="primary" size="lg" className="w-full font-bold text-xs py-3.5 rounded-xl mt-2">
              {loading ? "⏳ Authenticating..." : (
                <span className="flex items-center justify-center gap-2">
                  Admin Login <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5 space-y-3.5 text-center">
            <a href="/" className="text-xs text-white/40 hover:text-white/70 transition-colors block">← Back to Marketing Site</a>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[9px] text-white/40 font-mono">
              <ShieldCheck className="w-3 h-3 text-sol-teal" />
              <span>Demo: admin@solvanta.in / admin123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

