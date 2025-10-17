"use client";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireAffiliate?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  requireAffiliate = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isAffiliate, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }

    if (!loading && isAuthenticated) {
      if (requireAdmin && !isAdmin) {
        router.push('/');
      }
      if (requireAffiliate && !isAffiliate) {
        router.push('/');
      }
    }
  }, [isAuthenticated, isAdmin, isAffiliate, loading, requireAdmin, requireAffiliate, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    return null;
  }

  if (requireAffiliate && !isAffiliate) {
    return null;
  }

  return <>{children}</>;
}
