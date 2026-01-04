import SeasonCard from "./SeasonCard";
import { useRef, useState, useMemo } from "react";
import { useAuth } from '../context/AuthContext';

// Ahora recibimos 'temporadas' y 'seriesPoster' (por si la temporada no tiene foto propia)
const SeasonSection = ({ poster, temporadas = [], isSeries = true, isEditing = false, onAddClick }) => {
  const { user, role, signOut } = useAuth();

  // --- LÓGICA DE ORDENAMIENTO (Simple: 1, 2, 3...) ---
  const sortedSeasons = useMemo(() => {
    if (!temporadas) return [];
    // Ordenamos siempre por número de temporada ascendente
    return [...temporadas].sort((a, b) => a.numero - b.numero);
  }, [temporadas]);

  // --- LÓGICA DE ARRASTRE (DRAG) PARA EL CARRUSEL ---
  // (Esta parte la dejé igual porque funciona muy bien para UX móvil/desktop)
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

  if (sortedSeasons.length === 0) return null;

  return (
    <section className="relative z-10">
      
      {/* Título de la sección (Ej: "Temporadas") */}
      <h3 className="text-2xl font-bold text-white border-l-4 border-red-500 pl-4 mb-6">
        {isSeries ? "Temporadas" : "Peliculas"}
      </h3>

      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {isEditing && (
            <SeasonCard
              isAddCard={true}
              onAddClick={onAddClick}
            />
          )}

          {sortedSeasons.map((season) => (
            <SeasonCard 
              key={season.numero}
              season={{
                  id: season.id || `s-${season.numero}`,
                  numero: season.numero,
                  poster: season.poster || poster,
                  episodios: season.episodios || "N/A",
                  descarga: season.descarga || null,
              }}
            />
          ))}
      </div>
    </section>
  );
};

export default SeasonSection;