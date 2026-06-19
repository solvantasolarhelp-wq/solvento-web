"use client";
import { useRouter } from "next/navigation";
import { clearSession } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { LogOut } from "lucide-react";

interface TopbarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Topbar({ title, subtitle, actions }: TopbarProps) {
  const router = useRouter();

  function handleLogout() {
    clearSession();
    router.push("/");
  }

  return (
    <header className="bg-white/75 backdrop-blur-md border-b border-sol-sl/30 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-base font-extrabold text-sol-navy tracking-tight">{title}</h1>
        {subtitle && <p className="text-[11px] text-sol-gray font-medium mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <Button variant="outline" size="sm" onClick={handleLogout} className="border-red-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300">
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
}
