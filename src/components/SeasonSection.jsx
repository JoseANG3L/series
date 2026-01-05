import SeasonCard from "./SeasonCard";
import { useRef, useState, useMemo } from "react";
import { useAuth } from '../context/AuthContext';

// Ahora recibimos 'temporadas' y 'seriesPoster' (por si la temporada no tiene foto propia)
const SeasonSection = ({ poster, temporadas = [], peliculas = [], isSeries = true, isEditing = false, showInputs = false, onAddSeason, onUpdateSeason, onDeleteSeason }) => {
  const { user, role, signOut } = useAuth();

  let content;
  
  // --- LÓGICA DE ORDENAMIENTO (Simple: 1, 2, 3...) ---
  const sortedSeasons = useMemo(() => {
    if (isSeries) {
      content = temporadas;
    } else {
      content = peliculas;
    }
    
    if (!content) return [];
    
    // En edición devolvemos todo sin ordenar para evitar saltos raros
    if (isEditing) return content;

    return [...content].sort((a, b) => {
        const numA = parseInt(a.numero);
        const numB = parseInt(b.numero);

        // CASO 1: Ambos son números (Temp 1 vs Temp 2) -> Orden numérico
        if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
        }

        // CASO 2: A es número, B es texto (Temp 1 vs OVA) -> Número primero
        if (!isNaN(numA) && isNaN(numB)) {
            return -1;
        }

        // CASO 3: A es texto, B es número (OVA vs Temp 1) -> Número primero
        if (isNaN(numA) && !isNaN(numB)) {
            return 1;
        }

        // CASO 4: Ambos son texto (OVA vs Especial) -> Orden alfabético
        return a.numero.localeCompare(b.numero);
    });
    
  }, [content, isSeries, isEditing]);

  if (sortedSeasons.length === 0 && !showInputs) return null;

  return (
    <section className="relative z-10">
      
      {/* Título de la sección (Ej: "Temporadas") */}
      <h3 className="text-2xl font-bold text-white border-l-4 border-red-500 pl-4 mb-6">
        {isSeries ? "Temporadas" : "Peliculas"}
      </h3>

      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {showInputs && (
            <SeasonCard isAddCard={true} onAddSeason={onAddSeason} />
          )}

          {sortedSeasons.map((season, index) => (
            <SeasonCard 
              key={season.id || index}
              season={{
                id: season.id || `s-${season.numero}`,
                numero: season.numero,
                poster: season.poster || poster,
                episodios: season.episodios || "N/A",
                descarga: season.descarga || null,
              }}
              isEditing={isEditing}
              showInputs={showInputs}
              onUpdate={(updatedData) => onUpdateSeason(index, updatedData)}
              onDelete={() => onDeleteSeason(index)}
            />
          ))}
      </div>
    </section>
  );
};

export default SeasonSection;