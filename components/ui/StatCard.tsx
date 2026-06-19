import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: ReactNode;
  accent?: "teal" | "gold" | "navy" | "red";
  trend?: "up" | "down" | "neutral";
}

const accents = {
  teal:  "before:bg-sol-teal/80",
  gold:  "before:bg-sol-gold/80",
  navy:  "before:bg-sol-navy/80",
  red:   "before:bg-red-500/80",
};

const iconBgs = {
  teal: "bg-sol-teal/10 text-sol-teal",
  gold: "bg-sol-gold/10 text-amber-600",
  navy: "bg-sol-navy/10 text-sol-navy",
  red:  "bg-red-500/10 text-red-500",
};

export function StatCard({ label, value, sub, icon, accent = "teal", trend }: StatCardProps) {
  return (
    <div className={cn(
      "glass-panel rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-sol-navy/5 hover:-translate-y-0.5",
      "before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px]",
      accents[accent]
    )}>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-2xl font-extrabold text-sol-navy tracking-tight">{value}</div>
          <div className="text-[10px] text-sol-gray font-bold uppercase tracking-wider mt-1">{label}</div>
        </div>
        {icon && (
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 shadow-inner", iconBgs[accent])}>
            {icon}
          </div>
        )}
      </div>
      {sub && (
        <div className={cn("text-[11px] mt-3 font-semibold flex items-center gap-1",
          trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-sol-gray"
        )}>
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "•"} <span className="opacity-90">{sub}</span>
        </div>
      )}
    </div>
  );
}
