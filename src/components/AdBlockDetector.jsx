import React, { useState, useEffect } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

const AdBlockDetector = () => {
  const [isAdBlockDetected, setIsAdBlockDetected] = useState(false);

  useEffect(() => {
    // Función para detectar el bloqueo
    const detectAdBlock = async () => {
      try {
        // Intentamos pedir un script de publicidad muy conocido
        // Usamos 'no-cors' para evitar errores de CORS, solo nos importa si falla la red
        await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
          method: 'HEAD',
          mode: 'no-cors',
        });
        
        // Si llega aquí, NO hay AdBlock (o no bloqueó este dominio)
        setIsAdBlockDetected(false);
      } catch (error) {
        // Si entra al catch, es porque el navegador bloqueó la petición (AdBlock)
        console.warn("AdBlock detectado:", error);
        setIsAdBlockDetected(true);
      }
    };

    detectAdBlock();
  }, []);

  // Si no se detecta nada, no renderizamos nada
  if (!isAdBlockDetected) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-red-500/30 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.2)] max-w-md w-full p-8 text-center relative overflow-hidden">
        
        {/* Efecto de fondo */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600"></div>

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center animate-pulse">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">
          AdBlock Detectado
        </h2>

        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Mantenemos este sitio gratuito gracias a la publicidad. 
          Nuestros anuncios son seguros y no intrusivos.
          <br /><br />
          <span className="text-white font-medium">Por favor, desactiva tu bloqueador o agréganos a la lista blanca para continuar viendo el contenido.</span>
        </p>

        <button 
          onClick={() => window.location.reload()}
          className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 active:scale-95"
        >
          <RefreshCw className="w-5 h-5" />
          Ya lo desactivé, Recargar
        </button>

        <p className="mt-4 text-[10px] text-slate-600 uppercase tracking-widest">
          Esperando desbloqueo...
        </p>
      </div>
    </div>
  );
};

export default AdBlockDetector;