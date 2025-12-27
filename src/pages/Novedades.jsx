import MovieCard from "../components/MovieCard";
import MovieSection from "../components/MovieSection";
import { PELICULAS } from "../data/movies";

function Novedades() {
  return (
    <div className="pt-20 md:pt-24">
      <MovieSection title="Todas las Novedades" movies={PELICULAS} layout="grid" />
    </div>
  );
}

export default Novedades;
