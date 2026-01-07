import { supabaseAdmin } from "@/lib/supabaseAdmin";
import GuestForm from "./ui";
import CountdownProgress from "@/app/components/CountdownProgress";

export default async function GuestPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: event } = await supabaseAdmin
    .from("events")
    .select("title,is_open,close_at,close_minutes")
    .eq("slug", slug)
    .single();

  if (!event) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold">Event not found</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-4">
      <div>
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <p className="mt-2 text-sm text-muted">
          Submit a baby name suggestion. Duplicates are allowed.
        </p>
      </div>

      {event.close_at && event.is_open && (
        <CountdownProgress
          label="Submissions closing in"
          closeAtIso={event.close_at}
          closeMinutes={event.close_minutes}
        />
      )}

      {!event.is_open ? (
        <div className="rounded-2xl border border-danger/30 bg-danger-soft p-4">
          <div className="font-semibold text-danger">Submissions are closed.</div>
          <div className="mt-1 text-sm text-muted">
            The timer ended or the host closed the event.
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-black/10 bg-card p-5 shadow-soft">
          <GuestForm
            slug={slug}
            isOpen={event.is_open}
            closeAtIso={event.close_at}
            closeMinutes={event.close_minutes}
          />
        </div>
      )}
    </main>
  );
}
