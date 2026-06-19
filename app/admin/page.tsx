"use client";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/shared/Topbar";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockAssociates, mockCustomers, mockQuotes, mockRegionRevenue } from "@/lib/mock-data";
import { fmt, fmtDate, KYC_CONFIG } from "@/lib/utils";
import { 
  Users, 
  Home, 
  IndianRupee, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  Sun, 
  CheckCircle2, 
  Plus, 
  FileText, 
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Activity
} from "lucide-react";

const activity = [
  { color: "bg-sol-teal",  text: "New associate <b>Ramesh Kumar</b> registered · Jaipur",    time: "2 hrs ago" },
  { color: "bg-sol-gold",  text: "5 kWp project completed · Suresh Agarwal, Ajmer",          time: "4 hrs ago" },
  { color: "bg-blue-500",  text: "Commission ₹3,800 processed for <b>Mohan Verma</b>",       time: "Yesterday" },
  { color: "bg-purple-500",text: "New customer added — <b>Kavita Meena</b>, 3 kWp, Kota",   time: "Yesterday" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const pendingKYC = mockAssociates.filter(a => a.kyc === "pending").length;
  const totalRevenue = mockAssociates.reduce((s, a) => s + a.revenue, 0);
  const maxRevenue = Math.max(...mockRegionRevenue.map(r => r.revenue));

  return (
    <div className="gradient-bg min-h-screen pb-12">
      <Topbar 
        title="Admin Dashboard" 
        subtitle="Solvanta Solar Energy · June 2025"
        actions={
          <Button variant="primary" size="sm" onClick={() => router.push("/admin/quotes")} className="rounded-xl">
            <Plus className="w-4 h-4" /> New Quote
          </Button>
        }
      />
      
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Pending KYC Alert Banner */}
        {pendingKYC > 0 && (
          <div className="bg-gradient-to-r from-amber-500/10 via-sol-gold/15 to-sol-teal/10 border border-sol-gold/30 rounded-2xl p-5 flex items-start gap-4 shadow-sm backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-sol-gold/20 flex items-center justify-center flex-shrink-0 shadow-md">
              <AlertTriangle className="w-6 h-6 text-amber-600 animate-bounce" />
            </div>
            <div className="flex-1">
              <div className="font-extrabold text-sol-navy text-sm tracking-tight">{pendingKYC} Associate KYC Approvals Pending</div>
              <div className="text-xs text-sol-navy/70 mt-1 leading-relaxed">There are {pendingKYC} associates waiting for KYC verification. 2 commission payouts are also due today.</div>
            </div>
            <Button variant="gold" size="sm" onClick={() => router.push("/admin/associates")} className="rounded-xl flex-shrink-0">
              Review Now <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Associates" value={mockAssociates.length} sub="+4 this month" icon={<Users className="w-5 h-5" />} accent="teal" trend="up"/>
          <StatCard label="Total Customers" value={mockCustomers.length} sub="+18 this month" icon={<Home className="w-5 h-5" />} accent="gold" trend="up"/>
          <StatCard label="Total Revenue" value={fmt(totalRevenue)} sub="+12% vs last" icon={<IndianRupee className="w-5 h-5" />} accent="navy" trend="up"/>
          <StatCard label="Pending KYC" value={pendingKYC} sub="Needs review" icon={<ShieldAlert className="w-5 h-5" />} accent="red" trend={pendingKYC > 0 ? "up" : "down"}/>
        </div>

        {/* Region & Activity Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <MapPin className="w-4.5 h-4.5 text-sol-teal" /> Region-wise Revenue
              </CardTitle>
              <Badge className="bg-sol-lt text-sol-teal border border-sol-teal/20">June 2025</Badge>
            </CardHeader>
            <CardBody className="space-y-4">
              {mockRegionRevenue.map(r => (
                <div key={r.region} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-sol-navy">{r.region}</span>
                    <span className="text-sol-teal">{fmt(r.revenue)}</span>
                  </div>
                  <div className="h-2.5 bg-sol-lt rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-sol-teal to-sol-navy rounded-full transition-all duration-500" 
                      style={{ width: `${(r.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Clock className="w-4.5 h-4.5 text-sol-navy" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardBody className="p-0">
              <div className="relative border-l border-sol-sl/30 ml-6 my-4 space-y-6">
                {activity.map((a, i) => (
                  <div key={i} className="relative pl-6">
                    <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-white ring-2 ring-sol-sl/20 ${a.color}`} />
                    <div>
                      <div className="text-xs text-sol-navy/80 leading-relaxed font-semibold" dangerouslySetInnerHTML={{ __html: a.text }} />
                      <div className="text-[10px] text-sol-gray font-bold uppercase mt-1">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Analytics & Quotes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <Sun className="w-4.5 h-4.5 text-sol-gold" /> kWp Installed
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-sol-navy">This Month</span>
                  <span className="text-sol-teal">186 kWp</span>
                </div>
                <div className="h-2 bg-sol-lt rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-sol-teal to-teal-400 rounded-full" style={{ width: "74%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-sol-navy">Total Capacity</span>
                  <span className="text-sol-navy">2,840 kWp</span>
                </div>
                <div className="h-2 bg-sol-lt rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-sol-navy to-sol-gray rounded-full" style={{ width: "57%" }} />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <IndianRupee className="w-4.5 h-4.5 text-sol-teal" /> Commission
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="flex items-center gap-3.5 bg-emerald-500/10 border border-emerald-500/10 rounded-2xl p-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-black text-emerald-700 tracking-tight">₹3.8L</div>
                  <div className="text-[10px] text-sol-gray font-bold uppercase tracking-wider mt-0.5">Paid this month</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3.5 bg-amber-500/10 border border-amber-500/10 rounded-2xl p-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-600 flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-black text-amber-700 tracking-tight">₹1.2L</div>
                  <div className="text-[10px] text-sol-gray font-bold uppercase tracking-wider mt-0.5">Pending payout</div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <FileText className="w-4.5 h-4.5 text-sol-navy" /> Recent Quotes
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => router.push("/admin/quotes")} className="rounded-xl text-[10px] py-1">
                View All
              </Button>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-sol-sl/20 max-h-[160px] overflow-y-auto">
                {mockQuotes.map(q => (
                  <div key={q.id} className="px-5 py-3 hover:bg-sol-lt/20 transition-colors flex justify-between items-center">
                    <div>
                      <div className="text-xs font-bold text-sol-navy">{q.customerName}</div>
                      <div className="text-[9px] text-sol-gray font-semibold mt-0.5">{q.kwp} kWp · {fmtDate(q.createdAt)}</div>
                    </div>
                    <div className="text-xs font-black text-sol-teal">{fmt(q.netAmount)}</div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Associates Overview */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>
              <Users className="w-4.5 h-4.5 text-sol-navy" /> Associates Overview
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => router.push("/admin/associates")} className="rounded-xl">
              View All
            </Button>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-sol-lt/50 border-b border-sol-sl/30">
                  {["Associate", "Region", "Customers", "Revenue", "KYC Status"].map(h => (
                    <th key={h} className="px-5 py-3 text-[10px] uppercase tracking-wider text-sol-gray font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-sol-sl/20">
                {mockAssociates.slice(0, 5).map(a => {
                  const kyc = KYC_CONFIG[a.kyc];
                  return (
                    <tr key={a.id} className="hover:bg-sol-teal/5 transition-colors">
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
                        <Badge className={`${kyc.bg} ${kyc.color} text-[9px] border border-current/15`}>
                          {kyc.label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

