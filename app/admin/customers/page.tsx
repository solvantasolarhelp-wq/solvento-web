"use client";
import { Topbar } from "@/components/shared/Topbar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { mockCustomers, mockAssociates } from "@/lib/mock-data";
import { fmtDate, STATUS_CONFIG } from "@/lib/utils";
import { 
  Users, 
  Activity, 
  CheckCircle2, 
  FileText, 
  FolderOpen,
  MapPin,
  Sun,
  Clock
} from "lucide-react";

export default function AdminCustomers() {
  const completed = mockCustomers.filter(c => c.status === "completed").length;
  const inProgress = mockCustomers.filter(c => c.status === "in_progress").length;
  const pending = mockCustomers.filter(c => c.status === "docs_pending").length;

  return (
    <div className="gradient-bg min-h-screen pb-12">
      <Topbar 
        title="Customer Management" 
        subtitle="All customers across all associates"
      />
      
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Stat Widgets */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Customers" value={mockCustomers.length} icon={<Users className="w-5 h-5" />} accent="teal"/>
          <StatCard label="In Progress" value={inProgress} icon={<Activity className="w-5 h-5" />} accent="gold"/>
          <StatCard label="Completed" value={completed} icon={<CheckCircle2 className="w-5 h-5" />} accent="navy"/>
          <StatCard label="Docs Pending" value={pending} icon={<FileText className="w-5 h-5" />} accent="red"/>
        </div>

        {/* Customer List Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-sol-lt/50 border-b border-sol-sl/30">
                  {["Customer", "Associate", "City", "System Size", "Phase", "Documents", "Status", "Actions"].map(h => (
                    <th key={h} className="px-5 py-3 text-[10px] uppercase tracking-wider text-sol-gray font-bold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-sol-sl/20">
                {mockCustomers.map(c => {
                  const assoc = mockAssociates.find(a => a.id === c.associateId);
                  const st = STATUS_CONFIG[c.status];
                  const docPct = Math.round((c.docsUploaded / c.docsRequired) * 100);
                  
                  return (
                    <tr key={c.id} className="hover:bg-sol-teal/5 transition-colors">
                      <td className="px-5 py-4">
                        <div className="text-xs font-bold text-sol-navy">{c.name}</div>
                        <div className="text-[10px] text-sol-gray font-mono font-semibold mt-0.5">{c.mobile}</div>
                      </td>
                      <td className="px-5 py-4 text-xs font-semibold text-sol-navy/70">{assoc?.name || "—"}</td>
                      <td className="px-5 py-4 text-xs text-sol-gray flex items-center gap-1 mt-3">
                        <MapPin className="w-3.5 h-3.5 text-sol-gray" />
                        <span>{c.city}</span>
                      </td>
                      <td className="px-5 py-4 text-xs font-extrabold text-sol-navy">
                        <span className="flex items-center gap-1">
                          <Sun className="w-3.5 h-3.5 text-sol-gold" />
                          {c.systemKwp} kWp
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-sol-gray font-semibold">{c.phase}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-sol-sl/55 rounded-full overflow-hidden w-20 shadow-inner">
                            <div 
                              className="h-full bg-gradient-to-r from-sol-teal to-teal-400 rounded-full transition-all duration-300" 
                              style={{ width: `${docPct}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-sol-gray font-bold whitespace-nowrap">
                            {c.docsUploaded}/{c.docsRequired}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge className={`${st.bg} ${st.color} text-[9px] border border-current/15`}>
                          {st.label}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-xl flex items-center gap-1 text-[10px] py-1.5"
                        >
                          <FolderOpen className="w-3.5 h-3.5" />
                          <span>Docs</span>
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

