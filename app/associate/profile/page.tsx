"use client";
import { Topbar } from "@/components/shared/Topbar";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockAssociates } from "@/lib/mock-data";
import { fmt, fmtDate, TIER_CONFIG, KYC_CONFIG } from "@/lib/utils";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Landmark, 
  Calendar, 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  FileCheck2, 
  CreditCard, 
  Camera, 
  Trophy, 
  Users, 
  Sun,
  UserCheck2,
  Lock
} from "lucide-react";

export default function AssocProfile() {
  const me = mockAssociates[2]; // Mohan Verma
  const tier = TIER_CONFIG[me.tier];
  const kyc = KYC_CONFIG[me.kyc];
  
  // Sort associates by revenue
  const sorted = [...mockAssociates]
    .filter(a => a.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue);
  const rank = sorted.findIndex(a => a.id === me.id) + 1;

  const personalFields = [
    { label: "Mobile Number", value: me.mobile, icon: Phone },
    { label: "Email Address", value: me.email, icon: Mail },
    { label: "Region/Branch", value: me.region, icon: MapPin },
    { label: "Bank Account No.", value: me.bankAccount, icon: CreditCard },
    { label: "IFSC Code", value: me.ifsc, icon: Lock },
    { label: "Joined Date", value: fmtDate(me.joinedAt), icon: Calendar },
  ];

  const docs = [
    { id: "aadhaar", label: "Aadhaar Card", icon: ShieldCheck },
    { id: "pan", label: "PAN Card", icon: FileCheck2 },
    { id: "photo", label: "Photograph", icon: Camera },
    { id: "bank", label: "Bank Details", icon: Landmark },
  ];

  return (
    <div className="gradient-bg min-h-screen pb-12">
      <Topbar 
        title="My Profile" 
        subtitle="Account details and KYC status"
        actions={<Button variant="outline" size="sm" className="rounded-xl">Edit Profile</Button>}
      />
      
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>
                <User className="w-4.5 h-4.5 text-sol-teal" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="flex items-center gap-4 mb-6 pb-5 border-b border-sol-sl/30">
                <div className="w-16 h-16 rounded-2xl bg-sol-lt/70 border border-sol-sl/20 flex items-center justify-center text-sol-teal font-extrabold text-2xl flex-shrink-0 shadow-inner">
                  {me.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="font-extrabold text-sol-navy text-lg tracking-tight">{me.name}</div>
                  <div className="text-[10px] text-sol-gray font-mono font-semibold">{me.id}</div>
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
                  { val: me.customers, label: "Customers", icon: Users },
                  { val: `${me.kwpSold} kWp`, label: "kWp Sold", icon: Sun },
                  { val: `#${rank}`, label: "Leaderboard", icon: Trophy }
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
          <Card className="h-full flex flex-col justify-between">
            <div>
              <CardHeader>
                <CardTitle>
                  <ShieldCheck className="w-4.5 h-4.5 text-sol-teal" /> KYC Documents
                </CardTitle>
                <Badge className={`${kyc.bg} ${kyc.color} text-[9px] border border-current/15`}>
                  {kyc.label}
                </Badge>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-2 gap-4">
                  {docs.map(d => {
                    const Icon = d.icon;
                    return (
                      <div key={d.id} className="rounded-2xl border border-sol-sl/20 bg-sol-lt/30 hover:bg-sol-lt/50 transition-colors p-4 flex flex-col items-center gap-2 text-center">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-inner">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-sol-navy tracking-tight">{d.label}</span>
                        <Badge className="bg-emerald-500/10 text-emerald-700 text-[9px] border border-emerald-500/20">
                          ✓ Approved
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </div>
            <div className="p-5 border-t border-sol-sl/20 bg-sol-lt/20 rounded-b-2xl">
              <p className="text-[10px] text-sol-gray font-semibold leading-relaxed">
                * Note: Approved KYC documents cannot be modified. Contact support if you need to update your details.
              </p>
            </div>
          </Card>
        </div>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Trophy className="w-4.5 h-4.5 text-sol-gold" /> Leaderboard — June 2025
            </CardTitle>
            <Badge className="bg-amber-500/10 text-amber-700 border border-amber-500/20">
              This Month
            </Badge>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-sol-sl/20">
              {sorted.map((assoc, idx) => {
                const t = TIER_CONFIG[assoc.tier];
                const isMe = assoc.id === me.id;
                const rankLabels = ["🥇", "🥈", "🥉"];
                
                return (
                  <div 
                    key={assoc.id} 
                    className={`flex items-center gap-4 px-5 py-4 transition-colors ${
                      isMe 
                        ? "bg-sol-teal/5 border-y border-sol-teal/10" 
                        : "hover:bg-sol-lt/10"
                    }`}
                  >
                    {/* Rank Badge */}
                    <div className="w-8 flex items-center justify-center">
                      {idx < 3 ? (
                        <span className="text-xl leading-none">{rankLabels[idx]}</span>
                      ) : (
                        <span className="text-xs font-extrabold text-sol-gray">#{idx + 1}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-xl bg-sol-lt/60 border border-sol-sl/20 flex items-center justify-center text-sol-teal font-bold text-xs flex-shrink-0">
                      {assoc.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-sol-navy flex items-center gap-2">
                        {assoc.name}
                        {isMe && (
                          <Badge className="bg-sol-teal/15 text-sol-teal border border-sol-teal/20 text-[8px] py-0.25">
                            YOU
                          </Badge>
                        )}
                      </div>
                      <div className="text-[10px] text-sol-gray font-semibold mt-0.5">{assoc.region}</div>
                    </div>

                    {/* Sales Metrics */}
                    <div className="text-center w-16">
                      <div className="text-xs font-extrabold text-sol-navy tracking-tight">{assoc.customers}</div>
                      <div className="text-[9px] text-sol-gray font-bold uppercase tracking-wider mt-0.5">sales</div>
                    </div>
                    <div className="text-right w-24">
                      <div className="text-xs font-black text-emerald-600 tracking-tight">{fmt(assoc.revenue)}</div>
                      <div className="text-[9px] text-sol-gray font-bold uppercase tracking-wider mt-0.5">revenue</div>
                    </div>

                    {/* Tier */}
                    <Badge className={`${t.bg} ${t.color} text-[8px] border border-current/15 ml-2 hidden sm:inline-flex`}>
                      {t.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

