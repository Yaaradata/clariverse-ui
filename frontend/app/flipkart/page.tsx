'use client';

import Image from 'next/image';
import Link from 'next/link';

/**
 * Flipkart landing page – same pattern as banks: two buttons for Unified Dashboard and Compliance Dashboard.
 */
export default function FlipkartPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="group relative bg-linear-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-2xl p-8 hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative w-24 h-24 bg-white/5 rounded-xl p-4 group-hover:bg-white/10 transition-colors flex items-center justify-center">
              <Image
                src="/flipkartlogo.png"
                alt="Flipkart Logo"
                width={80}
                height={80}
                className="object-contain max-w-full max-h-full"
              />
            </div>
            <h2 className="text-2xl font-semibold text-white group-hover:text-blue-300 transition-colors">
              Flipkart
            </h2>
            <p className="text-gray-400 text-sm">
              Select a dashboard to continue
            </p>
            <div className="flex flex-col space-y-2 w-full">
              <Link
                href="/flipkart/main-page"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105"
              >
                Unified Dashboard
              </Link>
              <Link
                href="/flipkart/comp"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105"
              >
                Compliance Dashboard
              </Link>
            </div>
          </div>
          <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
