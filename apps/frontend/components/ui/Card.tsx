import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "glass" | "solid";
};

export function Card({ className, variant = "glass", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-5",
        variant === "glass" && "glass",
        variant === "solid" && "border border-border bg-card shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
