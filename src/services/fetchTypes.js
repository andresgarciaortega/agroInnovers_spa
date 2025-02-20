// services/companies.js

import api from './ApiService';

const TypeDocumentsService = {

    // LISTAR TODAS LAS COMPAÑIAS
    async getAllTypeDocuments() {
        try {
            const response = await api.get('/users/typeDocuments?page=1&limit=10000');
            return response;
        } catch (error) {
            console.error('Error al obtener las compañías:', error);
            throw error;
        }
    },


    // LISTAR TODAS LAS COMPAÑIAS
    async getAllTypeUsers() {
        try {
            const response = await api.get('/roles?page=1&limit=10000');
            return response.data;
        } catch (error) {
            console.error('Error al obtener las compañías:', error);
            throw error;
        }
    },


};

export default TypeDocumentsService;
