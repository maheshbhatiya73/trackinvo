import React from 'react';
import Sidebar from '../components/dashboard/sidebar';
import Header from '../components/dashboard/header';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
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
    </div>
  );
}