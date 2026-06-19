"use client";
import { useState } from "react";
import { Topbar } from "@/components/shared/Topbar";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockCustomers, DOCS_REQUIRED } from "@/lib/mock-data";
import { STATUS_CONFIG } from "@/lib/utils";
import { 
  Users, 
  UserPlus, 
  MapPin, 
  Camera, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  Eye, 
  Info,
  ChevronRight,
  User,
  Phone,
  Mail,
  CreditCard,
  FileCheck
} from "lucide-react";

const STEPS = ["Customer Info", "Project Details", "Documents & KYC", "Review & Submit"];

export default function AssocCustomers() {
  const [view, setView] = useState<"list" | "add">("list");
  const [step, setStep] = useState(0);
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({});
  const [gpsCapt, setGpsCapt] = useState(false);
  const [camCapt, setCamCapt] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const myCusts = mockCustomers.filter(c => c.associateId === "SOL-2025-003");

  const docsDone = Object.values(uploaded).filter(Boolean).length;
  const docsTotal = DOCS_REQUIRED.length;

  if (submitted) return (
    <div className="gradient-bg min-h-screen">
      <Topbar title="Add Customer" subtitle="Step 4 of 4" />
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="glass-panel rounded-3xl p-8 text-center max-w-md w-full shadow-xl border border-white/50">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-sol-navy mb-2 tracking-tight">Customer Submitted!</h2>
          <p className="text-xs text-sol-gray mb-6 leading-relaxed font-semibold">All documents submitted to Admin for review. You&apos;ll be notified once approved.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="primary" size="sm" onClick={() => { setSubmitted(false); setView("list"); setStep(0); setUploaded({}); setGpsCapt(false); setCamCapt(false); }} className="rounded-xl">
              + Add Another
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setSubmitted(false); setView("list"); }} className="rounded-xl">
              View All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="gradient-bg min-h-screen pb-12">
      <Topbar 
        title={view === "list" ? "My Customers" : "Add New Customer"}
        subtitle={view === "list" ? "All customers added by you" : `Step ${step + 1} of ${STEPS.length} — ${STEPS[step]}`}
        actions={
          <Button variant={view === "list" ? "primary" : "outline"} size="sm" onClick={() => { setView(v => v === "list" ? "add" : "list"); setStep(0); }} className="rounded-xl text-xs">
            {view === "list" ? (
              <span className="flex items-center gap-1.5"><UserPlus className="w-3.5 h-3.5" /> Add Customer</span>
            ) : (
              <span className="flex items-center gap-1.5"><ArrowLeft className="w-3.5 h-3.5" /> All Customers</span>
            )}
          </Button>
        }
      />

      <div className="p-6 max-w-7xl mx-auto">
        {view === "list" ? (
          <Card className="overflow-hidden border border-sol-sl/30">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-sol-lt/50 border-b border-sol-sl/30">
                    {["Customer", "City", "System Size", "Phase", "Documents", "Status", "Action"].map(h => (
                      <th key={h} className="px-5 py-3 text-[10px] uppercase tracking-wider text-sol-gray font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-sol-sl/20">
                  {myCusts.map(c => {
                    const st = STATUS_CONFIG[c.status];
                    const pct = Math.round((c.docsUploaded / c.docsRequired) * 100);
                    return (
                      <tr key={c.id} className="hover:bg-sol-teal/5 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-bold text-sol-navy text-xs">{c.name}</div>
                          <div className="text-[10px] text-sol-gray font-semibold mt-0.5">{c.mobile}</div>
                        </td>
                        <td className="px-5 py-4 text-xs font-semibold text-sol-navy/80">{c.city}</td>
                        <td className="px-5 py-4 text-xs font-extrabold text-sol-teal">{c.systemKwp} kWp</td>
                        <td className="px-5 py-4 text-xs font-semibold text-sol-gray">{c.phase}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-sol-sl/40 rounded-full overflow-hidden shadow-inner">
                              <div className="h-full bg-sol-teal rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-[10px] text-sol-gray font-bold">{c.docsUploaded}/{c.docsRequired}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <Badge className={`${st.bg} ${st.color} px-2 py-0.5 border border-current/15`}>{st.label}</Badge>
                        </td>
                        <td className="px-5 py-4">
                          {c.docsUploaded < c.docsRequired ? (
                            <Button variant="primary" size="sm" onClick={() => { setView("add"); setStep(2); }} className="rounded-xl py-1 text-[11px]">
                              <Upload className="w-3 h-3" /> Upload
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" className="rounded-xl py-1 text-[11px]">
                              <Eye className="w-3 h-3" /> View
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Step bar */}
            <div className="glass-panel rounded-2xl p-4 flex items-center shadow-sm border border-white/50">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold flex-shrink-0 transition-all duration-200 shadow-sm ${i < step ? "bg-sol-teal text-white border border-sol-teal/20" : i === step ? "bg-sol-navy text-white" : "bg-sol-sl text-sol-gray"}`}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  <div className={`text-[10px] font-bold uppercase tracking-wider ml-2.5 hidden sm:block ${i === step ? "text-sol-navy" : "text-sol-gray"}`}>{s}</div>
                  {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-4 rounded-full ${i < step ? "bg-sol-teal/30" : "bg-sol-sl"}`} />}
                </div>
              ))}
            </div>

            {/* Step 0 */}
            {step === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle><User className="w-4.5 h-4.5 text-sol-teal" /> Customer Information</CardTitle>
                </CardHeader>
                <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {([
                    ["Full Name *", "name", User],
                    ["Mobile *", "mobile", Phone],
                    ["Email", "email", Mail],
                    ["Aadhaar No.", "aadhaar", CreditCard],
                    ["Address *", "address", MapPin],
                    ["City *", "city", MapPin],
                    ["DISCOM No.", "discom", Info],
                    ["PIN Code", "pin", Info]
                  ] as const).map(([label, key, Icon]) => {
                    const IconComp = Icon;
                    return (
                      <div key={key}>
                        <label className="text-[10px] font-bold text-sol-navy block mb-1.5 uppercase tracking-wider">{label}</label>
                        <div className="relative">
                          <IconComp className="absolute left-3.5 top-3 w-4 h-4 text-sol-gray/50" />
                          <input placeholder={label.replace(" *", "")} className="glass-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-sol-navy placeholder-sol-gray/50 font-semibold" />
                        </div>
                      </div>
                    );
                  })}
                </CardBody>
              </Card>
            )}

            {/* Step 1 */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle><FileCheck className="w-4.5 h-4.5 text-sol-teal" /> Project Details</CardTitle>
                </CardHeader>
                <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {([
                    ["System Capacity", "kwp", ["1 kWp", "2 kWp", "3 kWp", "4 kWp", "5 kWp", "6 kWp", "7 kWp", "8 kWp", "9 kWp", "10 kWp"]],
                    ["Phase", "phase", ["Single Phase", "3 Phase"]],
                    ["System Type", "stype", ["ON Grid", "OFF Grid", "Hybrid"]],
                    ["Scheme", "scheme", ["PM SURYA GHAR", "Private"]]
                  ] as const).map(([label, key, options]) => (
                    <div key={key}>
                      <label className="text-[10px] font-bold text-sol-navy block mb-1.5 uppercase tracking-wider">{label}</label>
                      <select className="glass-input w-full rounded-xl px-3.5 py-2.5 text-xs text-sol-navy focus:outline-none focus:border-sol-teal font-semibold">
                        {options.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}`
                </CardBody>
              </Card>
            )}

            {/* Step 2 — Documents */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="bg-sol-teal/10 border border-sol-teal/20 rounded-2xl px-5 py-3 text-sol-navy text-xs font-semibold flex items-center gap-2">
                  <Info className="w-4.5 h-4.5 text-sol-teal flex-shrink-0" />
                  <span>All {docsTotal} documents are mandatory for PM Surya Ghar subsidy processing. GPS site photo required.</span>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle><Upload className="w-4.5 h-4.5 text-sol-teal" /> KYC Documents</CardTitle>
                    <span className="text-xs text-sol-gray font-bold">{docsDone} of {docsTotal} uploaded</span>
                  </CardHeader>
                  <CardBody>
                    <div className="h-2 bg-sol-lt rounded-full overflow-hidden mb-5 shadow-inner">
                      <div className="h-full bg-sol-teal rounded-full transition-all duration-300" style={{ width: `${(docsDone / docsTotal) * 100}%` }} />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {DOCS_REQUIRED.slice(0, -1).map(d => {
                        const isUploaded = uploaded[d.id];
                        return (
                          <button key={d.id} onClick={() => setUploaded(u => ({ ...u, [d.id]: !u[d.id] }))}
                            className={`rounded-2xl border-2 p-4 flex flex-col items-center gap-1 text-center transition-all duration-300 cursor-pointer ${isUploaded ? "border-sol-teal bg-sol-teal/10 shadow-sm" : "border-dashed border-sol-sl hover:border-sol-teal/50 hover:bg-sol-teal/5"}`}>
                            <span className="text-xl mb-1.5">{d.id === "aadhaar" ? "🪪" : d.id === "pan" ? "📄" : d.id === "elecbill" ? "⚡" : d.id === "cheque" ? "🏦" : d.id === "gmail" ? "✉" : "📱"}</span>
                            <span className="text-[10px] font-bold text-sol-navy leading-tight">{d.label}</span>
                            <span className="text-[9px] text-sol-gray font-medium">{d.hint}</span>
                            <Badge className={`px-2 py-0.5 rounded-full mt-2 text-[9px] ${isUploaded ? "bg-emerald-500/20 text-emerald-700" : "bg-red-500/10 text-red-600"}`}>
                              {isUploaded ? "✓ Done" : "Required"}
                            </Badge>
                          </button>
                        );
                      })}
                    </div>
                  </CardBody>
                </Card>

                {/* GPS + Camera */}
                <Card>
                  <CardHeader>
                    <CardTitle><MapPin className="w-4.5 h-4.5 text-sol-teal" /> GPS Location & Site Photo</CardTitle>
                  </CardHeader>
                  <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="border border-sol-sl/30 rounded-2xl overflow-hidden bg-white/40">
                      <div className="bg-sol-lt/70 h-32 flex items-center justify-center relative shadow-inner">
                        <svg viewBox="0 0 200 100" className="w-full h-full"><rect width="200" height="100" fill="#EAF4F4" opacity="0.5"/><line x1="100" y1="0" x2="100" y2="100" stroke="#2BA8A0" strokeWidth="0.5" strokeDasharray="2,2"/><line x1="0" y1="50" x2="200" y2="50" stroke="#2BA8A0" strokeWidth="0.5" strokeDasharray="2,2"/><circle cx="100" cy="50" r="6" fill="#1B2A4A"/><circle cx="100" cy="50" r="2.5" fill="#FFF"/><circle cx="100" cy="50" r="14" fill="none" stroke="#2BA8A0" strokeWidth="1" opacity="0.3"/><text x="100" y="85" fill="#1B2A4A" fontSize="7" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">{gpsCapt ? "Nasirabad, Ajmer ✓" : "Tap Capture"}</text></svg>
                      </div>
                      <div className="p-4">
                        <div className="text-xs font-bold text-sol-navy">{gpsCapt ? "GPS Captured ✓" : "Location not captured"}</div>
                        {gpsCapt && <div className="text-[10px] text-sol-teal font-semibold mt-1">Lat: 26.4499° N · Lng: 74.6399° E</div>}
                        <Button onClick={() => setGpsCapt(true)} variant={gpsCapt ? "outline" : "primary"} size="sm" className="mt-3 w-full rounded-xl py-2 font-bold text-xs">
                          {gpsCapt ? "✓ Location Saved" : "📍 Capture Location"}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border border-sol-sl/30 rounded-2xl overflow-hidden">
                      <div className={`h-32 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 shadow-inner ${camCapt ? "bg-emerald-600/90 text-white" : "bg-sol-dark/95 text-white/70 hover:bg-sol-navy hover:text-white"}`}
                        onClick={() => { setCamCapt(true); setUploaded(u => ({ ...u, sitePhoto: true })); }}>
                        <Camera className="w-8 h-8 animate-bounce mb-2" />
                        <span className="text-xs font-bold">{camCapt ? "Photo Captured" : "Capture Site Photo"}</span>
                        {camCapt && <span className="text-[9px] text-emerald-200 mt-1 font-semibold">GPS Tag Embedded</span>}
                      </div>
                      <div className="p-4">
                        <div className="text-xs font-bold text-sol-navy">{camCapt ? "site_gps_photo.jpg" : "No photo yet"}</div>
                        <Badge className={`px-2 py-0.5 mt-2.5 ${camCapt ? "bg-emerald-500/20 text-emerald-700" : "bg-red-500/10 text-red-600"}`}>
                          {camCapt ? "✓ Captured" : "Required"}
                        </Badge>
                      </div>
                    </div>
                  </CardBody>
                  <div className="bg-amber-50 border-t border-sol-sl/10 p-4 text-[10px] text-amber-700 font-semibold leading-relaxed">
                    ⚠️ Site photo must clearly show the client and the rooftop. GPS coordinates are automatically embedded to comply with PM Surya Ghar regulations.
                  </div>
                </Card>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle><FileCheck className="w-4.5 h-4.5 text-sol-teal" /> Review Summary</CardTitle>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-4 py-3 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>All documents uploaded. GPS location captured. Ready to submit!</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 bg-sol-lt/40 border border-sol-sl/20 rounded-2xl p-5">
                    {[
                      ["Name", "New Customer"],
                      ["System", "5 kWp ON Grid"],
                      ["Phase", "Single Phase"],
                      ["Scheme", "PM Surya Ghar"],
                      ["Documents", `${Math.min(docsDone + 4, docsTotal)}/7 ✓`],
                      ["GPS", "Captured ✓"]
                    ].map(([label, val]) => (
                      <div key={label}>
                        <span className="text-[10px] text-sol-gray uppercase tracking-wider font-bold">{label}</span>
                        <div className="text-xs font-extrabold text-sol-navy mt-0.5">{val}</div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Nav */}
            <div className="flex justify-between mt-5">
              <Button variant="outline" size="sm" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="rounded-xl">
                ← Back
              </Button>
              {step < 3 ? (
                <Button variant="primary" size="sm" onClick={() => setStep(s => s + 1)} className="rounded-xl">
                  Next →
                </Button>
              ) : (
                <Button variant="navy" size="sm" onClick={() => setSubmitted(true)} className="rounded-xl">
                  ➤ Submit to Admin
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
