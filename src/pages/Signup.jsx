import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ChevronLeft, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // <--- 1. NUEVO IMPORT

const Signup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth(); // <--- 2. USAMOS EL CONTEXTO
  
  // Estados de UI
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Estados de Formulario y Carga
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Limpiar errores al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
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
        // 2. Disparar el registro con Firebase
        // El AuthContext se encarga de crear el usuario y guardar el nombre (updateProfile)
        await signUp(formData.email, formData.password, formData.name);

        // 3. Éxito: Firebase inicia sesión automáticamente tras el registro
        navigate('/');

    } catch (err) {
        console.error("Error registro:", err.code);
        
        // 4. Mapeo de errores de Firebase
        if (err.code === 'auth/email-already-in-use') {
            setError("Este correo electrónico ya está registrado.");
        } else if (err.code === 'auth/invalid-email') {
            setError("El formato del correo no es válido.");
        } else if (err.code === 'auth/weak-password') {
            setError("La contraseña es muy débil.");
        } else {
            setError("Ocurrió un error al crear la cuenta. Intenta de nuevo.");
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex">
      {/* Fondo */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/fondo.jpg')" }}></div>
      <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-[#1c0c2f] via-transparent to-black/30"></div>

      <div className="relative z-30 flex flex-col min-h-screen w-full pt-16 pb-16 md:pt-20 px-4 md:px-8 lg:px-16 pb-8 gap-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white hover:bg-white hover:text-black transition w-fit border border-white/10">
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
              <label className="text-gray-300 text-sm font-medium ml-1">Nombre de Usuario</label>
              <div className="relative">
                <input 
                  name="name"
                  type="text" 
                  disabled={loading}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tu nombre" 
                  className={`w-full bg-slate-800/50 border text-white px-4 py-3 pl-10 rounded-lg focus:outline-none transition disabled:opacity-50 ${error ? 'border-red-500 focus:border-red-500' : 'border-slate-600 focus:border-red-500'}`}
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
                  className={`w-full bg-slate-800/50 border text-white px-4 py-3 pl-10 rounded-lg focus:outline-none transition disabled:opacity-50 ${error ? 'border-red-500 focus:border-red-500' : 'border-slate-600 focus:border-red-500'}`}
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
                  className={`w-full bg-slate-800/50 border text-white px-4 py-3 pl-10 pr-10 rounded-lg focus:outline-none transition disabled:opacity-50 ${error ? 'border-red-500 focus:border-red-500' : 'border-slate-600 focus:border-red-500'}`}
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
                  className={`w-full bg-slate-800/50 border text-white px-4 py-3 pl-10 pr-10 rounded-lg focus:outline-none transition disabled:opacity-50 ${error ? 'border-red-500 focus:border-red-500' : 'border-slate-600 focus:border-red-500'}`}
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
              <div className="text-red-500 text-xs flex items-center gap-2 justify-center bg-red-500/10 p-2 rounded border border-red-500/50 animate-pulse">
                <AlertCircle className="w-4 h-4" /> {error}
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