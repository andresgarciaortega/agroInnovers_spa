// // services/variables.js
// import api from './ApiService';

// const CACHE_KEY = 'cache_/variables';
 
// const VariablesService = {
//     // 📌 LISTAR TODAS LAS VARIABLES
//     async getAllVariable(idcompany = 0) {
//         try {
//             const response = await api.get(`/variables?page=1&limit=10000&company=${idcompany}`);
//             return response.data;
//         } catch (error) {
//             console.error('Error al obtener las variables:', error);
//             throw error;
//         }
//     },

//     // 📌 CREAR UNA VARIABLE
//     async createVariable(data) {
//         try {
//             const response = await api.post('/variables/', data);

//             // 🔥 Guardar en `localStorage`
//             let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
//             cacheData.data.push(response);
//             localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

//             return response;
//         } catch (error) {
//             console.error('Error al crear la variable:', error);
//             throw error;
//         }
//     },

//     // 📌 ACTUALIZAR UNA VARIABLE
//     async updateVariable(id, data) {
//         try {
//             const response = await api.put(`/variables/${id}`, data);

//             // 🔥 Actualizar `localStorage`
//             let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
//             const index = cacheData.data.findIndex(variable => variable.id === id);
//             if (index !== -1) {
//                 cacheData.data[index] = { ...cacheData.data[index], ...response };
//                 localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
//             }

//             return response;
//         } catch (error) {
//             console.error('Error al actualizar la variable:', error);
//             throw error;
//         }
//     },

//     // 📌 ELIMINAR UNA VARIABLE
//     async deleteVariable(id) {
//         try {
//             const response = await api.delete(`/variables/${id}`);

//             // 🔥 Eliminar del `localStorage`
//             let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
//             cacheData.data = cacheData.data.filter(variable => variable.id !== id);
//             localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

//             return response;
//         } catch (error) {
//             console.error('Error al eliminar la variable:', error);
//             throw error;
//         }
//     },
// };

// export default VariablesService;




// services/variables.js
import api from './ApiService';

const CACHE_KEY = 'cache_/variables';

// 📌 Función para verificar conexión a Internet
const isOnline = async () => {
    try {
        await fetch('https://www.google.com', { mode: 'no-cors' });
        return true;
    } catch {
        return false;
    }
};

const VariablesService = {
    // 📌 LISTAR TODAS LAS VARIABLES
    async getAllVariable(idcompany = 0) {
        try {
            const response = await api.get(`/variables?page=1&limit=10000&company=${idcompany}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error al obtener las variables:', error);
            throw error;
        }
    },

    // 📌 CREAR UNA VARIABLE
    async createVariable(data) {
        try {
            const online = await isOnline();

            if (online) {
                // 🔥 Crear en la API
                const response = await api.post('/variables/', data);

                // 🔥 Guardar en `localStorage`
                let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
                cacheData.data.push(response);
                localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

                return response;
            } else {
                console.warn("🚨 No hay internet. Guardando en LocalStorage...");

                let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };

                // 📌 Generar un ID local basado en la empresa
                const companyRecords = cacheData.data.filter(item => item.company_id === data.company_id);
                let newId = companyRecords.length === 0 
                    ? data.company_id * 1000 + 1 
                    : Math.max(...companyRecords.map(item => item.id)) + 1;

                const newItem = { ...data, id: newId };
                cacheData.data.push(newItem);
                localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

                console.warn("✅ Variable guardada en LocalStorage con ID:", newId);
                return newItem;
            }
        } catch (error) {
            console.error('❌ Error al crear la variable:', error);
            throw error;
        }
    },

    // 📌 ACTUALIZAR UNA VARIABLE
    async updateVariable(id, data) {
        try {
            const online = await isOnline();

            if (online) {
                // 🔥 Actualizar en la API
                const response = await api.put(`/variables/${id}`, data);

                // 🔥 Actualizar en `localStorage`
                let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
                const index = cacheData.data.findIndex(variable => variable.id === id);

                if (index !== -1) {
                    cacheData.data[index] = { ...cacheData.data[index], ...response };
                } else {
                    console.warn(`⚠️ Variable ${id} no encontrada en LocalStorage, agregando...`);
                    cacheData.data.push(response);
                }

                localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
                return response;
            } else {
                // 🔥 Si no hay internet, actualizar solo en `localStorage`
                console.warn("🚨 No hay internet. Intentando actualizar localmente...");

                let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };

                if (!cacheData.data.length) {
                    console.error("⚠️ No hay variables en `localStorage`.");
                    throw new Error("La variable no se encontró en localStorage.");
                }

                // 🔎 Buscar en `localStorage`
                const index = cacheData.data.findIndex(variable => variable.id == id);

                if (index !== -1) {
                    cacheData.data[index] = { ...cacheData.data[index], ...data };
                    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
                    console.warn(`✅ Variable ${id} actualizada en LocalStorage.`);
                    return cacheData.data[index];
                } else {
                    console.error(`❌ Variable ${id} no encontrada en LocalStorage.`);
                    throw new Error("La variable no se encontró en localStorage.");
                }
            }
        } catch (error) {
            console.error('❌ Error al actualizar la variable:', error.message);
            throw error;
        }
    },

    // 📌 ELIMINAR UNA VARIABLE
    async deleteVariable(id) {
        try {
            const online = await isOnline();

            if (online) {
                // 🔥 Eliminar en la API
                const response = await api.delete(`/variables/${id}`);

                // 🔥 Eliminar en `localStorage`
                let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
                cacheData.data = cacheData.data.filter(variable => variable.id !== id);
                localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

                return response;
            } else {
                // 🔥 Si no hay internet, eliminar solo en `localStorage`
                console.warn("🚨 No hay internet. Intentando eliminar localmente...");

                let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };

                if (!cacheData.data.length) {
                    console.error("⚠️ No hay variables en `localStorage`.");
                    throw new Error("La variable no se encontró en localStorage.");
                }

                cacheData.data = cacheData.data.filter(variable => variable.id !== id);
                localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

                console.warn(`✅ Variable ${id} eliminada de LocalStorage.`);
                return { message: "Eliminada localmente." };
            }
        } catch (error) {
            console.error('❌ Error al eliminar la variable:', error.message);
            throw error;
        }
    },
};

export default VariablesService;


