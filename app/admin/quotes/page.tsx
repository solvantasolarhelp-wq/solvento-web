"use client";
import { useState, useCallback } from "react";
import { Topbar } from "@/components/shared/Topbar";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { mockQuotes, mockPricing, PANEL_OPTIONS } from "@/lib/mock-data";
import { fmt, fmtDate, calcPanelQty, calcSubsidy } from "@/lib/utils";
import Image from "next/image";

interface QuoteForm {
  clientName: string; date: string; address: string; mobile: string; discom: string;
  kwp: number; customKwp: string; phase: string; stype: string; scheme: string;
  panelIdx: number; panelWatt: number; panelDesc: string; inverter: string; structure: string;
  totalCost: number; subsidy: number; customSubsidy: string; useCustomSub: boolean; remarks: string;
}

export default function AdminQuotes() {
  const [view, setView] = useState<"list"|"maker">("list");
  const [form, setForm] = useState<QuoteForm>({
    clientName:"", date: new Date().toISOString().split("T")[0], address:"", mobile:"", discom:"",
    kwp:8, customKwp:"", phase:"3 Phase", stype:"ON Grid", scheme:"PM SURYA GHAR",
    panelIdx:0, panelWatt:600, panelDesc:"INA DCR (TOPCON Bifacial) 600 Wp", inverter:"X-Watt", structure:"GI Strut & GI Pipe (Apollo)",
    totalCost: mockPricing.fixedPrices[8], subsidy:78000, customSubsidy:"", useCustomSub:false, remarks:"",
  });

  const getKwp = () => form.kwp === 0 ? (parseFloat(form.customKwp)||8) : form.kwp;
  const getSub = () => form.useCustomSub ? (parseFloat(form.customSubsidy)||0) : form.subsidy;
  const getNet = () => Math.max(0, form.totalCost - getSub());
  const getQty = () => calcPanelQty(getKwp(), form.panelWatt);

  const fmtD = (d:string) => { if(!d) return ""; const [y,m,dd]=d.split("-"); return `${dd}/${m}/${y}`; };

  function handleKwpChange(val: string) {
    const k = parseFloat(val);
    const price = mockPricing.fixedPrices[k] || k * mockPricing.ratePerKwp3Phase;
    const sub = calcSubsidy(k, mockPricing);
    setForm(f => ({...f, kwp: k||0, customKwp: val==="custom"?f.customKwp:"", totalCost:price, subsidy:sub, useCustomSub:false}));
  }

  function handlePanelSelect(idx: number) {
    const p = PANEL_OPTIONS[idx];
    setForm(f => ({...f, panelIdx:idx, panelWatt:p.watt, panelDesc:p.desc}));
  }

  const statusColors: Record<string,string> = {
    draft:"bg-gray-100 text-gray-700", sent:"bg-blue-50 text-blue-700",
    accepted:"bg-green-50 text-green-700", rejected:"bg-red-50 text-red-700"
  };

  return (
    <div>
      <Topbar title={view==="list" ? "Quotations" : "Solar Quotation Maker"}
        subtitle={view==="list" ? "All generated solar quotes" : "Generate professional PM Surya Ghar quotation"}
        actions={
          <div className="flex gap-2">
            {view==="maker" && <><Button variant="outline" size="sm" onClick={()=>window.print()}>🖨 Print / PDF</Button>
              <Button variant="primary" size="sm" onClick={()=>{ const msg=`Solar Quote for ${form.clientName||"Client"} | ${getKwp()} kWp | Net: ${fmt(getNet())} | Solvanta Solar +91 8114404945`; window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`,'_blank');}}>💬 WhatsApp</Button></>}
            <Button variant={view==="list"?"primary":"outline"} size="sm" onClick={()=>setView(v=>v==="list"?"maker":"list")}>
              {view==="list" ? "+ New Quote" : "← All Quotes"}
            </Button>
          </div>
        }/>

      <div className="p-6">
      {view==="list" ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-[#F4F7FB] border-b border-sol-sl">
                {["Quote No.","Customer","kWp","Panel","Total Cost","Subsidy","Net Amount","Date","Status","Action"].map(h=>(
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] uppercase tracking-wide text-sol-gray font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {mockQuotes.map(q => (
                  <tr key={q.id} className="border-b border-sol-sl/40 last:border-0 hover:bg-sol-lt/20">
                    <td className="px-4 py-3 text-xs font-semibold text-sol-teal">{q.id}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-sol-navy">{q.customerName}</td>
                    <td className="px-4 py-3 text-xs">{q.kwp} kWp</td>
                    <td className="px-4 py-3 text-xs text-sol-gray">{q.panelBrand}</td>
                    <td className="px-4 py-3 text-xs font-semibold">{fmt(q.totalCost)}</td>
                    <td className="px-4 py-3 text-xs text-green-700">-{fmt(q.subsidy)}</td>
                    <td className="px-4 py-3 text-xs font-bold text-sol-navy">{fmt(q.netAmount)}</td>
                    <td className="px-4 py-3 text-xs text-sol-gray">{fmtDate(q.createdAt)}</td>
                    <td className="px-4 py-3"><Badge className={`${statusColors[q.status]} text-[10px] capitalize`}>{q.status}</Badge></td>
                    <td className="px-4 py-3"><Button variant="outline" size="sm" onClick={()=>setView("maker")}>✏ Edit</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-5">
          {/* FORM */}
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>👤 Client Details</CardTitle></CardHeader>
              <CardBody className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-bold text-sol-navy block mb-1">Client Name *</label>
                    <input value={form.clientName} onChange={e=>setForm(f=>({...f,clientName:e.target.value}))} placeholder="Mr. Ramesh Kumar"
                      className="w-full border border-sol-sl rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sol-teal"/></div>
                  <div><label className="text-xs font-bold text-sol-navy block mb-1">Date</label>
                    <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}
                      className="w-full border border-sol-sl rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sol-teal"/></div>
                </div>
                <div><label className="text-xs font-bold text-sol-navy block mb-1">Address / City *</label>
                  <input value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))} placeholder="Village, Tehsil, Jaipur, Rajasthan"
                    className="w-full border border-sol-sl rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sol-teal"/></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-bold text-sol-navy block mb-1">Mobile</label>
                    <input value={form.mobile} onChange={e=>setForm(f=>({...f,mobile:e.target.value}))} placeholder="+91 XXXXX XXXXX"
                      className="w-full border border-sol-sl rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sol-teal"/></div>
                  <div><label className="text-xs font-bold text-sol-navy block mb-1">DISCOM Consumer No.</label>
                    <input value={form.discom} onChange={e=>setForm(f=>({...f,discom:e.target.value}))} placeholder="RVV-JA-045821"
                      className="w-full border border-sol-sl rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sol-teal"/></div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader><CardTitle>⚙ System Configuration</CardTitle></CardHeader>
              <CardBody className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-bold text-sol-navy block mb-1">Capacity (kWp) *</label>
                    <select value={form.kwp||"custom"} onChange={e=>handleKwpChange(e.target.value)}
                      className="w-full border border-sol-sl rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sol-teal">
                      {[1,2,3,4,5,6,7,8,9,10].map(k=><option key={k} value={k}>{k} kWp</option>)}
                      <option value="0">Custom...</option>
                    </select></div>
                  {form.kwp===0 && <div><label className="text-xs font-bold text-sol-navy block mb-1">Custom kWp</label>
                    <input type="number" value={form.customKwp} onChange={e=>setForm(f=>({...f,customKwp:e.target.value}))}
                      className="w-full border border-sol-sl rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sol-teal"/></div>}
                  <div><label className="text-xs font-bold text-sol-navy block mb-1">Phase</label>
                    <select value={form.phase} onChange={e=>setForm(f=>({...f,phase:e.target.value}))}
                      className="w-full border border-sol-sl rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sol-teal">
                      <option>Single Phase</option><option>3 Phase</option>
                    </select></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-bold text-sol-navy block mb-1">System Type</label>
                    <select value={form.stype} onChange={e=>setForm(f=>({...f,stype:e.target.value}))}
                      className="w-full border border-sol-sl rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sol-teal">
                      <option>ON Grid</option><option>OFF Grid</option><option>Hybrid</option>
                    </select></div>
                  <div><label className="text-xs font-bold text-sol-navy block mb-1">Scheme</label>
                    <select value={form.scheme} onChange={e=>setForm(f=>({...f,scheme:e.target.value}))}
                      className="w-full border border-sol-sl rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sol-teal">
                      <option>PM SURYA GHAR</option><option>PMSG Commercial</option><option>Private (No Subsidy)</option>
                    </select></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-bold text-sol-navy block mb-1">Inverter Make</label>
                    <input value={form.inverter} onChange={e=>setForm(f=>({...f,inverter:e.target.value}))}
                      className="w-full border border-sol-sl rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sol-teal"/></div>
                  <div><label className="text-xs font-bold text-sol-navy block mb-1">Structure Make</label>
                    <input value={form.structure} onChange={e=>setForm(f=>({...f,structure:e.target.value}))}
                      className="w-full border border-sol-sl rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sol-teal"/></div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader><CardTitle>☀ Panel Selection</CardTitle></CardHeader>
              <CardBody>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {PANEL_OPTIONS.map((p,i) => (
                    <button key={p.brand} onClick={()=>handlePanelSelect(i)}
                      className={`rounded-xl border-2 p-2.5 text-center transition-all ${form.panelIdx===i?"border-sol-teal bg-sol-lt":"border-sol-sl hover:border-sol-teal/50"}`}>
                      <div className="text-xs font-bold text-sol-navy">{p.brand}</div>
                      <div className="text-base font-black text-sol-teal">{p.watt}W</div>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-bold text-sol-navy block mb-1">Wattage (W)</label>
                    <input type="number" value={form.panelWatt} onChange={e=>setForm(f=>({...f,panelWatt:Number(e.target.value)}))}
                      className="w-full border border-sol-sl rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sol-teal"/></div>
                  <div><label className="text-xs font-bold text-sol-navy block mb-1">Panel Description</label>
                    <input value={form.panelDesc} onChange={e=>setForm(f=>({...f,panelDesc:e.target.value}))}
                      className="w-full border border-sol-sl rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sol-teal"/></div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader><CardTitle>₹ Pricing (Admin Controlled)</CardTitle></CardHeader>
              <CardBody className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-bold text-sol-navy block mb-1">Total Cost incl. GST (₹) *</label>
                    <input type="number" value={form.totalCost} onChange={e=>setForm(f=>({...f,totalCost:Number(e.target.value)}))} step="1000"
                      className="w-full border border-sol-sl rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sol-teal font-semibold"/></div>
                  <div><label className="text-xs font-bold text-sol-navy block mb-1">MNRE Subsidy (₹)</label>
                    <select value={form.useCustomSub?"custom":form.subsidy} onChange={e=>{
                      if(e.target.value==="custom") setForm(f=>({...f,useCustomSub:true}));
                      else setForm(f=>({...f,subsidy:Number(e.target.value),useCustomSub:false}));
                    }} className="w-full border border-sol-sl rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sol-teal">
                      <option value={78000}>₹78,000 — 3 kWp+</option>
                      <option value={60000}>₹60,000 — 2 kWp</option>
                      <option value={30000}>₹30,000 — 1 kWp</option>
                      <option value={0}>No Subsidy</option>
                      <option value="custom">Custom...</option>
                    </select></div>
                </div>
                {form.useCustomSub && <div><label className="text-xs font-bold text-sol-navy block mb-1">Custom Subsidy (₹)</label>
                  <input type="number" value={form.customSubsidy} onChange={e=>setForm(f=>({...f,customSubsidy:e.target.value}))} step="1000"
                    className="w-full border border-sol-sl rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sol-teal"/></div>}
                <div className="flex justify-between items-center bg-sol-navy text-white rounded-xl px-4 py-3">
                  <span className="text-sm text-white/70">Net Price After Subsidy</span>
                  <span className="text-xl font-black text-sol-gold">{fmt(getNet())}</span>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* QUOTE PREVIEW */}
          <div className="print:w-full">
            <div id="quote-preview" className="bg-white rounded-xl border border-sol-sl overflow-hidden shadow-sm" style={{fontFamily:"Times New Roman,serif",fontSize:"11px",color:"#000"}}>
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between pb-3 border-b-2 border-sol-navy mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                      <Image src="/logo.jpg" alt="Solvanta" width={64} height={64} className="object-contain"/>
                    </div>
                    <div>
                      <div className="text-xl font-black text-sol-navy" style={{fontFamily:"Arial,sans-serif"}}>SOLVANTA SOLAR ENERGY</div>
                      <div className="text-[9px] text-sol-teal font-bold underline">Authorized Channel Partner INA & X-watt | Tata Power* | Adani* | Waaree* | Loom</div>
                      <div className="text-[8px] text-gray-600 mt-1">Office:- P.NO. 1-D KALYAN PURI GOVINDPURA JIAPUR KLAWARD ROAD JAIPUR</div>
                      <div className="text-[8px] text-gray-600">Official Number:- 8114404945 | 8005973887 | 9950746563  Email:- solvantasolarhelp@gmail.com</div>
                    </div>
                  </div>
                </div>
                {/* To */}
                <div className="mb-3">
                  <div className="text-right font-bold text-[11px] mb-2">Dated: {fmtD(form.date)||"___/___/______"}</div>
                  <div>To,</div>
                  <div className="font-bold text-[13px]">{form.clientName || "Mr. ___________"}</div>
                  <div>{form.address || "Jaipur, Rajasthan"}</div>
                </div>
                <div className="mb-2 text-[11px]">Hello Sir/Ma&apos;am,</div>
                <div className="font-bold text-[11px] mb-2 underline">Sub: Proposal for Design, Erection &amp; Commissioning of ({form.scheme}) Solar Rooftop Subsidy Scheme.</div>
                <div className="text-[10px] mb-3 leading-relaxed">With reference to our discussion, we are very pleased to offer you our best proposal for Rooftop Solar <strong>{form.stype}</strong> Power Plant as follows:</div>
                <div className="font-black text-center underline text-[13px] mb-3" style={{fontFamily:"Arial,sans-serif"}}>Bill of Material — {form.stype} Solar System</div>

                {/* BOM Table */}
                <table className="w-full border-collapse mb-3 text-[10px]">
                  <thead>
                    <tr>
                      <th className="border border-gray-400 px-2 py-1.5 text-center text-white font-bold" style={{background:"#2BA8A0",width:"8%"}}>Sr.</th>
                      <th className="border border-gray-400 px-2 py-1.5 text-center text-white font-bold" style={{background:"#2BA8A0",width:"55%"}}>PMSG — {form.phase==="3 Phase"?"Three Phase":"Single Phase"}</th>
                      <th className="border border-gray-400 px-2 py-1.5 text-center text-white font-bold" style={{background:"#2BA8A0",width:"37%"}}>{getKwp()} kWp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["1",`Solar Module — ${form.panelDesc}`,`${getQty()} Nos. (Approx.)`],
                      ["2",`GTI Inverter — ${form.inverter} (${getKwp()} kW)`,"1 Unit"],
                      ["3",`Structure — ${form.structure}`,`${getKwp()} kWp Set`],
                      ["4","DC Cable — Polycab & AC Cable — Polycab","As per site"],
                      ["5","LA & Earthing — Standard Make","1 Set"],
                      ["6","ACDB & DCDB — Havells","1 Set"],
                      ["7","Meter (Solar + Net) — L&T","1 Unit"],
                      ["8","Installation, Commissioning & Transportation","Included"],
                    ].map(([n,item,qty]) => (
                      <tr key={n}>
                        <td className="border border-gray-300 px-2 py-1 text-center">{n}</td>
                        <td className="border border-gray-300 px-2 py-1">{item}</td>
                        <td className="border border-gray-300 px-2 py-1 text-center font-semibold">{qty}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50"><td className="border border-gray-300 px-2 py-1 text-center font-bold">A</td><td className="border border-gray-300 px-2 py-1.5 font-bold">Total Project Cost (Including GST)</td><td className="border border-gray-300 px-2 py-1.5 text-center font-black text-[13px]">{fmt(form.totalCost).replace("₹","")}</td></tr>
                    <tr className="bg-amber-50"><td className="border border-gray-300 px-2 py-1 text-center font-bold">B</td><td className="border border-gray-300 px-2 py-1">Subsidy Transfer By MNRE in Customer Account <span className="text-[9px]">(20 days after Net Metering)</span></td><td className="border border-gray-300 px-2 py-1 text-center font-black text-[13px]">{fmt(getSub()).replace("₹","")}</td></tr>
                    <tr style={{background:"#1B2A4A"}}><td className="border border-gray-500 px-2 py-2 text-center font-black text-white">3</td><td className="border border-gray-500 px-2 py-2 font-black text-white text-[13px]">Price After Subsidy</td><td className="border border-gray-500 px-2 py-2 text-center font-black text-[15px]" style={{color:"#F5B800"}}>{fmt(getNet()).replace("₹","")}</td></tr>
                  </tbody>
                </table>

                {/* Bottom */}
                <div className="grid grid-cols-2 gap-4 mb-3 text-[10px]">
                  <div>
                    <div className="font-bold underline mb-1 text-[11px]">Account Details:-</div>
                    <div className="font-black text-sol-teal text-[13px]">M K Solar Energy</div>
                    <div>A/c:- 50200080460441</div>
                    <div>IFSC:- HDFC0007677</div>
                    <div>Bank:- HDFC, Sirsi Road, Jaipur</div>
                  </div>
                  <div>
                    <div className="font-bold underline mb-1 text-[11px]">Required Documents For Subsidy:-</div>
                    <ol className="list-decimal pl-4 space-y-0.5 font-semibold">
                      <li>Aadhaar Card</li><li>PAN Card</li><li>Electricity Bill</li>
                      <li>Cancelled Cheque</li><li>Gmail ID</li><li>Mobile No.</li>
                      <li>Location Photo with Client (Google Map Camera)</li>
                    </ol>
                  </div>
                </div>

                <div className="border-t border-gray-300 pt-2 text-[11px]">
                  <div className="flex justify-between items-baseline">
                    <div className="font-bold">Final Order (SPV kWp)......{getKwp()} kWp......Phase......{form.phase}......Remarks...{form.remarks}</div>
                    <div className="font-bold pr-12">Signature</div>
                  </div>
                  <div className="font-black text-[13px] mt-1">Total Final &nbsp;<span style={{color:"#2BA8A0"}}>{fmt(getNet()).replace("₹","")}</span> After Subsidy</div>
                </div>
              </div>
              <div className="bg-sol-navy text-white/80 text-center py-2 text-[8px]">
                Office:- P.NO. 1-D KALYAN PURI GOVINDPURA JIAPUR KLAWARD ROAD JAIPUR | 8114404945 | 8005973887 | 9950746563 | solvantasolarhelp@gmail.com
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
