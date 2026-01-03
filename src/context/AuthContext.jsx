import { createContext, useContext, useEffect, useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { auth, db } from "../firebase/client"; 

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. REGISTRO
  const signUp = async (email, password, username) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const currentUser = userCredential.user; // Usamos esta referencia
    
    // Avatar por defecto (UI Avatars)
    const avatarUrl = `https://ui-avatars.com/api/?name=${username}&background=random&color=fff`;

    // Actualizar perfil en Auth
    await updateProfile(currentUser, { // CORREGIDO: usaba 'user' antes, debe ser 'currentUser'
        displayName: username,
        photoURL: avatarUrl
    });

    // Crear documento en Firestore
    await setDoc(doc(db, "users", currentUser.uid), {
        uid: currentUser.uid,
        email: email,
        username: username,
        avatar: avatarUrl,
        role: 'user',
        // Inicializamos avatarConfig vacío o null
        avatarConfig: null, 
        createdAt: new Date().toISOString()
    });

    setRole('user');
    return userCredential;
  };

  const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
  
  const signOut = () => {
      setRole(null);
      setUser(null);
      return firebaseSignOut(auth);
  };

  // 2. ESCUCHAR CAMBIOS Y TRAER DATOS DE FIRESTORE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Objeto base del usuario
        let finalUser = { ...currentUser };
        let userRole = 'user';

        try {
            // Buscamos datos extra en Firestore (Rol, AvatarConfig, etc)
            const docRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                userRole = data.role;
                
                // --- AQUÍ ESTÁ LA MAGIA ---
                // Fusionamos la configuración visual de Firestore en el objeto usuario
                finalUser.avatarConfig = data.avatarConfig || null;
                
                // Opcional: Si el nombre en DB es más actual que en Auth, úsalo
                if (data.username) finalUser.displayName = data.username;
            } 
        } catch (error) {
            console.error("Error buscando datos de usuario:", error);
        }

        // Guardamos todo en el estado
        setUser(finalUser);
        setRole(userRole);

      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, signUp, signIn, signOut, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};