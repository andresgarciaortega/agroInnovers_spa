// services/companies.js

import api from './ApiService';


const CompanyService = {


    // LISTAR TODAS LAS COMPAÑIAS
    async getAllCompany() {
        try {
            const response = await api.get('/companies/');
            return response;
        } catch (error) {
            console.error('Error al obtener las compañías:', error);
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

      // USCAR USUARIO POR EMAIL
    //   async getFacturacionEmail(email) {
    //     try {
    //         console.log(email)
    //         const response = await api.get('/companies/email_facturacion/'+email);
    //         return response;
    //     } catch (error) {
    //         console.error('Error al obtener la empresa:', error);
    //         throw error;
    //     }
    // },

    //    // USCAR USUARIO POR DOCUMENTO
    //    async getCompanyDocument(nit) {
    //     try {
    //         console.log(nit)
    //         const response = await api.get('/companies/nit/'+nit);
    //         return response;
    //     } catch (error) {
    //         console.error('Error al obtener las empresas:', error);
    //         throw error;
    //     }
    // },



    async deleteCompany(id) {
        try {
            const response = await api.delete(`/companies/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar la compañia:', error);
            throw error;
        }
    },
};

export default CompanyService;
