import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50",
          variant === "default" &&
            "bg-[var(--accent)] text-white shadow-sm hover:brightness-110 hover:shadow-md active:scale-[0.98]",
          variant === "outline" &&
            "border border-[#333333]/20 bg-white text-[#333333] hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/5 active:scale-[0.98]",
          variant === "ghost" &&
            "text-[#333333] hover:bg-[#333333]/10 active:scale-[0.98]",
          variant === "link" &&
            "text-[var(--accent)] underline-offset-4 hover:underline hover:opacity-90",
          size === "default" && "min-h-[44px] px-6 py-2",
          size === "sm" && "min-h-[36px] rounded-lg px-4 text-sm",
          size === "lg" && "min-h-[48px] rounded-xl px-8 text-base",
          size === "icon" && "min-h-[44px] min-w-[44px]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
