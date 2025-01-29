// services/ApiService.js

// const BASE_URL = import.meta.env.VITE_API_BASE_URL; // Cambia a VITE_API_BASE_URL
// const BASE_URL =  'http://localhost:3000';
// const BASE_URL = 'https://agroinnovers-e9f12d4deefa.herokuapp.com' 
const BASE_URL = 'https://l9b59ve1ri.execute-api.us-east-1.amazonaws.com/master/'

const TIMEOUT = 5000; // Timeout en milisegundos

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
                        // Podemos redirigir a la página de login o mostrar un mensaje
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

// Función genérica para hacer solicitudes
const api = {
    get: (endpoint) => {
        return fetchWithTimeout(`${BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...createAuthHeaders(),
            },
        });
    },
    post: (endpoint, data) => {
        return fetchWithTimeout(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...createAuthHeaders(),
            },
            body: JSON.stringify(data),
        });
    },
    put: (endpoint, data) => {
        return fetchWithTimeout(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...createAuthHeaders(),
            },
            body: JSON.stringify(data),
        });
    },
    delete: (endpoint) => {
        return fetchWithTimeout(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...createAuthHeaders(),
            },
        });
    },
};

export default api;
