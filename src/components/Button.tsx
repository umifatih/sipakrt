import { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type Variant = 'primary' | 'ghost' | 'outline';

export default function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & { variant?: Variant }) {
  const base =
    'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2';
  const styles: Record<Variant, string> = {
    primary: 'bg-brand text-white hover:bg-brand-700 focus:ring-brand/40 focus:ring-offset-white',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-300 focus:ring-offset-white',
    outline: 'border border-slate-200 text-slate-800 hover:bg-slate-50 focus:ring-slate-300',
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
