import React, { useEffect, useRef } from 'react';

const NativeBanner = () => {
  const bannerRef = useRef(null);

  useEffect(() => {
    // 1. Evitamos duplicados si el componente se renderiza dos veces (Strict Mode)
    if (bannerRef.current && bannerRef.current.firstChild) {
        return;
    }

    // 2. Configuración de Adsterra (Estos datos te los da el panel de Adsterra)
    // IMPORTANTE: Reemplaza estos valores con los que te de Adsterra al crear el banner
    const atOptions = {
        'key' : 'TU_KEY_DE_ADSTERRA_AQUI', // Ej: 12345abcde...
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
    };

    // 3. Crear el script de configuración
    const confScript = document.createElement('script');
    confScript.type = 'text/javascript';
    confScript.text = `atOptions = ${JSON.stringify(atOptions)}`;

    // 4. Crear el script que invoca el anuncio
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    // Reemplaza esta URL con la que te de Adsterra (suele ser highperformanceformat.com o similar)
    invokeScript.src = `//www.highperformanceformat.com/${atOptions.key}/invoke.js`; 

    // 5. Inyectar en el DOM
    if (bannerRef.current) {
        bannerRef.current.appendChild(confScript);
        bannerRef.current.appendChild(invokeScript);
    }
  }, []);

  return (
    <div className="flex justify-center my-6 overflow-hidden">
        {/* Contenedor del anuncio */}
        <div ref={bannerRef} className="bg-slate-800/50 rounded-lg min-h-[90px] min-w-[300px] flex items-center justify-center border border-white/5">
            {/* El script inyectará el iframe aquí automáticamente */}
        </div>
    </div>
  );
};

export default NativeBanner;