import React, { useEffect, useState } from 'react'; // Importamos useState
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Plus, ThumbsUp, ChevronLeft, Calendar, Clock, Star, Users, Film, Info, MessageSquare, Image as ImageIcon } from 'lucide-react';

const MovieDetail = ({ movies }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resumen'); // Estado para las pestañas

  const movie = movies.find(m => m.id === parseInt(id));

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (!movie) return <div className="text-white text-center mt-20">Película no encontrada</div>;

  return (
    <div className="min-h-screen h-full bg-[#0f172a] text-white font-sans">
      
      {/* --- HERO SECTION --- */}
      <div className="relative ">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${movie.backdrop || movie.poster}')` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-black/60"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/60 to-transparent"></div>
        </div>
        
        <div className="relative z-30 flex flex-col justify-between min-h-screen pt-16 md:pt-20 px-4 md:px-8 lg:px-16 pb-8 gap-5">

          <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white hover:text-black transition w-fit">
            <ChevronLeft className="w-5 h-5" /> Volver
          </button>

          <div className="max-w-3xl animate-fade-in-up">
            
            {/* 1. NUEVO: Etiqueta de "Original" o Estudio */}
            <p className="text-red-500 font-bold tracking-widest text-sm mb-2 uppercase flex items-center gap-2">
              <span className="w-1 h-4 bg-red-600 inline-block"></span> 
              PELÍCULA EXCLUSIVA
            </p>

            <h1 className="text-3xl md:text-5xl font-extrabold mb-3 drop-shadow-2xl leading-tight">{movie.titulo}</h1>
            
            {/* 2. NUEVO: Frase Gancho (Tagline) */}
            {movie.tagline && (
              <p className="text-gray-300 italic text-lg mb-6 font-light border-l-2 border-gray-500 pl-3">
                "{movie.tagline}"
              </p>
            )}

            {/* DATOS TÉCNICOS MEJORADOS */}
            <div className="flex flex-wrap items-center gap-4 text-gray-200 text-sm md:text-base mb-6 md:mb-8 font-medium">
              <span className="flex items-center gap-1 text-green-400 font-bold"><Star className="w-4 h-4 fill-current"/> {movie.rating || "N/A"}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {movie.anio}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {movie.duracion || "N/A"}</span>
              
              {/* Separador */}
              <span className="h-4 w-[1px] bg-gray-600 mx-2"></span>

              {/* 3. NUEVO: Badges Técnicos y de Edad */}
              <div className="flex gap-2 text-[10px] font-bold text-gray-400">
                <span className="border border-gray-500 px-1.5 py-0.5 rounded uppercase">HD</span>
                <span className="border border-gray-500 px-1.5 py-0.5 rounded uppercase">4K</span>
                <span className="border border-gray-500 px-1.5 py-0.5 rounded uppercase">5.1</span>
                <span className="bg-gray-700 text-white border border-transparent px-1.5 py-0.5 rounded">16+</span>
              </div>
            </div>

            {/* 4. NUEVO: Géneros como píldoras */}
            <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
              {movie.genero && movie.genero.split(', ').map((g, i) => (
                <span key={i} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-white cursor-pointer transition">
                  {g}
                </span>
              ))}
            </div>

            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition">
                <Play className="w-5 h-5 fill-black" /> Reproducir
              </button>
              <button className="p-3 bg-gray-800/80 rounded-full hover:bg-gray-700 transition border border-gray-600"><Plus className="w-5 h-5" /></button>
              <button className="p-3 bg-gray-800/80 rounded-full hover:bg-gray-700 transition border border-gray-600"><ThumbsUp className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </div>
      
      <br />
      
      {/* --- CONTENT SECTION --- */}
      <div className="px-4 md:px-8 lg:px-16 mb-12 grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
        
        {/* COLUMNA IZQUIERDA (Principal) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. NAVEGACIÓN DE PESTAÑAS */}
          <div className="flex gap-8 border-b border-gray-700 pb-2 mb-6 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('resumen')}
              className={`pb-2 text-lg font-bold transition ${activeTab === 'resumen' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}
            >
              Resumen
            </button>
            <button 
              onClick={() => setActiveTab('reparto')}
              className={`pb-2 text-lg font-bold transition ${activeTab === 'reparto' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}
            >
              Reparto
            </button>
            <button 
              onClick={() => setActiveTab('trailer')}
              className={`pb-2 text-lg font-bold transition ${activeTab === 'trailer' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}
            >
              Trailer
            </button>

            <button 
              onClick={() => setActiveTab('galeria')}
              className={`pb-2 text-lg font-bold transition flex items-center gap-2 ${activeTab === 'galeria' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}
            >
              Galería
            </button>

            <button 
              onClick={() => setActiveTab('resenas')}
              className={`pb-2 text-lg font-bold transition flex items-center gap-2 ${activeTab === 'resenas' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}
            >
              Reseñas
            </button>
          </div>

          {/* 2. CONTENIDO DINÁMICO SEGÚN PESTAÑA */}
          
          {/* TAB: RESUMEN */}
          {activeTab === 'resumen' && (
            <div className="animate-fadeIn">
              {/* Sinopsis */}
              <p className="text-gray-300 leading-relaxed text-lg mb-8">
                {movie.sinopsis || "No hay descripción disponible."}
              </p>
              
              {/* Grid de Detalles Técnicos */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                
                {/* 1. Director */}
                <div>
                  <span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Director</span>
                  <span className="font-medium text-white">{movie.director || "N/A"}</span>
                </div>

                {/* 2. Guion (Nuevo) */}
                <div>
                  <span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Guion</span>
                  <span className="font-medium text-white">{movie.guion || movie.director || "N/A"}</span>
                </div>

                {/* 3. Género */}
                <div>
                  <span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Género</span>
                  <span className="font-medium text-white">{movie.genero}</span>
                </div>

                {/* 4. Fecha de Estreno (Nuevo) */}
                <div>
                  <span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Estreno</span>
                  <span className="font-medium text-white">{movie.estreno || String(movie.anio)}</span>
                </div>

                {/* 5. País (Nuevo) */}
                <div>
                  <span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">País</span>
                  <span className="font-medium text-white">{movie.pais || "Estados Unidos"}</span>
                </div>

                {/* 6. Clasificación (Nuevo) */}
                <div>
                  <span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Clasificación</span>
                  <span className="inline-block bg-gray-700 px-2 py-0.5 rounded text-xs font-bold text-white border border-gray-600">
                      {movie.clasificacion || "PG-13"}
                  </span>
                </div>

                {/* 7. Estudio (Ahora dinámico) */}
                <div>
                  <span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Estudio</span>
                  <span className="font-medium text-white">{movie.estudio || "Warner Bros."}</span>
                </div>

                {/* 8. Idioma (Ahora dinámico) */}
                <div className="col-span-2 md:col-span-1"> {/* Ocupa espacio extra si es necesario */}
                  <span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Audio Original</span>
                  <span className="font-medium text-white">{movie.idioma || "Inglés"}</span>
                </div>

              </div>
            </div>
          )}

          {/* TAB: REPARTO (Visual) */}
          {activeTab === 'reparto' && (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-fadeIn">
               {movie.elenco && movie.elenco.map((actor, idx) => (
                 <div key={idx} className="bg-slate-800 rounded-lg overflow-hidden group">
                   <div className="h-40 overflow-hidden">
                     <img 
                       src={actor.foto || `https://ui-avatars.com/api/?name=${actor.nombre}&background=random`} 
                       alt={actor.nombre} 
                       className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                     />
                   </div>
                   <div className="p-3">
                     <p className="font-bold text-white text-sm truncate">{actor.nombre}</p>
                     <p className="text-xs text-gray-400 truncate">{actor.personaje}</p>
                   </div>
                 </div>
               ))}
               {(!movie.elenco || movie.elenco.length === 0) && <p className="text-gray-500">No hay información del reparto.</p>}
             </div>
          )}

          {/* TAB: TRAILER */}
          {activeTab === 'trailer' && (
            <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl animate-fadeIn border border-slate-700">
              {movie.trailer ? (
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={movie.trailer} 
                  title="Trailer" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <Film className="w-12 h-12 mb-2 opacity-50"/>
                  <p>Trailer no disponible</p>
                </div>
              )}
            </div>
          )}

          {/* TAB: GALERÍA */}
          {activeTab === 'galeria' && (
            <div className="animate-fadeIn grid grid-cols-1 md:grid-cols-2 gap-4">
              {movie.galeria && movie.galeria.length > 0 ? (
                movie.galeria.map((img, index) => (
                  <div key={index} className="rounded-xl overflow-hidden cursor-pointer group relative h-48 md:h-64">
                    <img 
                      src={img} 
                      alt={`Escena ${index}`} 
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center text-gray-500 py-10 bg-slate-800/30 rounded-lg">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50"/>
                  No hay imágenes disponibles en la galería.
                </div>
              )}
            </div>
          )}

          {/* TAB: RESEÑAS */}
          {activeTab === 'resenas' && (
            <div className="animate-fadeIn space-y-6">
              {/* Botón para escribir reseña (Simulado) */}
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-white">Yo</div>
                <input type="text" placeholder="Escribe tu opinión..." className="flex-1 bg-transparent text-white outline-none placeholder-gray-500" />
                <button className="text-sm font-bold text-blue-400 hover:text-blue-300">PUBLICAR</button>
              </div>

              {/* Lista de reseñas */}
              {movie.resenas && movie.resenas.length > 0 ? (
                movie.resenas.map((review, idx) => (
                  <div key={idx} className="border-b border-gray-800 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {/* Avatar Dinámico */}
                        <img 
                          src={review.avatar || `https://ui-avatars.com/api/?name=${review.usuario}&background=random`} 
                          alt={review.usuario} 
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h4 className="font-bold text-white">{review.usuario}</h4>
                          <span className="text-xs text-gray-500">{review.fecha}</span>
                        </div>
                      </div>
                      {/* Estrellas */}
                      <div className="flex bg-yellow-500/10 px-2 py-1 rounded text-yellow-500 font-bold text-sm">
                        <Star className="w-4 h-4 fill-current mr-1" /> {review.rating}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed pl-14">
                      {review.comentario}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-10">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50"/>
                  Sé el primero en opinar sobre esta película.
                </div>
              )}
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA (Similares - Estático) */}
        <div className="lg:col-span-1 border-l border-slate-800 pl-4 lg:pl-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-red-500"/> Recomendados
          </h3>
          <div className="flex flex-col gap-4">
             {movies.filter(m => m.id !== movie.id).slice(0, 4).map(rec => (
               <div 
                 key={rec.id} 
                 onClick={() => {
                    navigate(`/movie/${rec.id}`);
                    setActiveTab('resumen'); // Resetear tab al cambiar peli
                 }}
                 className="flex gap-4 items-center p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition group"
               >
                 <img src={rec.poster} className="w-16 h-24 object-cover rounded shadow-md group-hover:scale-105 transition" alt="" />
                 <div>
                   <h4 className="font-bold text-sm text-gray-200 group-hover:text-red-400 transition line-clamp-2">{rec.titulo}</h4>
                   <p className="text-xs text-gray-500 mt-1">{rec.anio} • {rec.genero}</p>
                   <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current"/>
                      <span className="text-xs text-gray-400">{rec.rating || 8.5}</span>
                   </div>
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