import SeasonCard from "./SeasonCard";
import { useRef, useState, useMemo } from "react";
import { useAuth } from '../context/AuthContext';

const SeasonSection = ({ 
  poster, 
  temporadas = [], 
  peliculas = [], 
  isSeries = true, 
  isEditing = false, 
  showInputs = false, 
  onAddSeason,    // Si es peli, aquí viene la fn handleAddMovie
  onUpdateSeason, // Si es peli, aquí viene la fn handleUpdateMovie
  onDeleteSeason  // Si es peli, aquí viene la fn handleDeleteMovie
}) => {
  const { user } = useAuth();

  // --- 1. SELECCIÓN DE CONTENIDO ---
  const rawContent = isSeries ? temporadas : peliculas;

  // --- 2. LÓGICA DE ORDENAMIENTO ---
  const sortedContent = useMemo(() => {
    if (!rawContent) return [];

    // Si estamos editando, o son PELÍCULAS, devolvemos el array tal cual (respetamos el orden de creación/lista)
    // Ordenar películas alfabéticamente suele romper el orden cronológico de las sagas.
    if (isEditing || !isSeries) return rawContent;

    // Solo ordenamos si son SERIES (Temporada 1, 2, 3...)
    return [...rawContent].sort((a, b) => {
        const numA = parseInt(a.numero);
        const numB = parseInt(b.numero);

        // Lógica para ordenar "1", "2", "OVA", "Especial"
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        if (!isNaN(numA) && isNaN(numB)) return -1;
        if (isNaN(numA) && !isNaN(numB)) return 1;
        return a.numero?.localeCompare(b.numero || "") || 0;
    });
    
  }, [rawContent, isSeries, isEditing]);

  // Si no hay contenido y no estamos editando, no mostramos nada
  if (sortedContent.length === 0 && !showInputs) return null;

  return (
    <section className="relative z-10">
      
      {/* Título de la sección */}
      <h3 className="text-2xl font-bold text-white border-l-4 border-red-500 pl-4 mb-6">
        {isSeries ? "Temporadas" : "Películas"}
      </h3>

      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          
          {/* TARJETA DE "AGREGAR NUEVO" */}
          {showInputs && (
            <SeasonCard 
                isAddCard={true} 
                onAddSeason={onAddSeason} // Ejecutará handleAddSeason o handleAddMovie según lo que pasaste
                isSeries={isSeries}       // Para saber si mostrar icono de "Temp" o "Peli"
            />
          )}

          {/* LISTA DE ITEMS */}
          {sortedContent.map((item, index) => (
            <SeasonCard 
              key={item.id || index}
              // Pasamos el prop isSeries para que la Card sepa cómo renderizar (si hace falta)
              isSeries={isSeries} 
              isEditing={isEditing}
              showInputs={showInputs}
              
              // --- MAPEO HÍBRIDO DE DATOS ---
              // Adaptamos los datos de Película para que entren en la estructura de la Card
              season={{
                id: item.id || index,
                poster: item.poster || poster, // Poster individual o el de la serie/saga
                descarga: item.descarga || "",

                // TRUCO: Si es serie usa 'numero', si es peli usa 'titulo'
                numero: isSeries ? item.numero : item.titulo, 

                // TRUCO: Si es serie usa 'episodios', si es peli usa 'calidad' o 'año'
                episodios: isSeries ? item.episodios : (item.calidad || item.anio || "Película"),
                
                // Pasamos todo el objeto por si SeasonCard necesita datos extra (como 'duracion')
                ...item 
              }}
              
              onUpdate={(updatedData) => onUpdateSeason(index, updatedData)}
              onDelete={() => onDeleteSeason(index)}
            />
          ))}
      </div>
    </section>
  );
};

export default SeasonSection;