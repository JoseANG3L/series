import React from 'react';
import useSWR from 'swr'; // <--- 1. Importamos SWR
import MovieSection from "../components/MovieSection";
import { getNovedades } from '../services/api'; 
import { Loader2, WifiOff } from 'lucide-react';

function Novedades() {
  // --- LÓGICA AUTOMÁTICA CON SWR ---
  // Clave única: 'all-novedades'
  const { data: content, error, isLoading } = useSWR('all-novedades', getNovedades, {
    revalidateOnFocus: true, // Recarga si vuelves de otra pestaña
    dedupingInterval: 60000, // Caché de 1 minuto
  });

  // --- LOADING ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
          <p className="text-slate-400 animate-pulse">Buscando estrenos...</p>
        </div>
      </div>
    );
  }

  // --- ERROR ---
  if (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4 text-center">
          <WifiOff className="w-12 h-12 text-slate-600" />
          <p className="text-slate-400">No se pudieron cargar las novedades.</p>
        </div>
      </div>
    );
  }

  // --- RENDER ---
  return (
    <div className="pt-20 md:pt-24 min-h-screen bg-[#0f172a]">
      <MovieSection 
        title="Últimos Estrenos" 
        // Pasamos array vacío si 'content' es undefined para evitar errores
        movies={content || []} 
        layout="grid" 
      />
      
      {/* Mensaje si no hay resultados (array vacío pero sin error) */}
      {content && content.length === 0 && (
        <div className="text-center text-slate-500 mt-20 animate-fadeIn">
          <p>No hay novedades destacadas en este momento.</p>
        </div>
      )}
    </div>
  );
}

export default Novedades;