import React, { useState } from "react";
import useSWR from 'swr'; // <--- 1. Importamos SWR
import { Trash2, Edit, LayoutGrid, Film, Tv, Search, Filter, Calendar, Loader2 } from "lucide-react";
import ContentForm from "../components/ContentForm";
import { supabase } from "../supabase/client";

// --- FETCHER FUNCTION ---
// Definimos la función que SWR usará para pedir los datos
const fetchContent = async () => {
    const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

const AdminPanel = () => {
    // --- ESTADOS LOCALES (UI) ---
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterYear, setFilterYear] = useState("");

    // --- ESTADO REMOTO (SWR) ---
    // 'admin-content': Clave única para la caché de esta tabla
    // mutate: Es la función mágica para recargar los datos cuando hagamos cambios
    const { data: contentList, error, isLoading, mutate } = useSWR('admin-content', fetchContent);

    // --- FILTROS ---
    // Usamos (contentList || []) para evitar errores mientras carga (data es undefined al inicio)
    const filteredContent = (contentList || []).filter((item) => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "all" || item.content_type === filterType;
        const releaseYear = item.release_date ? new Date(item.release_date).getFullYear().toString() : "";
        const matchesYear = filterYear === "" || releaseYear.includes(filterYear);
        return matchesSearch && matchesType && matchesYear;
    });

    // --- ACCIONES ---
    const handleEditClick = (item) => {
        setEditingItem(item);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
    };

    const handleSuccess = () => {
        mutate(); // <--- 2. RECARGA AUTOMÁTICA: Le dice a SWR "los datos cambiaron, pídelos de nuevo"
        setEditingItem(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que quieres eliminar este contenido permanentemente?")) {
            const { error } = await supabase.from('content').delete().eq('id', id);
            
            if (error) {
                alert("Error: " + error.message);
            } else {
                mutate(); // <--- 3. RECARGA AUTOMÁTICA tras borrar
            }
        }
    };

    // --- RENDERIZADO ---
    return (
        <div className="min-h-screen bg-[#0f172a] pt-24 pb-12 px-4 md:px-8 lg:px-16 text-white">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* SECCIÓN 1: FORMULARIO */}
                <div className="space-y-4">
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-white/90">
                        <LayoutGrid className="w-6 h-6 text-red-500" />
                        Gestor de Contenido
                    </h1>

                    <ContentForm
                        onSuccess={handleSuccess}
                        contentToEdit={editingItem}
                        onCancel={handleCancelEdit}
                    />
                </div>

                <hr className="border-slate-800" />

                {/* SECCIÓN 2: INVENTARIO */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">

                    {/* BARRA HERRAMIENTAS */}
                    <div className="p-6 border-b border-slate-800 flex flex-col lg:flex-row justify-between items-center gap-4 bg-slate-900/50">
                        <h2 className="text-xl font-bold flex items-center gap-2 whitespace-nowrap">
                            Inventario 
                            {/* Mostramos contador solo si ya cargó */}
                            {!isLoading && (
                                <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full text-slate-300">
                                    {filteredContent.length}
                                </span>
                            )}
                        </h2>
                        
                        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-lg pl-9 pr-4 py-2.5 focus:border-blue-500 outline-none" />
                            </div>
                            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="bg-slate-950 border border-slate-700 text-slate-300 text-sm rounded-lg px-4 py-2.5 outline-none">
                                <option value="all">Todo</option>
                                <option value="movie">Películas</option>
                                <option value="series">Series</option>
                            </select>
                        </div>
                    </div>

                    {/* TABLA CON ESTADOS DE CARGA */}
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                        
                        {/* Estado Loading */}
                        {isLoading && (
                            <div className="p-10 flex flex-col items-center justify-center text-slate-500">
                                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                <p>Cargando inventario...</p>
                            </div>
                        )}

                        {/* Estado Error */}
                        {error && (
                            <div className="p-10 text-center text-red-400">
                                Error al cargar los datos. Intenta recargar la página.
                            </div>
                        )}

                        {/* Tabla de Datos */}
                        {!isLoading && !error && (
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-slate-950 text-slate-200 uppercase font-bold text-xs sticky top-0 z-10 shadow-lg">
                                    <tr>
                                        <th className="p-4">Portada</th>
                                        <th className="p-4">Título</th>
                                        <th className="p-4">Tipo</th>
                                        <th className="p-4 text-center">Año</th>
                                        <th className="p-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {filteredContent.length > 0 ? (
                                        filteredContent.map((item) => (
                                            <tr key={item.id} className={`hover:bg-slate-800/50 transition group ${editingItem?.id === item.id ? 'bg-yellow-900/10 border-l-2 border-yellow-500' : ''}`}>
                                                <td className="p-4">
                                                    <img src={item.poster_url || "https://via.placeholder.com/50x75"} alt={item.title} className="w-10 h-14 object-cover rounded bg-slate-800 border border-slate-700" />
                                                </td>
                                                <td className="p-4 font-medium text-white max-w-[200px] truncate">{item.title}</td>
                                                <td className="p-4">
                                                    {item.content_type === 'movie' ? <span className="text-emerald-400 flex items-center gap-1"><Film className="w-3 h-3" /> Película</span> : <span className="text-purple-400 flex items-center gap-1"><Tv className="w-3 h-3" /> Serie</span>}
                                                </td>
                                                <td className="p-4 text-center">{item.release_date ? new Date(item.release_date).getFullYear() : '-'}</td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEditClick(item)}
                                                            className="p-2 bg-blue-500/10 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition"
                                                            title="Editar"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="p-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500 hover:text-white transition"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-slate-500">
                                                No hay resultados para tu búsqueda.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;