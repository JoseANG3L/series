import React from 'react';
import useSWR from 'swr'; // <--- 1. Importamos SWR
import { Play, Bookmark, Info } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { getContentById } from '../services/api';

const Hero = () => {
  const navigate = useNavigate();

  // 1. ID DEL CONTENIDO DESTACADO
  const HERO_ID = 2; 

  // 2. IMPLEMENTACIÓN SWR
  // Key: `hero-${HERO_ID}` para que sea única
  const { data: movie, isLoading } = useSWR(
    `hero-${HERO_ID}`, 
    () => getContentById(HERO_ID),
    {
      revalidateOnFocus: false, // No recargar si cambio de pestaña (ahorra recursos)
      revalidateOnReconnect: false, 
      dedupingInterval: 600000, // 10 minutos de caché (el Hero cambia poco)
    }
  );

  // 3. SKELETON DE CARGA
  // Se muestra si está cargando o si aún no hay datos
  if (isLoading || !movie) {
    return <div className="w-full h-screen bg-[#0f172a] animate-pulse"></div>;
  }

  // --- LÓGICA DE TEXTOS (Igual que antes) ---
  const isSeries = movie.type === 'series' || (movie.temporadas && movie.temporadas.length > 0);
  
  const durationText = isSeries 
    ? `${movie.temporadas?.length || 1} Temporadas` 
    : movie.duracion || "N/A";
  
  const genresText = Array.isArray(movie.genero) 
    ? movie.genero.slice(0, 2).join(" • ") 
    : movie.genero;

  return (
    <header className="relative w-full h-screen">
      
      {/* --- Imagen de Fondo --- */}
      <div className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 animate-fadeIn"
        style={{ backgroundImage: `url('${movie.backdrop || movie.poster}')` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/40 to-transparent"></div>
      </div>

      {/* --- Contenido Hero --- */}
      <div className="relative z-10 flex flex-col justify-end min-h-screen max-h-fit px-4 md:px-8 lg:px-16 max-w-4xl space-y-6 pt-24 pb-16">
        
        {/* Badge Tipo */}
        <span className="bg-slate-800/80 w-fit px-3 py-1 rounded text-xs font-bold text-gray-300 uppercase tracking-widest backdrop-blur-sm border border-white/10 animate-fade-in-up">
          {isSeries ? "Serie" : "Película"}
        </span>

        {/* Título */}
        <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight drop-shadow-xl animate-fade-in-up delay-100">
          {movie.titulo}
        </h2>

        {/* Metadatos */}
        <div className="flex items-center gap-4 text-gray-300 text-sm font-medium animate-fade-in-up delay-200">
          <span>{durationText}</span>
          <span>•</span>
          <span>{movie.anio}</span>
          <span>•</span>
          <span className="uppercase">{genresText}</span>
        </div>

        {/* Sinopsis */}
        <p className="text-gray-400 text-base md:text-lg leading-relaxed line-clamp-3 max-w-2xl animate-fade-in-up delay-300">
          {movie.sinopsis}
        </p>

        {/* Botones */}
        <div className="flex flex-wrap gap-4 pt-3 animate-fade-in-up delay-500">
          <button 
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-full font-bold hover:bg-green-500 transition shadow-lg shadow-green-900/50 hover:scale-105 transform duration-200"
          >
            <Play className="w-5 h-5 fill-current" />
            Ver Ahora
          </button>
          
          <button 
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="flex items-center gap-2 px-8 py-3 border border-gray-600 bg-black/30 backdrop-blur-md text-white rounded-full font-bold hover:bg-white hover:text-black transition hover:scale-105 transform duration-200"
          >
            <Info className="w-5 h-5" />
            Más Info
          </button>
        </div>
      </div>
    </header>
  );
};

export default Hero;