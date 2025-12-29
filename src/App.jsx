import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import CookieConsent from "./components/CookieConsent";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a]">
      <Navbar />

      <main className="flex-grow">
        <AppRoutes />
      </main>

      <Footer />

      {/* --- BANNER DE COOKIES (Flotante) --- */}
      <CookieConsent />
    </div>
  );
}

export default App;
