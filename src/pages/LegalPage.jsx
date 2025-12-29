import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, FileText, Shield, Cookie, Mail, Send } from 'lucide-react';

const LegalPage = ({ type }) => {
  
  // 1. Scroll al inicio al entrar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  // 2. Base de Datos de Contenidos (Simulada)
  const CONTENT = {
    terms: {
      title: "Términos de Uso",
      icon: <FileText className="w-12 h-12 text-red-600 mb-4" />,
      text: (
        <>
          <p>Bienvenido a <strong>LuisFSeries</strong>. Al acceder a nuestra plataforma, aceptas estar sujeto a los siguientes términos y condiciones.</p>
          <h3 className="text-xl font-bold text-white mt-6 mb-2">1. Uso del Servicio</h3>
          <p>Nuestro servicio es para uso personal y no comercial. No puedes compartir tu cuenta con personas fuera de tu hogar.</p>
          <h3 className="text-xl font-bold text-white mt-6 mb-2">2. Propiedad Intelectual</h3>
          <p>Todo el contenido, marcas y logotipos son propiedad de LuisFSeries o de sus licenciantes.</p>
          <h3 className="text-xl font-bold text-white mt-6 mb-2">3. Cancelación</h3>
          <p>Puedes cancelar tu suscripción en cualquier momento desde tu perfil.</p>
        </>
      )
    },
    privacy: {
      title: "Política de Privacidad",
      icon: <Shield className="w-12 h-12 text-red-600 mb-4" />,
      text: (
        <>
          <p>En LuisFSeries nos tomamos muy en serio tu privacidad. Esta política describe cómo recopilamos y usamos tus datos.</p>
          <h3 className="text-xl font-bold text-white mt-6 mb-2">1. Datos que recopilamos</h3>
          <p>Recopilamos tu nombre, correo electrónico y datos de uso (qué películas ves) para mejorar recomendaciones.</p>
          <h3 className="text-xl font-bold text-white mt-6 mb-2">2. Uso de la información</h3>
          <p>No vendemos tus datos a terceros. Solo los usamos para procesar pagos y personalizar tu experiencia.</p>
        </>
      )
    },
    cookies: {
      title: "Política de Cookies",
      icon: <Cookie className="w-12 h-12 text-red-600 mb-4" />,
      text: (
        <>
          <p>Utilizamos cookies para mejorar tu experiencia en nuestra web.</p>
          <h3 className="text-xl font-bold text-white mt-6 mb-2">1. ¿Qué son las cookies?</h3>
          <p>Son pequeños archivos de texto que se guardan en tu navegador para recordar tu sesión.</p>
          <h3 className="text-xl font-bold text-white mt-6 mb-2">2. Tipos de cookies</h3>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Esenciales:</strong> Para mantener tu sesión iniciada.</li>
            <li><strong>Analíticas:</strong> Para ver qué películas son las más populares.</li>
          </ul>
        </>
      )
    },
    contact: {
      title: "Contacto",
      icon: <Mail className="w-12 h-12 text-red-600 mb-4" />,
      text: null // El contacto tiene su propio layout abajo
    }
  };

  const data = CONTENT[type];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 pt-28 pb-12 px-4 md:px-8 lg:px-16 font-sans">
      
      <div className="max-w-4xl mx-auto">
        {/* Botón Volver */}
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition group">
          <ChevronLeft className="w-5 h-5" /> Volver
        </Link>

        {/* --- CONTENEDOR PRINCIPAL --- */}
        <div className="bg-slate-900/50 p-8 md:p-12 rounded-2xl border border-slate-800 shadow-2xl animate-fadeIn">
          
          {/* Encabezado */}
          <div className="flex flex-col items-center text-center mb-10">
            {data.icon}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{data.title}</h1>
            {type !== 'contact' && <p className="text-sm text-slate-500">Última actualización: Diciembre 2025</p>}
          </div>

          {/* --- CONTENIDO LÓGICO --- */}
          {type === 'contact' ? (
            
            /* --- FORMULARIO DE CONTACTO --- */
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">¿Cómo podemos ayudarte?</h3>
                <p className="text-slate-400 leading-relaxed">
                  Si tienes problemas con tu cuenta, sugerencias de películas o consultas comerciales, envíanos un mensaje. Respondemos en menos de 24 horas.
                </p>
                <div className="bg-slate-800 p-4 rounded-lg mt-4 border border-slate-700">
                  <p className="text-sm text-slate-400">Email directo:</p>
                  <p className="text-red-400 font-bold">soporte@luisfseries.com</p>
                </div>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Nombre</label>
                  <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-red-500 outline-none transition" placeholder="Tu nombre" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                  <input type="email" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-red-500 outline-none transition" placeholder="tucorreo@ejemplo.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Mensaje</label>
                  <textarea rows="4" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-red-500 outline-none transition" placeholder="¿En qué podemos ayudar?"></textarea>
                </div>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Enviar Mensaje
                </button>
              </form>
            </div>

          ) : (
            
            /* --- TEXTO LEGAL GENÉRICO --- */
            <div className="space-y-6 leading-relaxed text-lg text-slate-400">
              {data.text}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default LegalPage;