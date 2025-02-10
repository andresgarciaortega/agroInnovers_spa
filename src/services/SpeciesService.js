// services/categories.js

import api from './ApiService';

const SpeciesService = {
    // LISTAR TODAS LAS CATEGORÍAS
    async getAllSpecie(idcompany = 0, searchParameter) {
        try {
            const response = await api.get(`/species?page=1&limit=100&company=${idcompany}&search=${encodeURIComponent(JSON.stringify(searchParameter))}`);
            // console.log('busqueda:',searchParameter )
            return response.data;

        } catch (error) {
            console.error('Error al obtener las Especies:', error);
            throw error;
        }
    },
    async getVariableBySpecie(searchParameter) {
        try {
            const response = await api.get(`/variables?search=${encodeURIComponent(JSON.stringify(searchParameter))}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener loas variables de esta especie :', error);
            throw error;
        }
    },

  

    // OBTENER UNA CATEGORÍA POR ID
    async getSpecieById(id) {
        try {
            const response = await api.get(`/species/${id}`);
            return response;
        } catch (error) {
            console.error('Error al obtener la especies:', error);
            throw error;
        }
    },

    // CREAR UNA CATEGORÍA
    async createSpecie(data) {
        try {
            const response = await api.post('/species/', data);
            return response;
        } catch (error) {
            console.error('Error al crear la especies:', error);
            throw error;
        }
    },

    // ACTUALIZAR UNA CATEGORÍA
    async updateSpecie(id, data) {
        try {
            const response = await api.put(`/species/${id}`, data);
            return response;
        } catch (error) {
            console.error('Error al actualizar la especies:', error);
            throw error;
        }
    },

    // ELIMINAR UNA CATEGORÍA
    async deleteSpecie(id) {
        try {
            const response = await api.delete(`/species/${id}`);
            return response;
        } catch (error) {
            console.error('Error al eliminar la especies:', error);
            throw error;
        }
    },
};

export default SpeciesService;
