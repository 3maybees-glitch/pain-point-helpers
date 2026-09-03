import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-md border border-line bg-surface px-3 py-2 text-base text-ink outline-none",
        "placeholder:text-subtle focus-visible:border-line-strong",
        className,
      )}
      {...props}
    />
  );
}
