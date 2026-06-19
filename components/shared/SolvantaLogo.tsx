import Image from "next/image";
import { cn } from "@/lib/utils";

interface SolvantaLogoProps {
  size?: number;
  showText?: boolean;
  textColor?: "white" | "navy";
  className?: string;
}

export function SolvantaLogo({ size = 36, showText = true, textColor = "white", className }: SolvantaLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="rounded-full overflow-hidden bg-white flex-shrink-0" style={{ width: size, height: size }}>
        <Image src="/logo.jpg" alt="Solvanta Solar" width={size} height={size} className="object-contain" />
      </div>
      {showText && (
        <div>
          <div className={cn("font-bold tracking-wide leading-none", textColor === "white" ? "text-white" : "text-sol-navy")}
            style={{ fontSize: size * 0.42 }}>
            SOLVANTA
          </div>
          <div className="text-sol-teal leading-none tracking-widest uppercase"
            style={{ fontSize: size * 0.22 }}>
            SOLAR ENERGY
          </div>
        </div>
      )}
    </div>
  );
}
