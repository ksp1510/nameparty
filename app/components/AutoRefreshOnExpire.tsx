"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCountdown } from "./useCountdown";

export default function AutoRefreshOnExpire({
  closeAtIso,
}: {
  closeAtIso: string;
}) {
  const router = useRouter();
  const { expired } = useCountdown({ closeAtIso, totalMs: null });

  useEffect(() => {
    if (expired) router.refresh();
  }, [expired, router]);

  return null;
}
