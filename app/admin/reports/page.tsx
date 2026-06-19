"use client";
import { Topbar } from "@/components/shared/Topbar";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockAssociates, mockRegionRevenue } from "@/lib/mock-data";
import { fmt, TIER_CONFIG } from "@/lib/utils";
import { 
  IndianRupee, 
  CheckCircle2, 
  Sun, 
  TrendingUp, 
  MapPin, 
  BarChart2, 
  Trophy, 
  Download, 
  Activity, 
  FileText,
  Users
} from "lucide-react";

export default function AdminReports() {
  const maxRegionRev = Math.max(...mockRegionRevenue.map(r => r.revenue));
  
  // Sort associates by revenue
  const sorted = [...mockAssociates]
    .filter(a => a.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue);

  const projectStatusList = [
    { label: "Completed", count: 198, pct: 64, color: "bg-emerald-500", icon: CheckCircle2, iconColor: "text-emerald-500" },
    { label: "In Progress", count: 87, pct: 28, color: "bg-blue-500", icon: Activity, iconColor: "text-blue-500" },
    { label: "Docs Pending", count: 27, pct: 8, color: "bg-amber-500", icon: FileText, iconColor: "text-amber-500" }
  ];

  return (
    <div className="gradient-bg min-h-screen pb-12">
      <Topbar 
        title="Reports & Analytics" 
        subtitle="Business performance overview — June 2025"
        actions={
          <Button variant="outline" size="sm" className="rounded-xl flex items-center gap-1.5 text-sol-gray">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </Button>
        }
      />
      
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Analytics Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Monthly Revenue" value="₹8.4L" sub="+12% vs last" accent="teal" trend="up" icon={<IndianRupee className="w-5 h-5" />} />
          <StatCard label="Projects Done" value="24" sub="+4 this month" accent="gold" trend="up" icon={<CheckCircle2 className="w-5 h-5" />} />
          <StatCard label="kWp Installed" value="186" sub="This month" accent="navy" icon={<Sun className="w-5 h-5" />} />
          <StatCard label="Commission Paid" value="₹3.8L" sub="32 payouts" accent="teal" trend="up" icon={<TrendingUp className="w-5 h-5" />} />
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <MapPin className="w-4.5 h-4.5 text-sol-teal" /> Region-wise Revenue
              </CardTitle>
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
                      style={{ width: `${(r.revenue / maxRegionRev) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <BarChart2 className="w-4.5 h-4.5 text-sol-navy" /> Project Status Distribution
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              {projectStatusList.map(item => {
                const StatusIcon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl bg-sol-lt/70 border border-sol-sl/20 flex items-center justify-center flex-shrink-0 ${item.iconColor}`}>
                      <StatusIcon className="w-4.5 h-4.5" />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-sol-navy">{item.label}</span>
                        <span className="text-sol-navy">{item.count} ({item.pct}%)</span>
                      </div>
                      <div className="h-2.5 bg-sol-lt rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={`h-full ${item.color} rounded-full transition-all duration-500`} 
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardBody>
          </Card>
        </div>

        {/* Performance Leaderboard */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>
              <Trophy className="w-4.5 h-4.5 text-sol-gold" /> Associate Performance Report
            </CardTitle>
            <Button variant="outline" size="sm" className="rounded-xl flex items-center gap-1.5 text-sol-gray">
              <Download className="w-3.5 h-3.5" /> Export Report
            </Button>
          </CardHeader>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-sol-lt/50 border-b border-sol-sl/30">
                  {["Rank", "Associate", "Region", "Sales Completed", "Capacity Sold", "Revenue Generated", "Commission Earned", "Tier"].map(h => (
                    <th key={h} className="px-5 py-3 text-[10px] uppercase tracking-wider text-sol-gray font-bold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-sol-sl/20">
                {sorted.map((assoc, idx) => {
                  const t = TIER_CONFIG[assoc.tier];
                  const rankIcons = ["🥇", "🥈", "🥉"];
                  
                  return (
                    <tr 
                      key={assoc.id} 
                      className={`hover:bg-sol-teal/5 transition-colors ${
                        idx === 0 ? "bg-amber-500/5" : ""
                      }`}
                    >
                      <td className="px-5 py-4 text-center">
                        {idx < 3 ? (
                          <span className="text-xl leading-none">{rankIcons[idx]}</span>
                        ) : (
                          <span className="text-xs font-extrabold text-sol-gray">#{idx + 1}</span>
                        )}
                      </td>
                      
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-sol-lt/60 border border-sol-sl/20 flex items-center justify-center text-sol-teal font-extrabold text-xs flex-shrink-0">
                            {assoc.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-sol-navy">{assoc.name}</div>
                            <div className="text-[10px] text-sol-gray font-mono font-semibold">{assoc.id}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-5 py-4 text-xs font-semibold text-sol-navy/70">{assoc.region}</td>
                      <td className="px-5 py-4 text-xs font-extrabold text-sol-navy">{assoc.customers}</td>
                      <td className="px-5 py-4 text-xs font-medium text-sol-gray">{assoc.kwpSold} kWp</td>
                      <td className="px-5 py-4 text-xs font-black text-emerald-600">{fmt(assoc.revenue)}</td>
                      <td className="px-5 py-4 text-xs font-black text-sol-teal">{fmt(assoc.commissionEarned)}</td>
                      <td className="px-5 py-4">
                        <Badge className={`${t.bg} ${t.color} text-[8px] border border-current/15`}>
                          {t.label}
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

