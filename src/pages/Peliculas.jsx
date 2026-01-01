import React, { useState, useEffect } from 'react';
import MovieSection from "../components/MovieSection";
import { getMovies } from '../services/api'; // <--- 1. Importamos el servicio
import { Loader2 } from 'lucide-react'; // Icono de carga

function Peliculas() {
  // --- ESTADOS ---
  const [movies, setMovies] = useState([]); // Aquí guardaremos las pelis de Supabase
  const [loading, setLoading] = useState(true); // Para saber si estamos cargando

  // --- EFECTO: CARGAR DATOS AL ENTRAR ---
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getMovies(); // Llamamos a Supabase
        setMovies(data);
      } catch (error) {
        console.error("Error al cargar películas:", error);
      } finally {
        setLoading(false); // Terminamos de cargar (haya error o no)
      }
    };

    fetchMovies();
  }, []);

  // --- RENDERIZADO CONDICIONAL (LOADING) ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
          <p className="text-slate-400 animate-pulse">Cargando biblioteca...</p>
        </div>
      </div>
    );
  }

  // --- RENDERIZADO FINAL ---
  return (
    <div className="pt-20 md:pt-24 min-h-screen bg-[#0f172a]">
      {/* Pasamos el estado 'movies' en lugar del JSON estático */}
      <MovieSection 
        title="Todas las Películas" 
        movies={movies} 
        layout="grid" 
        enableFilters={true} 
      />
    </div>
  );
}

export default Peliculas;