import React from 'react';
import useSWR from 'swr'; // <--- 1. Importamos SWR
import { Loader2, WifiOff } from 'lucide-react';
import MovieSection from "../components/MovieSection";
import Hero from "../components/Hero";
import { getMovies, getSeries, getNovedades } from '../services/api'; 

function Inicio() {
  // --- CONFIGURACIÓN SWR ---
  const config = {
    revalidateOnFocus: true, // Recarga al volver a la pestaña
    dedupingInterval: 60000, // Caché de 1 minuto
  };

  // --- PETICIONES EN PARALELO ---
  // SWR lanza las 3 peticiones al mismo tiempo automáticamente
  const { data: novedades, isLoading: loadNov } = useSWR('home-novedades', getNovedades, config);
  const { data: peliculas, isLoading: loadMov } = useSWR('home-movies', getMovies, config);
  const { data: series, isLoading: loadSer } = useSWR('home-series', getSeries, config);

  // Calculamos si todo está cargando (solo para la primera vez)
  const isLoading = loadNov || loadMov || loadSer;

  // --- VISTA DE CARGA ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
      </div>
    );
  }

  // --- RENDERIZADO ---
  return (
    <div className="min-h-screen bg-[#0f172a] font-sans selection:bg-red-500 selection:text-white pb-20">
      
      {/* El Hero carga su propia data internamente */}
      <Hero />
      <br />
      {/* Contenedor con margen negativo para solapar el Hero (Estilo Netflix) */}
      <div className="relative space-y-4 md:space-y-8">
        
        {/* SECCIÓN 1: ESTRENOS */}
        {novedades && novedades.length > 0 && (
            <MovieSection 
                title="Nuevos Estrenos" 
                movies={novedades} 
                layout="carousel" 
            />
        )}

        {/* SECCIÓN 2: PELÍCULAS */}
        {peliculas && peliculas.length > 0 && (
            <MovieSection 
                title="Películas Populares" 
                movies={peliculas} 
                layout="carousel" 
            />
        )}

        {/* SECCIÓN 3: SERIES */}
        {series && series.length > 0 && (
            <MovieSection 
                title="Últimas Series" 
                movies={series} 
                layout="carousel" 
            />
        )}

        {/* Mensaje si falló todo (Opcional) */}
        {(!novedades && !peliculas && !series) && (
             <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <WifiOff className="w-12 h-12 mb-2" />
                <p>No se pudo cargar el contenido</p>
             </div>
        )}
      </div>

    </div>
  );
}

export default Inicio;