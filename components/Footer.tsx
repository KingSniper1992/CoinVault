export function Footer() {
  return (
    <footer className="relative w-full py-8 mt-4 overflow-hidden" data-purpose="site-footer">
      <div className="flex flex-col items-center justify-center text-center relative z-10 px-4">
        <div className="flex items-center space-x-3 mb-1">
          <span className="h-[2px] w-12 bg-slate-300 hidden sm:block"></span>
          <div className="flex items-baseline space-x-1">
            <span className="font-pixel-heading font-black text-base text-gray-900">COIN</span>
            <span className="font-pixel-heading font-black text-base text-[#f59e0b]">VAULT</span>
          </div>
          <span className="h-[2px] w-12 bg-slate-300 hidden sm:block"></span>
        </div>
        <p className="text-xs font-semibold text-gray-500 tracking-wide">
          Design by Doom Forge Studios
        </p>
      </div>
    </footer>
  );
}
