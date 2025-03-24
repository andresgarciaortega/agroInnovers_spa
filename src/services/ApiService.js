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



const BASE_URL = 'https://agroinnovers-fdbf30f0b339.herokuapp.com';
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

// 📌 Función para guardar en localStorage
// const saveToLocalStorage = (key, data) => {
//     console.log("🔹 Guardando en LocalStorage. Key:", key);
//     console.log("📦 Datos antes de guardar:", JSON.stringify(data, null, 2));
//     localStorage.setItem(key, JSON.stringify(data));

//     // 🔍 Verificar que realmente se guardó correctamente
//     const checkSaved = localStorage.getItem(key);
//     console.log("✅ Verificación: Datos guardados en LocalStorage:", checkSaved);
// };

// // 📌 Función para obtener de localStorage
// const getFromLocalStorage = (key) => {
//     console.log("🔍 Obteniendo datos de LocalStorage. Key:", key);
//     const data = localStorage.getItem(key);

//     if (!data) {
//         console.warn("⚠️ No hay datos en LocalStorage para esta clave:", key);
//         return { data: [] };
//     }

//     try {
//         const parsedData = JSON.parse(data);
//         console.log("📥 Datos obtenidos de LocalStorage:", parsedData);

//         // 🔥 Verificar si hay `null` en el arreglo y eliminarlo
//         parsedData.data = parsedData.data.filter(item => item !== null && item !== undefined);
//         console.log("📥 Datos después de limpiar null:", parsedData);

//         return parsedData;
//     } catch (error) {
//         console.error("❌ Error al parsear los datos de LocalStorage:", error);
//         return { data: [] };
//     }
// };





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
        console.log("nombre local sin internet antes", cacheKey)

        try {
            const online = await isOnline();
            if (online) {
                console.log("nombre local . ", cacheKey)
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
                console.log("nombre local sin internet sin internet", cacheKey)
                // 🔥 Obtener datos desde `localStorage`
                let cachedData = getFromLocalStorage(cacheKey);
                console.log("nombre arreglo : ", cachedData)
                if (!cachedData || !cachedData.data) return { data: [] };
                console.log("datos del arreglo : ", cachedData.data)
                return cachedData;
            }
        } catch (error) {
            console.error('Error en GET:', error);
            throw error;
        }
    },

    post: async (endpoint, data) => {
        const cacheKey = generateCacheKey(endpoint); // 🔥 Clave uniforme

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
                let cacheData = getFromLocalStorage(cacheKey) || { data: [] };
                console.log(cacheKey)

                // Filtrar los registros que pertenezcan a la empresa actual
                const companyRecords = cacheData.data.filter(item => item.company_id === data.company_id);

                let newId;
                if (companyRecords.length === 0) {
                    // 📌 Si NO hay registros de la empresa, genera el primer ID basado en company_id
                    newId = data.company_id * 1000 + 1;
                } else {
                    // 📌 Si YA existen registros, busca el ID más alto y súmale 1
                    const maxId = Math.max(...companyRecords.map(item => item.id));
                    newId = maxId + 1;
                }

                // 📌 Crear el nuevo objeto con el ID generado
                const newItem = { ...data, id: newId };
                cacheData.data.push(newItem);
                console.log(newItem)
                console.log(cacheData.data)

                // 📌 Guardar en localStorage
                saveToLocalStorage(cacheKey, cacheData);
                console.warn("🚨 No hay internet. Datos guardados en LocalStorage con ID:", newId);

                // 🛠 Verificar si realmente se guardó correctamente
                const checkCache = getFromLocalStorage(cacheKey);
                console.log("🔄 Verificación de LocalStorage después de guardar:", checkCache);

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
                console.log("nombre arreglo : ", cacheData)
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
                const response = await fetchWithTimeout(`${BASE_URL}${endpoint}${id ? `/${id}` : ''}`, {
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
