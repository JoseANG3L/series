import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, ChevronLeft, Loader2 } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth'; // <--- 1. FUNCIÓN FIREBASE
import { auth } from '../firebase/client'; // <--- 2. INSTANCIA AUTH

const ForgotPassword = () => {
  const navigate = useNavigate();
  
  // Estados Locales
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Por favor ingresa un correo.');
      return;
    }

    setLoading(true);

    try {
      // 3. LLAMADA A FIREBASE
      // Esto envía un link mágico al correo del usuario
      await sendPasswordResetEmail(auth, email);
      setIsSuccess(true); // Cambiamos a la vista de éxito

    } catch (err) {
      console.error("Error reset pass:", err.code);
      
      // 4. MAPEO DE ERRORES
      if (err.code === 'auth/user-not-found') {
        setError("No existe una cuenta registrada con este correo.");
      } else if (err.code === 'auth/invalid-email') {
        setError("El formato del correo no es válido.");
      } else {
        setError("No se pudo enviar el correo. Intenta de nuevo más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex">

      {/* --- FONDO --- */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/fondo.jpg')" }}></div>
      <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-[#1c0c2f] via-transparent to-black/30"></div>

      <div className="relative z-30 flex flex-col min-h-screen w-full pt-16 pb-16 md:pt-20 px-4 md:px-8 lg:px-16 pb-8 gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white hover:bg-white hover:text-black transition w-fit border border-white/10">
          <ChevronLeft className="w-5 h-5" /> Volver
        </button>

        {/* --- TARJETA --- */}
        <div className="relative z-10 w-full max-w-md m-auto bg-black/60 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/10 animate-fade-in-up">

          {/* LOGO */}
          <div className="text-center">
            <h1 className="flex gap-2 justify-center items-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 tracking-tighter">
              Recuperar contraseña
            </h1>
          </div>

          {/* --- VISTA 1: FORMULARIO --- */}
          {!isSuccess ? (
            <>
              <div className="text-center mb-8 mt-4">
                <p className="text-gray-400 text-sm leading-relaxed">
                  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecerla.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-gray-300 text-sm font-medium ml-1">Correo Electrónico</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      disabled={loading}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="ejemplo@correo.com"
                      className={`
                        w-full bg-slate-800/50 border text-white px-4 py-3 pl-10 rounded-lg focus:outline-none transition disabled:opacity-50
                        ${error ? 'border-red-500 focus:border-red-500' : 'border-slate-600 focus:border-red-500'}
                      `}
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  
                  {/* Mensaje de Error */}
                  {error && (
                    <div className="text-red-500 text-xs mt-2 flex items-center gap-2 bg-red-500/10 p-2 rounded border border-red-500/50 animate-pulse">
                      <AlertCircle className="w-4 h-4" /> 
                      {error}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg shadow-lg shadow-red-900/30 transition duration-300 flex justify-center items-center"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    "Enviar enlace de recuperación"
                  )}
                </button>
              </form>
            </>
          ) : (

            /* --- VISTA 2: MENSAJE DE ÉXITO --- */
            <div className="text-center py-4 animate-fadeIn mt-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">¡Correo enviado!</h2>
              <p className="text-gray-300 text-sm mb-6">
                Hemos enviado las instrucciones para restablecer tu contraseña a <span className="text-white font-bold">{email}</span>.
              </p>
              <p className="text-gray-500 text-xs mb-8">
                Si no lo encuentras, revisa tu carpeta de Spam.
              </p>

              <Link to="/login" className="block w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition text-center">
                Volver al inicio de sesión
              </Link>
            </div>
          )}

          {/* Footer Link */}
          {!isSuccess && (
            <div className="mt-6 text-center">
              <Link to="/login" className="text-gray-400 hover:text-white text-sm flex items-center justify-center gap-1 transition">
                <ArrowLeft className="w-4 h-4" /> Regresar al Login
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;