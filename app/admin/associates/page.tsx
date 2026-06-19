"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/shared/Topbar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockAssociates } from "@/lib/mock-data";
import { fmt, KYC_CONFIG, TIER_CONFIG } from "@/lib/utils";
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Users,
  MapPin,
  Sparkles
} from "lucide-react";

export default function AdminAssociates() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");

  const filtered = mockAssociates.filter(a => {
    if (filter !== "all" && a.kyc !== filter) return false;
    if (selectedRegion !== "All Regions" && a.region !== selectedRegion) return false;
    if (search && 
        !a.name.toLowerCase().includes(search.toLowerCase()) && 
        !a.region.toLowerCase().includes(search.toLowerCase()) &&
        !a.id.toLowerCase().includes(search.toLowerCase())
    ) return false;
    return true;
  });

  const tabs = [
    { key: "all", label: "All", count: mockAssociates.length, icon: Users },
    { key: "pending", label: "Pending KYC", count: mockAssociates.filter(a => a.kyc === "pending").length, icon: AlertCircle, iconColor: "text-amber-500" },
    { key: "approved", label: "Approved", count: mockAssociates.filter(a => a.kyc === "approved").length, icon: CheckCircle2, iconColor: "text-emerald-500" },
    { key: "rejected", label: "Rejected", count: mockAssociates.filter(a => a.kyc === "rejected").length, icon: XCircle, iconColor: "text-rose-500" },
  ];

  return (
    <div className="gradient-bg min-h-screen pb-12">
      <Topbar 
        title="Associate Management" 
        subtitle="Review KYC, approve registrations, track performance"
      />
      
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 bg-sol-sl/20 p-1.5 rounded-2xl border border-sol-sl/30 backdrop-blur-md overflow-x-auto">
          {tabs.map(t => {
            const Icon = t.icon;
            const active = filter === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setFilter(t.key as typeof filter)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? "bg-white text-sol-navy shadow-sm"
                    : "text-sol-gray hover:text-sol-navy hover:bg-white/40"
                }`}
              >
                <Icon className={`w-4 h-4 ${t.iconColor || ""}`} />
                <span>{t.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  active ? "bg-sol-lt text-sol-teal" : "bg-sol-sl/45 text-sol-gray"
                }`}>{t.count}</span>
              </button>
            );
          })}
        </div>

        {/* Filter Toolbar & List */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-sol-sl/30 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-sol-gray" />
              <input 
                placeholder="Search name, ID or region..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-sol-lt/30 border border-sol-sl/30 focus:border-sol-teal focus:bg-white/80 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none transition-all"
              />
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Filter className="absolute left-3 top-2.5 w-4 h-4 text-sol-gray" />
                <select 
                  value={selectedRegion}
                  onChange={e => setSelectedRegion(e.target.value)}
                  className="w-full sm:w-44 bg-sol-lt/30 border border-sol-sl/30 focus:border-sol-teal focus:bg-white/80 rounded-xl pl-9 pr-4 py-2 text-xs font-bold focus:outline-none appearance-none transition-all"
                >
                  <option value="All Regions">All Regions</option>
                  {["Jaipur", "Jodhpur", "Ajmer", "Kota", "Bikaner"].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-sol-lt/50 border-b border-sol-sl/30">
                  {["Associate", "Region", "Customers", "Capacity", "Earnings", "KYC Status", "Tier", "Actions"].map(h => (
                    <th key={h} className="px-5 py-3 text-[10px] uppercase tracking-wider text-sol-gray font-bold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-sol-sl/20">
                {filtered.map(a => {
                  const kyc = KYC_CONFIG[a.kyc];
                  const tier = TIER_CONFIG[a.tier];
                  return (
                    <tr key={a.id} className="hover:bg-sol-teal/5 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-sol-lt/60 border border-sol-sl/20 flex items-center justify-center text-sol-teal font-extrabold text-xs flex-shrink-0">
                            {a.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-sol-navy">{a.name}</div>
                            <div className="text-[10px] text-sol-gray font-mono font-semibold">{a.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs font-semibold text-sol-navy/70">{a.region}</td>
                      <td className="px-5 py-4 text-xs font-extrabold text-sol-navy">{a.customers}</td>
                      <td className="px-5 py-4 text-xs font-medium text-sol-gray">{a.kwpSold} kWp</td>
                      <td className="px-5 py-4 text-xs font-black text-emerald-600">
                        {a.commissionEarned > 0 ? fmt(a.commissionEarned) : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <Badge className={`${kyc.bg} ${kyc.color} text-[9px] border border-current/15`}>
                          {kyc.label}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <Badge className={`${tier.bg} ${tier.color} text-[9px] border border-current/15`}>
                          {tier.label}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <Button 
                          variant={a.kyc === "pending" ? "primary" : "outline"} 
                          size="sm" 
                          onClick={() => router.push(`/admin/associates/${a.id}`)}
                          className="rounded-xl flex items-center gap-1.5 text-[10px] py-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          {a.kyc === "pending" ? "Review KYC" : "Details"}
                        </Button>
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

