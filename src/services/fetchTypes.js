// // services/companies.js

// import api from './ApiService'; 

// const TypeDocumentsService = {

//     // LISTAR TODAS LAS COMPAÑIAS
//     async getAllTypeDocuments() {
//         try {
//             const response = await api.get('/users/typeDocuments?page=1&limit=10000');
//             return response;
//         } catch (error) {
//             console.error('Error al obtener las compañías:', error);
//             throw error;
//         }
//     },  


//     // LISTAR TODAS LAS COMPAÑIAS
//     async getAllTypeUsers() {
//         try {
//             const response = await api.get('/roles?page=1&limit=10000');
//             return response.data;
//         } catch (error) {
//             console.error('Error al obtener las compañías:', error);
//             throw error;
//         }
//     },


// };

// export default TypeDocumentsService;


// services/typeDocuments.js

import api from './ApiService';

// 📌 Claves de caché para `localStorage`
const CACHE_KEYS = {
    typeDocuments: "cache_/typeDocuments",
    typeUsers: "cache_/roles",
};

// 📌 Función para verificar conexión a Internet
const isOnline = async () => {
    try {
        await fetch('https://www.google.com', { mode: 'no-cors' });
        return true;
    } catch {
        return false;
    }
};

const TypeDocumentsService = {

    // 📌 LISTAR TODOS LOS TIPOS DE DOCUMENTOS
    async getAllTypeDocuments() {
        const cacheKey = CACHE_KEYS.typeDocuments;
        try {
            const online = await isOnline();

            if (online) {
                // 🔥 Si hay internet, obtener datos desde la API
                const response = await api.get('/users/typeDocuments?page=1&limit=10000');
                
                // Guardar en `localStorage`
                localStorage.setItem(cacheKey, JSON.stringify(response));
                
                return response;
            } else {
                // 🚨 Si no hay internet, obtener desde `localStorage`
                const cachedData = JSON.parse(localStorage.getItem(cacheKey));
                if (cachedData) {
                    console.warn("⚠️ Sin conexión. Cargando tipos de documentos desde `localStorage`.");
                    return cachedData;
                } else {
                    throw new Error("No hay datos en caché.");
                }
            }
        } catch (error) {
            console.error('❌ Error al obtener los tipos de documentos:', error);
            throw error;
        }
    },

    // 📌 LISTAR TODOS LOS TIPOS DE USUARIOS
    async getAllTypeUsers() {
        const cacheKey = CACHE_KEYS.typeUsers;
        try {
            const online = await isOnline();

            if (online) {
                // 🔥 Si hay internet, obtener datos desde la API
                const response = await api.get('/roles?page=1&limit=10000');

                // Guardar en `localStorage`
                localStorage.setItem(cacheKey, JSON.stringify(response));

                return response.data;
            } else {
                // 🚨 Si no hay internet, obtener desde `localStorage`
                const cachedData = JSON.parse(localStorage.getItem(cacheKey));
                if (cachedData) {
                    console.warn("⚠️ Sin conexión. Cargando tipos de usuarios desde `localStorage`.");
                    return cachedData;
                } else {
                    throw new Error("No hay datos en caché.");
                }
            }
        } catch (error) {
            console.error('❌ Error al obtener los tipos de usuarios:', error);
            throw error;
        }
    },
};

export default TypeDocumentsService;

