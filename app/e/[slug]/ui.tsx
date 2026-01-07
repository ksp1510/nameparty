/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { submitName } from "./actions";
import { useCountdown } from "@/app/components/useCountdown";

export default function GuestForm({
  slug,
  closeMinutes,
  closeAtIso,
  isOpen,
}: {
  slug: string;
  closeMinutes?: number;
  closeAtIso?: string;
  isOpen?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState<string>("");

  const [guestName, setGuestName] = useState("");
  const [babyName, setBabyName] = useState("");
  const [gender, setGender] = useState("");
  const [notes, setNotes] = useState("");

  const totalMs = closeMinutes ? closeMinutes * 60_000 : null;
  const { expired } = useCountdown({ closeAtIso: closeAtIso ?? null, totalMs });
  const locked = !isOpen || expired;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    setErrMsg("");

    const fd = new FormData();
    fd.set("guest_name", guestName);
    fd.set("baby_name", babyName);
    fd.set("gender", gender);
    fd.set("notes", notes);

    startTransition(async () => {
      try {
        await submitName(slug, fd);
        setStatus("ok");
        setBabyName("");
        setNotes("");
        setGender("");
      } catch (err: any) {
        setStatus("err");
        setErrMsg(err?.message || "Something went wrong.");
      }
    });
  }

  const fieldBase =
    "rounded-xl border border-black/10 bg-transparent p-2 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <div className="space-y-4">
      {locked && (
        <div className="rounded-2xl border border-danger/30 bg-danger-soft p-4">
          <div className="font-semibold text-danger">Submissions are closed.</div>
          <div className="mt-1 text-sm text-muted">
            The timer ended or the host closed the event.
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-medium">
            Guest name <span className="text-danger">*</span>
          </span>
          <input
            className={fieldBase}
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
            minLength={2}
            placeholder="Your name"
            disabled={locked || isPending}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium">
            Baby name suggestion <span className="text-danger">*</span>
          </span>
          <input
            className={fieldBase}
            value={babyName}
            onChange={(e) => setBabyName(e.target.value)}
            required
            minLength={2}
            placeholder="e.g., Aarav"
            disabled={locked || isPending}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium">Gender (optional)</span>
          <select
            className={fieldBase}
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            disabled={locked || isPending}
          >
            <option value="">—</option>
            <option value="neutral">Neutral</option>
            <option value="boy">Boy</option>
            <option value="girl">Girl</option>
            <option value="prefer_not">Prefer not to say</option>
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium">Notes (optional)</span>
          <textarea
            className={`${fieldBase} resize-y`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Meaning / why you like it"
            rows={3}
            disabled={locked || isPending}
          />
        </label>

        <button
          type="submit"
          disabled={locked || isPending}
          className="rounded-xl bg-primary px-4 py-2 font-medium text-white transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Submitting..." : "Submit 🎉"}
        </button>

        {status === "ok" && (
          <div className="rounded-2xl border border-success/30 bg-success-soft p-3">
            <div className="font-semibold text-success">Saved</div>
            <div className="text-sm text-muted">Add another if you want.</div>
          </div>
        )}

        {status === "err" && (
          <div className="rounded-2xl border border-danger/30 bg-danger-soft p-3">
            <div className="font-semibold text-danger">Could not save</div>
            <div className="text-sm text-muted">{errMsg}</div>
          </div>
        )}
      </form>
    </div>
  );
}
