import MovieCard from "./MovieCard";

const MovieSection = ({ title, movies, layout = "carousel" }) => {
  return (
    <section className="px-4 md:px-8 lg:px-16 pb-12">
      
      {/* Título */}
      <h3 className="text-2xl font-bold text-white mb-8 border-l-4 border-red-500 pl-4">
        {title}
      </h3>

      {/* Carrusel */}
      {layout === "carousel" && (
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide scrollbar-red">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={{ id: movie.id, title: movie.titulo, image: movie.poster }} variant="carousel" />
          ))}
        </div>
      )}

      {/* Grid */}
      {layout === "grid" && (
        <div className="grid gap-6 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={{ id: movie.id, title: movie.titulo, image: movie.poster }} variant="grid" />
          ))}
        </div>
      )}
    </section>
  );
};

export default MovieSection;
