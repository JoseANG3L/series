import React, { useState, useEffect } from 'react';
import MovieSection from "../components/MovieSection";
import { getSeries } from '../services/api'; // <--- 1. Importamos la función de series
import { Loader2 } from 'lucide-react';

function Series() {
  // --- ESTADOS ---
  const [series, setSeries] = useState([]); 
  const [loading, setLoading] = useState(true);

  // --- EFECTO: CARGAR DATOS ---
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const data = await getSeries(); // <--- 2. Llamamos a Supabase (Series)
        setSeries(data);
      } catch (error) {
        console.error("Error al cargar series:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, []);

  // --- LOADING ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
          <p className="text-slate-400 animate-pulse">Cargando series...</p>
        </div>
      </div>
    );
  }

  // --- RENDER ---
  return (
    <div className="pt-20 md:pt-24 min-h-screen bg-[#0f172a]">
      {/* Nota: Aunque la prop se llame 'movies', le pasamos el array de 'series'.
         Como tu MovieSection usa MovieCard y estandarizamos los datos en api.js,
         funcionará perfectamente.
      */}
      <MovieSection 
        title="Todas las Series" 
        movies={series} 
        layout="grid" 
        enableFilters={true} // Si quieres filtros también aquí
      />
    </div>
  );
}

export default Series;