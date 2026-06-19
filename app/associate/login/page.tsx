"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { mockLogin, saveSession } from "@/lib/auth";
import { Users, FileSpreadsheet, Gift, Award, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AssociateLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("mohan@mail.com");
  const [password, setPassword] = useState("assoc123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 500));
    const user = mockLogin(email, password);
    if (!user || user.role !== "associate") {
      setError("Invalid associate credentials."); setLoading(false); return;
    }
    saveSession(user);
    router.push("/associate/dashboard");
  }

  const features = [
    { icon: Users, text: "Add & manage customers with document upload" },
    { icon: Award, text: "Track commission earnings per installation" },
    { icon: FileSpreadsheet, text: "Generate solar quotations with auto-pricing" },
    { icon: Gift, text: "View offers, targets & leaderboard" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center lg:justify-between gradient-bg-dark p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sol-teal/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sol-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center px-16 w-1/2 relative z-10 text-white">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-white shadow-lg p-0.5"><Image src="/logo.jpg" alt="Solvanta" width={56} height={56} className="object-contain rounded-full"/></div>
          <div><div className="text-white font-black text-2xl tracking-tight">SOLVANTA</div><div className="text-sol-teal text-[10px] uppercase font-bold tracking-widest leading-none mt-0.5">SOLAR ENERGY</div></div>
        </div>
        <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">Associate<br/><span className="text-sol-gold">Business Portal</span></h1>
        <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-md">Manage your customers, track commissions, generate solar quotations, and unlock rewards — all in one place.</p>
        <div className="space-y-4 max-w-sm">
          {features.map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-center gap-3 text-white/80 text-xs font-semibold bg-white/5 border border-white/5 rounded-xl p-3 backdrop-blur-sm">
              <Icon className="text-sol-teal w-4.5 h-4.5 flex-shrink-0" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Right form */}
      <div className="flex-1 flex items-center justify-center lg:px-12 relative z-10 w-full">
        <div className="w-full max-w-md">
          <div className="glass-panel-dark rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-sol-lt mx-auto mb-3 p-0.5 shadow-lg border border-white/10 lg:hidden"><Image src="/logo.jpg" alt="" width={64} height={64} className="object-contain rounded-full"/></div>
              <h2 className="font-extrabold text-white text-xl tracking-tight">Associate Login</h2>
              <p className="text-xs text-white/50 mt-1">Sign in to your associate dashboard</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-white/70 block mb-1.5 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-white/30" />
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-sol-teal focus:bg-white/10 focus:ring-4 focus:ring-sol-teal/10 transition-all font-semibold"/>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-white/70 block mb-1.5 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-white/30" />
                  <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-sol-teal focus:bg-white/10 focus:ring-4 focus:ring-sol-teal/10 transition-all font-semibold"/>
                </div>
              </div>
              {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 font-semibold"><span>⚠</span> {error}</div>}
              
              <Button type="submit" disabled={loading} variant="primary" size="lg" className="w-full font-bold text-xs py-3.5 rounded-xl">
                {loading ? "⏳ Signing in..." : (
                  <span className="flex items-center justify-center gap-2">
                    Login to Dashboard <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
            
            <div className="mt-6 pt-5 border-t border-white/5 space-y-3.5 text-center">
              <Link href="/associate/register" className="text-xs text-sol-teal hover:underline font-bold block">New associate? Register here →</Link>
              <a href="/" className="text-xs text-white/40 hover:text-white/70 transition-colors block">← Back to Marketing Site</a>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[9px] text-white/40 font-mono">
                <ShieldCheck className="w-3 h-3 text-sol-teal" />
                <span>Demo: mohan@mail.com / assoc123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
