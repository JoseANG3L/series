import { supabase } from '../supabase/client';

// --- HELPER: TIMEOUT DE SEGURIDAD ---
// Si la petición tarda más de 10 segundos (10000ms), la cancelamos.
// Esto evita que la app se quede en "Cargando..." infinito si se perdió la conexión.
const fetchWithTimeout = async (promise, ms = 10000) => {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("Tiempo de espera agotado (Timeout)")), ms);
  });

  try {
    // Competencia: ¿Quién termina primero? ¿Supabase o el Temporizador?
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timer); // Si Supabase ganó, cancelamos el temporizador
    return result;
  } catch (error) {
    clearTimeout(timer); // Limpiamos siempre
    throw error;
  }
};

// --- FUNCIÓN AUXILIAR PARA MAPEAR DATOS ---
const mapDatabaseToModel = (dbItem) => ({
  id: dbItem.id,
  titulo: dbItem.title,
  poster: dbItem.poster_url,   
  backdrop: dbItem.backdrop_url,
  anio: dbItem.release_date ? new Date(dbItem.release_date).getFullYear() : 'N/A', 
  director: dbItem.director, 
  rating: dbItem.rating,
  genero: dbItem.genres || [],
  type: dbItem.is_premiere ? 'new' : (dbItem.qualities?.includes('4K') ? '4k' : 'hd'),
  sinopsis: dbItem.overview,
  tagline: dbItem.tagline,
  trailer: dbItem.trailer_url,
  
  // Específicos de Series
  temporadas: dbItem.seasons_data || [], 
  
  // Otros
  elenco: dbItem.cast_members || [],
  galeria: dbItem.gallery_urls || [],
  categoria: dbItem.categories || [],
  
  // Flags originales
  is_original: dbItem.is_original,
  is_premiere: dbItem.is_premiere,
  calidades: dbItem.qualities || []
});

// 1. OBTENER TODAS LAS PELÍCULAS
export const getMovies = async () => {
  try {
    const { data, error } = await fetchWithTimeout(
      supabase
        .from('content')
        .select('*')
        .eq('content_type', 'movie')
        .order('created_at', { ascending: false })
    );

    if (error) throw error;
    return data.map(mapDatabaseToModel);

  } catch (error) {
    console.error("Error cargando películas:", error);
    return []; // Retornamos vacío para quitar el spinner
  }
};

// 2. OBTENER TODAS LAS SERIES
export const getSeries = async () => {
  try {
    const { data, error } = await fetchWithTimeout(
      supabase
        .from('content')
        .select('*')
        .eq('content_type', 'series')
        .order('created_at', { ascending: false })
    );

    if (error) throw error;
    return data.map(mapDatabaseToModel);

  } catch (error) {
    console.error("Error cargando series:", error);
    return [];
  }
};

// 3. OBTENER NOVEDADES
export const getNovedades = async () => {
  try {
    const { data, error } = await fetchWithTimeout(
      supabase
        .from('content')
        .select('*')
        .eq('is_premiere', true)
        .limit(10)
    );

    if (error) throw error;
    return data.map(mapDatabaseToModel);

  } catch (error) {
    console.error("Error cargando novedades:", error);
    return [];
  }
};

// 4. OBTENER DETALLE POR ID
export const getContentById = async (id) => {
  try {
    const { data, error } = await fetchWithTimeout(
      supabase
        .from('content')
        .select('*')
        .eq('id', id)
        .single()
    );

    if (error) throw error;
    return mapDatabaseToModel(data);

  } catch (error) {
    console.error("Error cargando detalle:", error);
    return null;
  }
};