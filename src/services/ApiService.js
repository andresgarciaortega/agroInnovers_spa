// // services/ApiService.js

// // const BASE_URL = import.meta.env.VITE_API_BASE_URL; // Cambia a VITE_API_BASE_URL
// const BASE_URL =  'https://api-agroinnovers-bf0735da2c1c.herokuapp.com';
// // const BASE_URL = 'https://agroinnovers-e9f12d4deefa.herokuapp.com' 
// // const BASE_URL = 'https://l9b59ve1ri.execute-api.us-east-1.amazonaws.com/master'

// const TIMEOUT = 5000; // Timeout en milisegundos

// // Función de ayuda para realizar solicitudes con `fetch` y timeout
// const fetchWithTimeout = (url, options = {}, timeout = TIMEOUT) => {
//     return new Promise((resolve, reject) => {
//         const timer = setTimeout(() => reject(new Error('Request timed out')), timeout);
//         fetch(url, options)
//             .then(response => {
//                 clearTimeout(timer);
//                 if (!response.ok) {
//                     if (response.status === 401) {
//                         // Manejo de errores 401 (no autorizado)
//                         // Podemos redirigir a la página de login o mostrar un mensaje
//                     }
//                     reject(new Error(`HTTP error! status: ${response.status}`));
//                 } else {
//                     resolve(response.json());
//                 }
//             })
//             .catch(error => {
//                 clearTimeout(timer);
//                 reject(error);
//             });
//     });
    
// };

// // Función para agregar el token al encabezado de la solicitud
// const createAuthHeaders = () => {
//     const token = localStorage.getItem('authToken');
//     return token ? { Authorization: `Bearer ${token}` } : {};
// };

// // Función genérica para hacer solicitudes
// const api = {
//     get: (endpoint) => {
//         return fetchWithTimeout(`${BASE_URL}${endpoint}`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 ...createAuthHeaders(),
//             },
//         });
//     },
//     post: (endpoint, data) => {
//         return fetchWithTimeout(`${BASE_URL}${endpoint}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 ...createAuthHeaders(),
//             },
//             body: JSON.stringify(data),
//         });
//     },
//     put: (endpoint, data) => {
//         return fetchWithTimeout(`${BASE_URL}${endpoint}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//                 ...createAuthHeaders(),
//             },
//             body: JSON.stringify(data),
//         });
//     },
//     delete: (endpoint) => {
//         return fetchWithTimeout(`${BASE_URL}${endpoint}`, {
//             method: 'DELETE',
//             headers: {
//                 'Content-Type': 'application/json',
//                 ...createAuthHeaders(),
//             },
//         });
//     },
// };
const BASE_URL = 'https://agroinnovers-fdbf30f0b339.herokuapp.com/';
const TIMEOUT = 5000;

// 📌 Función para verificar conexión a Internet
const isOnline = async () => {
    try {
        await fetch('https://www.google.com', { mode: 'no-cors' });
        return true;
    } catch {
        return false;
    }
};

// 📌 Función para generar una clave de caché uniforme
const generateCacheKey = (endpoint) => {
    // 🔥 Asegurarse de que no tenga `/` al final y eliminar parámetros de query
    return `cache_${endpoint.replace(/\/$/, '').split('?')[0]}`;
};

// 📌 Funciones auxiliares para `localStorage`
const saveToLocalStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const getFromLocalStorage = (key) => JSON.parse(localStorage.getItem(key)) || { data: [] };

// 📌 Función genérica para hacer solicitudes con timeout
const fetchWithTimeout = (url, options, timeout = TIMEOUT) => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Request timed out')), timeout);
        fetch(url, options)
            .then(response => {
                clearTimeout(timer);
                if (!response.ok) reject(new Error(`HTTP error! status: ${response.status}`));
                resolve(response.json());
            })
            .catch(error => {
                clearTimeout(timer);
                reject(error);
            });
    });
};

const createAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// 📌 API Mejorada
const api = {
    get: async (endpoint, params = {}) => {
        const cacheKey = generateCacheKey(endpoint); // 🔥 Clave uniforme
        console.log("nombre arreglo localstorage  get : " , cacheKey)
        try {
            const online = await isOnline();
            if (online) {
                const url = `${BASE_URL}${endpoint}${Object.keys(params).length ? `?${new URLSearchParams(params)}` : ''}`;
                const data = await fetchWithTimeout(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...createAuthHeaders(),
                    },
                });

                saveToLocalStorage(cacheKey, data);
                return data;
            } else {
                return getFromLocalStorage(cacheKey);
            }
        } catch (error) {
            console.error('Error en GET:', error);
            throw error;
        }
    },

    post: async (endpoint, data) => {
        const cacheKey = generateCacheKey(endpoint); // 🔥 Clave uniforme
        console.log("nombre arreglo localstorage  post: " , cacheKey)

        try {
            const online = await isOnline();
            if (online) {
                const response = await fetchWithTimeout(`${BASE_URL}${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...createAuthHeaders(),
                    },
                    body: JSON.stringify(data),
                });

                return response;
            } else {
                let cacheData = getFromLocalStorage(cacheKey);
                if (!cacheData) {
                    cacheData = { data: [] }; // Asegurar que cacheData existe
                }
                // Obtener el ID máximo existente en la caché
                const maxId = cacheData.data.length > 0 ? Math.max(...cacheData.data.map(item => item.id)) : 10000;
                // Extraer el company_id del último registro o usar 1 como fallback
                const lastItem = cacheData.data.find(item => item.id === maxId);
                const codigo_empresa = lastItem ? lastItem.company_id : 1;
                // Generar el nuevo ID local basado en la empresa
                const localId = codigo_empresa * 1000 + (cacheData.data.length + 1);
                const newItem = { ...data, id: localId };
                cacheData.data.push(newItem);
                saveToLocalStorage(cacheKey, cacheData);
                console.warn("🚨 No hay internet. Datos guardados en LocalStorage con ID:", localId);
                return newItem;
            }
        } catch (error) {
            console.error('Error en POST:', error);
            throw error;
        }
    },

    put: async (endpoint, data) => {
        const cacheKey = generateCacheKey(endpoint); // 🔥 Clave uniforme

        try {
            const online = await isOnline();
            if (online) {
                const response = await fetchWithTimeout(`${BASE_URL}${endpoint}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        ...createAuthHeaders(),
                    },
                    body: JSON.stringify(data),
                });

                return response;
            } else {
                let cacheData = getFromLocalStorage(cacheKey);
                const index = cacheData.data.findIndex(item => item.id === data.id);

                if (index !== -1) {
                    cacheData.data[index] = { ...cacheData.data[index], ...data };
                    saveToLocalStorage(cacheKey, cacheData);
                    console.warn("🚨 No hay internet. Datos actualizados en LocalStorage:", data.id);
                    return cacheData.data[index];
                } else {
                    throw new Error("No se encontró el elemento en LocalStorage.");
                }
            }
        } catch (error) {
            console.error('Error en PUT:', error);
            throw error;
        }
    },

    delete: async (endpoint, id) => {
        const cacheKey = generateCacheKey(endpoint); // 🔥 Clave uniforme

        try {
            const online = await isOnline();
            if (online) {
                const response = await fetchWithTimeout(`${BASE_URL}${endpoint}/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        ...createAuthHeaders(),
                    },
                });

                return response;
            } else {
                let cacheData = getFromLocalStorage(cacheKey);
                cacheData.data = cacheData.data.filter(item => item.id !== id);
                saveToLocalStorage(cacheKey, cacheData);
                console.warn("🚨 No hay internet. Datos eliminados en LocalStorage:", id);
                return { message: "Eliminado localmente." };
            }
        } catch (error) {
            console.error('Error en DELETE:', error);
            throw error;
        }
    },
};

export default api;
