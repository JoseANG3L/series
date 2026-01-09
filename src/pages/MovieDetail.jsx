import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Play, CheckCircle, AlertCircle, ChevronLeft, Trash2, PlusCircle, Star, Users,
  AlertTriangle, Power, KeyRound, Image as ImageIcon, Loader2, WifiOff,
  Edit3, X, Save, Eye, EyeOff
} from 'lucide-react';
import { getContentById, getMovies } from '../services/api';
import SeasonSection from '../components/SeasonSection';
import CommentsSection from '../components/CommentsSection';
import { useAuth } from '../context/AuthContext';
import useSWR, { useSWRConfig } from "swr";
import { db } from "../firebase/client";
import { doc, updateDoc, arrayUnion, addDoc, collection, deleteDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import AdsterraBanner from '../components/AdsterraBanner';

const INITIAL_STATE = {
  // --- Identificadores y Datos Principales ---
  titulo: "Nuevo Título",
  tipo: "movie", // 'movie' o 'serie'
  slug: "",      // Sugerencia: déjalo vacío para generarlo automáticamente al guardar
  activo: true,
  
  // --- Textos ---
  sinopsis: "",
  tagline: "",
  
  // --- Multimedia (URLs) ---
  poster: "",
  backdrop: "",
  trailer: "",
  preview: "",
  
  // --- Arrays (Listas) ---
  temporadas: [], 
  peliculas: [],
  resenas: [],
  galeria: [],
  
  // --- Metadatos de Sistema ---
  creado: null,
  actualizado: null,

  // --- INFORMACIÓN TÉCNICA (Aplanada para el Formulario) ---
  peso: "", 
  formato: "", 
  calidad: "1080p", // Valor por defecto común
  codec: "", 
  bitrate: "",
  audio: "", 
  resolucion: "", 
  subtitulos: "", 
  duracion: "",
  episodios: "", // Cantidad de eps (texto)
  aporte: "",
  nota: "",
  
  // Nota sobre 'temporadassize': 
  // En tu mapDatabaseToModel lo calculas dinámicamente (array.length).
  // No es necesario guardarlo en DB, pero tenerlo en state no hace daño.
  temporadassize: "0", 
};

const MovieDetail = ({ tipo, forcedId }) => {
  const params = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sinopsis');
  const { user, role } = useAuth(); // Obtenemos el usuario actual
  // Necesitamos mutate para decirle a SWR que recargue los datos
  const { mutate } = useSWRConfig();

  const id = forcedId || params.id;
  const isNew = id === 'nuevo';
  const [isEditing, setIsEditing] = useState(isNew);

  const [isPreviewing, setIsPreviewing] = useState(false);
  const showInputs = isEditing && !isPreviewing;
  
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [saving, setSaving] = useState(false);
  
  const [showPlayer, setShowPlayer] = useState(false);

  // --- ESTADO UNIFICADO DEL MODAL ---
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'update', // valores: 'create', 'update', 'delete', 'error'
    message: ''     // Mensaje personalizado opcional
  });

  // --- CONFIGURACIÓN VISUAL (Diccionario de estilos) ---
  const MODAL_CONFIG = {
    sesionrequired: {
      color: "text-yellow-500",
      bg: "bg-yellow-500/20",
      border: "border-yellow-500/50",
      icon: AlertCircle,
      title: "¡Sesión Requerida!",
      defaultMessage: "Por favor, inicia sesión para continuar."
    },
    create: {
      color: "text-green-500",
      bg: "bg-green-500/20",
      border: "border-green-500/50",
      icon: PlusCircle,
      title: "¡Contenido Creado!",
      defaultMessage: "La ficha se ha creado correctamente."
    },
    update: {
      color: "text-blue-500", // Azul para diferenciar de crear
      bg: "bg-blue-500/20",
      border: "border-blue-500/50",
      icon: CheckCircle,
      title: "¡Actualizado!",
      defaultMessage: "Tus cambios se han guardado correctamente."
    },
    delete: {
      color: "text-red-500",
      bg: "bg-red-500/20",
      border: "border-red-500/50",
      icon: Trash2,
      title: "¡Eliminado!",
      defaultMessage: "El contenido ha sido eliminado permanentemente."
    },
    error: {
      color: "text-orange-500",
      bg: "bg-orange-500/20",
      border: "border-orange-500/50",
      icon: AlertCircle,
      title: "¡Ups! Algo salió mal",
      defaultMessage: "Ocurrió un error al procesar la solicitud."
    }
  };

  const showFeedback = (type, customMessage = "") => {
    setModalState({
      isOpen: true,
      type: type,
      message: customMessage
    });

    // Si NO es error, cerramos automáticamente después de 2 segundos
    if (type !== 'error') {
      setTimeout(() => {
        setModalState(prev => ({ ...prev, isOpen: false }));
        // Aquí podrías redirigir si es necesario
      }, 2000);
    }
  };

  // --- ESTADO PARA CONFIRMACIONES ---
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    isDangerous: true,
    descartar: false
  });

  // --- FUNCIÓN HELPER PARA PEDIR CONFIRMACIÓN ---
  const askConfirmation = (title, message, action, isDangerous = true, descartar = false) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => action(), // Envolvemos la función
      isDangerous,
      descartar
    });
  };

  // --- EJECUTAR ACCIÓN CONFIRMADA ---
  const executeConfirmation = () => {
    if (confirmModal.onConfirm) {
      confirmModal.onConfirm(); // Ejecutamos la función guardada
    }
    setConfirmModal({ ...confirmModal, isOpen: false }); // Cerramos
  };

  const handleAddReview = async (newReviewData) => {
    if (!user) return showFeedback('sesionrequired', "Debes iniciar sesión para agregar una reseña.");

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
      showFeedback('error', "Error al editar el comentario");
    }
  };

  // 3. NUEVO: RESPONDER COMENTARIO
  const handleReplyReview = async (reviewId, replyText, targetUser = null) => {
    if (!user) return showFeedback('sesionrequired', "Debes iniciar sesión para responder.");

    // Objeto de respuesta
    const newReply = {
      id: crypto.randomUUID(),
      usuario: user.displayName || "Usuario",
      avatar: user.photoURL,
      avatarConfig: user.avatarConfig,
      comentario: replyText,
      fecha: new Date().toLocaleDateString('es-ES'),
      userId: user.uid,
      replyToUser: targetUser
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
      showFeedback('error', "Error al responder el comentario");
    }
  };

  // --- B. EDITAR RESPUESTA (NUEVA FUNCIÓN) ---
  const handleEditReply = async (reviewId, replyId, newText) => {
    const updatedReviews = movie.resenas.map(review => {
      if (review.id === reviewId && review.replies) {
        // Buscamos la respuesta dentro del review y la actualizamos
        const updatedReplies = review.replies.map(reply => {
            if (reply.id === replyId) {
                return { ...reply, comentario: newText };
            }
            return reply;
        });
        return { ...review, replies: updatedReplies };
      }
      return review;
    });

    try {
      await updateDoc(doc(db, "content", id), { resenas: updatedReviews });
      mutate(id ? `movie-${id}` : null);
    } catch (error) {
      console.error(error);
      showFeedback('error', "Error al editar respuesta");
    }
  };

  // --- C. ELIMINAR RESPUESTA (NUEVA FUNCIÓN) ---
  const handleDeleteReply = async (reviewId, replyId) => {
    const updatedReviews = movie.resenas.map(review => {
      if (review.id === reviewId && review.replies) {
        // Filtramos para quitar la respuesta
        const updatedReplies = review.replies.filter(reply => reply.id !== replyId);
        return { ...review, replies: updatedReplies };
      }
      return review;
    });

    try {
      await updateDoc(doc(db, "content", id), { resenas: updatedReviews });
      mutate(id ? `movie-${id}` : null);
    } catch (error) {
      console.error(error);
      showFeedback('error', "Error al eliminar respuesta");
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
      showFeedback('error', "Error al eliminar el comentario");
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

  const [rawGallery, setRawGallery] = useState("");

  useEffect(() => {
    if (movie && !isNew) {
      setFormData({
        ...INITIAL_STATE, 
        ...movie 
      });
    }
  }, [movie, isNew]);

  useEffect(() => {
    if (isNew) {
      // Si estamos creando, forzamos el tipo según la URL
      setFormData(prev => ({
        ...prev,
        tipo: tipo || "serie" // Si vienes de /series/nuevo, pone 'serie'
      }));
      setIsEditing(true); // Aseguramos modo edición
    }
    // No necesitamos else, porque si no es nuevo, SWR cargará los datos reales
  }, [isNew, tipo]);

  useEffect(() => {
    // Verificamos que ya existan datos y no sea un formulario de creación
    if (movie && !isNew) {
      
      // 1. PRIORIDAD: SEGURIDAD (Si está inactivo y no es admin, ¡fuera!)
      if (!movie.activo && role !== 'admin') {
        navigate('/', { replace: true });
        return; // 🛑 IMPORTANTE: Detenemos aquí para que no siga ejecutando código
      }

      // 2. SECUNDARIO: CORRECCIÓN DE URL
      // Solo llegamos aquí si el contenido es visible o si es admin
      const currentPath = location.pathname.split('/')[1]; 
      const expectedPath = movie.tipo === 'serie' ? 'series' : 'peliculas';

      if (currentPath === 'movie' || (currentPath !== expectedPath && currentPath !== 'admin')) {
        navigate(`/${expectedPath}/${movie.id}`, { replace: true });
      }
    }
  }, [movie, isNew, role, location.pathname, navigate]);

  useEffect(() => {
    if (showInputs && Array.isArray(formData.galeria)) {
      setRawGallery(formData.galeria.join('\n'));
    }
  }, [showInputs]);

  const handleSaveContent = async () => {
    setSaving(true);
    try {
      // 1. DESESTRUCTURACIÓN: Separamos los datos técnicos del resto
      const {
        // Estos campos van DENTRO de 'informacion'
        peso, formato, calidad, codec, bitrate, audio, resolucion, 
        subtitulos, duracion, episodios, aporte, nota, temporadassize,
        
        // Estos campos se quedan FUERA (Raíz)
        ...restOfData 
      } = formData;

      // 2. RECONSTRUCCIÓN: Creamos el objeto con la estructura correcta para Firebase
      const dataToSave = {
        ...restOfData, // titulo, poster, arrays, activo, etc.
        
        // Creamos el sub-objeto
        informacion: {
          peso: peso || "",
          formato: formato || "",
          calidad: calidad || "",
          codec: codec || "",
          bitrate: bitrate || "",
          audio: audio || "",
          resolucion: resolucion || "",
          subtitulos: subtitulos || "",
          duracion: duracion || "",
          episodios: episodios || "",
          aporte: aporte || "",
          nota: nota || ""
        },
        
        // Actualizamos la fecha
        actualizado: new Date()
      };

      // Limpieza de seguridad para campos principales (por si algo viene undefined)
      Object.keys(dataToSave).forEach(key => {
        if (dataToSave[key] === undefined) {
            dataToSave[key] = ""; 
        }
      });

      const targetRoute = dataToSave.tipo === 'serie' ? '/series' : '/peliculas';

      // 3. GUARDADO EN FIREBASE
      if (isNew) {
        // Si es nuevo, agregamos la fecha de creación
        dataToSave.creado = new Date();
        
        await addDoc(collection(db, "content"), dataToSave);
        
        showFeedback('create');
        
        setTimeout(() => {
          navigate(targetRoute, { replace: true });
        }, 3000);

      } else {
        // Si es edición
        const movieRef = doc(db, "content", id);
        
        await updateDoc(movieRef, dataToSave);
        
        mutate('all-movies');       
        showFeedback('update');

        // Recargar pagina
        //window.location.reload();

        setTimeout(() => {
          window.location.reload();
        }, 3000);
        // setTimeout(() => {
        //   navigate(targetRoute, { replace: true });
        // }, 3000);
      }

    } catch (error) {
      console.error("Error guardando:", error);
      showFeedback('error', "Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  // const handleCancel = () => {
  //   if (isNew) {
  //     navigate('/peliculas');
  //   } else {
  //     setIsEditing(false);
  //   }
  // };

  const handleCancel = () => {
    // 1. Reconstruimos cuál era la data original para comparar
    let originalData;

    if (isNew) {
      // Si es nuevo, la original es el INITIAL_STATE con el tipo correcto (según tu useEffect)
      originalData = { 
        ...INITIAL_STATE, 
        tipo: tipo || "serie" 
      };
    } else {
      // Si es edición, la original es la mezcla de INITIAL + lo que vino de la BD (movie)
      // Esto debe coincidir con lo que haces en tu useEffect de carga
      originalData = { 
        ...INITIAL_STATE, 
        ...movie 
      };
    }

    // 2. Comparamos: Convertimos a texto para ver si son idénticos
    // JSON.stringify es útil aquí para comparar arrays y objetos anidados
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

    // 3. Definimos la acción de salir (para no repetir código)
    const performExit = () => {
      if (isNew) {
        const targetPath = formData.tipo === 'serie' ? '/series' : '/peliculas';
        navigate(targetPath);
      } else {
        setIsEditing(false);
        // Restauramos visualmente los datos originales
        if (movie) setFormData(originalData);
      }
    };

    // 4. Lógica de Decisión
    if (hasChanges) {
      // Si hay cambios, pedimos confirmación
      askConfirmation(
        "¿Descartar cambios?",
        "Tienes cambios sin guardar. Si cancelas ahora, se perderán permanentemente.",
        performExit, // Si dice "Sí", ejecutamos la salida
        true, // isDangerous (Botón rojo)
        true // descartar
      );
    } else {
      // Si NO hay cambios, salimos inmediatamente sin molestar
      performExit();
    }
  };

  const handleDeleteContent = () => {
    askConfirmation(
      `¿Eliminar "${formData.titulo}"?`,
      "Esta acción borrará permanentemente la ficha, sus temporadas y comentarios. No se puede deshacer.",
      async () => {
        setSaving(true); // Ponemos loading
        try {
            // Borramos de Firebase
            await deleteDoc(doc(db, "content", id));
            
            showFeedback('delete');

            // Redirigimos a la lista correspondiente
            const targetRoute = formData.tipo === 'serie' ? '/series' : '/peliculas';
            
            // Esperamos un segundo para que se vea el mensaje de éxito
            setTimeout(() => {
                navigate(targetRoute, { replace: true });
                mutate('all-movies'); // Forzamos recarga de caché
            }, 1500);

        } catch (error) {
            console.error("Error al eliminar:", error);
            showFeedback('error', "No se pudo eliminar el contenido");
            setSaving(false);
        }
      },
      true // isDangerous = true (Botón rojo en el modal)
    );
  };

  // --- 2. CARGAR RECOMENDACIONES (SWR) ---
  // const { data: allMovies } = useSWR('all-movies', getMovies);

  // Filtramos las recomendaciones (si ya cargaron las pelis)
  // const recommendations = allMovies
  //   ? allMovies.filter(m => m.id !== parseInt(id)).slice(0, 4)
  //   : [];

  // --- LOADING ---
  if (loadingMovie) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
      </div>
    );
  }

  if (!isNew && (errorMovie || !movie)) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-slate-400 gap-4">
        <WifiOff className="w-16 h-16 opacity-50" />
        <p className="text-xl">Contenido no encontrado o error de conexión</p>
        <button onClick={() => navigate(-1)} className="text-red-500 hover:underline">Volver atrás</button>
      </div>
    );
  }

  const previewUrl = showInputs || isEditing ? formData.preview : movie.preview;

  // --- GESTIÓN DE TEMPORADAS (CRUD) ---

  // 1. AGREGAR TEMPORADA (Mejorada)
  const handleAddSeason = (type = "normal") => {
    setFormData(prev => {
      const currentSeasons = prev.temporadas || [];
      let nextLabel = "1";
      
      if (type === "normal") {
          // Filtramos solo las que son números para seguir la secuencia correcta
          const numericSeasons = currentSeasons.filter(s => !isNaN(parseInt(s.numero)));
          nextLabel = (numericSeasons.length + 1).toString();
      } else {
          // Lógica para OVAs (opcional: autoincrementar OVA 1, OVA 2...)
          const ovaSeasons = currentSeasons.filter(s => s.numero.toString().toLowerCase().includes("ova"));
          nextLabel = ovaSeasons.length > 0 ? `OVA ${ovaSeasons.length + 1}` : "OVA";
      }
      
      return {
        ...prev,
        temporadas: [
          ...currentSeasons,
          { 
            id: crypto.randomUUID(), // ID único seguro
            numero: nextLabel, 
            poster: "", // Heredará el de la serie si está vacío
            episodios: type === "ova" ? "1" : "12", 
            descarga: "" 
          }
        ]
      };
    });
  };

  // 2. ACTUALIZAR TEMPORADA (Cuando escribes en los inputs de la tarjeta)
  const handleUpdateSeason = (index, updatedSeasonData) => {
    setFormData(prev => {
      const newSeasons = [...(prev.temporadas || [])];
      newSeasons[index] = updatedSeasonData; // Reemplazamos la vieja con la nueva
      return { ...prev, temporadas: newSeasons };
    });
  };

  // 3. BORRAR TEMPORADA
  const handleDeleteSeason = (index) => {
    askConfirmation(
        "¿Eliminar Temporada?", 
        "Esta acción eliminará la temporada y toda su información. No se puede deshacer.",
        () => {
            // AQUÍ VA LA LÓGICA DE BORRADO REAL (Callback)
            setFormData(prev => {
                const newSeasons = [...(prev.temporadas || [])];
                newSeasons.splice(index, 1);
                return { ...prev, temporadas: newSeasons };
            });
            // Opcional: Mostrar feedback de éxito después
            // showFeedback('update', 'Temporada eliminada');
        }
    );
  };

  // --- GESTIÓN DE PELÍCULAS (CRUD) ---

  // 1. AGREGAR PELÍCULA
  const handleAddMovie = () => {
    setFormData(prev => {
      const currentMovies = prev.peliculas || [];
      const nextNum = currentMovies.length + 1;

      return {
        ...prev,
        peliculas: [
          ...currentMovies,
          { 
            id: crypto.randomUUID(), 
            titulo: `Película ${nextNum}`, // Título por defecto ej: "Película 2"
            poster: "",      // Por si cada peli de la saga tiene su poster
            anio: new Date().getFullYear().toString(),
            calidad: formData.calidad || "1080p", // Hereda la calidad global o usa default
            duracion: "",
            descarga: ""     // Link de descarga/ver
          }
        ]
      };
    });
  };

  // 2. ACTUALIZAR PELÍCULA (Cuando editas una fila de película)
  const handleUpdateMovie = (index, updatedMovieData) => {
    setFormData(prev => {
      const newMovies = [...(prev.peliculas || [])];
      newMovies[index] = updatedMovieData; 
      return { ...prev, peliculas: newMovies };
    });
  };

  // 3. BORRAR PELÍCULA
  const handleDeleteMovie = (index) => {
    askConfirmation(
        "¿Eliminar Película?", 
        "Esta acción eliminará esta película de la lista de la saga. No se puede deshacer.",
        () => {
            setFormData(prev => {
                const newMovies = [...(prev.peliculas || [])];
                newMovies.splice(index, 1);
                return { ...prev, peliculas: newMovies };
            });
        }
    );
  };

  return (
    <div className="min-h-screen h-full bg-[#0f172a] text-white font-sans">

      {/* --- HERO SECTION --- */}
      <div className={`relative group ${showInputs && 'min-h-screen max-h-fit'}`}>

        {/* 1. FONDO (Dinámico: cambia mientras escribes la URL en modo edición) */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url('${showInputs || isEditing ? (formData.backdrop || formData.poster || '/default.jpg') : (movie.backdrop || movie.poster || '/default.jpg')}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] from-0% via-[#0f172a]/50 via-30% to-transparent to-50%"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] from-0% via-[#0f172a]/50 via-30% to-transparent to-50%"></div>
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
                      value={formData.poster || '/default.jpg'}
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
                      value={formData.backdrop || '/default.jpg'}
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
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/default.jpg'; }}
                    />
                  </div>
                </div>

              </div>
              <div className="space-y-1 mt-4">
                <label className="text-[12px] text-gray-500 uppercase font-bold ml-1">URL del Video / Preview</label>
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
              showInputs || isEditing && formData.tagline ? (
                <p className="text-gray-100 italic text-lg mb-6 font-light border-l-2 border-red-500 pl-3 line-clamp-2 md:line-clamp-none drop-shadow-md [text-shadow:_0_1px_1px_rgb(0_0_0_/_0.5)]">
                  "{formData.tagline}"
                </p>
              ) : (
                movie.tagline && (
                  <p className="text-gray-100 italic text-lg mb-6 font-light border-l-2 border-red-500 pl-3 line-clamp-2 md:line-clamp-none drop-shadow-md [text-shadow:_0_1px_1px_rgb(0_0_0_/_0.5)]">
                    "{movie.tagline}"
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
      <div className="px-4 md:px-8 lg:px-16 max-w-5xl mx-auto mt-6 md:mt-9">
        <div className="mb-10">
          <SeasonSection
            titulo={showInputs || isEditing ? formData.titulo : movie?.titulo}
            seriesId={isNew ? null : movie?.id}
            poster={showInputs || isEditing ? formData.poster : movie?.poster}
            temporadas={showInputs || isEditing ? formData.temporadas : movie.temporadas}
            peliculas={showInputs || isEditing ? formData.peliculas : movie.peliculas}
            isSeries={showInputs || isEditing ? formData.tipo === 'serie' : movie.tipo === 'serie'}
            isEditing={isEditing}
            showInputs={showInputs}
            onAddSeason={formData.tipo === 'serie' ? handleAddSeason : handleAddMovie}
            onUpdateSeason={formData.tipo === 'serie' ? handleUpdateSeason : handleUpdateMovie}
            onDeleteSeason={formData.tipo === 'serie' ? handleDeleteSeason : handleDeleteMovie}
          />
        </div>

        <div className="mb-10 rounded-3xl p-[1px]
                        bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <div className="rounded-3xl bg-slate-800 p-4 text-white text-lg text-center
                          flex items-center justify-center gap-2">
            <KeyRound className="" /> Contraseña: <span className="font-bold text-green-500 text-xl">LuisF</span>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mx-auto">

          {/* COLUMNA IZQUIERDA (Principal) */}
          <div className="lg:col-span-3 space-y-6">

            <div className="flex gap-8 border-b border-gray-700 pb-2 overflow-x-auto">
              <button onClick={() => setActiveTab('sinopsis')} className={`pb-2 text-lg font-bold transition ${activeTab === 'sinopsis' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}>Sinopsis</button>
              <button onClick={() => setActiveTab('informacion')} className={`pb-2 text-lg font-bold transition ${activeTab === 'informacion' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}>Información</button>
              {/* <button onClick={() => setActiveTab('trailer')} className={`pb-2 text-lg font-bold transition ${activeTab === 'trailer' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}>Trailer</button> */}
              <button onClick={() => setActiveTab('galeria')} className={`pb-2 text-lg font-bold transition flex items-center gap-2 ${activeTab === 'galeria' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}>Galería</button>
            </div>

            {/* TAB: SINOPSIS */}
            {activeTab === 'sinopsis' && (
              <div className="animate-fadeIn">
                {showInputs ? (
                  <textarea
                    value={formData.sinopsis || ""}
                    onChange={(e) => setFormData({...formData, sinopsis: e.target.value})}
                    className="w-full h-40 bg-slate-800 text-gray-200 p-4 rounded-lg border border-slate-600 focus:border-red-500 outline-none leading-relaxed resize-none"
                    placeholder="Escribe la sinopsis aquí..."
                  />
                ) : (
                  <p className="text-gray-300 leading-relaxed text-md mb-8">
                    {isEditing || showInputs ? formData.sinopsis : movie.sinopsis || "No hay descripción disponible."}
                  </p>
                )}
              </div>
            )}

            {/* TAB: INFORMACION */}
            {activeTab === 'informacion' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-slate-800/50 rounded-xl border border-slate-700 animate-fadeIn">

                {/* Helper para renderizar campos repetitivos */}
                {[
                  { label: "Tamaño", field: "peso" },
                  { label: "Formato", field: "formato" },
                  { label: "Calidad", field: "calidad" },
                  { label: "Codec", field: "codec" },
                  { label: "Bit Rate", field: "bitrate" },
                  { label: "Audio", field: "audio" },
                  { label: "Resolución", field: "resolucion" },
                  { label: "Subtítulos", field: "subtitulos" },
                  { label: "Duración", field: "duracion" },
                  { label: "Temporadas", field: "temporadassize" },
                  { label: "Episodios", field: "episodios" },
                  { label: "Aporte", field: "aporte" },
                ].map((item, i) => (
                  <div key={i}>
                    <span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">{item.label}</span>
                    {showInputs ? (
                      <input
                        type="text"
                        value={formData[item.field] || ""}
                        onChange={(e) => setFormData({ ...formData, [item.field]: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:border-red-500 outline-none"
                      />
                    ) : (
                      <span className={`font-medium ${isEditing || showInputs ? (formData[item.field] ? "text-white" : "text-gray-600 italic") : (movie[item.field] ? "text-white" : "text-gray-600 italic")}`}>
                        {isEditing || showInputs ? formData[item.field] || "N/A" : movie[item.field] || "N/A"}
                      </span>
                    )}
                  </div>
                ))}
                
                {/* Nota (Campo especial full width) */}
                <div className="col-span-2 md:col-span-3 border-t border-slate-700 pt-4 mt-2">
                  <span className="block text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wider">Nota</span>
                  {showInputs ? (
                    <input
                      type="text"
                      value={formData.nota || ""}
                      onChange={(e) => setFormData({...formData, nota: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:border-red-500 outline-none"
                      placeholder="Notas adicionales..."
                    />
                  ) : (
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {isEditing || showInputs ? formData.nota : movie.nota || "Sin notas adicionales."}
                    </p>
                  )}
                </div>

              </div>
            )}

            {/* TAB: TRAILER */}
            {activeTab === 'trailer' && (
              <div className="space-y-4 animate-fadeIn">
                {showInputs && (
                  <div>
                    <label className="text-xs text-red-400 uppercase font-bold block mb-1">URL Youtube Trailer</label>
                    <input
                      type="text"
                      value={formData.trailer || ""}
                      onChange={(e) => setFormData({...formData, trailer: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white focus:border-red-500 outline-none"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                )}
                
                {/* Lógica segura para mostrar el video */}
                <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-700 relative">
                  {(() => {
                      // Calculamos cuál url usar
                      const currentTrailer = isEditing ? formData.trailer : movie.trailer;
                      
                      // 🔴 VALIDACIÓN: Solo mostramos iframe si hay URL y no está vacía
                      if (currentTrailer && currentTrailer.length > 5) {
                          return (
                            <iframe 
                                width="100%" 
                                height="100%" 
                                // Usamos replace de forma segura
                                src={currentTrailer.replace("watch?v=", "embed/")} 
                                title="Trailer" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                          );
                      } else {
                          // Si está vacío, mostramos el placeholder
                          return (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                              <p>Trailer no disponible</p>
                            </div>
                          );
                      }
                  })()}
                </div>
              </div>
            )}

            {/* TAB: GALERÍA */}
            {activeTab === 'galeria' && (
              <div className="animate-fadeIn">
                
                {/* EDITOR DE GALERÍA */}
                {showInputs && (
                  <div className="mb-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
                    <label className="text-xs text-red-400 uppercase font-bold block mb-2">
                        URLs de Imágenes (Una por línea o separadas por coma)
                    </label>
                    <textarea
                      // ✅ 1. Protección: Si formData.galeria es null, usa []
                      value={rawGallery}
                      onChange={(e) => {
                        const val = e.target.value;
                          
                        // 1. Actualizamos el texto visual (permite comas y enters)
                        setRawGallery(val); 

                        // 2. Actualizamos los datos reales (Array) en segundo plano
                        const links = val.split(/[\n,]+/).map(l => l.trim()).filter(l => l !== "");
                        setFormData(prev => ({ ...prev, galeria: links }));
                      }}
                      className="w-full h-32 bg-slate-900 text-xs text-gray-300 p-2 rounded border border-slate-600 focus:border-red-500 outline-none resize-none"
                      placeholder="https://imagen1.jpg&#10;https://imagen2.jpg"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">
                        Pega los enlaces aquí para actualizar la galería.
                    </p>
                  </div>
                )}

                {/* GRILLA DE IMÁGENES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Definimos qué galería mostrar de forma segura */}
                  {(() => {
                      const currentGallery = (showInputs ? formData.galeria : movie.galeria) || [];
                      // ✅ 2. Filtrado: Solo mostramos links que tengan más de 5 caracteres (https://...)
                      const validImages = Array.isArray(currentGallery) 
                          ? currentGallery.filter(link => link && link.length > 5) 
                          : [];

                      if (validImages.length > 0) {
                          return validImages.map((img, index) => (
                              <div key={index} className="rounded-xl overflow-hidden cursor-pointer group relative h-48 md:h-64 border border-slate-700">
                                {/* ✅ 3. Src seguro: Ya filtramos antes, pero dejamos el || null por seguridad extra */}
                                <img 
                                    src={img || null} 
                                    alt={`Escena ${index}`} 
                                    referrerPolicy="no-referrer"
                                    loading="lazy"
                                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
                              </div>
                          ));
                      } else {
                          // Estado vacío
                          return (
                            <div className="col-span-2 text-center text-gray-500 py-10 bg-slate-800/30 rounded-lg">
                                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" /> 
                                No hay imágenes disponibles.
                            </div>
                          );
                      }
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA (Similares - Dinámico) */}
          {/* <div className="lg:col-span-1 border-l border-slate-800 pl-4 lg:pl-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Users className="w-5 h-5 text-red-500" /> Recomendados</h3>
            <div className="flex flex-col gap-4">
              {recommendations.length > 0 ? (
                recommendations.map(rec => (
                  <div key={rec.id} onClick={() => navigate(`/movie/${rec.id}`)} className="flex gap-4 items-center p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition group">
                    <img
                      src={rec.poster}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-16 h-24 object-cover rounded shadow-md group-hover:scale-105 transition bg-slate-700"
                      alt=""
                    />
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
          </div> */}

        </div>

        <AdsterraBanner />

        <div className="mt-16 mb-12">
          <CommentsSection
            reviews={isNew || !movie ? [] : movie.resenas}
            currentUser={user}
            onAddReview={handleAddReview}
            onEditReview={handleEditReview}
            onReplyReview={handleReplyReview}
            onDeleteReview={handleDeleteReview}
            onEditReply={handleEditReply}
            onDeleteReply={handleDeleteReply}
          />
        </div>
      </div>

      {/* --- REPRODUCTOR DE VIDEO MODAL --- */}
      {showPlayer && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-fadeIn">
            
            {/* Botón Cerrar */}
            <button 
                onClick={() => {
                  triggerAd(); // 1. Dispara la publicidad
                  if (previewUrl) setShowPlayer(true); // 2. Abre el video
                }}
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

      {role === 'admin' && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
          <div className={`
            flex flex-wrap items-center gap-2 p-1.5 rounded-full border transition-all duration-300 ease-in-out
            ${isEditing
              ? "bg-slate-900/90 border-red-500/30 shadow-[0_0_30px_rgba(220,38,38,0.2)] pr-2"
              : "bg-slate-900/60 hover:bg-slate-800/80 border-white/10 hover:border-blue-500/50 shadow-2xl backdrop-blur-xl"
            }
          `}>

            {isEditing ? (
              <>
                {/* --- 🔴 NUEVO: BOTÓN ELIMINAR (Solo si no es nuevo) --- */}
                {!isNew && (
                  <>
                    <button
                      onClick={handleDeleteContent}
                      disabled={saving}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-full text-sm font-medium text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Eliminar permanentemente"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-px h-6 bg-white/10"></div>
                  </>
                )}

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

                {/* --- TOGGLE ACTIVO/INACTIVO --- */}
                <button
                  onClick={() => setFormData({ ...formData, activo: !formData.activo })}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border mx-1
                    ${formData.activo
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                      : "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
                    }
                  `}
                  title={formData.activo ? "El contenido es visible" : "El contenido está oculto"}
                >
                  <Power className="w-3.5 h-3.5" />
                  {formData.activo ? "Visible" : "Oculto"}
                </button>

                <div className="w-px h-6 bg-white/10"></div>

                {/* --- BOTÓN PREVISUALIZAR --- */}
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

      {/* --- MODAL DINÁMICO DE FEEDBACK --- */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
          
          {/* Tarjeta del Modal */}
          <div className={`bg-slate-900 border ${MODAL_CONFIG[modalState.type].border} rounded-2xl p-8 flex flex-col items-center justify-center shadow-2xl transform scale-105 transition-all max-w-sm text-center relative`}>
            
            {/* Botón Cerrar (Solo visible si es Error para dar tiempo a leer) */}
            {modalState.type === 'error' && (
              <button 
                onClick={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                className="absolute top-3 right-3 text-slate-500 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Icono Dinámico */}
            <div className={`w-16 h-16 ${MODAL_CONFIG[modalState.type].bg} rounded-full flex items-center justify-center mb-4 ${modalState.type === 'error' ? 'animate-pulse' : 'animate-bounce'}`}>
              {/* Renderizamos el componente de icono dinámicamente */}
              {React.createElement(MODAL_CONFIG[modalState.type].icon, {
                 className: `w-8 h-8 ${MODAL_CONFIG[modalState.type].color}`
              })}
            </div>

            {/* Título Dinámico */}
            <h3 className="text-2xl font-bold text-white mb-2">
              {MODAL_CONFIG[modalState.type].title}
            </h3>

            {/* Mensaje Dinámico (Usa el custom o el default) */}
            <p className="text-slate-400">
              {modalState.message || MODAL_CONFIG[modalState.type].defaultMessage}
            </p>

            {/* Spinner de recarga (Solo si no es error) */}
            {modalState.type !== 'error' && (
              <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" /> Procesando...
              </div>
            )}

            {/* Botón Cerrar Manual (Solo Error) */}
            {modalState.type === 'error' && (
               <button
                 onClick={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                 className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-bold transition border border-slate-700"
               >
                 Cerrar
               </button>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL DE CONFIRMACIÓN (INTERACTIVO) --- */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
          
          <div className="bg-slate-900 border border-yellow-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl transform scale-100 transition-all relative">
            
            {/* Botón X Cerrar */}
            <button 
              onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              
              {/* Icono de Advertencia */}
              <div className="w-14 h-14 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>

              {/* Título */}
              <h3 className="text-xl font-bold text-white mb-2">
                {confirmModal.title}
              </h3>

              {/* Mensaje */}
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                {confirmModal.message}
              </p>

              {/* Botones de Acción */}
              <div className="flex gap-3 w-full">
                
                {/* Botón Cancelar */}
                <button
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-bold transition border border-slate-700"
                >
                  Cancelar
                </button>

                {/* Botón Confirmar (Rojo si es peligroso, Azul si no) */}
                <button
                  onClick={executeConfirmation}
                  className={`flex-1 px-4 py-2.5 text-white rounded-lg text-sm font-bold transition shadow-lg flex items-center justify-center gap-2 ${
                    confirmModal.isDangerous 
                      ? "bg-red-600 hover:bg-red-500 shadow-red-900/20" 
                      : "bg-blue-600 hover:bg-blue-500 shadow-blue-900/20"
                  }`}
                >
                  {confirmModal.isDangerous ? (confirmModal.descartar ? "Sí, descartar" : "Sí, eliminar") : "Confirmar"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;