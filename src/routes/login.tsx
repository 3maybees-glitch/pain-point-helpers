import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mark } from "@/components/site-chrome";
import { safeInternalPath } from "@/lib/safe-path";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string } => {
    const out: { redirect?: string } = {};
    if (typeof s.redirect === "string") out.redirect = s.redirect;
    return out;
  },
  component: Login,
});

function Login() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const next = safeInternalPath(redirect, "/library");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({ email, password, name: name || email.split("@")[0]! });
        if (err) throw new Error(err.message);
      } else {
        const { error: err } = await authClient.signIn.email({ email, password });
        if (err) throw new Error(err.message);
      }
      await navigate({ to: next });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto grid max-w-md px-4 py-16">
      <div className="flex items-center gap-2">
        <Mark className="size-8" />
        <h1 className="font-display text-2xl text-ink">Sign in</h1>
      </div>
      <p className="mt-2 text-sm text-muted">Save filled helpers, print, and share from your library.</p>

      {!authEnabled ? (
        <p className="mt-6 text-sm text-muted">Sign-in is disabled.</p>
      ) : (
        <>
          <div className="mt-8 grid gap-3">
            {GROK_PROVIDERS.map((p) => (
              <Button key={p.providerId} type="button" variant="secondary" onClick={() => signIn(p.providerId, { callbackURL: next })}>
                Continue with {p.label}
              </Button>
            ))}
          </div>
          <p className="my-6 text-center text-xs uppercase tracking-widest text-subtle">or email</p>
          <form className="grid gap-3" onSubmit={onEmail}>
            {mode === "up" ? (
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </div>
            ) : null}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" className="mt-1.5" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" className="mt-1.5" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "up" ? "new-password" : "current-password"} />
            </div>
            {error ? <p className="text-sm text-mark">{error}</p> : null}
            <Button type="submit" disabled={busy}>
              {busy ? "Working…" : mode === "up" ? "Create account" : "Sign in"}
            </Button>
          </form>
          <button
            type="button"
            className="mt-4 text-sm text-muted underline-offset-2 hover:text-ink hover:underline"
            onClick={() => setMode(mode === "up" ? "in" : "up")}
          >
            {mode === "up" ? "Already have an account? Sign in" : "Need an account? Create one"}
          </button>
        </>
      )}
      <p className="mt-8 text-sm text-subtle">
        <Link to="/" className="underline-offset-2 hover:underline">
          Back home
        </Link>
      </p>
    </main>
  );
}
