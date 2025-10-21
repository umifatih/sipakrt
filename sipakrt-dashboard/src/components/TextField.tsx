'use client';
import { InputHTMLAttributes } from "react";

export default function TextField({
  label, hint, className = "", ...props
}: { label?: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`grid gap-1 ${className}`}>
      {label && <span className="text-sm text-slate-700">{label}</span>}
      <input
        {...props}
        className={`rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30`}
      />
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
    </label>
  );
}
