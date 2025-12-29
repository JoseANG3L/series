import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ChevronLeft, Star } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // En una app real, leerías el token de la URL para verificarlo
  // const token = searchParams.get('token'); 

  // Estados de campos
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });

  // Estados de visibilidad
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Estados de UI
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    if (status === 'error') {
      setStatus('idle');
      setErrorMsg('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Validaciones
    if (passwords.new.length < 6) {
      setStatus('error');
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setStatus('error');
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    // 2. Simulación de envío a API
    setStatus('loading');

    setTimeout(() => {
      // Aquí enviarías { token, newPassword } a tu backend
      setStatus('success');
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full relative flex">

      {/* --- FONDO --- */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/fondo.jpg')" }}></div>
      <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-[#1c0c2f] via-transparent to-black/30"></div>

      <div className="relative z-30 flex flex-col min-h-screen w-full pt-16 pb-16 md:pt-20 px-4 md:px-8 lg:px-16 pb-8 gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white hover:bg-white hover:text-black transition w-fit">
          <ChevronLeft className="w-5 h-5" /> Volver
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
          {status !== 'success' ? (
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
                      placeholder="Mínimo 6 caracteres"
                      className={`
                        w-full bg-slate-800/50 border text-white px-4 py-3 pl-10 pr-10 rounded-lg focus:outline-none transition
                        ${status === 'error' ? 'border-red-500 focus:border-red-500' : 'border-slate-600 focus:border-red-500'}
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
                      placeholder="Repite la contraseña"
                      className={`
                        w-full bg-slate-800/50 border text-white px-4 py-3 pl-10 pr-10 rounded-lg focus:outline-none transition
                        ${status === 'error' ? 'border-red-500 focus:border-red-500' : 'border-slate-600 focus:border-red-500'}
                      `}
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition">
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Mensaje de Error */}
                {status === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded p-3 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-red-500 text-sm">{errorMsg}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg shadow-lg shadow-red-900/30 transition duration-300 flex justify-center items-center"
                >
                  {status === 'loading' ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
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

              <Link to="/login" className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-red-900/30">
                Iniciar Sesión
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;