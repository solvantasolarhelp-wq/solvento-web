"use client";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/shared/Topbar";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fmt, STATUS_CONFIG, TIER_CONFIG } from "@/lib/utils";
import { useSupabase } from "@/hooks/useSupabase";
import { getAssociate, getCustomers, getOffers } from "@/lib/db";
import { Associate, Customer, Offer } from "@/lib/supabase";
import { Users, Sun, IndianRupee, Clock, Trophy, Target, Award, ChevronRight, Percent, Loader2 } from "lucide-react";

// For now using mock associate ID — swap with getSession() when auth is wired
const MY_ID = "SOL-2025-003";

export default function AssocDashboard() {
  const router = useRouter();
  const { data: me,      loading: aLoad } = useSupabase<Associate | null>(() => getAssociate(MY_ID));
  const { data: custData,loading: cLoad } = useSupabase<Customer[]>(() => getCustomers(MY_ID));
  const { data: offerData } = useSupabase<Offer[]>(getOffers);

  const loading = aLoad || cLoad;
  const myCusts = custData  ?? [];
  const offers  = offerData ?? [];

  if (loading) return (
    <div className="gradient-bg min-h-screen flex items-center justify-center">
      <Loader2 className="w-7 h-7 animate-spin text-sol-teal" />
    </div>
  );

  if (!me) return (
    <div className="gradient-bg min-h-screen flex items-center justify-center">
      <p className="text-sol-gray text-sm">Associate not found.</p>
    </div>
  );

  const tier = TIER_CONFIG[me.tier];
  const salesDone = myCusts.filter(c => c.status === "completed").length;
  const salesTarget = 10;
  const kwpDone = myCusts.reduce((s, c) => s + (c.system_kwp ?? 0), 0);
  const kwpTarget = 50;

  const tierLevels: Array<Associate["tier"]> = ["starter","silver","gold","platinum"];
  const nextTierKey = tierLevels[tierLevels.indexOf(me.tier) + 1] ?? null;
  const nextTier = nextTierKey ? TIER_CONFIG[nextTierKey] : null;

  return (
    <div className="gradient-bg min-h-screen pb-12">
      <Topbar
        title={`Welcome, ${me.name.split(" ")[0]}! 👋`}
        subtitle={`${me.region} Region · ${me.tier.charAt(0).toUpperCase() + me.tier.slice(1)} Tier`}
        actions={<Button variant="primary" size="sm" onClick={() => router.push("/associate/customers")}>+ Add Customer</Button>}
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Offer Banner */}
        {offers[0] && (
          <div className="bg-gradient-to-r from-amber-500/10 via-sol-gold/15 to-sol-teal/10 border border-sol-gold/30 rounded-2xl p-5 flex items-start gap-4 shadow-sm backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-sol-gold/20 flex items-center justify-center flex-shrink-0 shadow-md">
              <Trophy className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <div className="font-extrabold text-sol-navy text-sm tracking-tight">{offers[0].title}</div>
              <div className="text-xs text-sol-navy/70 mt-1 leading-relaxed">{offers[0].description.slice(0, 120)}...</div>
            </div>
            <Button variant="gold" size="sm" onClick={() => router.push("/associate/offers")} className="rounded-xl">
              View Details <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="My Customers"       value={me.customers}              sub={`${salesDone} completed`}  icon={<Users className="w-5 h-5" />}       accent="teal" trend="up"/>
          <StatCard label="kWp Sold"           value={me.kwp_sold}               sub="Total capacity"            icon={<Sun className="w-5 h-5" />}          accent="gold" trend="up"/>
          <StatCard label="Commission Earned"  value={fmt(me.commission_earned)} sub="Lifetime"                  icon={<IndianRupee className="w-5 h-5" />} accent="navy" trend="up"/>
          <StatCard label="Pending Payout"     value={fmt(me.commission_pending)} sub="Processing"              icon={<Clock className="w-5 h-5" />}         accent="red"/>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Target Progress */}
            <Card>
              <CardHeader>
                <CardTitle><Target className="w-4 h-4 text-sol-teal animate-pulse" /> Monthly Target Progress</CardTitle>
              </CardHeader>
              <CardBody className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-sol-navy">Sales Target</span>
                    <span className="text-sol-teal">{salesDone} / {salesTarget} installations</span>
                  </div>
                  <div className="h-3 bg-sol-lt rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-sol-teal to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((salesDone / salesTarget) * 100, 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-sol-gray font-semibold mt-2">
                    {salesTarget - salesDone > 0 ? `${salesTarget - salesDone} more installations to hit your target!` : "🎉 Target achieved!"}
                  </p>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-sol-navy">kWp Target</span>
                    <span className="text-amber-600">{kwpDone} / {kwpTarget} kWp</span>
                  </div>
                  <div className="h-3 bg-sol-lt rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-sol-gold to-yellow-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((kwpDone / kwpTarget) * 100, 100)}%` }} />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Tier */}
            <Card>
              <CardHeader><CardTitle><Award className="w-4 h-4 text-sol-gold" /> My Tier Status</CardTitle></CardHeader>
              <CardBody>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className={`flex-1 text-center rounded-2xl p-4 border-2 shadow-sm ${tier.border} ${tier.bg}`}>
                    <div className="text-[10px] text-sol-gray font-bold uppercase tracking-wider mb-1.5">Current</div>
                    <div className={`font-black text-lg ${tier.color} tracking-tight`}>{tier.emoji} {tier.label}</div>
                  </div>
                  {nextTier && (
                    <div className="flex-1 text-center rounded-2xl p-4 border-2 border-sol-gold bg-amber-50/50 shadow-sm">
                      <div className="text-[10px] text-sol-gray font-bold uppercase tracking-wider mb-1.5">Next Level</div>
                      <div className="font-black text-lg text-amber-700 tracking-tight">{nextTier.emoji} {nextTier.label}</div>
                      <div className="text-xs font-semibold text-amber-600 mt-1">Keep selling to unlock!</div>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Recent Customers */}
            <Card>
              <CardHeader>
                <CardTitle><Users className="w-4 h-4 text-sol-navy" /> Recent Customers</CardTitle>
                <Button variant="outline" size="sm" onClick={() => router.push("/associate/customers")} className="rounded-xl">View All</Button>
              </CardHeader>
              <CardBody className="p-0 max-h-[300px] overflow-y-auto">
                {myCusts.length === 0 && <p className="text-xs text-sol-gray text-center py-6">No customers yet. Add your first!</p>}
                {myCusts.map(c => {
                  const st = STATUS_CONFIG[c.status];
                  return (
                    <div key={c.id} className="flex items-center justify-between px-5 py-3.5 border-b border-sol-sl/30 last:border-0 hover:bg-sol-lt/10 transition-colors">
                      <div>
                        <div className="text-xs font-bold text-sol-navy">{c.name}</div>
                        <div className="text-[10px] text-sol-gray font-semibold mt-1">{c.system_kwp} kWp · {c.city}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`${st.bg} ${st.color} px-2 py-0.5 border border-current/15`}>{st.label}</Badge>
                        <span className="text-[10px] text-sol-gray font-semibold">{c.docs_uploaded}/{c.docs_required} docs</span>
                      </div>
                    </div>
                  );
                })}
              </CardBody>
            </Card>

            {/* Commission Summary */}
            <Card>
              <CardHeader><CardTitle><Percent className="w-4 h-4 text-sol-navy" /> Commission Summary</CardTitle></CardHeader>
              <CardBody className="space-y-3">
                {[
                  [fmt(me.commission_earned), "Total Earned",  "bg-sol-lt/70 border-sol-sl/10",            "text-sol-navy"],
                  [fmt(me.commission_earned - me.commission_pending), "Paid", "bg-emerald-500/10 border-emerald-500/10", "text-emerald-700"],
                  [fmt(me.commission_pending), "Pending",      "bg-amber-500/10 border-amber-500/10",      "text-amber-700"],
                ].map(([v, l, bg, tc]) => (
                  <div key={l} className={`flex items-center justify-between ${bg} border rounded-2xl px-5 py-3.5 shadow-sm`}>
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
