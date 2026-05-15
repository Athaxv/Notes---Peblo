import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "motion-safe:transition-colors motion-reduce:transition-none",
        size === "sm" && "px-3 py-2 text-sm",
        size === "md" && "px-4 py-2.5 text-sm",
        size === "lg" && "px-5 py-3",
        variant === "primary" &&
          "bg-accent text-accent-foreground hover:bg-accent-hover",
        variant === "secondary" &&
          "glass text-foreground hover:bg-white/90",
        variant === "ghost" && "text-foreground hover:bg-black/5",
        variant === "danger" &&
          "border border-danger/30 bg-danger/10 text-danger hover:bg-danger/20",
        className,
      )}
      {...props}
    />
  );
}
