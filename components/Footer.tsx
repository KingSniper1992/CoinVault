import Image from "next/image";

export function Footer() {
  return (
    <div className="relative w-full mt-10" data-purpose="site-footer-wrapper">
      
      <footer className="relative w-full pb-6 pt-8 border-t-4 border-[#facc15] bg-[#15181e] overflow-hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="max-w-[1480px] mx-auto flex flex-col items-center justify-center text-center px-4 relative z-10">
          
          <div className="flex items-center space-x-3 mb-1">
            <span className="h-[2px] w-12 bg-slate-600 hidden sm:block"></span>
            <div className="flex items-baseline space-x-1.5 drop-shadow-sm">
              <span className="font-pixel-heading font-black text-base text-white tracking-widest">COIN</span>
              <span className="font-pixel-heading font-black text-base text-[#facc15] tracking-widest">VAULT</span>
            </div>
            <span className="h-[2px] w-12 bg-slate-600 hidden sm:block"></span>
          </div>
          
          <p className="text-xs font-semibold text-slate-400 tracking-wide mt-1">
            Design by Doom Forge Studios
          </p>
          
        </div>
      </footer>
    </div>
  );
}
