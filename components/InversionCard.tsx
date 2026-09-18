"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export function InversionCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [monto, setMonto] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isFetching, setIsFetching] = useState(true);
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
    fetchMonto();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMonto = async () => {
    setIsFetching(true);
    try {
      const { data, error } = await supabase
        .from("dinero_inversion")
        .select("monto")
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is 'No rows found'
        throw error;
      }
      
      if (data) {
        setMonto(data.monto);
        setInputValue(data.monto.toString());
      } else {
        setMonto(0);
        setInputValue("0");
      }
    } catch (err) {
      console.error("Error cargando monto de inversión", err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsSaving(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) throw new Error("No autenticado");

      const numericValue = parseFloat(inputValue);

      // Check if row exists
      const { data: existingData } = await supabase
        .from("dinero_inversion")
        .select("id")
        .eq("user_id", userData.user.id)
        .limit(1)
        .single();

      if (existingData) {
        // Update
        const { error } = await supabase
          .from("dinero_inversion")
          .update({ monto: numericValue, updated_at: new Date().toISOString() })
          .eq("id", existingData.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase.from("dinero_inversion").insert({
          user_id: userData.user.id,
          monto: numericValue,
        });
        if (error) throw error;
      }

      setMonto(numericValue);
      setIsExpanded(false);
    } catch (err) {
      console.error("Error guardando monto", err);
      alert("Error al guardar. Asegúrate de haber ejecutado el script SQL.");
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (val: number | null) => {
    if (val === null) return "$ ---";
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Card */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-white rounded-xl p-4 pixel-box-card flex items-center space-x-3.5 shadow-sm cursor-pointer hover:scale-[1.02] transition-transform h-full"
        data-purpose="stat-total-money"
      >
        <div className="w-14 h-14 flex items-center justify-center flex-shrink-0 relative overflow-visible">
          <Image 
            src="/images/inversion-icon.png" 
            alt="Inversion Icon" 
            fill
            className="object-contain pixelated p-1.5"
            unoptimized
          />
        </div>
        <div className="overflow-hidden flex-1">
          <h3 className="text-xs sm:text-sm font-bold text-gray-800 leading-tight truncate">Dinero total de inversión</h3>
          <p className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5 tracking-tight font-pixel-heading truncate">
            {isFetching ? "..." : formatCurrency(monto)}
          </p>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isExpanded && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-black rounded-xl shadow-[4px_4px_0_0_#000] z-50 p-4 flex flex-col">
          <h4 className="text-xs font-black text-gray-800 uppercase mb-3 border-b-2 border-gray-100 pb-2">Modificar Inversión</h4>
          
          <form onSubmit={handleSave} className="bg-gray-50 border-2 border-gray-200 rounded-lg p-3">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase block">Nuevo Monto</label>
              <div className="flex space-x-2">
                <input 
                  type="number" 
                  step="any"
                  placeholder="Ej. 1310000" 
                  required
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 text-xs px-2.5 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-[#facc15]"
                />
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-[#facc15] text-black px-3 py-1.5 rounded font-bold text-xs hover:bg-[#eab308] border border-black shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-y-[2px] active:translate-x-[2px] transition-all"
                >
                  {isSaving ? "..." : "Guardar"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
