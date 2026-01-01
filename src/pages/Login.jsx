import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../supabase/client';
import useSWRMutation from 'swr/mutation'; // <--- 1. Importamos el hook

// --- 2. FUNCIÓN DE LOGIN (FETCHER) ---
// Esta función maneja TODA la lógica asíncrona: Login y buscar el Rol.
async function loginUser(key, { arg }) {
  const { email, password } = arg;

  // A. Iniciar Sesión en Supabase
  const { data, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) throw authError;

  // B. Buscar el Rol en la tabla profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  // Retornamos el rol (o 'user' por defecto) para usarlo en el componente
  return { role: profile?.role || 'user' };
}

const Login = () => {
  const navigate = useNavigate();
  
  // Estados Locales (Solo para UI)
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [validationError, setValidationError] = useState('');

  // --- 3. CONFIGURAR EL HOOK ---
  // trigger: dispara el login
  // isMutating: reemplaza a tu 'loading'
  // error: captura los errores de Supabase automáticamente
  const { trigger, isMutating, error: apiError, reset } = useSWRMutation(
    'login-action', 
    loginUser
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError('');
    if (apiError) reset(); // Limpiar error de API al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    
    // Validación local simple
    if (!formData.email || !formData.password) {
      setValidationError('Por favor, completa todos los campos.');
      return;
    }

    try {
      // Llamamos al trigger. Si falla, salta al catch.
      // Si tiene éxito, nos devuelve lo que retornó 'loginUser' (el rol).
      const result = await trigger(formData);

      // C. Redirección basada en el resultado
      if (result?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }

    } catch (err) {
      // El error ya está en 'apiError', aquí solo evitamos que explote la app
      console.error("Error en login:", err);
    }
  };

  // Helper para mensaje de error legible
  const getErrorMessage = () => {
    if (validationError) return validationError;
    if (apiError) {
      if (apiError.message === "Invalid login credentials") return "Correo o contraseña incorrectos.";
      return apiError.message;
    }
    return null;
  };

  const currentError = getErrorMessage();

  return (
    <div className="min-h-screen w-full relative flex">
      {/* --- FONDO --- */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://assets.nflxext.com/ffe/siteui/vlv3/c38a2d52-138e-48a3-ab68-36787ece46b3/eeb03fc9-99bf-4734-8f09-2b0f49495b52/MX-es-20240101-popsignuptwoweeks-perspective_alpha_website_large.jpg')" }}></div>
      <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-[#1c0c2f] via-transparent to-black/30"></div>

      <div className="relative z-30 flex flex-col min-h-screen w-full pt-16 pb-16 md:pt-20 px-4 md:px-8 lg:px-16 pb-8 gap-4">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white hover:bg-white hover:text-black transition w-fit border border-white/10">
          <ChevronLeft className="w-5 h-5" /> Volver
        </button>

        {/* --- TARJETA DE LOGIN --- */}
        <div className="relative z-10 w-full max-w-md m-auto bg-black/60 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/10 animate-fade-in-up">
          
          <div className="text-center mb-8">
            <h1 className="flex gap-2 justify-center items-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 tracking-tighter">
                Iniciar sesión
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Bienvenido de nuevo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email */}
            <div className="space-y-1">
              <label className="text-gray-300 text-sm font-medium ml-1">Correo Electrónico</label>
              <div className="relative">
                <input 
                  name="email"
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isMutating}
                  placeholder="ejemplo@correo.com"
                  className={`w-full bg-slate-800/50 border text-white px-4 py-3 pl-10 rounded-lg focus:outline-none transition disabled:opacity-50 ${currentError ? 'border-red-500 focus:border-red-500' : 'border-slate-600 focus:border-red-500'}`}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-gray-300 text-sm font-medium ml-1">Contraseña</label>
              <div className="relative">
                <input 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isMutating}
                  placeholder="Ingresa tu contraseña"
                  className={`w-full bg-slate-800/50 border text-white px-4 py-3 pl-10 pr-10 rounded-lg focus:outline-none transition disabled:opacity-50 ${currentError ? 'border-red-500 focus:border-red-500' : 'border-slate-600 focus:border-red-500'}`}
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-gray-300">
                <input type="checkbox" className="rounded bg-slate-700 border-slate-600 text-red-600 focus:ring-red-500/50 cursor-pointer" />
                Recuérdame
              </label>
              <Link to="/forgot-password" className="text-red-400 hover:text-red-300 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Mensaje de Error Unificado */}
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
                  <Loader2 className="w-5 h-5 animate-spin" /> Conectando...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-gray-400 text-sm">
            ¿Primera vez en LuisFSeries?{' '}
            <Link to="/signup" className="text-white font-bold hover:underline">Registrate ahora.</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;