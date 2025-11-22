'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { BarChart3, Package, AlertCircle, TrendingUp } from 'lucide-react';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user, loading, isManager } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#24253A] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#24253A] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to StockMaster</h1>
          <p className="text-gray-400">
            {isManager ? 'You have manager access to all features.' : 'You have staff access to limited features.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#292b3b] rounded-lg border border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Products</p>
                <p className="text-3xl font-bold mt-2">0</p>
              </div>
              <Package className="w-12 h-12 text-[#b976ff] opacity-20" />
            </div>
          </div>

          <div className="bg-[#292b3b] rounded-lg border border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Low Stock Items</p>
                <p className="text-3xl font-bold mt-2">0</p>
              </div>
              <AlertCircle className="w-12 h-12 text-orange-500 opacity-20" />
            </div>
          </div>

          <div className="bg-[#292b3b] rounded-lg border border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Receipts</p>
                <p className="text-3xl font-bold mt-2">0</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-[#292b3b] rounded-lg border border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Deliveries</p>
                <p className="text-3xl font-bold mt-2">0</p>
              </div>
              <BarChart3 className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>
        </div>

        <div className="bg-[#292b3b] rounded-lg border border-gray-800 p-6">
          <h2 className="text-2xl font-bold mb-4">User Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Email:</span>
              <span className="font-semibold">{user?.email || 'Loading...'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Role:</span>
              <span className="font-semibold capitalize">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  isManager 
                    ? 'bg-[#b976ff] bg-opacity-20 text-[#b976ff]' 
                    : 'bg-green-500 bg-opacity-20 text-green-400'
                }`}>
                  {user?.role || 'Loading...'}
                </span>
              </span>
            </div>
          </div>
        </div>

        {isManager && (
          <div className="mt-8 bg-gradient-to-r from-[#b976ff] to-[#7864EF] rounded-lg border border-[#b976ff] p-6">
            <h3 className="text-xl font-bold mb-3">Manager Features</h3>
            <p className="mb-4">As a manager, you have access to:</p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Product Management - Create, update, and manage products</li>
              <li>Inventory Operations - Handle receipts, deliveries, and transfers</li>
              <li>Stock Adjustments - Make inventory adjustments</li>
              <li>Move History - View complete transaction history</li>
              <li>Settings - Configure warehouses and system settings</li>
            </ul>
          </div>
        )}

        {!isManager && (
          <div className="mt-8 bg-gradient-to-r from-green-600 to-green-700 rounded-lg border border-green-500 p-6">
            <h3 className="text-xl font-bold mb-3">Staff Features</h3>
            <p className="mb-4">As staff, you have access to:</p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>View Inventory Operations</li>
              <li>Assist with Receipts and Deliveries</li>
              <li>View Move History</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
