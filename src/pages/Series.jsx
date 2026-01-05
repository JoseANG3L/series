import React from 'react';
import useSWR from 'swr'; // <--- 1. Importamos SWR
import MovieSection from "../components/MovieSection";
import { getSeries } from '../services/api'; 
import { Loader2, WifiOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Series() {
  const navigate = useNavigate();

  // --- LÓGICA AUTOMÁTICA CON SWR ---
  // Usamos una clave única: 'all-series'
  const { data: series, error, isLoading } = useSWR('all-series', getSeries, {
    revalidateOnFocus: true, // Recarga si vuelves de otra pestaña
    dedupingInterval: 60000, // Mantiene la caché 1 minuto
  });

  const handleAddClick = () => {
    navigate('/series/nuevo');
  };

  // --- LOADING ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
          <p className="text-slate-400 animate-pulse">Cargando series...</p>
        </div>
      </div>
    );
  }

  // --- ERROR (Si falla la conexión) ---
  if (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4 text-center">
          <WifiOff className="w-12 h-12 text-slate-600" />
          <p className="text-slate-400">No se pudieron cargar las series.</p>
        </div>
      </div>
    );
  }

  // --- RENDER ---
  return (
    <div className="pt-20 md:pt-24 min-h-screen bg-[#0f172a]">
      <MovieSection 
        title="Todas las Series" 
        // Si aún no hay datos, pasamos array vacío para evitar errores
        movies={series || []} 
        layout="grid" 
        enableFilters={true}
        onAddClick={handleAddClick}
      />
    </div>
  );
}

export default Series;