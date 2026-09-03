import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-md border border-line bg-surface px-3 text-base text-ink outline-none",
        "placeholder:text-subtle focus-visible:border-line-strong",
        className,
      )}
      {...props}
    />
  );
}
