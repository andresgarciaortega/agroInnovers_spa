// services/companies.js

import api from './ApiService';

const TypeDocumentsService = {

    // LISTAR TODAS LAS COMPAÑIAS
    async getAllTypeDocuments() {
        try {
            const response = await api.get('/users/typeDocuments/');
            return response;
        } catch (error) {
            console.error('Error al obtener las compañías:', error);
            throw error;
        }
    },


    // LISTAR TODAS LAS COMPAÑIAS
    async getAllTypeUsers() {
        try {
            const response = await api.get('/users/typeUsers/');
            return response;
        } catch (error) {
            console.error('Error al obtener las compañías:', error);
            throw error;
        }
    },


};

export default TypeDocumentsService;
