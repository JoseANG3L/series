import { useState } from 'react'; // 1. Importar useState
import { Search, Star, Menu, X } from 'lucide-react'; // 2. Agregar iconos Menu y X
import { NavLink } from "react-router-dom";

const Navbar = () => {
  // Estado para controlar el menú móvil
  const [isOpen, setIsOpen] = useState(false);

  // Función para cerrar el menú al hacer clic en un enlace
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="absolute top-0 left-0 w-full z-50 px-4 md:px-8 lg:px-16 py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
      
      {/* --- LOGO --- */}
      <div className="flex items-center gap-12 z-50"> {/* z-50 para que el logo se vea sobre el menú móvil */}
        <NavLink to="/" onClick={closeMenu}>
          <h1 className="flex gap-2 justify-center items-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 tracking-tighter cursor-pointer">
            LUIS<span className=""><Star size={24} color="gold" fill="gold" /></span>FSERIES
          </h1>
        </NavLink>

        {/* --- MENÚ DE ESCRITORIO (Oculto en móvil) --- */}
        <ul className="hidden md:flex gap-8 font-medium">
          <NavLink to="/" end className={({ isActive }) => isActive ? "text-red-500" : "text-gray-300 hover:text-red-500 transition"}>
            Inicio
          </NavLink>
          <NavLink to="/peliculas" end className={({ isActive }) => isActive ? "text-red-500" : "text-gray-300 hover:text-red-500 transition"}>
            Peliculas
          </NavLink>
        </ul>
      </div>

      {/* --- ACCIONES (Derecha) --- */}
      <div className="flex items-center gap-4 md:gap-6 z-50">
        <button className="text-white hover:text-red-500 transition">
          <Search className="w-6 h-6" />
        </button>
        
        {/* Botones de escritorio */}
        <button className="hidden md:block px-5 py-2 border border-gray-500 text-white rounded-full text-sm font-semibold hover:border-white transition">Sign up</button>
        <button className="hidden md:block px-5 py-2 bg-green-600 text-white rounded-full text-sm font-semibold hover:bg-green-500 shadow-lg shadow-green-900/50 transition">Login</button>

        {/* --- BOTÓN HAMBURGUESA (Solo móvil) --- */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-white hover:text-red-500 transition"
        >
          {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* --- MENÚ MÓVIL (Overlay Pantalla Completa) --- */}
      <div className={`
        fixed inset-0 bg-slate-950/95 backdrop-blur-lg z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"} md:hidden
      `}>
        <ul className="flex flex-col items-center gap-8 text-2xl font-bold">
          <NavLink 
            to="/" 
            end 
            onClick={closeMenu} 
            className={({ isActive }) => isActive ? "text-red-500" : "text-white hover:text-red-500 transition"}
          >
            Inicio
          </NavLink>
          <NavLink 
            to="/peliculas" 
            end 
            onClick={closeMenu} 
            className={({ isActive }) => isActive ? "text-red-500" : "text-white hover:text-red-500 transition"}
          >
            Peliculas
          </NavLink>
        </ul>

        {/* Botones de acción en móvil */}
        <div className="flex flex-col gap-4 mt-8 w-64">
          <button className="px-5 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-500 shadow-lg">
            Login
          </button>
          <button className="px-5 py-3 border border-gray-500 text-white rounded-full font-semibold hover:border-white">
            Sign up
          </button>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;