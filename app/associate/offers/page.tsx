"use client";
import { Topbar } from "@/components/shared/Topbar";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useSupabase } from "@/hooks/useSupabase";
import { getOffers } from "@/lib/db";
import { Offer } from "@/lib/supabase";
import { Trophy, Gift, Users, Loader2 } from "lucide-react";

const TAG_COLORS: Record<string, string> = {
  HOT:     "bg-red-500/20 text-red-600 border-red-500/20",
  NEW:     "bg-sol-teal/20 text-sol-teal border-sol-teal/20",
  BONUS:   "bg-sol-gold/20 text-amber-700 border-sol-gold/20",
  SPECIAL: "bg-purple-500/20 text-purple-700 border-purple-500/20",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  trip:     <Trophy className="w-6 h-6" />,
  gift:     <Gift className="w-6 h-6" />,
  referral: <Users className="w-6 h-6" />,
  cash:     <span className="text-xl font-black">₹</span>,
};

export default function AssocOffers() {
  const { data, loading } = useSupabase<Offer[]>(getOffers);
  const offers = data ?? [];

  return (
    <div className="gradient-bg min-h-screen pb-12">
      <Topbar title="Active Offers & Rewards" subtitle="Complete targets to claim bonuses" />
      <div className="p-6 max-w-5xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-sol-teal" /></div>
        ) : offers.length === 0 ? (
          <div className="text-center py-16 text-sol-gray text-sm">No active offers right now.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {offers.map(offer => (
              <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-sol-navy to-sol-dark p-5 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-sol-gold/20 border border-sol-gold/30 flex items-center justify-center text-sol-gold flex-shrink-0">
                    {TYPE_ICONS[offer.type] ?? <Trophy className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`text-[9px] border px-2 py-0.5 ${TAG_COLORS[offer.tag] ?? ""}`}>
                        {offer.tag}
                      </Badge>
                      <span className="text-[10px] text-white/50 font-semibold">{offer.tier}</span>
                    </div>
                    <div className="text-white font-extrabold text-sm leading-tight">{offer.title}</div>
                  </div>
                </div>
                <CardBody>
                  <p className="text-xs text-sol-gray leading-relaxed mb-4">{offer.description}</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-sol-lt/60 rounded-xl p-3 text-center">
                      <div className="font-black text-sol-navy text-sm">₹{offer.bonus.toLocaleString("en-IN")}</div>
                      <div className="text-[9px] text-sol-gray font-bold uppercase mt-0.5">Bonus</div>
                    </div>
                    <div className="bg-sol-lt/60 rounded-xl p-3 text-center">
                      <div className="font-black text-sol-navy text-sm">{offer.target}</div>
                      <div className="text-[9px] text-sol-gray font-bold uppercase mt-0.5">Target</div>
                    </div>
                    <div className="bg-sol-lt/60 rounded-xl p-3 text-center">
                      <div className="font-black text-sol-navy text-sm">
                        {offer.expires_at === "2099-12-31" ? "∞" : new Date(offer.expires_at).toLocaleDateString("en-IN", { day:"2-digit", month:"short" })}
                      </div>
                      <div className="text-[9px] text-sol-gray font-bold uppercase mt-0.5">Expires</div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
