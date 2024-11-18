// services/companies.js

import api from './ApiService';


const CompanyService = {


    // LISTAR TODAS LAS COMPAÑIAS
    async getAllCompany() {
        try {
            const response = await api.get('/companies/');
            return response.data;
        } catch (error) {
            console.error('Error al obtener las compañías:', error);
            throw error;
        }
    },

     // OBTENER UNA compañia POR ID
     async getCompanyById(id) {
        try {            
            const response = await api.get(`/companies/${id}`);            
            return response; // Devuelve los datos de la compañia
        } catch (error) {
            console.error('Error al obtener la compañia:', error);
            throw error;
        }
    },


    // CREAR UNA COMPAÑIA
    async createCompany(data) {
        try {
            const response = await api.post('/companies/', data);
            return response;
        } catch (error) {
            console.error('Error al crear la compañía:', error);
            throw error;
        }
    },



    // ACTUALIZAR UNA COMPAÑIA
    async updateCompany(id, data) {
        try {
            const response = await api.put(`/companies/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar la compañia:', error);
            throw error;
        }
    },

    //   USCAR USUARIO POR EMAIL
      async getFacturacionEmail(email) {
        try {
            const response = await api.get('/companies/find-by-email?email='+email);
            return response;
        } catch (error) {
            console.error('Error al obtener la empresa:', error);
            throw error;
        }
    },

       // USCAR USUARIO POR DOCUMENTO
       async getCompanyDocument(nit) {
        try {
            const response = await api.get('/companies/nit/'+nit);
            return response;
        } catch (error) {
            console.error('Error al obtener las empresas:', error);
            throw error;
        }
    },




    async deleteCompany(id) {
        try {
            const response = await api.delete(`/companies/${id}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // Retorna el mensaje de error de la API en lugar de lanzar el error
                return {
                    success: false,
                    message: error.response.data.message || 'No se puede eliminar la compañía por asociación con otros datos.'
                };
            } else {
                // Si es otro tipo de error, captúralo sin lanzarlo
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
