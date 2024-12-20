// services/actuator-calibration.js

import api from './ApiService';

const ActuadorCalibradorService = {


    // LISTAR TODAS LAS varibles
    async getAllMantenimiento(idcompany = 0) {
        try {
            const response = await api.get(`/actuator-calibration?company=${idcompany}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener las actuator-calibration:', error);
            throw error;
        }
    },
    async getMantenimientoByactuador(actuadorId) {
        try {
            const response = await api.get(`/actuator-calibration?search=${encodeURIComponent(JSON.stringify({actuator:{id:actuadorId}}))}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener los mantenimientos del actuator:', error);
            throw error;
        }
    },

    // CREAR UNA mantenimiento
    async createMantenimiento(data) {
        try {
            const response = await api.post('/actuator-calibration/', data);
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
            const response = await api.put(`/actuator-calibration/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar la mantenimiento:', error);
            throw error;
        }
    },



    async deleteMantenimiento(id) {
        try {
            const response = await api.delete(`/actuator-calibration/${id}`);
            return response;

        } catch (error) {
            console.error('Error al eliminar la mantenimiento:', error);
            throw error;
        }
    },

};

export default ActuadorCalibradorService;
