"use client";
import { useState } from "react";
import { Topbar } from "@/components/shared/Topbar";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockPricing } from "@/lib/mock-data";
import { fmt } from "@/lib/utils";
import { 
  Save, 
  Info, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Coins, 
  Percent, 
  Table 
} from "lucide-react";

export default function AdminPricing() {
  const [pricing, setPricing] = useState(mockPricing);
  const [saved, setSaved] = useState(false);

  function save() { 
    setSaved(true); 
    setTimeout(() => setSaved(false), 2500); 
  }

  return (
    <div className="gradient-bg min-h-screen pb-12">
      <Topbar 
        title="Pricing Panel" 
        subtitle="Set project costs — auto-fills in Quotation Maker"
        actions={
          <Button variant="primary" size="sm" onClick={save} className="rounded-xl flex items-center gap-1.5">
            {saved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" /> Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save & Apply
              </>
            )}
          </Button>
        }
      />
      
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Info Alert */}
        <div className="glass-panel border-sol-teal/20 rounded-2xl px-5 py-4 text-sol-teal text-xs flex items-center gap-3 shadow-md backdrop-blur-md">
          <div className="w-8 h-8 rounded-xl bg-sol-teal/10 flex items-center justify-center flex-shrink-0 text-sol-teal">
            <Info className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="font-extrabold text-sol-navy">Quotation Setup:</span> These prices automatically populate in the Quotation Maker. Associates cannot edit base prices.
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Option A: Price per kWp */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Zap className="w-4.5 h-4.5 text-sol-teal" /> Option A — Price per kWp
              </CardTitle>
              <Badge className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[9px]">
                Recommended
              </Badge>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs px-4 py-3 rounded-xl flex items-start gap-2.5 font-semibold">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <p className="leading-tight">
                  System Cost = kWp × Rate. E.g. 5 kWp × {fmt(pricing.ratePerKwp3Phase)} = {fmt(5 * pricing.ratePerKwp3Phase)} (3 Phase)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-sol-navy block mb-1.5 uppercase tracking-wider">Rate/kWp — Single Phase (₹)</label>
                  <input 
                    type="number" 
                    value={pricing.ratePerKwpSinglePhase} 
                    step="500"
                    onChange={e => setPricing(p => ({ ...p, ratePerKwpSinglePhase: Number(e.target.value) }))}
                    className="w-full bg-sol-lt/30 border border-sol-sl/30 rounded-xl px-4 py-2.5 text-xs text-sol-navy font-bold focus:outline-none focus:border-sol-teal focus:bg-white transition-all shadow-inner"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-sol-navy block mb-1.5 uppercase tracking-wider">Rate/kWp — 3 Phase (₹)</label>
                  <input 
                    type="number" 
                    value={pricing.ratePerKwp3Phase} 
                    step="500"
                    onChange={e => setPricing(p => ({ ...p, ratePerKwp3Phase: Number(e.target.value) }))}
                    className="w-full bg-sol-lt/30 border border-sol-sl/30 rounded-xl px-4 py-2.5 text-xs text-sol-navy font-bold focus:outline-none focus:border-sol-teal focus:bg-white transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="bg-sol-lt/40 border border-sol-sl/20 rounded-2xl p-4">
                <div className="text-[10px] font-bold text-sol-gray uppercase tracking-wider mb-3">Live Preview (3 Phase)</div>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3, 5, 8, 10].map(k => (
                    <div key={k} className="bg-white/80 border border-sol-sl/30 rounded-xl p-3 text-center shadow-sm">
                      <div className="text-[10px] text-sol-gray font-bold">{k} kWp</div>
                      <div className="text-xs font-black text-sol-navy mt-0.5">{fmt(k * pricing.ratePerKwp3Phase)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Option B: Fixed price table */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Table className="w-4.5 h-4.5 text-sol-navy" /> Option B — Fixed Price Table
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs px-4 py-3 rounded-xl flex items-start gap-2.5 font-semibold">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="leading-tight">
                  Manually set exact price per capacity. If set, this overrides Option A.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(k => (
                  <div key={k} className="space-y-1">
                    <label className="text-[10px] font-bold text-sol-navy block uppercase tracking-wider">{k} kWp (₹)</label>
                    <input 
                      type="number" 
                      value={pricing.fixedPrices[k] || ""} 
                      step="1000"
                      onChange={e => setPricing(p => ({
                        ...p,
                        fixedPrices: { ...p.fixedPrices, [k]: Number(e.target.value) }
                      }))}
                      className="w-full bg-sol-lt/30 border border-sol-sl/30 rounded-xl px-4 py-2 text-xs text-sol-navy font-bold focus:outline-none focus:border-sol-teal focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Subsidy Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Coins className="w-4.5 h-4.5 text-sol-gold" /> MNRE Subsidy Table
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                ["1 kWp Subsidy (₹)", "subsidy1kw"],
                ["2 kWp Subsidy (₹)", "subsidy2kw"],
                ["3 kWp+ Subsidy (₹)", "subsidy3kwPlus"]
              ].map(([label, key]) => (
                <div key={key} className="space-y-1">
                  <label className="text-[10px] font-bold text-sol-navy block uppercase tracking-wider">{label}</label>
                  <input 
                    type="number" 
                    value={(pricing as unknown as Record<string, number>)[key]} 
                    step="1000"
                    onChange={e => setPricing(p => ({ ...p, [key]: Number(e.target.value) }))}
                    className="w-full bg-sol-lt/30 border border-sol-sl/30 rounded-xl px-4 py-2.5 text-xs text-sol-navy font-bold focus:outline-none focus:border-sol-teal focus:bg-white transition-all shadow-inner"
                  />
                </div>
              ))}
            </div>
            
            <div className="bg-sol-lt/30 border border-sol-sl/20 p-4 rounded-2xl">
              <p className="text-[10px] text-sol-gray font-semibold leading-relaxed">
                * Note: Subsidy calculations follow PM Surya Ghar specifications. MNRE directly credits the customer&apos;s bank account within 20 days of net metering deployment.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

