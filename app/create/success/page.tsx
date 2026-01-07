import QrCode from "@/app/components/QrCode";

export default async function CreateSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ title?: string; guest?: string; admin?: string }>;
}) {
  const sp = await searchParams;

  const title = sp.title || "Event";
  const guest = sp.guest || "";
  const admin = sp.admin || "";

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Event Created</h1>
        <p className="mt-2 text-sm text-muted">
          Save the admin link. Share the guest link/QR.
        </p>
      </div>

      <div className="rounded-2xl border border-black/10 bg-card p-5 shadow-soft">
        <div className="text-sm font-medium text-muted">Event</div>
        <div className="mt-1 text-xl font-semibold">{title}</div>
      </div>

      <div className="grid gap-4">
        <div className="rounded-2xl border border-black/10 bg-card p-5 shadow-soft">
          <div className="font-semibold">Guest link</div>
          <div className="break-all mt-2 text-sm">{guest}</div>

          <div className="mt-4">
            <div className="mb-2 text-sm text-muted">
              Scan this QR for the Guest link
            </div>
            <QrCode value={guest} />
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-card p-5 shadow-soft">
          <div className="font-semibold">Admin link (save this)</div>
          <div className="break-all mt-2 text-sm">{admin}</div>
          <p className="mt-2 text-sm text-muted">
            If you lose this link, you can’t recover the admin key (by design).
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-primary-soft p-4">
        <div className="font-medium">Next</div>
        <p className="mt-1 text-sm text-muted">
          Open the guest link on your phone and test a submission.
        </p>
      </div>
    </main>
  );
}
