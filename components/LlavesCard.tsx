"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type Llave = {
  id: string;
  banco: string;
  llave: string;
};

export function LlavesCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [llaves, setLlaves] = useState<Llave[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  
  // Form state
  const [banco, setBanco] = useState("");
  const [llaveValor, setLlaveValor] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createClient();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  useEffect(() => {
    if (isExpanded && llaves.length === 0) {
      fetchLlaves();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  const fetchLlaves = async () => {
    setIsFetching(true);
    try {
      const { data, error } = await supabase
        .from("llaves_transferencia")
        .select("*")
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      setLlaves(data || []);
    } catch (err) {
      console.error("Error cargando llaves", err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddLlave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banco.trim() || !llaveValor.trim()) return;

    setIsSaving(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) throw new Error("No autenticado");

      const { error } = await supabase.from("llaves_transferencia").insert({
        user_id: userData.user.id,
        banco,
        llave: llaveValor,
      });

      if (error) throw error;
      
      // Limpiar y recargar
      setBanco("");
      setLlaveValor("");
      await fetchLlaves();
    } catch (err) {
      console.error("Error guardando llave", err);
      alert("Error al guardar la llave. Asegúrate de haber ejecutado el script SQL.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = (texto: string) => {
    navigator.clipboard.writeText(texto);
    // Optional: show a mini toast or change icon briefly
  };

  const handleDelete = async (id: string) => {
    if(!confirm("¿Eliminar esta llave?")) return;
    try {
      await supabase.from("llaves_transferencia").delete().eq("id", id);
      await fetchLlaves();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Card */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-white rounded-xl p-4 pixel-box-card flex items-center justify-between shadow-sm cursor-pointer hover:scale-[1.02] transition-transform h-full"
        data-purpose="stat-llaves"
      >
        <div className="flex items-center space-x-3.5">
          <div className="w-14 h-14 flex items-center justify-center flex-shrink-0 relative overflow-visible">
            <Image 
              src="/images/keys-icon.png" 
              alt="Keys Icon" 
              fill
              className="object-contain pixelated p-1.5"
              unoptimized
            />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 leading-tight">LLAVES</h3>
            <p className="text-gray-500 text-xs font-semibold mt-1">Ver o agregar llaves</p>
          </div>
        </div>
        <span className={`text-gray-400 font-black text-xl pr-1 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`}>›</span>
      </div>

      {/* Dropdown Menu */}
      {isExpanded && (
        <div className="absolute top-full left-0 mt-2 w-[320px] sm:w-full bg-white border-2 border-black rounded-xl shadow-[4px_4px_0_0_#000] z-50 p-4 flex flex-col max-h-[400px]">
          
          <h4 className="text-xs font-black text-gray-800 uppercase mb-3 border-b-2 border-gray-100 pb-2">Tus Llaves</h4>
          
          {/* Lista de llaves */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-2 pr-1 custom-scrollbar">
            {isFetching ? (
              <p className="text-xs text-gray-500 text-center py-2">Cargando...</p>
            ) : llaves.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-2">No tienes llaves guardadas.</p>
            ) : (
              llaves.map((llave) => (
                <div key={llave.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-2.5 group hover:border-[#facc15] transition-colors">
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-bold text-gray-500 uppercase">{llave.banco}</span>
                    <span className="text-base font-black text-gray-900 truncate tracking-wide">{llave.llave}</span>
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleCopy(llave.llave); }}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                      title="Copiar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(llave.id); }}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                      title="Eliminar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Formulario Agregar */}
          <form onSubmit={handleAddLlave} className="mt-auto bg-gray-50 border-2 border-gray-200 rounded-lg p-3">
            <h5 className="text-[10px] font-bold text-gray-500 uppercase mb-2">Agregar nueva</h5>
            <div className="space-y-2">
              <input 
                type="text" 
                placeholder="Nombre (ej. Nequi)" 
                required
                value={banco}
                onChange={(e) => setBanco(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-[#facc15]"
              />
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="Número de cuenta o llave" 
                  required
                  value={llaveValor}
                  onChange={(e) => setLlaveValor(e.target.value)}
                  className="flex-1 text-xs px-2.5 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-[#facc15]"
                />
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-[#facc15] text-black px-3 py-1.5 rounded font-bold text-xs hover:bg-[#eab308] border border-black shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-y-[2px] active:translate-x-[2px] transition-all"
                >
                  {isSaving ? "..." : "+"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
