"use client";

import { useCountdown } from "./useCountdown";

function formatRemaining(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

export default function Countdown({ closeAtIso, totalMs }: { closeAtIso: string; totalMs: number }) {
  const { remainingMs, expired } = useCountdown({ closeAtIso, totalMs });

  if (expired) return <span>Submissions closed</span>;
  if (remainingMs === null) return null;

  return <span><strong>{formatRemaining(remainingMs)}</strong></span>;
}
