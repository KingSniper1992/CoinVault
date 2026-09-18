"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: username,
        password,
      });

      if (error) {
        setErrorMsg("Credenciales inválidas. Por favor intenta de nuevo.");
        setLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Ocurrió un error inesperado. Revisa la consola.");
      setLoading(false);
    }
  };

  return (
    <main className="w-full h-screen overflow-hidden flex flex-col lg:flex-row relative">
      {/* Left Hero Section */}
      <section
        className="w-full lg:w-[42%] pixel-night-bg text-white relative flex flex-col items-center justify-between p-4 sm:p-8 lg:py-10 lg:px-12 border-r-4 border-black/40 shadow-2xl"
        data-purpose="hero-retro-branding"
      >
        {/* Background Pixel Accents */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <span className="absolute top-12 left-16 w-2 h-2 bg-slate-400"></span>
          <span className="absolute top-28 left-36 w-3 h-3 bg-slate-500"></span>
          <span className="absolute top-20 right-20 w-2 h-2 bg-slate-400"></span>
          <span className="absolute top-44 right-32 w-3 h-3 bg-slate-500"></span>
          <span className="absolute top-72 left-10 w-2 h-2 bg-slate-600"></span>
          <span className="absolute bottom-60 right-16 w-3 h-3 bg-slate-600"></span>
        </div>

        {/* Top Spacer & Header Motif */}
        <div className="w-full flex justify-between items-center z-10 opacity-70">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-vault-yellow inline-block"></span>
            <span className="text-[10px] tracking-widest uppercase font-mono text-slate-300">SYSTEM READY</span>
          </div>
          <div className="text-[10px] tracking-widest uppercase font-mono text-amber-400">v1.0.4</div>
        </div>

        {/* Center Logo & Branding Block */}
        <div className="w-full flex flex-col items-center justify-center my-auto py-6 z-10">
          <div className="relative group cursor-pointer flex-1 flex flex-col justify-center py-4">
            <div className="w-80 sm:w-96 md:w-[32rem] h-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/logo.png"
                alt="Coin Vault Pixel Chest Logo"
                width={500}
                height={500}
                className="w-full object-contain pixelated drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
                unoptimized
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center">
            <div className="flex items-center gap-3">
              <span className="w-7 h-[2px] bg-vault-yellow"></span>
              <span className="text-[11px] sm:text-xs tracking-[0.25em] font-semibold text-slate-300 uppercase">
                PEQUEÑAS DECISIONES
              </span>
              <span className="w-7 h-[2px] bg-vault-yellow"></span>
            </div>
            <span className="text-[10px] sm:text-[11px] tracking-[0.2em] font-semibold text-slate-400 uppercase mt-1">
              GRANDES LOGROS
            </span>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs sm:text-sm text-slate-300 font-mono tracking-wider">
              “TU DINERO, UN MEJOR MAÑANA”
            </p>
            <div className="w-10 h-0.5 bg-vault-yellow mx-auto mt-2 opacity-80"></div>
          </div>
        </div>

        {/* Bottom Decorative Wall */}
        <div className="w-full z-10 flex items-end justify-between pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 bg-vault-yellow border border-black shadow-inner"></span>
            <span>SAFE & SECURE VAULT</span>
          </div>
          <span>© DOOMFORGE</span>
        </div>
      </section>

      {/* Right Section: Crisp modern minimalist container for retro auth form */}
      <section
        className="w-full lg:w-[58%] bg-[url('/images/bg.png')] bg-cover bg-center flex flex-col justify-between items-center p-6 sm:p-10 lg:p-14 relative"
        data-purpose="login-form-wrapper"
      >
        <header className="w-full flex justify-end">
          <div className="text-right">
            <p className="text-[11px] sm:text-xs font-bold tracking-[0.18em] text-slate-600 uppercase">
              LEVEL UP
            </p>
            <p className="text-[11px] sm:text-xs font-bold tracking-[0.18em] text-slate-600 uppercase -mt-0.5">
              YOUR FINANCES
            </p>
            <div className="w-7 h-[3px] bg-vault-yellow ml-auto mt-1"></div>
          </div>
        </header>

        <div className="w-full max-w-lg my-auto py-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] border border-slate-200/60 p-8 sm:p-12 transition-all" data-purpose="auth-card">
            <div className="text-center mb-9">
              <h1 className="text-2xl sm:text-3xl font-pixel tracking-normal text-slate-900 leading-tight">
                Bienvenido a<br />
                <span className="text-slate-900">COIN </span><span className="text-vault-yellow">VAULT</span>
              </h1>
              <p className="text-slate-500 text-sm mt-4 font-medium">
                Inicia sesión para acceder a tu mundo financiero
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-semibold border border-red-200">
                  {errorMsg}
                </div>
              )}
              <div data-purpose="input-group-username">
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2" htmlFor="username">
                  Correo electrónico
                </label>
                <div className="relative rounded-xl border border-slate-200 hover:border-slate-300 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200 transition-all bg-[#fcfdfe]">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <svg className="h-5 w-5 fill-slate-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-transparent border-0 text-sm text-slate-800 placeholder-slate-400 focus:ring-0 rounded-xl outline-none"
                    placeholder="Ingresa tu correo"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div data-purpose="input-group-password">
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2" htmlFor="password">
                  Contraseña
                </label>
                <div className="relative rounded-xl border border-slate-200 hover:border-slate-300 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200 transition-all bg-[#fcfdfe]">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <svg className="h-5 w-5 fill-slate-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-transparent border-0 text-sm text-slate-800 placeholder-slate-400 focus:ring-0 rounded-xl outline-none"
                    placeholder="Ingresa tu contraseña"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    id="togglePassword"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {!showPassword ? (
                      <svg id="eyeSlashIcon" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path>
                      </svg>
                    ) : (
                      <svg id="eyeOpenIcon" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <a href="#recuperar" className="text-xs sm:text-sm font-semibold text-vault-gold hover:text-vault-gold-dark transition-colors inline-block">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-pixel-vault w-full py-4 px-6 bg-vault-yellow text-black font-pixel text-sm sm:text-base tracking-wider rounded-xl flex items-center justify-center gap-3 border-4 border-black group cursor-pointer disabled:opacity-70"
                >
                  <span>{loading ? "CARGANDO..." : "OPEN VAULT"}</span>
                  {!loading && <span className="text-lg transition-transform group-hover:translate-x-1">&gt;</span>}
                </button>
              </div>
            </form>

            <footer className="mt-9 text-center">
              <div className="flex items-center justify-center gap-3 text-slate-400 text-xs">
                <span className="w-10 h-px bg-slate-200"></span>
                <span className="text-slate-500 font-medium">Diseñado por DoomForge Studios.</span>
                <span className="w-10 h-px bg-slate-200"></span>
              </div>
            </footer>
          </div>
        </div>

        <div className="w-full flex justify-between items-center text-xs text-slate-800 font-semibold pt-2 font-mono">
          <span className="hidden sm:inline bg-white/70 px-2 py-1 rounded">PROTECTED BY VAULT GUARDIAN</span>
          <span className="ml-auto bg-white/70 px-2 py-1 rounded">ESPAÑOL (LATAM)</span>
        </div>
      </section>
    </main>
  );
}
