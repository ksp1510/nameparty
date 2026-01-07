import type { InputHTMLAttributes } from "react";

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <input
      {...rest}
      className={`rounded-xl border border-black/10 bg-transparent p-2 focus:outline-none focus:ring-2 focus:ring-primary/40 ${className}`}
    />
  );
}
