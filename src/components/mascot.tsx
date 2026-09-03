import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type MaybeePose = "wave" | "explain" | "cheer" | "think";

/** Cute clipboard bee — Maybee, house guide for Pain Point Helpers. */
export function Maybee({
  pose = "wave",
  className,
  title = "Maybee",
}: {
  pose?: MaybeePose;
  className?: string;
  title?: string;
}) {
  const wave = pose === "wave";
  const cheer = pose === "cheer";
  const think = pose === "think";
  const explain = pose === "explain";

  return (
    <svg
      viewBox="0 0 200 220"
      className={cn("overflow-visible", className)}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <ellipse cx="100" cy="208" rx="48" ry="8" fill="#1c1814" opacity="0.1" />

      {/* Wings */}
      <g className={cheer ? "origin-[100px_88px]" : undefined}>
        <ellipse cx="48" cy="92" rx="28" ry="42" fill="#fff8e8" stroke="#ddd4c6" strokeWidth="2" opacity="0.92" transform="rotate(-18 48 92)" />
        <ellipse cx="152" cy="92" rx="28" ry="42" fill="#fff8e8" stroke="#ddd4c6" strokeWidth="2" opacity="0.92" transform="rotate(18 152 92)" />
        <ellipse cx="52" cy="88" rx="12" ry="18" fill="#ffffff" opacity="0.55" transform="rotate(-18 52 88)" />
        <ellipse cx="148" cy="88" rx="12" ry="18" fill="#ffffff" opacity="0.55" transform="rotate(18 148 88)" />
      </g>

      {/* Antennae */}
      <g stroke="#3d2a1a" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M82 52 C76 34 70 28 64 24" />
        <path d="M118 52 C124 34 130 28 136 24" />
      </g>
      <circle cx="64" cy="22" r="7" fill="#f4b942" stroke="#3d2a1a" strokeWidth="2" />
      <circle cx="136" cy="22" r="7" fill="#f4b942" stroke="#3d2a1a" strokeWidth="2" />

      {/* Body */}
      <ellipse cx="100" cy="128" rx="54" ry="62" fill="#f4b942" />
      <path d="M50 112 Q100 98 150 112" fill="#f4b942" />
      <path d="M48 124 C48 118, 152 118, 152 124 L148 138 C148 132, 52 132, 52 138 Z" fill="#3d2a1a" />
      <path d="M50 154 C50 148, 150 148, 150 154 L146 168 C146 162, 54 162, 54 168 Z" fill="#3d2a1a" />
      <ellipse cx="100" cy="188" rx="10" ry="8" fill="#3d2a1a" />

      {/* Face blush + eyes */}
      <ellipse cx="72" cy="108" rx="10" ry="6" fill="#f2a08a" opacity="0.7" />
      <ellipse cx="128" cy="108" rx="10" ry="6" fill="#f2a08a" opacity="0.7" />
      <ellipse cx="78" cy="96" rx="13" ry="15" fill="#fffef9" />
      <ellipse cx="122" cy="96" rx="13" ry="15" fill="#fffef9" />
      <circle cx="80" cy="98" r="6" fill="#1c1814" />
      <circle cx="124" cy="98" r="6" fill="#1c1814" />
      <circle cx="82" cy="95" r="2.2" fill="#fffef9" />
      <circle cx="126" cy="95" r="2.2" fill="#fffef9" />
      <path
        d={think ? "M92 122 Q100 126 108 122" : "M90 120 Q100 130 110 120"}
        fill="none"
        stroke="#3d2a1a"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Arms + clipboard */}
      {cheer ? (
        <g stroke="#f4b942" strokeWidth="10" strokeLinecap="round" fill="none">
          <path d="M54 130 C36 110 30 78 38 58" />
          <path d="M146 130 C164 110 170 78 162 58" />
        </g>
      ) : null}
      {wave ? (
        <g>
          <path d="M54 132 C34 120 28 88 42 68" fill="none" stroke="#f4b942" strokeWidth="10" strokeLinecap="round" />
          <circle cx="44" cy="62" r="8" fill="#f4b942" />
          <path d="M146 136 C168 148 176 168 168 184" fill="none" stroke="#f4b942" strokeWidth="10" strokeLinecap="round" />
          <g transform="translate(154 168) rotate(-12)">
            <rect x="0" y="0" width="36" height="44" rx="4" fill="#2f4a40" />
            <rect x="4" y="6" width="28" height="34" rx="2" fill="#fffef9" />
            <path d="M8 14h20M8 20h16M8 26h18" stroke="#c9bead" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>
      ) : null}
      {explain ? (
        <g>
          <path d="M50 136 C28 142 18 150 22 168" fill="none" stroke="#f4b942" strokeWidth="10" strokeLinecap="round" />
          <path d="M150 134 C172 128 186 118 188 102" fill="none" stroke="#f4b942" strokeWidth="10" strokeLinecap="round" />
          <g transform="translate(162 78) rotate(8)">
            <rect x="0" y="0" width="42" height="52" rx="4" fill="#2f4a40" />
            <rect x="5" y="7" width="32" height="40" rx="2" fill="#fffef9" />
            <path d="M10 16h22M10 23h18M10 30h20" stroke="#8a8276" strokeWidth="2" strokeLinecap="round" />
            <circle cx="21" cy="40" r="3" fill="#8a4030" />
          </g>
        </g>
      ) : null}
      {think ? (
        <g>
          <path d="M52 138 C30 150 36 172 58 176" fill="none" stroke="#f4b942" strokeWidth="10" strokeLinecap="round" />
          <circle cx="62" cy="176" r="8" fill="#f4b942" />
          <path d="M148 136 C170 142 176 158 168 176" fill="none" stroke="#f4b942" strokeWidth="10" strokeLinecap="round" />
          <circle cx="164" cy="180" r="7" fill="#f4b942" />
        </g>
      ) : null}
    </svg>
  );
}

