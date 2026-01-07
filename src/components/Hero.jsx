import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';
import { 
  Play, Info, Edit, Trash2, Search, 
  ChevronLeft, ChevronRight, X, Save, Loader2, 
  Image as ImageIcon, Clock, Calendar, ArrowDownAZ,
  ArrowUp, ArrowDown 
} from "lucide-react";
import { getContentById } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'; 
import { db } from '../firebase/client';
import { triggerAd } from '../config/ads';

const Hero = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  
  // --- 1. CONFIGURACIÓN ---
  const [heroConfig, setHeroConfig] = useState({ slides: [], interval: 8000 });
  const [configLoading, setConfigLoading] = useState(true);

  useEffect(() => {
    const heroRef = doc(db, "hero", "main");
    const unsubscribe = onSnapshot(heroRef, (snapshot) => {
      if (snapshot.exists()) {
        setHeroConfig(snapshot.data());
      } else {
        const defaultConfig = { slides: ['MJfe7PVB4FBw7PkYIhsS'], interval: 8000 };
        setDoc(heroRef, defaultConfig);
        setHeroConfig(defaultConfig);
      }
      setConfigLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- 2. ESTADOS VISUALES ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // 🟢 CAMBIO: Usamos Hover en vez de Paused
  const [showPlayer, setShowPlayer] = useState(false);

  // --- 3. CARGA DE SLIDES ---
  const multiFetcher = async (ids) => {
    if (!ids || ids.length === 0) return [];
    const promises = ids.map(id => getContentById(id));
    const results = await Promise.all(promises);
    
    // Mapeo para mantener el orden exacto de los IDs
    const dataMap = new Map(results.filter(r => r).map(item => [item.id, item]));
    return ids.map(id => dataMap.get(id)).filter(item => item !== undefined);
  };

  const { data: slides = [], isLoading: contentLoading } = useSWR(
    ['hero-slides', JSON.stringify(heroConfig.slides)], 
    () => multiFetcher(heroConfig.slides),
    { revalidateOnFocus: false, dedupingInterval: 600000 }
  );

  // --- 4. ROTACIÓN AUTOMÁTICA (CORREGIDA) ---
  useEffect(() => {
    // Si está cargando, o hay 1 slide, o el usuario tiene el mouse encima, o ve el video -> NO ROTAR
    if (contentLoading || slides.length <= 1 || isHovered || showPlayer) return;

    // Aseguramos que el intervalo sea un número válido, mínimo 3000ms
    const delay = Math.max(heroConfig.interval || 8000, 3000);

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, delay);

    // Al limpiar el intervalo, se reinicia el reloj. Esto pasa cada vez que cambia currentIndex.
    return () => clearInterval(interval);
  }, [slides.length, isHovered, contentLoading, heroConfig.interval, showPlayer, currentIndex]); 
  // 👆 Agregamos currentIndex a dependencias para que al cambiar manualmente, el reloj se reinicie a 0.

  const handleNext = () => { 
      setCurrentIndex((prev) => (prev + 1) % slides.length); 
      // No necesitamos pausar, el useEffect se reinicia solo
  };
  
  const handlePrev = () => { 
      setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length); 
  };

  // =================================================================
  // LÓGICA DEL EDITOR
  // =================================================================
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sortOrder, setSortOrder] = useState('date'); 
  const [fullCatalog, setFullCatalog] = useState([]); 
  
  const [tempSlides, setTempSlides] = useState([]);
  const [tempInterval, setTempInterval] = useState(8); 

  const openEditor = () => {
    setTempSlides([...heroConfig.slides]);
    setTempInterval((heroConfig.interval || 8000) / 1000);
    setIsEditing(true);
    setIsHovered(true); // Pausamos mientras edita
  };

  const closeEditor = () => {
    setIsEditing(false);
    setIsHovered(false); // Reanudamos al cerrar
  };

  // 1. CARGAR CATÁLOGO
  useEffect(() => {
    if (isEditing && fullCatalog.length === 0) {
      const loadCatalog = async () => {
        setSearching(true);
        try {
          const querySnapshot = await getDocs(collection(db, "content"));
          const data = querySnapshot.docs.map(doc => {
            const d = doc.data();
            return {
              id: doc.id,
              titulo: d.titulo,
              poster: d.poster,
              activo: d.activo,
              tipo: d.tipo,
              actualizado: d.actualizado?.seconds || 0
            };
          });
          // Filtramos solo activos
          setFullCatalog(data.filter(item => item.activo));
        } catch (error) {
          console.error("Error catálogo:", error);
        } finally {
          setSearching(false);
        }
      };
      loadCatalog();
    }
  }, [isEditing, fullCatalog.length]);

  // 2. FILTRADO
  useEffect(() => {
    let results = fullCatalog;
    if (searchTerm.trim() !== "") {
      const lowerTerm = searchTerm.toLowerCase();
      results = results.filter(item => item.titulo && item.titulo.toLowerCase().includes(lowerTerm));
    }
    results.sort((a, b) => sortOrder === 'date' ? b.actualizado - a.actualizado : a.titulo.localeCompare(b.titulo));
    setSearchResults(results.slice(0, 50));
  }, [searchTerm, fullCatalog, sortOrder]);

  const addToTempSlides = (id) => {
    if (!tempSlides.includes(id)) setTempSlides([...tempSlides, id]);
    setSearchTerm(""); 
  };

  const removeFromTempSlides = (id) => {
    setTempSlides(prev => prev.filter(itemId => itemId !== id));
  };

  const moveSlide = (index, direction) => {
    const newSlides = [...tempSlides];
    if (direction === 'up' && index > 0) {
        [newSlides[index], newSlides[index - 1]] = [newSlides[index - 1], newSlides[index]];
    } else if (direction === 'down' && index < newSlides.length - 1) {
        [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
    }
    setTempSlides(newSlides);
  };

  const saveChangesToFirebase = async () => {
    if (tempSlides.length === 0) return alert("Debe haber al menos 1 elemento.");
    setSaving(true);
    try {
        const heroRef = doc(db, "hero", "main");
        await updateDoc(heroRef, {
            slides: tempSlides,
            interval: tempInterval * 1000
        });
        closeEditor();
        setCurrentIndex(0); // Reiniciar al primer slide
    } catch (error) {
        console.error("Error guardando:", error);
        alert("Error al guardar");
    } finally {
        setSaving(false);
    }
  };

  // =================================================================
  // RENDERIZADO
  // =================================================================
  const isLoading = configLoading || (contentLoading && slides.length === 0);

  if (isLoading) {
    return <div className="w-full h-screen bg-[#0f172a] animate-pulse flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-slate-700"/></div>;
  }

  const movie = slides[currentIndex];
  if (!movie) return null;

  const isSeries = movie.tipo === 'series' || (movie.temporadas && movie.temporadas.length > 0);
  const previewUrl = movie.preview || null;

  return (
    // 🟢 CAMBIO: Agregamos onMouseEnter y onMouseLeave al contenedor principal
    <header 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >

      {/* FONDO */}
      {slides.map((slide, index) => (
         <div key={slide.id} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundImage: `url('${slide.backdrop || slide.poster}')` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] from-0% via-[#0f172a]/50 via-30% to-transparent to-50%"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] from-0% via-[#0f172a]/50 via-30% to-transparent to-50%"></div>
         </div>
      ))}

      {/* INFO */}
      {/* --- Contenido Hero --- */}
      <div key={movie.id} className="animate-fade-in-up relative z-10 flex flex-col justify-end min-h-screen max-h-fit px-4 md:px-8 lg:px-16 max-w-4xl space-y-4 md:space-y-6 pt-24 pb-12 md:pb-16">

          {/* Badge Tipo */}
          <span className="bg-slate-800/80 w-fit px-3 py-2 rounded-full text-xs font-bold text-gray-300 uppercase tracking-widest backdrop-blur-sm border border-white/20 animate-fade-in-up">
            {isSeries ? "Serie" : "Película"}
          </span>

          {/* Título */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight animate-fade-in-up delay-100 drop-shadow-xl [text-shadow:_0_1px_1px_rgb(0_0_0_/_0.5)]">
            {movie.titulo}
          </h2>

          {movie.tagline ? (
            <p className="text-gray-100 italic text-lg font-light border-l-2 border-red-500 pl-3 line-clamp-2 md:line-clamp-none drop-shadow-md [text-shadow:_0_1px_1px_rgb(0_0_0_/_0.5)]">
              "{movie.tagline}"
            </p>
          ) : (
            movie.sinopsis && (
              <p className="text-gray-100 italic text-lg font-light border-l-2 border-red-500 pl-3 line-clamp-2 md:line-clamp-none drop-shadow-md [text-shadow:_0_1px_1px_rgb(0_0_0_/_0.5)]">
                "{movie.sinopsis.split('.')[0]}..." 
              </p>
            )
          )}

          {/* Sinopsis */}
          <p className="text-gray-300 text-base md:text-lg leading-relaxed line-clamp-3 max-w-2xl animate-fade-in-up delay-300 drop-shadow-md [text-shadow:_0_1px_1px_rgb(0_0_0_/_0.5)]">
            {movie.sinopsis}
          </p>

          {/* Botones */}
          <div className="flex flex-wrap gap-3 md:gap-4 pt-3 animate-fade-in-up delay-500">
            <button 
              onClick={() => {
                triggerAd(); // 1. Dispara la publicidad
                if (previewUrl) setShowPlayer(true); // 2. Abre el video
              }}
              className={`flex items-center gap-2 px-6 py-2 md:px-8 md:py-3 bg-green-600 text-white rounded-full font-bold hover:bg-green-500 transition shadow-lg shadow-green-900/50 hover:scale-105 transform duration-200 ${!previewUrl && 'opacity-50 cursor-not-allowed'}`}
            >
              <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" /> Ver Ahora
            </button>
            
            <button
              onClick={() => isSeries ? navigate(`/series/${movie.id}`) : navigate(`/peliculas/${movie.id}`)}
              className="flex items-center gap-2 px-6 py-2 md:px-8 md:py-3 border border-gray-600 bg-black/30 backdrop-blur-md text-white rounded-full font-bold hover:bg-white hover:text-black transition hover:scale-105 transform duration-200"
              >
              <Info className="w-4 h-4 md:w-5 md:h-5" />
              Más Info
            </button>
          </div>
      </div>

      {/* CONTROLES */}
      {slides.length > 1 && (
        <>
            {/* <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-white/20 text-white/50 hover:text-white transition backdrop-blur-sm hidden md:flex border border-white/10 z-20"><ChevronLeft className="w-7 h-7" /></button>
            <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-white/20 text-white/50 hover:text-white transition backdrop-blur-sm hidden md:flex border border-white/10 z-20"><ChevronRight className="w-7 h-7" /></button> */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
                {slides.map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentIndex(idx)} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'}`} />
                ))}
            </div>
        </>
      )}

      {/* PLAYER */}
      {showPlayer && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-fadeIn">
            <button onClick={() => setShowPlayer(false)} className="absolute top-6 right-6 z-50 bg-black/50 hover:bg-white/20 p-2 rounded-full text-white transition border border-white/10"><X className="w-8 h-8" /></button>
            <div className="w-full h-full max-w-7xl max-h-[90vh] aspect-video bg-black shadow-2xl relative">
                {previewUrl && (previewUrl.includes("youtube.com") || previewUrl.includes("youtu.be")) ? (
                    <iframe width="100%" height="100%" src={previewUrl.includes("youtu.be/") ? previewUrl.replace("youtu.be/", "www.youtube-nocookie.com/embed/") + "?autoplay=1" : previewUrl.replace("watch?v=", "embed/").replace("youtube.com", "youtube-nocookie.com") + "?autoplay=1"} title="Reproductor" frameBorder="0" allowFullScreen className="w-full h-full"></iframe>
                ) : (
                    <video src={previewUrl} controls autoPlay className="w-full h-full object-contain focus:outline-none"></video>
                )}
            </div>
        </div>
      )}

      {/* EDITOR */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn p-4">
          <div className="bg-[#0f172a] border border-slate-700 w-full max-w-6xl h-[85vh] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative">
            <button onClick={closeEditor} className="absolute top-4 right-4 text-slate-400 hover:text-white z-50 bg-slate-800 p-1 rounded-full"><X className="w-6 h-6" /></button>

            <div className="flex-1 p-6 flex flex-col border-r border-slate-800">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Search className="w-5 h-5 text-blue-500" /> Contenido Disponible</h3>
                <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar por título..." className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 pl-8 text-sm text-white focus:border-blue-500 outline-none" />
                        <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-500" />
                    </div>
                    <div className="flex bg-slate-900 rounded-lg border border-slate-700 p-1">
                        <button onClick={() => setSortOrder('date')} className={`p-1.5 rounded transition ${sortOrder === 'date' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white'}`} title="Recientes"><Calendar className="w-4 h-4" /></button>
                        <button onClick={() => setSortOrder('name')} className={`p-1.5 rounded transition ${sortOrder === 'name' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white'}`} title="Nombre"><ArrowDownAZ className="w-4 h-4" /></button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {searching ? <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div> : searchResults.length > 0 ? (
                        searchResults.map(item => (
                            <div key={item.id} className="flex gap-3 items-center bg-slate-800/50 p-2 rounded-lg hover:bg-slate-800 transition group border border-transparent hover:border-blue-500/30">
                                <img src={item.poster || '/default.jpg'} alt="" className="w-10 h-14 object-cover rounded bg-slate-900" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white text-sm font-bold truncate">{item.titulo}</h4>
                                    <span className="text-xs text-slate-500">{item.tipo === 'serie' ? 'Serie' : 'Película'} • {item.anio}</span>
                                </div>
                                <button onClick={() => addToTempSlides(item.id)} disabled={tempSlides.includes(item.id)} className={`px-3 py-1.5 rounded text-xs font-bold transition ${tempSlides.includes(item.id) ? 'bg-green-500/20 text-green-500 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-500'}`}>
                                    {tempSlides.includes(item.id) ? 'Agregado' : 'Agregar'}
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-600 gap-2"><ImageIcon className="w-8 h-8 opacity-20" /><p className="text-xs">No se encontraron resultados</p></div>
                    )}
                </div>
            </div>

            <div className="w-full md:w-1/3 bg-slate-900/50 p-6 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Edit className="w-5 h-5 text-green-500" /> Configuración</h3>
                <div className="mb-6 bg-slate-800 p-3 rounded-lg border border-slate-700">
                    <label className="text-xs text-slate-400 uppercase font-bold flex items-center gap-2 mb-2"><Clock className="w-3 h-3" /> Rotación (segundos)</label>
                    <input type="number" min="3" max="60" value={tempInterval} onChange={(e) => setTempInterval(Number(e.target.value))} className="w-full bg-slate-900 text-white border border-slate-600 rounded px-2 py-1 text-sm outline-none focus:border-green-500" />
                </div>
                <div className="flex justify-between items-end mb-2"><span className="text-xs text-slate-500 uppercase font-bold">Orden ({tempSlides.length})</span></div>
                {/* LISTA ORDENADA CON DETECCIÓN DE ERRORES */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {tempSlides.map((id, idx) => {
                        // 1. Buscamos la info en slides (SWR) o en el catálogo completo
                        const info = slides.find(s => s.id === id) || fullCatalog.find(s => s.id === id);
                        
                        // 2. Determinamos el estado: ¿Existe, está cargando o fue eliminado?
                        // Si ya cargaron los slides O el catálogo, y aun así no hay info, es que fue borrado.
                        const isLoaded = slides.length > 0 || fullCatalog.length > 0;
                        const isDeleted = isLoaded && !info;

                        // 3. Configuración visual según estado
                        const displayTitle = info ? info.titulo : (isDeleted ? "⚠️ Contenido Eliminado" : "Cargando ID...");
                        const displayPoster = info ? (info.poster || '/default.jpg') : null;

                        return (
                            <div 
                                key={id} 
                                className={`
                                    flex gap-2 items-center p-2 rounded-lg border relative group transition-all
                                    ${isDeleted 
                                        ? "bg-red-500/10 border-red-500/50" // Estilo rojo si está eliminado
                                        : "bg-slate-800 border-slate-700"
                                    }
                                `}
                            >
                                <span className="w-5 h-5 bg-slate-700 rounded-full text-[10px] flex items-center justify-center text-white border border-slate-600 shrink-0">
                                    {idx + 1}
                                </span>
                                
                                {/* Poster o Placeholder */}
                                {displayPoster ? (
                                    <img src={displayPoster} alt="" className="w-8 h-10 object-cover rounded shrink-0" />
                                ) : (
                                    <div className={`w-8 h-10 rounded shrink-0 flex items-center justify-center ${isDeleted ? "bg-red-500/20 text-red-500" : "bg-slate-700"}`}>
                                        {isDeleted ? <Trash2 className="w-4 h-4"/> : <Loader2 className="w-3 h-3 animate-spin"/>}
                                    </div>
                                )}

                                {/* Título */}
                                <div className="flex-1 min-w-0">
                                    <h4 className={`text-xs font-medium truncate ${isDeleted ? "text-red-400 italic" : "text-slate-200"}`}>
                                        {displayTitle}
                                    </h4>
                                    {!info && !isDeleted && <span className="text-[9px] text-slate-500">{id}</span>}
                                </div>
                                
                                {/* Controles de Orden (Solo si no está eliminado o queremos permitir moverlo igual) */}
                                <div className="flex flex-col gap-1">
                                    <button 
                                        onClick={() => moveSlide(idx, 'up')} 
                                        disabled={idx === 0}
                                        className="p-0.5 text-slate-500 hover:text-white disabled:opacity-30 hover:bg-slate-700 rounded transition"
                                    >
                                        <ArrowUp className="w-3 h-3" />
                                    </button>
                                    <button 
                                        onClick={() => moveSlide(idx, 'down')} 
                                        disabled={idx === tempSlides.length - 1}
                                        className="p-0.5 text-slate-500 hover:text-white disabled:opacity-30 hover:bg-slate-700 rounded transition"
                                    >
                                        <ArrowDown className="w-3 h-3" />
                                    </button>
                                </div>

                                {/* Botón Eliminar (Rojo más intenso si el contenido está roto) */}
                                <button 
                                    onClick={() => removeFromTempSlides(id)} 
                                    className={`
                                        p-1.5 rounded-full transition ml-1
                                        ${isDeleted 
                                            ? "text-red-200 bg-red-600 hover:bg-red-500 shadow-lg animate-pulse" 
                                            : "text-slate-500 hover:text-red-500 hover:bg-red-500/10"
                                        }
                                    `}
                                    title="Quitar del carrusel"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    })}
                </div>
                <div className="pt-4 mt-4 border-t border-slate-800">
                    <button onClick={saveChangesToFirebase} disabled={saving} className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {saving ? "Guardando..." : "Guardar Cambios"}
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}

      {role === 'admin' && !isEditing && (
        <button onClick={openEditor} className="absolute top-24 right-6 z-50 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition group-hover/hero:opacity-100 duration-300 shadow-xl">
          <Edit className="w-4 h-4" /> <span className="text-xs font-bold uppercase">Editar Carrusel</span>
        </button>
      )}
    </header>
  );
};

export default Hero;