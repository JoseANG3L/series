import { Play, Star, Plus } from "lucide-react"; // Agregamos Star
import Badge from "./Badge";
import { useNavigate } from "react-router-dom";

// Una imagen placeholder elegante por si falla la original
const DEFAULT_IMAGE = "https://via.placeholder.com/500x750/1e293b/ef4444?text=No+Image";

const MovieCard = ({ movie, variant = "grid", isAddCard = false, onAddClick }) => {
  const navigate = useNavigate();

  const sizeClasses = variant === "carousel" 
    ? "min-w-[150px] w-[150px] md:min-w-[180px] md:w-[180px] lg:min-w-[220px] lg:w-[220px]" 
    : "w-full";

  if (isAddCard) {
    return (
      <div 
        onClick={onAddClick}
        className={`relative cursor-pointer group ${sizeClasses}`}
      >
        {/* Contenedor Aspect Ratio 2:3 con borde dashed */}
        <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-slate-900/50 border-2 border-dashed border-slate-700 hover:border-red-500 hover:bg-slate-800 transition-all duration-300 flex flex-col items-center justify-center">
          
          <div className="w-16 h-16 rounded-full bg-slate-800 group-hover:bg-red-600/20 flex items-center justify-center transition-colors duration-300">
             <Plus className="w-8 h-8 text-slate-500 group-hover:text-red-500 transition-colors" />
          </div>
          
          <span className="mt-3 text-sm font-bold text-slate-500 group-hover:text-white transition-colors uppercase tracking-wider">
            Agregar
          </span>

        </div>
        
        {/* Espacio para alinear con los títulos de las otras cards */}
        <div className="mt-3 px-1 h-5"></div>
      </div>
    );
  }

  // Función que se ejecuta si la imagen falla al cargar
  const handleImageError = (e) => {
    e.target.onerror = null; // Previene bucles infinitos
    e.target.src = DEFAULT_IMAGE;
  };

  const isSeries = movie.tipo === 'series' || (movie.temporadas && movie.temporadas.length > 0);

  return (
    <div 
      className={`relative cursor-pointer group ${sizeClasses}`}
      onClick={() => isSeries ? navigate(`/series/${movie.id}`) : navigate(`/peliculas/${movie.id}`)}
    >
      {/* Contenedor Principal con Aspect Ratio 2:3 (Estándar Posters) */}
      <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-slate-800 shadow-lg border border-white/5">
        
        {/* Imagen */}
        <img 
          src={movie.image || DEFAULT_IMAGE} 
          alt={movie.title} 
          onError={handleImageError}        
          loading="lazy" // Optimización de rendimiento
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />

        {/* Overlay Oscuro al Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          
          {/* Botón Play con efecto glow */}
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <button className="bg-red-600 text-white p-3 rounded-full w-fit mb-3 shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:bg-red-500 hover:scale-105 transition flex items-center gap-2">
               <Play className="w-4 h-4 fill-current pl-0.5" />
            </button>
            
            <p className="text-white text-sm font-bold tracking-wide">
               Ver detalles
            </p>
          </div>
        </div>

        {/* --- BADGES (Esquina Superior Izquierda) --- */}
        {movie.type && (
          <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
            <Badge type={movie.type} />
          </div>
        )}
        
      </div>

      {/* Título (Fuera de la imagen para limpieza visual) */}
      <div className="mt-3 px-1">
        <h4 className="text-sm font-medium text-slate-200 truncate group-hover:text-red-500 transition-colors">
            {movie.title}
        </h4>
      </div>
    </div>
  );
};

export default MovieCard;