import { useEffect, useState } from "react";
import api from "./ApiService";

const SYNC_KEYS = {
  // "cache_/companies": "/companies/batch",
  "cache_/users": "/users/batch",
  "cache_/type-variables": "/type-variables/batch",
  "cache_/variables": "/variables/batch",
  // "cache_/category-species": "/category-species/batch",
};

const SyncService = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Intentar hacer una petición para verificar si hay internet
        await fetch("https://www.google.com", { mode: "no-cors" });
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    };

    const syncData = async () => {
      if (!isOnline){
      console.log("🌐 Internet NO disponible...");
        return;
      } 

      console.log("🌐 Internet disponible. Iniciando sincronización...");

      for (const [cacheKey, endpoint] of Object.entries(SYNC_KEYS)) {
        let cacheData = JSON.parse(localStorage.getItem(cacheKey)) || { data: [] };
        if (!cacheData.data.length) continue;

        console.log(`📤 Sincronizando datos de: ${cacheKey}`);

        const batchData = cacheData.data.filter(item => item.id >= 10000 || item.id < 10000);

        if (batchData.length > 0) {
          try {
            // 🔥 Enviar la sincronización en batch
            const response = await api.put(endpoint, batchData);
            console.log(`✅ Sincronización exitosa para ${cacheKey}:`, response);

            // 🔥 Obtener los datos actualizados de la nube
            const updatedData = await api.get(endpoint.replace("/batch", ""));
            
            // 🔥 Actualizar el localStorage con la versión más reciente
            localStorage.setItem(cacheKey, JSON.stringify({ data: updatedData }));

            console.log(`🔄 LocalStorage actualizado para ${cacheKey}`);
          } catch (error) {
            console.error(`❌ Error al sincronizar ${cacheKey}:`, error);
          }
        }
      }
    };

    // 📡 Escuchar eventos de conexión/desconexión
    window.addEventListener("online", () => {
      setIsOnline(true);
      syncData();
    });
    window.addEventListener("offline", () => setIsOnline(false));

    // 🔄 Revisar la conexión cada 10 segundos
    const interval = setInterval(checkConnection, 10000);

    // 🔄 Intentar sincronizar datos al montar el componente si hay internet
    if (isOnline) syncData();
    if (!isOnline) console.log("No tenemos conexión");

    return () => {
      window.removeEventListener("online", syncData);
      window.removeEventListener("offline", () => setIsOnline(false));
      clearInterval(interval);
    };
  }, [isOnline]);

  return null; // 🔥 No renderiza nada, solo ejecuta lógica
};

export default SyncService;
