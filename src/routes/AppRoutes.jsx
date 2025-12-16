import { Routes, Route } from "react-router-dom";
import Inicio from "../pages/Inicio";
import Peliculas from "../pages/Peliculas";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/peliculas" element={<Peliculas />} />
    </Routes>
  );
}
