import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Play, Plus, ThumbsUp, ChevronLeft, Calendar, Clock, Star, Users,
  Film, Info, MessageSquare, Image as ImageIcon, Loader2, WifiOff,
  Edit3, X, Save, Eye, EyeOff
} from 'lucide-react';
import { getContentById, getMovies } from '../services/api';
import SeasonSection from '../components/SeasonSection';
import CommentsSection from '../components/CommentsSection';
import { useAuth } from '../context/AuthContext';
import useSWR, { useSWRConfig } from "swr";
import { db } from "../firebase/client";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

const INITIAL_STATE = {
  titulo: "Nuevo Título",
  tipo: "movie", // o 'serie'
  slug: "nuevo-titulo",
  sinopsis: "Escribe aquí la sinopsis...",
  tagline: "Frase promocional",
  poster: "",
  backdrop: "",
  trailer: "",
  preview: "",
  temporadas: [], // Array de temporadas
  peliculas: [], // Array de películas
  resenas: [],
  galeria: [],
  creado: null,
  actualizado: null,

  // Info técnica
  peso: "", formato: "", calidad: "", codec: "", bitrate: "",
  audio: "", resolucion: "", subtitulos: "", duracion: "",
  temporadassize: "1", // Texto
  episodios: "",
  aporte: "",
  nota: "",
};

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sinopsis');
  const { user, role } = useAuth(); // Obtenemos el usuario actual
  // Necesitamos mutate para decirle a SWR que recargue los datos
  const { mutate } = useSWRConfig();

  const isNew = id === 'nuevo';
  const [isEditing, setIsEditing] = useState(isNew);

  const [isPreviewing, setIsPreviewing] = useState(false);
  const showInputs = isEditing && !isPreviewing;
  
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [saving, setSaving] = useState(false);
  
  const [showPlayer, setShowPlayer] = useState(false);

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
    !isNew && id ? `movie-${id}` : null,
    () => getContentById(id),
    {
      revalidateOnFocus: false, // No recargar si cambio de pestaña (ahorra recursos)
      revalidateOnReconnect: false,
      dedupingInterval: 600000, // 10 minutos de caché (el Hero cambia poco)
    }
  );

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (movie && !isNew) {
      setFormData(movie);
    }
  }, [movie, isNew]);

  const handleSaveContent = async () => {
    setSaving(true);
    try {
      if (isNew) {
        // CREAR NUEVO
        const docRef = await addDoc(collection(db, "content"), {
          ...formData,
          createdAt: new Date()
        });
        alert("Contenido creado con éxito!");
        navigate(`/peliculas/${docRef.id}`, { replace: true });
      } else {
        // ACTUALIZAR EXISTENTE
        const movieRef = doc(db, "content", id);
        await updateDoc(movieRef, formData);
        mutate(`movie-${id}`); // Recargar SWR
        setIsEditing(false);
        alert("Cambios guardados");
      }
    } catch (error) {
      console.error("Error guardando:", error);
      alert("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (isNew) {
      navigate('/peliculas');
    } else {
      setIsEditing(false);
    }
  };

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

  const previewUrl = showInputs || isEditing ? formData.preview : movie.preview;

  const addSeason = () => {
    setFormData(prev => ({
      ...prev,
      temporadas: [
        ...(prev.temporadas || []),
        { id: "s" + (formData.temporadas.length + 1).toString(), numero: (formData.temporadas.length + 1).toString(), poster: "", episodios: "12", descarga: "" }
      ]
    }));
  };

  return (
    <div className="min-h-screen h-full bg-[#0f172a] text-white font-sans">

      {/* --- HERO SECTION --- */}
      <div className={`relative group ${showInputs && 'min-h-screen max-h-fit'}`}>

        {/* 1. FONDO (Dinámico: cambia mientras escribes la URL en modo edición) */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url('${showInputs || isEditing ? (formData.backdrop || formData.poster) : (movie.backdrop || movie.poster)}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] from-0% via-[#0f172a]/60 via-40% to-transparent to-70%"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/80 from-0% via-[#0f172a]/50 via-30% to-transparent to-50%"></div>
        </div>

        <div className="relative z-30 flex flex-col justify-between pt-16 md:pt-20 px-4 md:px-8 lg:px-16 gap-10">

          {/* HEADER: Botón Volver + (Aquí irían tus botones de Admin flotantes) */}
          <div className="flex justify-between items-start">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white hover:text-black transition w-fit border border-white/10">
              <ChevronLeft className="w-5 h-5" /> Volver
            </button>
          </div>

          {/* --- 2. PANEL DE EDICIÓN DE IMÁGENES (Solo visible al editar) --- */}
          {showInputs && (
            <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 mb-6 animate-fadeIn max-w-2xl">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                <ImageIcon className="w-4 h-4" /> URLs & Previsualización
              </h4>

              <div className="flex gap-6 items-start">

                {/* --- IZQUIERDA: INPUTS --- */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <label className="text-[12px] text-gray-500 uppercase font-bold ml-1">URL del Poster (Vertical)</label>
                    <input
                      type="text"
                      value={formData.poster}
                      onChange={(e) => handleChange('poster', e.target.value)}
                      placeholder="https://ejemplo.com/poster.jpg"
                      className="w-full bg-slate-800/80 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition placeholder-gray-500"
                    />
                    <p className="text-[11px] text-gray-500 italic ml-1">Se usa en las tarjetas y grids.</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] text-gray-500 uppercase font-bold ml-1">URL del Backdrop (Horizontal)</label>
                    <input
                      type="text"
                      value={formData.backdrop}
                      onChange={(e) => handleChange('backdrop', e.target.value)}
                      placeholder="https://ejemplo.com/fondo.jpg (Opcional)"
                      className="w-full bg-slate-800/80 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition placeholder-gray-500"
                    />
                    <p className="text-[11px] text-gray-500 italic ml-1">Si se deja vacío, se usará el poster como fondo.</p>
                  </div>
                </div>

                {/* --- DERECHA: PREVISUALIZACIÓN POSTER --- */}
                <div className="shrink-0">
                  <span className="block text-[11px] text-gray-500 uppercase font-bold mb-1 text-center">Vista previa</span>
                  {/* Contenedor con relación de aspecto de póster (2:3) */}
                  <div className="w-28 relative overflow-hidden rounded-xl aspect-[2/3] bg-slate-800 shadow-lg border border-white/5">
                    <img
                      src={formData.poster || '/default.jpg'}
                      alt="Preview Poster"
                      className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/default.jpg'; }}
                    />
                  </div>
                </div>

              </div>
              <div className="space-y-1 mt-4">
                <label className="text-[10px] text-gray-500 uppercase font-bold ml-1">URL del Video / Preview</label>
                <input
                  type="text"
                  value={formData.preview || ""} // Asegúrate de que tu INITIAL_STATE tenga 'preview': ""
                  onChange={(e) => handleChange('preview', e.target.value)}
                  placeholder="https://... (MP4 o YouTube)"
                  className="w-full bg-slate-800/80 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition placeholder-gray-500"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-4 md:space-y-6 max-w-3xl animate-fade-in-up">

            {/* --- 3. BADGE TIPO (Editable: Select) --- */}
            <div>
              {showInputs ? (
                <select
                  value={formData.tipo}
                  onChange={(e) => handleChange('tipo', e.target.value)}
                  className="bg-slate-800 text-white px-3 py-2 rounded-full border border-slate-600 text-xs font-bold uppercase tracking-widest focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="movie">Película</option>
                  <option value="serie">Serie</option>
                </select>
              ) : (
                <span className="bg-slate-800/80 w-fit px-3 py-2 rounded-full text-xs font-bold text-gray-300 uppercase tracking-widest backdrop-blur-sm border border-white/20 animate-fade-in-up">
                  {(showInputs || isEditing ? formData.tipo : movie.tipo) === 'serie' ? "Serie" : "Película"}
                </span>
              )}
            </div>

            {/* --- 4. TÍTULO (Editable: Input) --- */}
            {showInputs ? (
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => handleChange('titulo', e.target.value)}
                placeholder="Título de la película"
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight bg-transparent border-b-2 border-white/20 text-white placeholder-gray-500 focus:border-blue-500 outline-none w-full transition-colors"
              />
            ) : (
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight drop-shadow-xl [text-shadow:_0_1px_1px_rgb(0_0_0_/_0.5)]">
                {showInputs || isEditing ? formData.titulo : movie.titulo}
              </h1>
            )}

            {/* --- 5. TAGLINE (Editable: Input) --- */}
            {showInputs ? (
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="Escribe una frase promocional (Tagline)..."
                className="text-xl bg-transparent border-b border-white/20 w-full italic text-gray-300 placeholder-gray-600 focus:border-blue-500 outline-none pb-1"
              />
            ) : (
              movie.tagline ? (
                <p className="text-gray-100 italic text-lg mb-6 font-light border-l-2 border-red-500 pl-3 line-clamp-2 md:line-clamp-none drop-shadow-md [text-shadow:_0_1px_1px_rgb(0_0_0_/_0.5)]">
                  "{showInputs || isEditing ? formData.tagline : movie.tagline}"
                </p>
              ) : (
                movie.sinopsis && (
                  <p className="text-gray-100 italic text-lg mb-6 font-light border-l-2 border-red-500 pl-3 line-clamp-2 md:line-clamp-none drop-shadow-md [text-shadow:_0_1px_1px_rgb(0_0_0_/_0.5)]">
                    "{showInputs || isEditing ? formData.sinopsis.split('.')[0] : movie.sinopsis.split('.')[0]}..."
                  </p>
                )
              )
            )}

            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => previewUrl && setShowPlayer(true)}
                className={`flex items-center gap-2 px-8 py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition ${!previewUrl && 'opacity-50 cursor-not-allowed'}`}
              >
                <Play className="w-5 h-5 fill-black" /> Reproducir
              </button>
            </div>
          </div>
        </div>
      </div>

      <br />

      {/* --- CONTENT SECTION --- */}
      <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto mt-6 md:mt-9">
        <div className="mb-14">
          <SeasonSection seriesId={movie.id} poster={movie.poster} temporadas={showInputs || isEditing ? formData.temporadas : movie.temporadas} isSeries={movie.tipo === 'serie'} isEditing={isEditing} onAddClick={addSeason} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mx-auto">

          {/* COLUMNA IZQUIERDA (Principal) */}
          <div className="lg:col-span-2 space-y-6">

            <div className="flex gap-8 border-b border-gray-700 pb-2 overflow-x-auto">
              <button onClick={() => setActiveTab('sinopsis')} className={`pb-2 text-lg font-bold transition ${activeTab === 'sinopsis' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}>Sinopsis</button>
              <button onClick={() => setActiveTab('informacion')} className={`pb-2 text-lg font-bold transition ${activeTab === 'informacion' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}>Información</button>
              <button onClick={() => setActiveTab('trailer')} className={`pb-2 text-lg font-bold transition ${activeTab === 'trailer' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}>Trailer</button>
              <button onClick={() => setActiveTab('galeria')} className={`pb-2 text-lg font-bold transition flex items-center gap-2 ${activeTab === 'galeria' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}>Galería</button>
            </div>

            {/* TAB: SINOPSIS */}
            {activeTab === 'sinopsis' && (
              <div className="animate-fadeIn">
                <p className="text-gray-300 leading-relaxed text-md mb-8">
                  {movie.sinopsis || "No hay descripción disponible."}
                </p>
              </div>
            )}

            {/* TAB: INFORMACION */}
            {activeTab === 'informacion' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-slate-800/50 rounded-xl border border-slate-700 animate-fadeIn">

                {/* 1. Tamaño */}
                <div>
                  <span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Tamaño por episodio</span>
                  <span className={`font-medium ${movie.peso ? "text-white" : "text-gray-600 italic"}`}>{movie.peso || "N/A"}</span>
                </div>

                {/* 2. Formato */}
                <div>
                  <span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Formato</span>
                  <span className={`font-medium ${movie.formato ? "text-white" : "text-gray-600 italic"}`}>{movie.formato || "N/A"}</span>
                </div>

                {/* 3. Calidad */}
                <div>
                  <span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Calidad</span>
                  <span className={`font-medium ${movie.calidad ? "text-white" : "text-gray-600 italic"}`}>{movie.calidad || "N/A"}</span>
                </div>

                {/* 4. Codec */}
                <div>
                  <span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Codec</span>
                  <span className={`font-medium ${movie.codec ? "text-white" : "text-gray-600 italic"}`}>{movie.codec || "N/A"}</span>
                </div>

                {/* 5. Bit Rate */}
                <div>
                  <span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Video Bit Rate</span>
                  <span className={`font-medium ${movie.bitrate ? "text-white" : "text-gray-600 italic"}`}>{movie.bitrate || "N/A"}</span>
                </div>

                {/* 6. Audio Principal */}
                <div>
                  <span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Audio Principal</span>
                  <span className={`font-medium ${movie.audio ? "text-white" : "text-gray-600 italic"}`}>{movie.audio || "N/A"}</span>
                </div>

                {/* 7. Resolución */}
                <div>
                  <span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Resolución</span>
                  <span className={`font-medium ${movie.resolucion ? "text-white" : "text-gray-600 italic"}`}>{movie.resolucion || "N/A"}</span>
                </div>

                {/* 8. Subtítulos */}
                <div>
                  <span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Subtítulos</span>
                  <span className={`font-medium ${movie.subtitulos ? "text-white" : "text-gray-600 italic"}`}>{movie.subtitulos || "N/A"}</span>
                </div>

                {/* 9. Duración */}
                <div>
                  <span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Duración</span>
                  <span className={`font-medium ${movie.duracion ? "text-white" : "text-gray-600 italic"}`}>{movie.duracion || "N/A"}</span>
                </div>

                {/* 10. Temporadas */}
                <div>
                  <span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Temporadas</span>
                  <span className={`font-medium ${movie.temporadassize ? "text-white" : "text-gray-600 italic"}`}>{movie.temporadassize || "N/A"}</span>
                </div>

                {/* 11. Episodios */}
                <div>
                  <span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Episodios</span>
                  <span className={`font-medium ${movie.episodios ? "text-white" : "text-gray-600 italic"}`}>{movie.episodios || "N/A"}</span>
                </div>

                {/* 12. Aporte */}
                <div>
                  <span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Aporte</span>
                  <span className={`font-medium ${movie.aporte ? "text-white" : "text-gray-600 italic"}`}>{movie.aporte || "N/A"}</span>
                </div>

                {/* 13. Nota (Ocupa todo el ancho abajo) */}
                {movie.nota && (
                  <div className="col-span-2 md:col-span-3 border-t border-slate-700 pt-4 mt-2">
                    <span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Nota</span>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {movie.nota || "Sin notas adicionales."}
                    </p>
                  </div>
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

      {/* --- REPRODUCTOR DE VIDEO MODAL --- */}
      {showPlayer && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-fadeIn">
            
            {/* Botón Cerrar */}
            <button 
                onClick={() => setShowPlayer(false)}
                className="absolute top-6 right-6 z-50 bg-black/50 hover:bg-white/20 p-2 rounded-full text-white transition border border-white/10"
            >
                <X className="w-8 h-8" />
            </button>

            <div className="w-full h-full max-w-7xl max-h-[90vh] aspect-video bg-black shadow-2xl relative">
                
                {/* Lógica para detectar tipo de video */}
                {previewUrl && (previewUrl.includes("youtube.com") || previewUrl.includes("youtu.be")) ? (
                    // 1. SI ES YOUTUBE
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src={
                            previewUrl.includes("youtu.be/") 
                                ? previewUrl.replace("youtu.be/", "www.youtube-nocookie.com/embed/") + "?autoplay=1"
                                : previewUrl.replace("watch?v=", "embed/").replace("youtube.com", "youtube-nocookie.com") + "?autoplay=1"
                        }
                        title="Reproductor" 
                        frameBorder="0"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                ) : (
                    // 2. SI ES MP4 / ARCHIVO DIRECTO
                    <video 
                        src={previewUrl} 
                        controls 
                        autoPlay 
                        className="w-full h-full object-contain focus:outline-none"
                    >
                        Tu navegador no soporta el elemento de video.
                    </video>
                )}
            </div>
        </div>
      )}

      {/* --- BARRA DE HERRAMIENTAS DE ADMINISTRACIÓN --- */}
      {role === 'admin' && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
          <div className={`
            flex items-center gap-2 p-1.5 rounded-full border transition-all duration-300 ease-in-out
            ${isEditing
              ? "bg-slate-900/90 border-red-500/30 shadow-[0_0_30px_rgba(220,38,38,0.2)] pr-2"
              : "bg-slate-900/60 hover:bg-slate-800/80 border-white/10 hover:border-blue-500/50 shadow-2xl backdrop-blur-xl"
            }
          `}>

            {isEditing ? (
              <>
                {/* --- BOTÓN CANCELAR --- */}
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-full text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  title="Cancelar edición"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-white/10"></div>

                {/* --- BOTÓN PREVISUALIZAR (NUEVO) --- */}
                <button
                  onClick={() => setIsPreviewing(!isPreviewing)}
                  disabled={saving}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors
                    ${isPreviewing
                      ? "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 ring-1 ring-blue-500/50"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                    }
                  `}
                  title={isPreviewing ? "Volver a editar" : "Ver vista previa"}
                >
                  {isPreviewing ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span className="hidden sm:inline">
                    {isPreviewing ? "Editar" : "Vista Previa"}
                  </span>
                </button>

                <div className="w-px h-6 bg-white/10"></div>

                {/* --- BOTÓN GUARDAR --- */}
                <button
                  onClick={handleSaveContent}
                  disabled={saving}
                  className={`
                    flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all shadow-lg ml-1
                    ${saving
                      ? "bg-slate-700 cursor-wait"
                      : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-green-900/30 hover:shadow-green-500/30 transform hover:-translate-y-0.5"
                    }
                  `}
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span className={saving ? "" : "hidden sm:inline"}>
                    {saving ? "Guardando..." : "Guardar"}
                  </span>
                </button>
              </>
            ) : (
              /* --- BOTÓN MODO EDICIÓN --- */
              <button
                onClick={() => { setIsEditing(true); setIsPreviewing(false); }}
                className="group flex items-center gap-3 px-5 py-3 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full font-bold shadow-lg shadow-blue-900/40 transition-all"
              >
                <div className="relative">
                  <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-300"></span>
                  </span>
                </div>
                <span>Editar Ficha</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;