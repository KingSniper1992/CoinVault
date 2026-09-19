"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type Apunte = {
  id: string;
  titulo: string;
  contenido: string;
  created_at: string;
};

export function NotesCard() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Editor state
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  // List state
  const [apuntes, setApuntes] = useState<Apunte[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchApuntes();
  }, []);

  const fetchApuntes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("apuntes")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setApuntes(data || []);
    } catch (err) {
      console.error("Error cargando apuntes. Es posible que la tabla no exista aún.", err);
      // Fallback a memoria si falla la BD
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) return;
    
    setIsSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      
      if (!userId) {
        throw new Error("No autenticado");
      }

      if (currentId) {
        // Update
        const { error } = await supabase
          .from("apuntes")
          .update({ titulo: title, contenido: content })
          .eq("id", currentId);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from("apuntes")
          .insert({ user_id: userId, titulo: title, contenido: content });
        if (error) throw error;
      }
      
      await fetchApuntes();
      handleNew();
    } catch (err) {
      console.error("Error guardando apunte:", err);
      // Fallback local visual
      if (!currentId) {
        const newApunte = {
          id: Date.now().toString(),
          titulo: title,
          contenido: content,
          created_at: new Date().toISOString()
        };
        setApuntes([newApunte, ...apuntes]);
      } else {
        setApuntes(apuntes.map(a => a.id === currentId ? { ...a, titulo: title, contenido: content } : a));
      }
      handleNew();
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (apunte: Apunte) => {
    setCurrentId(apunte.id);
    setTitle(apunte.titulo);
    setContent(apunte.contenido);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("¿Eliminar este apunte?")) return;
    
    try {
      await supabase.from("apuntes").delete().eq("id", id);
      setApuntes(apuntes.filter(a => a.id !== id));
      if (currentId === id) {
        handleNew();
      }
    } catch (err) {
      console.error(err);
      // Local fallback
      setApuntes(apuntes.filter(a => a.id !== id));
      if (currentId === id) {
        handleNew();
      }
    }
  };

  const handleNew = () => {
    setCurrentId(null);
    setTitle("");
    setContent("");
  };

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="bg-white rounded-xl p-4 pixel-box-card flex items-center justify-between shadow-sm cursor-pointer hover:scale-[1.02] transition-transform h-full"
        data-purpose="stat-reminders"
      >
        <div className="flex items-center space-x-3.5">
          <div className="w-14 h-14 flex items-center justify-center flex-shrink-0 relative overflow-visible">
            <Image 
              src="/images/notes-icon.png" 
              alt="Notes Icon" 
              fill
              className="object-contain pixelated p-1.5"
              unoptimized
            />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-800 leading-tight">Recordatorios o apuntes</h3>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{apuntes.length}</p>
          </div>
        </div>
        <span className="text-[#facc15] font-black text-2xl pr-1">›</span>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8">
          <div className="bg-[#15181e] border-4 border-[#facc15] w-full max-w-6xl h-[85vh] flex flex-col rounded-xl shadow-[0_0_50px_rgba(250,204,21,0.15)] relative animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b-4 border-[#facc15] bg-[#1b2028] rounded-t-lg shrink-0">
              <div className="flex items-center space-x-3">
                <Image src="/images/notes-icon.png" alt="Icon" width={32} height={32} className="pixelated" />
                <h2 className="text-xl sm:text-2xl font-pixel-heading font-black tracking-widest text-[#facc15] drop-shadow-md mt-1">
                  MIS APUNTES
                </h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 p-1.5 rounded border-2 border-transparent hover:border-slate-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            {/* Body */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-pixel-night-bg relative">
              
              {/* Left Side: Editor */}
              <div className="flex-1 flex flex-col p-4 sm:p-6 space-y-4 border-r-0 md:border-r-4 border-slate-800/80 overflow-y-auto">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-[#facc15] font-pixel font-bold uppercase text-sm tracking-wider">
                    {currentId ? "Editando apunte" : "Nuevo apunte"}
                  </h3>
                  {currentId && (
                    <button 
                      onClick={handleNew}
                      className="text-xs text-white bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded font-bold"
                    >
                      + NUEVO
                    </button>
                  )}
                </div>

                <input 
                  type="text" 
                  placeholder="Título del apunte..." 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#111418]/90 text-white border-2 border-slate-700 focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15] rounded-lg p-3 text-lg sm:text-xl font-bold outline-none transition-all shadow-inner relative z-10"
                />
                
                <textarea 
                  placeholder="Escribe tus notas, recordatorios o ideas aquí..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full flex-1 min-h-[200px] bg-[#111418]/90 text-slate-200 border-2 border-slate-700 focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15] rounded-lg p-4 resize-none outline-none transition-all font-mono text-base sm:text-lg leading-relaxed shadow-inner relative z-10"
                />

                <div className="pt-2 flex justify-end">
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-pixel-save px-6 py-2.5 rounded-lg text-black font-bold font-pixel-heading tracking-wide text-base cursor-pointer flex items-center space-x-2 disabled:opacity-50"
                  >
                    <span>{isSaving ? "GUARDANDO..." : "GUARDAR"}</span>
                  </button>
                </div>
              </div>

              {/* Right Side: Saved Notes List */}
              <div className="w-full md:w-80 lg:w-96 flex flex-col p-4 sm:p-6 bg-[#0f172a]/40 overflow-hidden">
                <h3 className="text-white font-pixel font-bold uppercase text-sm tracking-wider mb-4 border-b-2 border-slate-700 pb-2">
                  Guardados ({apuntes.length})
                </h3>
                
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {isLoading ? (
                    <p className="text-slate-400 text-sm text-center py-4">Cargando...</p>
                  ) : apuntes.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-500 text-sm italic">No hay apuntes guardados.</p>
                      <p className="text-slate-600 text-xs mt-2">Crea uno en el panel izquierdo.</p>
                    </div>
                  ) : (
                    apuntes.map((apunte) => (
                      <div 
                        key={apunte.id}
                        onClick={() => handleEdit(apunte)}
                        className={`group cursor-pointer rounded-lg border-2 p-3 transition-all ${currentId === apunte.id ? 'border-[#facc15] bg-[#1b2028]' : 'border-slate-700 bg-[#111418] hover:border-slate-500 hover:bg-[#15181e]'}`}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="text-white font-bold text-sm truncate pr-2 flex-1">
                            {apunte.titulo || "Sin título"}
                          </h4>
                          <button 
                            onClick={(e) => handleDelete(apunte.id, e)}
                            className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                            title="Eliminar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </div>
                        <p className="text-slate-400 text-xs mt-1 line-clamp-2 font-mono">
                          {apunte.contenido || "Sin contenido"}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
