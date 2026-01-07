import { createEvent } from "./actions";

export default async function CreatePage() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 720 }}>
      <h1>Create Event</h1>

      <form action={createEvent} style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Event title</span>
          <input name="title" placeholder="Baby Shower Name Suggestions" required minLength={3} />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Create password</span>
          <input name="password" type="password" required />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
        <span>Auto-close after (minutes)</span>
        <input
            name="close_minutes"
            type="number"
            min={1}
            max={1440}
            placeholder="e.g., 120"
        />
        </label>

        <button type="submit">Create</button>
      </form>

      <p style={{ marginTop: 16, opacity: 0.7 }}>
        After creating, you’ll get a Guest link + Admin link. Save the Admin link.
      </p>
    </main>
  );
}
