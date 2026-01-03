import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Edit2, Save, X, LogOut, Settings, User, Film, Lock, Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { updateProfile, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/client';
import { ICON_MAP, AVATAR_COLORS } from '../utils/avatarConfig';
import Avatar from '../components/Avatar';

const Profile = () => {
  const { user, role, signOut } = useAuth();
  
  // --- ESTADOS DE EDICIÓN ---
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || '');
  const [loading, setLoading] = useState(false);

  // Estados del Avatar Personalizado
  const [selectedColor, setSelectedColor] = useState(user?.avatarConfig?.color || AVATAR_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(user?.avatarConfig?.icon || 'user');

  // --- ESTADOS DE CONTRASEÑA ---
  const [showPassModal, setShowPassModal] = useState(false);
  const [passData, setPassData] = useState({ newPass: '', confirmPass: '' });
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);

  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Mockup Mi Lista
  const myList = [
    { id: 1, title: "Inception", poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg" },
    { id: 2, title: "Interstellar", poster: "https://image.tmdb.org/t/p/w500/gEU2QniL6E8ahDaX0mDbP09r9n3.jpg" },
  ];

  // ==========================================
  // 1. LÓGICA ACTUALIZAR PERFIL (NOMBRE + AVATAR)
  // ==========================================
  const handleUpdateProfile = async () => {
    if (!newName.trim()) return;
    setLoading(true);

    try {
      // 1. Preparamos la configuración del avatar
      const newAvatarConfig = {
        color: selectedColor,
        icon: selectedIcon
      };

      // 2. Actualizamos Auth (Solo nombre)
      await updateProfile(auth.currentUser, { 
        displayName: newName
      });

      // 3. Actualizamos Firestore (Nombre + Config Avatar)
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        username: newName,
        avatarConfig: newAvatarConfig // <--- Guardamos color e icono
      });

      setIsEditing(false);
      
      // --- CAMBIO AQUÍ ---
      setShowSuccessModal(true); // 1. Mostrar modal bonito
      
      // 2. Esperar 2 segundos para que el usuario lo vea, y luego recargar
      setTimeout(() => {
          window.location.reload();
      }, 2000);

    } catch (error) {
      console.error(error);
      // --- CAMBIO AQUÍ ---
      setShowErrorModal(true); 
      
      // Ocultar el error después de 3 segundos para que pueda reintentar
      setTimeout(() => {
          setShowErrorModal(false);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 2. LÓGICA CAMBIAR CONTRASEÑA
  // ==========================================
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess(false);

    if (passData.newPass.length < 6) return setPassError("La contraseña debe tener al menos 6 caracteres.");
    if (passData.newPass !== passData.confirmPass) return setPassError("Las contraseñas no coinciden.");

    setLoading(true);
    try {
      await updatePassword(auth.currentUser, passData.newPass);
      setPassSuccess(true);
      setPassData({ newPass: '', confirmPass: '' });
      setTimeout(() => setShowPassModal(false), 2000); 
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/requires-recent-login') {
        setPassError("Por seguridad, debes cerrar sesión y volver a entrar para cambiar tu contraseña.");
      } else {
        setPassError("Error al cambiar contraseña.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-white pt-24 text-center">Cargando perfil...</div>;

  // --- OBJETO PREVIEW ---
  // Creamos un usuario "falso" que combina los datos reales con lo que estás seleccionando
  // Esto permite ver cómo queda el avatar antes de guardar.
  const previewUser = {
    ...user,
    avatarConfig: { color: selectedColor, icon: selectedIcon }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* --- TARJETA PRINCIPAL --- */}
        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-2xl animate-fade-in-up">
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* 1. SECCIÓN AVATAR + SELECTORES */}
            <div className="flex flex-col items-center gap-4 shrink-0 mx-auto md:mx-0">
               
               {/* Usamos el componente Avatar. Si edita, muestra el previewUser */}
               <Avatar 
                  user={isEditing ? previewUser : user} 
                  size="xl" 
                  className="border-4 border-[#0f172a]/20 shadow-2xl transition-all duration-300" 
               />
               
               {/* PANEL DE SELECCIÓN (Solo visible al editar) */}
               {isEditing && (
                 <div className="flex flex-col gap-4 p-4 bg-slate-900 rounded-xl border border-slate-700 w-full max-w-[280px] animate-fadeIn">
                    
                    {/* Selector de Color */}
                    <div>
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider text-center block mb-2">Color de Fondo</span>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {AVATAR_COLORS.map(color => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-6 h-6 rounded-full transition hover:scale-110 shadow-sm ${selectedColor === color ? 'ring-2 ring-white scale-110' : ''}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="w-full h-px bg-slate-800"></div>

                    {/* Selector de Icono */}
                    <div>
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider text-center block mb-2">Icono</span>
                        <div className="grid grid-cols-4 gap-2 justify-center">
                            {Object.keys(ICON_MAP).map(iconName => {
                                const IconCmp = ICON_MAP[iconName];
                                return (
                                    <button
                                        key={iconName}
                                        onClick={() => setSelectedIcon(iconName)}
                                        className={`p-2 rounded-lg flex items-center justify-center transition hover:bg-slate-700 ${selectedIcon === iconName ? 'bg-slate-700 text-white ring-1 ring-slate-500 shadow-inner' : 'text-slate-500'}`}
                                    >
                                        <IconCmp size={20} />
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                 </div>
               )}
            </div>

            {/* 2. SECCIÓN DATOS Y NOMBRE */}
            <div className="flex-1 w-full space-y-6 text-center md:text-left pt-2">
                {isEditing ? (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Nombre de Usuario</label>
                            <input 
                                type="text" 
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white outline-none focus:border-red-500 w-full text-lg font-bold"
                            />
                        </div>
                        <div className="flex gap-3 justify-center md:justify-start">
                            <button onClick={handleUpdateProfile} disabled={loading} className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold transition shadow-lg shadow-green-900/20">
                                {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Guardar</>}
                            </button>
                            <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition">
                                <X size={18} /> Cancelar
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-extrabold flex items-center justify-center md:justify-start gap-4">
                                {user.displayName || "Usuario"}
                                <button onClick={() => setIsEditing(true)} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition border border-slate-700 shadow-lg">
                                    <Edit2 size={20} />
                                </button>
                            </h1>
                            <p className="text-slate-400 mt-3 font-medium flex items-center justify-center md:justify-start gap-2 text-lg">
                                <User size={18} /> {user.email}
                            </p>
                        </div>

                        {role === 'admin' && (
                            <div className="inline-block bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 px-4 py-1.5 rounded-full mt-2">
                                <span className="text-red-400 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                                    <Settings size={12} /> Administrador
                                </span>
                            </div>
                        )}
                        
                        <p className="text-slate-600 text-sm mt-4">
                             Miembro desde: {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                        </p>
                    </>
                )}
            </div>
          </div>
        </div>

        {/* --- SECCIÓN: CONFIGURACIÓN --- */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-gray-300 mb-4">Configuración de Cuenta</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <button 
                onClick={() => setShowPassModal(true)}
                className="flex items-center justify-between p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition group"
            >
              <span className="text-sm font-medium">Cambiar contraseña</span>
              <Lock className="w-4 h-4 text-slate-400 group-hover:text-white" />
            </button>
          </div>

          <div className="pt-6 border-t border-slate-800 mt-6">
            <button onClick={signOut} className="flex items-center gap-2 text-red-500 hover:text-red-400 font-bold transition px-4 py-2 hover:bg-red-500/10 rounded-lg w-fit">
              <LogOut className="w-5 h-5" /> Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* --- MODAL CAMBIAR CONTRASEÑA --- */}
      {showPassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl relative">
                <button onClick={() => setShowPassModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <X className="w-6 h-6" />
                </button>
                
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-red-500" /> Cambiar Contraseña
                </h3>

                {passSuccess ? (
                    <div className="bg-green-500/10 border border-green-500/50 p-4 rounded-lg flex flex-col items-center text-center gap-2 mb-4">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                        <p className="text-green-500 font-bold">¡Contraseña actualizada!</p>
                    </div>
                ) : (
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        
                        {/* INPUT 1: NUEVA CONTRASEÑA */}
                        <div>
                            <label className="text-sm text-slate-400 block mb-1">Nueva contraseña</label>
                            <div className="relative">
                                <input 
                                    type={showNewPass ? "text" : "password"} 
                                    placeholder="Mínimo 6 caracteres"
                                    value={passData.newPass}
                                    onChange={(e) => setPassData({...passData, newPass: e.target.value})}
                                    className="w-full bg-slate-800 border border-slate-600 rounded px-4 py-2 pr-10 text-white outline-none focus:border-red-500 transition"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowNewPass(!showNewPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                                >
                                    {showNewPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* INPUT 2: CONFIRMAR CONTRASEÑA */}
                        <div>
                            <label className="text-sm text-slate-400 block mb-1">Confirmar contraseña</label>
                            <div className="relative">
                                <input 
                                    type={showConfirmPass ? "text" : "password"} 
                                    placeholder="Repite la contraseña"
                                    value={passData.confirmPass}
                                    onChange={(e) => setPassData({...passData, confirmPass: e.target.value})}
                                    className="w-full bg-slate-800 border border-slate-600 rounded px-4 py-2 pr-10 text-white outline-none focus:border-red-500 transition"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                                >
                                    {showConfirmPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {passError && (
                            <div className="text-red-500 text-sm flex items-center gap-2 bg-red-500/10 p-2 rounded border border-red-500/20">
                                <AlertCircle className="w-4 h-4" /> {passError}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition mt-2 flex justify-center shadow-lg shadow-red-900/20"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Actualizar Contraseña"}
                        </button>
                    </form>
                )}
            </div>
        </div>
      )}

      {/* --- MODAL DE ÉXITO AL GUARDAR PERFIL --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-slate-900 border border-green-500/50 rounded-2xl p-8 flex flex-col items-center justify-center shadow-2xl transform scale-105 transition-all">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 animate-bounce">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">¡Perfil Actualizado!</h3>
                <p className="text-slate-400 text-center">Tus cambios se han guardado correctamente.</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                    <Loader2 className="w-3 h-3 animate-spin" /> Recargando aplicación...
                </div>
            </div>
        </div>
      )}

      {/* --- MODAL DE ERROR AL GUARDAR --- */}
      {showErrorModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-slate-900 border border-red-500/50 rounded-2xl p-8 flex flex-col items-center justify-center shadow-2xl transform scale-105 transition-all max-w-sm text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">¡Ups! Algo salió mal</h3>
                <p className="text-slate-400">No se pudieron guardar los cambios. Por favor, inténtalo de nuevo.</p>
                
                {/* Botón para cerrar manual por si acaso */}
                <button 
                    onClick={() => setShowErrorModal(false)}
                    className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-bold transition"
                >
                    Cerrar
                </button>
            </div>
        </div>
      )}

    </div>
  );
};

export default Profile;