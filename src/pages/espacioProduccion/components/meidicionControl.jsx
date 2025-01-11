import React, { useState, useEffect } from 'react';
import SensorService from '../../../services/SensorService';
import ActuadorService from '../../../services/ActuadorService';
import EspacioService from '../../../services/espacios';

const FormMedicion = ({ selectedVariableId, mode, onClose, control }) => {
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
        activationParameterRange: '',
        activationFrequency: '',
        alertMessage: '',
    });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
 


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

    useEffect(() => {
        if (control) {
            console.log("control : ", control)
            handleModeChange('measurementMode', control.measurementType)
            handleModeChange('controlMode', control.controlType,)
            setFormData({
                ...formData,
                measurementMode: control.measurementType || 'automatico',
                controlMode: control.controlType || 'automatico',
                sensorId: control.sensorId || '',
                samplingTimeUnit: control.samplingTimeUnit,
                samplingFrequency: control.samplingFrequency || '',
                numberOfSamples: control.numberOfSamples || '',
                controlType: control.controlType || '',
                actuatorId: control.actuatorId || '',
                actuationTimeUnit: control.actuationTimeUnit || '',
                activationParameterRange: control.activationParameterRange || '',
                activationFrequency: control.activationFrequency || '',
                alertMessage: control.alertMessage || '',
            });
        }
    }, [control]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleModeChange = (modeType, value) => {
        setFormData({ ...formData, [modeType]: value });
        console.log("modeType : ", value)
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
                    activationParameterRange: '',
                    activationFrequency: '',
                });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("preventDefault ejecutado");
        console.log(control)
        let formDataToSubmit;
        try {

            formDataToSubmit = {
                ...formData,
            };

            if (mode === 'create') {
                console.log('capturar la informacion')
            } else if (mode === 'edit') {
                setShowSuccessAlert("Editada")
                await EspacioService.updateControl(control.id, formDataToSubmit);

            }

            //   onUpdate();
            onClose();
        } catch (error) {
            console.error('Error al guardar la control:', error);
        }
        console.log('datos enviaos', formDataToSubmit)
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
                                <option value="Manual">Manual</option>
                            </select>
                        </div>

                        {formData.measurementMode !== 'Manual' && (
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
                                name="controlMode"
                                value={formData.controlMode}
                                onChange={(e) => handleModeChange('controlMode', e.target.value)}
                                className="w-full p-2 border rounded"
                            >
                                <option value="automatico">Automático</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </div>

                        {formData.controlMode == 'Manual' && (
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
                                        <option value="">Seleccione si o no </option>
                                        <option value="Si">Si</option>
                                        <option value="No">No</option>
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
