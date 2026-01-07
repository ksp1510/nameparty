export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">NameParty</h1>
        <p className="mt-2 text-sm text-muted">
          Create an event, share a link, collect name suggestions.
        </p>
      </div>

      <a
        href="/create"
        className="block rounded-2xl border border-black/10 bg-card p-5 shadow-soft hover:opacity-95 transition"
      >
        <div className="font-semibold">Create Event</div>
        <div className="text-sm text-muted mt-1">Generate guest + admin links</div>
      </a>
    </main>
  );
}
