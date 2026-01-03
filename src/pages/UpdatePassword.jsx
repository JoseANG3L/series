import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; // <--- 1. Agregamos useSearchParams
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ChevronLeft, Loader2 } from 'lucide-react';
import { confirmPasswordReset } from 'firebase/auth'; // <--- 2. Función de Firebase
import { auth } from '../firebase/client';

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Obtenemos el código de restablecimiento de la URL (Firebase lo llama 'oobCode')
  const oobCode = searchParams.get('oobCode');

  // Estados de UI
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Estados de Carga y Error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Efecto de seguridad: Verificar si hay código en la URL
  useEffect(() => {
    if (!oobCode) {
       // Si no hay código, es un acceso inválido. Redirigir al login.
       navigate('/login');
    }
  }, [oobCode, navigate]);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Validaciones Locales
    if (passwords.new.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!oobCode) {
      setError('Código de restablecimiento inválido o expirado.');
      return;
    }

    setLoading(true);

    try {
        // 2. Disparar actualización en Firebase
        // Usamos el código de la URL + la nueva contraseña
        await confirmPasswordReset(auth, oobCode, passwords.new);
        setIsSuccess(true);

    } catch (err) {
        console.error("Error update pass:", err.code);
        
        // Mapeo de errores comunes
        if (err.code === 'auth/expired-action-code') {
            setError("El enlace ha expirado. Solicita uno nuevo.");
        } else if (err.code === 'auth/invalid-action-code') {
            setError("El enlace es inválido o ya fue usado.");
        } else if (err.code === 'auth/weak-password') {
            setError("La contraseña es muy débil.");
        } else {
            setError("Ocurrió un error al actualizar. Intenta de nuevo.");
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex">

      {/* --- FONDO --- */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://assets.nflxext.com/ffe/siteui/vlv3/c38a2d52-138e-48a3-ab68-36787ece46b3/eeb03fc9-99bf-4734-8f09-2b0f49495b52/MX-es-20240101-popsignuptwoweeks-perspective_alpha_website_large.jpg')" }}></div>
      <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-[#1c0c2f] via-transparent to-black/30"></div>

      <div className="relative z-30 flex flex-col min-h-screen w-full pt-16 pb-16 md:pt-20 px-4 md:px-8 lg:px-16 pb-8 gap-4">
        
        <button onClick={() => navigate('/login')} className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white hover:bg-white hover:text-black transition w-fit border border-white/10">
          <ChevronLeft className="w-5 h-5" /> Cancelar
        </button>

        {/* --- TARJETA --- */}
        <div className="relative z-10 w-full max-w-md m-auto bg-black/60 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/10 animate-fade-in-up">

          {/* Logo */}
          <div className="text-center">
            <h1 className="flex gap-2 justify-center items-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 tracking-tighter">
              Nueva contraseña
            </h1>
          </div>

          {/* VISTA 1: FORMULARIO */}
          {!isSuccess ? (
            <>
              <div className="text-center mb-8 mt-4">
                <p className="text-gray-400 text-sm">
                  Crea una contraseña nueva y segura para tu cuenta.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Nueva Contraseña */}
                <div className="space-y-1">
                  <label className="text-gray-300 text-sm font-medium ml-1">Nueva contraseña</label>
                  <div className="relative">
                    <input
                      name="new"
                      type={showPass ? "text" : "password"}
                      value={passwords.new}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Mínimo 6 caracteres"
                      className={`
                        w-full bg-slate-800/50 border text-white px-4 py-3 pl-10 pr-10 rounded-lg focus:outline-none transition disabled:opacity-50
                        ${error ? 'border-red-500 focus:border-red-500' : 'border-slate-600 focus:border-red-500'}
                      `}
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition">
                      {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirmar Contraseña */}
                <div className="space-y-1">
                  <label className="text-gray-300 text-sm font-medium ml-1">Confirmar nueva contraseña</label>
                  <div className="relative">
                    <input
                      name="confirm"
                      type={showConfirm ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Repite la contraseña"
                      className={`
                        w-full bg-slate-800/50 border text-white px-4 py-3 pl-10 pr-10 rounded-lg focus:outline-none transition disabled:opacity-50
                        ${error ? 'border-red-500 focus:border-red-500' : 'border-slate-600 focus:border-red-500'}
                      `}
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition">
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Mensaje de Error */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded p-3 flex items-start gap-2 animate-pulse">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-red-500 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg shadow-lg shadow-red-900/30 transition duration-300 flex justify-center items-center"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Actualizando...
                    </span>
                  ) : (
                    "Actualizar Contraseña"
                  )}
                </button>
              </form>
            </>
          ) : (

            /* VISTA 2: ÉXITO */
            <div className="text-center py-6 animate-fadeIn mt-2">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">¡Contraseña Actualizada!</h2>
              <p className="text-gray-300 text-sm mb-8">
                Tu contraseña ha sido restablecida correctamente. Ya puedes acceder a tu cuenta con las nuevas credenciales.
              </p>

              <button 
                onClick={() => navigate('/login')}
                className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-red-900/30"
              >
                Iniciar Sesión
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;