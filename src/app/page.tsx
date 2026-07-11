import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#050505] font-sans text-gray-100 selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-indigo-500/30">
              <Image 
                src="/icon-192x192.png" 
                alt="NuFrame Logo" 
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              NuFrame
            </span>
            <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              Creator OS
            </span>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              The Vault
            </Link>
            <Link href="/studio" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              The Studio
            </Link>
            <Link 
              href="/dashboard" 
              className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 hover:scale-[1.02]"
            >
              Open Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />
          <div className="absolute top-1/3 left-1/3 -z-10 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-[100px]" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-b from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
              Command Center for <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Social Media Creators
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
              A unified operating workspace to design seamless panoramic carousels, store assets in your own cloud drives, and publish directly across all networks.
            </p>
            
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/studio"
                className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 hover:opacity-90 transition-all hover:scale-[1.03] duration-200"
              >
                Create Panoramic Carousel
              </Link>
              <Link href="/dashboard" className="text-base font-semibold leading-6 text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                Explore Vault <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Pillar A: The Studio */}
            <div className="relative group overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/20 hover:bg-white/[0.04]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 mb-4 group-hover:bg-indigo-500/20 transition-colors">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122l9.37-9.37m0 0l-2.25-2.25m2.25 2.25v2.25m-9.37 9.37L3 21l1.878-5.282 9.37-9.37z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">The Studio</h3>
              <p className="mt-2 text-sm text-gray-400">
                Design stunning panoramas with our automated carousel swipe mathematics. No manual alignments needed.
              </p>
            </div>

            {/* Pillar B: The Vault */}
            <div className="relative group overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/20 hover:bg-white/[0.04]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 mb-4 group-hover:bg-purple-500/20 transition-colors">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a9 9 0 1116.5 0" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">The Vault</h3>
              <p className="mt-2 text-sm text-gray-400">
                Integrate directly with your own Google Drive. Zero host-side files locking, total data ownership.
              </p>
            </div>

            {/* Pillar C: The Broadcaster */}
            <div className="relative group overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:border-pink-500/20 hover:bg-white/[0.04]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400 mb-4 group-hover:bg-pink-500/20 transition-colors">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Broadcaster</h3>
              <p className="mt-2 text-sm text-gray-400">
                Schedule and auto-resize creations. Push directly to Instagram and WhatsApp through structured pipelines.
              </p>
            </div>

            {/* Pillar D: The Radar */}
            <div className="relative group overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/20 hover:bg-white/[0.04]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">The Radar</h3>
              <p className="mt-2 text-sm text-gray-400">
                Unified analytics dashboards syncing performance stats back to specific creative assets in your cloud.
              </p>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-auto bg-[#030303]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; 2026 NuFrame Creator OS. Licensed under Developer Grand Prix paradigm.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-500">FastAPI Backend</span>
            <span className="text-xs text-gray-500">React Next.js PWA</span>
            <span className="text-xs text-gray-500">Supabase DB</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
