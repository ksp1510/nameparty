import type { ButtonHTMLAttributes } from "react";

export default function Button(
  props: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "danger" }
) {
  const { variant = "primary", className = "", ...rest } = props;

  const base =
    "rounded-xl px-4 py-2 font-medium transition disabled:opacity-60 disabled:cursor-not-allowed";

  const styles =
    variant === "danger"
      ? "bg-danger text-white hover:opacity-90"
      : "bg-primary hover:bg-primary/90 shadow-soft text-white hover:opacity-90";

  return <button {...rest} className={`${base} ${styles} ${className}`} />;
}
