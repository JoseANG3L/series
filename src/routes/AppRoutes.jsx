import { Routes, Route } from "react-router-dom";
import Inicio from "../pages/Inicio";
import Peliculas from "../pages/Peliculas";
import MovieDetail from "../pages/MovieDetail";
import { PELICULAS } from "../data/movies";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/peliculas" element={<Peliculas />} />
      <Route path="/movie/:id" element={<MovieDetail movies={PELICULAS} />} />
    </Routes>
  );
}
