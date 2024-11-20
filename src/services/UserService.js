// services/users.js

import api from './ApiService';

const UsersService = {


    // LISTAR TODAS LAS USUARIOS
    async getAllUser(idcompany = 0) {
        try {
            const response = await api.get(`/users?companyId=${idcompany}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            throw error;
        }
    },

    // CREAR UNA USUARIO
    async createUser(data) {
        try {
            const response = await api.post('/users/', data);
            return response;
        } catch (error) {

            // Extraer el mensaje del error
            const errorMessage = error.response?.data?.message?.message || 'Error desconocido al crear al usuario.';

            // Retornar un objeto que incluya el mensaje y el código de estado
            throw {
                statusCode: error.response?.status || 500, // Si no hay un estado, por defecto 500
                message: errorMessage,
            };
        }
    },



    // ACTUALIZAR UNA USUARIO
    async updateUser(id, data) {
        try {
            const response = await api.put(`/users/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            throw error;
        }
    },



    async deleteUser(id) {
        try {
            const response = await api.delete(`/users/${id}`);
            return response;

        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            throw error;
        }
    },

       // USCAR USUARIO POR EMAIL
       async getUserEmail(email) {
        try {
            const response = await api.get('/users/email/'+email);
            return response;
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            throw error;
        }
    },

       // USCAR USUARIO POR DOCUMENTO
       async getUserDocument(document) {
        try {
            const response = await api.get('/users/document/'+document);
            return response;
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            throw error;
        }
    },
};

export default UsersService;
