"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export function useCountdown(opts: {
  closeAtIso?: string | null;
  totalMs?: number | null;
}) {
  const closeAtMs = useMemo(
    () => (opts.closeAtIso ? new Date(opts.closeAtIso).getTime() : null),
    [opts.closeAtIso]
  );

  const totalMs = opts.totalMs ?? null;

  // SSR: window is undefined => null => placeholder
  // Client: window exists => initialize immediately to Date.now() WITHOUT useEffect
  const [nowMs, setNowMs] = useState<number | null>(() => {
    return typeof window === "undefined" ? null : Date.now();
  });

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const t = setInterval(() => {
      if (mountedRef.current) setNowMs(Date.now());
    }, 1000);

    return () => {
      mountedRef.current = false;
      clearInterval(t);
    };
  }, []);

  if (nowMs === null || closeAtMs === null) {
    return {
      remainingMs: null as number | null,
      expired: false,
      warning10s: false,
      pctRemaining: null as number | null,
    };
  }

  const remainingMs = Math.max(0, closeAtMs - nowMs);
  const expired = remainingMs <= 0;
  const warning10s = remainingMs > 0 && remainingMs <= 10_000;

  const pctRemaining =
    !totalMs ? null : Math.max(0, Math.min(100, (remainingMs / totalMs) * 100));

  return { remainingMs, expired, warning10s, pctRemaining };
}
