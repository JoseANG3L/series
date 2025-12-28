import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PELICULAS } from '../data/movies';
import { Search, Frown } from 'lucide-react';
import MovieCard from '../components/MovieCard'; // <--- 1. Importamos tu componente

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || ''; 

  // --- LÓGICA DE FILTRADO ---
  const filteredMovies = PELICULAS.filter((movie) => {
    const lowerQuery = query.toLowerCase();
    return (
      movie.titulo.toLowerCase().includes(lowerQuery) ||
      movie.genero.toLowerCase().includes(lowerQuery) ||
      movie.director.toLowerCase().includes(lowerQuery)
    );
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [query]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pt-20 md:pt-24 px-4 md:px-8 lg:px-16 pb-12 font-sans">
      
      {/* --- ENCABEZADO --- */}
      <div className="mb-8 border-b border-gray-800 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <Search className="text-red-500 w-8 h-8" />
          Resultados para: <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 italic">"{query}"</span>
        </h2>
        <p className="text-gray-400 mt-3 text-sm">
          Se encontraron {filteredMovies.length} coincidencias
        </p>
      </div>

      {/* --- GRID DE RESULTADOS --- */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 animate-fadeIn">
          {filteredMovies.map((movie) => (
            // 2. Usamos tu componente MovieCard
            <MovieCard 
              key={movie.id} 
              // 3. ADAPTADOR: Pasamos los datos como tu card los espera
              movie={{
                ...movie,
                image: movie.poster, // Mapeamos poster -> image
                title: movie.titulo  // Mapeamos titulo -> title
              }}
              variant="grid" 
            />
          ))}
        </div>
      ) : (
        
        /* --- ESTADO VACÍO (NO RESULTS) --- */
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 animate-fadeIn">
          <div className="bg-slate-800/50 p-6 rounded-full mb-4">
             <Frown className="w-16 h-16 text-gray-600" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No encontramos nada</h3>
          <p className="max-w-md text-center">
            No hay películas que coincidan con "<span className="text-red-400">{query}</span>". 
            Intenta buscar por el nombre del director o el género.
          </p>
          <Link to="/peliculas" className="mt-8 px-6 py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition shadow-lg shadow-red-900/40">
            Ver todas las películas
          </Link>
        </div>
      )}
    </div>
  );
};

export default SearchResults;