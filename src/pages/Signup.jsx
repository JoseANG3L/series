import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ChevronLeft, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../supabase/client'; // <--- Importamos Supabase

const Signup = () => {
  const navigate = useNavigate();
  
  // Estados
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(''); // Para avisar si se envió correo de confirmación

  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // 1. Validaciones Locales
    if (!formData.name || !formData.email || !formData.password) {
        setError('Todos los campos son obligatorios.');
        return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
        // 2. Registro en Supabase
        const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                // Guardamos el nombre en la metadata del usuario
                data: {
                    full_name: formData.name,
                }
            }
        });

        if (error) throw error;

        // 3. Manejo post-registro
        // Si Supabase requiere confirmación de email (configuración por defecto),
        // data.session será null hasta que el usuario confirme.
        if (!data.session) {
            setSuccessMsg('¡Registro exitoso! Revisa tu correo electrónico para confirmar tu cuenta.');
        } else {
            // Si tienes desactivada la confirmación de email, entra directo
            navigate('/');
        }

    } catch (err) {
        setError(err.message || 'Ocurrió un error al registrarse.');
    } finally {
        setLoading(false);
    }
  };

  // Si el registro fue exitoso y requiere confirmación, mostramos vista de éxito
  if (successMsg) {
    return (
        <div className="min-h-screen w-full relative flex items-center justify-center bg-[#0f172a]">
             <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 max-w-md text-center shadow-2xl animate-fade-in-up">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">¡Cuenta Creada!</h2>
                <p className="text-slate-300 mb-6">{successMsg}</p>
                <Link to="/login" className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-full font-bold transition">
                    Ir al Login
                </Link>
             </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative flex">
      {/* Fondo */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/fondo.jpg')" }}></div>
      <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-[#1c0c2f] via-transparent to-black/30"></div>

      <div className="relative z-30 flex flex-col min-h-screen w-full pt-16 pb-16 md:pt-20 px-4 md:px-8 lg:px-16 pb-8 gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white hover:bg-white hover:text-black transition w-fit">
          <ChevronLeft className="w-5 h-5" /> Volver
        </button>

        <div className="relative z-10 w-full max-w-md m-auto bg-black/60 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/10 animate-fade-in-up">

          <div className="text-center mb-6">
            <h1 className="flex gap-2 justify-center items-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 tracking-tighter">
              Registrarse
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Crea tu cuenta para empezar a ver</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Nombre */}
            <div className="space-y-1">
              <label className="text-gray-300 text-sm font-medium ml-1">Nombre Completo</label>
              <div className="relative">
                <input 
                  name="name"
                  type="text" 
                  disabled={loading}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tu nombre" 
                  className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 pl-10 rounded-lg focus:outline-none focus:border-red-500 transition disabled:opacity-50" 
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-gray-300 text-sm font-medium ml-1">Correo Electrónico</label>
              <div className="relative">
                <input 
                  name="email"
                  type="email" 
                  disabled={loading}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com" 
                  className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 pl-10 rounded-lg focus:outline-none focus:border-red-500 transition disabled:opacity-50" 
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-1">
              <label className="text-gray-300 text-sm font-medium ml-1">Contraseña</label>
              <div className="relative">
                <input 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  disabled={loading}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Crear contraseña" 
                  className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 pl-10 pr-10 rounded-lg focus:outline-none focus:border-red-500 transition disabled:opacity-50" 
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirmar Contraseña */}
            <div className="space-y-1">
              <label className="text-gray-300 text-sm font-medium ml-1">Confirmar Contraseña</label>
              <div className="relative">
                <input 
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"} 
                  disabled={loading}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repite tu contraseña" 
                  className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 pl-10 pr-10 rounded-lg focus:outline-none focus:border-red-500 transition disabled:opacity-50" 
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/50 animate-pulse">
                {error}
              </div>
            )}

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-red-900/30 transition duration-300 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Registrando...
                </>
              ) : (
                "Crear Cuenta"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-gray-400 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-white font-bold hover:underline">Inicia Sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;