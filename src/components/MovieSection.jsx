import MovieCard from "./MovieCard";
import { useRef, useState, useMemo, useEffect } from "react";
import { Filter, ChevronDown, Calendar, TrendingUp, SortAsc, Star, X, AArrowDown, AArrowUp } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import AdsterraBanner from './AdsterraBanner';

const MovieSection = ({ title, movies, layout = "carousel", enableFilters = false, onAddClick }) => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  // --- ESTADOS DE FILTROS ---
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState("default"); // 'default', 'name', 'date'
  const [showPopular, setShowPopular] = useState(false); // Toggle para populares
  const [openMenu, setOpenMenu] = useState(null); // 'category', 'sort', or null

  // 1. Extraemos categorías únicas (CORREGIDO PARA ARRAYS)
  const categories = useMemo(() => {
    if (!enableFilters || !movies) return [];
    
    // a) Obtenemos todos los géneros (que pueden ser arrays)
    const allGenres = movies.map(movie => movie.genero);
    
    // b) Usamos .flat() para aplanar arrays ( ej: [['Accion'], ['Drama']] -> ['Accion', 'Drama'] )
    const flattenedGenres = allGenres.flat().filter(Boolean);
    
    // c) Eliminamos duplicados y ordenamos
    const uniqueGenres = [...new Set(flattenedGenres)].sort((a, b) => a.localeCompare(b));
    
    return ["Todos", ...uniqueGenres];
  }, [movies, enableFilters]);

  // 2. Lógica Maestra: Filtrar y Ordenar
  const processedMovies = useMemo(() => {
    if (!movies) return [];
    let result = [...movies];

    // Filtro Activo:
    result = result.filter(movie => movie.activo === true);

    // A. Filtro por Categoría (CORREGIDO PARA ARRAYS)
    if (activeCategory !== "Todos") {
      result = result.filter((movie) => {
        // Si es un array, usamos .includes, si es string, usamos ===
        if (Array.isArray(movie.genero)) {
            return movie.genero.includes(activeCategory);
        }
        return movie.genero === activeCategory;
      });
    }

    // B. Filtro de Populares
    if (showPopular) {
      // Filtramos los que tengan rating alto (mayor a 7) o sean 'new'
      result = result.filter(movie => (movie.rating && movie.rating >= 7) || movie.type === 'new');
    }

    // C. Ordenamiento
    switch (sortBy) {
      case "name_asc":
        result.sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
      case "name_desc":
        result.sort((a, b) => b.titulo.localeCompare(a.titulo));
        break;
      case "date_asc":
        result.sort((a, b) => (a.creado || 0) - (b.creado || 0));
        break;
      case "date_desc":
        result.sort((a, b) => (b.creado || 0) - (a.creado || 0));
        break;
      default:
        break;
    }

    return result;
  }, [movies, activeCategory, sortBy, showPopular]);

  // --- LÓGICA DE ARRASTRE (DRAG) ---
  const carouselRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    setIsDown(true);
    setIsDragging(false);
    startX.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeft.current = carouselRef.current.scrollLeft;
  };
  const handleMouseLeave = () => { setIsDown(false); setIsDragging(false); };
  const handleMouseUp = () => { setIsDown(false); setTimeout(() => { setIsDragging(false); }, 50); };
  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current);
    carouselRef.current.scrollLeft = scrollLeft.current - walk;
    if (Math.abs(walk) > 5) setIsDragging(true);
  };
  const handleCaptureClick = (e) => {
    if (isDragging) { e.preventDefault(); e.stopPropagation(); }
  };

  // --- CERRAR MENÚS AL HACER CLIC FUERA ---
  useEffect(() => {
    const handleClickOutside = () => setOpenMenu(null);
    if (openMenu) window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [openMenu]);

  // Texto del botón de orden
  const getSortLabel = () => {
    switch(sortBy) {
        case 'name_asc': return 'Nombre (A-Z)';
        case 'name_desc': return 'Nombre (Z-A)';
        case 'date_desc': return 'Más recientes';
        case 'date_asc': return 'Más antiguos';
        default: return 'Ordenar';
    }
  };

  return (
    <section className="px-4 md:px-8 lg:px-16 relative z-10">

      <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 gap-6">
        {/* Título */}
        <h3 className="text-2xl font-bold text-white border-l-4 border-red-500 pl-4 shrink-0">
          {title}
        </h3>

        {/* --- BARRA DE HERRAMIENTAS --- */}
        {enableFilters && (
          <div className="flex flex-wrap items-center gap-3 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            
            {/* 1. CATEGORÍAS */}
            {/* <div className="relative">
              <button
                onClick={() => setOpenMenu(openMenu === 'category' ? null : 'category')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${activeCategory !== 'Todos' ? 'bg-red-600 border-red-600 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'}`}
              >
                <Filter className="w-4 h-4" />
                {activeCategory === "Todos" ? "Categorías" : activeCategory}
                <ChevronDown className={`w-4 h-4 transition-transform ${openMenu === 'category' ? 'rotate-180' : ''}`} />
              </button>

              {openMenu === 'category' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn max-h-60 overflow-y-auto custom-scrollbar">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setActiveCategory(cat); setOpenMenu(null); }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-800 transition border-b border-slate-800 last:border-0 ${activeCategory === cat ? 'text-red-500 font-bold' : 'text-slate-300'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div> */}

            {/* 2. ORDENAR */}
            <div className="relative">
              <button
                onClick={() => setOpenMenu(openMenu === 'sort' ? null : 'sort')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${sortBy !== 'default' ? 'bg-white text-slate-900 border-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'}`}
              >
                {sortBy.includes('date') ? <Calendar className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
                {getSortLabel()}
                <ChevronDown className={`w-4 h-4 transition-transform ${openMenu === 'sort' ? 'rotate-180' : ''}`} />
              </button>

              {openMenu === 'sort' && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
                    <button onClick={() => { setSortBy('default'); setOpenMenu(null); }} className="w-full text-left px-4 py-3 text-sm text-slate-400 hover:bg-slate-800 flex items-center gap-2 border-b border-slate-800">
                      <X className="w-3 h-3" /> Por defecto
                    </button>
                    
                    <div className="p-2 text-xs text-slate-500 font-bold uppercase tracking-wider">Nombre</div>
                    <button onClick={() => { setSortBy('name_asc'); setOpenMenu(null); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-800 flex items-center gap-2 ${sortBy === 'name_asc' ? 'text-red-400' : 'text-slate-300'}`}>
                      <AArrowDown className="w-4 h-4" /> A - Z
                    </button>
                    <button onClick={() => { setSortBy('name_desc'); setOpenMenu(null); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-800 flex items-center gap-2 border-b border-slate-800 ${sortBy === 'name_desc' ? 'text-red-400' : 'text-slate-300'}`}>
                      <AArrowUp className="w-4 h-4" /> Z - A
                    </button>

                    <div className="p-2 text-xs text-slate-500 font-bold uppercase tracking-wider">Fecha</div>
                    <button onClick={() => { setSortBy('date_desc'); setOpenMenu(null); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-800 flex items-center gap-2 ${sortBy === 'date_desc' ? 'text-red-400' : 'text-slate-300'}`}>
                      <Calendar className="w-4 h-4" /> Más Recientes
                    </button>
                    <button onClick={() => { setSortBy('date_asc'); setOpenMenu(null); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-800 flex items-center gap-2 ${sortBy === 'date_asc' ? 'text-red-400' : 'text-slate-300'}`}>
                      <Calendar className="w-4 h-4 opacity-50" /> Más Antiguas
                    </button>
                </div>
              )}
            </div>

            {/* 3. POPULARES */}
            {/* <button
              onClick={() => setShowPopular(!showPopular)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${showPopular ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500 shadow-lg shadow-yellow-900/20' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'}`}
            >
              {showPopular ? <Star className="w-4 h-4 fill-current" /> : <TrendingUp className="w-4 h-4" />}
              Populares
            </button> */}

            {/* 4. LIMPIAR */}
            {/* {(activeCategory !== 'Todos' || sortBy !== 'default' || showPopular) && (
                <button 
                    onClick={() => { setActiveCategory('Todos'); setSortBy('default'); setShowPopular(false); }}
                    className="text-xs text-slate-500 hover:text-white underline ml-2"
                >
                    Limpiar todo
                </button>
            )} */}
          <AdsterraBanner />
          </div>
        )}
      </div>

      {/* --- CONTENIDO --- */}


      {/* Carrusel */}
      {layout === "carousel" && (
        <div ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onDragStart={(e) => e.preventDefault()}
          className={`
            flex gap-6 overflow-x-auto pb-8 scrollbar-hide select-none
            ${isDown ? 'cursor-grabbing snap-none' : 'cursor-grab snap-x snap-mandatory'}
          `}
        >

          {/* {role === 'admin' && enableFilters && (
            <div className="shrink-0 snap-center">
              <MovieCard
                isAddCard={true}
                onAddClick={onAddClick}
                variant="carousel"
              />
            </div>
          )} */}
          
          {processedMovies.length > 0 ? (
            processedMovies.map((movie) => (
              <div key={movie.id} onClickCapture={handleCaptureClick} className="shrink-0 snap-center">
                <MovieCard 
                    movie={{ 
                        id: movie.id, 
                        title: movie.titulo, // Usamos 'titulo' (viene de Supabase)
                        image: movie.poster, // Usamos 'poster'
                        tipo: movie.tipo,
                        actualizado: movie.actualizado,
                    }} 
                    variant="carousel" 
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm italic pl-4">No se encontraron resultados con estos filtros.</p>
          )}
        </div>
      )}

      {/* Grid */}
      {layout === "grid" && (
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
          
          {/* {role === 'admin' && enableFilters && (
            <MovieCard
              isAddCard={true}
              onAddClick={onAddClick}
              variant="grid"
            />
          )} */}
          
          {processedMovies.length > 0 ? (
            processedMovies.map((movie) => (
              <MovieCard
                key={movie.id} 
                movie={{ 
                    id: movie.id, 
                    title: movie.titulo, // Usamos 'titulo' (viene de Supabase)
                    image: movie.poster, // Usamos 'poster'
                    tipo: movie.tipo,
                    actualizado: movie.actualizado,
                }} 
                variant="grid" 
              />
            ))
          ) : (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500">
              <Filter className="w-12 h-12 mb-2 opacity-50" />
              <p>No se encontraron resultados.</p>
              <button onClick={() => { setActiveCategory('Todos'); setShowPopular(false); }} className="mt-4 text-red-500 hover:underline">Limpiar filtros</button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default MovieSection;