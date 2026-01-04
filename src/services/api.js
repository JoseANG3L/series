import { act } from 'react';
import { db } from '../firebase/client';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit 
} from "firebase/firestore";

// --- HELPER: TIMEOUT (Seguridad) ---
const fetchWithTimeout = async (promise, ms = 10000) => {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("Timeout: La petición tardó demasiado")), ms);
  });
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timer);
    return result;
  } catch (error) {
    clearTimeout(timer);
    throw error;
  }
};

// --- MAPPING (EL CORAZÓN DEL CAMBIO) ---
// Transforma tu NUEVA estructura de Firebase a lo que React necesita
const mapDatabaseToModel = (dbItem) => {
  const info = dbItem.informacion || {}; // Protegemos si viene vacío

  return {
    // 1. Campos Directos (Tu nueva lista)
    id: dbItem.id,
    titulo: dbItem.titulo,
    tipo: dbItem.tipo, // 'movie' o 'serie'
    slug: dbItem.slug,
    sinopsis: dbItem.sinopsis,
    tagline: dbItem.tagline,
    poster: dbItem.poster,
    backdrop: dbItem.backdrop,
    trailer: dbItem.trailer,
    preview: dbItem.preview,
    temporadas: dbItem.temporadas || [],
    peliculas: dbItem.peliculas || [],
    resenas: dbItem.resenas || [],
    galeria: dbItem.galeria || [],
    creado: dbItem.creado || null,
    actualizado: dbItem.actualizado || null,
    activo: dbItem.activo !== undefined ? dbItem.activo : true,

    // 2. Campos desde 'informacion' (Tu nuevo subobjeto)
    peso: info.peso,
    formato: info.formato,
    calidad: info.calidad,
    codec: info.codec,
    bitrate: info.bitrate,
    audio: info.audio,
    resolucion: info.resolucion,
    subtitulos: info.subtitulos,
    duracion: info.duracion,
    temporadassize: dbItem.temporadas ? dbItem.temporadas.length : 0,
    episodios: info.episodios,
    aporte: info.aporte,
    nota: info.nota,
  };
};

// --- HELPER PARA LIMPIAR SNAPSHOTS ---
const parseSnapshot = (snapshot) => {
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// ==========================================
//          FUNCIONES DE LA API
// ==========================================

// 1. OBTENER PELÍCULAS
export const getMovies = async () => {
  try {
    const contentRef = collection(db, 'content');
    const q = query(
      contentRef, 
      where('tipo', '==', 'movie'), // Usamos tu campo 'tipo'
      orderBy('creado', 'desc')     // Usamos tu campo 'creado'
    );

    const snapshot = await fetchWithTimeout(getDocs(q));
    return parseSnapshot(snapshot).map(mapDatabaseToModel);
  } catch (error) {
    console.error("Error en getMovies:", error);
    return []; 
  }
};

// 2. OBTENER SERIES
export const getSeries = async () => {
  try {
    const contentRef = collection(db, 'content');
    const q = query(
      contentRef, 
      where('tipo', '==', 'serie'),
      orderBy('creado', 'desc')
    );

    const snapshot = await fetchWithTimeout(getDocs(q));
    return parseSnapshot(snapshot).map(mapDatabaseToModel);
  } catch (error) {
    console.error("Error en getSeries:", error);
    return [];
  }
};

// 3. OBTENER NOVEDADES
// Como ya no tienes 'is_premiere' en la raíz, traemos los últimos 10 creados
export const getNovedades = async () => {
  try {
    const contentRef = collection(db, 'content');
    const q = query(
      contentRef, 
      orderBy('creado', 'desc'),
      limit(10)
    );

    const snapshot = await fetchWithTimeout(getDocs(q));
    return parseSnapshot(snapshot).map(mapDatabaseToModel);
  } catch (error) {
    console.error("Error en getNovedades:", error);
    return [];
  }
};

// 4. OBTENER POR ID
export const getContentById = async (id) => {
  try {
    const docRef = doc(db, 'content', id);
    const docSnap = await fetchWithTimeout(getDoc(docRef));

    if (docSnap.exists()) {
      return mapDatabaseToModel({ id: docSnap.id, ...docSnap.data() });
    }
    return null;
  } catch (error) {
    console.error("Error en getContentById:", error);
    return null;
  }
};