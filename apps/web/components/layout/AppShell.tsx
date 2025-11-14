'use client';

import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import PublicLayout from './PublicLayout';
import PrivateLayout from './PrivateLayout';
import LoginPage from '@/app/login/page';

const PUBLIC_ROUTES = ['/login', '/register'];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const isPublicRoute = PUBLIC_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`)
  );

  if (!accessToken) {
    return <PublicLayout><LoginPage /></PublicLayout>;
  }

  return <PrivateLayout>{children}</PrivateLayout>;
}