// services/variableTypes.js
import api from './ApiService';

const CACHE_KEY = 'cache_/type-variables';

const VariableTypeService = {
    // 📌 LISTAR TODOS LOS TIPOS DE VARIABLE
    async getAllTypeVariable(idcompany = 0) {
        try {
            const response = await api.get(`/type-variables?page=1&limit=10000&company=${idcompany}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener los tipos de variable:', error);
            throw error;
        }
    },

    // 📌 CREAR UN TIPO DE VARIABLE
    async createTypeVariable(data) {
        try {
            const response = await api.post('/type-variables/', data);

            // 🔥 Guardar en `localStorage`
            let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
            cacheData.data.push(response);
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

            console.log("✅ Tipo de variable guardado correctamente en LocalStorage:");
            console.log(localStorage.getItem(CACHE_KEY));
            return response;
        } catch (error) {
            // 🔥 Guardar en `localStorage`
            console.error('Error al crear el tipo de variable:', error);
            throw error;
        }
    },

    // 📌 ACTUALIZAR UN TIPO DE VARIABLE
    async updateTypeVariable(id, data) {
        try {
            const response = await api.put(`/type-variables/${id}`, data);

            // 🔥 Actualizar `localStorage`
            let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
            const index = cacheData.data.findIndex(variable => variable.id === id);
            if (index !== -1) {
                cacheData.data[index] = { ...cacheData.data[index], ...response };
                localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
            }

            return response;
        } catch (error) {
            console.error('Error al actualizar el tipo de variable:', error);
            throw error;
        }
    },

    // 📌 ELIMINAR UN TIPO DE VARIABLE
    async deleteTypeVariable(id) {
        try {
            const response = await api.delete(`/type-variables/${id}`);

            // 🔥 Eliminar del `localStorage`
            let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
            cacheData.data = cacheData.data.filter(variable => variable.id !== id);
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

            return response;
        } catch (error) {
            console.error('Error al eliminar el tipo de variable:', error);
            throw error;
        }
    },
};

export default VariableTypeService;
