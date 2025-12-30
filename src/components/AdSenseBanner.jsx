import React, { useEffect, useRef } from 'react';

const AdSenseBanner = ({ slot, style, format = "auto", responsive = "true" }) => {
  const adRef = useRef(null);

  useEffect(() => {
    try {
      // Verificamos si ya hay anuncios cargados para evitar errores en modo desarrollo
      const adsbygoogle = window.adsbygoogle || [];
      adsbygoogle.push({});
    } catch (e) {
      console.error("Error al cargar anuncio de AdSense:", e);
    }
  }, []);

  return (
    <div className="my-8 flex justify-center overflow-hidden">
      {/* Etiqueta ins de Google */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-TU_ID_DE_CLIENTE_AQUI" // <--- PON TU ID AQUÍ
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      ></ins>
    </div>
  );
};

export default AdSenseBanner;