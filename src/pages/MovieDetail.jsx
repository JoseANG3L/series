import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Play, Plus, ThumbsUp, ChevronLeft, Calendar, Clock, Star, Users,
  Film, Info, MessageSquare, Image as ImageIcon, Loader2, WifiOff
} from 'lucide-react';
import { getContentById, getMovies } from '../services/api';
import SeasonSection from '../components/SeasonSection';
import CommentsSection from '../components/CommentsSection';
import { useAuth } from '../context/AuthContext';
import useSWR, { useSWRConfig } from "swr";
import { db } from "../firebase/client";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resumen');
  const { user } = useAuth(); // Obtenemos el usuario actual
  // Necesitamos mutate para decirle a SWR que recargue los datos
  const { mutate } = useSWRConfig();

  const handleAddReview = async (newReviewData) => {
    if (!user) return alert("Por favor, inicia sesión para comentar.");

    // 1. Preparamos el objeto EXACTO como lo espera tu UI
    const nuevaResena = {
      id: crypto.randomUUID(), // <--- ID ÚNICO OBLIGATORIO
      usuario: user.displayName || "Usuario",
      avatar: user.photoURL || null,
      avatarConfig: user.avatarConfig || null,
      comentario: newReviewData.text,
      fecha: new Date().toLocaleDateString('es-ES'),
      userId: user.uid,
      replies: [] // <--- Array vacío para futuras respuestas
    };

    try {
      const movieRef = doc(db, "content", id);
      await updateDoc(movieRef, {
        resenas: arrayUnion(nuevaResena)
      });
      mutate(id ? `movie-${id}` : null);
    } catch (error) {
      console.error(error);
    }
  };

  // 2. NUEVO: EDITAR COMENTARIO
  const handleEditReview = async (reviewId, newText) => {
    if (!movie.resenas) return;

    // A. Copiamos las reseñas actuales
    const updatedReviews = movie.resenas.map(review => {
      if (review.id === reviewId) {
        return { ...review, comentario: newText }; // Cambiamos el texto
      }
      return review;
    });

    // B. Guardamos el array completo nuevo en Firestore
    try {
      const movieRef = doc(db, "content", id);
      await updateDoc(movieRef, { resenas: updatedReviews });
      mutate(id ? `movie-${id}` : null); // Recarga visual
    } catch (error) {
      console.error("Error editando:", error);
      alert("Error al editar el comentario");
    }
  };

  // 3. NUEVO: RESPONDER COMENTARIO
  const handleReplyReview = async (reviewId, replyText) => {
    if (!user) return alert("Inicia sesión.");
    
    // Objeto de respuesta
    const newReply = {
      usuario: user.displayName || "Usuario",
      avatar: user.photoURL,
      avatarConfig: user.avatarConfig,
      comentario: replyText,
      fecha: new Date().toLocaleDateString('es-ES'),
      userId: user.uid
    };

    // Buscamos y agregamos la respuesta al comentario padre
    const updatedReviews = movie.resenas.map(review => {
      if (review.id === reviewId) {
        // Si no existe el array replies (comentarios viejos), lo creamos
        const currentReplies = review.replies || [];
        return { ...review, replies: [...currentReplies, newReply] };
      }
      return review;
    });

    try {
      const movieRef = doc(db, "content", id);
      await updateDoc(movieRef, { resenas: updatedReviews });
      mutate(id ? `movie-${id}` : null);
    } catch (error) {
      console.error("Error respondiendo:", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      // Filtramos el array para quitar el comentario con ese ID
      const updatedReviews = movie.resenas.filter(review => review.id !== reviewId);

      // Actualizamos Firestore
      const movieRef = doc(db, "content", id);
      await updateDoc(movieRef, { resenas: updatedReviews });
      
      // Recarga visual
      mutate(id ? `movie-${id}` : null);
      
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  // --- 1. CARGAR DETALLE (SWR) ---
  // La clave incluye el ID para que cada peli tenga su caché propia
  const { data: movie, error: errorMovie, isLoading: loadingMovie } = useSWR(
    id ? `movie-${id}` : null,
    () => getContentById(id),
    {
      revalidateOnFocus: false, // No recargar si cambio de pestaña (ahorra recursos)
      revalidateOnReconnect: false,
      dedupingInterval: 600000, // 10 minutos de caché (el Hero cambia poco)
    }
  );

  // --- 2. CARGAR RECOMENDACIONES (SWR) ---
  const { data: allMovies } = useSWR('all-movies', getMovies);

  // Filtramos las recomendaciones (si ya cargaron las pelis)
  const recommendations = allMovies
    ? allMovies.filter(m => m.id !== parseInt(id)).slice(0, 4)
    : [];

  // --- LOADING ---
  if (loadingMovie) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
      </div>
    );
  }

  // --- ERROR ---
  if (errorMovie || !movie) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-slate-400 gap-4">
        <WifiOff className="w-16 h-16 opacity-50" />
        <p className="text-xl">Contenido no encontrado o error de conexión</p>
        <button onClick={() => navigate(-1)} className="text-red-500 hover:underline">Volver atrás</button>
      </div>
    );
  }

  const isSeries = movie.type === 'serie' || (movie.temporadas && movie.temporadas.length > 0);

  return (
    <div className="min-h-screen h-full bg-[#0f172a] text-white font-sans">

      {/* --- HERO SECTION --- */}
      <div className="relative ">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${movie.backdrop || movie.poster}')` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] from-0% via-[#0f172a]/50 via-40% to-transparent to-80%"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/80 from-0% via-[#0f172a]/30 via-30% to-transparent to-60%"></div>
        </div>

        <div className="relative z-30 flex flex-col justify-between pt-16 md:pt-20 px-4 md:px-8 lg:px-16 pb-8 gap-10">

          <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white hover:text-black transition w-fit border border-white/10">
            <ChevronLeft className="w-5 h-5" /> Volver
          </button>

          <div className="flex flex-col space-y-4 md:space-y-6 max-w-3xl animate-fade-in-up">

            {/* Badge Tipo */}
            <span className="bg-slate-800/80 w-fit px-3 py-1 rounded-full text-xs font-bold text-gray-300 uppercase tracking-widest backdrop-blur-sm border border-white/20 animate-fade-in-up">
              {isSeries ? "Serie" : "Película"}
            </span>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight drop-shadow-xl [text-shadow:_0_1px_1px_rgb(0_0_0_/_0.5)]">{movie.titulo}</h1>

            {movie.tagline ? (
              <p className="text-gray-100 italic text-lg mb-6 font-light border-l-2 border-red-500 pl-3 line-clamp-2 md:line-clamp-none drop-shadow-md [text-shadow:_0_1px_1px_rgb(0_0_0_/_0.5)]">
                "{movie.tagline}"
              </p>
            ) : (
              movie.sinopsis && (
                <p className="text-gray-100 italic text-lg mb-6 font-light border-l-2 border-red-500 pl-3 line-clamp-2 md:line-clamp-none drop-shadow-md [text-shadow:_0_1px_1px_rgb(0_0_0_/_0.5)]">
                  "{movie.sinopsis.split('.')[0]}..."
                </p>
              )
            )}

            <div className="flex gap-4 mt-6">
              <button className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition">
                <Play className="w-5 h-5 fill-black" /> Reproducir
              </button>
              {/* <button className="p-3 bg-gray-800/80 rounded-full hover:bg-gray-700 transition border border-gray-600"><Plus className="w-5 h-5" /></button>
              <button className="p-3 bg-gray-800/80 rounded-full hover:bg-gray-700 transition border border-gray-600"><ThumbsUp className="w-5 h-5" /></button> */}
            </div>
          </div>
        </div>
      </div>

      <br />

      {/* --- CONTENT SECTION --- */}
      <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto mt-4 md:mt-8">
        <div className="mb-14">
          <SeasonSection seriesId={movie.id} poster={movie.poster} temporadas={movie.temporadas} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mx-auto">


          {/* COLUMNA IZQUIERDA (Principal) */}
          <div className="lg:col-span-2 space-y-8">

            <div className="flex gap-8 border-b border-gray-700 pb-2 mb-6 overflow-x-auto">
              <button onClick={() => setActiveTab('resumen')} className={`pb-2 text-lg font-bold transition ${activeTab === 'resumen' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}>Resumen</button>
              <button onClick={() => setActiveTab('reparto')} className={`pb-2 text-lg font-bold transition ${activeTab === 'reparto' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}>Reparto</button>
              <button onClick={() => setActiveTab('trailer')} className={`pb-2 text-lg font-bold transition ${activeTab === 'trailer' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}>Trailer</button>
              <button onClick={() => setActiveTab('galeria')} className={`pb-2 text-lg font-bold transition flex items-center gap-2 ${activeTab === 'galeria' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}>Galería</button>
            </div>

            {/* TAB: RESUMEN */}
            {activeTab === 'resumen' && (
              <div className="animate-fadeIn">
                <p className="text-gray-300 leading-relaxed text-md mb-8">
                  {movie.sinopsis || "No hay descripción disponible."}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div><span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Director</span><span className="font-medium text-white">{movie.director || "N/A"}</span></div>
                  <div><span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Guion</span><span className="font-medium text-white">{movie.director || "N/A"}</span></div>
                  <div>
                    <span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Género</span>
                    <span className="font-medium text-white truncate">{Array.isArray(movie.genero) ? movie.genero.join(', ') : movie.genero}</span>
                  </div>
                  <div><span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Estreno</span><span className="font-medium text-white">{movie.anio}</span></div>
                  <div><span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">País</span><span className="font-medium text-white">EE.UU.</span></div>
                  <div><span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Clasificación</span><span className="inline-block bg-gray-700 px-2 py-0.5 rounded text-xs font-bold text-white border border-gray-600">PG-13</span></div>
                  <div><span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Estudio</span><span className="font-medium text-white">Studio</span></div>
                  <div className="col-span-2 md:col-span-1"><span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Audio Original</span><span className="font-medium text-white">Inglés</span></div>
                </div>
              </div>
            )}

            {/* TAB: REPARTO */}
            {activeTab === 'reparto' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-fadeIn">
                {movie.elenco && movie.elenco.length > 0 ? (
                  movie.elenco.map((actor, idx) => (
                    <div key={idx} className="bg-slate-800 rounded-lg overflow-hidden group">
                      <div className="h-40 overflow-hidden bg-slate-700">
                        <img src={actor.foto || `https://ui-avatars.com/api/?name=${actor.nombre}&background=random`} alt={actor.nombre} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                      </div>
                      <div className="p-3">
                        <p className="font-bold text-white text-sm truncate">{actor.nombre}</p>
                        <p className="text-xs text-gray-400 truncate">{actor.personaje || "Actor"}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 col-span-full text-center py-8">Información del reparto no disponible aún.</p>
                )}
              </div>
            )}

            {/* TAB: TRAILER */}
            {activeTab === 'trailer' && (
              <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl animate-fadeIn border border-slate-700">
                {movie.trailer ? (
                  <iframe width="100%" height="100%" src={movie.trailer.replace("watch?v=", "embed/")} title="Trailer" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500"><Film className="w-12 h-12 mb-2 opacity-50" /><p>Trailer no disponible</p></div>
                )}
              </div>
            )}

            {/* TAB: GALERÍA */}
            {activeTab === 'galeria' && (
              <div className="animate-fadeIn grid grid-cols-1 md:grid-cols-2 gap-4">
                {movie.galeria && movie.galeria.length > 0 ? (
                  movie.galeria.map((img, index) => (
                    <div key={index} className="rounded-xl overflow-hidden cursor-pointer group relative h-48 md:h-64">
                      <img src={img} alt={`Escena ${index}`} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center text-gray-500 py-10 bg-slate-800/30 rounded-lg"><ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" /> No hay imágenes disponibles en la galería.</div>
                )}
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA (Similares - Dinámico) */}
          <div className="lg:col-span-1 border-l border-slate-800 pl-4 lg:pl-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Users className="w-5 h-5 text-red-500" /> Recomendados</h3>
            <div className="flex flex-col gap-4">
              {recommendations.length > 0 ? (
                recommendations.map(rec => (
                  <div key={rec.id} onClick={() => navigate(`/movie/${rec.id}`)} className="flex gap-4 items-center p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition group">
                    <img src={rec.poster} className="w-16 h-24 object-cover rounded shadow-md group-hover:scale-105 transition bg-slate-700" alt="" />
                    <div>
                      <h4 className="font-bold text-sm text-gray-200 group-hover:text-red-400 transition line-clamp-2">{rec.titulo}</h4>
                      <p className="text-xs text-gray-500 mt-1">{rec.anio}</p>
                      <div className="flex items-center gap-1 mt-1"><Star className="w-3 h-3 text-yellow-500 fill-current" /><span className="text-xs text-gray-400">{rec.rating?.toFixed(1) || "N/A"}</span></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm">Cargando recomendaciones...</p>
              )}
            </div>
          </div>

        </div>

        <div className="mt-16 mb-12">
          <CommentsSection
            reviews={movie.resenas}  // Array de reseñas actual
            currentUser={user}       // Objeto usuario logueado
            onAddReview={handleAddReview}
            onEditReview={handleEditReview}
            onReplyReview={handleReplyReview}
            onDeleteReview={handleDeleteReview}
          />
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;