import React, { useEffect, useRef } from 'react';

const AdsterraBanner = () => {
  const bannerRef = useRef(null);

  useEffect(() => {
    // 1. Evitar doble carga (Strict Mode de React)
    if (bannerRef.current && bannerRef.current.querySelector('script')) {
        return;
    }

    // 2. Crear el script tal cual te lo dieron
    const script = document.createElement('script');
    script.src = "https://pl28419792.effectivegatecpm.com/8cadb933668acb77fe41e3a83e10b7d3/invoke.js";
    script.async = true;
    script.setAttribute('data-cfasync', 'false'); // Importante: el atributo data-cfasync

    // 3. Inyectar el script dentro de nuestro contenedor ref
    if (bannerRef.current) {
        bannerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="flex justify-center items-center my-6 min-h-[90px]">
        {/* Contenedor Ref donde inyectaremos el script */}
        <div ref={bannerRef}>
            {/* EL DIV ESPECÍFICO QUE REQUIERE ADSTERRA */}
            <div id="container-8cadb933668acb77fe41e3a83e10b7d3"></div>
        </div>
    </div>
  );
};

export default AdsterraBanner;