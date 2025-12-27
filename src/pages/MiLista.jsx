import MovieCard from "../components/MovieCard";
import MovieSection from "../components/MovieSection";
import { PELICULAS } from "../data/movies";

function MiLista() {
  return (
    <div className="pt-20 md:pt-24">
      <MovieSection title="Mi Lista" movies={PELICULAS} layout="grid" />
    </div>
  );
}

export default MiLista;
