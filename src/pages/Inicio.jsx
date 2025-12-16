import React from 'react';
// 1. Importamos los iconos de Lucide React
import { Search, Play, Bookmark, Facebook, Twitter, Instagram, Heart, Mail } from 'lucide-react';
import MovieCard from "../components/MovieCard";
import useDragScroll from "../hooks/useDragScroll";

// --- DATOS DE EJEMPLO ---
const MOVIES = [
  {
    id: 1,
    titulo: "Inception",
    poster: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
    anio: 2010,
  },
  {
    id: 2,
    titulo: "Interstellar Interstellar Interstellar Interstellar",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    anio: 2014,
  },
  {
    id: 3,
    titulo: "The Dark Knight",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    anio: 2008,
  },
  {
    id: 4,
    titulo: "Avatar",
    poster: "https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
    anio: 2009,
  },
  {
    id: 5,
    titulo: "Avengers: Endgame",
    poster: "https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg",
    anio: 2019,
  },
  {
    id: 6,
    titulo: "Dune",
    poster: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    anio: 2021,
  },
  {
    id: 7,
    titulo: "Oppenheimer",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykIGj7ei855eZ.jpg",
    anio: 2023,
  },
  {
    id: 8,
    titulo: "The Matrix",
    poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    anio: 1999,
  },
  {
    id: 9,
    titulo: "Gladiator",
    poster: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
    anio: 2000,
  },
  {
    id: 10,
    titulo: "Titanic",
    poster: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    anio: 1997,
  },
  {
    id: 11,
    titulo: "Joker",
    poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    anio: 2019,
  },
  {
    id: 12,
    titulo: "Fight Club",
    poster: "https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg",
    anio: 1999,
  },
  {
    id: 13,
    titulo: "Forrest Gump",
    poster: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    anio: 1994,
  },
  {
    id: 14,
    titulo: "The Lord of the Rings",
    poster: "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
    anio: 2001,
  },
  {
    id: 15,
    titulo: "Star Wars: A New Hope",
    poster: "https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
    anio: 1977,
  },
  {
    id: 16,
    titulo: "Spider-Man: No Way Home",
    poster: "https://image.tmdb.org/t/p/w500/uJYYizSuA9Y3DCs0qS4qWvHfZg4.jpg",
    anio: 2021,
  },
  {
    id: 17,
    titulo: "Doctor Strange",
    poster: "https://image.tmdb.org/t/p/w500/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg",
    anio: 2016,
  },
  {
    id: 18,
    titulo: "Black Panther",
    poster: "https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg",
    anio: 2018,
  },
  {
    id: 19,
    titulo: "Toy Story",
    poster: "https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
    anio: 1995,
  },
  {
    id: 20,
    titulo: "Jurassic Park",
    poster: "https://image.tmdb.org/t/p/w500/c414cDeQ9b6qLPLeKmiJuLDUREJ.jpg",
    anio: 1993,
  },
];

const BRANDS = ["Disney", "Netflix", "HBOmax", "Pixar", "Marvel", "StarWars", "NatGeo"];

// --- COMPONENTES ---

const Hero = () => (
  <header className="relative w-full h-screen overflow-hidden">
    {/* Imagen de Fondo */}
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: "url('https://wallpapers.com/images/featured/personajes-de-star-wars-rzma8krur1w1m4rn.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/40 to-transparent"></div>
    </div>

    {/* Contenido Hero */}
    <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-16 max-w-3xl space-y-6 pt-20">
      <span className="bg-slate-800/80 w-fit px-3 py-1 rounded text-xs font-bold text-gray-300 uppercase tracking-widest backdrop-blur-sm">
        Movie
      </span>

      <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight">
        Star Wars: <br /> The Force Awakens
      </h2>

      <div className="flex items-center gap-4 text-gray-300 text-sm font-medium">
        <span>2h 40m</span> • <span>2022</span> • <span>Fantasy</span> • <span>Actions</span>
      </div>

      <p className="text-gray-400 text-base md:text-lg leading-relaxed line-clamp-3">
        Thirty years after the defeat of the Galactic Empire, the galaxy faces a new threat from the evil Kylo Ren and the First Order.
        A defector named Finn crashes on a desert planet and meets Rey, a scavenger.
      </p>

      <div className="flex gap-4 pt-4">
        <button className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-full font-bold hover:bg-green-500 transition shadow-lg shadow-green-900/50">
          <Play className="w-5 h-5 fill-current" />
          Watch Trailer
        </button>
        <button className="flex items-center gap-2 px-8 py-3 border border-gray-600 bg-black/30 backdrop-blur-md text-white rounded-full font-bold hover:bg-white hover:text-black transition">
          <Bookmark className="w-5 h-5" />
          Add Watchlist
        </button>
      </div>
    </div>
  </header>
);

const BrandRow = () => (
  <div className="px-8 md:px-16 pb-12">
    <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
      {BRANDS.map((brand, idx) => (
        <div key={idx} className="bg-slate-800/50 px-6 py-3 rounded-lg border border-slate-700/50">
          <span className="text-xl font-bold text-white tracking-widest">{brand}</span>
        </div>
      ))}
    </div>
  </div>
);

const MovieSection = ({ title }) => (
  <section className="px-8 md:px-16 pb-20">
    <h3 className="text-2xl font-bold text-white mb-6 border-l-4 border-red-500 pl-4">
      {title}
    </h3>
    <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x scrollbar-red">
      {MOVIES.map((movie) => (
        <MovieCard key={movie.id} movie={{
          title: movie.titulo,
          image: movie.poster
        }} variant="carousel" />
      ))}
    </div>
  </section>
);

function Inicio() {
  return (
    <div className="min-h-screen bg-[#0f172a] font-sans selection:bg-red-500 selection:text-white">
      <Hero />
      <BrandRow />
      <MovieSection title="Just Release" />
      <MovieSection title="Trending Now" />
    </div>
  );
}

export default Inicio;