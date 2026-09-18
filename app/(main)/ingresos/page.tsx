"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const COLORS = [
  { id: "yellow", hex: "#f1c40f", label: "Amarillo" },
  { id: "blue", hex: "#3498db", label: "Azul" },
  { id: "green", hex: "#2ecc71", label: "Verde" },
  { id: "red", hex: "#e74c3c", label: "Rojo" },
  { id: "purple", hex: "#a55eea", label: "Púrpura" },
  { id: "slate", hex: "#778ca3", label: "Gris" },
];

type TipoIngreso = {
  id: string;
  nombre: string;
  descripcion: string;
  monto: number;
  color: string;
  estado: string;
};

export default function IngresosPage() {
  const router = useRouter();
  const supabase = createClient();

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [color, setColor] = useState(COLORS[0].hex);
  const [estado, setEstado] = useState("activo");
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Table Data State
  const [tiposIngreso, setTiposIngreso] = useState<TipoIngreso[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  
  // Pagination & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchTiposIngreso();
  }, []);

  const fetchTiposIngreso = async () => {
    setIsFetching(true);
    try {
      const { data, error } = await supabase
        .from("tipos_ingreso")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTiposIngreso(data || []);
    } catch (err: any) {
      console.warn("No se pudieron cargar los ingresos. ¿Ya creaste la tabla en Supabase?", err.message);
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
          .from("tipos_ingreso")
          .update({
            nombre,
            descripcion,
            monto: numericMonto,
            color,
            estado,
          })
          .eq("id", editingId);

        if (error) throw error;
        setSuccessMsg("¡Tipo de ingreso actualizado exitosamente!");
      } else {
        // Create Mode
        const { error } = await supabase
          .from("tipos_ingreso")
          .insert({
            user_id: userData.user.id,
            nombre,
            descripcion,
            monto: numericMonto,
            color,
            estado,
          });

        if (error) throw error;
        setSuccessMsg("¡Tipo de ingreso guardado exitosamente!");
      }

      // Reset form
      handleCancelEdit();
      // Reload table
      fetchTiposIngreso();
      
      // Auto-hide success message
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      console.warn("Error en handleSubmit:", err.message);
      setErrorMsg("Error al guardar. Si es la primera vez, asegúrate de haber ejecutado el script SQL en Supabase para crear la tabla.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: TipoIngreso) => {
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
    setColor(COLORS[0].hex);
    setEstado("activo");
    setErrorMsg("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este ingreso?")) return;
    
    try {
      const { error } = await supabase.from("tipos_ingreso").delete().eq("id", id);
      if (error) throw error;
      fetchTiposIngreso();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el registro.");
    }
  };

  // Filter and pagination logic
  const filteredTipos = tiposIngreso.filter(t => 
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
      <section className="modal-card bg-white w-full lg:w-[420px] xl:w-[480px] flex-shrink-0 p-6 sm:p-8 relative shadow-xl" data-purpose="create-income-card">
        <div className="flex items-start space-x-4 mb-6" data-purpose="card-header">
          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
            <svg className="w-11 h-11 drop-shadow-sm" fill="none" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 14h10v2H6zm0 2h12v2H6zm0 2h12v2H6zm0 2h10v2H6z" fill="#000000" fillOpacity="0.2"></path>
              <rect fill="#F39C12" height="6" rx="2" stroke="#1c1917" strokeWidth="1.5" width="14" x="8" y="8"></rect>
              <rect fill="#F1C40F" height="3" width="10" x="10" y="9"></rect>
              <rect fill="#F39C12" height="6" rx="2" stroke="#1c1917" strokeWidth="1.5" width="14" x="6" y="13"></rect>
              <rect fill="#F1C40F" height="3" width="10" x="8" y="14"></rect>
              <rect fill="#D68910" height="6" rx="2" stroke="#1c1917" strokeWidth="1.5" width="14" x="5" y="18"></rect>
              <rect fill="#F39C12" height="3" width="10" x="7" y="19"></rect>
              <rect fill="#F39C12" height="6" rx="2" stroke="#1c1917" strokeWidth="1.5" width="14" x="11" y="16"></rect>
              <rect fill="#FCD535" height="3" width="10" x="13" y="17"></rect>
            </svg>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {editingId ? "Editar Ingreso" : "Nuevo Ingreso"}
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

        <form onSubmit={handleSubmit} className="space-y-4" data-purpose="income-type-form">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5" htmlFor="income-name">
              Nombre
            </label>
            <div className="relative rounded-md">
              <input 
                id="income-name" 
                name="income-name" 
                type="text" 
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={loading}
                placeholder="Ej. Salario, Freelance..." 
                className="block w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#facc15] focus:border-[#facc15] transition-colors" 
              />
            </div>
          </div>

          {/* Monto */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5" htmlFor="income-amount">
              Monto
            </label>
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold">
                $
              </div>
              <input 
                id="income-amount" 
                name="income-amount" 
                type="number" 
                step="any"
                required
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                disabled={loading}
                placeholder="0.00" 
                className="block w-full pl-8 pr-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#facc15] focus:border-[#facc15] transition-colors" 
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5" htmlFor="income-desc">
              Descripción (opcional)
            </label>
            <div className="relative rounded-md">
              <textarea 
                id="income-desc" 
                name="income-desc" 
                rows={2}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                disabled={loading}
                placeholder="Breve descripción..." 
                className="block w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#facc15] focus:border-[#facc15] transition-colors resize-y" 
              />
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Color
            </label>
            <div className="flex items-center space-x-2.5" data-purpose="color-picker-group">
              {COLORS.map((c) => (
                <button 
                  key={c.id}
                  type="button"
                  aria-label={`Color ${c.label}`}
                  disabled={loading}
                  onClick={() => setColor(c.hex)}
                  className={`w-8 h-8 rounded-md shadow-sm transition-all ${
                    color === c.hex 
                      ? "border-[3px] border-slate-900 scale-110" 
                      : "border-2 border-transparent hover:scale-105"
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
                className="block w-full pl-3 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#facc15] focus:border-[#facc15] appearance-none font-medium cursor-pointer"
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
              className="btn-pixel-cancel w-1/2 py-3 px-4 rounded-lg bg-[#e2e8f0] text-slate-800 font-bold text-xs sm:text-sm hover:bg-slate-200 text-center tracking-wide disabled:opacity-50"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-pixel-save w-1/2 py-3 px-4 rounded-lg text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 tracking-wide disabled:opacity-50 cursor-pointer"
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
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Lista de Ingresos</h2>
            <p className="text-sm font-medium text-slate-500">Administra tus fuentes de ingreso</p>
          </div>
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M12.9 14.32a8 8 0 111.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 108 2a6 6 0 000 12z"/></svg>
            </div>
            <input 
              type="text" 
              placeholder="Buscar ingreso..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#facc15] focus:border-[#facc15] transition-colors"
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
                  <td colSpan={4} className="py-8 text-center text-slate-500">No se encontraron ingresos.</td>
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
                    <td className="py-3 px-1 font-mono font-bold text-emerald-600">
                      {formatCurrency(item.monto)}
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
                          className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-100 text-slate-600 hover:bg-[#facc15] hover:text-black transition-colors"
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
