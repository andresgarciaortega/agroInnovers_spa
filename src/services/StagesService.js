// services/categories.js

import api from './ApiService';

const StagesService = {
    // LISTAR TODAS LAS ETAPAS
    async getAllStages() {
        try {
            const response = await api.get(`/stages?page=1&limit=10000`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener las etapas:', error);
            throw error;
        }
    },

    // OBTENER UNA ETAPA POR ID
    async getStagesById(id) {
        try {
            const response = await api.get(`/stages/${id}`);
            return response;
        } catch (error) {
            console.error('Error al obtener la etapa:', error);
            throw error;
        }
    },

    // CREAR UNA ETAPA
    async createStages(data) {
        try {
            const response = await api.post('/stages/', data);
            return response;
        } catch (error) {
            console.error('Error al crear la etapa:', error);
            throw error;
        }
    },

    // ACTUALIZAR UNA ETAPA
    async updateStages(id, data) {
        try {
            const response = await api.put(`/stages/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar la etapa:', error);
            throw error;
        }
    },

    

    // ELIMINAR UNA ETAPA
    async deleteStages(id) {
        try {
            const response = await api.delete(`/stages/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar la etapa:', error);
            throw error;
        }
    },

    
};

export default StagesService;
