import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "destructive" | "outline";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variant === "default" &&
          "bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30",
        variant === "secondary" &&
          "bg-[#333333]/10 text-[#333333]/80",
        variant === "success" &&
          "bg-green-100 text-green-800 border border-green-200",
        variant === "destructive" &&
          "bg-red-100 text-red-700 border border-red-200",
        variant === "outline" &&
          "border border-[#333333]/20 bg-transparent text-[#333333]/80",
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = "Badge";

export { Badge };
