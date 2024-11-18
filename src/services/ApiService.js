// services/ApiService.js

const BASE_URL = import.meta.env.VITE_API_BASE_URL; // Cambia a VITE_API_BASE_URL
const TIMEOUT = 5000; // Timeout en milisegundos

// Función de ayuda para manejar el error basado en el código de estado HTTP
const handleError = (response) => {
    switch (response.status) {
        case 401:
            return 'Unauthorized access. Please log in.';
        case 404:
            return 'Resource not found.';
        case 500:
            return 'Internal server error. Please try again later.';
        default:
            return `Error: ${response.status}`;
    }
};

// Función de ayuda para realizar solicitudes con `fetch` y timeout
const fetchWithTimeout = (url, options = {}, timeout = TIMEOUT) => {
    const controller = new AbortController();
    const signal = controller.signal;
    const timer = setTimeout(() => controller.abort(), timeout);

    return fetch(url, { ...options, signal })
        .then(response => {
            clearTimeout(timer);
            if (!response.ok) {
                const errorMessage = handleError(response);
                return Promise.reject(new Error(errorMessage));
            } else {
                return response.json();
            }
        })
        .catch(error => {
            clearTimeout(timer);
            if (error.name === 'AbortError') {
                return Promise.reject(new Error('Request timed out'));
            } else {
                return Promise.reject(error);
            }
        });
};

// Función para agregar el token al encabezado de la solicitud
const createAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        // Si no hay token, puedes manejar un redireccionamiento o una respuesta predeterminada
        return {};
    }
    return { Authorization: `Bearer ${token}` };
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
