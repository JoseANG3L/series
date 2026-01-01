import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import MovieSection from "../components/MovieSection";
import Hero from "../components/Hero";
import { getMovies, getSeries, getNovedades } from '../services/api'; // <--- Importamos los servicios

function Inicio() {
  // --- ESTADOS PARA CADA SECCIÓN ---
  const [novedades, setNovedades] = useState([]);
  const [peliculas, setPeliculas] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- CARGA DE DATOS ---
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        
        // Ejecutamos las 3 peticiones en paralelo para que sea más rápido
        const [dataNovedades, dataPeliculas, dataSeries] = await Promise.all([
          getNovedades(),
          getMovies(),
          getSeries()
        ]);

        setNovedades(dataNovedades);
        setPeliculas(dataPeliculas);
        setSeries(dataSeries);

      } catch (error) {
        console.error("Error cargando home:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // --- VISTA DE CARGA (Pantalla completa negra con spinner) ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans selection:bg-red-500 selection:text-white pb-20">
      
      {/* El Hero ya se encarga de cargar sus propios datos internamente */}
      <Hero />
      
      <br />
        
      {/* SECCIÓN 1: ESTRENOS (Prioridad Alta) */}
      {novedades.length > 0 && (
          <MovieSection 
              title="Nuevos Estrenos" 
              movies={novedades} 
              layout="carousel" 
          />
      )}

      {/* SECCIÓN 2: PELÍCULAS */}
      {peliculas.length > 0 && (
          <MovieSection 
              title="Películas Populares" 
              movies={peliculas} 
              layout="carousel" 
          />
      )}

      {/* SECCIÓN 3: SERIES */}
      {series.length > 0 && (
          <MovieSection 
              title="Últimas Series" 
              movies={series} 
              layout="carousel" 
          />
      )}

    </div>
  );
}

export default Inicio;