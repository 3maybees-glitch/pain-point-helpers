import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/helpers", label: "The kits" },
  { to: "/pricing", label: "All-access" },
  { to: "/library", label: "My library" },
];

export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="6" className="fill-accent" />
      <path
        d="M9 8.5h7.2c3.4 0 5.6 1.9 5.6 5.1 0 3.3-2.2 5.2-5.6 5.2H12.6V23.5H9V8.5Zm3.6 7.2h3.4c1.6 0 2.5-.9 2.5-2.1s-.9-2.1-2.5-2.1h-3.4v4.2Z"
        className="fill-accent-fg"
      />
    </svg>
  );
}

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <div className="h-11 w-24 animate-pulse rounded-md bg-ink/10" />;
  if (user) return <UserButton />;
  return (
    <Button asChild variant="secondary" size="sm">
      <Link to="/login">Sign in</Link>
    </Button>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="no-print sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <Mark className="size-8" />
          <span className="font-display text-lg tracking-tight text-ink">Pain Point Helpers</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm text-muted hover:bg-ink/5 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <AuthSlot />
          </div>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/pricing">Get all-access</Link>
          </Button>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-md md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-line bg-paper px-4 py-3 md:hidden">
          <nav className="grid gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-3 py-3 text-sm text-ink hover:bg-ink/5"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex items-center gap-2">
            <AuthSlot />
            <Button asChild size="sm">
              <Link to="/pricing">Get all-access</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="no-print border-t border-line py-10 text-sm text-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between">
        <p>Pain Point Helpers · Maybee Creations</p>
        <p>Fill online. Print a clean sheet. Keep a library.</p>
      </div>
    </footer>
  );
}

export function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-h-screen flex-col bg-paper text-ink", className)}>
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
