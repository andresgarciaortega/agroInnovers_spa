// services/users.js

import api from './ApiService';

const VariableTypeService = {


    // LISTAR TODAS LAS tipo de variableS
    async getAllTypeVariable(idcompany = 0) {
        try {
            const response = await api.get(`/type-variables?page=1&limit=10000&company=${idcompany}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener los tipos de variable:', error);
            throw error;
        }
    },

    // CREAR UNA tipo de variable
    async createTypeVariable(data) {
        try {
            const response = await api.post('/type-variables/', data);
            return response;
        } catch (error) {
            // Extraer el mensaje del error
            const errorMessage = error.response?.data?.message?.message || 'Error desconocido al crear el tipo de variable.';
            // Retornar un objeto que incluya el mensaje y el código de estado
            throw {
                statusCode: error.response?.status || 500, // Si no hay un estado, por defecto 500
                message: errorMessage,
            };
        }
    },



    // ACTUALIZAR UNA tipo de variable
    async updateTypeVariable(id, data) {
        try {
            const response = await api.put(`/type-variables/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar el tipo de variable:', error);
            throw error;
        }
    },



    async deleteTypeVariable(id) {
        try {
            const response = await api.delete(`/type-variables/${id}`);
            return response.data; // Devuelve los datos de la respuesta en caso de éxito
        } catch (error) {
            // Extrae el mensaje del error enviado por el backend
            const errorMessage = error.response?.data?.message || 'Error desconocido al eliminar el tipo de variable.';
            
            // Lanza un objeto con el mensaje y el código de estado
            throw {
                statusCode: error.response?.status || 500, // Si no hay un estado, asume error del servidor
                message: errorMessage,
            };
        }
    },
    

      
};

export default VariableTypeService;
