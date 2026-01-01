import React, { useState, useEffect } from 'react';
import MovieSection from "../components/MovieSection";
import { getNovedades } from '../services/api'; // <--- 1. Usamos la función de novedades
import { Loader2 } from 'lucide-react';

function Novedades() {
  // --- ESTADOS ---
  const [content, setContent] = useState([]); 
  const [loading, setLoading] = useState(true);

  // --- EFECTO ---
  useEffect(() => {
    const fetchNovedades = async () => {
      try {
        // Esto traerá tanto Películas como Series que tengan "is_premiere = true"
        const data = await getNovedades(); 
        setContent(data);
      } catch (error) {
        console.error("Error al cargar novedades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNovedades();
  }, []);

  // --- LOADING ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
          <p className="text-slate-400 animate-pulse">Buscando estrenos...</p>
        </div>
      </div>
    );
  }

  // --- RENDER ---
  return (
    <div className="pt-20 md:pt-24 min-h-screen bg-[#0f172a]">
      <MovieSection 
        title="Últimos Estrenos" 
        movies={content} 
        layout="grid" 
        // enableFilters={false} // Quizás aquí no quieras filtros, o sí. Tú decides.
      />
      
      {/* Mensaje opcional si no hay novedades */}
      {!loading && content.length === 0 && (
        <div className="text-center text-slate-500 mt-10">
          <p>No hay novedades destacadas en este momento.</p>
        </div>
      )}
    </div>
  );
}

export default Novedades;