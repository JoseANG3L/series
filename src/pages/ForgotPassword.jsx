import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, ChevronLeft, Loader2 } from 'lucide-react';
import { supabase } from '../supabase/client';
import useSWRMutation from 'swr/mutation'; // <--- 1. Importamos el hook de mutación

// --- 2. DEFINIR LA FUNCIÓN DE ENVÍO (FETCHER) ---
// key: la clave (no se usa aquí pero es requerida por la firma)
// { arg }: el argumento que pasamos al llamar a trigger (el email)
async function sendRecoveryEmail(key, { arg: email }) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) throw error;
    return true; // Retornamos true para indicar éxito
}

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');

  // --- 3. USAR EL HOOK ---
  // trigger: función para disparar el envío
  // isMutating: equivalente a tu 'loading'
  // data: si existe, es que fue 'success'
  // error: si existe, contiene el error de Supabase
  const { trigger, isMutating, data, error, reset } = useSWRMutation(
    'reset-password-action', // Clave identificadora
    sendRecoveryEmail        // La función de arriba
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!email) {
      setValidationError('Por favor ingresa un correo.');
      return;
    }

    try {
      // Llamamos a trigger pasando el email como argumento
      await trigger(email);
    } catch (e) {
      // SWR ya captura el error en la variable 'error', 
      // pero el catch aquí evita que la app crashee si no lo manejas.
      console.error(e);
    }
  };

  // Variable auxiliar para saber si tuvimos éxito
  const isSuccess = data === true;

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
                      disabled={isMutating}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) reset(); // Limpiar error al escribir
                      }}
                      placeholder="ejemplo@correo.com"
                      className={`
                        w-full bg-slate-800/50 border text-white px-4 py-3 pl-10 rounded-lg focus:outline-none transition disabled:opacity-50
                        ${(error || validationError) ? 'border-red-500 focus:border-red-500' : 'border-slate-600 focus:border-red-500'}
                      `}
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  
                  {/* Manejo de errores combinados (Validación local + Error de SWR) */}
                  {(error || validationError) && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-pulse">
                      <AlertCircle className="w-3 h-3" /> 
                      {validationError || error?.message || 'Error al enviar el correo.'}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isMutating}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg shadow-lg shadow-red-900/30 transition duration-300 flex justify-center items-center"
                >
                  {isMutating ? (
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