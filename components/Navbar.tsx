"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="bg-[#15181e] text-white border-b-4 border-[#facc15] px-4 py-2.5 shadow-md relative z-30" data-purpose="navbar">
      <div className="max-w-[1480px] mx-auto flex items-center justify-between">
        {/* Left side: Brand Logo */}
        <div className="flex items-center space-x-3.5" data-purpose="brand-container">
          <div className="flex flex-col">
            <div className="flex items-baseline space-x-2 leading-none">
              <span className="font-pixel-heading font-black text-2xl sm:text-3xl tracking-widest text-white drop-shadow-md">COIN</span>
              <span className="font-pixel-heading font-black text-2xl sm:text-3xl tracking-widest text-[#facc15] drop-shadow-md">VAULT</span>
            </div>
          </div>
        </div>

        {/* Center navigation links */}
        <nav className="hidden md:flex items-center space-x-2" data-purpose="navigation-links">
          {/* Active Dashboard link */}
          <Link href="/dashboard" className="flex items-center space-x-2 bg-[#1b2028] text-[#facc15] border-2 border-[#facc15] px-4 py-1.5 rounded-lg text-sm font-bold tracking-wide shadow-sm">
            <svg className="w-4 h-4 fill-current text-[#facc15]" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
            </svg>
            <span>Dashboard</span>
          </Link>
          {/* Ingresos link */}
          <Link href="/ingresos" className="flex items-center space-x-2 text-slate-200 hover:text-white px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors">
            <span className="text-emerald-500 font-black text-base">↑</span>
            <span>Ingresos</span>
          </Link>
          {/* Egresos link */}
          <Link href="/egresos" className="flex items-center space-x-2 text-slate-200 hover:text-white px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors">
            <span className="text-rose-500 font-black text-base">↓</span>
            <span>Egresos</span>
          </Link>
        </nav>

        {/* Right user actions */}
        <div className="flex items-center space-x-5" data-purpose="user-menu">

          {/* Logout button */}
          <button 
            type="button" 
            onClick={handleLogout}
            className="flex items-center space-x-2 border-2 border-[#ca8a04] hover:bg-[#ca8a04]/20 text-[#fef08a] px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer"
          >
            <svg className="w-4 h-4 text-[#facc15]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
}
