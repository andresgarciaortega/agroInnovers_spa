// services/variables.js

import api from './ApiService';

const VariablesService = {


    // LISTAR TODAS LAS varibles
    async getAllVariable() {
        try {
            const response = await api.get('/variables/');
            return response.data;
        } catch (error) {
            console.error('Error al obtener las variables:', error);
            throw error;
        }
    },

    // CREAR UNA variable
    async createVariable(data) {
        try {
            const response = await api.post('/variables/', data);
            return response;
        } catch (error) {
            // Extraer el mensaje del error
            const errorMessage = error.response?.data?.message?.message || 'Error desconocido al crear la variable.';

            // Retornar un objeto que incluya el mensaje y el código de estado
            throw {
                statusCode: error.response?.status || 500, // Si no hay un estado, por defecto 500
                message: errorMessage,
            };
        }
    },



    // ACTUALIZAR UNA variable
    async updateVariable(id, data) {
        try {
            const response = await api.put(`/variables/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar la variable:', error);
            throw error;
        }
    },



    async deleteVariable(id) {
        try {
            const response = await api.delete(`/variables/${id}`);
            return response;

        } catch (error) {
            console.error('Error al eliminar la variable:', error);
            throw error;
        }
    },

};

export default VariablesService;
