// services/users.js
import api from './ApiService';

const CACHE_KEY = "cache_/users"; // Clave correcta del localStorage

// 📌 Función para verificar conexión a Internet
const isOnline = async () => {
    try {
        await fetch('https://www.google.com', { mode: 'no-cors' });
        return true;
    } catch {
        return false;
    }
};

const UsersService = {
    // 📌 LISTAR TODOS LOS USUARIOS
    async getAllUser(idcompany = 0) {
        try {
            const response = await api.get(`/users?page=1&limit=10000&companyId=${idcompany}`);
            return response.data;
        } catch (error) { 
            console.error('Error al obtener los usuarios:', error);
            throw error;
        }
    }, 

    // 📌 CREAR UN USUARIO
    async createUser(data) {
        try {
            const response = await api.post('/users/', data);
            // // 🔥 Guardar en `localStorage`
            // let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
            // cacheData.data.push(response);
            // localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

            return response;
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            throw error;
        }
    },

    // 📌 ACTUALIZAR UN USUARIO

    async updateUser(id, data) {
        try {
            const online = await isOnline();
    
            if (online) {
                // 🔥 Si hay internet, actualizar en la API
                const response = await api.put(`/users/${id}`, data);
    
                // 🔥 Actualizar `localStorage`
                let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
                const index = cacheData.data.findIndex(user => user.id === id);
    
                if (index !== -1) {
                    cacheData.data[index] = { ...cacheData.data[index], ...response };
                } else {
                    console.warn(`⚠️ Usuario ${id} no encontrado en LocalStorage, agregando...`);
                    cacheData.data.push(response);
                }
    
                localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
                return response;
            } else {
                // 🔥 Si no hay internet, actualizar solo en `localStorage`
                console.warn("🚨 No hay internet. Intentando actualizar localmente...");
    
                let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
    
                if (!cacheData.data.length) {
                    console.error("⚠️ No hay usuarios en `localStorage`.");
                    throw new Error("El usuario no se encontró en localStorage.");
                }
    
                // 🔎 Buscar usuario en `localStorage`
                const index = cacheData.data.findIndex(user => user.id == id);
                
                if (index !== -1) {
                    cacheData.data[index] = { ...cacheData.data[index], ...data };
                    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
                    console.warn(`✅ Usuario ${id} actualizado en LocalStorage.`);
                    return cacheData.data[index];
                } else {
                    console.error(`❌ Usuario ${id} no encontrado en LocalStorage.`);
                    throw new Error("El usuario no se encontró en localStorage.");
                }
            }
        } catch (error) {
            console.error('❌ Error al actualizar el usuario:', error.message);
            throw error;
        }
    },
    

    // 📌 ELIMINAR UN USUARIO
    async deleteUser(id) {
        try {
            const response = await api.delete(`/users/${id}`);

            // 🔥 Eliminar del `localStorage`
            let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
            cacheData.data = cacheData.data.filter(user => user.id !== id);
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

            return response;
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            throw error;
        }
    },

    // 📌 BUSCAR USUARIO POR EMAIL
    async getUserEmail(email) {
        try {
            const response = await api.get(`/users/email/${email}`);
            return response;
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            throw error;
        }
    },

    // 📌 BUSCAR USUARIO POR DOCUMENTO
    async getUserDocument(document) {
        try {
            const response = await api.get(`/users/document/${document}`);
            return response;
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            throw error;
        }
    },
};

export default UsersService;
