/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAdminData } from "./actions";
import CountdownProgress from "@/app/components/CountdownProgress";
import AutoRefreshOnExpire from "@/app/components/AutoRefreshOnExpire";


export default async function AdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ key?: string }>;
}) {
  const { slug } = await params;
  const { key } = await searchParams;

  let data;
  try {
    data = await getAdminData(slug, key || "");
  } catch (err: any) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Access denied</h1>
        <p>{err.message}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 900 }}>
      <h1>{data.title}</h1>
      <p style={{ opacity: 0.7 }}>
        Total submissions: {data.totalSubmissions}
      </p>

      {data.close_at && data.is_open && (
        <div className="mt-4 space-y-2">
            <CountdownProgress
            label="Auto-closes in"
            closeAtIso={data.close_at}
            closeMinutes={data.close_minutes}
            />
            <AutoRefreshOnExpire closeAtIso={data.close_at} />
        </div>
        )}


      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: 20,
        }}
      >
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Count</th>
            <th align="left">Gender tags</th>
            <th align="left">Guests</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((row: any) => (
            <tr key={row.baby_name_norm ?? row.baby_name} style={{ borderTop: "1px solid #333" }}>
              <td>{row.baby_name}</td>
              <td>{row.count}</td>
              <td>{Array.from(row.genders).join(", ") || "—"}</td>
              <td>{Array.from(row.guests).join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
