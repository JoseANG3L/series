import React from 'react';

// --- DATOS DE EJEMPLO ---
const MOVIES = [
  { title: "Dune: Part Two", image: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg" },
  { title: "Oppenheimer", image: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykIGj7ei855eZ.jpg" },
  { title: "Avatar: Way of Water", image: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg" },
  { title: "The Batman", image: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg" },
  { title: "Interstellar", image: "https://image.tmdb.org/t/p/w500/gEU2QniL6C8zt655DRipq6bptJU.jpg" },
  { title: "Guardians Vol. 3", image: "https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg" },
];

const BRANDS = ["Disney", "Netflix", "HBOmax", "Pixar", "Marvel", "StarWars", "NatGeo"];

// --- COMPONENTES ---

const Navbar = () => (
  <nav className="absolute top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
    <div className="flex items-center gap-12">
      <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 tracking-tighter">
        CINEWAVE
      </h1>
      <ul className="hidden md:flex gap-8 text-gray-300 font-medium text-sm">
        <li className="text-white cursor-pointer hover:text-red-500 transition">Home</li>
        <li className="cursor-pointer hover:text-white transition">Discover</li>
        <li className="cursor-pointer hover:text-white transition">Movie Release</li>
        <li className="cursor-pointer hover:text-white transition">Forum</li>
      </ul>
    </div>
    
    <div className="flex items-center gap-6">
      <button className="text-white hover:text-red-500">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </button>
      <button className="hidden md:block px-5 py-2 border border-gray-500 text-white rounded-full text-sm font-semibold hover:border-white transition">Sign up</button>
      <button className="px-5 py-2 bg-green-600 text-white rounded-full text-sm font-semibold hover:bg-green-500 shadow-lg shadow-green-900/50 transition">Login</button>
    </div>
  </nav>
);

const Hero = () => (
  <header className="relative w-full h-screen overflow-hidden">
    {/* Imagen de Fondo */}
    <div 
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: "url('https://wallpapers.com/images/featured/personajes-de-star-wars-rzma8krur1w1m4rn.jpg')" }} // Star Wars Backdrop
    >
      {/* Degradados para oscurecer y fusionar */}
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
        Star Wars: <br/> The Force Awakens
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
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
          Watch Trailer
        </button>
        <button className="flex items-center gap-2 px-8 py-3 border border-gray-600 bg-black/30 backdrop-blur-md text-white rounded-full font-bold hover:bg-white hover:text-black transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
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
           {/* Simulando Logos con texto */}
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
    <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x">
      {MOVIES.map((movie, index) => (
        <div key={index} className="min-w-[180px] md:min-w-[220px] cursor-pointer group snap-start">
          <div className="relative overflow-hidden rounded-xl h-[320px]">
            <img 
              src={movie.image} 
              alt={movie.title} 
              className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <button className="bg-red-600 text-white p-3 rounded-full w-fit mb-2 shadow-lg">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
              </button>
              <p className="text-white text-sm font-semibold">Ver ahora</p>
            </div>
          </div>
          <h4 className="text-white mt-3 font-medium truncate group-hover:text-red-500 transition">{movie.title}</h4>
        </div>
      ))}
    </div>
  </section>
);

function App() {
  return (
    <div className="min-h-screen bg-[#0f172a] font-sans selection:bg-red-500 selection:text-white">
      <Navbar />
      <Hero />
      <BrandRow />
      <MovieSection title="Just Release" />
      <MovieSection title="Trending Now" />
    </div>
  );
}

export default App;