// services/variableTypes.js
import api from './ApiService';

const CACHE_KEY = 'cache_/type-variables';

// 📌 Función para verificar conexión a Internet
const isOnline = async () => {
    try {
        await fetch('https://www.google.com', { mode: 'no-cors' });
        return true;
    } catch {
        return false;
    }
};


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
            console.log("dato de retorno ", response)
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
            const online = await isOnline();
    
            if (online) {
                // 🔥 Actualizar en la API
                const response = await api.put(`/type-variables/${id}`, data);
    
                // 🔥 Actualizar `localStorage`
                let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
                const index = cacheData.data.findIndex(variable => variable.id === id);
    
                if (index !== -1) {
                    cacheData.data[index] = { ...cacheData.data[index], ...response };
                } else {
                    console.warn(`⚠️ Tipo de variable ${id} no encontrado en LocalStorage, agregando...`);
                    cacheData.data.push(response);
                }
    
                localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
                return response;
            } else {
                // 🔥 Si no hay internet, actualizar solo en `localStorage`
                console.warn("🚨 No hay internet. Intentando actualizar localmente...");
    
                let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
    
                if (!cacheData.data.length) {
                    console.error("⚠️ No hay datos en `localStorage`.");
                    throw new Error("El tipo de variable no se encontró en localStorage.");
                }
    
                // 🔎 Buscar en `localStorage`
                const index = cacheData.data.findIndex(variable => variable.id == id);
    
                if (index !== -1) {
                    cacheData.data[index] = { ...cacheData.data[index], ...data };
                    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
                    console.warn(`✅ Tipo de variable ${id} actualizado en LocalStorage.`);
                    return cacheData.data[index];
                } else {
                    console.error(`❌ Tipo de variable ${id} no encontrado en LocalStorage.`);
                    throw new Error("El tipo de variable no se encontró en localStorage.");
                }
            }
        } catch (error) {
            console.error('❌ Error al actualizar el tipo de variable:', error.message);
            throw error;
        }
    },    

    // 📌 ELIMINAR UN TIPO DE VARIABLE
    async deleteTypeVariable(id) {
        try {
            const online = await isOnline();
    
            if (online) {
                // 🔥 Eliminar en la API
                const response = await api.delete(`/type-variables/${id}`);
    
                // 🔥 Eliminar en `localStorage`
                let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
                cacheData.data = cacheData.data.filter(variable => variable.id !== id);
                localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    
                return response;
            } else {
                // 🔥 Si no hay internet, eliminar solo en `localStorage`
                console.warn("🚨 No hay internet. Intentando eliminar localmente...");
    
                let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
    
                if (!cacheData.data.length) {
                    console.error("⚠️ No hay datos en `localStorage`.");
                    throw new Error("El tipo de variable no se encontró en localStorage.");
                }
    
                cacheData.data = cacheData.data.filter(variable => variable.id !== id);
                localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    
                console.warn(`✅ Tipo de variable ${id} eliminado de LocalStorage.`);
                return { message: "Eliminado localmente." };
            }
        } catch (error) {
            console.error('❌ Error al eliminar el tipo de variable:', error.message);
            throw error;
        }
    },    
};

export default VariableTypeService;
