// services/calibrations.js

import api from './ApiService';

const SensorCalibradorService = {


    // LISTAR TODAS LAS varibles
    async getAllMantenimiento(idcompany = 0) {
        try {
            const response = await api.get(`/calibrations?page=1&limit=1000&company=${idcompany}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener las calibrations:', error);
            throw error;
        }
    },
    async getMantenimientoBysensor(sensorId) {
        try {
            const response = await api.get(`/calibrations?search=${encodeURIComponent(JSON.stringify({sensor:{id:sensorId}}))}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener los calibradores de sensor:', error);
            throw error;
        }
    },


      // LISTAR LOS MANTENIMIENTOS DE LOS SENSORES
      async getCalibracionBySensorAll(sensorId) {
        try {
            const response = await api.get(`/calibrations/sensor/${sensorId}`);
            return response;
        } catch (error) {
            console.error('Error al obtener los mantenimientos del sensor:', error);
            throw error;
        }
    },


    
    // CREAR UNA mantenimiento
    async createMantenimiento(data) {
        try {
            const response = await api.post('/calibrations/', data);
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
            const response = await api.put(`/calibrations/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar la mantenimiento:', error);
            throw error;
        }
    },



    async deleteMantenimiento(id) {
        try {
            const response = await api.delete(`/calibrations/${id}`);
            return response;

        } catch (error) {
            console.error('Error al eliminar la mantenimiento:', error);
            throw error;
        }
    },

};

export default SensorCalibradorService;
