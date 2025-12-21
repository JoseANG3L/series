import { Sparkles, RotateCcw, Flame } from "lucide-react";

// Componente auxiliar para las etiquetas
const Badge = ({ type }) => {
  const styles = {
    new: {
      color: "bg-emerald-500/90 border-emerald-400/30",
      icon: <Sparkles className="w-3 h-3 text-white" />,
      text: "NUEVO"
    },
    updated: {
      color: "bg-blue-600/90 border-blue-400/30",
      icon: <RotateCcw className="w-3 h-3 text-white" />,
      text: "ACTUALIZADO"
    },
    popular: {
      color: "bg-gradient-to-r from-orange-500 to-red-600 border-orange-400/30",
      icon: <Flame className="w-3 h-3 text-white fill-current" />,
      text: "TOP 10"
    }
  };

  const currentStyle = styles[type];

  return (
    <div className={`${currentStyle.color} backdrop-blur-md px-2 py-1 rounded-md shadow-lg border flex items-center gap-1.5 w-fit mb-1`}>
      <span className="animate-ping absolute">{currentStyle.icon}</span>
      <span className="">{currentStyle.icon}</span>
      <span className="text-[10px] font-bold text-white tracking-wider">
        {currentStyle.text}
      </span>
    </div>
  );
};

export default Badge;