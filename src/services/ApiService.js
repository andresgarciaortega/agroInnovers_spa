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

// export default api;



// services/ApiService.js

const BASE_URL = 'https://api-agroinnovers-bf0735da2c1c.herokuapp.com';
const TIMEOUT = 5000; // Timeout en milisegundos

// Función para verificar la conexión a Internet
const isOnline = async () => {
    try {
        const response = await fetch('https://www.google.com', { mode: 'no-cors' });
        return true;
    } catch (error) {
        return false;
    }
};

// Función de ayuda para realizar solicitudes con `fetch` y timeout
const fetchWithTimeout = (url, options = {}, timeout = TIMEOUT) => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Request timed out')), timeout);
        fetch(url, options)
            .then(response => {
                clearTimeout(timer);
                if (!response.ok) {
                    if (response.status === 401) {
                        // Manejo de errores 401 (no autorizado)
                    }
                    reject(new Error(`HTTP error! status: ${response.status}`));
                } else {
                    resolve(response.json());
                }
            })
            .catch(error => {
                clearTimeout(timer);
                reject(error);
            });
    });
};

// Función para agregar el token al encabezado de la solicitud
const createAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Función para guardar datos en el localStorage
const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// Función para obtener datos del localStorage
const getFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

// Función para generar una clave de caché única basada en el endpoint y los parámetros
const generateCacheKey = (endpoint, params = {}) => {
    const paramsString = Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&');
    return `cache_${endpoint}${paramsString ? `?${paramsString}` : ''}`;
};

// Función genérica para hacer solicitudes
const api = {
    get: async (endpoint, params = {}) => {
        const cacheKey = generateCacheKey(endpoint, params); // Generar clave de caché

        // Excluir el endpoint de login de la lógica de caché
        if (endpoint === '/login') {
            // Forzar la solicitud a la API sin verificar conexión ni usar caché
            const url = `${BASE_URL}${endpoint}${Object.keys(params).length ? `?${new URLSearchParams(params)}` : ''}`;
            return fetchWithTimeout(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...createAuthHeaders(),
                },
            });
        }

        try {
            // Verificar si hay conexión a Internet
            const online = await isOnline();

            if (online) {
                // Si hay conexión, hacer la solicitud a la API
                const url = `${BASE_URL}${endpoint}${Object.keys(params).length ? `?${new URLSearchParams(params)}` : ''}`;
                const data = await fetchWithTimeout(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...createAuthHeaders(),
                    },
                });

                // Guardar los datos en el localStorage para uso futuro
                saveToLocalStorage(cacheKey, data);
                return data;
            } else {
                // Si no hay conexión, intentar obtener los datos del localStorage
                const cachedData = getFromLocalStorage(cacheKey);
                if (cachedData) {
                    return cachedData; // Devolver datos en caché
                } else {
                    throw new Error('No hay conexión a Internet y no hay datos en caché.');
                }
            }
        } catch (error) {
            console.error('Error en la solicitud GET:', error);
            throw error;
        }
    },
    post: async (endpoint, data) => {
        // Excluir el endpoint de login de la lógica de caché
        if (endpoint === '/login') {
            // Forzar la solicitud a la API sin verificar conexión ni usar caché
            return fetchWithTimeout(`${BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...createAuthHeaders(),
                },
                body: JSON.stringify(data),
            });
        }

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
                throw new Error('No hay conexión a Internet. No se puede realizar la solicitud POST.');
            }
        } catch (error) {
            console.error('Error en la solicitud POST:', error);
            throw error;
        }
    },
    put: async (endpoint, data) => {
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
                throw new Error('No hay conexión a Internet. No se puede realizar la solicitud PUT.');
            }
        } catch (error) {
            console.error('Error en la solicitud PUT:', error);
            throw error;
        }
    },
    delete: async (endpoint) => {
        try {
            const online = await isOnline();

            if (online) {
                const response = await fetchWithTimeout(`${BASE_URL}${endpoint}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        ...createAuthHeaders(),
                    },
                });

                return response;
            } else {
                throw new Error('No hay conexión a Internet. No se puede realizar la solicitud DELETE.');
            }
        } catch (error) {
            console.error('Error en la solicitud DELETE:', error);
            throw error;
        }
    },
};

export default api;