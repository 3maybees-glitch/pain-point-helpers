/**
 * Same-origin path only. Rejects protocol-relative (`//evil`), backslash,
 * and embedded schemes so post-login `window.location` / OAuth callbackURL
 * cannot leave the app.
 */
export function safeInternalPath(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const path = value.trim();
  if (!path.startsWith("/")) return fallback;
  if (path.startsWith("//")) return fallback;
  if (path.includes("\\") || path.includes("://")) return fallback;
  return path;
}
