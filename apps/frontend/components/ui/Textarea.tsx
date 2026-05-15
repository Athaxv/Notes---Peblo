import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "glass-strong min-h-[120px] w-full resize-y rounded-xl px-4 py-3 text-base text-foreground placeholder:text-muted outline-none sm:text-sm",
        "transition motion-reduce:transition-none focus:border-accent focus:ring-2 focus:ring-accent/20",
        className,
      )}
      {...props}
    />
  );
}
