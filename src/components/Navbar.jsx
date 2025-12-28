import { useState, useRef, useEffect } from 'react';
import { Search, Star, Menu, X, ChevronDown } from 'lucide-react';
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  // --- ESTADOS ---
  const [isOpen, setIsOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4); 

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  // --- REFS ---
  const inputRef = useRef(null);      // Para el focus del input
  const moreMenuRef = useRef(null);   // Para detectar click fuera del menú "Más"
  const searchFormRef = useRef(null); // NUEVO: Para detectar click fuera de la búsqueda

  // --- LÓGICA DE NAVEGACIÓN ---
  const NAV_LINKS = [
    { name: "Inicio", path: "/" },
    { name: "Películas", path: "/peliculas" },
    { name: "Series", path: "/series" },
    { name: "Novedades", path: "/novedades" },
    { name: "Mi Lista", path: "/mi-lista" },
    { name: "Infantil", path: "/kids" },
    { name: "Originales", path: "/originals" },
  ];

  // --- EFECTO: CERRAR MENÚS AL DAR CLICK AFUERA ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 1. Cerrar menú "Más"
      if (isMoreMenuOpen && moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setIsMoreMenuOpen(false);
      }
      // 2. Cerrar Búsqueda de Escritorio (NUEVO)
      // Si está abierta, y el clic NO fue dentro del formulario de búsqueda
      if (isDesktopSearchOpen && searchFormRef.current && !searchFormRef.current.contains(event.target)) {
        // Opcional: Si quieres que SOLO se cierre si está vacío, agrega: && !searchTerm
        setIsDesktopSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMoreMenuOpen, isDesktopSearchOpen, searchTerm]); // Agregamos isDesktopSearchOpen y searchTerm a las dependencias

  // --- EFECTO: RESPONSIVE LINKS ---
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) setVisibleCount(6); 
      else if (width >= 1024) setVisibleCount(4);
      else setVisibleCount(2); 
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const VISIBLE_LINKS = NAV_LINKS.slice(0, visibleCount);
  const HIDDEN_LINKS = NAV_LINKS.slice(visibleCount);

  // --- HANDLERS ---
  const closeMenu = () => {
    setIsOpen(false);
    setIsMoreMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/buscar?q=${searchTerm}`);
      setIsOpen(false);
      setShowMobileSearch(false);
      setIsDesktopSearchOpen(false);
    }
  };

  // Lógica corregida para el botón de la lupa en escritorio
  const handleSearchIconClick = (e) => {
    // Caso 1: Si está cerrado, LO ABRIMOS (y prevenimos submit)
    if (!isDesktopSearchOpen) {
      e.preventDefault();
      setIsDesktopSearchOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
      return;
    }

    // Caso 2: Si está abierto pero VACÍO, LO CERRAMOS (y prevenimos submit)
    if (isDesktopSearchOpen && !searchTerm.trim()) {
      e.preventDefault();
      setIsDesktopSearchOpen(false);
      return;
    }

    // Caso 3: Si está abierto y TIENE TEXTO, NO hacemos preventDefault.
    // Dejamos que el botón type="submit" dispare el evento onSubmit del formulario (handleSearch).
  };

  return (
    <nav className="absolute top-0 left-0 w-full z-50 bg-gradient-to-b from-black/70 to-transparent">
      
      <div className="px-4 md:px-8 lg:px-16 py-4 flex justify-between items-center relative">
        
        {/* --- 1. IZQUIERDA: LOGO Y NAVEGACIÓN --- */}
        <div className="flex items-center gap-6 lg:gap-12 z-20 flex-1">
          
          <NavLink to="/" onClick={closeMenu} className="shrink-0 relative z-30">
            <h1 className="flex gap-1 md:gap-2 justify-center items-center text-xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 tracking-tighter cursor-pointer">
              LUIS<Star className="w-5 h-5 md:w-8 md:h-8" color="gold" fill="gold" />FSERIES
            </h1>
          </NavLink>

          {/* MENÚ ESCRITORIO */}
          <ul className="hidden md:flex gap-4 lg:gap-7 font-medium lg:text-base items-center">
            {VISIBLE_LINKS.map((link) => (
              <NavLink key={link.name} to={link.path} className={({ isActive }) => `whitespace-nowrap transition ${isActive ? "text-red-500 font-bold" : "text-gray-300 hover:text-red-500"}`}>
                {link.name}
              </NavLink>
            ))}

            {/* Botón "Más" */}
            {HIDDEN_LINKS.length > 0 && (
              <li className="relative" ref={moreMenuRef}>
                <button onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)} className={`flex items-center gap-1 transition whitespace-nowrap ${isMoreMenuOpen ? 'text-white' : 'text-gray-300 hover:text-red-500'}`}>
                  Más <ChevronDown className={`w-4 h-4 transition-transform ${isMoreMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMoreMenuOpen && (
                  <div className="absolute top-full left-0 mt-4 w-48 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl overflow-hidden animate-fadeIn flex flex-col z-50">
                    {HIDDEN_LINKS.map((link) => (
                      <NavLink key={link.name} to={link.path} onClick={closeMenu} className={({ isActive }) => `block px-4 py-3 hover:bg-slate-800 transition ${isActive ? "text-red-500 font-bold" : "text-gray-300"}`}>
                        {link.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>

        {/* --- 2. DERECHA: BÚSQUEDA + AUTH --- */}
        <div className="flex items-center justify-end gap-3 md:gap-4 relative shrink-0">
          
          {/* A. BÚSQUEDA ESCRITORIO */}
          <div className="hidden md:flex items-center justify-end relative z-30">
            <form 
              ref={searchFormRef} // <--- REFERENCIA AGREGADA AQUÍ
              onSubmit={handleSearch}
              className={`
                flex items-center justify-between bg-slate-800 border transition-all duration-500 ease-out origin-right absolute right-0 top-1/2 -translate-y-1/2
                ${isDesktopSearchOpen ? 'w-[280px] px-4 border-slate-600 shadow-2xl' : 'w-10 border-transparent bg-transparent'}
                h-10 rounded-full
              `}
            >
              <input 
                ref={inputRef}
                type="text" 
                placeholder="Buscar..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                // Quitamos el onBlur aquí para que lo maneje el handleClickOutside
                className={`
                  bg-transparent text-white text-sm outline-none transition-all duration-300 
                  ${isDesktopSearchOpen ? 'w-full opacity-100 pl-1' : 'w-0 opacity-0'}
                `}
              />
              <button 
                type="submit" 
                onClick={handleSearchIconClick}
                className={`shrink-0 text-gray-300 hover:text-white transition ${!isDesktopSearchOpen && 'hover:text-red-500'}`}
              >
                 <Search className="w-5 h-5" />
              </button>
            </form>
            <div className="w-10 h-10"></div>
          </div>

          {/* B. BOTONES AUTH */}
          <div className="hidden md:flex gap-3 relative z-40 bg-transparent">
              <button onClick={() => navigate('/signup')} className="px-5 py-2 border border-gray-500 text-white rounded-full text-sm font-semibold hover:border-white transition whitespace-nowrap">Sign up</button>
              <button onClick={() => navigate('/login')} className="px-5 py-2 bg-green-600 text-white rounded-full text-sm font-semibold hover:bg-green-500 shadow-lg shadow-green-900/50 transition whitespace-nowrap">Login</button>
          </div>

          {/* C. ELEMENTOS MÓVILES */}
          <button onClick={() => setShowMobileSearch(!showMobileSearch)} className={`md:hidden transition ${showMobileSearch ? 'text-red-500' : 'text-white'}`}>
             <Search className="w-6 h-6" />
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white hover:text-red-500 transition shrink-0 z-50">
            {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* --- PANELES MÓVILES --- */}
      {showMobileSearch && (
        <div className="md:hidden absolute top-full left-0 w-full backdrop-blur-md px-4 animate-fadeIn z-40">
           <form onSubmit={handleSearch} className="relative w-full shadow-2xl">
              <input autoFocus type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-black/50 border border-gray-600 text-white px-4 py-3 pl-10 rounded-lg outline-none focus:border-red-500" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
           </form>
        </div>
      )}

      <div className={`fixed inset-0 bg-slate-950/95 backdrop-blur-lg z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"} md:hidden`}>
        <ul className="flex flex-col items-center gap-6 text-xl font-bold">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.name} to={link.path} onClick={closeMenu} className={({ isActive }) => isActive ? "text-red-500" : "text-white hover:text-red-500 transition"}>{link.name}</NavLink>
          ))}
        </ul>
        <div className="flex flex-col gap-4 mt-4 w-64">
          <button onClick={() => navigate('/login')} className="px-5 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-500 shadow-lg">Login</button>
          <button onClick={() => navigate('/signup')} className="px-5 py-3 border border-gray-500 text-white rounded-full font-semibold hover:border-white">Sign up</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;