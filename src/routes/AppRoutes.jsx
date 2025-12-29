import { Routes, Route } from "react-router-dom";
import Inicio from "../pages/Inicio";
import Peliculas from "../pages/Peliculas";
import MovieDetail from "../pages/MovieDetail";
import { PELICULAS } from "../data/movies";
import Series from "../pages/Series";
import Novedades from "../pages/Novedades";
import MiLista from "../pages/MiLista";
import SearchResults from "../pages/SearchResults";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      {/* --- Rutas Principales --- */}
      <Route path="/" element={<Inicio />} />
      <Route path="/peliculas" element={<Peliculas />} />

      {/* --- Rutas Nuevas del Navbar --- */}
      {/* Usamos elementos temporales hasta que crees las páginas reales */}
      <Route path="/series" element={<Series />} />
      <Route path="/novedades" element={<Novedades />} />
      <Route path="/mi-lista" element={<MiLista />} />
      <Route path="/buscar" element={<SearchResults />} />

      {/* --- Ruta Dinámica de Detalles --- */}
      <Route path="/movie/:id" element={<MovieDetail movies={PELICULAS} />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* --- Ruta 404 (Opcional: Por si escriben mal la URL) --- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}