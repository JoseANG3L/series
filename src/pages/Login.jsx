import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ChevronLeft, Star } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  
  // Estados
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Limpiar error al escribir
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulación de validación simple
    if (!formData.email || !formData.password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    console.log('Login con:', formData);
    // Aquí iría tu lógica de autenticación real (Firebase, API, etc.)
    navigate('/'); 
  };

  return (
    <div className="min-h-screen w-full relative flex">
      {/* --- FONDO (Igual que Signup) --- */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/fondo.jpg')" }}></div>
      <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-[#1c0c2f] via-transparent to-black/30"></div>

      <div className="relative z-30 flex flex-col min-h-screen w-full pt-16 pb-16 md:pt-20 px-4 md:px-8 lg:px-16 pb-8 gap-4">
        
        {/* Botón Volver */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white hover:bg-white hover:text-black transition w-fit">
          <ChevronLeft className="w-5 h-5" /> Volver
        </button>

        {/* --- TARJETA DE LOGIN --- */}
        <div className="relative z-10 w-full max-w-md m-auto bg-black/60 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/10 animate-fade-in-up">
          
          {/* Encabezado */}
          <div className="text-center mb-8">
            <h1 className="flex gap-2 justify-center items-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 tracking-tighter">
               Iniciar sesión
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Bienvenido de nuevo</p>
          </div>

          {/* Formulario */}
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
                  placeholder="ejemplo@correo.com"
                  className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 pl-10 rounded-lg focus:outline-none focus:border-red-500 transition"
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
                  placeholder="Ingresa tu contraseña"
                  className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 pl-10 pr-10 rounded-lg focus:outline-none focus:border-red-500 transition"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                
                {/* Botón Ojo */}
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Opciones Extra (Recuérdame / Olvidé contraseña) */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-gray-300">
                <input type="checkbox" className="rounded bg-slate-700 border-slate-600 text-red-600 focus:ring-red-500/50 cursor-pointer" />
                Recuérdame
              </label>
              <Link to="/forgot-password" className="text-red-400 hover:text-red-300 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Mensaje de Error Visual */}
            {error && (
              <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/50 animate-pulse">
                {error}
              </div>
            )}

            {/* Botón Submit */}
            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-red-900/30 transition duration-300 transform active:scale-95">
              Iniciar Sesión
            </button>
          </form>

          {/* Footer */}
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