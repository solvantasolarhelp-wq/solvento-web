"use client";
import { useState, useRef } from "react";
import { Topbar } from "@/components/shared/Topbar";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DOCS_REQUIRED } from "@/lib/mock-data";
import { STATUS_CONFIG } from "@/lib/utils";
import { useSupabase } from "@/hooks/useSupabase";
import { getCustomers, createCustomer, uploadDoc, updateCustomer } from "@/lib/db";
import { Customer } from "@/lib/supabase";
import {
  Users, UserPlus, MapPin, Camera, Check, ArrowLeft,
  Upload, Eye, Info, User, Phone, Mail, CreditCard,
  FileCheck, Loader2, CheckCircle2, AlertCircle
} from "lucide-react";

const STEPS = ["Customer Info", "Project Details", "Documents & KYC", "Review & Submit"];
const MY_ID = "SOL-2025-003";

// Per-doc upload state
type DocState = "idle" | "uploading" | "done" | "error";

export default function AssocCustomers() {
  const [view, setView]           = useState<"list" | "add">("list");
  const [step, setStep]           = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [docStates, setDocStates] = useState<Record<string, DocState>>({});
  const [docUrls,   setDocUrls]   = useState<Record<string, string>>({});
  const [gpsCapt,   setGpsCapt]   = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [newCustId, setNewCustId] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const [form, setForm] = useState({
    name: "", mobile: "", email: "", aadhaar: "", address: "", city: "", discom: "",
    kwp: 3, phase: "Single Phase", system_type: "ON Grid", scheme: "PM SURYA GHAR"
  });

  const { data: custData, loading, refetch } = useSupabase<Customer[]>(() => getCustomers(MY_ID));
  const myCusts = custData ?? [];

  const docsDone  = Object.values(docStates).filter(s => s === "done").length;
  const docsTotal = DOCS_REQUIRED.length;

  // ── Step 1: Save customer to Supabase, get ID for storage path
  async function saveCustomer() {
    const { data } = await (await import("@/lib/supabase")).supabase
      .from("customers")
      .insert([{
        associate_id: MY_ID,
        name:         form.name,
        mobile:       form.mobile,
        email:        form.email,
        address:      form.address,
        city:         form.city,
        discom:       form.discom,
        system_kwp:   form.kwp,
        phase:        form.phase,
        system_type:  form.system_type,
        status:       "docs_pending",
        docs_uploaded: 0,
        docs_required: docsTotal,
        gps_lat:      gpsCoords?.lat,
        gps_lng:      gpsCoords?.lng,
      }])
      .select()
      .single();
    return data?.id ?? null;
  }

  // ── Upload single file to Supabase Storage
  async function handleFileChange(docId: string, file: File) {
    // Create customer record first if not yet done
    let custId = newCustId;
    if (!custId) {
      custId = await saveCustomer();
      if (!custId) return;
      setNewCustId(custId);
    }

    setDocStates(s => ({ ...s, [docId]: "uploading" }));
    const result = await uploadDoc(file, custId, docId);

    if (result.error) {
      setDocStates(s => ({ ...s, [docId]: "error" }));
    } else {
      setDocStates(s => ({ ...s, [docId]: "done" }));
      setDocUrls(u => ({ ...u, [docId]: result.url! }));
      // Update docs_uploaded count in DB
      const doneCount = Object.values({ ...docStates, [docId]: "done" }).filter(s => s === "done").length;
      if (newCustId || custId) {
        await updateCustomer(custId!, { docs_uploaded: doneCount });
      }
    }
  }

  // ── Capture GPS
  function captureGPS() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
      setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      setGpsCapt(true);
    }, () => {
      // Fallback demo coords (Jaipur)
      setGpsCoords({ lat: 26.9124, lng: 75.7873 });
      setGpsCapt(true);
    });
  }

  // ── Final submit
  async function handleFinalSubmit() {
    setSubmitting(true);
    let custId = newCustId;
    if (!custId) {
      custId = await saveCustomer();
      setNewCustId(custId);
    }
    if (custId) {
      await updateCustomer(custId, {
        status: "in_progress",
        docs_uploaded: docsDone,
        gps_lat: gpsCoords?.lat,
        gps_lng: gpsCoords?.lng,
      });
    }
    await refetch();
    setSubmitting(false);
    setSubmitted(true);
  }

  function resetForm() {
    setView("list"); setStep(0); setSubmitted(false);
    setDocStates({}); setDocUrls({}); setGpsCapt(false);
    setGpsCoords(null); setNewCustId(null);
    setForm({ name:"", mobile:"", email:"", aadhaar:"", address:"", city:"", discom:"",
      kwp:3, phase:"Single Phase", system_type:"ON Grid", scheme:"PM SURYA GHAR" });
  }

  if (submitted) return (
    <div className="gradient-bg min-h-screen">
      <Topbar title="Add Customer" subtitle="Submitted!" />
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="glass-panel rounded-3xl p-8 text-center max-w-md w-full shadow-xl border border-white/50">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-sol-navy mb-2">Customer Submitted!</h2>
          <p className="text-xs text-sol-gray mb-2 font-semibold">Documents uploaded to Supabase Storage.</p>
          <p className="text-xs text-sol-gray mb-6 font-semibold">Admin will review and approve shortly.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="primary" size="sm" onClick={resetForm} className="rounded-xl">+ Add Another</Button>
            <Button variant="outline" size="sm" onClick={() => { setSubmitted(false); setView("list"); }} className="rounded-xl">View All</Button>
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
          <Button variant={view === "list" ? "primary" : "outline"} size="sm"
            onClick={() => { view === "list" ? setView("add") : resetForm(); }} className="rounded-xl text-xs">
            {view === "list"
              ? <span className="flex items-center gap-1.5"><UserPlus className="w-3.5 h-3.5" /> Add Customer</span>
              : <span className="flex items-center gap-1.5"><ArrowLeft className="w-3.5 h-3.5" /> All Customers</span>}
          </Button>
        }
      />

      <div className="p-6 max-w-7xl mx-auto">
        {/* ── LIST VIEW ── */}
        {view === "list" && (
          <Card className="overflow-hidden border border-sol-sl/30">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-sol-teal" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-sol-lt/50 border-b border-sol-sl/30">
                      {["Customer","City","System","Phase","Documents","Status","Action"].map(h => (
                        <th key={h} className="px-5 py-3 text-[10px] uppercase tracking-wider text-sol-gray font-bold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sol-sl/20">
                    {myCusts.map(c => {
                      const st  = STATUS_CONFIG[c.status];
                      const pct = Math.round((c.docs_uploaded / c.docs_required) * 100);
                      return (
                        <tr key={c.id} className="hover:bg-sol-teal/5 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-bold text-sol-navy text-xs">{c.name}</div>
                            <div className="text-[10px] text-sol-gray font-semibold mt-0.5">{c.mobile}</div>
                          </td>
                          <td className="px-5 py-4 text-xs font-semibold text-sol-navy/80">{c.city}</td>
                          <td className="px-5 py-4 text-xs font-extrabold text-sol-teal">{c.system_kwp} kWp</td>
                          <td className="px-5 py-4 text-xs font-semibold text-sol-gray">{c.phase}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-sol-sl/40 rounded-full overflow-hidden shadow-inner">
                                <div className="h-full bg-sol-teal rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-[10px] text-sol-gray font-bold">{c.docs_uploaded}/{c.docs_required}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <Badge className={`${st.bg} ${st.color} px-2 py-0.5 border border-current/15`}>{st.label}</Badge>
                          </td>
                          <td className="px-5 py-4">
                            <Button variant="outline" size="sm" className="rounded-xl py-1 text-[11px]">
                              <Eye className="w-3 h-3" /> View
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                    {myCusts.length === 0 && (
                      <tr><td colSpan={7} className="px-5 py-10 text-center text-xs text-sol-gray">No customers yet. Add your first!</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {/* ── ADD FORM ── */}
        {view === "add" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Step bar */}
            <div className="glass-panel rounded-2xl p-4 flex items-center shadow-sm border border-white/50">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold flex-shrink-0 transition-all duration-200 shadow-sm
                    ${i < step ? "bg-sol-teal text-white" : i === step ? "bg-sol-navy text-white" : "bg-sol-sl text-sol-gray"}`}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  <div className={`text-[10px] font-bold uppercase tracking-wider ml-2.5 hidden sm:block ${i === step ? "text-sol-navy" : "text-sol-gray"}`}>{s}</div>
                  {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-4 rounded-full ${i < step ? "bg-sol-teal/30" : "bg-sol-sl"}`} />}
                </div>
              ))}
            </div>

            {/* Step 0 — Customer Info */}
            {step === 0 && (
              <Card>
                <CardHeader><CardTitle><User className="w-4.5 h-4.5 text-sol-teal" /> Customer Information</CardTitle></CardHeader>
                <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {([
                    ["Full Name *", "name", "text", User],
                    ["Mobile *", "mobile", "tel", Phone],
                    ["Email", "email", "email", Mail],
                    ["Aadhaar No.", "aadhaar", "text", CreditCard],
                    ["Address *", "address", "text", MapPin],
                    ["City *", "city", "text", MapPin],
                    ["DISCOM No.", "discom", "text", Info],
                  ] as const).map(([label, key, type, Icon]) => (
                    <div key={key}>
                      <label className="text-[10px] font-bold text-sol-navy block mb-1.5 uppercase tracking-wider">{label}</label>
                      <div className="relative">
                        <Icon className="absolute left-3.5 top-3 w-4 h-4 text-sol-gray/50" />
                        <input type={type} value={(form as unknown as Record<string, string>)[key]}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                          placeholder={label.replace(" *", "")}
                          className="glass-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-sol-navy placeholder-sol-gray/50 font-semibold" />
                      </div>
                    </div>
                  ))}
                </CardBody>
              </Card>
            )}

            {/* Step 1 — Project Details */}
            {step === 1 && (
              <Card>
                <CardHeader><CardTitle><FileCheck className="w-4.5 h-4.5 text-sol-teal" /> Project Details</CardTitle></CardHeader>
                <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-sol-navy block mb-1.5 uppercase tracking-wider">System Capacity *</label>
                    <select value={form.kwp} onChange={e => setForm(f => ({ ...f, kwp: Number(e.target.value) }))}
                      className="glass-input w-full rounded-xl px-3.5 py-2.5 text-xs text-sol-navy font-semibold focus:outline-none">
                      {[1,2,3,4,5,6,7,8,9,10].map(k => <option key={k} value={k}>{k} kWp</option>)}
                    </select>
                  </div>
                  {([
                    ["Phase", "phase", ["Single Phase","3 Phase"]],
                    ["System Type", "system_type", ["ON Grid","OFF Grid","Hybrid"]],
                    ["Scheme", "scheme", ["PM SURYA GHAR","Private"]],
                  ] as const).map(([label, key, options]) => (
                    <div key={key}>
                      <label className="text-[10px] font-bold text-sol-navy block mb-1.5 uppercase tracking-wider">{label}</label>
                      <select value={(form as Record<string, string>)[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="glass-input w-full rounded-xl px-3.5 py-2.5 text-xs text-sol-navy font-semibold focus:outline-none">
                        {options.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </CardBody>
              </Card>
            )}

            {/* Step 2 — Real Document Upload */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="bg-sol-teal/10 border border-sol-teal/20 rounded-2xl px-5 py-3 text-sol-navy text-xs font-semibold flex items-center gap-2">
                  <Info className="w-4.5 h-4.5 text-sol-teal flex-shrink-0" />
                  <span>All {docsTotal} documents are required for PM Surya Ghar subsidy. Files upload directly to Supabase Storage.</span>
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
                      {DOCS_REQUIRED.map(d => {
                        const state = docStates[d.id] ?? "idle";
                        const isDone = state === "done";
                        const isLoading = state === "uploading";
                        const isError = state === "error";

                        return (
                          <div key={d.id} className={`rounded-2xl border-2 p-4 flex flex-col items-center gap-1 text-center transition-all duration-300
                            ${isDone ? "border-sol-teal bg-sol-teal/10 shadow-sm"
                            : isError ? "border-red-400 bg-red-50"
                            : "border-dashed border-sol-sl hover:border-sol-teal/50 hover:bg-sol-teal/5"}`}>

                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1 ${isDone ? "bg-sol-teal/20 text-sol-teal" : isError ? "bg-red-100 text-red-500" : "bg-sol-lt text-sol-gray"}`}>
                              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" />
                                : isDone ? <CheckCircle2 className="w-5 h-5" />
                                : isError ? <AlertCircle className="w-5 h-5" />
                                : <Upload className="w-5 h-5" />}
                            </div>

                            <span className="text-[10px] font-bold text-sol-navy leading-tight">{d.label}</span>
                            <span className="text-[9px] text-sol-gray font-medium">{d.hint}</span>

                            {isDone && docUrls[d.id] && (
                              <a href={docUrls[d.id]} target="_blank" rel="noreferrer"
                                className="text-[9px] text-sol-teal underline font-bold mt-1">View File</a>
                            )}

                            <Badge className={`px-2 py-0.5 rounded-full mt-1.5 text-[9px] ${isDone ? "bg-emerald-500/20 text-emerald-700" : isError ? "bg-red-100 text-red-600" : "bg-red-500/10 text-red-600"}`}>
                              {isDone ? "✓ Uploaded" : isError ? "Retry" : "Required"}
                            </Badge>

                            {/* Hidden file input */}
                            <input type="file" accept="image/jpeg,image/jpg,image/png,application/pdf"
                              ref={el => { fileRefs.current[d.id] = el; }}
                              className="hidden"
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) handleFileChange(d.id, file);
                              }} />

                            <button
                              disabled={isLoading}
                              onClick={() => fileRefs.current[d.id]?.click()}
                              className={`mt-2 text-[9px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer
                                ${isDone ? "bg-sol-teal/10 text-sol-teal hover:bg-sol-teal/20"
                                : "bg-sol-navy text-white hover:bg-sol-dark"}`}>
                              {isLoading ? "Uploading..." : isDone ? "Replace" : "Choose File"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </CardBody>
                </Card>

                {/* GPS */}
                <Card>
                  <CardHeader><CardTitle><MapPin className="w-4.5 h-4.5 text-sol-teal" /> GPS Location</CardTitle></CardHeader>
                  <CardBody>
                    <div className={`rounded-2xl p-5 border-2 text-center transition-all ${gpsCapt ? "border-sol-teal bg-sol-teal/5" : "border-dashed border-sol-sl"}`}>
                      {gpsCapt ? (
                        <>
                          <CheckCircle2 className="w-8 h-8 text-sol-teal mx-auto mb-2" />
                          <div className="text-xs font-bold text-sol-navy">GPS Captured ✓</div>
                          <div className="text-[10px] text-sol-teal font-semibold mt-1">
                            Lat: {gpsCoords?.lat.toFixed(4)}° N · Lng: {gpsCoords?.lng.toFixed(4)}° E
                          </div>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-8 h-8 text-sol-gray mx-auto mb-2" />
                          <div className="text-xs font-bold text-sol-navy mb-3">Location not captured</div>
                          <Button onClick={captureGPS} variant="primary" size="sm" className="rounded-xl">
                            📍 Capture GPS Location
                          </Button>
                        </>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {/* Step 3 — Review */}
            {step === 3 && (
              <Card>
                <CardHeader><CardTitle><FileCheck className="w-4.5 h-4.5 text-sol-teal" /> Review & Submit</CardTitle></CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 bg-sol-lt/40 border border-sol-sl/20 rounded-2xl p-5">
                    {[
                      ["Name", form.name || "—"],
                      ["Mobile", form.mobile || "—"],
                      ["City", form.city || "—"],
                      ["System", `${form.kwp} kWp ${form.system_type}`],
                      ["Phase", form.phase],
                      ["Scheme", form.scheme],
                      ["Docs Uploaded", `${docsDone}/${docsTotal}`],
                      ["GPS", gpsCapt ? `${gpsCoords?.lat.toFixed(4)}, ${gpsCoords?.lng.toFixed(4)}` : "Not captured"],
                    ].map(([label, val]) => (
                      <div key={label}>
                        <span className="text-[10px] text-sol-gray uppercase tracking-wider font-bold">{label}</span>
                        <div className="text-xs font-extrabold text-sol-navy mt-0.5">{val}</div>
                      </div>
                    ))}
                  </div>
                  {docsDone < docsTotal && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 font-semibold">
                      ⚠️ {docsTotal - docsDone} document(s) still pending upload. You can submit now and upload later.
                    </div>
                  )}
                </CardBody>
              </Card>
            )}

            {/* Nav buttons */}
            <div className="flex justify-between mt-5">
              <Button variant="outline" size="sm" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="rounded-xl">
                ← Back
              </Button>
              {step < 3 ? (
                <Button variant="primary" size="sm" onClick={() => setStep(s => s + 1)} className="rounded-xl">
                  Next →
                </Button>
              ) : (
                <Button variant="navy" size="sm" onClick={handleFinalSubmit} className="rounded-xl" disabled={submitting}>
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Submitting...</> : "➤ Submit to Admin"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
