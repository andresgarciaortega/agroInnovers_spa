// services/users.js

import api from './ApiService';

const SystemMonitory = {


    // LISTAR TODAS LAS tipo de variableS
    async getAllMonitories(idcompany = 0) {
        try {
            const response = await api.get(`/sistemas?company=${idcompany}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener los sistemas:', error);
            throw error;
        }
    },
    async getMotitoriesById(id) {
        try {
            const response = await api.get(`/sistemas/${id}`);
            return response;
        } catch (error) {
            console.error('Error al obtener los sistemas:', error);
            throw error;
        }
    },

    async getMotitoriesByUUID(id) {
        try {
            const response = await api.get(`/sistemas/uuid/${id}`);
            return response;
        } catch (error) {
            console.error('Error al obtener los sistemas:', error);
            throw error;
        }
    },


    // CREAR UNA tipo de variable
    async createMonitories(data) {
        try {
            const response = await api.post('/sistemas/', data);
            return response;
        } catch (error) {
            // Extraer el mensaje del error
            const errorMessage = error.response?.data?.message?.message || 'Error desconocido al crear el tipo de variable.';
            // Retornar un objeto que incluya el mensaje y el código de estado
            throw {
                statusCode: error.response?.status || 500, // Si no hay un estado, por defecto 500
                message: errorMessage,
            };
        }
    },



    // ACTUALIZAR UNA tipo de variable
    async updateMonitories(id, data) {
        try {
            const response = await api.put(`/sistemas/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar el tipo de variable:', error);
            throw error;
        }
    },



    async deleteMonitories(id) {
        try {
            const response = await api.delete(`/sistemas/${id}`);
            return {success:true, response}; // Devuelve los datos de la respuesta en caso de éxito
        } catch (error) {
            // Extrae el mensaje del error enviado por el backend
            const errorMessage = error.response?.data?.message || 'Error desconocido al eliminar el tipo de variable.';
            
            // Lanza un objeto con el mensaje y el código de estado
            throw {
                statusCode: error.response?.status || 500, // Si no hay un estado, asume error del servidor
                message: errorMessage,
            };
        }
    },
    

      
};

export default SystemMonitory;
