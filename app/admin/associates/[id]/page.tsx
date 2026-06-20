"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Topbar } from "@/components/shared/Topbar";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fmt, fmtDate, KYC_CONFIG, TIER_CONFIG } from "@/lib/utils";
import { useSupabase } from "@/hooks/useSupabase";
import { getAssociate, updateAssociate } from "@/lib/db";
import { Associate } from "@/lib/supabase";
import {
  User, Check, X, CheckCircle2, AlertTriangle,
  Phone, Mail, MapPin, CreditCard, Calendar,
  Users, Sun, IndianRupee, ArrowLeft, Loader2
} from "lucide-react";

export default function AssociateDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { data: assoc, loading, refetch } = useSupabase<Associate | null>(() => getAssociate(id as string));
  const [actionDone, setActionDone] = useState<"approved" | "rejected" | null>(null);

  async function handleKYC(status: "approved" | "rejected") {
    await updateAssociate(id as string, { kyc: status });
    setActionDone(status);
    await refetch();
    setTimeout(() => router.push("/admin/associates"), 1200);
  }

  if (loading) return (
    <div className="gradient-bg min-h-screen flex items-center justify-center">
      <Loader2 className="w-7 h-7 animate-spin text-sol-teal" />
    </div>
  );

  if (!assoc) return (
    <div className="gradient-bg min-h-screen flex items-center justify-center">
      <p className="text-sol-gray text-sm">Associate not found.</p>
    </div>
  );

  const kyc  = KYC_CONFIG[assoc.kyc];
  const tier = TIER_CONFIG[assoc.tier];

  return (
    <div className="gradient-bg min-h-screen pb-12">
      <Topbar
        title="Associate Detail"
        subtitle={`${assoc.name} — ${assoc.region} Region`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/admin/associates")} className="rounded-xl flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Button>
            {assoc.kyc === "pending" && !actionDone && (
              <>
                <Button variant="primary" size="sm" onClick={() => handleKYC("approved")} className="rounded-xl flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Approve KYC
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleKYC("rejected")} className="rounded-xl flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5" /> Reject
                </Button>
              </>
            )}
          </div>
        }
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {actionDone === "approved" && (
          <div className="glass-panel border-emerald-500/20 rounded-2xl px-5 py-4 text-emerald-700 text-xs flex items-center gap-3 shadow-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span><strong>KYC Approved!</strong> Redirecting...</span>
          </div>
        )}
        {actionDone === "rejected" && (
          <div className="glass-panel border-red-500/20 rounded-2xl px-5 py-4 text-red-600 text-xs flex items-center gap-3 shadow-md">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span><strong>KYC Rejected.</strong> Redirecting...</span>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle><User className="w-4.5 h-4.5 text-sol-teal" /> Associate Profile</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="flex items-center gap-4 mb-6 pb-5 border-b border-sol-sl/30">
                <div className="w-16 h-16 rounded-2xl bg-sol-lt/70 border border-sol-sl/20 flex items-center justify-center text-sol-teal font-extrabold text-2xl flex-shrink-0">
                  {assoc.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="font-extrabold text-sol-navy text-lg tracking-tight">{assoc.name}</div>
                  <div className="text-[10px] text-sol-gray font-mono">{assoc.id}</div>
                  <div className="flex gap-2 mt-2">
                    <Badge className={`${kyc.bg} ${kyc.color} text-[9px] border border-current/15`}>KYC: {kyc.label}</Badge>
                    <Badge className={`${tier.bg} ${tier.color} text-[9px] border border-current/15`}>{tier.label}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Mobile",   value: assoc.mobile,              icon: Phone },
                  { label: "Email",    value: assoc.email,               icon: Mail },
                  { label: "Region",   value: assoc.region,              icon: MapPin },
                  { label: "Aadhaar", value: assoc.aadhaar || "—",      icon: CreditCard },
                  { label: "Bank A/C", value: assoc.bank_account || "—", icon: CreditCard },
                  { label: "Joined",   value: fmtDate(assoc.joined_at),  icon: Calendar },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-sol-lt/35 border border-sol-sl/10 rounded-xl p-3 flex items-start gap-2.5">
                    <Icon className="w-4 h-4 text-sol-teal/70 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-[9px] font-bold text-sol-gray uppercase tracking-wider">{label}</div>
                      <div className="text-xs font-bold text-sol-navy mt-0.5">{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-sol-sl/30">
                {[
                  { val: assoc.customers,               label: "Customers",  icon: Users },
                  { val: `${assoc.kwp_sold} kWp`,       label: "kWp Sold",   icon: Sun },
                  { val: fmt(assoc.commission_earned),  label: "Commission", icon: IndianRupee },
                ].map(({ val, label, icon: Icon }) => (
                  <div key={label} className="bg-sol-lt/50 border border-sol-sl/20 rounded-xl p-3.5 text-center">
                    <Icon className="w-4 h-4 text-sol-teal/80 mb-1 mx-auto" />
                    <div className="font-black text-sol-navy text-sm">{val}</div>
                    <div className="text-[9px] text-sol-gray font-bold uppercase tracking-wider mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* KYC Status */}
          <Card>
            <CardHeader>
              <CardTitle><CheckCircle2 className="w-4.5 h-4.5 text-sol-teal" /> KYC Status</CardTitle>
            </CardHeader>
            <CardBody>
              <div className={`rounded-2xl border-2 p-6 text-center ${
                assoc.kyc === "approved" ? "border-emerald-400 bg-emerald-50/50" :
                assoc.kyc === "rejected" ? "border-red-400 bg-red-50/50" :
                "border-amber-400 bg-amber-50/50"
              }`}>
                <div className="text-4xl mb-3">
                  {assoc.kyc === "approved" ? "✅" : assoc.kyc === "rejected" ? "❌" : "⏳"}
                </div>
                <div className={`font-extrabold text-lg ${kyc.color}`}>{kyc.label}</div>
                <div className="text-xs text-sol-gray mt-2 font-semibold">
                  {assoc.kyc === "pending" && "Awaiting admin review"}
                  {assoc.kyc === "approved" && "Associate is verified and active"}
                  {assoc.kyc === "rejected" && "Application was rejected"}
                </div>
              </div>

              {assoc.kyc === "pending" && !actionDone && (
                <div className="mt-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs px-4 py-3 rounded-xl flex items-center gap-2 font-semibold">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Review the associate details and approve or reject the KYC application.</span>
                </div>
              )}

              <div className="mt-4 space-y-2">
                <div className="text-[10px] font-bold text-sol-gray uppercase tracking-wider mb-2">Registration Info</div>
                {[
                  ["Associate ID", assoc.id],
                  ["Registered Email", assoc.email],
                  ["Phone", assoc.mobile],
                  ["Joined", fmtDate(assoc.joined_at)],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-xs py-2 border-b border-sol-sl/20">
                    <span className="text-sol-gray font-semibold">{label}</span>
                    <span className="font-bold text-sol-navy">{val}</span>
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
