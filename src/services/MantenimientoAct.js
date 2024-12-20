// services/actuator-maintenance.js

import api from './ApiService';

const ActuadorMantenimientoService = {


    // LISTAR TODAS LAS varibles
    async getAllMantenimiento(idcompany = 0) {
        try {
            const response = await api.get(`/actuator-maintenance?company=${idcompany}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener las actuator-maintenance:', error);
            throw error;
        }
    },
    async getMantenimientoByActuador(actuadorId) {
        try {
            const response = await api.get(`/actuator-maintenance?search=${encodeURIComponent(JSON.stringify({actuator:{id:actuadorId}}))}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener los mantenimientos del actuator:', error);
            throw error;
        }
    },

    // CREAR UNA mantenimiento
    async createMantenimiento(data) {
        try {
            console.log('entre en esto')
            const response = await api.post('/actuator-maintenance/', data);
            console.log('termine en esto', response)

            return response;
        } catch (error) {
            console.error('Error al crear la especies:', error);
            throw error;
        }
    },



    // ACTUALIZAR UNA mantenimiento
    async updateMantenimiento(id, data) {
        try {
            const response = await api.put(`/actuator-maintenance/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar la mantenimiento:', error);
            throw error;
        }
    },



    async deleteMantenimiento(id) {
        try {
            const response = await api.delete(`/actuator-maintenance/${id}`);
            return response;

        } catch (error) {
            console.error('Error al eliminar la mantenimiento:', error);
            throw error;
        }
    },

};

export default ActuadorMantenimientoService;
