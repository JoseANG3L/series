import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ requireAdmin = false }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
      </div>
    );
  }

  // 1. Si no está logueado -> Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si requiere admin y el usuario NO es admin -> Home
  if (requireAdmin && role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // 3. Todo correcto -> Mostrar contenido
  return <Outlet />;
};

export default ProtectedRoute;