import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Film, Clapperboard } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-[#0f172a] overflow-hidden">
      
      {/* --- FONDO AMBIENTAL --- */}
      {/* Usamos una imagen de ruido o espacio para dar sensación de vacío */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')" }} // Imagen de cine/proyector
      ></div>
      
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0f172a]/90 to-black"></div>

      {/* --- CONTENIDO --- */}
      <div className="relative z-10 text-center px-4 animate-fade-in-up">
        
        {/* Icono animado */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Clapperboard className="w-24 h-24 text-gray-700 absolute top-0 left-0 animate-ping opacity-20" />
            <Clapperboard className="w-24 h-24 text-red-600 relative z-10" />
          </div>
        </div>

        {/* NÚMERO 404 GIGANTE */}
        <h1 className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-700 to-gray-900 drop-shadow-2xl select-none leading-none">
          404
        </h1>

        {/* Mensaje Principal */}
        <h2 className="text-3xl md:text-5xl font-bold text-white mt-[-20px] md:mt-[-40px] mb-6 drop-shadow-lg">
          Corte. <span className="text-red-500">Escena no encontrada.</span>
        </h2>

        {/* Subtítulo divertido */}
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Parece que te has salido del guion. Esta página fue eliminada en la sala de edición o nunca existió en este universo.
        </p>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/" 
            className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition shadow-lg shadow-red-900/40 transform hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Volver al Inicio
          </Link>
          
          <Link 
            to="/peliculas" 
            className="flex items-center gap-2 px-8 py-3 bg-transparent border border-gray-600 text-gray-300 rounded-full font-bold hover:bg-white/10 hover:border-white hover:text-white transition"
          >
            <Film className="w-5 h-5" />
            Explorar Películas
          </Link>
        </div>

      </div>

      {/* Decoración de fondo (Círculos borrosos para dar ambiente) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

    </div>
  );
};

export default NotFound;