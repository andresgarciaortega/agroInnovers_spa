// services/production-space.js

import api from './ApiService';

const EspacioService = {


    // LISTAR TODAS los s de espacio
    async getAllEspacio(idcompany = 0) {
        try {
            const response = await api.get(`/production-space?page=1&limit=100&company=${idcompany}`);
            console.log('response', response)
            return response.data;
        } catch (error) {
            console.error('Error al obtener los s de espacio:', error);
            throw error;
        }
    },
    async getAllStage() {
        try {
            const response = await api.get('/stages/');
            return response.data;
        } catch (error) {
            console.error('Error al obtener las etapas:', error);
            throw error;
        }
    },
    async getEspacioById(id) {
        try {
            const response = await api.get(`/production-space/${id}`);
            return response;
        } catch (error) {
            console.error('Error al obtener los espacios:', error);
            throw error;
        }
    },

    // CREAR los s de espacio
    async createEspacio(data) {
        try {
            const response = await api.post('/production-space/', data);
            return response;
        } catch (error) {
            // Extraer el mensaje del error
            const errorMessage = error.response?.data?.message?.message || 'Error desconocido al crear los s de espacio.';

            // Retornar un objeto que incluya el mensaje y el código de estado
            throw {
                statusCode: error.response?.status || 500, // Si no hay un estado, por defecto 500
                message: errorMessage,
            };
        }
    },



    // ACTUALIZAR los s de espacio
    async updateEspacio(id, data) {
        try {
            const response = await api.put(`/production-space/${id}`, data);
            console.log('datos de actualiacion estapios', response)
            return response.data;
        } catch (error) {
            console.error('Error al actualizar los s de espacio:', error);
            throw error;
        }
    },

    async updateControl(id, data) {
        try {
            const response = await api.put(`/production-space/update_measure//${id}`, data);
            console.log('datos de actualiacion control y medicion de la variable', response)
            return response.data;
        } catch (error) {
            console.error('Error al actualizar e control y medicion de la variable:', error);
            throw error;
        }
    },



    async deleteEspacio(id) {
        try {
            const response = await api.delete(`/production-space/${id}`);
            return response;

        } catch (error) {
            console.error('Error al eliminar los s de espacio:', error);
            throw error;
        }
    },

};

export default EspacioService;
