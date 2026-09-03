import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "muted",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: "muted" | "accent" | "mark" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium",
        tone === "accent" && "bg-wash text-accent",
        tone === "mark" && "bg-mark/10 text-mark",
        tone === "muted" && "bg-ink/5 text-muted",
        className,
      )}
      {...props}
    />
  );
}
