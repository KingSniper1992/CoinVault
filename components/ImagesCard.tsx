"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type Imagen = {
  id: string;
  titulo: string;
  url: string;
  path: string;
  created_at: string;
};

export function ImagesCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<Imagen[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Upload state
  const [title, setTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("imagenes")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setImages(data || []);
    } catch (err) {
      console.error("Error cargando imágenes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      
      if (!userId) throw new Error("No autenticado");

      // 1. Upload to Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('vault_images')
        .upload(filePath, selectedFile, {
            cacheControl: '3600',
            upsert: false
        });

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('vault_images')
        .getPublicUrl(filePath);

      // 3. Save to Table
      const { error: dbError } = await supabase
        .from('imagenes')
        .insert({
          user_id: userId,
          titulo: title || "Sin título",
          url: publicUrl,
          path: filePath
        });

      if (dbError) throw dbError;

      setTitle("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      await fetchImages();
    } catch (err) {
      console.error("Error subiendo imagen:", err);
      alert("Hubo un error al subir la imagen. Intenta de nuevo.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (img: Imagen, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("¿Eliminar esta imagen?")) return;
    
    try {
      // 1. Delete from Storage
      await supabase.storage.from('vault_images').remove([img.path]);
      
      // 2. Delete from DB
      await supabase.from("imagenes").delete().eq("id", img.id);
      
      setImages(images.filter(i => i.id !== img.id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Card */}
      <div 
        onClick={() => setIsOpen(true)}
        className="bg-white rounded-xl p-4 pixel-box-card flex items-center justify-between shadow-sm cursor-pointer hover:scale-[1.02] transition-transform h-full"
        data-purpose="stat-images"
      >
        <div className="flex items-center space-x-3.5">
          <div className="w-14 h-14 flex items-center justify-center flex-shrink-0 relative overflow-visible">
            <Image 
              src="/images/images-icon.png" 
              alt="Images Icon" 
              fill
              className="object-contain pixelated p-1.5"
              unoptimized
            />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-800 leading-tight">Acceso a imágenes</h3>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{images.length}</p>
          </div>
        </div>
        <span className="text-sky-500 font-black text-2xl pr-1">›</span>
      </div>

      {/* Main Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8">
          <div className="bg-[#15181e] border-4 border-sky-500 w-full max-w-6xl h-[85vh] flex flex-col rounded-xl shadow-[0_0_50px_rgba(14,165,233,0.15)] relative animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b-4 border-sky-500 bg-[#1b2028] rounded-t-lg shrink-0">
              <div className="flex items-center space-x-3">
                <Image src="/images/images-icon.png" alt="Icon" width={32} height={32} className="pixelated" />
                <h2 className="text-xl sm:text-2xl font-pixel-heading font-black tracking-widest text-sky-400 drop-shadow-md mt-1">
                  BÓVEDA DE IMÁGENES
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
              
              {/* Left Side: Upload Panel */}
              <div className="w-full md:w-80 lg:w-96 flex flex-col p-4 sm:p-6 space-y-4 border-r-0 md:border-r-4 border-slate-800/80 bg-[#0f172a]/40 shrink-0">
                <h3 className="text-sky-400 font-pixel font-bold uppercase text-sm tracking-wider mb-2">
                  Subir Nueva Imagen
                </h3>

                <div className="space-y-4 flex flex-col flex-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Título / Descripción</label>
                    <input 
                      type="text" 
                      placeholder="Ej. Recibo de luz..." 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-[#111418]/90 text-white border-2 border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-lg p-3 text-base font-bold outline-none transition-all shadow-inner"
                    />
                  </div>
                  
                  <div className="flex-1 min-h-[150px]">
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Archivo</label>
                    <label className="w-full h-full min-h-[150px] border-2 border-dashed border-slate-600 hover:border-sky-500 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#111418]/50 hover:bg-[#111418]">
                      <svg className="w-10 h-10 text-slate-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                      <span className="text-sm text-slate-300 font-bold px-4 text-center">
                        {selectedFile ? selectedFile.name : "Seleccionar imagen"}
                      </span>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                      />
                    </label>
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={handleUpload}
                      disabled={isUploading || !selectedFile}
                      className="w-full bg-sky-500 hover:bg-sky-400 text-black px-6 py-3 rounded-lg font-bold font-pixel-heading tracking-wide text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-b-4 border-sky-700 active:border-b-0 active:translate-y-1 transition-all"
                    >
                      {isUploading ? "SUBIENDO..." : "GUARDAR IMAGEN"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side: Gallery */}
              <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden">
                <h3 className="text-white font-pixel font-bold uppercase text-sm tracking-wider mb-4 border-b-2 border-slate-700 pb-2">
                  Galería ({images.length})
                </h3>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-slate-400 font-bold animate-pulse">Cargando...</p>
                    </div>
                  ) : images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full opacity-50">
                      <Image src="/images/images-icon.png" alt="Empty" width={64} height={64} className="mb-4 grayscale" unoptimized />
                      <p className="text-slate-400 font-bold text-lg">Bóveda Vacía</p>
                      <p className="text-slate-500 text-sm mt-1">Sube tu primera imagen en el panel lateral.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {images.map((img) => (
                        <div 
                          key={img.id}
                          className="group relative bg-[#111418] border-2 border-slate-700 hover:border-sky-500 rounded-lg overflow-hidden cursor-pointer aspect-square transition-colors"
                          onClick={() => setSelectedImage(img.url)}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={img.url} 
                            alt={img.titulo} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                            <p className="text-white text-xs font-bold truncate mb-1">{img.titulo}</p>
                            <button 
                              onClick={(e) => handleDelete(img, e)}
                              className="self-end bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Viewer Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md cursor-zoom-out p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={selectedImage} 
              alt="Vista previa" 
              className="max-w-full max-h-full object-contain cursor-auto shadow-2xl transition-transform hover:scale-110 duration-300"
              onClick={(e) => e.stopPropagation()} 
            />
            <button 
              className="absolute top-4 right-4 text-white bg-slate-800/50 hover:bg-slate-700 p-2 rounded-full backdrop-blur-sm"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
