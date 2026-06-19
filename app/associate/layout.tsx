"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Sidebar } from "@/components/shared/Sidebar";

const assocNav = [
  { href: "/associate/dashboard",  label: "My Dashboard",  icon: "⊞" },
  { href: "/associate/customers",  label: "My Customers",  icon: "👥" },
  { href: "/associate/quotes",     label: "My Quotations", icon: "🧾" },
  { href: "/associate/commission", label: "Commission",    icon: "₹" },
  { href: "/associate/offers",     label: "Offers",        icon: "🎁", badge: 3 },
  { href: "/associate/profile",    label: "My Profile",    icon: "👤" },
];

const publicPaths = ["/associate/login", "/associate/register"];

export default function AssociateLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (publicPaths.includes(pathname)) { setReady(true); return; }
    const session = getSession();
    if (!session || session.role !== "associate") {
      router.replace("/associate/login"); return;
    }
    setReady(true);
  }, [pathname, router]);

  if (!ready) return (
    <div className="min-h-screen flex items-center justify-center bg-sol-dark">
      <div className="text-sol-teal text-sm animate-pulse">Loading...</div>
    </div>
  );

  if (publicPaths.includes(pathname)) return <>{children}</>;

  const session = getSession();
  const tierLabel = session?.tier ? session.tier.charAt(0).toUpperCase()+session.tier.slice(1)+" Associate" : "Associate";

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F7FB]">
      <Sidebar items={assocNav} role="associate" userName={session?.name||"Associate"} userSub={tierLabel}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
