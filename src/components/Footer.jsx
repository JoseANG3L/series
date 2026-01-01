import { Facebook, Twitter, Instagram, Heart, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Loader2, Check } from "lucide-react";

const Footer = () => {
  // Estado para el formulario de suscripción
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success'

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    // Simulamos una petición a la API (2 segundos)
    setTimeout(() => {
      setStatus('success');
      setEmail(''); // Limpiamos el input
      
      // Volvemos al estado normal después de 3 segundos
      setTimeout(() => setStatus('idle'), 3000);
    }, 2000);
  };
  return (
    <footer className="bg-slate-950 pt-16 pb-8 px-8 md:px-16 border-t border-slate-800">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Columna 1: Brand */}
        <div className="col-span-1 md:col-span-1">
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 tracking-tighter mb-4">
            LUISFSERIES
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            La mejor plataforma de streaming para disfrutar de tus películas y series favoritas. Sin cortes, en HD y siempre actualizado.
          </p>
        </div>

        {/* Columna 2: Enlaces */}
        <div>
          <h4 className="text-white font-bold mb-4">Navegación</h4>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li>
              <Link to="/" className="hover:text-red-500 transition duration-200">
                Inicio
              </Link>
            </li>
            <li>
              {/* "Descubrir" suele llevar al catálogo completo de películas */}
              <Link to="/peliculas" className="hover:text-red-500 transition duration-200">
                Descubrir
              </Link>
            </li>
            <li>
              {/* "Lanzamientos" encaja perfecto con tu ruta de Novedades */}
              <Link to="/novedades" className="hover:text-red-500 transition duration-200">
                Lanzamientos
              </Link>
            </li>
            <li>
              <Link to="/series" className="hover:text-red-500 transition duration-200">
                Series TV
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 3: Legal */}
        <div>
          <h4 className="text-white font-bold mb-4">Legal</h4>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li>
              <Link to="/terms" className="hover:text-red-500 transition duration-200">
                Términos de uso
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-red-500 transition duration-200">
                Privacidad
              </Link>
            </li>
            <li>
              <Link to="/cookies" className="hover:text-red-500 transition duration-200">
                Cookies
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-red-500 transition duration-200">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 4: Redes Sociales y Newsletter */}
        <div>
          <h4 className="text-white font-bold mb-4">Síguenos</h4>
          
          {/* REDES SOCIALES (Ahora son enlaces) */}
          <div className="flex gap-4 mb-6">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-slate-800 p-2 rounded-full hover:bg-red-600 hover:text-white text-slate-400 cursor-pointer transition transform hover:scale-110"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-slate-800 p-2 rounded-full hover:bg-red-600 hover:text-white text-slate-400 cursor-pointer transition transform hover:scale-110"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-slate-800 p-2 rounded-full hover:bg-red-600 hover:text-white text-slate-400 cursor-pointer transition transform hover:scale-110"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>

          {/* NEWSLETTER FUNCIONAL */}
          <form onSubmit={handleSubscribe} className="relative">
            <input 
              type="email" 
              placeholder={status === 'success' ? "¡Gracias!" : "Tu email"} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading' || status === 'success'}
              className={`
                w-full bg-slate-800 text-white rounded-full py-2 px-4 text-sm                 
                border border-transparent 
                focus:outline-none 
                focus:border-red-600 
                focus:ring-0
                disabled:opacity-70 disabled:cursor-not-allowed
                ${status === 'success' ? '!border-green-500 text-green-400 placeholder-green-400' : ''}
              `} 
            />
            
            <button 
              type="submit" 
              disabled={status === 'loading' || status === 'success'}
              className={`
                absolute right-1 top-1 p-1.5 rounded-full text-white transition
                ${status === 'success' ? 'bg-green-600' : 'bg-red-600 hover:bg-red-500'}
                disabled:opacity-80
              `}
            >
              {status === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : status === 'success' ? (
                <Check className="w-4 h-4" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
            </button>
          </form>
          
          {/* Mensaje pequeño de feedback (opcional) */}
          {status === 'success' && (
            <p className="text-green-500 text-xs mt-2 ml-2 animate-fadeIn">
              ¡Suscripción exitosa!
            </p>
          )}
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-center items-center gap-4">
        <p className="text-slate-500 text-sm text-center md:text-left">
          © 2025 LuisFSeries. Todos los derechos reservados.
        </p>
        {/* <div className="flex items-center gap-2 text-slate-500 text-sm">
          <span>Hecho con</span>
          <Heart className="w-4 h-4 text-red-600 fill-current" />
          <span>por JoseAngel</span>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
