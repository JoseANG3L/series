import { Play, Star } from "lucide-react"; // Agregamos Star
import Badge from "./Badge";
import { useNavigate } from "react-router-dom";

// Una imagen placeholder elegante por si falla la original
const DEFAULT_IMAGE = "https://via.placeholder.com/500x750/1e293b/ef4444?text=No+Image";

const MovieCard = ({ movie, variant = "grid" }) => {
  const navigate = useNavigate();

  // Función que se ejecuta si la imagen falla al cargar
  const handleImageError = (e) => {
    e.target.onerror = null; // Previene bucles infinitos
    e.target.src = DEFAULT_IMAGE;
  };

  // Formatear el rating (ej: 8 -> 8.0)
  const formattedRating = movie.rating ? Number(movie.rating).toFixed(1) : null;

  return (
    <div 
      className={`relative cursor-pointer group ${variant === "carousel" ? "min-w-[150px] w-[150px] md:min-w-[180px] md:w-[180px] lg:min-w-[220px] lg:w-[220px]" : "w-full"}`} 
      onClick={() => navigate(`/movie/${movie.id}`)}
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
            <button className="bg-red-600 text-white p-3 rounded-full w-fit mb-2 shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:bg-red-500 hover:scale-105 transition flex items-center gap-2">
               <Play className="w-5 h-5 fill-current pl-0.5" />
            </button>
            
            <p className="text-white text-xs font-bold tracking-wider uppercase">
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
        
        {/* --- RATING (Esquina Superior Derecha) - NUEVO --- */}
        {formattedRating && formattedRating > 0 && (
            <div className="absolute top-2 right-2 z-20 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded flex items-center gap-1 border border-white/10 shadow-sm">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-[10px] font-bold text-white">{formattedRating}</span>
            </div>
        )}
        
      </div>

      {/* Título (Fuera de la imagen para limpieza visual) */}
      <div className="mt-3 px-1">
        <h4 className="text-sm font-medium text-slate-200 truncate group-hover:text-red-500 transition-colors">
            {movie.title}
        </h4>
        {/* Subtítulo opcional (Año o Género si lo tuvieras en el objeto movie) */}
        {movie.anio && (
            <p className="text-xs text-slate-500 mt-0.5">{movie.anio}</p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;