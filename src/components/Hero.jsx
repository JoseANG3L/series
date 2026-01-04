import React, { useState } from 'react';
import useSWR from 'swr'; // <--- 1. Importamos SWR
import { Play, Bookmark, Info, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { getContentById } from '../services/api';

const Hero = () => {
  const navigate = useNavigate();

  const [showPlayer, setShowPlayer] = useState(false);

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
  
  const previewUrl = movie.preview || null;

  return (
    <header className="relative">
      
      {/* --- Imagen de Fondo --- */}
      <div className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 animate-fadeIn"
        style={{ backgroundImage: `url('${movie.backdrop || movie.poster}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] from-0% via-[#0f172a]/60 via-40% to-transparent to-70%"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/80 from-0% via-[#0f172a]/50 via-30% to-transparent to-50%"></div>

      </div>

      {/* --- Contenido Hero --- */}
      <div className="relative z-10 flex flex-col justify-end min-h-screen max-h-fit px-4 md:px-8 lg:px-16 max-w-4xl space-y-4 md:space-y-6 pt-24 pb-12 md:pb-16">
        
        {/* Badge Tipo */}
        <span className="bg-slate-800/80 w-fit px-3 py-2 rounded-full text-xs font-bold text-gray-300 uppercase tracking-widest backdrop-blur-sm border border-white/20 animate-fade-in-up">
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
            onClick={() => previewUrl && setShowPlayer(true)}
            className={`flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-full font-bold hover:bg-green-500 transition shadow-lg shadow-green-900/50 hover:scale-105 transform duration-200 ${!previewUrl && 'opacity-50 cursor-not-allowed'}`}
          >
            <Play className="w-5 h-5 fill-current" /> Ver Ahora
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

      {/* --- REPRODUCTOR DE VIDEO MODAL --- */}
      {showPlayer && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-fadeIn">
            
            {/* Botón Cerrar */}
            <button 
                onClick={() => setShowPlayer(false)}
                className="absolute top-6 right-6 z-50 bg-black/50 hover:bg-white/20 p-2 rounded-full text-white transition border border-white/10"
            >
                <X className="w-8 h-8" />
            </button>

            <div className="w-full h-full max-w-7xl max-h-[90vh] aspect-video bg-black shadow-2xl relative">
                
                {/* Lógica para detectar tipo de video */}
                {previewUrl && (previewUrl.includes("youtube.com") || previewUrl.includes("youtu.be")) ? (
                    // 1. SI ES YOUTUBE
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src={
                            previewUrl.includes("youtu.be/") 
                                ? previewUrl.replace("youtu.be/", "www.youtube-nocookie.com/embed/") + "?autoplay=1"
                                : previewUrl.replace("watch?v=", "embed/").replace("youtube.com", "youtube-nocookie.com") + "?autoplay=1"
                        }
                        title="Reproductor" 
                        frameBorder="0"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                ) : (
                    // 2. SI ES MP4 / ARCHIVO DIRECTO
                    <video 
                        src={previewUrl} 
                        controls 
                        autoPlay 
                        className="w-full h-full object-contain focus:outline-none"
                    >
                        Tu navegador no soporta el elemento de video.
                    </video>
                )}
            </div>
        </div>
      )}
    </header>
  );
};

export default Hero;