import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "navy" | "gold" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

const variants = {
  primary: "bg-sol-teal hover:bg-teal-600 text-white border-transparent shadow-sm hover:shadow-teal-500/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
  navy:    "bg-sol-navy hover:bg-opacity-90 text-white border-transparent shadow-sm hover:shadow-sol-navy/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
  gold:    "bg-sol-gold hover:bg-amber-400 text-sol-navy border-transparent font-bold shadow-sm hover:shadow-sol-gold/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
  outline: "bg-white/60 hover:bg-sol-lt text-sol-navy border-sol-sl/60 hover:border-sol-teal/40 backdrop-blur-sm hover:-translate-y-0.5 active:translate-y-0",
  ghost:   "bg-transparent hover:bg-sol-lt text-sol-navy border-transparent hover:-translate-y-0.5 active:translate-y-0",
  danger:  "bg-red-50 hover:bg-red-100 text-red-700 border-red-200 hover:-translate-y-0.5 active:translate-y-0",
};
const sizes = {
  sm: "px-3 py-1.5 text-xs gap-1.5 rounded-md",
  md: "px-4 py-2 text-sm gap-2 rounded-lg",
  lg: "px-6 py-3 text-sm gap-2 font-semibold rounded-xl",
};

export function Button({ variant = "outline", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center border font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant], sizes[size], className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
