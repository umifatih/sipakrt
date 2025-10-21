import { ReactNode } from 'react';

export default function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`rounded-2xl bg-white/90 backdrop-blur shadow-card ${className}`}>
      {children}
    </div>
  );
}
