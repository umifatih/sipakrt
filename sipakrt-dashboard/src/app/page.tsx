'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const router = useRouter();
  const [canShow, setCanShow] = useState(false);

  useEffect(() => {
    const logged = typeof window !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true';
    if (!logged) {
      router.replace('/login');      // belum login -> ke /login
    } else {
      setCanShow(true);              // sudah login -> boleh render dashboard
    }
  }, [router]);

  if (!canShow) return null;         // hindari flicker
  return <Dashboard />;
}
