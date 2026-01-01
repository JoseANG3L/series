import { Sparkles, Crown, Monitor, Tv, Flame } from "lucide-react";

const Badge = ({ type }) => {
  // 1. Normalizamos a minúsculas para evitar errores (Ej: "HD" -> "hd")
  const safeType = type ? type.toLowerCase() : "";

  // 2. Configuración de estilos por tipo
  const styles = {
    // --- ESTADOS ---
    new: {
      className: "bg-emerald-500/20 border-emerald-500/50 text-emerald-400",
      icon: <Sparkles className="w-3 h-3" />,
      text: "NUEVO",
      animate: true // Solo este tendrá efecto de pulso
    },
    original: {
      className: "bg-red-600/20 border-red-500/50 text-red-500",
      icon: <Crown className="w-3 h-3 fill-current" />,
      text: "ORIGINAL",
      animate: false
    },
    popular: {
        className: "bg-yellow-500/20 border-yellow-500/50 text-yellow-500",
        icon: <Flame className="w-3 h-3 fill-current" />,
        text: "TOP 10",
        animate: false
    },
    
    // --- CALIDADES ---
    hd: {
      className: "bg-blue-500/20 border-blue-500/50 text-blue-400",
      icon: <Monitor className="w-3 h-3" />,
      text: "HD 1080p",
      animate: false
    },
    '4k': {
      className: "bg-purple-500/20 border-purple-500/50 text-purple-400",
      icon: <Tv className="w-3 h-3" />,
      text: "ULTRA 4K",
      animate: false
    }
  };

  const currentStyle = styles[safeType];

  // Si el tipo no existe en el diccionario, no renderizamos nada para no romper la app
  if (!currentStyle) return null;

  return (
    <div className={`
        ${currentStyle.className} 
        backdrop-blur-md px-2 py-0.5 rounded border 
        flex items-center gap-1.5 w-fit shadow-lg
    `}>
      
      {/* Icono con animación opcional */}
      <div className="relative flex items-center justify-center">
        {currentStyle.animate && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current"></span>
        )}
        <span className="relative z-10">{currentStyle.icon}</span>
      </div>

      {/* Texto */}
      <span className="text-[9px] font-extrabold tracking-wider pt-0.5">
        {currentStyle.text}
      </span>
    </div>
  );
};

export default Badge;