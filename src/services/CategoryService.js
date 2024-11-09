// services/categories.js

import api from './ApiService';


const CategoryServices = {


    // LISTAR TODAS LAS COMPAÑIAS
    async getAllCategory() {
        try {
            const response = await api.get('/categories/');
            return response;
        } catch (error) {
            console.error('Error al obtener las categorias:', error);
            throw error;
        }
    },


    // CREAR UNA COMPAÑIA
    async createCategory(data) {
        try {
            const response = await api.post('/categories/', data);
            return response;
        } catch (error) {
            console.error('Error al crear la categoria:', error);
            throw error;
        }
    },



    // ACTUALIZAR UNA COMPAÑIA
    async updateCategory(id, data) {
        try {
            const response = await api.put(`/categories/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar la categoria:', error);
            throw error;
        }
    },



    async deleteCategory(id) {
        try {
            const response = await api.delete(`/categories/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar la categoria:', error);
            throw error;
        }
    },
};

export default CategoryServices;
