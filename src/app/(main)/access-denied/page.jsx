'use client';

import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

export default function AccessDenied() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#24253A] flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-[#292b3b] rounded-xl shadow-lg border border-gray-800 p-8">
          <span className="inline-flex justify-center items-center w-16 h-16 rounded-xl mb-6 bg-red-500 bg-opacity-15">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </span>
          
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">
            You don't have permission to access this page. Only managers can view this section.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-gradient-to-r from-[#b976ff] to-[#7864EF] text-white font-bold py-3 rounded-lg hover:opacity-90 transition-all"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.back()}
              className="w-full bg-[#24253A] border border-gray-700 text-gray-300 font-bold py-3 rounded-lg hover:bg-[#2d2f3b] transition-all"
            >
              Go Back
            </button>
          </div>
        </div>
        
        <p className="text-center text-gray-600 text-xs mt-6">
          © 2025 StockMaster. All rights reserved.
        </p>
      </div>
    </div>
  );
}
