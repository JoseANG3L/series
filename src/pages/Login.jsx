import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Star } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login con:', formData);
    navigate('/'); // Simular redirección al home al iniciar sesión
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-[#0f172a] pt-20 md:pt-24">
      {/* --- FONDO CINEMATOGRÁFICO --- */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: "url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')" }}
      ></div>
      <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-[#0f172a] via-transparent to-black/60"></div>

      {/* --- BOTÓN VOLVER --- */}
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-white/70 hover:text-white transition z-20">
        <ArrowLeft className="w-5 h-5" /> Volver al inicio
      </Link>

      {/* --- TARJETA DE LOGIN --- */}
      <div className="relative z-10 w-full max-w-md bg-black/75 backdrop-blur-sm p-8 md:p-12 rounded-xl shadow-2xl border border-white/10">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="flex gap-2 justify-center items-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 tracking-tighter">
            LUIS<Star size={24} color="gold" fill="gold" />FSERIES
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Bienvenido de nuevo</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email */}
          <div className="space-y-2">
            <label className="text-gray-300 text-sm font-medium ml-1">Correo Electrónico</label>
            <div className="relative">
              <input 
                type="email" 
                placeholder="ejemplo@correo.com"
                className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 pl-10 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-gray-300 text-sm font-medium ml-1">Contraseña</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 pl-10 pr-10 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Opciones Extra */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-gray-300">
              <input type="checkbox" className="rounded bg-slate-700 border-slate-600 text-red-600 focus:ring-red-500/50" />
              Recuérdame
            </label>
            <a href="#" className="text-red-400 hover:text-red-300 hover:underline">¿Olvidaste tu contraseña?</a>
          </div>

          {/* Botón Submit */}
          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-red-900/30 transition duration-300 transform active:scale-95">
            Iniciar Sesión
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          ¿Primera vez en LuisFSeries?{' '}
          <Link to="/signup" className="text-white font-bold hover:underline">Suscríbete ahora.</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;