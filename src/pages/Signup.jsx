import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ChevronLeft, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../supabase/client';
import useSWRMutation from 'swr/mutation'; // <--- 1. Importamos el hook

// --- 2. FUNCIÓN DE REGISTRO (FETCHER) ---
async function registerUser(key, { arg }) {
  const { name, email, password } = arg;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name, // Guardamos el nombre en metadata
      }
    }
  });

  if (error) throw error;
  return data;
}

const Signup = () => {
  const navigate = useNavigate();
  
  // Estados de UI (Formulario y visualización)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState(''); // Errores locales (contraseñas no coinciden, etc)
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  });

  // --- 3. CONFIGURAR SWR MUTATION ---
  const { trigger, isMutating, data, error: apiError, reset } = useSWRMutation(
    'signup-action', 
    registerUser
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError(''); // Limpiar error local
    if (apiError) reset();  // Limpiar error de API
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    
    // 1. Validaciones Locales
    if (!formData.name || !formData.email || !formData.password) {
        setValidationError('Todos los campos son obligatorios.');
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        setValidationError('Las contraseñas no coinciden.');
        return;
    }
    
    if (formData.password.length < 6) {
        setValidationError('La contraseña debe tener al menos 6 caracteres.');
        return;
    }

    try {
        // 2. Disparar el registro
        const result = await trigger(formData);

        // 3. Manejo post-registro (Redirección)
        // Si ya existe sesión (auto-confirmación activada en Supabase), entramos.
        // Si no (requiere email), mostramos la pantalla de éxito.
        if (result?.session) {
            navigate('/');
        }
    } catch (err) {
        console.error(err);
    }
  };

  // --- VISTA DE ÉXITO (Correo de confirmación enviado) ---
  // Si tenemos data, no hay error, y NO hay sesión, significa que se envió el correo.
  if (data && !data.session && !apiError) {
    return (
        <div className="min-h-screen w-full relative flex items-center justify-center bg-[#0f172a]">
             <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 max-w-md text-center shadow-2xl animate-fade-in-up">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">¡Cuenta Creada!</h2>
                <p className="text-slate-300 mb-6">
                    Registro exitoso. Revisa tu correo electrónico <strong>({formData.email})</strong> para confirmar tu cuenta.
                </p>
                <Link to="/login" className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-full font-bold transition">
                    Ir al Login
                </Link>
             </div>
        </div>
    );
  }

  // Helper para mostrar errores
  const currentError = validationError || apiError?.message;

  return (
    <div className="min-h-screen w-full relative flex">
      {/* Fondo */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://assets.nflxext.com/ffe/siteui/vlv3/c38a2d52-138e-48a3-ab68-36787ece46b3/eeb03fc9-99bf-4734-8f09-2b0f49495b52/MX-es-20240101-popsignuptwoweeks-perspective_alpha_website_large.jpg')" }}></div>
      <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-[#1c0c2f] via-transparent to-black/30"></div>

      <div className="relative z-30 flex flex-col min-h-screen w-full pt-16 pb-16 md:pt-20 px-4 md:px-8 lg:px-16 pb-8 gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white hover:bg-white hover:text-black transition w-fit border border-white/10">
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
                  disabled={isMutating}
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
                  disabled={isMutating}
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
                  disabled={isMutating}
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
                  disabled={isMutating}
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

            {/* Mensaje de Error (Local o API) */}
            {currentError && (
              <div className="text-red-500 text-xs flex items-center gap-2 justify-center bg-red-500/10 p-2 rounded border border-red-500/50 animate-pulse">
                <AlertCircle className="w-4 h-4" /> {currentError}
              </div>
            )}

            <button 
                type="submit" 
                disabled={isMutating}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-red-900/30 transition duration-300 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isMutating ? (
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