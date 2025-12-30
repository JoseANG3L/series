import MovieCard from "../components/MovieCard";
import MovieSection from "../components/MovieSection";
import { PELICULAS } from "../data/movies";
import AdSenseBanner from '../components/AdSenseBanner';

function Peliculas() {
  return (
    <div className="pt-20 md:pt-24">
      <MovieSection title="Todas las Peliculas" movies={PELICULAS} layout="grid" enableFilters={true} />
      {/* --- ANUNCIO 1 --- */}
      <AdSenseBanner slot="1234567890" />
    </div>
  );
}

export default Peliculas;
