"use server";

import crypto from "crypto";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function slugifyShort(len = 8) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function hashAdminKey(key: string) {
  return crypto.createHash("sha256").update(key).digest("hex");
}

export async function createEvent(formData: FormData): Promise<void> {
  const password = String(formData.get("password") || "");
  if (!process.env.CREATE_EVENT_PASSWORD || password !== process.env.CREATE_EVENT_PASSWORD) {
    throw new Error("Invalid create password.");
  }

  const title = String(formData.get("title") || "").trim();
  if (title.length < 3) throw new Error("Title must be at least 3 characters.");

  const slug = slugifyShort(8);
  const adminKey = crypto.randomBytes(24).toString("base64url");
  const admin_key_hash = hashAdminKey(adminKey);

  const closeMinutesRaw = String(formData.get("close_minutes") || "").trim();
  const closeMinutes = closeMinutesRaw ? Number(closeMinutesRaw) : null;

  if (closeMinutes !== null && (!Number.isFinite(closeMinutes) || closeMinutes < 1 || closeMinutes > 1440)) {
    throw new Error("Close minutes must be between 1 and 1440.");
  }

  const close_at = closeMinutes ? new Date(Date.now() + closeMinutes * 60_000).toISOString() : null;


  const { data, error } = await supabaseAdmin
    .from("events")
    .insert({ slug, title, admin_key_hash, close_at, close_minutes: closeMinutes })
    .select("slug,title")
    .single();

  if (error) throw new Error(error.message);

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const guestUrl = `${base}/e/${data.slug}`;
  const adminUrl = `${base}/admin/${data.slug}?key=${adminKey}`;

  redirect(
    `/create/success?title=${encodeURIComponent(data.title)}&guest=${encodeURIComponent(
      guestUrl
    )}&admin=${encodeURIComponent(adminUrl)}`
  );
}
