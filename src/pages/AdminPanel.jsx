import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Edit3, Trash2, Eye, EyeOff, 
  Loader2, Filter, RefreshCw, X, AlertTriangle, CheckCircle, AlertCircle 
} from 'lucide-react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/client'; 

const AdminPanel = () => {
  const navigate = useNavigate();
  
  // --- ESTADOS DE DATOS ---
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all', 'movie', 'serie'
  
  // --- ESTADOS DE MODALES (Confirmación y Feedback) ---
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'update', 
    message: ''
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    isDangerous: true,
    confirmText: "" 
  });

  // --- CONFIGURACIÓN VISUAL DE MODALES ---
  const MODAL_CONFIG = {
    update: {
      color: "text-blue-500",
      bg: "bg-blue-500/20",
      border: "border-blue-500/50",
      icon: CheckCircle,
      title: "¡Actualizado!",
      defaultMessage: "El estado se ha actualizado correctamente."
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
      title: "¡Error!",
      defaultMessage: "Ocurrió un error al procesar la solicitud."
    }
  };

  // --- HELPERS DE MODALES ---
  const showFeedback = (type, customMessage = "") => {
    setModalState({ isOpen: true, type, message: customMessage });
    if (type !== 'error') {
      setTimeout(() => setModalState(prev => ({ ...prev, isOpen: false })), 2000);
    }
  };

  const askConfirmation = (title, message, action, isDangerous = true, buttonText = "") => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => action(),
      isDangerous,
      confirmText: buttonText
    });
  };

  const executeConfirmation = () => {
    if (confirmModal.onConfirm) confirmModal.onConfirm();
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  // --- CARGAR DATOS DE FIREBASE ---
  const fetchContent = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "content"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Ordenar: Recientes primero
      data.sort((a, b) => {
         const dateA = a.creado?.seconds || 0;
         const dateB = b.creado?.seconds || 0;
         return dateB - dateA;
      });
      
      setContent(data);
    } catch (error) {
      console.error("Error cargando contenido:", error);
      showFeedback('error', "No se pudo cargar la lista de contenido.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // --- ACCIONES PRINCIPALES ---

  // 1. Eliminar Contenido
  const handleDelete = (id, titulo) => {
    askConfirmation(
      `¿Eliminar "${titulo}"?`,
      "Esta acción es irreversible. Se borrará la ficha, temporadas y reseñas.",
      async () => {
        try {
          await deleteDoc(doc(db, "content", id));
          // Actualizar estado local
          setContent(prev => prev.filter(item => item.id !== id));
          showFeedback('delete');
        } catch (error) {
          console.error("Error al eliminar:", error);
          showFeedback('error', "No se pudo eliminar el elemento.");
        }
      },
      true, // Rojo
      "Sí, eliminar"
    );
  };

  // 2. Toggle Visibilidad (Activo / Oculto) - CON CONFIRMACIÓN
  const handleToggleActive = (item) => {
    const newState = !item.activo;
    const statusText = newState ? "Visible" : "Oculto";
    const statusAction = newState ? "mostrará" : "ocultará";

    askConfirmation(
      `¿Marcar como ${statusText}?`,
      `El contenido "${item.titulo}" se ${statusAction} en la plataforma para todos los usuarios.`,
      async () => {
        try {
          // 1. Actualización en Base de Datos
          const itemRef = doc(db, "content", item.id);
          await updateDoc(itemRef, { activo: newState });

          // 2. Actualización en la UI (Tabla)
          setContent(prev => prev.map(c => c.id === item.id ? { ...c, activo: newState } : c));

          // 3. Feedback de "Realizado"
          showFeedback('update', `Estado cambiado a: ${statusText}`);

        } catch (error) {
          console.error("Error actualizando estado:", error);
          showFeedback('error', "No se pudo cambiar el estado.");
          fetchContent(); // Revertir cambios si falla
        }
      },
      false, // isDangerous = false (Usará botón Azul en lugar de Rojo)
      "Sí, cambiar" // Texto del botón
    );
  };

  // 3. Editar
  const handleEdit = (item) => {
    const ruta = item.tipo === 'serie' ? 'series' : 'peliculas';
    navigate(`/${ruta}/${item.id}`);
  };

  // --- FILTRADO ---
  const filteredContent = content.filter(item => {
    const matchesSearch = item.titulo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.tipo === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-8 font-sans pb-20 pt-20 md:pt-24 px-4 md:px-8 lg:px-16">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Panel de Administración
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Gestiona todo el contenido de tu plataforma
          </p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/peliculas/nuevo')}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-700 transition"
          >
            <Plus className="w-4 h-4 text-emerald-500" /> Película
          </button>
          <button 
            onClick={() => navigate('/series/nuevo')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-blue-900/20 transition"
          >
            <Plus className="w-4 h-4" /> Serie
          </button>
        </div>
      </div>

      {/* FILTROS Y BÚSQUEDA */}
      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Buscador */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Buscar por título..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-blue-500 outline-none text-white placeholder-slate-500 transition"
          />
        </div>

        {/* Botones de Filtro */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          {['all', 'movie', 'serie'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`
                px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition whitespace-nowrap
                ${filterType === type 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" 
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                }
              `}
            >
              {type === 'all' ? 'Todos' : type === 'movie' ? 'Películas' : 'Series'}
            </button>
          ))}
          <button 
            onClick={fetchContent}
            className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition duration-500"
            title="Recargar datos"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TABLA DE CONTENIDO */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 flex justify-center items-center text-slate-500 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" /> Cargando contenido...
          </div>
        ) : filteredContent.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Filter className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No se encontraron resultados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs text-slate-500 uppercase bg-slate-900/50">
                  <th className="p-4 font-bold">Portada</th>
                  <th className="p-4 font-bold">Título</th>
                  <th className="p-4 font-bold text-center">Tipo</th>
                  <th className="p-4 font-bold text-center">Estado</th>
                  <th className="p-4 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredContent.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/50 transition-colors group">
                    
                    {/* 1. Portada */}
                    <td className="p-3 w-20">
                      <div className="w-12 h-16 rounded bg-slate-800 overflow-hidden relative border border-slate-700">
                        <img 
                          src={item.poster || '/default.jpg'} 
                          alt="" 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </td>

                    {/* 2. Información */}
                    <td className="p-3">
                      <h3 className="font-bold text-slate-200 line-clamp-1">{item.titulo}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1 italic">
                        {item.tagline || item.slug}
                      </p>
                    </td>

                    {/* 3. Tipo (Badge) */}
                    <td className="p-3 text-center">
                      <span className={`
                        px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border
                        ${item.tipo === 'serie' 
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }
                      `}>
                        {item.tipo === 'serie' ? 'Serie' : 'Película'}
                      </span>
                    </td>

                    {/* 4. Estado (Visible / Oculto) */}
                    <td className="p-3 text-center">
                      <button 
                        onClick={() => handleToggleActive(item)}
                        className={`
                          p-2 rounded-full transition-all
                          ${item.activo 
                            ? 'text-blue-400 hover:bg-blue-500/10' 
                            : 'text-slate-600 hover:text-slate-400 hover:bg-slate-800'
                          }
                        `}
                        title={item.activo ? "Visible para usuarios" : "Oculto (Borrador)"}
                      >
                        {item.activo ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                    </td>

                    {/* 5. Acciones */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Editar */}
                        <button 
                          onClick={() => handleEdit(item)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
                          title="Editar Ficha"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Eliminar (Con Modal) */}
                        <button 
                          onClick={() => handleDelete(item.id, item.titulo)}
                          className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                          title="Eliminar"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-slate-600 mt-8">
        Mostrando {filteredContent.length} de {content.length} resultados
      </div>

      {/* --- MODAL DE FEEDBACK (ÉXITO/ERROR) --- */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className={`bg-slate-900 border ${MODAL_CONFIG[modalState.type].border} rounded-2xl p-8 flex flex-col items-center justify-center shadow-2xl transform scale-105 transition-all max-w-sm text-center relative`}>
            
            {/* Botón Cerrar (Solo si es error) */}
            {modalState.type === 'error' && (
              <button 
                onClick={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                className="absolute top-3 right-3 text-slate-500 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className={`w-16 h-16 ${MODAL_CONFIG[modalState.type].bg} rounded-full flex items-center justify-center mb-4 ${modalState.type === 'error' ? 'animate-pulse' : 'animate-bounce'}`}>
              {React.createElement(MODAL_CONFIG[modalState.type].icon, {
                 className: `w-8 h-8 ${MODAL_CONFIG[modalState.type].color}`
              })}
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              {MODAL_CONFIG[modalState.type].title}
            </h3>
            <p className="text-slate-400">
              {modalState.message || MODAL_CONFIG[modalState.type].defaultMessage}
            </p>

            {/* Spinner de "Procesando" si es necesario */}
            {modalState.type !== 'error' && (
               <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" /> Procesando...
               </div>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL DE CONFIRMACIÓN (INTERACTIVO) --- */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-yellow-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl transform scale-100 transition-all relative">
            
            <button 
              onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {confirmModal.title}
              </h3>

              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                {confirmModal.message}
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-bold transition border border-slate-700"
                >
                  Cancelar
                </button>

                <button
                  onClick={executeConfirmation}
                  className={`flex-1 px-4 py-2.5 text-white rounded-lg text-sm font-bold transition shadow-lg flex items-center justify-center gap-2 ${
                    confirmModal.isDangerous 
                      ? "bg-red-600 hover:bg-red-500 shadow-red-900/20" 
                      : "bg-blue-600 hover:bg-blue-500 shadow-blue-900/20"
                  }`}
                >
                  {confirmModal.confirmText || "Confirmar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;