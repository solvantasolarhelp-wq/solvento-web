"use client";
import { useState } from "react";
import { Topbar } from "@/components/shared/Topbar";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockQuotes, mockPricing, PANEL_OPTIONS } from "@/lib/mock-data";
import { fmt, fmtDate, calcPanelQty, calcSubsidy } from "@/lib/utils";
import Image from "next/image";
import { 
  FileSpreadsheet, 
  Printer, 
  MessageCircle, 
  Plus, 
  ArrowLeft, 
  Share2, 
  User, 
  Calendar, 
  MapPin, 
  Info,
  Layers,
  Sparkles,
  Phone,
  Eye
} from "lucide-react";

export default function AssocQuotes() {
  const [view, setView] = useState<"list" | "new">("list");
  const myQuotes = mockQuotes.filter(q => q.associateId === "SOL-2025-003");
  const [kwp, setKwp] = useState(5);
  const [panelIdx, setPanelIdx] = useState(0);
  const [name, setName] = useState(""); 
  const [addr, setAddr] = useState("");
  const [date] = useState(new Date().toISOString().split("T")[0]);
  const panel = PANEL_OPTIONS[panelIdx];
  const totalCost = mockPricing.fixedPrices[kwp] || (kwp * mockPricing.ratePerKwp3Phase);
  const subsidy = calcSubsidy(kwp, mockPricing);
  const net = Math.max(0, totalCost - subsidy);
  const qty = calcPanelQty(kwp, panel.watt);
  const fmtD = (d: string) => { const [y, m, dd] = d.split("-"); return `${dd}/${m}/${y}`; };
  const statusColors: Record<string, string> = { 
    draft: "bg-gray-100 text-gray-700 border-gray-200/50", 
    sent: "bg-blue-500/10 text-blue-700 border-blue-500/10", 
    accepted: "bg-emerald-500/10 text-emerald-700 border-emerald-500/10", 
    rejected: "bg-red-500/10 text-red-700 border-red-500/10"
  };

  return (
    <div className="gradient-bg min-h-screen pb-12">
      <Topbar 
        title={view === "list" ? "My Quotations" : "New Quotation"}
        subtitle={view === "list" ? "Quotes you have generated" : "Generate a solar quote for your customer"}
        actions={
          <div className="flex gap-2">
            {view === "new" && (
              <>
                <Button variant="outline" size="sm" onClick={() => window.print()} className="rounded-xl">
                  <Printer className="w-3.5 h-3.5" /> Print
                </Button>
                <Button variant="primary" size="sm" style={{ background: "#25D366", borderColor: "#25D366" }} onClick={() => { const m = `Solar Quote for ${name || "Client"} | ${kwp} kWp | Net: ${fmt(net)} | Solvanta +91 8114404945`; window.open(`https://wa.me/?text=${encodeURIComponent(m)}`, '_blank'); }} className="rounded-xl">
                  <MessageCircle className="w-3.5 h-3.5 text-white" /> WhatsApp
                </Button>
              </>
            )}
            <Button variant={view === "list" ? "primary" : "outline"} size="sm" onClick={() => setView(v => v === "list" ? "new" : "list")} className="rounded-xl text-xs">
              {view === "list" ? (
                <span className="flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> New Quote</span>
              ) : (
                <span className="flex items-center gap-1.5"><ArrowLeft className="w-3.5 h-3.5" /> All Quotes</span>
              )}
            </Button>
          </div>
        }
      />
      
      <div className="p-6 max-w-7xl mx-auto">
        {view === "list" ? (
          <Card className="overflow-hidden border border-sol-sl/30">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-sol-lt/50 border-b border-sol-sl/30">
                    {["Quote No.", "Customer", "Capacity", "Net Amount", "Date", "Status", "Action"].map(h => (
                      <th key={h} className="px-5 py-3 text-[10px] uppercase tracking-wider text-sol-gray font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-sol-sl/20">
                  {myQuotes.map(q => (
                    <tr key={q.id} className="hover:bg-sol-teal/5 transition-colors">
                      <td className="px-5 py-4 text-xs font-bold text-sol-teal">{q.id}</td>
                      <td className="px-5 py-4 text-xs font-bold text-sol-navy">{q.customerName}</td>
                      <td className="px-5 py-4 text-xs font-semibold text-sol-navy/80">{q.kwp} kWp</td>
                      <td className="px-5 py-4 text-xs font-extrabold text-sol-navy">{fmt(q.netAmount)}</td>
                      <td className="px-5 py-4 text-xs text-sol-gray font-medium">{fmtDate(q.createdAt)}</td>
                      <td className="px-5 py-4">
                        <Badge className={`${statusColors[q.status]} border px-2 py-0.5 capitalize`}>{q.status}</Badge>
                      </td>
                      <td className="px-5 py-4">
                        <Button variant="primary" size="sm" style={{ background: "#25D366", borderColor: "#25D366" }} onClick={() => { const m = `Solar Quote: ${q.customerName} | ${q.kwp} kWp | Net: ${fmt(q.netAmount)} | Solvanta +91 8114404945`; window.open(`https://wa.me/?text=${encodeURIComponent(m)}`, '_blank'); }} className="rounded-xl py-1 text-[11px]">
                          <Share2 className="w-3.5 h-3.5" /> Share
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle><User className="w-4.5 h-4.5 text-sol-teal" /> Client Details</CardTitle>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-sol-navy block mb-1.5 uppercase tracking-wider">Client Name *</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3 w-4 h-4 text-sol-gray/50" />
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="Mr. Ramesh Kumar" className="glass-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-sol-navy placeholder-sol-gray/50 font-semibold" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-sol-navy block mb-1.5 uppercase tracking-wider">Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-sol-gray/50" />
                        <input type="date" defaultValue={date} className="glass-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-sol-navy focus:outline-none font-semibold" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-sol-navy block mb-1.5 uppercase tracking-wider">Address / City *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-sol-gray/50" />
                      <input value={addr} onChange={e => setAddr(e.target.value)} placeholder="Village, Tehsil, City" className="glass-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-sol-navy placeholder-sol-gray/50 font-semibold" />
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle><Layers className="w-4.5 h-4.5 text-sol-teal" /> System & Panel Configuration</CardTitle>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-sol-navy block mb-1.5 uppercase tracking-wider">Capacity (kWp)</label>
                      <select value={kwp} onChange={e => setKwp(Number(e.target.value))} className="glass-input w-full rounded-xl px-3.5 py-2.5 text-xs text-sol-navy focus:outline-none font-semibold">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(k => <option key={k} value={k}>{k} kWp</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-sol-navy block mb-1.5 uppercase tracking-wider">Phase</label>
                      <select className="glass-input w-full rounded-xl px-3.5 py-2.5 text-xs text-sol-navy focus:outline-none font-semibold">
                        <option>Single Phase</option>
                        <option>3 Phase</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-bold text-sol-navy block mb-2 uppercase tracking-wider">Select Solar Panel Brand</label>
                    <div className="grid grid-cols-3 gap-2">
                      {PANEL_OPTIONS.map((p, i) => (
                        <button key={p.brand} onClick={() => setPanelIdx(i)} className={`rounded-2xl border-2 p-3 text-center transition-all duration-300 cursor-pointer ${panelIdx === i ? "border-sol-teal bg-sol-teal/10 shadow-sm" : "border-sol-sl bg-white/40 hover:border-sol-teal/50"}`}>
                          <div className="text-[10px] font-extrabold text-sol-navy tracking-tight">{p.brand}</div>
                          <div className="text-sm font-black text-sol-teal mt-0.5">{p.watt}W</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between bg-gradient-to-r from-sol-navy to-sol-dark text-white rounded-2xl px-5 py-4 items-center shadow-md">
                    <div>
                      <span className="text-[11px] text-white/60 font-semibold block uppercase tracking-wider">Net Price</span>
                      <span className="text-[10px] text-sol-teal font-bold">(After ₹{(subsidy / 1000).toFixed(0)}K Subsidy)</span>
                    </div>
                    <span className="text-2xl font-black text-sol-gold tracking-tight">{fmt(net)}</span>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Mini quote preview */}
            <div className="bg-white rounded-2xl border border-sol-sl/30 overflow-hidden shadow-xl print:w-full print:border-0" style={{ fontFamily: "Times New Roman, serif", fontSize: "11px", color: "#000" }}>
              <div className="p-6">
                <div className="flex items-center gap-3 pb-3.5 border-b-2 border-sol-navy mb-4">
                  <div className="w-14 h-14 rounded overflow-hidden bg-white flex-shrink-0 shadow p-0.5">
                    <Image src="/logo.jpg" alt="" width={56} height={56} className="object-contain" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sol-navy tracking-tight" style={{ fontFamily: "Arial, sans-serif", fontSize: "15px" }}>SOLVANTA SOLAR ENERGY</div>
                    <div className="text-[8px] text-sol-teal font-bold uppercase tracking-wider">Authorized Channel Partner INA & X-watt | Tata Power* | Adani* | Waaree*</div>
                  </div>
                </div>
                <div className="text-right font-bold text-[10px] mb-3">Dated: {fmtD(date)}</div>
                <div className="mb-2 font-bold text-[13px]">{name || "Mr. ___________"}</div>
                <div className="mb-4 text-[10px] font-semibold text-gray-600">{addr || "Jaipur, Rajasthan"}</div>
                <div className="font-bold text-[11px] mb-3 underline">Sub: Proposal for PM SURYA GHAR Solar Rooftop Plant.</div>
                
                <div className="font-bold text-center text-[12px] uppercase tracking-wider mb-3" style={{ fontFamily: "Arial, sans-serif" }}>Bill of Material</div>
                
                <table className="w-full border-collapse text-[10px] mb-4">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 px-3 py-2 text-white text-left uppercase tracking-wider" style={{ background: "#2BA8A0" }} colSpan={2}>PMSG Scheme — {kwp} kWp SPV System</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-3 py-2 font-medium">{panel.desc}</td>
                      <td className="border border-gray-200 px-3 py-2 text-center font-bold">{qty} Nos.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-3 py-2 font-medium">GTI Inverter + Structure + BOS Accessories</td>
                      <td className="border border-gray-200 px-3 py-2 text-center font-semibold text-gray-500">Included</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="border border-gray-200 px-3 py-2 font-bold text-sol-navy">Total Cost (incl. GST)</td>
                      <td className="border border-gray-200 px-3 py-2 text-center font-extrabold text-sol-navy text-xs">{fmt(totalCost)}</td>
                    </tr>
                    <tr className="bg-amber-50/50">
                      <td className="border border-gray-200 px-3 py-2 font-bold text-amber-800">MNRE Government Subsidy</td>
                      <td className="border border-gray-200 px-3 py-2 text-center font-extrabold text-green-700">-{fmt(subsidy)}</td>
                    </tr>
                    <tr style={{ background: "#1B2A4A" }}>
                      <td className="border border-gray-400 px-3 py-2 font-black text-white text-xs">Price After Subsidy</td>
                      <td className="border border-gray-400 px-3 py-2 text-center font-black text-[14px]" style={{ color: "#F5B800" }}>{fmt(net)}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="text-[9px] text-gray-500 border-t pt-3 font-semibold space-y-1">
                  <div>• Complete transportation, net-metering liaisoning and civil works included.</div>
                  <div>• Warranty: 25 Years on Panel output performance · 5 Years complete system.</div>
                </div>
              </div>
              <div className="bg-sol-navy text-white/60 text-center py-2 text-[9px] font-semibold">
                Niwaru Link Road, Govindpura, Jaipur | +91 8114404945 | solvantasolarhelp@gmail.com
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
