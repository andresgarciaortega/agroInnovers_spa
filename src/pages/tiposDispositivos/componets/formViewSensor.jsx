import React, { useEffect, useState } from 'react';
import TypeService from "../../../services/TypeDispositivosService";
import SensorService from "../../../services/SensorService";
import { useCompanyContext } from '../../../context/CompanyContext';

const FormViewSensor = ({ sensor, closeModal }) => {
    const [sensorType, setSensorType] = useState([]);
    const [activeModal, setActiveModal] = useState(null);
    const [formData, setFormData] = useState({
        icon: '',
        sensorTypeName: '',
        commercialName: '',
        manufacturer: '',
        brand: '',
        model: '',
        lifespan: '',
        iotProtocol: '',
        iotCommunicationType: '',
        datasheet: '',
        variableId: 0,
        maxMeasurementValue: '',
        minMeasurementValue: '',
        precision: '',
        resolution: '',
        repeatability: '',
        operatingVoltage: '',
        signalType: '',
        maxSamplingFrequency: '',
        samplingConditions: '',
        alertTimeWindow: '',
        alertTolerancePercentage: '',
        minOperatingTemperature: '',
        maxOperatingTemperature: '',
        maintenanceFrequency: '',
        calibrationFrequency: '',
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
                console.log('Error al obtener los tipos de sensores:', error);
            }
        };

        fetchSensorTypes();
    }, []);

    useEffect(() => {
        if (sensor) {
            setFormData({
                icon: sensor.icon || '',
                sensorTypeName: sensor.sensorTypeName || '',
                commercialName: sensor.commercialName || '',
                manufacturer: sensor.manufacturer || '',
                brand: sensor.brand || '',
                model: sensor.model || '',
                lifespan: sensor.lifespan || '',
                iotProtocol: sensor.iotProtocol || '',
                iotCommunicationType: sensor.iotCommunicationType || '',
                datasheet: sensor.datasheet || '',
                variableId: sensor.variable?.id || '',
                maxMeasurementValue: sensor.maxMeasurementValue || '',
                minMeasurementValue: sensor.minMeasurementValue || '',
                precision: sensor.precision || '',
                company_id: sensor.company_id,
                resolution: sensor.resolution || '',
                repeatability: sensor.repeatability || '',
                operatingVoltage: sensor.operatingVoltage || '',
                signalType: sensor.signalType || '',
                maxSamplingFrequency: sensor.maxSamplingFrequency || '',
                samplingConditions: sensor.samplingConditions || '',
                alertTimeWindow: sensor.alertTimeWindow || '',
                alertTolerancePercentage: sensor.alertTolerancePercentage || '',
                minOperatingTemperature: sensor.minOperatingTemperature || '',
                maxOperatingTemperature: sensor.maxOperatingTemperature || '',
                maintenanceFrequency: sensor.maintenanceFrequency || '',
                calibrationFrequency: sensor.calibrationFrequency || '',
                calibrationPoints: sensor.calibrationPoints?.map(point => ({
                    value: point.value || '',
                    normalResponse: point.normalResponse || ''
                })) || [],
            });
        }
    }, [sensor]);

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
                            <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Nombre tipo sensor:</label>
                            <p className="ml-2 text-sm text-gray-600">{sensor.sensorTypeName}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Variable a medir:</label>
                            <p className="ml-2 text-sm text-gray-600">{sensor.variable?.name}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Nombre Comercial:</label>
                            <p className="ml-2 text-sm text-gray-600">{sensor.commercialName}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Fabricante Sensor:</label>
                            <p className="ml-2 text-sm text-gray-600">{sensor.manufacturer}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Vida útil:</label>
                            <p className="ml-2 text-sm text-gray-600">{sensor.lifespan} años</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Marca:</label>
                            <p className="ml-2 text-sm text-gray-600">{sensor.brand}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Modelo:</label>
                            <p className="ml-2 text-sm text-gray-600">{sensor.model}</p>
                        </div>
                    </div>


<br />
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Protocolo IOT:</label>
                            <p className="ml-2 text-sm text-gray-600">{sensor.iotProtocol}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Tipo de communicación IoT:</label>
                            <p className="ml-2 text-sm text-gray-600">{sensor.iotCommunicationType}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Señal de control:</label>
                            <p className="ml-2 text-sm text-gray-600">{sensor.signalType}</p>
                        </div>
                    </div>
<br />
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Datasheet:</label>
                            <p className="ml-2 text-sm text-gray-600">{sensor.datasheet}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Periocidad de mantenimiento en días:</label>
                            <p className="ml-2 text-sm text-gray-600">{sensor.maintenanceFrequency}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Periocidad de calibración de día:</label>
                            <p className="ml-2 text-sm text-gray-600">{sensor.calibrationFrequency}</p>
                        </div>
                    </div>

                </div>

                <div className="flex flex-col grid grid-cols-2 gap-4 mt-5">
                    <img
                        src={sensor.icon}
                        alt={sensor.sensorCode || "Sensor Icon"}
                        className="w-72 h-72 object-contain mb-4 border border-gray-400 p-2 rounded-lg  flex-col col-span-2"
                    />

                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Tipo de voltaje:</label>
                            <p className="ml-2 text-sm text-gray-600">{sensor.sensorTypeName}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Voltaje de operación:</label>
                            <p className="ml-2 text-sm text-gray-600">{sensor.operatingVoltage}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Precisión:</label>
                            <p className="ml-2 text-sm text-gray-600">{sensor.precision}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Resolución:</label>
                            <p className="ml-2 text-sm text-gray-600">{sensor.resolution}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Repetibilidad:</label>
                            <p className="ml-2 text-sm text-gray-600">{sensor.repeatability}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Valor máximo de medición:</label>
                            <p className="ml-2 text-sm text-gray-600">{sensor.maxMeasurementValue}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Valor mínimo de medición:</label>
                            <p className="ml-2 text-sm text-gray-600">{sensor.minMeasurementValue}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Temperatura mínima de operación:</label>
                            <p className="ml-2 text-sm text-gray-600">{sensor.minOperatingTemperature}</p>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <div className="flex items-center">
                            <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Temperatura máxima de operación:</label>
                            <p className="ml-2 text-sm text-gray-600">{sensor.maxOperatingTemperature}</p>
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
                                        <td className="border px-4 py-2"> Punto {index+1}</td>
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

export default FormViewSensor;
