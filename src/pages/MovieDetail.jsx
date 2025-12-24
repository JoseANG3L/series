import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Plus, ThumbsUp, ChevronLeft, Calendar, Clock, Star } from 'lucide-react';

const MovieDetail = ({ movies }) => {
  console.log(movies);
  const { id } = useParams(); // Captura el ID de la URL
  const navigate = useNavigate();
  console.log(id);
  // Buscar la película correspondiente al ID
  // Nota: Convertimos el id de la URL a número porque viene como string
  const movie = movies.find(m => m.id === parseInt(id));

  // Scroll al inicio al cargar la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!movie) return <div className="text-white text-center mt-20">Película no encontrada</div>;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-[60vh] md:h-[70vh] w-full">
        {/* Imagen de Fondo */}
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://latam.bubbleblabber.com/wp-content/uploads/2024/09/la-casa-de-los-dibujos.jpeg" }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/40 to-transparent"></div>
        </div>
        
        {/* Contenido Hero */}
        <div className="relative z-30 flex flex-col justify-between h-full pt-24 px-4 md:px-8 lg:px-16 pb-8">
          {/* Botón Volver */}
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white hover:text-black transition" style={{width: 'fit-content'}}>
            <ChevronLeft className="w-5 h-5" /> Volver
          </button>

          <div className="">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-2xl">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-300 text-sm md:text-base mb-8">
              <span className="flex items-center gap-1 text-green-400 font-bold"><Star className="w-4 h-4 fill-current"/> 9.8</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> 2024</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> 2h 15m</span>
              <span className="border border-gray-500 px-2 py-0.5 rounded text-xs">HD</span>
            </div>

            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition">
                <Play className="w-5 h-5 fill-black" /> Reproducir
              </button>
              <button className="p-3 bg-gray-800/80 rounded-full hover:bg-gray-700 transition border border-gray-600">
                <Plus className="w-5 h-5" />
              </button>
              <button className="p-3 bg-gray-800/80 rounded-full hover:bg-gray-700 transition border border-gray-600">
                <ThumbsUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="px-4 md:px-8 lg:px-16 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Columna Principal */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Sinopsis</h3>
            <p className="text-gray-400 leading-relaxed text-lg">
              {movie.description || "Esta es una descripción simulada. Aquí iría el resumen completo de la trama, explicando los conflictos principales y el viaje del protagonista en esta increíble producción cinematográfica."}
            </p>
          </div>
          
          {/* Ficha técnica simulada */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-gray-800">
            <div>
              <span className="block text-gray-500 text-sm mb-1">Director</span>
              <span className="font-medium">Christopher Nolan</span>
            </div>
            <div>
              <span className="block text-gray-500 text-sm mb-1">Género</span>
              <span className="font-medium">Ciencia Ficción</span>
            </div>
            <div>
              <span className="block text-gray-500 text-sm mb-1">Audio</span>
              <span className="font-medium">Español, Inglés</span>
            </div>
          </div>
        </div>

        {/* Columna Lateral (Similares) */}
        <div className="lg:col-span-1">
          <h3 className="text-xl font-bold mb-6">Más títulos similares</h3>
          <div className="flex flex-col gap-4">
             {/* Recomendaciones Falsas */}
             {[1,2,3].map(i => (
               <div key={i} className="flex gap-4 items-center p-3 rounded-lg hover:bg-gray-800/50 cursor-pointer transition">
                 <div className="w-24 h-16 bg-gray-700 rounded overflow-hidden relative">
                    <img src={`https://picsum.photos/200/100?random=${i}`} className="w-full h-full object-cover" alt="" />
                 </div>
                 <div>
                   <h4 className="font-bold text-sm">Película Recomendada {i}</h4>
                   <p className="text-xs text-gray-500">2023 • Acción</p>
                 </div>
               </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MovieDetail;