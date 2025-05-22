'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/dashboard/sidebar';
import Header from '../components/dashboard/header';
import { AuthProvider } from '../hooks/AuthContext';

export default function DashboardLayout({ children }: { children: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return null; // or a loader while checking auth

  return (
    <div className="flex min-h-screen">
      <AuthProvider>
        <div className="fixed h-screen w-60 bg-gray-100">
          <Sidebar />
        </div>
        <div className="flex-1 ml-60">
          <div className="fixed w-[calc(100%-14rem)] top-0 z-10 ">
            <Header />
          </div>
          <main className="mt-16 p-6">
            {children}
          </main>
        </div>
      </AuthProvider>
    </div>
  );
}
