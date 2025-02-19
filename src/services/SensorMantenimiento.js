// services/maintenance.js

import api from './ApiService';

const SensorMantenimientoService = {


    // LISTAR TODAS LAS varibles
    async getAllMantenimiento(idcompany = 0) {
        try {
            const response = await api.get(`/maintenance?page=1&limit=10000&company=${idcompany}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener las maintenance:', error);
            throw error;
        }
    },
    async getMantenimientoBySensor(sensorId) {
        try {
            const response = await api.get(`/maintenance?search=${encodeURIComponent(JSON.stringify({sensor:{id:sensorId}}))}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener los mantenimientos del sensor:', error);
            throw error;
        }
    },

    // CREAR UNA mantenimiento
    async createMantenimiento(data) {
        try {
            const response = await api.post('/maintenance/', data);
            return response;
        } catch (error) {
            // Extraer el mensaje del error
            const errorMessage = error.response?.data?.message?.message || 'Error desconocido al crear la mantenimiento.';

            // Retornar un objeto que incluya el mensaje y el código de estado
            throw {
                statusCode: error.response?.status || 500, // Si no hay un estado, por defecto 500
                message: errorMessage,
            };
        }
    },



    // ACTUALIZAR UNA mantenimiento
    async updateMantenimiento(id, data) {
        try {
            const response = await api.put(`/maintenance/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar la mantenimiento:', error);
            throw error;
        }
    },



    async deleteMantenimiento(id) {
        try {
            const response = await api.delete(`/maintenance/${id}`);
            return response;

        } catch (error) {
            console.error('Error al eliminar la mantenimiento:', error);
            throw error;
        }
    },

};

export default SensorMantenimientoService;
