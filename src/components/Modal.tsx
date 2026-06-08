'use client';
import { PropsWithChildren } from "react";

export default function Modal({
  open, title, onClose, children, footer,
}: PropsWithChildren<{ open: boolean; title?: string; onClose: () => void; footer?: React.ReactNode }>) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div className="font-semibold">{title}</div>
          <button onClick={onClose} className="rounded-md border border-slate-200 px-2 py-1 text-sm">Tutup</button>
        </div>
        <div className="mt-4">{children}</div>
        {footer && <div className="mt-4 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
