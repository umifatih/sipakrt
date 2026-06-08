import { PropsWithChildren } from 'react';

export default function Badge({ color = 'slate', children }: PropsWithChildren<{ color?: string }>) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-${color}-100 text-${color}-800`}>
      {children}
    </span>
  );
}
