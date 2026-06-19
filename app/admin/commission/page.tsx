"use client";
import { useState } from "react";
import { Topbar } from "@/components/shared/Topbar";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockCommissionSlabs, mockOffers, mockAssociates } from "@/lib/mock-data";
import { fmt, TIER_CONFIG } from "@/lib/utils";
import { 
  Megaphone, 
  Info, 
  CheckCircle2, 
  Send, 
  Check, 
  IndianRupee, 
  Layers, 
  TrendingUp,
  AlertCircle
} from "lucide-react";

export default function AdminCommission() {
  const [slabs, setSlabs] = useState(mockCommissionSlabs);
  const [saved, setSaved] = useState(false);
  const [offer, setOffer] = useState({ title:"", bonus:5000, target:10, desc:"" });
  const [offerSent, setOfferSent] = useState(false);

  const pendingPayouts = mockAssociates.filter(a => a.commissionPending > 0);

  return (
    <div className="gradient-bg min-h-screen pb-12">
      <Topbar 
        title="Commission Control" 
        subtitle="Set slabs, targets and bonuses"
        actions={
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            }} 
            className="rounded-xl flex items-center gap-1.5"
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" /> Notified!
              </>
            ) : (
              <>
                <Megaphone className="w-4 h-4" /> Save & Notify All
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
            <span className="font-extrabold text-sol-navy">Commission Range:</span> Fixed commission range: ₹8,000 to ₹15,000 per installation. All associate dashboards update automatically on save.
          </div>
        </div>

        {/* Tier Slabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {slabs.map((slab, i) => {
            const t = TIER_CONFIG[slab.tier];
            return (
              <Card key={slab.tier} className={`border-2 ${t.border} overflow-hidden`}>
                <div className={`p-5 h-full flex flex-col justify-between ${t.bg}`}>
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-1 flex justify-center">{t.emoji}</div>
                    <div className={`font-extrabold text-sm ${t.color}`}>{t.label}</div>
                    <div className="text-[10px] text-sol-gray font-bold uppercase tracking-wider mt-0.5">{slab.salesRange}</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className={`text-[10px] font-bold block mb-1.5 uppercase tracking-wider ${t.color}`}>Commission / Sale (₹)</label>
                      <input 
                        type="number" 
                        value={slab.amount} 
                        step="500" 
                        min="8000" 
                        max="15000"
                        onChange={e => {
                          const ns = [...slabs];
                          ns[i] = { ...ns[i], amount: Number(e.target.value) };
                          setSlabs(ns);
                        }}
                        className={`w-full border-2 ${t.border} rounded-xl px-3 py-2 text-base font-black text-center focus:outline-none bg-white/80 focus:bg-white transition-all`}
                      />
                    </div>
                    
                    {slab.targetBonus > 0 && (
                      <div>
                        <label className={`text-[9px] font-bold block mb-1 uppercase tracking-wider ${t.color}`}>Target Bonus (₹)</label>
                        <input 
                          type="number" 
                          value={slab.targetBonus} 
                          step="500"
                          onChange={e => {
                            const ns = [...slabs];
                            ns[i] = { ...ns[i], targetBonus: Number(e.target.value) };
                            setSlabs(ns);
                          }}
                          className="w-full bg-white/80 border border-sol-sl/30 focus:border-sol-teal rounded-xl px-3 py-1.5 text-xs text-center focus:outline-none transition-all shadow-inner font-semibold"
                        />
                      </div>
                    )}
                    
                    {slab.annualBonus > 0 && (
                      <div>
                        <label className={`text-[9px] font-bold block mb-1 uppercase tracking-wider ${t.color}`}>Annual Bonus (₹)</label>
                        <input 
                          type="number" 
                          value={slab.annualBonus} 
                          step="1000"
                          onChange={e => {
                            const ns = [...slabs];
                            ns[i] = { ...ns[i], annualBonus: Number(e.target.value) };
                            setSlabs(ns);
                          }}
                          className="w-full bg-white/80 border border-sol-sl/30 focus:border-sol-teal rounded-xl px-3 py-1.5 text-xs text-center focus:outline-none transition-all shadow-inner font-semibold"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Offer Publisher */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Megaphone className="w-4.5 h-4.5 text-sol-teal" /> Publish New Offer
              </CardTitle>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => {
                  setOfferSent(true);
                  setTimeout(() => setOfferSent(false), 2000);
                }}
                className="rounded-xl flex items-center gap-1.5 text-[10px] py-1.5"
              >
                {offerSent ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Published!
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Publish
                  </>
                )}
              </Button>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-sol-navy block mb-1.5 uppercase tracking-wider">Offer Title</label>
                <input 
                  value={offer.title} 
                  onChange={e => setOffer(o => ({ ...o, title: e.target.value }))} 
                  placeholder="E.g. June Star Performer Bonus"
                  className="w-full bg-sol-lt/30 border border-sol-sl/30 focus:border-sol-teal focus:bg-white rounded-xl px-4 py-2.5 text-xs text-sol-navy font-semibold focus:outline-none transition-all shadow-inner"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-sol-navy block mb-1.5 uppercase tracking-wider">Bonus Amount (₹)</label>
                  <input 
                    type="number" 
                    value={offer.bonus} 
                    onChange={e => setOffer(o => ({ ...o, bonus: Number(e.target.value) }))}
                    className="w-full bg-sol-lt/30 border border-sol-sl/30 focus:border-sol-teal focus:bg-white rounded-xl px-4 py-2.5 text-xs text-sol-navy font-bold focus:outline-none transition-all shadow-inner"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-sol-navy block mb-1.5 uppercase tracking-wider">Target (Sales)</label>
                  <input 
                    type="number" 
                    value={offer.target} 
                    onChange={e => setOffer(o => ({ ...o, target: Number(e.target.value) }))}
                    className="w-full bg-sol-lt/30 border border-sol-sl/30 focus:border-sol-teal focus:bg-white rounded-xl px-4 py-2.5 text-xs text-sol-navy font-bold focus:outline-none transition-all shadow-inner"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-sol-navy block mb-1.5 uppercase tracking-wider">Description</label>
                <textarea 
                  value={offer.desc} 
                  onChange={e => setOffer(o => ({ ...o, desc: e.target.value }))} 
                  rows={3} 
                  placeholder="Describe offer benefits, terms, and dates..."
                  className="w-full bg-sol-lt/30 border border-sol-sl/30 focus:border-sol-teal focus:bg-white rounded-xl px-4 py-2.5 text-xs text-sol-navy font-semibold focus:outline-none transition-all shadow-inner resize-none"
                />
              </div>
              
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-black text-sol-navy flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Active Published Offers ({mockOffers.length})
                </div>
                <div className="space-y-2">
                  {mockOffers.map(o => (
                    <div key={o.id} className="flex items-center justify-between py-2 border-b border-sol-sl/10 last:border-0">
                      <div className="text-[11px] text-sol-navy font-semibold truncate max-w-[250px]">{o.title}</div>
                      <Badge className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[8px] py-0.25">
                        Active
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Payouts */}
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>
                <IndianRupee className="w-4.5 h-4.5 text-sol-navy" /> Pending Payouts
              </CardTitle>
              <Button variant="outline" size="sm" className="rounded-xl flex items-center gap-1 text-[10px] py-1.5 text-sol-gray">
                <Check className="w-3.5 h-3.5" /> Process All
              </Button>
            </CardHeader>
            <CardBody className="p-0 flex-1 overflow-y-auto max-h-[460px]">
              <div className="divide-y divide-sol-sl/20">
                {pendingPayouts.map(a => (
                  <div key={a.id} className="flex items-center justify-between px-5 py-4 hover:bg-sol-lt/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-sol-lt/60 border border-sol-sl/20 flex items-center justify-center text-sol-teal font-extrabold text-xs flex-shrink-0">
                        {a.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-sol-navy">{a.name}</div>
                        <div className="text-[10px] text-sol-gray font-semibold">{a.region}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-sol-navy tracking-tight">{fmt(a.commissionPending)}</span>
                      <Button variant="primary" size="sm" className="rounded-xl text-[9px] py-1 px-3.5">
                        Pay
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

