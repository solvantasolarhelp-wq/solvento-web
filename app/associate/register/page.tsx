"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User as UserIcon, Mail, Phone, CreditCard,
  CheckCircle, Loader2, Upload, Building2, CheckCircle2, AlertCircle
} from "lucide-react";
import { registerAssociate, uploadAssociateDoc } from "@/lib/db";

const STEPS = ["Personal Info", "Documents & Bank"];

export default function AssociateRegister() {
  const [step,      setStep]      = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  // Form fields
  const [form, setForm] = useState({
    name: "", aadhaar: "", email: "", mobile: "", bank_account: ""
  });

  // PAN card upload
  const [panState, setPanState] = useState<"idle"|"uploading"|"done"|"error">("idle");
  const [panUrl,   setPanUrl]   = useState("");
  const panRef = useRef<HTMLInputElement>(null);

  const step0Valid = form.name.trim() && form.aadhaar.trim() && form.email.trim() && form.mobile.trim();
  const step1Valid = form.bank_account.trim() && panState === "done";

  // Upload PAN card
  async function handlePanUpload(file: File) {
    setPanState("uploading");
    const result = await uploadAssociateDoc(file, form.email || "temp", "pan_card");
    if (result.error) { setPanState("error"); return; }
    setPanUrl(result.url!);
    setPanState("done");
  }

  async function handleSubmit() {
    if (!step1Valid || loading) return;
    setLoading(true);
    setError("");
    const result = await registerAssociate({
      name:         form.name,
      aadhaar:      form.aadhaar,
      email:        form.email,
      mobile:       form.mobile,
      bank_account: form.bank_account,
      pan_url:      panUrl,
    });
    setLoading(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error?.includes("duplicate") ? "This email is already registered." : result.error || "Something went wrong.");
    }
  }

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center px-4 gradient-bg-dark">
      <div className="glass-panel-dark rounded-3xl p-10 max-w-md w-full text-center shadow-2xl border border-white/10">
        <div className="w-16 h-16 rounded-full bg-sol-teal/20 border border-sol-teal/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-sol-teal" />
        </div>
        <h2 className="text-xl font-extrabold text-white mb-2 tracking-tight">Registration Submitted!</h2>
        <p className="text-xs text-white/60 mb-6 leading-relaxed">
          Your application has been submitted to the Solvanta Admin team. You&apos;ll receive approval within <strong>24–48 hours</strong>. Check your email for updates.
        </p>
        <Link href="/associate/login" className="w-full block">
          <button className="w-full bg-sol-gold text-sol-navy font-bold text-xs py-3 rounded-xl hover:opacity-90 transition-all">
            → Back to Login
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen gradient-bg-dark flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sol-teal/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sol-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white shadow p-0.5">
            <Image src="/logo.jpg" alt="" width={40} height={40} className="object-contain rounded-full" />
          </div>
          <div>
            <div className="text-white font-extrabold text-sm tracking-tight">SOLVANTA SOLAR ENERGY</div>
            <div className="text-sol-teal text-[10px] font-bold uppercase tracking-widest leading-none mt-0.5">Associate Registration</div>
          </div>
        </div>

        {/* Step bar */}
        <div className="flex items-center mb-6 bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all
                ${i < step ? "bg-sol-teal text-white" : i === step ? "bg-sol-gold text-sol-navy" : "bg-white/10 text-white/40"}`}>
                {i < step ? "✓" : i + 1}
              </div>
              <div className={`text-[10px] font-bold ml-2 hidden sm:block ${i === step ? "text-white" : "text-white/40"}`}>{s}</div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-3 rounded-full ${i < step ? "bg-sol-teal/50" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>

        <div className="glass-panel-dark rounded-3xl border border-white/10 shadow-2xl p-7">

          {/* ── STEP 0: Personal Info ── */}
          {step === 0 && (
            <>
              <h3 className="text-base font-extrabold text-white mb-1 tracking-tight flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-sol-teal" /> Personal Information
              </h3>
              <p className="text-[11px] text-white/50 mb-5">Basic details for your associate account.</p>

              <div className="flex flex-col gap-4">
                {([
                  { label: "Full Name *",       key: "name",    type: "text",  placeholder: "Mohan Verma",      Icon: UserIcon   },
                  { label: "Aadhaar Number *",  key: "aadhaar", type: "text",  placeholder: "XXXX XXXX XXXX",   Icon: CreditCard },
                  { label: "Email Address *",   key: "email",   type: "email", placeholder: "mohan@mail.com",   Icon: Mail       },
                  { label: "Phone Number *",    key: "mobile",  type: "tel",   placeholder: "+91 98765 XXXXX",  Icon: Phone      },
                ] as const).map(({ label, key, type, placeholder, Icon }) => (
                  <div key={key}>
                    <label className="text-[10px] font-bold text-white/70 block mb-1.5 uppercase tracking-wider">{label}</label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                      <input type={type} value={form[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-sol-teal focus:bg-white/10 focus:ring-4 focus:ring-sol-teal/10 transition-all font-semibold" />
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => step0Valid && setStep(1)} disabled={!step0Valid}
                className={`w-full mt-6 rounded-xl text-xs font-bold py-3 flex items-center justify-center gap-2 transition-all
                  ${step0Valid ? "bg-sol-teal text-white hover:opacity-90 cursor-pointer" : "bg-white/10 text-white/30 cursor-not-allowed"}`}>
                Next → Documents & Bank
              </button>
            </>
          )}

          {/* ── STEP 1: Documents & Bank ── */}
          {step === 1 && (
            <>
              <h3 className="text-base font-extrabold text-white mb-1 tracking-tight flex items-center gap-2">
                <Building2 className="w-5 h-5 text-sol-teal" /> Documents & Bank Details
              </h3>
              <p className="text-[11px] text-white/50 mb-5">Required for commission payments and KYC verification.</p>

              <div className="flex flex-col gap-4">
                {/* Bank Account */}
                <div>
                  <label className="text-[10px] font-bold text-white/70 block mb-1.5 uppercase tracking-wider">Bank Account Number *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                    <input type="text" value={form.bank_account}
                      onChange={e => setForm(f => ({ ...f, bank_account: e.target.value }))}
                      placeholder="Account Number"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-sol-teal focus:bg-white/10 focus:ring-4 focus:ring-sol-teal/10 transition-all font-semibold" />
                  </div>
                </div>

                {/* PAN Card Upload */}
                <div>
                  <label className="text-[10px] font-bold text-white/70 block mb-1.5 uppercase tracking-wider">PAN Card * (JPG / PNG / PDF)</label>
                  <input type="file" ref={panRef} className="hidden"
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handlePanUpload(f); }} />

                  <button onClick={() => panRef.current?.click()} disabled={panState === "uploading"}
                    className={`w-full rounded-xl border-2 border-dashed p-5 flex flex-col items-center gap-2 transition-all cursor-pointer
                      ${panState === "done" ? "border-sol-teal bg-sol-teal/10"
                      : panState === "error" ? "border-red-500/50 bg-red-500/10"
                      : "border-white/10 bg-white/5 hover:border-sol-teal/50 hover:bg-white/8"}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                      ${panState === "done" ? "bg-sol-teal/20 text-sol-teal"
                      : panState === "error" ? "bg-red-500/20 text-red-400"
                      : "bg-white/10 text-white/40"}`}>
                      {panState === "uploading" ? <Loader2 className="w-5 h-5 animate-spin" />
                        : panState === "done" ? <CheckCircle2 className="w-5 h-5" />
                        : panState === "error" ? <AlertCircle className="w-5 h-5" />
                        : <Upload className="w-5 h-5" />}
                    </div>
                    <span className="text-xs font-bold text-white">
                      {panState === "uploading" ? "Uploading..."
                        : panState === "done" ? "PAN Card Uploaded ✓"
                        : panState === "error" ? "Upload Failed — Tap to Retry"
                        : "Tap to Upload PAN Card"}
                    </span>
                    {panState === "done" && (
                      <a href={panUrl} target="_blank" rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="text-[10px] text-sol-teal underline font-bold">View Uploaded File</a>
                    )}
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full
                      ${panState === "done" ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-red-500/20 text-red-400"}`}>
                      {panState === "done" ? "✓ Done" : "Required"}
                    </span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-xs text-red-400 font-semibold">
                  ⚠️ {error}
                </div>
              )}

              <div className="bg-sol-gold/10 border border-sol-gold/20 rounded-2xl px-4 py-3 text-xs text-sol-gold font-semibold flex items-center gap-2 mt-5">
                <span>⏳</span>
                <p className="leading-tight">Admin will review your application within 24–48 hours.</p>
              </div>

              <div className="flex gap-3 mt-5">
                <button onClick={() => setStep(0)}
                  className="flex-1 rounded-xl text-xs font-bold py-3 bg-white/10 text-white/70 hover:bg-white/15 transition-all cursor-pointer">
                  ← Back
                </button>
                <button onClick={handleSubmit} disabled={!step1Valid || loading}
                  className={`flex-1 rounded-xl text-xs font-bold py-3 flex items-center justify-center gap-2 transition-all
                    ${step1Valid && !loading ? "bg-sol-gold text-sol-navy hover:opacity-90 cursor-pointer" : "bg-sol-gold/30 text-sol-navy/50 cursor-not-allowed"}`}>
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <>Submit <CheckCircle className="w-4 h-4" /></>}
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-white/40 text-xs mt-6 font-semibold">
          Already have an account?{" "}
          <Link href="/associate/login" className="text-sol-teal hover:underline font-bold">Login here</Link>
        </p>
      </div>
    </div>
  );
}
