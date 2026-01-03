import { useState, useRef, useEffect } from 'react';
import { Search, Star, Menu, X, ChevronDown, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

const Navbar = () => {
  const { user, role, signOut } = useAuth(); 
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [isOpen, setIsOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4); 
  const [searchTerm, setSearchTerm] = useState("");
  
  // --- REFS ---
  const inputRef = useRef(null);      
  const moreMenuRef = useRef(null);   
  const searchFormRef = useRef(null); 
  const userMenuRef = useRef(null);

  // --- LÓGICA DE NAVEGACIÓN ---
  const NAV_LINKS = [
    { name: "Inicio", path: "/" },
    { name: "Películas", path: "/peliculas" },
    { name: "Series", path: "/series" },
    { name: "Novedades", path: "/novedades" },
  ];

  // --- EFECTOS ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMoreMenuOpen && moreMenuRef.current && !moreMenuRef.current.contains(event.target)) setIsMoreMenuOpen(false);
      if (isDesktopSearchOpen && searchFormRef.current && !searchFormRef.current.contains(event.target)) setIsDesktopSearchOpen(false);
      if (isUserMenuOpen && userMenuRef.current && !userMenuRef.current.contains(event.target)) setIsUserMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMoreMenuOpen, isDesktopSearchOpen, isUserMenuOpen]);

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

  // --- EFECTO PARA BLOQUEAR SCROLL DEL BODY ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const VISIBLE_LINKS = NAV_LINKS.slice(0, visibleCount);
  const HIDDEN_LINKS = NAV_LINKS.slice(visibleCount);

  // --- HANDLERS ---
  const closeMenu = () => {
    setIsOpen(false);
    setIsMoreMenuOpen(false);
    setIsUserMenuOpen(false);
    setShowMobileSearch(false);
  };

  const handleAdminClick = () => {
    navigate('/admin');
    closeMenu(); 
  };

  const handleProfileClick = () => {
    navigate('/perfil'); // <--- NUEVO HANDLER
    closeMenu();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/buscar?q=${searchTerm}`);
      closeMenu();
      setIsDesktopSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    closeMenu();
    navigate('/login');
  };

  const handleSearchIconClick = (e) => {
    if (!isDesktopSearchOpen) {
      e.preventDefault();
      setIsDesktopSearchOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
      return;
    }
    if (isDesktopSearchOpen && !searchTerm.trim()) {
      e.preventDefault();
      setIsDesktopSearchOpen(false);
      return;
    }
  };

  return (
    <nav className="absolute top-0 left-0 w-full z-50">
      
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#0f172a]/80 via-[#0f172a]/40 to-transparent"></div>
      
      <div className="px-4 md:px-8 lg:px-16 py-3 flex justify-between items-center relative">
        
        {/* --- IZQUIERDA: LOGO --- */}
        <div className="flex items-center gap-6 lg:gap-12 z-20 flex-1">
          <NavLink to="/" onClick={closeMenu} className="shrink-0 relative z-30">
            <h1 className="flex gap-1 md:gap-2 justify-center items-center text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 tracking-tighter cursor-pointer">
              LUIS<Star className="w-5 h-5 md:w-8 md:h-8" color="gold" fill="gold" />FSERIES
            </h1>
          </NavLink>

          {/* MENÚ ESCRITORIO */}
          <ul className="hidden md:flex gap-4 lg:gap-7 font-medium lg:text-base items-center">
            {VISIBLE_LINKS.map((link) => (
              <NavLink key={link.name} to={link.path} className={({ isActive }) => `whitespace-nowrap transition drop-shadow-xl [text-shadow:_0_1px_1px_rgb(0_0_0_/_0.4)] ${isActive ? "text-[#FF4848] font-bold" : "text-gray-300 hover:text-[#FF4848]"}`}>
                {link.name}
              </NavLink>
            ))}

            {HIDDEN_LINKS.length > 0 && (
              <li className="relative" ref={moreMenuRef}>
                <button onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)} className={`flex items-center gap-1 transition whitespace-nowrap ${isMoreMenuOpen ? 'text-white' : 'text-gray-300 hover:text-[#FF4848]'}`}>
                  Más <ChevronDown className={`w-4 h-4 transition-transform ${isMoreMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMoreMenuOpen && (
                  <div className="absolute top-full left-0 mt-4 w-48 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl overflow-hidden animate-fadeIn flex flex-col z-50">
                    {HIDDEN_LINKS.map((link) => (
                      <NavLink key={link.name} to={link.path} onClick={closeMenu} className={({ isActive }) => `block px-4 py-3 hover:bg-slate-800 transition ${isActive ? "text-[#FF4848] font-bold" : "text-gray-300"}`}>
                        {link.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>

        {/* --- DERECHA: BÚSQUEDA + AUTH --- */}
        <div className="flex items-center justify-end gap-3 md:gap-4 relative shrink-0">
          
          {/* BÚSQUEDA ESCRITORIO */}
          <div className="hidden md:flex items-center justify-end relative z-30">
            <form 
              ref={searchFormRef} 
              onSubmit={handleSearch}
              className={`flex items-center justify-between bg-slate-800 border transition-all duration-500 ease-out origin-right absolute right-0 top-1/2 -translate-y-1/2 ${isDesktopSearchOpen ? 'w-[280px] px-4 border-slate-600 shadow-2xl' : 'w-10 border-transparent bg-transparent'} h-10 rounded-full`}
            >
              <input 
                ref={inputRef}
                type="text" 
                placeholder="Buscar..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`bg-transparent text-white text-sm outline-none transition-all duration-300 ${isDesktopSearchOpen ? 'w-full opacity-100 pl-1' : 'w-0 opacity-0'}`}
              />
              <button type="submit" onClick={handleSearchIconClick} className={`shrink-0 text-gray-200 hover:text-white transition drop-shadow-xl [text-shadow:_0_1px_1px_rgb(0_0_0_/_0.4)] ${!isDesktopSearchOpen && 'hover:text-red-500'}`}>
                 <Search className="w-5 h-5" />
              </button>
            </form>
            <div className="w-10 h-10"></div>
          </div>

          {/* AUTH DESKTOP */}
          <div className="hidden md:flex gap-3 relative z-40 bg-transparent items-center">
              {!user ? (
                <>
                  <button onClick={() => { navigate('/signup'); closeMenu(); }} className="px-5 py-2 bg-black/30 border border-gray-500 text-white rounded-full text-sm font-semibold hover:border-white transition whitespace-nowrap">Registrarse</button>
                  <button onClick={() => { navigate('/login'); closeMenu(); }} className="px-5 py-2 bg-green-600 text-white rounded-full text-sm font-semibold hover:bg-green-500 shadow-lg shadow-green-900/50 transition whitespace-nowrap">Iniciar sesión</button>
                </>
              ) : (
                <div className="relative" ref={userMenuRef}>
                    <button 
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-1.5 px-3 pr-4 rounded-full border border-slate-600 transition group"
                    >
                        <Avatar user={user} size="sm" />
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isUserMenuOpen && (
                        <div className="absolute top-full right-0 mt-3 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-fadeIn flex flex-col">
                            <div className="px-4 py-3 border-b border-slate-800">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm text-white font-bold truncate max-w-[150px]">{user.displayName || 'Usuario'}</p>
                                    {role === 'admin' && <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold uppercase">ADMIN</span>}
                                </div>
                                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                            </div>
                            
                            {/* --- BOTÓN MI PERFIL (NUEVO) --- */}
                            <button onClick={handleProfileClick} className="text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition w-full">
                                <UserIcon className="w-4 h-4" /> Mi Perfil
                            </button>

                            {role === 'admin' && (
                                <button onClick={handleAdminClick} className="text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition w-full">
                                    <Settings className="w-4 h-4" /> Panel Admin
                                </button>
                            )}
                            
                            <button onClick={handleLogout} className="text-left px-4 py-3 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 flex items-center gap-2 transition border-t border-slate-800 w-full">
                                <LogOut className="w-4 h-4" /> Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>
              )}
          </div>

          {/* ELEMENTOS MÓVILES */}
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
        <div className="md:hidden absolute top-full left-0 w-full animate-fadeIn z-40">
           <form onSubmit={handleSearch} className="relative w-full shadow-2xl">
             <input autoFocus type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-black/50 border border-gray-600 text-white px-4 py-3 pl-10 outline-none focus:border-red-500 backdrop-blur-md" />
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
           </form>
        </div>
      )}

      <div 
        className={`fixed inset-0 bg-slate-950/95 backdrop-blur-lg z-40 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"} md:hidden overflow-y-auto`}
      >
        <div className="min-h-full flex flex-col items-center justify-center py-20">
            <ul className="flex flex-col items-center gap-6 text-xl font-bold">
            {NAV_LINKS.map((link) => (
                <NavLink key={link.name} to={link.path} onClick={closeMenu} className={({ isActive }) => isActive ? "text-red-500" : "text-white hover:text-red-500 transition"}>{link.name}</NavLink>
            ))}
            
            {user && role === 'admin' && (
                <button onClick={handleAdminClick} className="text-yellow-500 hover:text-yellow-400 font-bold transition">
                   Panel Admin
                </button>
            )}
            </ul>

            <div className="flex flex-col gap-4 mt-8 w-64 shrink-0">
            {!user ? (
                <>
                    <button onClick={() => { navigate('/login'); closeMenu(); }} className="px-5 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-500 shadow-lg">Iniciar sesión</button>
                    <button onClick={() => { navigate('/signup'); closeMenu(); }} className="px-5 py-3 border border-gray-500 text-white rounded-full font-semibold hover:border-white">Registrarse</button>
                </>
            ) : (
                <>
                    {/* INFO USUARIO MÓVIL (Click para ir a perfil) */}
                    <div 
                        onClick={handleProfileClick} // <--- AHORA ES CLICKEABLE
                        className="flex items-center gap-3 justify-center mb-2 bg-slate-900/50 p-2 rounded-lg border border-slate-800 cursor-pointer hover:bg-slate-800 transition"
                    >
                        <Avatar user={user} size="sm" />
                        <div className="text-left overflow-hidden">
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-white font-bold truncate max-w-[120px]">{user.displayName || 'Usuario'}</p>
                                {role === 'admin' && <span className="text-[10px] bg-red-600 text-white px-1 rounded font-bold">ADMIN</span>}
                            </div>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                    </div>

                    <button onClick={handleLogout} className="px-5 py-3 bg-red-600/20 text-red-500 border border-red-600/50 rounded-full font-semibold hover:bg-red-600 hover:text-white transition flex items-center justify-center gap-2">
                        <LogOut className="w-5 h-5" /> Cerrar sesión
                    </button>
                </>
            )}
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;