import React, { useState, useEffect } from 'react';
import { Play, Bookmark, Info } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { getContentById } from '../services/api'; // Tu servicio de Supabase

const Hero = () => {
  const [movie, setMovie] = useState(null);
  const navigate = useNavigate();

  // 1. CONFIGURA AQUÍ EL ID DE LA SERIE/PELÍCULA QUE QUIERES MOSTRAR
  const HERO_ID = 2; 

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const data = await getContentById(HERO_ID);
        if (data) setMovie(data);
      } catch (error) {
        console.error("Error cargando Hero:", error);
      }
    };
    fetchHeroContent();
  }, []);

  // Skeleton de carga (Mantiene el layout oscuro mientras carga)
  if (!movie) return <div className="w-full h-screen bg-[#0f172a] animate-pulse"></div>;

  // Lógica para textos dinámicos
  const isSeries = movie.type === 'series' || (movie.temporadas && movie.temporadas.length > 0);
  const durationText = isSeries 
    ? `${movie.temporadas?.length || 1} Temporadas` 
    : movie.duracion || "N/A";
  
  // Manejo seguro de géneros (si es array o string)
  const genresText = Array.isArray(movie.genero) 
    ? movie.genero.slice(0, 2).join(" • ") // Toma los 2 primeros
    : movie.genero;

  return (
    <header className="relative w-full h-screen">
      
      {/* --- Imagen de Fondo Dinámica --- */}
      <div className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url('${movie.backdrop || movie.poster}')` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        {/* Tus gradientes originales */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/40 to-transparent"></div>
      </div>

      {/* --- Contenido Hero (Tu layout exacto) --- */}
      <div className="relative z-10 flex flex-col justify-end min-h-screen max-h-fit px-4 md:px-8 lg:px-16 max-w-4xl space-y-6 pt-24 pb-16">
        
        {/* Badge Tipo */}
        <span className="bg-slate-800/80 w-fit px-3 py-1 rounded text-xs font-bold text-gray-300 uppercase tracking-widest backdrop-blur-sm border border-white/10">
          {isSeries ? "Serie" : "Película"}
        </span>

        {/* Título Dinámico */}
        <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight drop-shadow-xl">
          {movie.titulo}
        </h2>

        {/* Metadatos Dinámicos */}
        <div className="flex items-center gap-4 text-gray-300 text-sm font-medium">
          <span>{durationText}</span>
          <span>•</span>
          <span>{movie.anio}</span>
          <span>•</span>
          <span className="uppercase">{genresText}</span>
        </div>

        {/* Sinopsis Dinámica */}
        <p className="text-gray-400 text-base md:text-lg leading-relaxed line-clamp-3 max-w-2xl">
          {movie.sinopsis}
        </p>

        {/* Botones (Tus estilos exactos) */}
        <div className="flex flex-wrap gap-4 pt-3">
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