import React, { useEffect, useState } from 'react';
import TypeService from "../../../services/TypeDispositivosService";
import SensorService from "../../../services/SensorService";
import { useCompanyContext } from '../../../context/CompanyContext';

const FormViewActuador = ({ actuador, closeModal }) => {
    const [actuadorType, setSensorType] = useState([]);
    const [activeModal, setActiveModal] = useState(null);
    const [formData, setFormData] = useState({
        icon: '',
        actuatorTypeName: '',
        commercialName: '',
        manufacturer: '',
        lifespan: '',
        brand: '',
        model: '',
        datasheet: '',
        outputType: '',
        iotProtocol: '',
        iotCommunicationType: '',
        controlSignal: '',
        maxValue: '',
        minValue: '',
        precision: '',
        speed: '',
        repeatability: '',
        operatingVoltage: '',
        voltageType: '',
        maxSamplingFrequency: '',
        maintenanceFrequency: '',
        calibrationFrequency: '',
        minOperatingTemperature: '',
        maxOperatingTemperature: '',
        // company_id: companySeleector.value || ''
        // ,
        calibrationPoints: [],

        // company_id: companySeleector.value || ''
    });

    useEffect(() => {
        const fetchSensorTypes = async () => {
            try {
                const typeSensor = await TypeService.getAllSensor();
                setSensorType(typeSensor);
            } catch (error) {
                console.log('Error al obtener los tipos de actuadores:', error);
            }
        };

        fetchSensorTypes();
    }, []);

    useEffect(() => {
        if (actuador) {
            setFormData({
                icon: actuador.icon || '',
                actuatorTypeName: actuador.actuatorTypeName || '',
                commercialName: actuador.commercialName || '',
                manufacturer: actuador.manufacturer || '',
                lifespan: actuador.lifespan || '',
                brand: actuador.brand || '',
                model: actuador.model || '',
                datasheet: actuador.datasheet || '',
                outputType: actuador.outputType || '',
                iotProtocol: actuador.iotProtocol || '',
                iotCommunicationType: actuador.iotCommunicationType || '',
                controlSignal: actuador.controlSignal || '',

                maxValue: actuador.maxValue || '',
                minValue: actuador.minValue || '',
                precision: actuador.precision || '',
                speed: actuador.speed || '',
                operatingVoltage: actuador.operatingVoltage || '',

                repeatability: actuador.repeatability || '',
                voltageType: actuador.voltageType || '',
                maxSamplingFrequency: actuador.maxSamplingFrequency || '',
                maintenanceFrequency: actuador.maintenanceFrequency || '',
                calibrationFrequency: actuador.calibrationFrequency || '',
                minOperatingTemperature: actuador.minOperatingTemperature || '',
                maxOperatingTemperature: actuador.maxOperatingTemperature || '',
                company_id: actuador.company_id,

                calibrationPoints: actuador.calibrationPoints?.map(point => ({
                    value: point.value || '',
                    normalResponse: point.normalResponse || ''
                })) || [],
            });
        }
    }, [actuador]);

    const openModal = (modalType) => {
        setActiveModal(modalType);
    };

    const closeModalHandler = () => {
        setActiveModal(null);
    };

    return (
        <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mt-5">


                {/* Información de Sensor - Columna Derecha */}
                <div className="grid grid-cols-2 gap-4 mt-5">
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Nombre tipo actuador:</label>
                            <p className="ml-2 text-sm text-gray-600">{actuador.actuatorTypeName}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Variable a medir:</label>
                            <p className="ml-2 text-sm text-gray-600">{actuador.outputType}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Nombre Comercial:</label>
                            <p className="ml-2 text-sm text-gray-600">{actuador.commercialName}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Fabricante Sensor:</label>
                            <p className="ml-2 text-sm text-gray-600">{actuador.manufacturer}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Vida útil:</label>
                            <p className="ml-2 text-sm text-gray-600">{actuador.lifespan} años</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Marca:</label>
                            <p className="ml-2 text-sm text-gray-600">{actuador.brand}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Modelo:</label>
                            <p className="ml-2 text-sm text-gray-600">{actuador.model}</p>
                        </div>
                    </div>


                    <br />
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Protocolo IOT:</label>
                            <p className="ml-2 text-sm text-gray-600">{actuador.iotProtocol}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Tipo de communicación IoT:</label>
                            <p className="ml-2 text-sm text-gray-600">{actuador.iotCommunicationType}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Señal de control:</label>
                            <p className="ml-2 text-sm text-gray-600">{actuador.controlSignal}</p>
                        </div>
                    </div>
                    <br />
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Datasheet:</label>
                            <p className="ml-2 text-sm text-gray-600">{actuador.datasheet}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Periocidad de mantenimiento en días:</label>
                            <p className="ml-2 text-sm text-gray-600">{actuador.maintenanceFrequency}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Periocidad de calibración de día:</label>
                            <p className="ml-2 text-sm text-gray-600">{actuador.calibrationFrequency}</p>
                        </div>
                    </div>

                </div>

                <div className="flex flex-col grid grid-cols-2 gap-4 mt-5">
                    <img
                        src={actuador.icon}
                        alt={actuador.actuadorCode || "Sensor Icon"}
                        className="w-72 h-72 object-contain mb-4 border border-gray-400 p-2 rounded-lg  flex-col col-span-2"
                    />
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Velocidad:</label>
                            <p className="ml-2 text-sm text-gray-600">{actuador.speed}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Repetibilidad:</label>
                            <p className="ml-2 text-sm text-gray-600">{actuador.repeatability}</p>
                        </div>
                    </div>
                     <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Voltaje de operación:</label>
                            <p className="ml-2 text-sm text-gray-600">{actuador.operatingVoltage}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Tipo de voltaje:</label>
                            <p className="ml-2 text-sm text-gray-600">{actuador.actuatorTypeName}</p>
                        </div>
                    </div>
                   
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Precisión:</label>
                            <p className="ml-2 text-sm text-gray-600">{actuador.precision}</p>
                        </div>
                    </div>

                   
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Valor máximo de medición:</label>
                            <p className="ml-2 text-sm text-gray-600">{actuador.maxValue}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Valor mínimo de medición:</label>
                            <p className="ml-2 text-sm text-gray-600">{actuador.minValue}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Temperatura mínima de operación:</label>
                            <p className="ml-2 text-sm text-gray-600">{actuador.minOperatingTemperature}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Temperatura máxima de operación:</label>
                            <p className="ml-2 text-sm text-gray-600">{actuador.maxOperatingTemperature}</p>
                        </div>
                    </div>
                </div>

            </div>
            <div>
                <table className="min-w-full table-auto border-collapse mb-4 mt-4">
                    <thead>
                        <tr className="bg-gray-200">
                            {/* <th className="border px-4 py-2 font-bold">Punto de calibración</th> */}

                            <th className="border px-4 py-2 font-semibold">Punto Calibración</th>
                            <th className="border px-4 py-2 font-semibold">Valor</th>
                            <th className="border px-4 py-2 font-semibold">Respuesta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.calibrationPoints.map((param, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2"> Punto {index + 1}</td>
                                <td className="border px-4 py-2">{param.value}°C</td>
                                <td className="border px-4 py-2">{param.normalResponse} V</td>

                            </tr>
                        ))}
                    </tbody>


                </table>
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
