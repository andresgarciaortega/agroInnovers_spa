// services/actuators.js

import api from './ApiService';

const ActuadorService = {


    // LISTAR TODAS LAS varibles
    async getAllActuador(idcompany = 0, searchParameter) {
        try {
            const response = await api.get(`/actuators?page=1&limit=1000&company=${idcompany}&search=${encodeURIComponent(JSON.stringify(searchParameter))}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener las actuators:', error);
            throw error;
        }
    },
    async getActuadorById(id) {
        try {
            const response = await api.get(`/actuators/${id}`);
            return response;
        } catch (error) {
            console.error('Error al obtener los actuadores:', error);
            throw error;
        }
    },

    // CREAR UNA sensor
    async createActuador(data) {
        try {
            const response = await api.post('/actuators/', data);
            return response;
        } catch (error) {
            // Extraer el mensaje del error
            const errorMessage = error.response?.data?.message?.message || 'Error desconocido al crear la sensor.';

            // Retornar un objeto que incluya el mensaje y el código de estado
            throw {
                statusCode: error.response?.status || 500, // Si no hay un estado, por defecto 500
                message: errorMessage,
            };
        }
    },



    // ACTUALIZAR UNA sensor
    async updateActuador(id, data) {
        try {
            const response = await api.put(`/actuators/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar la sensor:', error);
            throw error;
        }
    },



    async deleteActuador(id) {
        try {
            const response = await api.delete(`/actuators/${id}`);
            return response;

        } catch (error) {
            console.error('Error al eliminar la sensor:', error);
            throw error;
        }
    },


    async getActuadorByIdCode(id, company) {
        try {
            const response = await api.get(`/actuators/code/${id}?company=${company}`);
            return response;
        } catch (error) {
            console.error('Error al obtener los actuadores:', error);
            throw error;
        }
    },

};

export default ActuadorService;
