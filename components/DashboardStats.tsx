import { LlavesCard } from "./LlavesCard";
import { InversionCard } from "./InversionCard";

export function DashboardStats() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" data-purpose="stats-cards-bar">
      {/* Card 1: Llaves Interactive Component */}
      <LlavesCard />

      {/* Card 2: Inversión Interactive Component */}
      <InversionCard />

      {/* Card 3: Notes and Reminders */}
      <div className="bg-white rounded-xl p-4 pixel-box-card flex items-center justify-between shadow-sm cursor-pointer hover:scale-[1.02] transition-transform" data-purpose="stat-reminders">
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
      <div className="bg-white rounded-xl p-4 pixel-box-card flex items-center justify-between shadow-sm cursor-pointer hover:scale-[1.02] transition-transform" data-purpose="stat-images">
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
