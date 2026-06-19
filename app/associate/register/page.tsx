"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Briefcase, 
  Upload, 
  FileText, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle,
  Building,
  Key
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const STEPS = ["Basic Info", "Bank & KYC", "Upload Docs", "Review"];
const DOCS_LIST = [
  { id: "aadhaar", label: "Aadhaar Card", icon: FileText, hint: "Front & Back" },
  { id: "pan", label: "PAN Card", icon: FileText, hint: "Clear scan" },
  { id: "photo", label: "Photograph", icon: UserIcon, hint: "Passport size" },
  { id: "bank", label: "Bank Statement", icon: Building, hint: "Last 3 months" }
];

export default function AssociateRegister() {
  const [step, setStep] = useState(0);
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", mobile: "", region: "Jaipur", aadhaar: "", pan: "", bank: "", ifsc: "", bankName: "" });

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center px-4 gradient-bg-dark">
      <div className="glass-panel-dark rounded-3xl p-10 max-w-md w-full text-center shadow-2xl border border-white/10">
        <div className="w-16 h-16 rounded-full bg-sol-teal/20 border border-sol-teal/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-sol-teal" />
        </div>
        <h2 className="text-xl font-extrabold text-white mb-2 tracking-tight">Registration Submitted!</h2>
        <p className="text-xs text-white/60 mb-6 leading-relaxed">Your KYC documents have been submitted to the Solvanta Admin team. You&apos;ll receive approval within <strong>24–48 hours</strong>. Check your email for updates.</p>
        <Link href="/associate/login" className="w-full">
          <Button variant="gold" size="lg" className="w-full rounded-xl text-xs font-bold py-3">
            → Back to Login
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen gradient-bg-dark py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sol-teal/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sol-gold/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white shadow p-0.5"><Image src="/logo.jpg" alt="" width={40} height={40} className="object-contain rounded-full"/></div>
          <div><div className="text-white font-extrabold text-sm tracking-tight">SOLVANTA SOLAR ENERGY</div><div className="text-sol-teal text-[10px] font-bold uppercase tracking-widest leading-none mt-0.5">Associate Registration</div></div>
        </div>

        {/* Step bar */}
        <div className="flex items-center mb-8 bg-white/5 border border-white/5 backdrop-blur-md rounded-2xl px-6 py-4">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-200 shadow-md ${i < step ? "bg-sol-teal text-white border border-sol-teal/30" : i === step ? "bg-sol-gold text-sol-navy border border-sol-gold/30" : "bg-white/5 text-white/40 border border-white/5"}`}>
                {i < step ? "✓" : i + 1}
              </div>
              <div className={`text-[10px] font-bold uppercase tracking-wider ml-2.5 hidden sm:block ${i === step ? "text-white" : "text-white/40"}`}>{s}</div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-4 rounded-full ${i < step ? "bg-sol-teal/50" : "bg-white/10"}`}/>}
            </div>
          ))}
        </div>

        <div className="glass-panel-dark rounded-3xl border border-white/10 shadow-2xl p-7">
          {step === 0 && (
            <div>
              <h3 className="text-base font-extrabold text-white mb-5 tracking-tight flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-sol-teal" /> Basic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([
                  ["Full Name *", "name", "text", "Mohan Verma", UserIcon],
                  ["Mobile Number *", "mobile", "tel", "+91 98765 XXXXX", Phone],
                  ["Email Address *", "email", "email", "mohan@mail.com", Mail],
                  ["Region / City *", "region", "text", "Jaipur", MapPin]
                ] as const).map(([label, key, type, placeholder, Icon]) => {
                  const IconComp = Icon as React.ComponentType<{ className?: string }>;
                  return (
                    <div key={key}>
                      <label className="text-[10px] font-bold text-white/70 block mb-1.5 uppercase tracking-wider">{label}</label>
                      <div className="relative">
                        <IconComp className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                        <input type={type} value={(form as Record<string, string>)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-sol-teal focus:bg-white/10 focus:ring-4 focus:ring-sol-teal/10 transition-all font-semibold" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {step === 1 && (
            <div>
              <h3 className="text-base font-extrabold text-white mb-5 tracking-tight flex items-center gap-2">
                <Building className="w-5 h-5 text-sol-teal" /> Bank & Identity Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([
                  ["Aadhaar Number *", "aadhaar", "XXXX XXXX XXXX", FileText],
                  ["PAN Number *", "pan", "ABCDE1234F", FileText],
                  ["Bank Account No. *", "bank", "Account number", CreditCard],
                  ["IFSC Code *", "ifsc", "SBIN0001234", Key],
                  ["Bank Name *", "bankName", "State Bank of India", Building]
                ] as const).map(([label, key, placeholder, Icon]) => {
                  const IconComp = Icon as React.ComponentType<{ className?: string }>;
                  return (
                    <div key={key} className={key === "bankName" ? "sm:col-span-2" : ""}>
                      <label className="text-[10px] font-bold text-white/70 block mb-1.5 uppercase tracking-wider">{label}</label>
                      <div className="relative">
                        <IconComp className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                        <input value={(form as Record<string, string>)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-sol-teal focus:bg-white/10 focus:ring-4 focus:ring-sol-teal/10 transition-all font-semibold" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div>
              <h3 className="text-base font-extrabold text-white mb-2 tracking-tight flex items-center gap-2">
                <Upload className="w-5 h-5 text-sol-teal" /> Upload KYC Documents
              </h3>
              <p className="text-[11px] text-white/50 mb-5">All documents are required for PM Surya Ghar subsidy verification.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DOCS_LIST.map(d => {
                  const Icon = d.icon;
                  const isUploaded = uploaded[d.id];
                  return (
                    <button key={d.id} onClick={() => setUploaded(u => ({ ...u, [d.id]: !u[d.id] }))}
                      className={`rounded-2xl border-2 p-5 flex flex-col items-center gap-2 transition-all duration-300 text-center cursor-pointer ${isUploaded ? "border-sol-teal bg-sol-teal/10 shadow-lg shadow-sol-teal/5" : "border-dashed border-white/10 bg-white/5 hover:border-sol-teal/50 hover:bg-white/8"}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isUploaded ? "bg-sol-teal/20 text-sol-teal" : "bg-white/5 text-white/40"}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-white tracking-tight">{d.label}</span>
                      <span className="text-[10px] text-white/40 font-medium leading-none">{d.hint}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full mt-2 uppercase tracking-wide ${isUploaded ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                        {isUploaded ? "✓ Uploaded" : "Tap to upload"}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-white/40 mt-5 text-center font-mono">{Object.values(uploaded).filter(Boolean).length} of {DOCS_LIST.length} files uploaded</p>
            </div>
          )}
          
          {step === 3 && (
            <div>
              <h3 className="text-base font-extrabold text-white mb-5 tracking-tight flex items-center gap-2">
                <FileText className="w-5 h-5 text-sol-teal" /> Review & Submit
              </h3>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-5 mb-5 space-y-3 backdrop-blur-sm">
                {[
                  ["Name", form.name],
                  ["Mobile", form.mobile],
                  ["Email", form.email],
                  ["Region", form.region],
                  ["Aadhaar", form.aadhaar || "—"],
                  ["PAN", form.pan || "—"],
                  ["Bank", form.bankName || "—"]
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-xs font-semibold">
                    <span className="text-white/40">{label}</span>
                    <span className="text-white">{val}</span>
                  </div>
                ))}
              </div>
              <div className="bg-sol-gold/10 border border-sol-gold/20 rounded-2xl px-4 py-3 text-xs text-sol-gold font-semibold flex items-center gap-2">
                <span>⏳</span>
                <p className="leading-tight">After submission, the Admin will review your application within 24–48 hours. You will receive login access once approved.</p>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6 pt-5 border-t border-white/5">
            <Button variant="outline" size="sm" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="text-white/70 hover:text-white border-white/10 hover:bg-white/5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Button>
            {step < 3 ? (
              <Button onClick={() => setStep(s => s + 1)} variant="primary" size="sm">
                Next <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button onClick={() => setSubmitted(true)} variant="gold" size="sm">
                Submit for Approval <CheckCircle className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
        <p className="text-center text-white/40 text-xs mt-6 font-semibold">Already have an account? <Link href="/associate/login" className="text-sol-teal hover:underline font-bold">Login here</Link></p>
      </div>
    </div>
  );
}