/** Tight face mark for the header. */
export function MaybeeFace({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#2f4a40" />
      <ellipse cx="18" cy="30" rx="8" ry="14" fill="#fff8e8" opacity="0.85" />
      <ellipse cx="46" cy="30" rx="8" ry="14" fill="#fff8e8" opacity="0.85" />
      <circle cx="32" cy="36" r="18" fill="#f4b942" />
      <path d="M16 36h32" stroke="#3d2a1a" strokeWidth="5" />
      <circle cx="25" cy="32" r="5" fill="#fffef9" />
      <circle cx="39" cy="32" r="5" fill="#fffef9" />
      <circle cx="26" cy="33" r="2.4" fill="#1c1814" />
      <circle cx="40" cy="33" r="2.4" fill="#1c1814" />
      <path d="M28 42q4 4 8 0" fill="none" stroke="#3d2a1a" strokeWidth="2" strokeLinecap="round" />
      <circle cx="22" cy="14" r="3.2" fill="#f4b942" />
      <circle cx="42" cy="14" r="3.2" fill="#f4b942" />
      <path d="M26 20 L22 15" stroke="#f4b942" strokeWidth="2" />
      <path d="M38 20 L42 15" stroke="#f4b942" strokeWidth="2" />
    </svg>
  );
}

export function MascotTip({
  children,
  pose = "explain",
  size = "md",
  className,
  label = "Maybee says",
}: {
  children: ReactNode;
  pose?: MaybeePose;
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}) {
  const bee =
    size === "lg" ? "size-28 sm:size-36" : size === "sm" ? "size-16 sm:size-20" : "size-20 sm:size-24";

  return (
    <aside
      className={cn(
        "no-print flex items-start gap-3 rounded-2xl border border-line bg-wash/70 p-3 sm:items-center sm:gap-4 sm:p-4",
        className,
      )}
    >
      <Maybee pose={pose} className={cn("shrink-0", bee)} />
      <div className="min-w-0 flex-1">
        <p className="font-display text-base text-accent sm:text-lg">{label}</p>
        <div className="mt-1 text-base leading-relaxed text-ink sm:text-lg">{children}</div>
      </div>
    </aside>
  );
}
