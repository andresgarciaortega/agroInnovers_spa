// services/production-space-types.js

import api from './ApiService';

const TipoEspacioService = {


    // LISTAR TODAS los tipos de espacio
    async getAlltipoEspacio(idcompany = 0) {
        try {
            const response = await api.get(`/production-space-types?page=1&limit=100&company=${idcompany}`);
            console.log('response', response)
            return response.data;
        } catch (error) {
            console.error('Error al obtener los tipos de espacio:', error);
            throw error;
        }
    },

    // CREAR los tipos de espacio
    async createtipoEspacio(data) {
        try {
            const response = await api.post('/production-space-types/', data);
            return response;
        } catch (error) {
            // Extraer el mensaje del error
            const errorMessage = error.response?.data?.message?.message || 'Error desconocido al crear los tipos de espacio.';

            // Retornar un objeto que incluya el mensaje y el código de estado
            throw {
                statusCode: error.response?.status || 500, // Si no hay un estado, por defecto 500
                message: errorMessage,
            };
        }
    },



    // ACTUALIZAR los tipos de espacio
    async updatetipoEspacio(id, data) {
        try {
            const response = await api.put(`/production-space-types/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar los tipos de espacio:', error);
            throw error;
        }
    },



    async deletetipoEspacio(id) {
        try {
            const response = await api.delete(`/production-space-types/${id}`);
            return response;

        } catch (error) {
            console.error('Error al eliminar los tipos de espacio:', error);
            throw error;
        }
    },

};

export default TipoEspacioService;
