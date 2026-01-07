export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card shadow-soft border border-black/10 p-5">
      {children}
    </div>
  );
}
