"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  defaultAmount?: number;
}

interface Movement {
  id: string | number;
  concept_text: string;
  amount: number | string;
}

interface QuincenaTableProps {
  quincenaId: string;
  initialTitle: string;
  initialDateText: string;
  headerColor: string;
  subheaderColor: string;
  initialMovements: Movement[];
  categories: Category[];
}

export function QuincenaTable({
  quincenaId,
  initialTitle,
  initialDateText,
  headerColor,
  subheaderColor,
  initialMovements,
  categories,
}: QuincenaTableProps) {
  const supabase = createClient();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const initialMount = useRef(true);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [dateText, setDateText] = useState(initialDateText);
  
  // Rellenar hasta 15 filas
  const [movements, setMovements] = useState<Movement[]>(() => {
    const list = [...initialMovements];
    while (list.length < 15) {
      list.push({ id: `empty-${list.length}`, concept_text: "", amount: "" });
    }
    return list;
  });

  // Auto-save effect
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }

    setSaveStatus("saving");
    const timeoutId = setTimeout(async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
          setSaveStatus("idle");
          return;
        }

        const { error } = await supabase
          .from("dashboard_quincenas")
          .upsert({
            id: quincenaId,
            user_id: userData.user.id,
            title,
            date_text: dateText,
            movements,
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.warn("Supabase Error:", error);
          setSaveStatus("idle");
          return;
        }
        
        setSaveStatus("saved");
        setTimeout(() => {
          setSaveStatus((prev) => prev === "saved" ? "idle" : prev);
        }, 2000);
      } catch (err) {
        console.error("Error auto-guardando quincena:", err);
        setSaveStatus("idle");
      }
    }, 1500); // 1.5s debounce to let user type

    return () => clearTimeout(timeoutId);
  }, [movements, title, dateText, quincenaId]);

  const updateMovement = (index: number, updates: Partial<Movement>) => {
    setMovements((prev) => {
      const newList = [...prev];
      newList[index] = { ...newList[index], ...updates };
      return newList;
    });
  };

  const getCategoryType = (concept: string): "income" | "expense" | null => {
    const safeConcept = concept || "";
    if (safeConcept.trim() === "") return null;
    const found = categories.find(c => c.name.toLowerCase() === safeConcept.trim().toLowerCase());
    return found ? found.type : null;
  };

  // Calculo de total
  const total = useMemo(() => {
    return movements.reduce((acc, mov) => {
      const val = typeof mov.amount === "string" ? parseFloat(mov.amount) || 0 : mov.amount;
      if (val === 0) return acc;
      
      const catType = getCategoryType(mov.concept_text);
      if (catType === "income") {
        return acc + Math.abs(val); // Ingresos suman
      } else if (catType === "expense") {
        return acc - Math.abs(val); // Egresos restan
      } else {
        return acc + val; 
      }
    }, 0);
  }, [movements, categories]);

  return (
    <div className="pixel-table-box bg-white rounded-xl flex flex-col hover:shadow-lg transition-shadow relative overflow-visible">
      {/* Header */}
      <div className={`${headerColor} p-3 border-b-2 border-black flex items-center space-x-3 rounded-t-xl relative`}>
        {/* Save indicator badge */}
        {saveStatus !== "idle" && (
          <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/50 backdrop-blur-sm border border-black/10 text-[9px] font-bold text-gray-700 font-pixel shadow-sm transition-all animate-fade-in z-10">
            {saveStatus === "saving" ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                Guardando...
              </>
            ) : (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                Guardado
              </>
            )}
          </div>
        )}

        <div className="w-9 h-9 bg-white border-2 border-black rounded-lg flex items-center justify-center text-lg shadow-sm shrink-0">
          🗓️
        </div>
        <div className="flex flex-col flex-1 gap-1">
          {isEditingTitle ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
              autoFocus
              className="w-full bg-transparent font-bold text-base text-gray-900 leading-none focus:outline-none focus:ring-2 focus:ring-black/20 rounded font-pixel"
            />
          ) : (
            <h2
              className="font-bold text-base text-gray-900 leading-none cursor-pointer hover:underline decoration-dashed font-pixel"
              onClick={() => setIsEditingTitle(true)}
              title="Haz clic para editar"
            >
              {title}
            </h2>
          )}

          {isEditingDate ? (
            <input
              type="text"
              value={dateText}
              onChange={(e) => setDateText(e.target.value)}
              onBlur={() => setIsEditingDate(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingDate(false)}
              autoFocus
              className="w-full bg-transparent text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-black/20 rounded font-pixel"
            />
          ) : (
            <p
              className="text-xs font-semibold text-gray-700 cursor-pointer hover:underline decoration-dashed font-pixel"
              onClick={() => setIsEditingDate(true)}
              title="Haz clic para editar"
            >
              {dateText}
            </p>
          )}
        </div>
      </div>

      {/* Table Column Headers */}
      <div className={`grid grid-cols-12 ${subheaderColor} border-b-2 border-black text-xs font-bold text-gray-800 py-1.5 px-2 font-pixel`}>
        <span className="col-span-2 text-center">#</span>
        <span className="col-span-6">Concepto</span>
        <span className="col-span-4 text-right">Monto</span>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-gray-200 text-xs sm:text-sm font-medium bg-white">
        {movements.map((mov, idx) => {
          const type = getCategoryType(mov.concept_text);
          let bgClass = "bg-transparent";
          if (type === "income") bgClass = "bg-[#dcfce7] border-b-2 border-green-500 text-green-900"; 
          else if (type === "expense") bgClass = "bg-[#fee2e2] border-b-2 border-red-500 text-red-900"; 
          else if (mov.concept_text.trim() !== "") bgClass = "bg-gray-100 border-b-2 border-gray-400 text-gray-800";

          return (
            <div key={mov.id} className="grid grid-cols-12 px-2 py-1.5 items-center bg-white hover:bg-slate-50 transition-colors">
              <span className="col-span-2 text-center text-gray-400 font-bold font-pixel text-[10px]">{idx + 1}</span>
              
              <div className="col-span-6 pr-2">
                <ConceptInput 
                  value={mov.concept_text}
                  onChange={(val, selectedCat) => {
                    const updates: Partial<Movement> = { concept_text: val };
                    if (selectedCat && selectedCat.defaultAmount !== undefined) {
                      updates.amount = selectedCat.defaultAmount;
                    }
                    updateMovement(idx, updates);
                  }}
                  categories={categories}
                  bgClass={bgClass}
                />
              </div>

              <div className="col-span-4 flex justify-end">
                <input
                  type="text"
                  placeholder="0"
                  value={mov.amount ? new Intl.NumberFormat('es-CO').format(Number(mov.amount)) : ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    updateMovement(idx, { amount: val ? Number(val) : "" });
                  }}
                  className={`w-full text-right bg-transparent font-mono font-bold outline-none border-b-2 focus:border-blue-400 border-transparent transition-colors px-1 ${
                    !mov.amount ? "text-gray-300" : (type === "expense" ? "text-red-600" : "text-gray-800")
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Footer */}
      <div className="bg-[#dcfce7] border-t-2 border-black p-2 px-3 flex justify-between items-center text-sm font-bold text-gray-900 mt-auto rounded-b-xl z-20 relative">
        <span className="font-pixel">Total</span>
        <span className={`font-mono font-black text-base ${total < 0 ? 'text-red-600' : 'text-green-700'}`}>
          {total < 0 ? "-" : ""}${Math.abs(total).toLocaleString('es-CO')}
        </span>
      </div>
    </div>
  );
}

// Custom dropdown component for concepts
function ConceptInput({ 
  value, 
  onChange, 
  categories, 
  bgClass 
}: { 
  value: string; 
  onChange: (val: string, category?: Category) => void; 
  categories: Category[];
  bgClass: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const incomes = categories.filter(c => c.type === 'income');
  const expenses = categories.filter(c => c.type === 'expense');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder="Escribir..."
        className={`w-full px-1.5 py-1 rounded outline-none font-semibold transition-colors font-pixel text-[10px] sm:text-[11px] ${bgClass} focus:ring-2 focus:ring-black/20 placeholder-gray-300`}
      />
      
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-48 bg-white border-2 border-black rounded shadow-lg z-50 max-h-48 overflow-y-auto font-pixel text-[10px]">
          {/* Ingresos */}
          {incomes.length > 0 && (
            <div className="p-1">
              <div className="text-[9px] text-green-700 font-bold uppercase mb-1 px-1">↓ Ingresos</div>
              {incomes.map(c => (
                <div 
                  key={c.id} 
                  className="px-2 py-1.5 hover:bg-green-100 cursor-pointer rounded"
                  onClick={() => {
                    onChange(c.name, c);
                    setIsOpen(false);
                  }}
                >
                  {c.name}
                </div>
              ))}
            </div>
          )}
          
          {/* Divider */}
          {incomes.length > 0 && expenses.length > 0 && <div className="border-t-2 border-black/10 my-0.5"></div>}
          
          {/* Egresos */}
          {expenses.length > 0 && (
            <div className="p-1">
              <div className="text-[9px] text-red-700 font-bold uppercase mb-1 px-1">↑ Egresos</div>
              {expenses.map(c => (
                <div 
                  key={c.id} 
                  className="px-2 py-1.5 hover:bg-red-100 cursor-pointer rounded"
                  onClick={() => {
                    onChange(c.name, c);
                    setIsOpen(false);
                  }}
                >
                  {c.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
