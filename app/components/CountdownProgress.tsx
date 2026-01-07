"use client";

import { useCountdown } from "./useCountdown";

function fmt(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

export default function CountdownProgress({
  closeAtIso,
  closeMinutes,
  label,
}: {
  closeAtIso: string;
  closeMinutes?: number | null;
  label: string;
}) {
  const totalMs = closeMinutes ? closeMinutes * 60_000 : null;
  const { remainingMs, expired, warning10s, pctRemaining } = useCountdown({
    closeAtIso,
    totalMs,
  });

  if (expired) {
    return (
      <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-3">
        <div className="font-semibold">Submissions closed</div>
      </div>
    );
  }

  if (remainingMs === null) return null;

  // If we don't know total duration (old events), show text-only.
  const showBar = pctRemaining !== null;

  return (
    <div
      className={[
        "rounded-2xl border p-3",
        warning10s ? "border-red-500/50 bg-red-500/10" : "border-black/10 bg-black/5",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium opacity-90">{label}</div>

        <div
          className={[
            "text-sm font-semibold tabular-nums",
            warning10s ? "animate-pulse" : "",
          ].join(" ")}
        >
          {fmt(remainingMs)}
        </div>
      </div>

      {showBar && (
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-black/10">
          <div
            className={[
              "h-full rounded-full transition-[width] duration-1000",
              warning10s ? "bg-red-500 animate-pulse" : "bg-black",
            ].join(" ")}
            style={{ width: `${pctRemaining}%` }}
          />
        </div>
      )}

      {warning10s && (
        <div className="mt-2 text-xs font-medium text-red-600">
          Final seconds — submit now.
        </div>
      )}
    </div>
  );
}
