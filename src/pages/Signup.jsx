import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ChevronLeft, Star } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registro con:', formData);
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full relative flex bg-[#0f172a]">
      {/* Fondo */}
      <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: "url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')" }}></div>
      <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-[#0f172a] via-transparent to-black/60"></div>

      <div className="relative z-30 flex flex-col min-h-screen w-full justify-center align-center pt-16 md:pt-20 px-4 md:px-8 lg:px-16 pb-8 gap-5">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white hover:bg-white hover:text-black transition w-fit">
          <ChevronLeft className="w-5 h-5" /> Volver
        </button>


        <div className="relative z-10 w-full max-w-md mx-auto bg-black/75 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-white/10 animate-fade-in-up">

          <div className="text-center mb-6">
            <h1 className="flex gap-2 justify-center items-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 tracking-tighter">
              LUIS<Star size={24} color="gold" fill="gold" />FSERIES
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Crea tu cuenta para empezar a ver</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Nombre */}
            <div className="space-y-1">
              <label className="text-gray-300 text-sm font-medium ml-1">Nombre Completo</label>
              <div className="relative">
                <input type="text" placeholder="Tu nombre" className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 pl-10 rounded-lg focus:outline-none focus:border-red-500 transition" />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-gray-300 text-sm font-medium ml-1">Correo Electrónico</label>
              <div className="relative">
                <input type="email" placeholder="ejemplo@correo.com" className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 pl-10 rounded-lg focus:outline-none focus:border-red-500 transition" />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-gray-300 text-sm font-medium ml-1">Contraseña</label>
              <div className="relative">
                <input type="password" placeholder="Crear contraseña" className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 pl-10 rounded-lg focus:outline-none focus:border-red-500 transition" />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-red-900/30 transition duration-300 mt-4">
              Registrarse
            </button>
          </form>

          <div className="mt-6 text-center text-gray-400 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-white font-bold hover:underline">Inicia Sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;