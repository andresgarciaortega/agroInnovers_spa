// services/users.js

import api from './ApiService';

const ReporteService = {


    async getAllReporte(idcompany = 0, searchParameter) {
        try {
            const response = await api.get(`/tracking-reports?page=1&limit=10000&company=${idcompany}&search=${encodeURIComponent(JSON.stringify(searchParameter))}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener los tipos de reportes:', error);
            throw error;
        }
    },

    async createReporte(data) {
        try {
            const response = await api.post('/tracking-reports/', data);
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.message?.message || 'Error desconocido al crear los reportes.';
            throw {
                statusCode: error.response?.status || 500, 
                message: errorMessage,
            };
        }
    },



    // ACTUALIZAR UNA tipo de reportes
    async updateReporte(id, data) {
        try {
            const response = await api.put(`/tracking-reports/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar losreportes:', error);
            throw error;
        }
    },
    async updateCosecha(id, data) {
        try {
            const response = await api.put(`/tracking-reports/edit/harvest/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar las cosechas:', error);
            throw error;
        }
    },



    async deleteReporte(id) {
        try {
            const response = await api.delete(`/tracking-reports/${id}`);
            return response; // Devuelve los datos de la respuesta en caso de éxito
        } catch (error) {
            // Extrae el mensaje del error enviado por el backend
            const errorMessage = error.response?.data?.message || 'Error desconocido al eliminar los reportes.';
            
            // Lanza un objeto con el mensaje y el código de estado
            throw {
                statusCode: error.response?.status || 500, // Si no hay un estado, asume error del servidor
                message: errorMessage,
            };
        }
    },
    

      
};

export default ReporteService;
