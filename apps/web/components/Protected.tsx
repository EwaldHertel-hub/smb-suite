'use client';
import { useEffect, useState } from 'react';
import { getAccessToken } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';

export default function Protected({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = getAccessToken();
    if (!token){
      const redirectTo = encodeURIComponent(pathname || "/dashboard");
      router.replace(`/login?redirectTo=${redirectTo}`);
    }else{
      setAllowed(true);
    }
  }, [router, pathname]);
   if (!allowed) {
    return (
      <div className="card">
        <p>Prüfe Anmeldung...</p>
      </div>
    );
  }

  return <>{children}</>;
}