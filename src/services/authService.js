// services/companies.js

import api from './ApiService';

const AccesUser = {

    // LOGIN - ACCESS USER
    async accesUsersLoguin(data) {
        try {
            const response = await api.post('/auth/login/', data);
            return { error: true, response: response.access_token }; // Asegúrate de acceder a response.data
        } catch (error) {
            // Captura el error 401 Unauthorized
            if (error.response && error.response.status === 401) {
                return { error: false, message: 'Credenciales incorrectas. Por favor, inténtalo de nuevo.' };
            }
            // Captura otros errores
            else if (error.response && error.response.data && error.response.data.message) {
                return { error: false, message: error.response.data.message };
            } else {
                return { error: false, message: 'Credenciales incorrectas. Por favor, inténtalo de nuevo.' };
            }
        }
    },

     // LOGIN - ACCESS USER
     async getUUID() {
        try {
            const response = await api.get('http://localhost:1880/serial_id');
            return response; // Asegúrate de acceder a response.data
        } catch (error) {
            // Captura el error 401 Unauthorized
            if (error.response && error.response.status === 404) {
                return { error: false, message: 'No estas en la raspberry' };
            }
            // Captura otros errores
            else if (error.response && error.response.data && error.response.data.message) {
                return { error: false, message: error.response.data.message };
            } else {
                return { error: false, message: 'No estas en la raspberry' };
            }
        }
    },

    // FORGOT PASSWORD - 
    async recoveryPassword(data) {
        try {
            const response = await api.post('/auth/forgot-password', data);
            return response;
        } catch (error) {
            // Revisa si el error tiene una respuesta y el mensaje de error está en la respuesta
            if (error.response && error.response.data) {
                const { statusCode, message, error: errorType } = error.response.data;
                // Devuelve el mensaje de error como una respuesta
                return { success: false, statusCode, message, error: errorType };
            } else {
                // Si no hay una respuesta específica, devuelve un mensaje genérico
                return { success: false, message: 'Lo sentimos! credenciales incorrectas, intente nuevamente' };
            }
        }
    },

    // FORGOT PASSWORD - 
    async ResetPasswordUser(newPassword, token) {
        try {
            const response = await api.post(`/auth/reset-password?token=${token}`, { newPassword });
            return { success: true, data: response.success };
        } catch (error) {
            if (error.response && error.response.data) {
                const { statusCode, message, error: errorType } = error.response.data;
                return { success: false, statusCode, message, error: errorType };
            } else {
                return { success: false, message: 'Lo sentimos! credenciales incorrectas, intente nuevamente' };
            }
        }
    }
    


};

export default AccesUser;
