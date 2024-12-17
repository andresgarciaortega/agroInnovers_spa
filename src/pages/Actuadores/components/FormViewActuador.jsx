import React, { useEffect, useState } from 'react';
import TypeService from "../../../services/TypeDispositivosService";
import SensorService from "../../../services/SensorService";
import { useCompanyContext } from '../../../context/CompanyContext';

const FormViewActuador = ({ actuador, closeModal }) => {
    const [sensorType, setSensorType] = useState([]);
    const [formData, setFormData] = useState({
        actuatorCode: '',
        activationType: '',
        gpsPosition: '',
        inputPort: '',
        activationPort: '',
        description: '',
        accessUsername: '',
        accessPassword: '',
        installationDate: '',
        estimatedChangeDate: '',
        actuatorTypeId: '',
        // company_id: companySeleector.value || ''
    });

    useEffect(() => {
        const fetchSensorTypes = async () => {
            try {
                const typeSensor = await TypeService.getAllSensor();
                setSensorType(typeSensor);
            } catch (error) {
                console.log('Error al obtener los tipos de sensores:', error);
            }
        };

        fetchSensorTypes();
    }, []);

    useEffect(() => {
        if (actuador) {
            setFormData({
                actuatorCode: actuador.actuatorCode || '',
                gpsPosition: actuador.gpsPosition || '',
                activationType: actuador.activationType || '',
                inputPort: actuador.inputPort || '',
                actuatorTypeId: actuador.actuatorType?.id || '', // Asignación correcta del id de typeVariable
                activationPort: actuador.activationPort || '',
                // company_id: actuador.company_id
                description: actuador.description,
                accessUsername: actuador.accessUsername,
                accessPassword: actuador.accessPassword,
                installationDate: actuador.installationDate,
                estimatedChangeDate: actuador.estimatedChangeDate
            });
        }
    }, [actuador]);

    return (
        <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mt-5">
                {/* Imagen - Columna Izquierda */}
                <div className="flex flex-col items-center">
                {actuador.actuatorType && actuador.actuatorType.icon ? (
                        <img
                          src={actuador.actuatorType.icon}
                          alt={actuador.actuatorType.sensorCode || "Actuador Icon"}
                          className="w-72 h-72 object-contain mb-4 border border-gray-400 p-2 rounded-lg "

                        />
                      ) : (
                        <span>{actuador.actuatorType?.sensorCode || "No data"}</span>
                      )}
                    {/* Botones */}
                    <div className="space-y-2 mt-5">
                        <button
                            type="button"
                            className="mb-2 inline-flex items-center px-10 py-3 border border-[#168C0DFF] text-sm  font-medium rounded-md text-[#168C0DFF] bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Ver historial de mantenimiento
                        </button>
                        <button
                            type="button"
                            className="mb-2 inline-flex items-center px-14 py-3 border border-[#168C0DFF] text-sm leading-4 font-medium rounded-md text-[#168C0DFF] bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Ver historial de calibración
                        </button>
                    </div>
                </div>


                {/* Información de Sensor - Columna Derecha */}
                <div className="grid grid-cols-2 gap-4 mt-5">
                    <div className="flex flex-col">
                        <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Codigo ID actuador</label>
                        <p className="mt-1 text-sm text-gray-600">{actuador.actuatorCode}</p>
                    </div>

                  

                    <div className="flex flex-col">
                        <label htmlFor="inputPort" className="block text-sm font-medium text-gray-900">Puerto de entrada</label>
                        <p className="mt-1 text-sm text-gray-600">{actuador.inputPort}</p>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="inputPort" className="block text-sm font-medium text-gray-900">Tipo de activador</label>
                        <p className="mt-1 text-sm text-gray-600">{actuador.activationType}</p>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="activationPort" className="block text-sm font-medium text-gray-900">Puerto de activador</label>
                        <p className="mt-1 text-sm text-gray-600">{actuador.activationPort}</p>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <label htmlFor="gpsPosition" className="block text-sm font-medium text-gray-900">Posición GPS</label>
                        <p className="mt-1 text-sm text-gray-600">{actuador.gpsPosition}</p>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-900">Descripción</label>
                        <p className="mt-1 text-sm  text-gray-600">{actuador.description}</p>
                    </div>
                    <hr className=" flex flex-col col-span-2 border-gray-400" />
                    <div className="flex flex-col mt-5">
                        <label htmlFor="accessUsername" className="block text-sm font-medium text-gray-900">Usuario de acceso</label>
                        <p className="mt-1 text-sm text-gray-600">{actuador.accessUsername}</p>
                    </div>

                    <div className="flex flex-col mt-5">
                        <label htmlFor="accessPassword" className="block text-sm font-medium text-gray-900">Clave de acceso</label>
                        <p className="mt-1 text-sm text-gray-600">{actuador.accessPassword}</p>
                    </div>

                    <hr className=" flex flex-col col-span-2 border-gray-400" />

                    <div className="flex flex-col mt-5">
                        <label htmlFor="installationDate" className="block text-sm font-medium text-gray-900">Fecha de instalación</label>
                        <p className="mt-1 text-sm text-gray-600">{actuador.installationDate.substr(0, 10)}</p>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="estimatedChangeDate" className="block text-sm font-medium text-gray-900">Fecha estimada de cambio</label>
                        <p className="mt-1 text-sm text-gray-600">{actuador.estimatedChangeDate.substr(0, 10)}</p>
                    </div>
                </div>

            </div>

            {/* Botón para cerrar el modal */}
            <div className="flex justify-end mt-5">
                <button
                    type="button"
                    onClick={closeModal}
                    className="bg-white text-gray-500 px-4 py-2 rounded border border-gray-400"
                >
                    Volver
                </button>
            </div>
        </form>
    );
};

export default FormViewActuador;
