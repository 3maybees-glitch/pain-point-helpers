import { useEffect, useState } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMembership, type Membership } from "@/lib/server/membership";

export function useMembership() {
  const { user, isPending: userPending } = useCurrentUserState();
  const userId = user?.id ?? null;
  const [member, setMember] = useState<Membership | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!userId) {
      setMember(null);
      setReady(!userPending);
      return;
    }
    getMembership()
      .then((m) => {
        if (!cancelled) setMember(m);
      })
      .catch(() => {
        if (!cancelled) setMember(null);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, userPending]);

  return { member, isMember: Boolean(member), ready, user, userPending };
}
