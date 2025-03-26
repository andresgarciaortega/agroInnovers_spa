import api from './ApiService';

const CACHE_KEY = 'cache_/variables/registerType';
// 📌 Función para verificar conexión a Internet
const isOnline = async () => {
    try {
        await fetch('https://www.google.com', { mode: 'no-cors' });
        return true;
    } catch {
        return false;
    }
};


const RegistrerTypeServices = {
    // 📌 LISTAR TODOS LOS TIPOS DE REGISTRO
    async getAllRegistrerType() {
        try {
            const online = await isOnline();

            if (online) {
                // 🔥 Si hay internet, obtener datos desde la API
                const response = await api.get('/variables/registerType');

                // Guardar en `localStorage`
                localStorage.setItem(CACHE_KEY, JSON.stringify(response));

                return response;
            } else {
                // 🚨 Si no hay internet, obtener desde `localStorage`
                const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY));

                if (cachedData) {
                    console.warn("⚠️ Sin conexión. Cargando tipos de registro desde `localStorage`.");
                    return cachedData;
                } else {
                    throw new Error("No hay datos en caché.");
                }
            }
        } catch (error) {
            console.error('❌ Error al obtener los tipos de registro:', error);
            throw error;
        }
    },
};

export default RegistrerTypeServices;
