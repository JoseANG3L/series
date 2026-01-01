import React from 'react';
import useSWR from 'swr'; // <--- 1. Importamos el hook mágico
import MovieSection from "../components/MovieSection";
import { getMovies } from '../services/api'; 
import { Loader2, WifiOff } from 'lucide-react';

function Peliculas() {
  // --- LÓGICA AUTOMÁTICA ---
  // useSWR( 'clave-unica', funcion-fetcher )
  // 1. 'all-movies': Es el nombre de la caché.
  // 2. getMovies: Tu función de la API.
  const { data: movies, error, isLoading } = useSWR('all-movies', getMovies, {
    revalidateOnFocus: true, // Esto arregla lo de volver de YouTube automáticamente
    dedupingInterval: 60000, // No vuelve a pedir datos en 1 min si ya los tiene (ahorra peticiones)
  });

  // --- RENDERIZADO CONDICIONAL (LOADING) ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
          <p className="text-slate-400 animate-pulse">Cargando biblioteca...</p>
        </div>
      </div>
    );
  }

  // --- RENDERIZADO CONDICIONAL (ERROR) ---
  // SWR nos avisa si falló la conexión después de varios intentos
  if (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4 text-center">
          <WifiOff className="w-12 h-12 text-slate-600" />
          <p className="text-slate-400">Error al cargar el contenido.</p>
        </div>
      </div>
    );
  }

  // --- RENDERIZADO FINAL ---
  return (
    <div className="pt-20 md:pt-24 min-h-screen bg-[#0f172a]">
      <MovieSection 
        title="Todas las Películas" 
        // Si movies es undefined (aún no carga), pasamos array vacío [] para que no rompa
        movies={movies || []} 
        layout="grid" 
        enableFilters={true} 
      />
    </div>
  );
}

export default Peliculas;