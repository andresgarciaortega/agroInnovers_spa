// services/users.js

import api from './ApiService';

const LotsService = {


    async getAllLots(idcompany = 0) {
        try {
            const response = await api.get(`/production-lots?page=1&limit=100&company=${idcompany}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener los tipos de lotes:', error);
            throw error;
        }
    },

    async createLots(data) {
        try {
            const response = await api.post('/production-lots/', data);
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.message?.message || 'Error desconocido al crear los lotes.';
            throw {
                statusCode: error.response?.status || 500, 
                message: errorMessage,
            };
        }
    },



    // ACTUALIZAR UNA tipo de lotes
    async updateLots(id, data) {
        try {
            const response = await api.put(`/production-lots/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar loslotes:', error);
            throw error;
        }
    },
    async updateCosecha(id, data) {
        try {
            const response = await api.put(`/production-lots/edit/harvest/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar las cosechas:', error);
            throw error;
        }
    },



    async deleteLots(id) {
        try {
            const response = await api.delete(`/production-lots/${id}`);
            return response; // Devuelve los datos de la respuesta en caso de éxito
        } catch (error) {
            // Extrae el mensaje del error enviado por el backend
            const errorMessage = error.response?.data?.message || 'Error desconocido al eliminar los lotes.';
            
            // Lanza un objeto con el mensaje y el código de estado
            throw {
                statusCode: error.response?.status || 500, // Si no hay un estado, asume error del servidor
                message: errorMessage,
            };
        }
    },
    

      
};

export default LotsService;
