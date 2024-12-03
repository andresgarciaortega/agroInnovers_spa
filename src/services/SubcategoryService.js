// services/categories.js

import api from './ApiService';

const SubcategoryService = {
    // LISTAR TODAS LAS SUBCATEGORÍAS
    async getAllSubcategory() {
        try {
            const response = await api.get(`/subcategories`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener las subcategorías:', error);
            throw error;
        }
    },

    // OBTENER UNA SUBCATEGORÍA POR ID
    async getSubcategoryById(id) {
        try {
            const response = await api.get(`/subcategories/${id}`);
            return response;
        } catch (error) {
            console.error('Error al obtener la subcategoría:', error);
            throw error;
        }
    },

    // CREAR UNA SUBCATEGORÍA
    async createSubcategory(data) {
        try {
            const response = await api.post('/subcategories/', data);
            return response;
        } catch (error) {
            console.error('Error al crear la subcategoría:', error);
            throw error;
        }
    },

    // ACTUALIZAR UNA SUBCATEGORÍA
    async updateSubcategory(id, data) {
        try {
            const response = await api.put(`/subcategories/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar la subcategoría:', error);
            throw error;
        }
    },

    

    // ELIMINAR UNA SUBCATEGORÍA
    async deleteSubcategory(id) {
        try {
            const response = await api.delete(`/subcategories/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar la subcategoría:', error);
            throw error;
        }
    },

    
};

export default SubcategoryService;
