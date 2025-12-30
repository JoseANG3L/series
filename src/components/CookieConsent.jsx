import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X, Check } from 'lucide-react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificamos si ya existe la marca en el navegador
    const consent = localStorage.getItem('luisfseries_cookie_consent');
    
    // Si NO existe, mostramos el banner después de 1.5 segundos (para que sea suave)
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    // Guardamos la decisión
    localStorage.setItem('luisfseries_cookie_consent', 'true');
    // Ocultamos el banner
    setIsVisible(false);
  };

  const handleClose = () => {
    // Si el usuario cierra sin aceptar, lo ocultamos temporalmente (volverá a salir en otra sesión)
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-50 animate-slide-up">
      {/* Contenedor Glassmorphism */}
      <div className="bg-slate-900 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl shadow-black/50 relative overflow-hidden">
        
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-red-600/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        {/* Botón Cerrar (X) */}
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex gap-4">
          {/* Icono */}
          <div className="shrink-0 bg-slate-800/50 p-3 rounded-xl h-fit">
            <Cookie className="w-6 h-6 text-red-500" />
          </div>

          {/* Texto */}
          <div className="flex-1">
            <h4 className="text-white font-bold mb-1">Valoramos tu privacidad</h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Utilizamos cookies propias y de terceros para mejorar tu experiencia y analizar el uso de nuestra web. 
              Al continuar navegando, aceptas nuestra <Link to="/cookies" className="text-red-400 hover:text-red-300 underline underline-offset-2">Política de Cookies</Link> y <Link to="/privacy" className="text-red-400 hover:text-red-300 underline underline-offset-2">Privacidad</Link>.
            </p>

            {/* Botones */}
            <div className="flex gap-3">
              <button 
                onClick={handleAccept}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2.5 px-4 rounded-lg shadow-lg shadow-red-900/20 transition flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Aceptar todo
              </button>
              <button 
                onClick={handleClose}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold py-2.5 px-4 rounded-lg border border-slate-700 transition"
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;