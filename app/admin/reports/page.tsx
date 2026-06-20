"use client";
import { Topbar } from "@/components/shared/Topbar";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { fmt } from "@/lib/utils";
import { useSupabase } from "@/hooks/useSupabase";
import { getAssociates, getCustomers, getQuotes } from "@/lib/db";
import { Associate, Customer, Quote } from "@/lib/supabase";
import { TrendingUp, Users, Sun, IndianRupee, MapPin, Loader2 } from "lucide-react";

const REGIONS = ["Jaipur","Jodhpur","Ajmer","Kota","Bikaner"];

export default function AdminReports() {
  const { data: assocData, loading: aLoad } = useSupabase<Associate[]>(getAssociates);
  const { data: custData,  loading: cLoad } = useSupabase<Customer[]>(getCustomers);
  const { data: quoteData, loading: qLoad } = useSupabase<Quote[]>(getQuotes);

  const loading    = aLoad || cLoad || qLoad;
  const associates = assocData ?? [];
  const customers  = custData  ?? [];
  const quotes     = quoteData ?? [];

  const totalRevenue     = associates.reduce((s, a) => s + (a.revenue ?? 0), 0);
  const totalKwp         = customers.reduce((s, c) => s + (c.system_kwp ?? 0), 0);
  const totalCommission  = associates.reduce((s, a) => s + (a.commission_earned ?? 0), 0);
  const completedProjects = customers.filter(c => c.status === "completed").length;

  const regionData = REGIONS.map(region => ({
    region,
    associates: associates.filter(a => a.region === region).length,
    customers:  customers.filter(c => c.city === region).length,
    revenue:    associates.filter(a => a.region === region).reduce((s, a) => s + (a.revenue ?? 0), 0),
  })).filter(r => r.associates > 0 || r.customers > 0);

  const topAssociates = [...associates]
    .sort((a, b) => (b.revenue ?? 0) - (a.revenue ?? 0))
    .slice(0, 5);

  return (
    <div className="gradient-bg min-h-screen pb-12">
      <Topbar title="Reports & Analytics" subtitle="Live data from Supabase" />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-sol-teal" /></div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Revenue"      value={fmt(totalRevenue)}    icon={<IndianRupee className="w-5 h-5" />} accent="navy" trend="up"/>
              <StatCard label="Total Associates"   value={associates.length}    icon={<Users className="w-5 h-5" />}       accent="teal" trend="up"/>
              <StatCard label="Total kWp Sold"     value={`${totalKwp} kWp`}   icon={<Sun className="w-5 h-5" />}         accent="gold" trend="up"/>
              <StatCard label="Commission Paid"    value={fmt(totalCommission)} icon={<TrendingUp className="w-5 h-5" />}  accent="navy" trend="up"/>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Region wise */}
              <Card>
                <CardHeader>
                  <CardTitle><MapPin className="w-4.5 h-4.5 text-sol-teal" /> Region-wise Summary</CardTitle>
                </CardHeader>
                <CardBody>
                  {regionData.length === 0 && <p className="text-xs text-sol-gray text-center py-4">No data yet</p>}
                  <div className="space-y-4">
                    {regionData.map(r => {
                      const maxRev = Math.max(...regionData.map(x => x.revenue), 1);
                      return (
                        <div key={r.region}>
                          <div className="flex justify-between text-xs font-bold mb-1.5">
                            <span className="text-sol-navy">{r.region}</span>
                            <span className="text-sol-teal">{fmt(r.revenue)}</span>
                          </div>
                          <div className="h-2.5 bg-sol-lt rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-gradient-to-r from-sol-teal to-sol-navy rounded-full"
                              style={{ width: `${(r.revenue / maxRev) * 100}%` }} />
                          </div>
                          <div className="flex gap-4 mt-1">
                            <span className="text-[10px] text-sol-gray">{r.associates} associates</span>
                            <span className="text-[10px] text-sol-gray">{r.customers} customers</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>

              {/* Top associates */}
              <Card>
                <CardHeader>
                  <CardTitle><TrendingUp className="w-4.5 h-4.5 text-sol-teal" /> Top Associates</CardTitle>
                </CardHeader>
                <CardBody className="p-0">
                  {topAssociates.length === 0 && <p className="text-xs text-sol-gray text-center py-6">No associates yet</p>}
                  <div className="divide-y divide-sol-sl/20">
                    {topAssociates.map((a, i) => (
                      <div key={a.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-sol-lt/20 transition-colors">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0
                          ${i === 0 ? "bg-sol-gold text-white" : i === 1 ? "bg-sol-gray/30 text-sol-navy" : "bg-sol-lt text-sol-gray"}`}>
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-bold text-sol-navy">{a.name}</div>
                          <div className="text-[10px] text-sol-gray">{a.region} · {a.customers} customers</div>
                        </div>
                        <div className="text-xs font-black text-emerald-600">{fmt(a.revenue)}</div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Summary table */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle><Users className="w-4.5 h-4.5 text-sol-navy" /> All Associates Summary</CardTitle>
                <Badge className="bg-sol-lt text-sol-teal border border-sol-teal/20">{associates.length} total</Badge>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-sol-lt/50 border-b border-sol-sl/30">
                      {["#","Associate","Region","Customers","kWp Sold","Revenue","Commission","KYC"].map(h => (
                        <th key={h} className="px-4 py-3 text-[10px] uppercase tracking-wider text-sol-gray font-bold whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sol-sl/20">
                    {associates.map((a, i) => (
                      <tr key={a.id} className="hover:bg-sol-teal/5 transition-colors">
                        <td className="px-4 py-3 text-xs text-sol-gray font-bold">{i + 1}</td>
                        <td className="px-4 py-3">
                          <div className="text-xs font-bold text-sol-navy">{a.name}</div>
                          <div className="text-[9px] text-sol-gray font-mono">{a.email}</div>
                        </td>
                        <td className="px-4 py-3 text-xs text-sol-gray">{a.region}</td>
                        <td className="px-4 py-3 text-xs font-bold text-sol-navy">{a.customers}</td>
                        <td className="px-4 py-3 text-xs font-bold text-sol-navy">{a.kwp_sold}</td>
                        <td className="px-4 py-3 text-xs font-black text-emerald-600">{fmt(a.revenue)}</td>
                        <td className="px-4 py-3 text-xs font-bold text-sol-navy">{fmt(a.commission_earned)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[9px] font-bold px-2 py-1 rounded-full
                            ${a.kyc === "approved" ? "bg-emerald-100 text-emerald-700"
                            : a.kyc === "rejected" ? "bg-red-100 text-red-600"
                            : "bg-amber-100 text-amber-700"}`}>
                            {a.kyc}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {associates.length === 0 && (
                      <tr><td colSpan={8} className="px-4 py-10 text-center text-xs text-sol-gray">No data yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
