"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Topbar } from "@/components/shared/Topbar";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockAssociates } from "@/lib/mock-data";
import { fmt, fmtDate, KYC_CONFIG, TIER_CONFIG } from "@/lib/utils";
import { 
  User, 
  FolderOpen, 
  Check, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Lock, 
  Calendar, 
  Users, 
  Sun, 
  IndianRupee,
  ShieldCheck,
  FileCheck2,
  Camera,
  Landmark,
  Paperclip,
  ArrowLeft
} from "lucide-react";

export default function AssociateDetail() {
  const { id } = useParams();
  const router = useRouter();
  const assoc = mockAssociates.find(a => a.id === id) || mockAssociates[0];
  const [approved, setApproved] = useState(assoc.kyc === "approved");
  const kyc = KYC_CONFIG[approved ? "approved" : assoc.kyc];
  const tier = TIER_CONFIG[assoc.tier];

  function handleApprove() { 
    setApproved(true); 
    setTimeout(() => router.push("/admin/associates"), 1000); 
  }

  const personalFields = [
    { label: "Mobile Number", value: assoc.mobile, icon: Phone },
    { label: "Email Address", value: assoc.email, icon: Mail },
    { label: "Region/Branch", value: assoc.region, icon: MapPin },
    { label: "Bank Account No.", value: assoc.bankAccount, icon: CreditCard },
    { label: "IFSC Code", value: assoc.ifsc, icon: Lock },
    { label: "Joined Date", value: fmtDate(assoc.joinedAt), icon: Calendar },
  ];

  const docs = [
    { id: "aadhaar", label: "Aadhaar Card", done: true, icon: ShieldCheck },
    { id: "pan", label: "PAN Card", done: true, icon: FileCheck2 },
    { id: "photo", label: "Photograph", done: true, icon: Camera },
    { id: "bank", label: "Bank Details", done: true, icon: Landmark },
    { id: "other", label: "Other KYC", done: false, icon: Paperclip },
  ];

  return (
    <div className="gradient-bg min-h-screen pb-12">
      <Topbar 
        title="KYC Document Review" 
        subtitle={`${assoc.name} — ${assoc.region} Region`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/admin/associates")} className="rounded-xl flex items-center gap-1.5 text-sol-gray">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Button>
            {!approved && (
              <Button variant="primary" size="sm" onClick={handleApprove} className="rounded-xl flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Approve KYC
              </Button>
            )}
            <Button variant="danger" size="sm" onClick={() => router.push("/admin/associates")} className="rounded-xl flex items-center gap-1.5">
              <X className="w-3.5 h-3.5" /> Reject
            </Button>
          </div>
        }
      />
      
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Approved Success Toast */}
        {approved && (
          <div className="glass-panel border-emerald-500/20 rounded-2xl px-5 py-4 text-emerald-700 text-xs flex items-center gap-3 shadow-md backdrop-blur-md">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sol-navy">KYC Approved!</span> Associate credential status updated to active. Redirecting...
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Profile Details */}
          <Card>
            <CardHeader>
              <CardTitle>
                <User className="w-4.5 h-4.5 text-sol-teal" /> Associate Profile
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="flex items-center gap-4 mb-6 pb-5 border-b border-sol-sl/30">
                <div className="w-16 h-16 rounded-2xl bg-sol-lt/70 border border-sol-sl/20 flex items-center justify-center text-sol-teal font-extrabold text-2xl flex-shrink-0 shadow-inner">
                  {assoc.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="font-extrabold text-sol-navy text-lg tracking-tight">{assoc.name}</div>
                  <div className="text-[10px] text-sol-gray font-mono font-semibold">{assoc.id}</div>
                  <div className="flex gap-2 mt-2">
                    <Badge className={`${kyc.bg} ${kyc.color} text-[9px] border border-current/15`}>
                      KYC: {kyc.label}
                    </Badge>
                    <Badge className={`${tier.bg} ${tier.color} text-[9px] border border-current/15`}>
                      {tier.label}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {personalFields.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-sol-lt/35 border border-sol-sl/10 rounded-xl p-3 flex items-start gap-2.5">
                    <Icon className="w-4.5 h-4.5 text-sol-teal/70 mt-0.5" />
                    <div>
                      <div className="text-[9px] font-bold text-sol-gray uppercase tracking-wider">{label}</div>
                      <div className="text-xs font-bold text-sol-navy mt-0.5">{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-sol-sl/30">
                {[
                  { val: assoc.customers, label: "Customers", icon: Users },
                  { val: `${assoc.kwpSold} kWp`, label: "kWp Sold", icon: Sun },
                  { val: fmt(assoc.commissionEarned), label: "Commission", icon: IndianRupee }
                ].map(({ val, label, icon: Icon }) => (
                  <div key={label} className="bg-sol-lt/50 border border-sol-sl/20 rounded-xl p-3.5 text-center flex flex-col items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-sol-teal/80 mb-1" />
                    <div className="font-black text-sol-navy text-sm tracking-tight">{val}</div>
                    <div className="text-[9px] text-sol-gray font-bold uppercase tracking-wider mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* KYC Documents */}
          <Card>
            <CardHeader>
              <CardTitle>
                <FolderOpen className="w-4.5 h-4.5 text-sol-teal" /> Uploaded KYC Documents
              </CardTitle>
              <Badge className="bg-sol-lt text-sol-teal border border-sol-teal/20 text-[9px]">
                4 of 5 Completed
              </Badge>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {docs.map(d => {
                  const Icon = d.icon;
                  return (
                    <div 
                      key={d.id} 
                      className={`rounded-2xl border p-4 flex flex-col items-center gap-2 text-center transition-all ${
                        d.done
                          ? "border-sol-teal/30 bg-sol-lt/30"
                          : "border-dashed border-sol-sl bg-transparent"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${
                        d.done ? "bg-emerald-500/10 text-emerald-600" : "bg-sol-sl/20 text-sol-gray"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-sol-navy tracking-tight">{d.label}</span>
                      <Badge className={
                        d.done 
                          ? "bg-emerald-500/10 text-emerald-700 text-[9px] border border-emerald-500/20" 
                          : "bg-sol-sl/20 text-sol-gray text-[9px]"
                      }>
                        {d.done ? "✓ Uploaded" : "Pending"}
                      </Badge>
                    </div>
                  );
                })}
              </div>

              {!approved && (
                <div className="mt-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 font-semibold">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>1 document still pending. You may still approve or request re-upload.</span>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
