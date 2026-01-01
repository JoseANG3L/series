import React, { useState, useEffect } from 'react';
import { Save, Film, Tv, Layers, Trash2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../supabase/client';

const ContentForm = ({ onSuccess, contentToEdit, onCancel }) => {
  const [contentType, setContentType] = useState('movie');
  const [loading, setLoading] = useState(false);

  // Estado inicial limpio
  const initialFormState = {
    title: '',
    overview: '',
    poster_url: '',
    backdrop_url: '',
    trailer_url: '',
    release_date: '',
    rating: 0,
    genres: '',
    qualities: '',
    duration: '',
    director: '',
    seasons_data: [],
    is_premiere: false,
    is_original: false
  };

  const [formData, setFormData] = useState(initialFormState);

  // --- EFECTO: DETECTAR SI VAMOS A EDITAR ---
  useEffect(() => {
    if (contentToEdit) {
      // Si recibimos un contenido para editar, rellenamos el formulario
      setContentType(contentToEdit.content_type);
      
      setFormData({
        title: contentToEdit.title || '',
        overview: contentToEdit.overview || '',
        poster_url: contentToEdit.poster_url || '',
        backdrop_url: contentToEdit.backdrop_url || '',
        trailer_url: contentToEdit.trailer_url || '',
        release_date: contentToEdit.release_date || '',
        rating: contentToEdit.rating || 0,
        
        // Convertimos Arrays a String para el input (Acción, Drama)
        genres: contentToEdit.genres ? contentToEdit.genres.join(', ') : '',
        qualities: contentToEdit.qualities ? contentToEdit.qualities.join(', ') : '',
        
        duration: contentToEdit.duration || '',
        director: contentToEdit.director || '',
        seasons_data: contentToEdit.seasons_data || [],
        
        is_premiere: contentToEdit.is_premiere || false,
        is_original: contentToEdit.is_original || false
      });
    } else {
      // Si no hay nada para editar, limpiamos (Modo Crear)
      setFormData(initialFormState);
      setContentType('movie');
    }
  }, [contentToEdit]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // --- SERIES LOGIC ---
  const addSeason = () => {
    const newSeasonNum = formData.seasons_data.length + 1;
    setFormData({
      ...formData,
      seasons_data: [
        ...formData.seasons_data, 
        { numero: newSeasonNum, titulo: `Temporada ${newSeasonNum}`, episodios: [] }
      ]
    });
  };

  const removeSeason = (index) => {
    const updated = formData.seasons_data.filter((_, i) => i !== index);
    setFormData({ ...formData, seasons_data: updated });
  };

  // --- SUBMIT (CREAR O EDITAR) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        title: formData.title,
        overview: formData.overview,
        poster_url: formData.poster_url,
        backdrop_url: formData.backdrop_url,
        trailer_url: formData.trailer_url,
        release_date: formData.release_date || null,
        rating: formData.rating,
        content_type: contentType,
        // Convertimos string a array y filtramos espacios vacíos
        genres: formData.genres.split(',').map(item => item.trim()).filter(i => i), 
        qualities: formData.qualities.split(',').map(item => item.trim()).filter(i => i),
        director: formData.director,
        is_premiere: formData.is_premiere,
        is_original: formData.is_original,
      };

      if (contentType === 'movie') {
        dataToSend.duration = formData.duration;
        dataToSend.seasons_data = []; // Limpiamos temporadas si cambia a peli
      } else {
        dataToSend.seasons_data = formData.seasons_data; 
        dataToSend.duration = null;
      }

      let error;
      
      if (contentToEdit) {
        // --- MODO UPDATE ---
        const response = await supabase
          .from('content')
          .update(dataToSend)
          .eq('id', contentToEdit.id);
        error = response.error;
      } else {
        // --- MODO INSERT ---
        const response = await supabase
          .from('content')
          .insert([dataToSend]);
        error = response.error;
      }

      if (error) throw error;

      alert(contentToEdit ? "¡Editado correctamente!" : "¡Creado correctamente!");
      
      if (onSuccess) onSuccess(); // Recargar tabla del padre
      if (onCancel) onCancel();   // Salir modo edición
      
      // Solo limpiar si estábamos creando, si editamos lo dejamos (o lo limpia el padre al cancelar)
      if (!contentToEdit) setFormData(initialFormState);

    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 rounded-2xl border shadow-xl w-full mx-auto transition-colors duration-300 
      ${contentToEdit ? 'bg-slate-900 border-yellow-600/50 shadow-yellow-900/20' : 'bg-slate-900 border-slate-800'}`}
    >
      
      <div className="flex justify-between items-start mb-6">
          {/* TÍTULO DINÁMICO */}
          <h2 className={`text-xl font-bold flex items-center gap-2 ${contentToEdit ? 'text-yellow-500' : 'text-white'}`}>
            {contentToEdit ? '✏️ Editando Contenido' : '✨ Nuevo Contenido'}
          </h2>

          {/* Selector de Tipo (Deshabilitado si editamos para no romper datos) */}
          <div className="flex bg-slate-950 p-1 rounded-full border border-slate-800">
            <button 
              type="button"
              onClick={() => !contentToEdit && setContentType('movie')}
              disabled={!!contentToEdit}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition ${contentType === 'movie' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'} ${contentToEdit && 'opacity-50 cursor-not-allowed'}`}
            >
              <Film className="w-4 h-4" /> Película
            </button>
            <button 
              type="button"
              onClick={() => !contentToEdit && setContentType('series')}
              disabled={!!contentToEdit}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition ${contentType === 'series' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'} ${contentToEdit && 'opacity-50 cursor-not-allowed'}`}
            >
              <Tv className="w-4 h-4" /> Serie
            </button>
          </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* --- DATOS PRINCIPALES --- */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="label-admin">Título</label>
            <input name="title" value={formData.title} onChange={handleChange} className="input-admin" placeholder="Ej: Matrix" required />
          </div>
          <div>
             <label className="label-admin">{contentType === 'movie' ? 'Director' : 'Creador'}</label>
             <input name="director" value={formData.director} onChange={handleChange} className="input-admin" placeholder="Ej: Hermanas Wachowski" />
          </div>
        </div>

        {/* --- URLS CON PREVISUALIZACIÓN --- */}
        <div className="grid md:grid-cols-2 gap-6">
           {/* POSTER */}
           <div>
            <label className="label-admin">Poster URL (Vertical)</label>
            <div className="flex gap-4">
                <div className="flex-1">
                    <input name="poster_url" value={formData.poster_url} onChange={handleChange} className="input-admin" placeholder="https://..." required />
                    <p className="text-[10px] text-slate-500 mt-1">Formato 2:3 recomendado</p>
                </div>
                {/* PREVIEW POSTER */}
                <div className="w-16 h-24 bg-slate-950 rounded border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                    {formData.poster_url ? (
                        <img src={formData.poster_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                    ) : (
                        <ImageIcon className="w-6 h-6 text-slate-700" />
                    )}
                </div>
            </div>
           </div>

           {/* BACKDROP */}
           <div>
            <label className="label-admin">Backdrop URL (Horizontal)</label>
            <div className="flex gap-4">
                <div className="flex-1">
                    <input name="backdrop_url" value={formData.backdrop_url} onChange={handleChange} className="input-admin" placeholder="https://..." />
                    <p className="text-[10px] text-slate-500 mt-1">Formato 16:9 recomendado</p>
                </div>
                {/* PREVIEW BACKDROP */}
                <div className="w-32 h-20 bg-slate-950 rounded border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                    {formData.backdrop_url ? (
                        <img src={formData.backdrop_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                    ) : (
                        <ImageIcon className="w-6 h-6 text-slate-700" />
                    )}
                </div>
            </div>
           </div>
        </div>

        {/* --- DETALLES --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div>
            <label className="label-admin">Rating (0-10)</label>
            <input type="number" name="rating" step="0.1" value={formData.rating} onChange={handleChange} className="input-admin" />
           </div>
           <div>
            <label className="label-admin">Año / Fecha</label>
            <input type="date" name="release_date" value={formData.release_date} onChange={handleChange} className="input-admin" />
           </div>
           
           {contentType === 'movie' && (
             <div className="col-span-2">
              <label className="label-admin">Duración</label>
              <input name="duration" value={formData.duration} onChange={handleChange} className="input-admin" placeholder="Ej: 2h 15m" />
             </div>
           )}

           <div className="col-span-2">
            <label className="label-admin">Trailer URL</label>
            <input name="trailer_url" value={formData.trailer_url} onChange={handleChange} className="input-admin" placeholder="https://youtube..." />
           </div>
        </div>

        {/* --- ARRAYS --- */}
        <div className="grid md:grid-cols-2 gap-6">
            <div>
                <label className="label-admin">Géneros (Separar por comas)</label>
                <input name="genres" value={formData.genres} onChange={handleChange} className="input-admin" placeholder="Acción, Ciencia Ficción" />
            </div>
            <div>
                <label className="label-admin">Calidades (Separar por comas)</label>
                <input name="qualities" value={formData.qualities} onChange={handleChange} className="input-admin" placeholder="HD, 4K" />
            </div>
        </div>

        <div className="w-full">
            <label className="label-admin">Sinopsis</label>
            <textarea name="overview" value={formData.overview} onChange={handleChange} rows="3" className="input-admin" placeholder="De qué trata..." />
        </div>

        {/* --- SEASONS (SOLO SERIES) --- */}
        {contentType === 'series' && (
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-bold flex items-center gap-2"><Layers className="w-4 h-4" /> Temporadas</h3>
                    <button type="button" onClick={addSeason} className="text-xs bg-blue-600 px-3 py-1 rounded text-white hover:bg-blue-500 transition">+ Agregar</button>
                </div>
                <div className="space-y-2">
                    {formData.seasons_data.map((season, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-900 p-3 rounded border border-slate-800">
                            <span className="text-sm text-white font-medium">Temporada {season.numero}</span>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-500">{season.episodios.length} Caps</span>
                                <button type="button" onClick={() => removeSeason(idx)} className="text-red-500 hover:text-white"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                    {formData.seasons_data.length === 0 && <p className="text-xs text-slate-500 text-center">Sin temporadas.</p>}
                </div>
            </div>
        )}

        {/* --- CHECKBOXES --- */}
        <div className="flex gap-6 p-4 bg-slate-950/50 rounded-lg border border-slate-800">
            <label className="flex items-center gap-2 text-white text-sm cursor-pointer select-none">
                <input type="checkbox" name="is_premiere" checked={formData.is_premiere} onChange={handleChange} className="rounded bg-slate-700 border-slate-600 text-red-600 focus:ring-0" />
                Es Estreno
            </label>
            <label className="flex items-center gap-2 text-white text-sm cursor-pointer select-none">
                <input type="checkbox" name="is_original" checked={formData.is_original} onChange={handleChange} className="rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-0" />
                Es Original
            </label>
        </div>

        {/* --- BOTONES ACCIÓN --- */}
        <div className="flex gap-3">
            {contentToEdit && (
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="px-6 py-4 rounded-xl font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition"
                >
                    Cancelar
                </button>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className={`flex-1 py-4 rounded-xl font-bold text-white flex justify-center items-center gap-2 transition shadow-xl
                ${contentType === 'movie' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
                <Save className="w-5 h-5" />
                {loading ? 'Guardando...' : (contentToEdit ? 'Actualizar Cambios' : 'Guardar Contenido')}
            </button>
        </div>

      </form>
      
      <style>{`
        .label-admin { display: block; font-size: 0.70rem; font-weight: 700; color: #94a3b8; margin-bottom: 0.35rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .input-admin { width: 100%; background-color: #020617; border: 1px solid #1e293b; border-radius: 0.5rem; padding: 0.75rem; color: white; font-size: 0.875rem; outline: none; transition: all 0.2s; }
        .input-admin:focus { border-color: ${contentType === 'movie' ? '#dc2626' : '#2563eb'}; ring: 1px; }
      `}</style>
    </div>
  );
};

export default ContentForm;