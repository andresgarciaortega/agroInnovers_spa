// services/categories.js

import api from './ApiService';

const TypeDispotivicosService = {
    // LISTAR TODAS LOS SENSORES
    async getAllSensor(idcompany = 0) {
        try {
            const response = await api.get(`/sensor-types?page=1&limit=10000&company=${idcompany}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener los sensores:', error);
            throw error;
        }
    },

    // OBTENER UN SENSOR POR ID
    async getSensorById(id) {
        try {
            const response = await api.get(`/sensor-types/${id}`);
            return response;
        } catch (error) {
            console.error('Error al obtener el sensor:', error);
            throw error;
        }
    },

    // CREAR UN SENSOR
    async createSensor(data) {
        try {
            const response = await api.post('/sensor-types/', data);
            return response;
        } catch (error) {
            console.error('Error al crear el sensor:', error);
            throw error;
        }
    },

    // ACTUALIZAR UN SENSOR
    async updateSensor(id, data) {
        try {
            const response = await api.put(`/sensor-types/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar el sensor:', error);
            throw error;
        }
    },

    

    // ELIMINAR UN SENSOR
    async deleteSensor(id) {
        try {
            const response = await api.delete(`/sensor-types/${id}`);
            return response;
        } catch (error) {
            console.error('Error al eliminar el sensor:', error);
            throw error;
        }
    },

    //_________________________________________________________________________________//
   
     // LISTAR TODAS LOS ACTUADORES
     async getAllActuador() {
        try {
            const response = await api.get(`/actuator-types?page=1&limit=100`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener los Actuadores:', error);
            throw error;
        }
    },

    // OBTENER UN ACTUADOR POR ID
    async getActuadorById(id) {
        try {
            const response = await api.get(`/actuator-types/${id}`);
            return response;
        } catch (error) {
            console.error('Error al obtener el actuador:', error);
            throw error;
        }
    },

    // CREAR UN ACTUADOR
    async createActuador(data) {
        try {
            const response = await api.post('/actuator-types/', data);
            return response;
        } catch (error) {
            console.error('Error al crear el actuador:', error);
            throw error;
        }
    },

    // ACTUALIZAR UN ACTUADOR
    async updateActuador(id, data) {
        try {
            const response = await api.put(`/actuator-types/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar el actuador:', error);
            throw error;
        }
    },

    

    // ELIMINAR UN ACTUADOR
    async deleteActuador(id) {
        try {
            const response = await api.delete(`/actuator-types/${id}`);
            return response;
        } catch (error) {
            console.error('Error al eliminar el actuador:', error);
            throw error;
        }
    },
    
};

export default TypeDispotivicosService;
