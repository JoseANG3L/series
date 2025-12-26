import MovieCard from "../components/MovieCard";
import MovieSection from "../components/MovieSection";
import { PELICULAS } from "../data/movies";

function Peliculas() {
  return (
    <div className="mt-28">
      <MovieSection title="Todas las Peliculas" movies={PELICULAS} layout="grid" />
    </div>
  );
}

export default Peliculas;
