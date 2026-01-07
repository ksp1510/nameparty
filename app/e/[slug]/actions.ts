"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizeBabyName, normalizeGuestName } from "@/lib/normalize";

const allowedGenders = new Set(["neutral", "boy", "girl", "prefer_not"]);

export async function submitName(slug: string, formData: FormData): Promise<void> {
  const guestRaw = String(formData.get("guest_name") || "");
  const babyRaw = String(formData.get("baby_name") || "");
  const notesRaw = String(formData.get("notes") || "");
  const genderRaw = String(formData.get("gender") || "");

  const guest_name = normalizeGuestName(guestRaw);
  const baby_name = babyRaw.trim().replace(/\s+/g, " ");
  const baby_name_norm = normalizeBabyName(babyRaw);
  const notes = notesRaw.trim() ? notesRaw.trim() : null;

  const gender = allowedGenders.has(genderRaw) ? genderRaw : null;

  if (guest_name.length < 2) throw new Error("Guest name is required.");
  if (baby_name.length < 2) throw new Error("Baby name is required.");

  const { data: event, error: e1 } = await supabaseAdmin
    .from("events")
    .select("id,is_open,close_at")
    .eq("slug", slug)
    .single();

  if (e1 || !event) throw new Error("Event not found.");

  const now = Date.now();
  const closeAtMs = event.close_at ? new Date(event.close_at).getTime() : null;

  if (closeAtMs !== null && now >= closeAtMs) {
    await supabaseAdmin
      .from("events")
      .update({ is_open: false, closed_at: new Date().toISOString() })
      .eq("id", event.id);

    throw new Error("Submissions are closed.");
  }
  const { error: e2 } = await supabaseAdmin.from("submissions").insert({
    event_id: event.id,
    guest_name,
    baby_name,
    baby_name_norm,
    gender,
    notes,
  });

  if (e2) throw new Error(e2.message);
}
