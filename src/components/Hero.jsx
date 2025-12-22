import { Play, Bookmark } from "lucide-react";

const Hero = () => {
  return (
    <header className="relative w-full h-screen">
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
      <div className="relative z-10 flex flex-col justify-end align-items-bottom min-h-screen max-h-fit px-8 md:px-16 max-w-3xl space-y-6 pt-24 pb-16">
        <span className="bg-slate-800/80 w-fit px-3 py-1 rounded text-xs font-bold text-gray-300 uppercase tracking-widest backdrop-blur-sm">
          Serie
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

        <div className="flex gap-4 pt-3">
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
};

export default Hero;