import React from 'react';
import useSWR from 'swr'; // <--- 1. Importamos SWR
import { Play, Bookmark, Info } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { getContentById } from '../services/api';

const Hero = () => {
  const navigate = useNavigate();

  // 1. ID DEL CONTENIDO DESTACADO
  const HERO_ID = 'MJfe7PVB4FBw7PkYIhsS'; 

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
  const isSeries = movie.tipo === 'series' || (movie.temporadas && movie.temporadas.length > 0);
  
  const durationText = isSeries 
    ? `${movie.temporadas?.length === 1 ? "1 Temporada" : `${movie.temporadas?.length || 1} Temporadas`}` 
    : movie.duracion || "N/A";
  
  const genresText = Array.isArray(movie.genero) 
    ? movie.genero.slice(0, 2).join(" • ") 
    : movie.genero;

  return (
    <header className="relative">
      
      {/* --- Imagen de Fondo --- */}
      <div className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 animate-fadeIn"
        style={{ backgroundImage: `url('${movie.backdrop || movie.poster}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] from-0% via-[#0f172a]/70 via-40% to-transparent to-80%"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/80 from-0% via-[#0f172a]/60 via-30% to-transparent to-60%"></div>

      </div>

      {/* --- Contenido Hero --- */}
      <div className="relative z-10 flex flex-col justify-end min-h-screen max-h-fit px-4 md:px-8 lg:px-16 max-w-4xl space-y-4 md:space-y-6 pt-24 pb-12 md:pb-16">
        
        {/* Badge Tipo */}
        <span className="bg-slate-800/80 w-fit px-3 py-1 rounded-full text-xs font-bold text-gray-300 uppercase tracking-widest backdrop-blur-sm border border-white/20 animate-fade-in-up">
          {isSeries ? "Serie" : "Película"}
        </span>

        {/* Título */}
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight animate-fade-in-up delay-100 drop-shadow-xl [text-shadow:_0_1px_1px_rgb(0_0_0_/_0.5)]">
          {movie.titulo}
        </h2>

        {movie.tagline ? (
          <p className="text-gray-100 italic text-lg font-light border-l-2 border-red-500 pl-3 line-clamp-2 md:line-clamp-none drop-shadow-md [text-shadow:_0_1px_1px_rgb(0_0_0_/_0.5)]">
            "{movie.tagline}"
          </p>
        ) : (
          movie.sinopsis && (
            <p className="text-gray-100 italic text-lg font-light border-l-2 border-red-500 pl-3 line-clamp-2 md:line-clamp-none drop-shadow-md [text-shadow:_0_1px_1px_rgb(0_0_0_/_0.5)]">
              "{movie.sinopsis.split('.')[0]}..." 
            </p>
          )
        )}

        {/* Sinopsis */}
        <p className="text-gray-300 text-base md:text-lg leading-relaxed line-clamp-3 max-w-2xl animate-fade-in-up delay-300 drop-shadow-md [text-shadow:_0_1px_1px_rgb(0_0_0_/_0.5)]">
          {movie.sinopsis}
        </p>

        {/* Botones */}
        <div className="flex flex-wrap gap-4 pt-3 animate-fade-in-up delay-500">
          <button 
            onClick={() => isSeries ? navigate(`/series/${movie.id}`) : navigate(`/peliculas/${movie.id}`)}
            className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-full font-bold hover:bg-green-500 transition shadow-lg shadow-green-900/50 hover:scale-105 transform duration-200"
          >
            <Play className="w-5 h-5 fill-current" />
            Ver Ahora
          </button>
          
          <button 
            onClick={() => isSeries ? navigate(`/series/${movie.id}`) : navigate(`/peliculas/${movie.id}`)}
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