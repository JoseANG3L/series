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
import UpdatePassword from "../pages/UpdatePassword";
import NotFound from "../pages/NotFound";
import LegalPage from "../pages/LegalPage";
import ScrollToTop from "../components/ScrollToTop";
import AdminPanel from "../pages/AdminPanel";

// 1. IMPORTANTE: Importar el Guardián
import ProtectedRoute from "./ProtectedRoute"; 

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* --- Rutas Principales --- */}
        <Route path="/" element={<Inicio />} />
        <Route path="/peliculas" element={<Peliculas />} />

        {/* --- Rutas Nuevas del Navbar --- */}
        <Route path="/series" element={<Series />} />
        <Route path="/novedades" element={<Novedades />} />
        <Route path="/mi-lista" element={<MiLista />} />
        <Route path="/buscar" element={<SearchResults />} />

        {/* --- Ruta Dinámica de Detalles --- */}
        <Route path="/movie/:id" element={<MovieDetail movies={PELICULAS} />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />

        {/* RUTAS LEGALES */}
        <Route path="/terms" element={<LegalPage title="Términos de Uso" type="terms" />} />
        <Route path="/privacy" element={<LegalPage title="Política de Privacidad" type="privacy" />} />
        <Route path="/cookies" element={<LegalPage title="Política de Cookies" type="cookies" />} />
        <Route path="/contact" element={<LegalPage title="Contacto" type="contact" />} />

        {/* --- 2. AQUÍ ESTÁ LA PROTECCIÓN --- */}
        {/* Creamos una "cápsula" que verifica si eres admin */}
        <Route element={<ProtectedRoute requireAdmin={true} />}>
            
            {/* Si ProtectedRoute dice "OK", entonces muestra esto: */}
            <Route path="/admin" element={<AdminPanel />} />

        </Route>
        {/* ---------------------------------- */}

        {/* --- Ruta 404 --- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}