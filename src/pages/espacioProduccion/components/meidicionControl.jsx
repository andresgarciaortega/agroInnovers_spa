import React, { useState, useEffect } from 'react';
import SensorService from '../../../services/SensorService';
import ActuadorService from '../../../services/ActuadorService';

const FormMedicion = ({ selectedVariableId, onClose }) => {
    const [sensors, setSensors] = useState([]);
    const [actuators, setActuators] = useState([]);
    const [formData, setFormData] = useState({
        measurementMode: 'automatico',
        controlMode: 'automatico',
        measurementType: '',
        sensorId: '',
        samplingTimeUnit: '',
        samplingFrequency: '',
        numberOfSamples: '',
        controlType: '',
        actuatorId: '',
        actuationTimeUnit: '',
        activationRange: '',
        activationFrequency: '',
        alertMessage: '',
    });

    useEffect(() => {
        const fetchSensors = async () => {
            try {
                const data = await SensorService.getAllSensor();
                setSensors(data);
            } catch (error) {
                console.error('Error fetching sensors:', error);
            }
        };
        fetchSensors();
    }, []);

    useEffect(() => {
        const fetchActuators = async () => {
            try {
                const data = await ActuadorService.getAllActuador();
                setActuators(data);
            } catch (error) {
                console.error('Error fetching actuators:', error);
            }
        };
        fetchActuators();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleModeChange = (modeType, value) => {
        setFormData({ ...formData, [modeType]: value });
        if (value === 'automatico') {
            if (modeType === 'measurementMode') {
                setFormData({
                    ...formData,
                    measurementMode: value,
                    measurementType: '',
                    sensorId: '',
                    samplingTimeUnit: '',
                    samplingFrequency: '',
                    numberOfSamples: '',
                });
            } else if (modeType === 'controlMode') {
                setFormData({
                    ...formData,
                    controlMode: value,
                    controlType: '',
                    actuatorId: '',
                    actuationTimeUnit: '',
                    activationRange: '',
                    activationFrequency: '',
                });
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Formulario enviado:', formData);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-2 max-w-4xl mx-auto space-y-8">
                <div>
                    <h2 className="text-lg font-semibold mb-4">¿Cómo se mide?</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">
                                Tipo de medición<span className="text-red-500">*</span>
                            </label>
                            <select
                                name="measurementMode"
                                value={formData.measurementMode}
                                onChange={(e) => handleModeChange('measurementMode', e.target.value)}
                                className="w-full p-2 border rounded"
                            >
                                <option value="automatico">Automático</option>
                                <option value="manual">Manual</option>
                            </select>
                        </div>

                        {formData.measurementMode === 'automatico' && (
                            <div className="grid grid-cols-2 gap-4">
                                {/* Selector de sensor */}
                                <div>
                                    <label className="block text-sm font-medium">
                                        Sensor<span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="sensorId"
                                        value={formData.sensorId}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    >
                                        <option value="">Seleccione un sensor</option>
                                        {sensors.map((sensor) => (
                                            <option key={sensor.id} value={sensor.id}>
                                                {sensor.sensorCode}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Unidad de tiempo de muestreo */}
                                <div>
                                    <label className="block text-sm font-medium">
                                        Unidad de tiempo de muestreo<span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="samplingTimeUnit"
                                        value={formData.samplingTimeUnit}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    >
                                        <option value="">Seleccione una unidad</option>
                                        <option value="ms">Mensual</option>
                                        <option value="ms">Semanal</option>
                                        <option value="ms">Diaria</option>
                                        <option value="s">Horas</option>
                                        <option value="min">Minutos</option>
                                    </select>
                                </div>

                                {/* Frecuencia de muestreo */}
                                <div>
                                    <label className="block text-sm font-medium">
                                        Frecuencia de muestreo<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Frecuencia de muestreo"

                                        name="samplingFrequency"
                                        value={formData.samplingFrequency}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>

                                {/* Número de muestras */}
                                <div>
                                    <label className="block text-sm font-medium">
                                        N° de mediciones<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Número de mediciones"

                                        name="numberOfSamples"
                                        value={formData.numberOfSamples}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Control */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">¿Cómo se controla?</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">
                                Tipo de Control<span className="text-red-500">*</span>
                            </label>
                            <select
                                name="controlMode"
                                value={formData.controlMode}
                                onChange={(e) => handleModeChange('controlMode', e.target.value)}
                                className="w-full p-2 border rounded"
                            >
                                <option value="automatico">Automático</option>
                                <option value="manual">Manual</option>
                            </select>
                        </div>

                        {formData.controlMode === 'automatico' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">
                                        Actuador<span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="actuatorId"
                                        value={formData.actuatorId}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    >
                                        <option value="">Seleccione un actuador</option>
                                        {actuators.map((actuator) => (
                                            <option key={actuator.id} value={actuator.id}>
                                                {actuator.actuatorCode}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">
                                        Unidad de tiempo de activación<span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="actuationTimeUnit"
                                        value={formData.actuationTimeUnit}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    >
                                        <option value="">Seleccione una unidad</option>
                                        <option value="ms">Mensual</option>
                                        <option value="ms">Semanal</option>
                                        <option value="ms">Diaria</option>
                                        <option value="s">Horas</option>
                                        <option value="min">Minutos</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">
                                        Activación por rango de páramentros<span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.activationRange}
                                        name="actuationTimeUnit"
                                        placeholder="Activación por rango de párametros"

                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    >
                                        <option value="">Seleccione si o no </option>
                                        <option value="ms">Si</option>
                                        <option value="ms">No</option>
                                    </select>
                                </div>


                                <div>
                                    <label className="block text-sm font-medium">
                                        Frecuencia de activación<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="activationFrequency"
                                        placeholder="Frecuencia de activación"

                                        value={formData.activationFrequency}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium">
                                        Mensaje de alerta<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Mensaje de alerta"

                                        name="alertMessage"
                                        value={formData.alertMessage}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button type="submit" className="px-4 py-2 bg-[#168C0DFF] text-white rounded">
                        Guardar
                    </button>
                </div>
            </div>
        </form>
    );
};

export default FormMedicion;
