"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const EGRESOS_COLORS = [
  { id: "red", hex: "#e74c3c", label: "Rojo" },
  { id: "blue", hex: "#3897f1", label: "Azul" },
  { id: "green", hex: "#58be7d", label: "Verde" },
  { id: "yellow", hex: "#f6be1a", label: "Amarillo" },
  { id: "purple", hex: "#aa66cc", label: "Morado" },
  { id: "slate", hex: "#6f8295", label: "Gris" },
];

type TipoEgreso = {
  id: string;
  nombre: string;
  descripcion: string;
  monto: number;
  color: string;
  estado: string;
};

export default function EgresosPage() {
  const router = useRouter();
  const supabase = createClient();

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [color, setColor] = useState(EGRESOS_COLORS[0].hex);
  const [estado, setEstado] = useState("activo");
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Table Data State
  const [tiposEgreso, setTiposEgreso] = useState<TipoEgreso[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  
  // Pagination & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchTiposEgreso();
  }, []);

  const fetchTiposEgreso = async () => {
    setIsFetching(true);
    try {
      const { data, error } = await supabase
        .from("tipos_egreso")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTiposEgreso(data || []);
    } catch (err: any) {
      console.warn("No se pudieron cargar los egresos. ¿Ya creaste la tabla en Supabase?", err.message);
      setErrorMsg("No se pudo cargar la tabla. Asegúrate de ejecutar el script SQL en Supabase.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        throw new Error("No autenticado");
      }

      const numericMonto = parseFloat(monto) || 0;

      if (editingId) {
        // Edit Mode
        const { error } = await supabase
          .from("tipos_egreso")
          .update({
            nombre,
            descripcion,
            monto: numericMonto,
            color,
            estado,
          })
          .eq("id", editingId);

        if (error) throw error;
        setSuccessMsg("¡Tipo de egreso actualizado exitosamente!");
      } else {
        // Create Mode
        const { error } = await supabase
          .from("tipos_egreso")
          .insert({
            user_id: userData.user.id,
            nombre,
            descripcion,
            monto: numericMonto,
            color,
            estado,
          });

        if (error) throw error;
        setSuccessMsg("¡Tipo de egreso guardado exitosamente!");
      }

      // Reset form
      handleCancelEdit();
      // Reload table
      fetchTiposEgreso();
      
      // Auto-hide success message
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      console.warn("Error en handleSubmit:", err.message);
      setErrorMsg("Error al guardar. Si es la primera vez, asegúrate de haber ejecutado el script SQL en Supabase para crear la tabla.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: TipoEgreso) => {
    setEditingId(item.id);
    setNombre(item.nombre);
    setDescripcion(item.descripcion || "");
    setMonto(item.monto.toString());
    setColor(item.color);
    setEstado(item.estado);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNombre("");
    setDescripcion("");
    setMonto("");
    setColor(EGRESOS_COLORS[0].hex);
    setEstado("activo");
    setErrorMsg("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este egreso?")) return;
    
    try {
      const { error } = await supabase.from("tipos_egreso").delete().eq("id", id);
      if (error) throw error;
      fetchTiposEgreso();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el registro.");
    }
  };

  // Filter and pagination logic
  const filteredTipos = tiposEgreso.filter(t => 
    t.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredTipos.length / itemsPerPage) || 1;
  const currentItems = filteredTipos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Helper to format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val);
  };

  return (
    <main className="flex-grow flex flex-col lg:flex-row items-start justify-center gap-6 p-4 sm:p-6 w-full max-w-[1480px] mx-auto relative z-10">
      
      {/* LEFT COLUMN: Form */}
      <section className="modal-card border-[#f6be1a] bg-white w-full lg:w-[420px] xl:w-[480px] flex-shrink-0 p-6 sm:p-8 relative shadow-xl" data-purpose="create-egreso-card">
        <div className="flex items-center gap-4 mb-6" data-purpose="card-header">
          {/* Target / Coin Icon Pixel Art Badge */}
          <div className="w-12 h-12 flex-shrink-0 relative flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-black bg-[#cf3c2a] flex items-center justify-center shadow-inner">
              <div className="w-9 h-9 rounded-full border-2 border-white/40 bg-[#e74c3c] flex items-center justify-center">
                <div className="w-5 h-5 rounded-full border border-black bg-[#f6be1a] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-sm bg-amber-100"></div>
                </div>
              </div>
              {/* Arrow accent */}
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-black rotate-45 flex items-center justify-center">
                <div className="w-2 h-2 bg-amber-400"></div>
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {editingId ? "Editar Egreso" : "Nuevo Egreso"}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
              {editingId ? "Modifica los detalles" : "Registra un nuevo concepto"}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-semibold border border-red-200 mb-4">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm font-semibold border border-green-200 mb-4">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" data-purpose="egreso-type-form">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5" htmlFor="egreso-name">
              Nombre
            </label>
            <div className="relative rounded-md">
              <input 
                id="egreso-name" 
                name="egreso-name" 
                type="text" 
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={loading}
                placeholder="Ej. Alimentación, Transporte..." 
                className="block w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f6be1a] focus:border-[#f6be1a] transition-colors" 
              />
            </div>
          </div>

          {/* Monto */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5" htmlFor="egreso-amount">
              Monto
            </label>
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold">
                $
              </div>
              <input 
                id="egreso-amount" 
                name="egreso-amount" 
                type="number" 
                step="any"
                required
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                disabled={loading}
                placeholder="0.00" 
                className="block w-full pl-8 pr-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f6be1a] focus:border-[#f6be1a] transition-colors" 
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5" htmlFor="egreso-desc">
              Descripción (opcional)
            </label>
            <div className="relative rounded-md">
              <textarea 
                id="egreso-desc" 
                name="egreso-desc" 
                rows={2}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                disabled={loading}
                placeholder="Breve descripción..." 
                className="block w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f6be1a] focus:border-[#f6be1a] transition-colors resize-y" 
              />
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Color
            </label>
            <div className="flex items-center space-x-2.5" data-purpose="color-picker-group">
              {EGRESOS_COLORS.map((c) => (
                <button 
                  key={c.id}
                  type="button"
                  aria-label={`Color ${c.label}`}
                  disabled={loading}
                  onClick={() => setColor(c.hex)}
                  className={`w-7 h-7 rounded-md transition-all ${
                    color === c.hex 
                      ? "border-2 border-slate-900 ring-2 ring-current ring-offset-1 scale-110" 
                      : "border border-transparent hover:scale-105 opacity-90"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5" htmlFor="status-select">
              Estado
            </label>
            <div className="relative rounded-md">
              <select 
                id="status-select" 
                name="status" 
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                disabled={loading}
                className="block w-full pl-3 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#f6be1a] focus:border-[#f6be1a] appearance-none font-medium cursor-pointer"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 space-x-4">
            <button 
              type="button"
              onClick={handleCancelEdit}
              disabled={loading}
              className="w-1/2 py-2.5 px-4 bg-[#e8eef6] hover:bg-slate-200 text-slate-900 text-xs sm:text-sm font-bold rounded-lg transition-colors tracking-wide border-2 border-[#14161f] shadow-[0_3px_0_0_#14161f] active:translate-y-[2px] active:shadow-[0_1px_0_0_#14161f]"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="w-1/2 py-2.5 px-4 bg-[#f6be1a] hover:bg-[#e2ad10] text-slate-950 text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-colors tracking-wide border-2 border-[#14161f] shadow-[0_3px_0_0_#14161f] active:translate-y-[2px] active:shadow-[0_1px_0_0_#14161f]"
            >
              <span>{loading ? "Guardando..." : "Guardar"}</span>
            </button>
          </div>
        </form>
      </section>

      {/* RIGHT COLUMN: Table */}
      <section className="pixel-table-box bg-white w-full lg:flex-1 rounded-xl shadow-xl flex flex-col p-4 sm:p-6 lg:p-8 min-h-[500px]">
        {/* Table Header & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Lista de Egresos</h2>
            <p className="text-sm font-medium text-slate-500">Administra tus gastos</p>
          </div>
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M12.9 14.32a8 8 0 111.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 108 2a6 6 0 000 12z"/></svg>
            </div>
            <input 
              type="text" 
              placeholder="Buscar egreso..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f6be1a] focus:border-[#f6be1a] transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="pb-3 font-bold text-slate-600">Nombre</th>
                <th className="pb-3 font-bold text-slate-600">Monto</th>
                <th className="pb-3 font-bold text-slate-600">Estado</th>
                <th className="pb-3 font-bold text-slate-600 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isFetching ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">Cargando datos...</td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">No se encontraron egresos.</td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-1">
                      <div className="flex items-center space-x-3">
                        <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></span>
                        <span className="font-semibold text-slate-800">{item.nombre}</span>
                      </div>
                      {item.descripcion && <div className="text-xs text-slate-500 ml-6 truncate max-w-[150px]">{item.descripcion}</div>}
                    </td>
                    <td className="py-3 px-1 font-mono font-bold text-red-500">
                      -{formatCurrency(item.monto)}
                    </td>
                    <td className="py-3 px-1">
                      <span className={`px-2 py-1 text-xs font-bold rounded-md ${item.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {item.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="py-3 px-1 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-100 text-slate-600 hover:bg-[#f6be1a] hover:text-black transition-colors"
                          title="Editar"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-100 text-slate-600 hover:bg-red-500 hover:text-white transition-colors"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {!isFetching && filteredTipos.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-200 pt-4 mt-4">
            <span className="text-xs sm:text-sm text-slate-500 font-medium">
              Página {currentPage} de {totalPages}
            </span>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 text-sm font-bold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 text-sm font-bold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </section>

    </main>
  );
}
