"use client";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/shared/Topbar";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fmt, fmtDate, KYC_CONFIG } from "@/lib/utils";
import { useSupabase } from "@/hooks/useSupabase";
import { getAssociates, getCustomers, getQuotes } from "@/lib/db";
import { Associate, Customer, Quote } from "@/lib/supabase";
import {
  Users, Home, IndianRupee, ShieldAlert, MapPin, Clock,
  Sun, CheckCircle2, Plus, FileText, AlertTriangle, ChevronRight, Loader2
} from "lucide-react";

const REGIONS = ["Jaipur","Jodhpur","Ajmer","Kota","Bikaner"];

export default function AdminDashboard() {
  const router = useRouter();
  const { data: associates, loading: aLoad } = useSupabase<Associate[]>(getAssociates);
  const { data: customers,  loading: cLoad } = useSupabase<Customer[]>(getCustomers);
  const { data: quotes,     loading: qLoad } = useSupabase<Quote[]>(getQuotes);

  const loading = aLoad || cLoad || qLoad;
  const assocs = associates ?? [];
  const custs  = customers  ?? [];
  const qs     = quotes     ?? [];

  const pendingKYC   = assocs.filter(a => a.kyc === "pending").length;
  const totalRevenue = assocs.reduce((s, a) => s + (a.revenue ?? 0), 0);

  // Region revenue from associates
  const regionRevenue = REGIONS.map(region => ({
    region,
    revenue: assocs.filter(a => a.region === region).reduce((s, a) => s + (a.revenue ?? 0), 0),
  })).filter(r => r.revenue > 0);
  const maxRevenue = Math.max(...regionRevenue.map(r => r.revenue), 1);

  return (
    <div className="gradient-bg min-h-screen pb-12">
      <Topbar
        title="Admin Dashboard"
        subtitle="Solvanta Solar Energy"
        actions={
          <Button variant="primary" size="sm" onClick={() => router.push("/admin/quotes")} className="rounded-xl">
            <Plus className="w-4 h-4" /> New Quote
          </Button>
        }
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {loading && (
          <div className="flex items-center justify-center py-12 gap-3 text-sol-gray">
            <Loader2 className="w-5 h-5 animate-spin text-sol-teal" />
            <span className="text-sm font-semibold">Loading live data...</span>
          </div>
        )}

        {!loading && (
          <>
            {/* Pending KYC Alert */}
            {pendingKYC > 0 && (
              <div className="bg-gradient-to-r from-amber-500/10 via-sol-gold/15 to-sol-teal/10 border border-sol-gold/30 rounded-2xl p-5 flex items-start gap-4 shadow-sm backdrop-blur-md">
                <div className="w-12 h-12 rounded-xl bg-sol-gold/20 flex items-center justify-center flex-shrink-0 shadow-md">
                  <AlertTriangle className="w-6 h-6 text-amber-600 animate-bounce" />
                </div>
                <div className="flex-1">
                  <div className="font-extrabold text-sol-navy text-sm tracking-tight">{pendingKYC} Associate KYC Approvals Pending</div>
                  <div className="text-xs text-sol-navy/70 mt-1 leading-relaxed">There are {pendingKYC} associates waiting for KYC verification.</div>
                </div>
                <Button variant="gold" size="sm" onClick={() => router.push("/admin/associates")} className="rounded-xl flex-shrink-0">
                  Review Now <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Associates" value={assocs.length}   sub={`${pendingKYC} pending KYC`}  icon={<Users className="w-5 h-5" />}       accent="teal" trend="up"/>
              <StatCard label="Total Customers"  value={custs.length}    sub="All time"                      icon={<Home className="w-5 h-5" />}        accent="gold" trend="up"/>
              <StatCard label="Total Revenue"    value={fmt(totalRevenue)} sub="From associates"             icon={<IndianRupee className="w-5 h-5" />} accent="navy" trend="up"/>
              <StatCard label="Pending KYC"      value={pendingKYC}      sub="Needs review"                  icon={<ShieldAlert className="w-5 h-5" />} accent="red" trend={pendingKYC > 0 ? "up" : "down"}/>
            </div>

            {/* Region & Quotes */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle><MapPin className="w-4.5 h-4.5 text-sol-teal" /> Region-wise Revenue</CardTitle>
                </CardHeader>
                <CardBody className="space-y-4">
                  {regionRevenue.length === 0 && <p className="text-xs text-sol-gray text-center py-4">No revenue data yet</p>}
                  {regionRevenue.map(r => (
                    <div key={r.region} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-sol-navy">{r.region}</span>
                        <span className="text-sol-teal">{fmt(r.revenue)}</span>
                      </div>
                      <div className="h-2.5 bg-sol-lt rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-gradient-to-r from-sol-teal to-sol-navy rounded-full transition-all duration-500"
                          style={{ width: `${(r.revenue / maxRevenue) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle><FileText className="w-4.5 h-4.5 text-sol-navy" /> Recent Quotes</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => router.push("/admin/quotes")} className="rounded-xl text-[10px] py-1">View All</Button>
                </CardHeader>
                <CardBody className="p-0">
                  {qs.length === 0 && <p className="text-xs text-sol-gray text-center py-6">No quotes yet</p>}
                  <div className="divide-y divide-sol-sl/20 max-h-[200px] overflow-y-auto">
                    {qs.slice(0, 5).map(q => (
                      <div key={q.id} className="px-5 py-3 hover:bg-sol-lt/20 transition-colors flex justify-between items-center">
                        <div>
                          <div className="text-xs font-bold text-sol-navy">{q.customer_name}</div>
                          <div className="text-[9px] text-sol-gray font-semibold mt-0.5">{q.kwp} kWp · {fmtDate(q.created_at)}</div>
                        </div>
                        <div className="text-xs font-black text-sol-teal">{fmt(q.net_amount)}</div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Associates Table */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle><Users className="w-4.5 h-4.5 text-sol-navy" /> Associates Overview</CardTitle>
                <Button variant="outline" size="sm" onClick={() => router.push("/admin/associates")} className="rounded-xl">View All</Button>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-sol-lt/50 border-b border-sol-sl/30">
                      {["Associate","Region","Customers","Revenue","KYC Status"].map(h => (
                        <th key={h} className="px-5 py-3 text-[10px] uppercase tracking-wider text-sol-gray font-bold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sol-sl/20">
                    {assocs.slice(0, 5).map(a => {
                      const kyc = KYC_CONFIG[a.kyc];
                      return (
                        <tr key={a.id} className="hover:bg-sol-teal/5 transition-colors cursor-pointer" onClick={() => router.push(`/admin/associates/${a.id}`)}>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-sol-lt/60 border border-sol-sl/20 flex items-center justify-center text-sol-teal font-extrabold text-xs flex-shrink-0">
                                {a.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                              </div>
                              <div>
                                <div className="text-xs font-bold text-sol-navy">{a.name}</div>
                                <div className="text-[9px] text-sol-gray font-mono font-semibold">{a.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-xs font-semibold text-sol-navy/70">{a.region}</td>
                          <td className="px-5 py-4 text-xs font-extrabold text-sol-navy">{a.customers}</td>
                          <td className="px-5 py-4 text-xs font-black text-emerald-600">{fmt(a.revenue)}</td>
                          <td className="px-5 py-4">
                            <Badge className={`${kyc.bg} ${kyc.color} text-[9px] border border-current/15`}>{kyc.label}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                    {assocs.length === 0 && (
                      <tr><td colSpan={5} className="px-5 py-8 text-center text-xs text-sol-gray">No associates registered yet</td></tr>
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
