'use client';

import { usePathname } from 'next/navigation';
import { AdminProviders } from './providers/AdminProviders';
import { MemberProviders } from './providers/MemberProviders';

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <AdminProviders>{children}</AdminProviders>;
  }

  return <MemberProviders>{children}</MemberProviders>;
} 