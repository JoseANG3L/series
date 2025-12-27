import React from 'react';
import { useSearchParams } from 'react-router-dom'; // Hook para leer la URL
import MovieCard from '../components/MovieCard';
import { PELICULAS } from '../data/movies';
import { Search } from 'lucide-react';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || ''; // Obtenemos el texto de búsqueda

  // Filtramos las películas por título (ignorando mayúsculas/minúsculas)
  const filteredMovies = PELICULAS.filter((movie) => 
    movie.titulo.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f172a] pt-24 px-4 md:px-8 lg:px-16 pb-12">
      <h2 className="text-2xl text-white font-bold mb-6 flex items-center gap-2">
        <Search className="text-red-500" />
        Resultados para: <span className="text-red-500 italic">"{query}"</span>
      </h2>

      {filteredMovies.length > 0 ? (
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 animate-fadeIn">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} variant="grid" />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-xl">No encontramos ninguna película con ese nombre 😢</p>
          <p className="text-sm mt-2">Intenta buscar "Batman", "Avatar" o "Matrix".</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;