/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function hashAdminKey(key: string) {
  return crypto.createHash("sha256").update(key).digest("hex");
}

export async function getAdminData(slug: string, adminKey: string) {
  if (!adminKey) throw new Error("Missing admin key");

  const { data: event, error: e1 } = await supabaseAdmin
    .from("events")
    .select("id,title,is_open,admin_key_hash,close_at,close_minutes,closed_at")
    .eq("slug", slug)
    .single();

  if (e1 || !event) throw new Error("Event not found");

  if (hashAdminKey(adminKey) !== event.admin_key_hash) {
    throw new Error("Invalid admin key");
  }

  const { data: rows, error: e2 } = await supabaseAdmin
    .from("submissions")
    .select("baby_name,baby_name_norm,guest_name,gender,created_at")
    .eq("event_id", event.id)
    .order("created_at", { ascending: false });

  if (e2) throw new Error(e2.message);

  // Group by normalized baby name
  const grouped = new Map<string, any>();

  for (const r of rows || []) {
    const key = r.baby_name_norm;
    const g =
      grouped.get(key) || {
        baby_name: r.baby_name,
        baby_name_norm: key,
        count: 0,
        genders: new Set<string>(),
        guests: new Set<string>(),
      };

    g.count += 1;
    if (r.gender) g.genders.add(r.gender);
    g.guests.add(r.guest_name);

    grouped.set(key, g);
  }

  return {
    title: event.title,
    is_open: event.is_open,
    close_at: event.close_at,
    close_minutes: event.close_minutes,
    closed_at: event.closed_at,
    items: Array.from(grouped.values()).sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count; // most repeated first
      return String(a.baby_name).localeCompare(String(b.baby_name)); // alphabetical tie-break
    }),
    totalSubmissions: rows?.length ?? 0,
  };
}

export async function closeEvent(slug: string, adminKey: string): Promise<void> {
  if (!adminKey) throw new Error("Missing admin key.");

  const { data: event, error } = await supabaseAdmin
    .from("events")
    .select("id,admin_key_hash,is_open,close_at")
    .eq("slug", slug)
    .single();

  if (error || !event) throw new Error("Event not found.");
  if (hashAdminKey(adminKey) !== event.admin_key_hash) throw new Error("Invalid admin key.");

  if (!event.is_open) return;

  const { error: e2 } = await supabaseAdmin
    .from("events")
    .update({ is_open: false, closed_at: new Date().toISOString() })
    .eq("id", event.id);

  if (e2) throw new Error(e2.message);
}
