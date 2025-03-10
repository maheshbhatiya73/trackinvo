"use client"
import { useToast } from '@/app/Context/ToastContext';
import { api } from '@/app/lib/api';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const ManagerProfile = () => {
  const router = useRouter();
  const { id } = useParams();
  const [managerData, setManagerData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast()

  useEffect(() => {
    const fetchManagerById = async () => {
      try {
        setIsLoading(true);
        const data = await api.getUsersById(id); 
        setManagerData(data.user);
      } catch (error) {
        console.error('Error fetching manager:', error);
        router.push('/users');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchManagerById();
    }
  }, [id, router]);

  if (isLoading || !managerData) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="min-h-screen  dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <img 
                src={managerData?.avatar || "https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png"} 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-blue-100 dark:border-gray-600 shadow-lg"
              />
              <span className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {managerData?.username}
              </h1>
              <p className="text-xl text-blue-600 dark:text-blue-400 font-medium mb-4">
                {managerData?.role} Manager
              </p>
              
              <div className="flex items-center justify-center md:justify-start gap-4">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  managerData?.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                }`}>
                  {managerData?.status || "active"}
                </span>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Last login: {managerData?.lastLogin}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{managerData?.teamSize}</p>
                <p className="text-gray-600 dark:text-gray-300">Team Members</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{managerData?.completedTasks}</p>
                <p className="text-gray-600 dark:text-gray-300">Completed Tasks</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-xl">
                <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{managerData?.pendingTasks}</p>
                <p className="text-gray-600 dark:text-gray-300">Pending Tasks</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{managerData?.performance}%</p>
                <p className="text-gray-600 dark:text-gray-300">Performance</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Information</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div>
                  <p className="text-gray-500 dark:text-gray-300 text-sm">Email Address</p>
                  <p className="font-medium text-gray-900 dark:text-white">{managerData?.email}</p>
                </div>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div>
                  <p className="text-gray-500 dark:text-gray-300 text-sm">Password</p>
                  <p className="font-medium text-gray-900 dark:text-white">••••••••</p>
                </div>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  Change
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Security</h2>
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                    <p className="text-gray-500 dark:text-gray-300 text-sm">Add extra security to your account</p>
                  </div>
                </div>
                <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Enable 2FA
                </button>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Login History</p>
                    <p className="text-gray-500 dark:text-gray-300 text-sm">Last login: {managerData.lastLogin}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerProfile;