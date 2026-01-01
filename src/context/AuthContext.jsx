import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true; // Para evitar actualizaciones si el componente se desmonta

    // 1. Verificar sesión actual al cargar
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session?.user) {
          if (mounted) setUser(session.user);
          await fetchRole(session.user.id);
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);
      } finally {
        // --- LA CLAVE DEL ÉXITO ---
        // Usamos 'finally' para asegurar que loading sea false 
        // SIEMPRE, haya error o no.
        if (mounted) setLoading(false);
      }
    };

    checkUser();

    // 2. Escuchar cambios en tiempo real
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        if (mounted) setUser(session.user);
        // Solo buscamos el rol si es un inicio de sesión o cambio de usuario
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
            await fetchRole(session.user.id);
        }
      } else {
        if (mounted) {
            setUser(null);
            setRole(null);
        }
      }
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Función auxiliar blindada
  const fetchRole = async (userId) => {
    try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();
        
        if (error) throw error;
        if (data) setRole(data.role);
    } catch (error) {
        console.error("Error obteniendo rol:", error);
        // Opcional: setRole('user') por defecto si falla la BD
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, signOut, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);