import React, { useEffect, useState } from 'react';
import { IoCloudUploadOutline } from "react-icons/io5";
import VariableService from '../../../services/variableService';
import TypeDispotivicosService from '../../../services/TypeDispositivosService';
import Success from '../../../components/alerts/success';
import UploadToS3 from '../../../config/UploadToS3';
import ErrorAlert from '../../../components/alerts/error';
import { Edit, Trash, Eye } from 'lucide-react';
import CompanyService from '../../../services/CompanyService';


const FormSensor = ({ showErrorAlert, onUpdate, selectedCompany, sensor, mode, onClose, companyId }) => {
    const companySeleector = JSON.parse(localStorage.getItem("selectedCompany"));
    const [variableList, setVariableList] = useState([]);
    const [showAlertError, setShowAlertError] = useState(false);
    const [messageAlert, setMessageAlert] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [step, setStep] = useState(1); // Control del paso actual
    const [companies, setCompanies] = useState([]);

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
        company_id: companySeleector.value || '',
        calibrationPoints: [],

    });

    const [errorMessages, setErrorMessages] = useState({});


    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        const fetchVariable = async () => {
            try {
                const Variables = await VariableService.getAllVariable();
                setVariableList(Variables);
            } catch (error) {
                console.error('Error al obtener variables:', error);
            }
        };
        fetchVariable();

        const fetchCompanies = async () => {
            try {
                const fetchedCompanies = await CompanyService.getAllCompany();
                setCompanies(fetchedCompanies);
            } catch (error) {
                console.error('Error al obtener las empresas:', error);
            }
        };

        fetchCompanies();
    }, []);



    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
        setErrorMessages((prev) => ({ ...prev, [name]: "" }));

    };
    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                icon: file,
            });

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };


    const handleNext = (e) => {
        e.preventDefault();

        // Inicializamos un objeto para los errores
        let errors = {};

        // Validación de campos obligatorios
        if (!formData.sensorTypeName) errors.sensorTypeName = "Este campo es obligatorio";
        if (!formData.commercialName) errors.commercialName = "Este campo es obligatorio";
        if (!formData.manufacturer) errors.manufacturer = "Este campo es obligatorio";
        if (!formData.brand) errors.brand = "Este campo es obligatorio";
        if (!formData.model) errors.model = "Este campo es obligatorio";
        if (!formData.lifespan) errors.lifespan = "Este campo es obligatorio";
        if (!formData.iotProtocol) errors.iotProtocol = "Este campo es obligatorio";
        if (!formData.iotCommunicationType) errors.iotCommunicationType = "Este campo es obligatorio";
        if (!formData.datasheet) errors.datasheet = "Este campo es obligatorio";
        if (!formData.variableId) errors.variableId = "Este campo es obligatorio";
        if (!formData.maxMeasurementValue) errors.maxMeasurementValue = "Este campo es obligatorio";
        if (!formData.minMeasurementValue) errors.minMeasurementValue = "Este campo es obligatorio";

        // Validación: El valor máximo no puede ser menor al valor mínimo
        if (parseFloat(formData.maxMeasurementValue) < parseFloat(formData.minMeasurementValue)) {
            errors.maxMeasurementValue = 'El valor máximo no puede ser menor que el valor mínimo.';
            errors.minMeasurementValue = 'El valor mínimo no puede ser mayor que el valor máximo.';
        }

        // Si hay errores, no permitir avanzar al siguiente paso
        if (Object.keys(errors).length > 0) {
            setErrorMessages(errors);
            return;  // Evita avanzar al siguiente paso
        }

        // Si no hay errores, limpiar los mensajes y proceder al siguiente paso
        setErrorMessages({});
        setStep((prevStep) => Math.min(prevStep + 1, 2));
    };



    const handlePrevious = () => setStep((prevStep) => Math.max(prevStep - 1, 1));

    useEffect(() => {
        if (selectedCompany) {
            setFormData((prevData) => ({
                ...prevData,
                company_id: companySeleector.value || ''
            }));
        }
    }, [selectedCompany]);

    useEffect(() => {
        if ((mode === 'edit' || mode === 'view') && sensor) {
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
            console.log('tipo de sensor traido:', sensor)
            setImagePreview(sensor.icon); // Actualización de la vista previa del ícono
        } else {
            setFormData({
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
                variableId: '',
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
                company_id: companySeleector.value || '',

                calibrationPoints: [
                    { value: '', normalResponse: '' }
                ],
            });
        }
    }, [mode, sensor, companySeleector.value]);  // Asegúrate de que `sensor` y `companySeleector.value` estén en las dependencias



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let iconUrl = '';

            if (formData.icon && formData.icon instanceof File) {
                // Si `icon` es un archivo, súbelo a S3
                iconUrl = await UploadToS3(formData.icon);
            } else if (sensor?.icon) {
                // Si no es un archivo pero existe un icono en el sensor, reutilízalo
                iconUrl = sensor.icon;
            }

            const formDataToSubmit = {
                icon: iconUrl, // Usa la URL resultante de S3 o el icono existente
                sensorTypeName: formData.sensorTypeName,
                commercialName: formData.commercialName,
                manufacturer: formData.manufacturer,
                brand: formData.brand,
                model: formData.model,
                lifespan: Number(formData.lifespan),
                iotProtocol: formData.iotProtocol,
                iotCommunicationType: formData.iotCommunicationType,
                datasheet: formData.datasheet,
                variableId: Number(formData.variableId),
                maxMeasurementValue: Number(formData.maxMeasurementValue),
                minMeasurementValue: Number(formData.minMeasurementValue),
                precision: formData.precision,
                resolution: parseFloat(formData.resolution),
                repeatability: parseFloat(formData.repeatability),
                operatingVoltage: Number(formData.operatingVoltage),
                signalType: formData.signalType,
                maxSamplingFrequency: Number(formData.maxSamplingFrequency),
                samplingConditions: formData.samplingConditions,
                alertTimeWindow: Number(formData.alertTimeWindow),
                alertTolerancePercentage: Number(formData.alertTolerancePercentage),
                minOperatingTemperature: Number(formData.minOperatingTemperature),
                maxOperatingTemperature: Number(formData.maxOperatingTemperature),
                maintenanceFrequency: Number(formData.maintenanceFrequency),
                calibrationFrequency: Number(formData.calibrationFrequency),
                company_id: Number(companyId) || Number(formData.company_id),
                calibrationPoints: formData.calibrationPoints.map((point) => ({
                    value: Number(point.value || 0),
                    normalResponse: Number(point.normalResponse || 0),
                })),
            };

            if (mode === 'create') {
                await TypeDispotivicosService.createSensor(formDataToSubmit);
                showErrorAlert("Sensor creado");
            } else if (mode === 'edit') {
                await TypeDispotivicosService.updateSensor(sensor.id, formDataToSubmit);
                showErrorAlert("Sensor actualizado");
            }

            console.log('Datos enviados:', formDataToSubmit);
            onClose();
            onUpdate();
        } catch (error) {
            console.error('Error al guardar el sensor:', error);
            setShowAlertError(true);
            setMessageAlert("Error al guardar el sensor");
        }
    };




    const handleAddPoint = () => {
        const { value, normalResponse } = formData;
    
        // Validar que ambos campos tengan datos
        if (!value.trim() || !normalResponse.trim()) {
            alert('Por favor, completa ambos campos antes de agregar.');
            return;
        }
    
        setFormData((prev) => ({
            ...prev,
            calibrationPoints: [...prev.calibrationPoints, { value, normalResponse }],
            value: '', // Limpia el campo de entrada
            normalResponse: '' // Limpia el campo de entrada
        }));
    };
    

    const handleDeletePoint = (index) => {
        setFormData((prev) => ({
            ...prev,
            calibrationPoints: prev.calibrationPoints.filter((_, i) => i !== index)
        }));
    };

    useEffect(() => {
        console.log(formData.calibrationPoints); // Verifica el estado en cada renderizado
    }, [formData.calibrationPoints]);
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
                Paso {step}: {step === 1 ? 'Crear tipo de sensor' : 'Detalles del sensor'}
            </h2>
            {step === 1 && (
                <>
                    <div className="mb- py-">
                        <label>Adjuntar Logo</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-0 text-center cursor-pointer hover:bg-gray-50" onClick={() => document.getElementById('logo-upload').click()}>
                            {imagePreview ? (
                                <img src={imagePreview} alt="Logo" className="mx-auto h-20 object-contain" />
                            ) : (
                                <>
                                    <IoCloudUploadOutline className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-1 text-sm text-gray-600">
                                        Haga <span className="text-cyan-500 underline">clic aquí</span> para cargar o arrastre y suelte
                                    </p>
                                    <p className="text-xs text-gray-500">Archivos máximo 10 mb</p>
                                </>
                            )}
                        </div>
                        <input id="logo-upload" type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre tipo Sensor</label>
                            <input
                                type="text"
                                name="sensorTypeName"
                                placeholder="Nombre del sensor"
                                value={formData.sensorTypeName}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                            {errorMessages.sensorTypeName && (
                                <p className="text-sm text-red-500">{errorMessages.sensorTypeName}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre Comercial</label>
                            <input
                                type="text"
                                name="commercialName"
                                placeholder="Nombre comercial"
                                value={formData.commercialName}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                            {errorMessages.commercialName && (
                                <p className="text-sm text-red-500">{errorMessages.commercialName}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fabricante del sensor</label>
                            <input
                                type="text"
                                name="manufacturer"
                                placeholder="Fabricante"
                                value={formData.manufacturer}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                            {errorMessages.manufacturer && (
                                <p className="text-sm text-red-500">{errorMessages.manufacturer}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Marca</label>
                            <input
                                type="text"
                                name="brand"
                                placeholder="Marca"
                                value={formData.brand}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                            {errorMessages.brand && (
                                <p className="text-sm text-red-500">{errorMessages.brand}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Modelo</label>
                            <input
                                type="text"
                                name="model"
                                placeholder="Modelo"
                                value={formData.model}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                            {errorMessages.model && (
                                <p className="text-sm text-red-500">{errorMessages.model}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Vida útil (en meses)</label>
                            <input
                                type="number"
                                name="lifespan"
                                placeholder="Vida útil en meses"
                                value={formData.lifespan}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                            {errorMessages.lifespan && (
                                <p className="text-sm text-red-500">{errorMessages.lifespan}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Protocolo IOT</label>
                            <input
                                type="text"
                                name="iotProtocol"
                                placeholder="Protocolo IoT"
                                value={formData.iotProtocol}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                            {errorMessages.iotProtocol && (
                                <p className="text-sm text-red-500">{errorMessages.iotProtocol}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tipo de Comunicación IOT</label>
                            <input
                                type="text"
                                name="iotCommunicationType"
                                placeholder="Tipo de comunicación IoT"
                                value={formData.iotCommunicationType}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                            {errorMessages.iotCommunicationType && (
                                <p className="text-sm text-red-500">{errorMessages.iotCommunicationType}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Datasheet</label>
                            <input
                                type="text"
                                name="datasheet"
                                placeholder="Link de Datasheet"
                                value={formData.datasheet}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                            {errorMessages.datasheet && (
                                <p className="text-sm text-red-500">{errorMessages.datasheet}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Variable a medir</label>
                            <select
                                name="variableId"
                                value={formData.variableId}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            >
                                <option value="">Seleccionar Variable</option>
                                {variableList.map(variable => (
                                    <option key={variable.id} value={variable.id}>{variable.name}</option>
                                ))}
                            </select>
                            {errorMessages.variableId && (
                                <p className="text-sm text-red-500">{errorMessages.variableId}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Valor máximo de medición</label>
                            <input
                                type="number"
                                name="maxMeasurementValue"
                                placeholder="Valor máximo de medición"
                                value={formData.maxMeasurementValue}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                            {errorMessages.maxMeasurementValue && (
                                <p className="text-sm text-red-500">{errorMessages.maxMeasurementValue}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Valor mínimo de medición</label>
                            <input
                                type="number"
                                name="minMeasurementValue"
                                placeholder="Valor mínimo de medición"
                                value={formData.minMeasurementValue}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                            {errorMessages.minMeasurementValue && (
                                <p className="text-sm text-red-500">{errorMessages.minMeasurementValue}</p>
                            )}
                        </div>
                    </div>
                </>
            )}

            {step === 2 && (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Presición</label>
                            <input
                                type="text"
                                name="precision"
                                placeholder="precision"
                                value={formData.precision}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Resolución</label>
                            <input
                                type="number"
                                name="resolution"
                                placeholder="Resolución"
                                value={formData.resolution}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Repetibilidad</label>
                            <input
                                type="number"
                                name="repeatability"
                                placeholder="Repetibilidad"
                                value={formData.repeatability}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Voltaje de operación</label>
                            <input
                                type="number"
                                name="operatingVoltage"
                                placeholder="Voltaje de operación"
                                value={formData.operatingVoltage}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tipo de señal</label>
                            <input
                                type="text"
                                name="signalType"
                                placeholder="Tipo de señal"
                                value={formData.signalType}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Frecuencia máxima de muestreo</label>
                            <input
                                type="number"
                                name="maxSamplingFrequency"
                                placeholder="Frecuencia máxima de muestreo"
                                value={formData.maxSamplingFrequency}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Condiciones de muestreo</label>
                            <input
                                type="text"
                                name="samplingConditions"
                                placeholder="Condiciones de muestreo"
                                value={formData.samplingConditions}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ventana de tiempo antes de alertas</label>
                            <input
                                type="number"
                                name="alertTimeWindow"
                                placeholder="Ventana de tiempo antes de alertas"
                                value={formData.alertTimeWindow}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Temperatura mínima de operación</label>
                            <input
                                type="number"
                                name="minOperatingTemperature"
                                placeholder="Temperatura mínima de operación"
                                value={formData.minOperatingTemperature}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Temperatira máxima operación</label>
                            <input
                                type="number"
                                name="maxOperatingTemperature"
                                placeholder="Temperatira máxima operación"
                                value={formData.maxOperatingTemperature}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                            {errorMessages.phone && (
                                <p className="text-sm text-red-500">{errorMessages.phone}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Periocidad de mantenimiento preventivo</label>
                            <input
                                type="number"
                                name="maintenanceFrequency"
                                placeholder="Periocidad de mantenimiento preventivo"
                                value={formData.maintenanceFrequency}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                            {errorMessages.phone && (
                                <p className="text-sm text-red-500">{errorMessages.phone}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Periocidad de calibracón</label>
                            <input
                                type="number"
                                name="calibrationFrequency"
                                placeholder="Periocidad de calibracón"
                                value={formData.calibrationFrequency}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                            {errorMessages.phone && (
                                <p className="text-sm text-red-500">{errorMessages.phone}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">% de tolerancia antes de la alerta</label>
                        <input
                            type="number"
                            name="alertTolerancePercentage"
                            placeholder="% de tolerancia antes de la alerta"
                            value={formData.alertTolerancePercentage}
                            onChange={handleChange}
                            disabled={mode === 'view'}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                        {errorMessages.phone && (
                            <p className="text-sm text-red-500">{errorMessages.phone}</p>
                        )}
                    </div>
                    <div >
                        <label htmlFor="company_id" className="block text-sm font-medium text-gray-700">Empresa</label>
                        <select
                            id="company_id"
                            name="company_id"
                            value={formData.company_id}
                            onChange={handleChange}
                            disabled={mode === 'view'}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            required
                        >
                            <option value="">Seleccione una empresa</option>
                            {companies.map((company) => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='border border-gray-300 rounded-md'>
                        <div className="flex justify-between items-center p-6 border-b">

                            <h2 className="text-xl font-semibold">Punto de calibración</h2>
                           

                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className='px-3 py-3'>
                                <label className="block text-sm font-medium text-gray-700">Valor</label>
                                <input
                                    type="number"
                                    name="value"
                                    placeholder="Valor"
                                    value={formData.value}
                                    onChange={handleChange}
                                    disabled={mode === 'view'}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                                {errorMessages.phone && (
                                    <p className="text-sm text-red-500">{errorMessages.phone}</p>
                                )}
                            </div>
                            <div className='px-3 py-3'>
                                <label className="block text-sm font-medium text-gray-700">Respuesta normal</label>
                                <input
                                    type="number"
                                    name="normalResponse"
                                    placeholder="Respuesta normal"
                                    value={formData.normalResponse}
                                    onChange={handleChange}
                                    disabled={mode === 'view'}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 "
                                />
                                {errorMessages.phone && (
                                    <p className="text-sm text-red-500">{errorMessages.phone}</p>
                                )}
                            </div>
                            <div className='px-3 py-3'>
                                <label className="block text-sm font-medium text-white"> .</label>
                                <button
                                type="button"
                                onClick={handleAddPoint}
                                className="mb-2 inline-flex items-center px-5 py-3 border border-[#168C0DFF] text-sm leading-4 font-medium rounded-md text-[#168C0DFF] bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"

                            >
                                Agregar
                            </button>
                            </div>
                           
                        </div>
                        <table className="min-w-full table-auto border-collapse mb-4 mt-4">
    <thead>
        <tr className="bg-gray-200">
            <th className="border px-4 py-2 font-semibold">Valor</th>
            <th className="border px-4 py-2 font-semibold">Respuesta</th>
            <th className="border px-4 py-2 font-semibold">Acciones</th>
        </tr>
    </thead>
    <tbody>
        {formData.calibrationPoints.length > 0 ? ( // Solo renderiza filas si hay puntos
            formData.calibrationPoints.map((param, index) => (
                <tr key={index}>
                    <td className="border px-4 py-2">{param.value}</td>
                    <td className="border px-4 py-2">{param.normalResponse}</td>
                    <td className="border px-4 py-2">
                        <button
                        type='button'
                            onClick={() => handleDeletePoint(index)}
                            className="text-red-500 hover:text-red-700 px-2 py-2 rounded"
                        >
                            <Trash size={20} />
                        </button>
                    </td>
                </tr>
            ))
        ) : null} {/* No renderiza filas ni muestra mensaje */}
    </tbody>
</table>

{/* Mostrar mensaje solo si la tabla está vacía */}
{formData.calibrationPoints.length === 0 && (
    <p className="text-center py-4 text-gray-500">
        No hay puntos de calibración agregados.
    </p>
)}


                    </div>
                </>
            )}

            <div className="flex justify-end mt-4 space-x-2">
                {step > 1 && (
                    <button
                        type="button"
                        onClick={handlePrevious}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                    >
                        Anterior
                    </button>
                )}
                {step < 2 ? (
                    <button
                        type="button"
                        onClick={handleNext}
                        className="bg-[#168C0DFF] text-white px-4 py-2 rounded"
                        disabled={!!errorMessages.maxMeasurementValue || !!errorMessages.minMeasurementValue}  // Deshabilitar si hay errores
                    >
                        Siguiente
                    </button>
                ) : (
                    <button
                        type="submit"
                        // disabled={isButtonDisabled}
                        className="bg-[#168C0DFF] text-white px-4 py-2 rounded"
                    >
                        {mode === 'create' ? 'Crear Tipo sensor' : 'Guardar Cambios'}
                    </button>
                )}
            </div>


            {/* {showAlertError && <ErrorAlert message={messageAlert} />} */}
        </form>
    );
};

export default FormSensor;
