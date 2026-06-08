import { PropsWithChildren } from 'react';

export default function Chip({ tone = 'slate', children }: PropsWithChildren<{ tone?: string }>) {
  return (
    <span className={`inline-flex items-center rounded-2xl px-3 py-1.5 text-xs font-medium bg-${tone}-50 text-${tone}-700 border border-${tone}-100`}>
      {children}
    </span>
  );
}
