
const RegistrerTypeServices = {


    // LISTAR TODAS Los tipos de registro
    
    async getAllRegistrerType() {
        try {
            const response = await api.get('/variables/registerType');
            return response;
        } catch (error) {
            console.error('Error al obtener los tipos de registro:', error);
            throw error;
        }
    },
}

export default RegistrerTypeServices;