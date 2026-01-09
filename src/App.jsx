import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import CookieConsent from "./components/CookieConsent";
import { AuthProvider } from "./context/AuthContext"; // <--- 1. IMPORTANTE: Importar esto
import AdBlockDetector from "./components/AdBlockDetector";

function App() {
  return (
    // 2. IMPORTANTE: Envolver TODO dentro del AuthProvider
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-[#0f172a]">
        {/* Componente Detector (Se mostrará encima de todo si detecta AdBlock) */}
        <AdBlockDetector />

        {/* Ahora el Navbar sí puede acceder a los datos del usuario */}
        <Navbar />

        <main className="flex-grow">
          <AppRoutes />
        </main>

        <Footer />

        {/* --- BANNER DE COOKIES (Flotante) --- */}
        <CookieConsent />
      </div>
    </AuthProvider>
  );
}

export default App;