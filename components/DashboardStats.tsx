export function DashboardStats() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" data-purpose="stats-cards-bar">
      {/* Card 1: NU Key */}
      <div className="bg-white rounded-xl p-4 pixel-box-card flex items-center justify-between relative shadow-sm hover:scale-[1.02] transition-transform" data-purpose="stat-nu-key">
        <div className="flex items-center space-x-3.5">
          <div className="w-14 h-14 bg-[#820ad1] rounded-2xl border-2 border-black flex items-center justify-center shadow-md flex-shrink-0">
            <span className="text-white font-bold text-2xl lowercase tracking-tighter">nu</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 leading-tight">Mi llave de NU</h3>
            <p className="text-gray-700 tracking-widest text-xs sm:text-sm font-mono mt-1 font-bold">**** **** ****</p>
          </div>
        </div>
        <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-300" title="Copiar llave">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
          </svg>
        </button>
      </div>

      {/* Card 2: Total Investment Money */}
      <div className="bg-white rounded-xl p-4 pixel-box-card flex items-center space-x-3.5 shadow-sm hover:scale-[1.02] transition-transform" data-purpose="stat-total-money">
        <div className="w-14 h-14 bg-[#fef9c3] rounded-2xl border-2 border-black flex items-center justify-center text-2xl flex-shrink-0 shadow-md">
          💰
        </div>
        <div className="overflow-hidden">
          <h3 className="text-xs sm:text-sm font-bold text-gray-800 leading-tight truncate">Dinero total de inversión</h3>
          <p className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5 tracking-tight font-pixel-heading">
            $ 1.310.000
          </p>
        </div>
      </div>

      {/* Card 3: Notes and Reminders */}
      <div className="bg-white rounded-xl p-4 pixel-box-card flex items-center justify-between shadow-sm cursor-pointer hover:bg-amber-50/20 hover:scale-[1.02] transition-all" data-purpose="stat-reminders">
        <div className="flex items-center space-x-3.5">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl border-2 border-black flex items-center justify-center text-2xl flex-shrink-0 shadow-md">
            📋
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-800 leading-tight">Recordatorios o apuntes</h3>
            <p className="text-2xl font-black text-gray-900 font-pixel-heading mt-0.5">3</p>
          </div>
        </div>
        <span className="text-amber-500 font-black text-2xl pr-1">›</span>
      </div>

      {/* Card 4: Image Access */}
      <div className="bg-white rounded-xl p-4 pixel-box-card flex items-center justify-between shadow-sm cursor-pointer hover:bg-sky-50/20 hover:scale-[1.02] transition-all" data-purpose="stat-images">
        <div className="flex items-center space-x-3.5">
          <div className="w-14 h-14 bg-sky-500 rounded-2xl border-2 border-black flex items-center justify-center text-2xl flex-shrink-0 shadow-md">
            🌌
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">Acceso a imágenes</h3>
          </div>
        </div>
        <span className="text-sky-500 font-black text-2xl pr-1">›</span>
      </div>
    </section>
  );
}
