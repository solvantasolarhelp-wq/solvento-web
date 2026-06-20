"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User as UserIcon, Mail, Phone, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AssociateRegister() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", aadhaar: "", email: "", mobile: "" });

  const fields = [
    { label: "Full Name *", key: "name", type: "text", placeholder: "Mohan Verma", Icon: UserIcon },
    { label: "Aadhaar Number *", key: "aadhaar", type: "text", placeholder: "XXXX XXXX XXXX", Icon: CreditCard },
    { label: "Email Address *", key: "email", type: "email", placeholder: "mohan@mail.com", Icon: Mail },
    { label: "Phone Number *", key: "mobile", type: "tel", placeholder: "+91 98765 XXXXX", Icon: Phone },
  ] as const;

  const isValid = fields.every(f => form[f.key].trim().length > 0);

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
        <Link href="/associate/login" className="w-full">
          <Button variant="gold" size="lg" className="w-full rounded-xl text-xs font-bold py-3">
            → Back to Login
          </Button>
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

        {/* Form Card */}
        <div className="glass-panel-dark rounded-3xl border border-white/10 shadow-2xl p-7">
          <h3 className="text-base font-extrabold text-white mb-1 tracking-tight flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-sol-teal" /> Join as Associate
          </h3>
          <p className="text-[11px] text-white/50 mb-6">Fill in your details below to get started.</p>

          <div className="flex flex-col gap-4">
            {fields.map(({ label, key, type, placeholder, Icon }) => (
              <div key={key}>
                <label className="text-[10px] font-bold text-white/70 block mb-1.5 uppercase tracking-wider">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-sol-teal focus:bg-white/10 focus:ring-4 focus:ring-sol-teal/10 transition-all font-semibold"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-sol-gold/10 border border-sol-gold/20 rounded-2xl px-4 py-3 text-xs text-sol-gold font-semibold flex items-center gap-2 mt-6">
            <span>⏳</span>
            <p className="leading-tight">After submission, Admin will review your application within 24–48 hours.</p>
          </div>

          <Button
            onClick={() => isValid && setSubmitted(true)}
            variant="gold"
            size="lg"
            className={`w-full mt-5 rounded-xl text-xs font-bold py-3 transition-opacity ${!isValid ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            Submit for Approval <CheckCircle className="w-4 h-4 ml-1 inline" />
          </Button>
        </div>

        <p className="text-center text-white/40 text-xs mt-6 font-semibold">
          Already have an account?{" "}
          <Link href="/associate/login" className="text-sol-teal hover:underline font-bold">Login here</Link>
        </p>
      </div>
    </div>
  );
}
