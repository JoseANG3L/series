import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import useSWR from 'swr'; // <--- 1. Importamos SWR
import { Search, Frown, Loader2, WifiOff } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { getMovies, getSeries } from '../services/api'; 

// --- 2. FETCHER UNIFICADO ---
// Esta función baja todo el contenido de golpe para poder buscar en él
const fetchFullCatalog = async () => {
    const [movies, series] = await Promise.all([
        getMovies(),
        getSeries()
    ]);
    // Unimos los dos arrays en uno solo
    return [...movies, ...series];
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // --- 3. SWR (Carga de datos) ---
  // Usamos una clave 'full-catalog' para que si ya cargaste datos en Inicio,
  // aquí estén disponibles casi de inmediato.
  const { data: allContent, isLoading, error } = useSWR('full-catalog', fetchFullCatalog, {
    revalidateOnFocus: false, // No necesitamos revalidar tanto en búsqueda
    dedupingInterval: 120000, // Caché de 2 minutos
  });

  // --- 4. FILTRADO (Lógica local) ---
  // Usamos useMemo para que el filtrado sea eficiente y solo ocurra 
  // si cambian los datos (allContent) o la búsqueda (query).
  const results = useMemo(() => {
    if (!allContent || !query) return [];

    const lowerQuery = query.toLowerCase();

    return allContent.filter((item) => {
        // a) Buscar en Título
        const matchTitle = item.titulo.toLowerCase().includes(lowerQuery);
        
        // b) Buscar en Director
        const matchDirector = item.director 
            ? item.director.toLowerCase().includes(lowerQuery) 
            : false;

        // c) Buscar en Géneros
        let matchGenre = false;
        if (Array.isArray(item.genero)) {
            matchGenre = item.genero.some(g => g.toLowerCase().includes(lowerQuery));
        } else if (typeof item.genero === 'string') {
            matchGenre = item.genero.toLowerCase().includes(lowerQuery);
        }

        return matchTitle || matchDirector || matchGenre;
    });
  }, [allContent, query]);


  // --- LOADING ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center pt-20">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
      </div>
    );
  }

  // --- ERROR ---
  if (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center pt-20 text-slate-500">
        <WifiOff className="w-10 h-10 mb-2" />
        <p>No se pudo realizar la búsqueda.</p>
      </div>
    );
  }

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-[#0f172a] text-white pt-20 md:pt-24 px-4 md:px-8 lg:px-16 pb-12 font-sans">
      
      {/* --- ENCABEZADO --- */}
      <div className="mb-8 border-b border-gray-800 pb-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Search className="text-red-500 w-8 h-8" />
          Resultados para: <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 italic">"{query}"</span>
        </h2>
        <p className="text-gray-400 mt-3 text-sm">
          Se encontraron {results.length} coincidencias
        </p>
      </div>

      {/* --- GRID DE RESULTADOS --- */}
      {results.length > 0 ? (
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 animate-fadeIn">
          {results.map((item) => (
            <MovieCard 
              key={item.id} 
              movie={{
                id: item.id,
                title: item.titulo, 
                image: item.poster, 
                type: item.type,
                rating: item.rating
              }}
              variant="grid" 
            />
          ))}
        </div>
      ) : (
        
        /* --- ESTADO VACÍO (NO RESULTS) --- */
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 animate-fadeIn">
          <div className="bg-slate-800/50 p-6 rounded-full mb-4 border border-slate-700">
             <Frown className="w-16 h-16 text-slate-600" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No encontramos nada</h3>
          <p className="max-w-md text-center mb-8">
            No hay contenido que coincida con "<span className="text-red-400">{query}</span>". 
            <br/>Intenta buscar por título, director o género.
          </p>
          <div className="flex gap-4">
              <Link to="/peliculas" className="px-6 py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition shadow-lg shadow-red-900/40">
                Ver Películas
              </Link>
              <Link to="/series" className="px-6 py-3 bg-slate-700 text-white rounded-full font-bold hover:bg-slate-600 transition border border-slate-500">
                Ver Series
              </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;