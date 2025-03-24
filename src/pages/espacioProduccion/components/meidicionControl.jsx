import React, { useState, useEffect } from 'react';
import SensorService from '../../../services/SensorService';
import ActuadorService from '../../../services/ActuadorService';
import EspacioService from '../../../services/espacios';

const FormMedicion = ({ selectedVariableId, mode, onClose, control ,variableId }) => {
    const [sensors, setSensors] = useState([]);
    const [actuators, setActuators] = useState([]);
    const [formData, setFormData] = useState({
        measurementType: 'automatico',
        controlType: 'automatico',
        sensorId: '',
        samplingTimeUnit: '',
        samplingFrequency: '',
        numberOfSamples: '',
        actuatorId: '',
        actuationTimeUnit: '',
        activationParameterRange: '',
        activationFrequency: '',
        alertMessage: '',
        productionVariableId: variableId,
    });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);


    useEffect(() => {
        const fetchSensors = async () => {
            try {
                const data = await SensorService.getAllSensor(0, {});
                setSensors(data);
            } catch (error) {
                console.error('Error fetching sensors:', error);
            }
        };
        fetchSensors(0, {});
    }, []);

    useEffect(() => {
        const fetchActuators = async () => {
            try {
                const data = await ActuadorService.getAllActuador(0, {});
                setActuators(data);
            } catch (error) {
                console.error('Error fetching actuators:', error);
            }
        };
        fetchActuators(0, {});
    }, []);

    useEffect(() => {
        if (control) {
            // handleModeChange('measurementType', control.measurementType)
            handleModeChange('controlType', control.controlType,)
            setFormData({
                ...formData,
                measurementType: control.measurementType || 'automatico',
                controlType: control.controlType || 'automatico',
                sensorId: control.sensorId || '',
                samplingTimeUnit: control.samplingTimeUnit,
                samplingFrequency: control.samplingFrequency || '',
                numberOfSamples: control.numberOfSamples || '',
                // controlType: control.controlType || '',
                actuatorId: control.actuatorId || '',
                actuationTimeUnit: control.actuationTimeUnit || '',
                activationParameterRange: control.activationParameterRange || '',
                activationFrequency: control.activationFrequency || '',
                alertMessage: control.alertMessage || '',
                productionVariableId: control.productionVariableId || '',
            });
        }
    }, [control]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleModeChange = (modeType, value) => {
        setFormData({ ...formData, [modeType]: value });
        if (value === 'automatico') {
            if (modeType === 'measurementType') {
                setFormData({
                    ...formData,
                    measurementType: value,
                    sensorId: '',
                    samplingTimeUnit: '',
                    samplingFrequency: '',
                    numberOfSamples: '',
                });
            } else if (modeType === 'controlType') {
                setFormData({
                    ...formData,
                    controlType: value,
                    actuatorId: '',
                    actuationTimeUnit: '',
                    activationParameterRange: '',
                    activationFrequency: '',
                });
            }
        }
    };
    const handleChange = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
      };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
    
        let formDataToSubmit;
        try {
            formDataToSubmit = {
                ...formData,
                productionVariableId: parseInt(formData.productionVariableId, 10),  
                actuatorId: parseInt(formData.actuatorId, 10),  
                activationFrequency: parseInt(formData.activationFrequency, 10) ,
                numberOfSamples: parseInt(formData.numberOfSamples,10),
                samplingFrequency: parseInt(formData.samplingFrequency,10),
                sensorId: parseInt(formData.sensorId,10)
            };
    
            if (mode === 'create') {
            } else if (mode === 'edit') {
                setShowSuccessAlert("Editada");
                await EspacioService.updateControl(control.id, formDataToSubmit);
            }
    
            onClose();
        } catch (error) {
            console.error('Error al guardar la control:', error);
        }
        selectedVariableId(formDataToSubmit);

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
                                name="measurementType"
                                value={formData.measurementType}
                                onChange={(e) => handleModeChange('measurementType', e.target.value)}
                                className="w-full p-2 border rounded"
                            >
                                <option value="automatico">Automático</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </div>

                        {formData.measurementType !== 'Manual' && (
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
                                        <option value="Mensual">Mensual</option>
                                        <option value="Semanal">Semanal</option>
                                        <option value="Diaria">Diaria</option>
                                        <option value="Horas">Horas</option>
                                        <option value="Minutos">Minutos</option>
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
                                name="controlType"
                                value={formData.controlType}
                                onChange={(e) => handleModeChange('controlType', e.target.value)}
                                className="w-full p-2 border rounded"
                            >
                                <option value="automatico">Automático</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </div>

                        {formData.controlType !== 'Manual' && (
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
                                        <option value="Mensual">Mensual</option>
                                        <option value="mSemanals">Semanal</option>
                                        <option value="Diaria">Diaria</option>
                                        <option value="Horas">Horas</option>
                                        <option value="Minutos">Minutos</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">
                                        Activación por rango de páramentros<span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.activationParameterRange}
                                        name="activationParameterRange"
                                        placeholder="Activación por rango de párametros"

                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    >
                                        <option value="">Seleccione una opción </option>
                                        <option value="Control por limite maximo">Control por limite maximo</option>
                                        <option value="Control por limite mínimo">Control por limite mínimo</option>
                                        <option value="No Aplica">No Aplica</option>
                                    </select>
                                </div>


                                <div>
                                    <label className="block text-sm font-medium">
                                        Frecuencia de activación<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
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

                <div className="flex justify-end space-x-2">
                    {mode === 'view' ? (
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-white text-gray-500 px-4 py-2 rounded border border-gray-400"
                        >
                            Volver
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-white text-gray-500 px-4 py-2 rounded border border-gray-400"
                            >
                                Cerrar
                            </button>
                            <button
                                type="submit"
                                className="bg-[#168C0DFF] text-white px-4 py-2 rounded "
                            >
                                {mode === 'create' ? "Crear Medición y control" : "Guardar Cambios"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </form>
    );
};

export default FormMedicion;
