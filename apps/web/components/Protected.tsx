'use client';
import { useEffect, useState } from 'react';
import { getAccessToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function Protected({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const t = getAccessToken();
    if (!t) router.replace('/login');
    else setOk(true);
  }, [router]);
  if (!ok) return null;
  return <>{children}</>;
}