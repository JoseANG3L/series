import React from 'react';
import { Ban, Download, Plus, Trash2, Link as LinkIcon, Image as ImageIcon, MonitorPlay, Clapperboard } from "lucide-react";

const DEFAULT_IMAGE = "/default.jpg";

const SeasonCard = ({ 
  season, 
  isAddCard = false, 
  onAddSeason, 
  isEditing = false, // Ahora usamos isEditing en lugar de showInputs para ser consistentes
  showInputs = false, // Mantenemos compatibilidad por si usas esta variable
  onUpdate,
  onDelete
}) => {

  if (isAddCard) {
    return (
      <div className="relative w-full h-full flex flex-col gap-2">
        {/* BOTÓN SUPERIOR: AGREGAR TEMPORADA */}
        <div 
            onClick={() => onAddSeason("normal")}
            className="flex-1 relative cursor-pointer group rounded-xl bg-slate-900/50 border-2 border-dashed border-slate-700 hover:border-blue-500 hover:bg-slate-800 transition-all duration-300 flex flex-col items-center justify-center p-2"
        >
            <div className="w-10 h-10 rounded-full bg-slate-800 group-hover:bg-blue-600/20 flex items-center justify-center transition-colors mb-1">
                <MonitorPlay className="w-5 h-5 text-slate-500 group-hover:text-blue-500" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 group-hover:text-white uppercase">
                + Temporada
            </span>
        </div>

        {/* BOTÓN INFERIOR: AGREGAR OVA */}
        <div 
            onClick={() => onAddSeason("ova")}
            className="flex-1 relative cursor-pointer group rounded-xl bg-slate-900/50 border-2 border-dashed border-slate-700 hover:border-purple-500 hover:bg-slate-800 transition-all duration-300 flex flex-col items-center justify-center p-2"
        >
             <div className="w-10 h-10 rounded-full bg-slate-800 group-hover:bg-purple-600/20 flex items-center justify-center transition-colors mb-1">
                <Clapperboard className="w-5 h-5 text-slate-500 group-hover:text-purple-500" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 group-hover:text-white uppercase">
                + OVA
            </span>
        </div>
      </div>
    );
  }

  // --- LÓGICA INTELIGENTE DE TÍTULOS ---
  const isEditMode = isEditing || showInputs;
  const rawNum = season?.numero?.toString() || "";
  
  // 1. Detectar si es OVA
  const isOva = rawNum.toLowerCase().includes("ova");
  
  // 2. Detectar si es RANGO o PLURAL (busca guiones, comas, 'y', '&', '+')
  const isPlural = rawNum.match(/[-&,y+]/);

  let displayText = "";
  
  if (isOva) {
      displayText = rawNum; // Ej: "OVA 1", "Colección OVAs"
  } else if (isPlural) {
      displayText = `Temporadas ${rawNum}`; // Ej: "Temporadas 1-3", "Temporadas 1 y 2"
  } else {
      displayText = `Temporada ${rawNum}`; // Ej: "Temporada 1"
  }

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = DEFAULT_IMAGE;
  };

  // --- 2. MODO EDICIÓN ACTIVO ---
  if (showInputs) {
    return (
      <div className="relative group w-full animate-fadeIn">
        
        <button 
            onClick={() => onDelete && onDelete()}
            className="absolute -top-2 -right-2 z-30 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-500 hover:scale-110 transition"
            title="Eliminar"
        >
            <Trash2 className="w-4 h-4" />
        </button>

        <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-slate-800 shadow-lg border border-red-500/30">
          <img 
            src={season.poster || DEFAULT_IMAGE} 
            alt="Poster Preview"
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={handleImageError}
            className="w-full h-full object-cover opacity-50"
          />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-2 gap-2">
            <div className="bg-black/60 backdrop-blur-sm p-2 rounded-lg w-full">
                <label className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1 mb-1">
                    <ImageIcon className="w-3 h-3" /> URL Imagen
                </label>
                <input 
                    type="text" 
                    value={season.poster || ""}
                    onChange={(e) => onUpdate({ ...season, poster: e.target.value })}
                    className="w-full bg-slate-900/80 border border-slate-600 rounded px-2 py-1 text-xs text-white focus:border-red-500 outline-none"
                    placeholder="https://..."
                />
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-2">
            <div className="flex gap-2">
                <div className="flex-1">
                    {/* 🔴 CAMBIO: Label dinámico */}
                    <label className="text-[9px] text-gray-500 uppercase block">
                        {isOva ? "Título (OVA)" : "Nums (Ej: 1-3)"}
                    </label>
                    {/* 🔴 CAMBIO: Type Text y quitamos parseInt para permitir escribir "OVA" */}
                    <input 
                        type="text" 
                        value={season.numero || ""}
                        onChange={(e) => onUpdate({ ...season, numero: e.target.value })}
                        className="w-full bg-slate-800 border-b border-slate-600 focus:border-red-500 outline-none text-sm font-bold text-white py-1"
                        placeholder="Ej: 1-3"
                    />
                </div>
                <div className="flex-1">
                    <label className="text-[9px] text-gray-500 uppercase block">Episodios</label>
                    <input 
                        type="text" 
                        value={season.episodios || ""}
                        onChange={(e) => onUpdate({ ...season, episodios: e.target.value })}
                        className="w-full bg-slate-800 border-b border-slate-600 focus:border-red-500 outline-none text-xs text-gray-400 py-1"
                    />
                </div>
            </div>

            <div>
                <label className="text-[9px] text-gray-500 uppercase flex items-center gap-1">
                    <LinkIcon className="w-3 h-3" /> Link Descarga
                </label>
                <input 
                    type="text" 
                    value={season.descarga || ""}
                    onChange={(e) => onUpdate({ ...season, descarga: e.target.value })}
                    className="w-full bg-slate-800 border-b border-slate-600 focus:border-red-500 outline-none text-xs text-blue-400 py-1"
                    placeholder="https://..."
                />
            </div>
        </div>
      </div>
    );
  }

  // --- 3. MODO VISUALIZACIÓN ---
  return (
    <div 
      onClick={() => {season.descarga && window.open(season.descarga, "_blank");}}
      className="relative cursor-pointer group w-full" 
    >
      <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-slate-800 shadow-lg border border-white/5">
        <img 
          src={season.poster || DEFAULT_IMAGE} 
          alt={displayText} 
          onError={handleImageError}
          referrerPolicy="no-referrer"
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${!season.descarga && "grayscale"} `}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <div className="bg-red-600 text-white p-3 rounded-full w-fit mb-2 shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:bg-red-500 hover:scale-105 transition flex items-center justify-center">
              {season.descarga ? <Download className="w-5 h-5 stroke-[2.5]" /> : <Ban className="w-5 h-5 stroke-[2.5]" />}
            </div>
            <p className="text-white text-sm font-bold tracking-wide">
               {season.descarga ? "Descargar" : "No disponible"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 px-1 text-center md:text-left">
        {/* 🔴 CAMBIO: Usamos displayText para mostrar "OVA 1" o "Temporada 1" */}
        <h4 className="text-sm font-bold text-slate-200 truncate group-hover:text-red-500 transition-colors">
            {displayText}
        </h4>
        <p className="text-xs text-slate-500 mt-1 font-medium">
            {season.episodios === "1" ? "1 Episodio" : `${season.episodios} Episodios`}
        </p>
      </div>
    </div>
  );
};

export default SeasonCard;