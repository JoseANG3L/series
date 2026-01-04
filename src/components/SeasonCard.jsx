import React from 'react';
import { Ban, Download, Plus } from "lucide-react";

const DEFAULT_IMAGE = "https://via.placeholder.com/500x750/1e293b/ef4444?text=No+Image";

const SeasonCard = ({ season, isAddCard = false, onAddClick }) => {
  
  if (isAddCard) {
    return (
      <div 
        onClick={onAddClick}
        className={`relative cursor-pointer group w-full`}
      >
        {/* Contenedor Aspect Ratio 2:3 con borde dashed */}
        <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-slate-900/50 border-2 border-dashed border-slate-700 hover:border-red-500 hover:bg-slate-800 transition-all duration-300 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-slate-800 group-hover:bg-red-600/20 flex items-center justify-center transition-colors duration-300">
             <Plus className="w-8 h-8 text-slate-500 group-hover:text-red-500 transition-colors" />
          </div>
          <span className="mt-3 text-sm font-bold text-slate-500 group-hover:text-white transition-colors uppercase tracking-wider">
            Agregar
          </span>
        </div>
        <div className="mt-3 px-1 h-5"></div>
      </div>
    );
  }

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = DEFAULT_IMAGE;
  };

  return (
    <div 
      onClick={() => {season.descarga && window.open(season.descarga, "_blank");}}
      // Ancho fijo recomendado para carruseles de temporadas
      className="relative cursor-pointer group w-full" 
    >
      {/* 1. CONTENEDOR DE IMAGEN (Aquí ocurre el Zoom) */}
      <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-slate-800 shadow-lg border border-white/5">
        
        {/* Imagen */}
        <img 
          src={season.poster || DEFAULT_IMAGE} 
          alt={`Temporada ${season.numero}`} 
          onError={handleImageError}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${!season.descarga && "grayscale"} `}
        />

        {/* Overlay con efecto "Aparecer desde abajo" */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          
          {/* Bloque animado (Sube 4 unidades hacia arriba al hacer hover) */}
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            
            {/* Botón Play */}
            <div className="bg-red-600 text-white p-3 rounded-full w-fit mb-2 shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:bg-red-500 hover:scale-105 transition flex items-center justify-center">
              {season.descarga ? <Download className="w-5 h-5 stroke-[2.5]" /> : <Ban className="w-5 h-5 stroke-[2.5]" />}
            </div>
            
            <p className="text-white text-sm font-bold tracking-wide">
               {season.descarga ? "Descargar" : "No disponible"}
            </p>
          </div>
        </div>
      </div>

      {/* 2. TEXTOS EXTERNOS (Se quedan quietos, solo cambian color) */}
      <div className="mt-3 px-1 text-center md:text-left">
        <h4 className="text-sm font-bold text-slate-200 truncate group-hover:text-red-500 transition-colors">
            Temporada {season.numero}
        </h4>
        <p className="text-xs text-slate-500 mt-1 font-medium">
            {season.episodios} Episodios
        </p>
      </div>
    </div>
  );
};

export default SeasonCard;