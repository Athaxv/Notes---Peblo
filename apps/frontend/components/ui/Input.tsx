import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "glass-strong min-h-11 w-full rounded-xl px-4 py-2.5 text-base text-foreground placeholder:text-muted outline-none sm:text-sm",
        "transition motion-reduce:transition-none focus:border-accent focus:ring-2 focus:ring-accent/20",
        className,
      )}
      {...props}
    />
  );
}
