// services/variables.js
import api from './ApiService';

const CACHE_KEY = 'cache_/variables';

const VariablesService = {
    // 📌 LISTAR TODAS LAS VARIABLES
    async getAllVariable(idcompany = 0) {
        try {
            const response = await api.get(`/variables?page=1&limit=10000&company=${idcompany}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener las variables:', error);
            throw error;
        }
    },

    // 📌 CREAR UNA VARIABLE
    async createVariable(data) {
        try {
            const response = await api.post('/variables/', data);

            // 🔥 Guardar en `localStorage`
            let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
            cacheData.data.push(response);
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

            return response;
        } catch (error) {
            console.error('Error al crear la variable:', error);
            throw error;
        }
    },

    // 📌 ACTUALIZAR UNA VARIABLE
    async updateVariable(id, data) {
        try {
            const response = await api.put(`/variables/${id}`, data);

            // 🔥 Actualizar `localStorage`
            let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
            const index = cacheData.data.findIndex(variable => variable.id === id);
            if (index !== -1) {
                cacheData.data[index] = { ...cacheData.data[index], ...response };
                localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
            }

            return response;
        } catch (error) {
            console.error('Error al actualizar la variable:', error);
            throw error;
        }
    },

    // 📌 ELIMINAR UNA VARIABLE
    async deleteVariable(id) {
        try {
            const response = await api.delete(`/variables/${id}`);

            // 🔥 Eliminar del `localStorage`
            let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
            cacheData.data = cacheData.data.filter(variable => variable.id !== id);
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

            return response;
        } catch (error) {
            console.error('Error al eliminar la variable:', error);
            throw error;
        }
    },
};

export default VariablesService;
