"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SolvantaLogo } from "./SolvantaLogo";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  IndianRupee,
  Gift,
  User,
  Settings,
  BarChart3,
  DollarSign,
  Home,
  LogOut
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  badge?: number;
}

interface SidebarProps {
  items: NavItem[];
  role: "admin" | "associate";
  userName: string;
  userSub?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "⊞": LayoutDashboard,
  "👥": Users,
  "🧾": FileSpreadsheet,
  "₹": IndianRupee,
  "🎁": Gift,
  "👤": User,
  "🏠": Home,
  "💰": DollarSign,
  "⚙": Settings,
  "📊": BarChart3,
};

export function Sidebar({ items, role, userName, userSub }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gradient-to-b from-[#0a1520] to-[#0d1f38] flex flex-col h-screen sticky top-0 flex-shrink-0 border-r border-white/5 relative z-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(43,168,160,0.1),transparent_50%)] pointer-events-none" />
      
      {/* Brand */}
      <div className="p-5 border-b border-white/5 relative z-10">
        <SolvantaLogo size={36} textColor="white" />
      </div>

      {/* Role badge */}
      <div className="px-4 py-4 border-b border-white/5 relative z-10">
        <div className="flex items-center gap-3 bg-white/5 rounded-xl p-2.5 border border-white/5 backdrop-blur-sm">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sol-gold to-yellow-400 flex items-center justify-center text-sol-navy font-bold text-sm flex-shrink-0 shadow-md">
            {userName.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="text-white text-xs font-semibold truncate tracking-tight">{userName}</div>
            <div className="text-sol-teal text-[9px] uppercase font-bold tracking-wider mt-0.5">{userSub || role}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto px-3 space-y-1 relative z-10">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const IconComponent = iconMap[item.icon] || LayoutDashboard;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200",
                isActive
                  ? "bg-sol-teal/20 text-white shadow-sm border border-sol-teal/20 shadow-sol-teal/5"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <IconComponent className={cn("w-4 h-4 transition-transform duration-200", isActive ? "text-sol-teal" : "text-white/40")} />
              <span className="flex-1 tracking-tight">{item.label}</span>
              {item.badge ? (
                <span className="bg-sol-gold text-sol-navy text-[9px] font-black px-1.5 py-0.5 rounded-full shadow">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5 relative z-10">
        <Link href="/" className="flex items-center gap-2 text-white/30 hover:text-white/70 text-[11px] font-semibold transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span>Marketing Site</span>
        </Link>
      </div>
    </aside>
  );
}
