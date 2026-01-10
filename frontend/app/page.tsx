import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to Fluid Intelligence
          </h1>
          <p className="text-gray-400 text-lg">
            Select a client to access their dashboard
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Standard Chartered Card */}
          <div className="group relative bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-2xl p-8 hover:border-indigo-400/50 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative w-24 h-24 bg-white/5 rounded-xl p-4 group-hover:bg-white/10 transition-colors flex items-center justify-center">
                <Image
                  src="/stanchart.png"
                  alt="Standard Chartered Logo"
                  width={64}
                  height={64}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
              <h2 className="text-2xl font-semibold text-white group-hover:text-indigo-300 transition-colors">
                Standard Chartered
              </h2>
              <div className="flex flex-col space-y-2 w-full">
                <Link 
                  href="/standard-chartered"
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors hover:underline"
                >
                  Unified Dashboard
                </Link>
                <Link 
                  href="/standard-chartered/compliance-fci"
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors hover:underline"
                >
                  Compliance Dashboard
                </Link>
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-300 pointer-events-none" />
          </div>

          {/* Swedbank Card */}
          <div className="group relative bg-gradient-to-br from-orange-900/20 to-yellow-900/20 border border-orange-500/30 rounded-2xl p-8 hover:border-orange-400/50 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative w-24 h-24 bg-white/5 rounded-xl p-4 group-hover:bg-white/10 transition-colors">
                <Image
                  src="/swedbank.png"
                  alt="Swedbank Logo"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <h2 className="text-2xl font-semibold text-white group-hover:text-orange-300 transition-colors">
                Swedbank
              </h2>
              <div className="flex flex-col space-y-2 w-full">
                <Link 
                  href="/swedbank"
                  className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors hover:underline"
                >
                  Unified Dashboard
                </Link>
                <Link 
                  href="/swedbank/compliance-fci"
                  className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors hover:underline"
                >
                  Compliance Dashboard
                </Link>
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/0 to-yellow-500/0 group-hover:from-orange-500/10 group-hover:to-yellow-500/10 transition-all duration-300 pointer-events-none" />
          </div>

          {/* Flipkart Card */}
          <Link 
            href="/flipkart"
            className="group relative bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-2xl p-8 hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative w-24 h-24 bg-white/5 rounded-xl p-4 group-hover:bg-white/10 transition-colors">
                <Image
                  src="/flipkartlogo.png"
                  alt="Flipkart Logo"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <h2 className="text-2xl font-semibold text-white group-hover:text-blue-300 transition-colors">
                Flipkart
              </h2>
              <p className="text-gray-400 text-sm">
                Access Flipkart dashboard
              </p>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
}
