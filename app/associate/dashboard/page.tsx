"use client";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/shared/Topbar";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockAssociates, mockCustomers, mockOffers } from "@/lib/mock-data";
import { fmt, STATUS_CONFIG, TIER_CONFIG } from "@/lib/utils";
import { 
  Users, 
  Sun, 
  IndianRupee, 
  Clock, 
  Trophy, 
  Target, 
  Award, 
  TrendingUp, 
  ChevronRight,
  UserCheck,
  Percent
} from "lucide-react";

export default function AssocDashboard() {
  const router = useRouter();
  const me = mockAssociates[2]; // Mohan Verma
  const myCusts = mockCustomers.filter(c=>c.associateId===me.id);
  const tier = TIER_CONFIG[me.tier];
  const salesDone = 7; const salesTarget = 10;
  const kwpDone = 38; const kwpTarget = 50;

  return (
    <div className="gradient-bg min-h-screen pb-12">
      <Topbar title={`Welcome, ${me.name.split(" ")[0]}! 👋`} subtitle="June 2025 · Ajmer Region"
        actions={<Button variant="primary" size="sm" onClick={()=>router.push("/associate/customers")}>+ Add Customer</Button>}/>
      
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Offer Banner */}
        <div className="bg-gradient-to-r from-amber-500/10 via-sol-gold/15 to-sol-teal/10 border border-sol-gold/30 rounded-2xl p-5 flex items-start gap-4 shadow-sm backdrop-blur-md">
          <div className="w-12 h-12 rounded-xl bg-sol-gold/20 flex items-center justify-center flex-shrink-0 shadow-md">
            <Trophy className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <div className="font-extrabold text-sol-navy text-sm tracking-tight">{mockOffers[0].title}</div>
            <div className="text-xs text-sol-navy/70 mt-1 leading-relaxed">{mockOffers[0].description.slice(0,120)}...</div>
          </div>
          <Button variant="gold" size="sm" onClick={()=>router.push("/associate/offers")} className="rounded-xl">
            View Details <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="My Customers" value={me.customers} sub="+2 this month" icon={<Users className="w-5 h-5" />} accent="teal" trend="up"/>
          <StatCard label="kWp Sold" value={me.kwpSold} sub="+8 kWp" icon={<Sun className="w-5 h-5" />} accent="gold" trend="up"/>
          <StatCard label="Commission (Month)" value={fmt(me.commissionEarned)} sub="Lifetime" icon={<IndianRupee className="w-5 h-5" />} accent="navy" trend="up"/>
          <StatCard label="Pending Payout" value={fmt(me.commissionPending)} sub="Processing" icon={<Clock className="w-5 h-5" />} accent="red"/>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Target Progress */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Target className="w-4 h-4 text-sol-teal animate-pulse" /> June Target Progress
                </CardTitle>
                <Badge className="bg-amber-50 text-amber-700 border border-sol-gold/20">8 days left</Badge>
              </CardHeader>
              <CardBody className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-sol-navy">Monthly Sales Target</span>
                    <span className="text-sol-teal">{salesDone} / {salesTarget} installations</span>
                  </div>
                  <div className="h-3 bg-sol-lt rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-sol-teal to-teal-400 rounded-full transition-all duration-500 shadow-md shadow-sol-teal/20" style={{width:`${(salesDone/salesTarget)*100}%`}}/>
                  </div>
                  <p className="text-[10px] text-sol-gray font-semibold mt-2">Just {salesTarget-salesDone} more installations to hit your target & unlock your cash bonus!</p>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-sol-navy">kWp Target</span>
                    <span className="text-amber-600">{kwpDone} / {kwpTarget} kWp</span>
                  </div>
                  <div className="h-3 bg-sol-lt rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-sol-gold to-yellow-400 rounded-full transition-all duration-500 shadow-md shadow-sol-gold/20" style={{width:`${(kwpDone/kwpTarget)*100}%`}}/>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 bg-sol-lt/50 border border-sol-sl/40 rounded-xl p-3.5">
                  {[["₹10,000","Base/sale"],["₹5,000","Target Bonus"],["₹15,000","Max/sale"]].map(([v,l]) => (
                    <div key={l} className="text-center">
                      <div className="text-xs font-extrabold text-sol-navy">{v}</div>
                      <div className="text-[9px] text-sol-gray font-bold uppercase tracking-wider mt-0.5">{l}</div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Tier */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <Award className="w-4 h-4 text-sol-gold" /> My Tier Status
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className={`flex-1 text-center rounded-2xl p-4 border-2 shadow-sm ${tier.border} ${tier.bg}`}>
                    <div className="text-[10px] text-sol-gray font-bold uppercase tracking-wider mb-1.5">Current</div>
                    <div className={`font-black text-lg ${tier.color} tracking-tight`}>{tier.emoji} {tier.label}</div>
                    <div className={`text-xs font-bold mt-1.5 px-3 py-1 bg-white/70 rounded-full inline-block border border-white/50 ${tier.color}`}>₹10,000 / sale</div>
                  </div>
                  <div className="flex-1 text-center rounded-2xl p-4 border-2 border-sol-gold bg-amber-50/50 shadow-sm">
                    <div className="text-[10px] text-sol-gray font-bold uppercase tracking-wider mb-1.5">Next Level</div>
                    <div className="font-black text-lg text-amber-700 tracking-tight">👑 Gold Tier</div>
                    <div className="text-xs font-semibold text-amber-600 mt-1">3 more sales needed to unlock</div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Recent customers & commission */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Users className="w-4 h-4 text-sol-navy" /> Recent Customers
                </CardTitle>
                <Button variant="outline" size="sm" onClick={()=>router.push("/associate/customers")} className="rounded-xl">
                  View All
                </Button>
              </CardHeader>
              <CardBody className="p-0 max-h-[300px] overflow-y-auto">
                {myCusts.map(c => {
                  const st = STATUS_CONFIG[c.status];
                  return (
                    <div key={c.id} className="flex items-center justify-between px-5 py-3.5 border-b border-sol-sl/30 last:border-0 hover:bg-sol-lt/10 transition-colors">
                      <div>
                        <div className="text-xs font-bold text-sol-navy">{c.name}</div>
                        <div className="text-[10px] text-sol-gray font-semibold mt-1">{c.systemKwp} kWp · {c.city}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`${st.bg} ${st.color} px-2 py-0.5 border border-current/15`}>{st.label}</Badge>
                        <span className="text-[10px] text-sol-gray font-semibold">{c.docsUploaded}/{c.docsRequired} docs</span>
                      </div>
                    </div>
                  );
                })}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <Percent className="w-4 h-4 text-sol-navy" /> Commission Summary
                </CardTitle>
              </CardHeader>
              <CardBody className="space-y-3">
                {[["₹47,000","Earned this month","bg-sol-lt/70","text-sol-navy"],["₹23,000","Paid","bg-emerald-500/10 border-emerald-500/10","text-emerald-700"],["₹24,000","Pending","bg-amber-500/10 border-amber-500/10","text-amber-700"]].map(([v,l,bg,tc]) => (
                  <div key={l} className={`flex items-center justify-between ${bg} border border-sol-sl/10 rounded-2xl px-5 py-3.5 shadow-sm`}>
                    <span className="text-xs text-sol-navy/70 font-semibold">{l}</span>
                    <span className={`text-base font-extrabold ${tc} tracking-tight`}>{v}</span>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
