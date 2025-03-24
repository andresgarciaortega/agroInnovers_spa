// services/companies.js
import api from './ApiService';

const CACHE_KEY = 'cache_/companies?page=1&limit=10000&';

const CompanyService = {
    // 📌 LISTAR TODAS LAS COMPAÑÍAS
    async getAllCompany() {
        try {
            console.log("mpress peticion")
            const response = await api.get('/companies?page=1&limit=10000&');
            return response.data;
        } catch (error) {
            console.error('Error al obtener las compañías:', error);
            throw error;
        }
    },

    // 📌 OBTENER UNA COMPAÑÍA POR ID
    async getCompanyById(id) {
        try {            
            const response = await api.get(`/companies/${id}`);
            return response; // Devuelve los datos de la compañía
        } catch (error) {
            console.error('Error al obtener la compañía:', error);
            throw error;
        }
    },

    // 📌 CREAR UNA COMPAÑÍA
    async createCompany(data) {
        try {
            const response = await api.post('/companies/', data);

            // 🔥 Guardar en `localStorage`
            let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
            cacheData.data.push(response);
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

            return response;
        } catch (error) {
            console.error('Error al crear la compañía:', error);
            throw error;
        }
    },

    // 📌 ACTUALIZAR UNA COMPAÑÍA
    async updateCompany(id, data) {
        try {
            const response = await api.put(`/companies/${id}`, data);

            // 🔥 Actualizar `localStorage`
            let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
            const index = cacheData.data.findIndex(company => company.id === id);
            if (index !== -1) {
                cacheData.data[index] = { ...cacheData.data[index], ...response };
                localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
            }

            return response;
        } catch (error) {
            console.error('Error al actualizar la compañía:', error);
            throw error;
        }
    },

    // 📌 BUSCAR EMPRESA POR EMAIL
    async getFacturacionEmail(email) {
        try {
            const response = await api.get(`/companies/find-by-email?email=${email}`);
            return response;
        } catch (error) {
            console.error('Error al obtener la empresa:', error);
            throw error;
        }
    },

    // 📌 BUSCAR EMPRESA POR DOCUMENTO
    async getCompanyDocument(nit) {
        try {
            const response = await api.get(`/companies/nit/${nit}`);
            return response;
        } catch (error) {
            console.error('Error al obtener la empresa:', error);
            throw error;
        }
    },

    // 📌 ELIMINAR UNA COMPAÑÍA
    async deleteCompany(id) {
        try {
            const response = await api.delete(`/companies/${id}`);
            // 🔥 Eliminar de `localStorage`
            let cacheData = JSON.parse(localStorage.getItem(CACHE_KEY)) || { data: [] };
            cacheData.data = cacheData.data.filter(company => company.id !== id);
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

            return { success: true, data: response };
        } catch (error) {
            if (error.response && error.response.status === 400) {
                return {
                    success: false,
                    message: error.response.data.message || 'No se puede eliminar la compañía por asociación con otros datos.'
                };
            } else {
                console.error('Error desconocido al eliminar la compañía:', error);
                return {
                    success: false,
                    message: 'No se puede eliminar la compañía, existen usuarios asociados'
                };
            }
        }
    }
};

export default CompanyService;
