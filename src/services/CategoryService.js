// services/categories.js

import api from './ApiService';

const CategoryServices = {
    // LISTAR TODAS LAS CATEGORÍAS
    async getAllCategory(idcompany = 0) {
        try {
            const response = await api.get(`/category-species?page=1&limit=100&companyId=${idcompany}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
            throw error;
        }
    },

    // OBTENER UNA CATEGORÍA POR ID
    async getCategoryById(id) {
        try {
            const response = await api.get(`/category-species/${id}`);
            return response;
        } catch (error) {
            console.error('Error al obtener la categoría:', error);
            throw error;
        }
    },

    // CREAR UNA CATEGORÍA
    async createCategory(data) {
        try {
            const response = await api.post('/category-species/', data);
            return response;
        } catch (error) {
            console.error('Error al crear la categoría:', error);
            throw error;
        }
    },

    // ACTUALIZAR UNA CATEGORÍA
    async updateCategory(id, data) {
        try {
            const response = await api.put(`/category-species/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar la categoría:', error);
            throw error;
        }
    },

    

    // ELIMINAR UNA CATEGORÍA
    async deleteCategory(id) {
        try {
            const response = await api.delete(`/category-species/${id}`);
            return response;
        } catch (error) {
            console.error('Error al eliminar la categoría:', error);
            throw error;
        }
    },

    async deleteSubcategory(id) {
        try {
            const response = await api.delete(`/category-species/subcategory/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar la subcategoria:', error);
            throw error;
        }
    },
    async deleteStages(id) {
        try {
            const response = await api.delete(`/category-species/stage/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar la etapa:', error);
            throw error;
        }
    },
    
};

export default CategoryServices;
