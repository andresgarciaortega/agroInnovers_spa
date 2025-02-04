// services/sensors.js

import api from './ApiService';

const SensorService = {


    // LISTAR TODAS LAS varibles
    async getAllSensor(idcompany = 0,searchParameter) {
        try {
            const response = await api.get(`/sensors?company=${idcompany}&search=${encodeURIComponent(JSON.stringify(searchParameter))}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener las sensors:', error);
            throw error;
        }
    },
    async getSensorById(id) {
        try {
            const response = await api.get(`/sensors/${id}`);
            return response;
        } catch (error) {
            console.error('Error al obtener los sensores:', error);
            throw error;
        }
    },

    // CREAR UNA sensor
    async createSensor(data) {
        try {
            const response = await api.post('/sensors/', data);
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
    async updateSensor(id, data) {
        try {
            const response = await api.put(`/sensors/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar la sensor:', error);
            throw error;
        }
    },



    async deleteSensor(id) {
        try {
            const response = await api.delete(`/sensors/${id}`);
            return response;

        } catch (error) {
            console.error('Error al eliminar la sensor:', error);
            throw error;
        }
    },

};

export default SensorService;
