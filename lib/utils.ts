export function fmt(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function fmtNum(n: number): string {
  return Math.round(n).toLocaleString("en-IN");
}

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export function calcPanelQty(kwp: number, watt: number): number {
  return Math.ceil((kwp * 1000) / watt);
}

export function calcSubsidy(kwp: number, config: { subsidy1kw: number; subsidy2kw: number; subsidy3kwPlus: number }): number {
  if (kwp >= 3) return config.subsidy3kwPlus;
  if (kwp >= 2) return config.subsidy2kw;
  return config.subsidy1kw;
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const TIER_CONFIG = {
  starter:  { label: "Starter",  color: "text-gray-500",  bg: "bg-gray-100",  border: "border-gray-300",  emoji: "🎖" },
  silver:   { label: "Silver",   color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-400", emoji: "⭐" },
  gold:     { label: "Gold",     color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-400",  emoji: "👑" },
  platinum: { label: "Platinum", color: "text-sol-navy",   bg: "bg-blue-50",   border: "border-sol-navy",   emoji: "💎" },
} as const;

export const STATUS_CONFIG = {
  new:          { label: "New",           color: "text-purple-700", bg: "bg-purple-50"  },
  docs_pending: { label: "Docs Pending",  color: "text-amber-700",  bg: "bg-amber-50"   },
  in_progress:  { label: "In Progress",   color: "text-blue-700",   bg: "bg-blue-50"    },
  completed:    { label: "Completed",     color: "text-green-700",  bg: "bg-green-50"   },
} as const;

export const KYC_CONFIG = {
  pending:  { label: "Pending",  color: "text-amber-700", bg: "bg-amber-50"  },
  approved: { label: "Approved", color: "text-green-700", bg: "bg-green-50"  },
  rejected: { label: "Rejected", color: "text-red-700",   bg: "bg-red-50"    },
} as const;
