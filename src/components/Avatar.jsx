import React from 'react';
import { ICON_MAP } from '../utils/avatarConfig';
import { User } from 'lucide-react';

const Avatar = ({ user, size = "md", className = "" }) => {
  // Tamaños predefinidos
  const sizeClasses = {
    sm: "w-8 h-8",      // Navbar
    md: "w-10 h-10",    // Comentarios
    lg: "w-12 h-12",    // Listas grandes
    xl: "w-32 h-32 md:w-40 md:h-40" // Perfil
  };
  
  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 64
  };

  // 1. Caso: Avatar Personalizado (Configuración en Firestore)
  if (user?.avatarConfig) {
    const { color, icon } = user.avatarConfig;
    const IconComponent = ICON_MAP[icon] || User; // Fallback a User si no encuentra el icono

    return (
      <div 
        className={`rounded-full flex items-center justify-center text-white shadow-lg ${sizeClasses[size]} ${className}`}
        style={{ backgroundColor: color }}
      >
        <IconComponent size={iconSize[size]} strokeWidth={2.5} />
      </div>
    );
  }

  // 2. Caso: Foto de URL (Google o Upload antiguo)
  if (user?.photoURL && !user.photoURL.includes('ui-avatars')) {
     return (
        <img 
            src={user.photoURL} 
            alt={user.displayName} 
            className={`rounded-full object-cover border border-slate-600 ${sizeClasses[size]} ${className}`} 
        />
     );
  }

  // 3. Caso: Fallback (Iniciales o Default)
  return (
    <div className={`rounded-full bg-slate-700 flex items-center justify-center text-slate-400 ${sizeClasses[size]} ${className}`}>
       <User size={iconSize[size]} />
    </div>
  );
};

export default Avatar;