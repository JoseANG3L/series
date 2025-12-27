import { useState } from 'react'; 
import { Search, Star, Menu, X } from 'lucide-react'; 
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  // LISTA DE SECCIONES (Para no repetir código)
  const NAV_LINKS = [
    { name: "Inicio", path: "/" },
    { name: "Películas", path: "/peliculas" },
    { name: "Series", path: "/series" },
    { name: "Novedades", path: "/novedades" },
    { name: "Mi Lista", path: "/mi-lista" },
  ];

  return (
    <nav className="absolute top-0 left-0 w-full z-50 px-4 md:px-8 lg:px-16 py-4 md:py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
      
      {/* --- LOGO --- */}
      <div className="flex items-center gap-8 lg:gap-12 z-50">
        <NavLink to="/" onClick={closeMenu}>
          <h1 className="flex gap-2 justify-center items-center text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 tracking-tighter cursor-pointer">
            LUIS<span className=""><Star size={24} color="gold" fill="gold" /></span>FSERIES
          </h1>
        </NavLink>

        {/* --- MENÚ DE ESCRITORIO (Ahora con .map) --- */}
        <ul className="hidden md:flex gap-6 lg:gap-8 font-medium text-sm lg:text-base">
          {NAV_LINKS.map((link) => (
            <NavLink 
              key={link.name}
              to={link.path} 
              className={({ isActive }) => 
                isActive ? "text-red-500 font-bold" : "text-gray-300 hover:text-red-500 transition"
              }
            >
              {link.name}
            </NavLink>
          ))}
        </ul>
      </div>

      {/* --- ACCIONES (Derecha) --- */}
      <div className="flex items-center gap-4 md:gap-6 z-50">
        <button className="text-white hover:text-red-500 transition">
          <Search className="w-6 h-6" />
        </button>
        
        {/* Botones de escritorio */}
        <div className="hidden md:flex gap-3">
            <button className="px-5 py-2 border border-gray-500 text-white rounded-full text-sm font-semibold hover:border-white transition">Sign up</button>
            <button className="px-5 py-2 bg-green-600 text-white rounded-full text-sm font-semibold hover:bg-green-500 shadow-lg shadow-green-900/50 transition">Login</button>
        </div>

        {/* --- BOTÓN HAMBURGUESA --- */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-white hover:text-red-500 transition"
        >
          {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* --- MENÚ MÓVIL (Overlay) --- */}
      <div className={`
        fixed inset-0 bg-slate-950/95 backdrop-blur-lg z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"} md:hidden
      `}>
        <ul className="flex flex-col items-center gap-8 text-2xl font-bold">
          {/* Generamos los links móviles también con .map */}
          {NAV_LINKS.map((link) => (
            <NavLink 
              key={link.name}
              to={link.path} 
              onClick={closeMenu} 
              className={({ isActive }) => 
                isActive ? "text-red-500" : "text-white hover:text-red-500 transition"
              }
            >
              {link.name}
            </NavLink>
          ))}
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