import { Play } from "lucide-react";

const MovieCard = ({ movie, variant = "grid" }) => {
  return (
    <div
      className={`
        relative cursor-pointer group
        ${variant === "carousel" ? "min-w-[220px]" : "w-full"}
      `}
    >
      {/* Contenedor */}
      <div className="relative overflow-hidden rounded-2xl aspect-[2/3]">
        {/* Imagen */}
        <img
          src={movie.image}
          alt={movie.title}
          className="
            w-full h-full object-cover
            transition-transform duration-500
            group-hover:scale-105
          "
        />

        {/* Overlay */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-t from-black/95 via-black/30 to-transparent
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300
            flex flex-col justify-end p-4
          "
        >
          {/* Botón */}
          <button
            className="
              bg-red-600 text-white
              p-3 rounded-full w-fit mb-3
              shadow-xl shadow-red-900/40
              hover:bg-red-500 transition
            "
          >
            <Play className="w-4 h-4 fill-current" />
          </button>

          {/* Texto */}
          <p className="text-white text-sm font-semibold tracking-wide">
            Ver ahora
          </p>
        </div>

        {/* Glow inferior */}
        <div
          className="
            pointer-events-none absolute inset-x-0 bottom-0 h-20
            bg-red-500/0 group-hover:bg-red-500/10
            blur-2xl transition
          "
        />
      </div>

      {/* Título */}
      <h4
        className="
          mt-3 text-sm font-medium text-white truncate
          group-hover:text-red-500 transition
        "
      >
        {movie.title}
      </h4>
    </div>
  );
};

export default MovieCard;
