import React from 'react';
// 1. Importamos los iconos de Lucide React
import { Search, Play, Bookmark, Facebook, Twitter, Instagram, Heart, Mail } from 'lucide-react';
import MovieCard from "../components/MovieCard";
import MovieSection from "../components/MovieSection";
import useDragScroll from "../hooks/useDragScroll";
import Hero from "../components/Hero";
import { PELICULAS } from '../data/movies';
import AdSenseBanner from '../components/AdSenseBanner';

function Inicio() {
  return (
    <div className="min-h-screen bg-[#0f172a] font-sans selection:bg-red-500 selection:text-white">
      <Hero />
      {/* <BrandRow /> */}
      <br />
      {/* --- ANUNCIO 1 --- */}
      <AdSenseBanner slot="1234567890" />
      <MovieSection title="Más Reciente" movies={PELICULAS} layout="carousel" />
      <MovieSection title="En Tendencia" movies={PELICULAS} layout="carousel" />
      <MovieSection title="Series 2000s" movies={PELICULAS} layout="carousel" />
      <MovieSection title="Series 90s" movies={PELICULAS} layout="carousel" />
    </div>
  );
}

export default Inicio;