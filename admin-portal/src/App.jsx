import { useCallback, useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import Preloader from "./components/Preloader";
import "./styles/global.css";

function App() {
  const [showPreloader, setShowPreloader] = useState(() => {
    try {
      return !sessionStorage.getItem("hired_ops_preloader_seen");
    } catch {
      return false;
    }
  });

  const handlePreloaderComplete = useCallback(() => {
    try {
      sessionStorage.setItem("hired_ops_preloader_seen", "true");
    } catch {
      // ignore
    }
    setShowPreloader(false);
  }, []);

  return (
    <>
      {showPreloader && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      <AppRoutes />
    </>
  );
}

export default App;
