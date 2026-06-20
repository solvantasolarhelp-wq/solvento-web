"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Sidebar } from "@/components/shared/Sidebar";
import { Loader2 } from "lucide-react";

const adminNav = [
  { href: "/admin",            label: "Dashboard",    icon: "⊞" },
  { href: "/admin/associates", label: "Associates",   icon: "👥" },
  { href: "/admin/customers",  label: "Customers",    icon: "🏠" },
  { href: "/admin/quotes",     label: "Quotations",   icon: "🧾" },
  { href: "/admin/pricing",    label: "Pricing Panel", icon: "💰" },
  { href: "/admin/commission", label: "Commission",   icon: "⚙" },
  { href: "/admin/reports",    label: "Reports",      icon: "📊" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") { setReady(true); return; }
    const session = getSession();
    if (!session || session.role !== "admin") {
      router.replace("/admin/login"); return;
    }
    setReady(true);
  }, [pathname, router]);

  if (!ready) return (
    <div className="min-h-screen flex items-center justify-center bg-sol-dark">
      <Loader2 className="w-6 h-6 animate-spin text-sol-teal" />
    </div>
  );

  if (pathname === "/admin/login") return <>{children}</>;

  const session = getSession();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F7FB]">
      <Sidebar items={adminNav} role="admin" userName={session?.name || "Admin"} userSub="Administrator" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
