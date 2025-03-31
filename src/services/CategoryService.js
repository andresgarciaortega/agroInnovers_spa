// services/categories.js
import api from './ApiService';

const CACHE_KEY = 'cache_/category-species?page=1&limit=10000&company=0';

const CategoryServices = {
    // 📌 LISTAR TODAS LAS CATEGORÍAS
    async getAllCategory(idcompany = 0) {
        try {
            const response = await api.get(`/category-species?page=1&limit=10000&company=${idcompany}`);
            return response;
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
            throw error;
        }
    },

    // 📌 OBTENER UNA CATEGORÍA POR ID
    async getCategoryById(id) {
        try {
            const response = await api.get(`/category-species/${id}`);
            return response;
        } catch (error) {
            console.error('Error al obtener la categoría:', error);
            throw error;
        }
    },

    // 📌 CREAR UNA CATEGORÍA
    async createCategory(data) {
        try {
            const response = await api.post('/category-species/', data);

            // 🔥 Guardar en `localStorage`
            let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
            cacheData.data.push(response);
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

            return response;
        } catch (error) {
            console.error('Error al crear la categoría:', error);
            throw error;
        }
    },

    // 📌 ACTUALIZAR UNA CATEGORÍA
    async updateCategory(id, data) {
        try {
            const response = await api.put(`/category-species/${id}`, data);

            // 🔥 Actualizar `localStorage`
            let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
            const index = cacheData.data.findIndex(category => category.id === id);
            if (index !== -1) {
                cacheData.data[index] = { ...cacheData.data[index], ...response };
                localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
            }

            return response;
        } catch (error) {
            console.error('Error al actualizar la categoría:', error);
            throw error;
        }
    },

    // 📌 ELIMINAR UNA CATEGORÍA
    async deleteCategory(id) {
        try {
            const response = await api.delete(`/category-species/${id}`);

            // 🔥 Eliminar del `localStorage`
            let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
            cacheData.data = cacheData.data.filter(category => category.id !== id);
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

            return response;
        } catch (error) {
            console.error('Error al eliminar la categoría:', error);
            throw error;
        }
    },

    // 📌 ELIMINAR UNA SUBCATEGORÍA
    async deleteSubcategory(id) {
        try {
            const response = await api.delete(`/category-species/subcategory/${id}`);

            // 🔥 Eliminar del `localStorage`
            let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
            cacheData.data = cacheData.data.filter(subcategory => subcategory.id !== id);
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

            return response;
        } catch (error) {
            console.error('Error al eliminar la subcategoría:', error);
            throw error;
        }
    },

    // 📌 ELIMINAR UNA ETAPA
    async deleteStages(id) {
        try {
            const response = await api.delete(`/category-species/stage/${id}`);

            // 🔥 Eliminar del `localStorage`
            let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
            cacheData.data = cacheData.data.filter(stage => stage.id !== id);
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

            return response;
        } catch (error) {
            console.error('Error al eliminar la etapa:', error);
            throw error;
        }
    },
};

export default CategoryServices;
