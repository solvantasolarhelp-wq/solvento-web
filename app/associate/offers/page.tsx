"use client";
import { Topbar } from "@/components/shared/Topbar";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mockOffers } from "@/lib/mock-data";
import { fmt } from "@/lib/utils";
import { 
  Gift, 
  Compass, 
  Users, 
  Smartphone, 
  IndianRupee, 
  Calendar, 
  Target, 
  CheckCircle2, 
  Sparkles,
  TrendingUp
} from "lucide-react";

const tagStyles: Record<string, string> = {
  HOT:    "bg-rose-500/10 text-rose-600 border border-rose-500/20",
  NEW:    "bg-sky-500/10 text-sky-600 border border-sky-500/20",
  BONUS:  "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
  SPECIAL:"bg-violet-500/10 text-violet-600 border border-violet-500/20",
};

const offerIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  trip: Compass,
  referral: Users,
  gift: Smartphone,
  cash: IndianRupee,
};

export default function AssocOffers() {
  return (
    <div className="gradient-bg min-h-screen pb-12">
      <Topbar 
        title="Offers & Rewards" 
        subtitle="Special offers published by Admin — updated regularly"
      />
      
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Eligibility Banner */}
        <div className="glass-panel border-sol-teal/20 rounded-2xl px-5 py-4 text-emerald-700 text-xs flex items-center gap-3 shadow-md backdrop-blur-md">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-sol-navy">Active Qualification:</span> You are currently eligible for all <span className="font-bold text-emerald-600">{mockOffers.length} active offers</span>. Complete targets below to claim them!
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockOffers.map((offer) => {
            const IconComponent = offerIcons[offer.type] || Gift;
            const progressVal = offer.type === "referral" ? 0 : 7; // Mock user progress
            const remaining = Math.max(0, offer.target - progressVal);
            const progressPercent = Math.min(100, (progressVal / offer.target) * 100);

            return (
              <Card key={offer.id} className="hover:scale-[1.01] active:scale-[0.99] cursor-pointer transition-all duration-200 flex flex-col justify-between h-full group">
                <CardBody className="flex flex-col justify-between h-full space-y-5">
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-sol-lt/70 border border-sol-sl/20 flex items-center justify-center flex-shrink-0 text-sol-teal shadow-inner group-hover:bg-sol-teal/10 group-hover:text-sol-teal transition-all duration-300">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <Badge className={tagStyles[offer.tag] || "bg-sol-lt text-sol-navy"}>
                        {offer.tag}
                      </Badge>
                    </div>

                    {/* Title & Desc */}
                    <h3 className="font-extrabold text-sol-navy text-sm leading-snug tracking-tight mb-2 group-hover:text-sol-teal transition-colors">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-sol-navy/70 leading-relaxed font-semibold">
                      {offer.description}
                    </p>
                  </div>

                  {/* Progress & Target */}
                  {offer.type !== "referral" && (
                    <div className="bg-sol-lt/40 border border-sol-sl/20 rounded-xl p-3.5 space-y-2.5">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-sol-navy flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-sol-teal" />
                          Progress: {progressVal} / {offer.target}
                        </span>
                        <span className="text-sol-gray">
                          {remaining === 0 ? "Target Achieved! 🎉" : `${remaining} more needed`}
                        </span>
                      </div>
                      <div className="h-2 bg-sol-sl/45 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-sol-teal to-teal-400 rounded-full transition-all duration-500 shadow-md shadow-sol-teal/20" 
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-sol-sl/20 mt-auto">
                    <div className="text-xs font-semibold text-sol-navy/70 flex items-center gap-1">
                      Reward Value: <span className="font-black text-sm text-emerald-600 tracking-tight">{fmt(offer.bonus)}</span>
                    </div>
                    <div className="text-[10px] font-bold text-sol-gray uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-sol-gray/70" />
                      {offer.expiresAt === "2099-12-31" ? "Ongoing" : `Ends: ${new Date(offer.expiresAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}`}
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

