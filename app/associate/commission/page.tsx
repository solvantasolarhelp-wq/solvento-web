"use client";
import { Topbar } from "@/components/shared/Topbar";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mockCommissionSlabs } from "@/lib/mock-data";
import { fmt, TIER_CONFIG } from "@/lib/utils";
import { 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  Layers, 
  History,
  TrendingUp,
  Award
} from "lucide-react";

const history = [
  { cust: "Ramesh Patel", kwp: 10, base: 10000, bonus: 5000, total: 15000, status: "processing" },
  { cust: "Hari Singh", kwp: 7, base: 10000, bonus: 0, total: 12000, status: "processing" },
  { cust: "Suresh Agarwal", kwp: 5, base: 10000, bonus: 2000, total: 12000, status: "paid" },
  { cust: "Geeta Devi", kwp: 3, base: 8000, bonus: 0, total: 8000, status: "paid" },
];

export default function AssocCommission() {
  return (
    <div className="gradient-bg min-h-screen pb-12">
      <Topbar title="My Commission" subtitle="Earning history and payout status" />
      
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Earned This Month" value="₹47,000" sub="+₹12K vs May" icon={<IndianRupee className="w-5 h-5" />} accent="teal" trend="up" />
          <StatCard label="Paid This Month" value="₹23,000" sub="2 payouts done" icon={<CheckCircle2 className="w-5 h-5" />} accent="navy" trend="up" />
          <StatCard label="Pending Payout" value="₹24,000" sub="Expected by 25 June" icon={<Clock className="w-5 h-5" />} accent="red" />
        </div>

        {/* Slabs */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Layers className="w-4.5 h-4.5 text-sol-teal" /> Commission Slabs (Admin Set)
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockCommissionSlabs.map(s => {
                const t = TIER_CONFIG[s.tier];
                const isMe = s.tier === "silver";
                return (
                  <div key={s.tier} className={`rounded-2xl border-2 p-5 text-center transition-all duration-300 ${isMe ? `${t.border} ${t.bg} shadow-md` : "border-sol-sl/40 bg-white/40 hover:border-sol-teal/30 hover:bg-white/80"}`}>
                    <div className="text-3xl mb-2 flex justify-center">{t.emoji}</div>
                    <div className={`text-xs font-extrabold tracking-wide uppercase mb-1 ${t.color}`}>
                      {t.label} {isMe && <span className="text-[9px] bg-white border px-1.5 py-0.5 rounded-full inline-block">YOU</span>}
                    </div>
                    <div className="text-[10px] text-sol-gray font-semibold mb-3 tracking-wide uppercase">{s.salesRange}</div>
                    <div className={`text-2xl font-black ${t.color} tracking-tight`}>{fmt(s.amount)}</div>
                    <div className="text-[10px] text-sol-gray font-bold uppercase mt-1">per installation</div>
                    {s.targetBonus > 0 && <div className="text-[10px] text-emerald-600 font-extrabold mt-3 bg-emerald-500/10 px-2 py-1 rounded-lg">+{fmt(s.targetBonus)} target bonus</div>}
                    {s.annualBonus > 0 && <div className="text-[10px] text-blue-600 font-extrabold mt-3 bg-blue-500/10 px-2 py-1 rounded-lg">+{fmt(s.annualBonus)}/yr</div>}
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* History */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>
              <History className="w-4.5 h-4.5 text-sol-navy" /> Payout History
            </CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-sol-lt/50 border-b border-sol-sl/30">
                  {["Customer", "kWp Size", "Base Commission", "Bonus Incentive", "Total Earnings", "Status"].map(h => (
                    <th key={h} className="px-5 py-3 text-[10px] uppercase tracking-wider text-sol-gray font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-sol-sl/20">
                {history.map((h, i) => (
                  <tr key={i} className="hover:bg-sol-teal/5 transition-colors">
                    <td className="px-5 py-4 text-xs font-bold text-sol-navy">{h.cust}</td>
                    <td className="px-5 py-4 text-xs font-semibold text-sol-navy/80">{h.kwp} kWp</td>
                    <td className="px-5 py-4 text-xs font-medium text-sol-gray">{fmt(h.base)}</td>
                    <td className="px-5 py-4 text-xs font-extrabold text-emerald-600">{h.bonus ? "+" + fmt(h.bonus) : "—"}</td>
                    <td className="px-5 py-4 text-xs font-black text-sol-navy">{fmt(h.total)}</td>
                    <td className="px-5 py-4">
                      <Badge className={h.status === "paid" ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20" : "bg-amber-500/10 text-amber-700 border border-amber-500/20"}>
                        {h.status === "paid" ? "✓ Paid" : "⏳ Processing"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
