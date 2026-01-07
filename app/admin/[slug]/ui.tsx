"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { closeEvent } from "./actions";

export default function CloseButton({ slug, adminKey, isOpen }: { slug: string; adminKey: string; isOpen: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <button
      onClick={() => {
        startTransition(async () => {
          await closeEvent(slug, adminKey);
          router.refresh();
        });
      }}
      disabled={isPending}
      style={{ padding: "8px 12px" }}
    >
      {isPending ? "Closing..." : "Close submissions"}
    </button>
  );
}
