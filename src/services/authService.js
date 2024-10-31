// services/companies.js

import api from './ApiService';

const AccesUser = {

    // LOGIN - ACCESS USER
    async accesUsersLoguin(data) {
        try {
            const response = await api.post('/auth/login/', data);
            return { error: true, response: response.access_token};
        } catch (error) {
            // Revisa si el error tiene una respuesta y el mensaje de error está en la respuesta
            if (error.response && error.response.data && error.response.data.message) {
                // console.error('Error al ingresar:', error.response.data.message);
                return { error: false, message: error.response.data.message.message };
            } else {
                // console.error('Lo sentimos! credenciales incorrectas, intente nuevamente');
                return { error: false, message: 'Lo sentimos! credenciales incorrectas, intente nuevamente' };
            }
        }
    },



};

export default AccesUser;
