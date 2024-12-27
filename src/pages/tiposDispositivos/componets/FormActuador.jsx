import React, { useEffect, useState } from 'react';
import { IoCloudUploadOutline } from "react-icons/io5";
import VariableService from '../../../services/variableService';
import TypeDispotivicosService from '../../../services/TypeDispositivosService';
import Success from '../../../components/alerts/success';
import UploadToS3 from '../../../config/UploadToS3';
import ErrorAlert from '../../../components/alerts/error';
import { Edit, Trash, Eye } from 'lucide-react';
import CompanyService from '../../../services/CompanyService';


const FormActuador = ({ showErrorAlert, onUpdate, selectedCompany, actuador, mode, onClose, companyId }) => {
    const companySeleector = JSON.parse(localStorage.getItem("selectedCompany"));
    const [variableList, setVariableList] = useState([]);
    const [showAlertError, setShowAlertError] = useState(false);
    const [messageAlert, setMessageAlert] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [step, setStep] = useState(1); // Control del paso actual
    const [companies, setCompanies] = useState([]);

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
        company_id: companySeleector.value || ''
        ,
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
        if (!formData.actuatorTypeName) errors.actuatorTypeName = "Este campo es obligatorio";
        if (!formData.commercialName) errors.commercialName = "Este campo es obligatorio";
        if (!formData.manufacturer) errors.manufacturer = "Este campo es obligatorio";
        if (!formData.brand) errors.brand = "Este campo es obligatorio";
        if (!formData.model) errors.model = "Este campo es obligatorio";
        if (!formData.lifespan) errors.lifespan = "Este campo es obligatorio";
        if (!formData.iotProtocol) errors.iotProtocol = "Este campo es obligatorio";
        if (!formData.iotCommunicationType) errors.iotCommunicationType = "Este campo es obligatorio";
        if (!formData.datasheet) errors.datasheet = "Este campo es obligatorio";
        if (!formData.outputType) errors.outputType = "Este campo es obligatorio";
        if (!formData.maxValue) errors.maxValue = "Este campo es obligatorio";
        if (!formData.minValue) errors.minValue = "Este campo es obligatorio";

        // Validación: El valor máximo no puede ser menor al valor mínimo
        if (parseFloat(formData.maxValue) < parseFloat(formData.minValue)) {
            errors.maxValue = 'El valor máximo no puede ser menor que el valor mínimo.';
            errors.minValue = 'El valor mínimo no puede ser mayor que el valor máximo.';
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
        if ((mode === 'edit' || mode === 'view') && actuador) {
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
            setImagePreview(actuador.icon); // Actualización de la vista previa del ícono
        } else {
            setFormData({
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
                company_id: companySeleector.value || '',

                calibrationPoints: [
                    { value: '', normalResponse: '' }
                ],
            });
        }
    }, [mode, actuador, companySeleector.value]);  // Asegúrate de que `actuador` y `companySeleector.value` estén en las dependencias



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let iconUrl = '';

            if (formData.icon && formData.icon instanceof File) {
                // Si `icon` es un archivo, súbelo a S3
                iconUrl = await UploadToS3(formData.icon);
            } else if (actuador?.icon) {
                // Si no es un archivo pero existe un icono en el actuador, reutilízalo
                iconUrl = actuador.icon;
            }

            // Asegurarse de que los valores de `maintenanceFrequency` y `calibrationFrequency` sean números válidos
            const validMaintenanceFrequency = isNaN(formData.maintenanceFrequency) ? null : parseFloat(formData.maintenanceFrequency);
            const validCalibrationFrequency = isNaN(formData.calibrationFrequency) ? null : parseFloat(formData.calibrationFrequency);

            const formDataToSubmit = {
                icon: iconUrl, // Usa la URL resultante de S3 o el icono existente
                actuatorTypeName: formData.actuatorTypeName,
                commercialName: formData.commercialName,
                manufacturer: formData.manufacturer,
                lifespan: Number(formData.lifespan),
                brand: formData.brand,
                model: formData.model,
                datasheet: formData.datasheet,
                outputType: formData.outputType,
                iotProtocol: formData.iotProtocol,
                iotCommunicationType: formData.iotCommunicationType,
                controlSignal: String(formData.controlSignal), // Convertir a cadena
                maxValue: Number(formData.maxValue),
                minValue: Number(formData.minValue),
                precision: formData.precision ? parseFloat(formData.precision) : null, // Validar precision
                speed: Number(formData.speed),
                repeatability: parseFloat(formData.repeatability),
                operatingVoltage: Number(formData.operatingVoltage),
                voltageType: formData.voltageType,
                maxSamplingFrequency: Number(formData.maxSamplingFrequency),
                maintenanceFrequency: validMaintenanceFrequency, // Usar valor validado
                calibrationFrequency: validCalibrationFrequency, // Usar valor validado
                minOperatingTemperature: Number(formData.minOperatingTemperature),
                maxOperatingTemperature: Number(formData.maxOperatingTemperature),
                company_id: Number(companyId) || Number(formData.company_id),
                calibrationPoints: formData.calibrationPoints.map((point) => ({
                    value: Number(point.value || 0),
                    normalResponse: Number(point.normalResponse || 0),
                })),
            };

            if (mode === 'create') {
                await TypeDispotivicosService.createActuador(formDataToSubmit);
                showErrorAlert("Actuador creado");
            } else if (mode === 'edit') {
                await TypeDispotivicosService.updateActuador(actuador.id, formDataToSubmit);
                showErrorAlert("Actuador actualizado");
            }

            console.log('Datos enviados:', formDataToSubmit);
            onClose();
            onUpdate();
        } catch (error) {
            console.error('Error al guardar el actuador:', error);
            setShowAlertError(true);
            setMessageAlert("Error al guardar el actuador");
        }
    };






    const handleAddPoint = () => {
        const { value, normalResponse } = formData;

        // Validación simple para evitar agregar entradas vacías
        if (!value || !normalResponse) {
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


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
                Paso {step}: {step === 1 ? 'Crear tipo de actuador' : 'Detalles del actuador'}
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
                            <label className="block text-sm font-medium text-gray-700">Nombre tipo Actuador</label>
                            <input
                                type="text"
                                name="actuatorTypeName"
                                placeholder="Nombre del actuador"
                                value={formData.actuatorTypeName}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                            {errorMessages.actuatorTypeName && (
                                <p className="text-sm text-red-500">{errorMessages.actuatorTypeName}</p>
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
                            <label className="block text-sm font-medium text-gray-700">Fabricante del actuador</label>
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
                            <label className="block text-sm font-medium text-gray-700">Vida útil</label>
                            <input
                                type="number"
                                name="lifespan"
                                placeholder="Vida útil"
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
                            <label className="block text-sm font-medium text-gray-700">Datasheet</label>
                            <input
                                type="text"
                                name="datasheet"
                                placeholder="Link de Datasheet "
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
                            <label className="block text-sm font-medium text-gray-700">Tipo de salida</label>
                            <input
                                type="text"
                                name="outputType"
                                placeholder="Protocolo IoT"
                                value={formData.outputType}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                            {errorMessages.outputType && (
                                <p className="text-sm text-red-500">{errorMessages.outputType}</p>
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
                            <label className="block text-sm font-medium text-gray-700">Valor máximo de medición</label>
                            <input
                                type="number"
                                name="maxValue"
                                placeholder="Valor máximo de medición"
                                value={formData.maxValue}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                            {errorMessages.maxValue && (
                                <p className="text-sm text-red-500">{errorMessages.maxValue}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Valor mínimo de medición</label>
                            <input
                                type="number"
                                name="minValue"
                                placeholder="Valor mínimo de medición<"
                                value={formData.minValue}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                            {errorMessages.minValue && (
                                <p className="text-sm text-red-500">{errorMessages.minValue}</p>
                            )}
                        </div>
                    </div>
                    <div className=" ">
                        <label className="block text-sm font-medium text-gray-700">Señal de control</label>
                        <input
                            type="text"
                            name="controlSignal"
                            placeholder="Ventana de tiempo antes de alertas"
                            value={formData.controlSignal}
                            onChange={handleChange}
                            disabled={mode === 'view'}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                        {errorMessages.controlSignal && (
                            <p className="text-sm text-red-500">{errorMessages.controlSignal}</p>
                        )}
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
                                placeholder="Posición"
                                value={formData.precision}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Velocidad</label>
                            <input
                                type="number"
                                name="speed"
                                placeholder="Velocidad"
                                value={formData.speed}
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
                            <label className="block text-sm font-medium text-gray-700">Tipo de voltaje</label>
                            <input
                                type="text"
                                name="voltageType"
                                placeholder="Tipo de voltaje"
                                value={formData.voltageType}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Frecuencia de muestreo</label>
                            <input
                                type="number"
                                name="maxSamplingFrequency"
                                placeholder="Frecuencia de muestreo"
                                value={formData.maxSamplingFrequency}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Periocidad de mantenimiento</label>
                            <input
                                type="number"
                                name="maintenanceFrequency"
                                placeholder="Condiciones de muestreo"
                                value={formData.maintenanceFrequency}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Periocidad de calibración</label>
                            <input
                                type="number"
                                name="calibrationFrequency"
                                placeholder="Condiciones de muestreo"
                                value={formData.calibrationFrequency}
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
                            <button
                                type="button"
                                onClick={handleAddPoint}
                                className="mb-2 inline-flex items-center px-3 py-2 border border-[#168C0DFF] text-sm leading-4 font-medium rounded-md text-[#168C0DFF] bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"

                            >
                                Agregar
                            </button>

                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className='px-2'>
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
                            <div className='px-2'>
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
                        </div>
                        <table className="min-w-full table-auto border-collapse mb-4 mt-4">
                            <thead>
                                <tr className="bg-gray-200">
                                    {/* <th className="border px-4 py-2 font-bold">Punto de calibración</th> */}
                                    <th className="border px-4 py-2 font-semibold">Valor</th>
                                    <th className="border px-4 py-2 font-semibold">Respuesta</th>
                                    <th className="border px-4 py-2 font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.calibrationPoints.map((param, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">{param.value}</td>
                                        <td className="border px-4 py-2">{param.normalResponse}</td>
                                        <td className="border px-4 py-2">
                                            <button
                                                onClick={() => handleDeletePoint(index)}
                                                className="text-red-500 hover:text-red-700 px-2 py-2 rounded"
                                            >
                                                <Trash size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>


                        </table>
                    </div>
                </>
            )}

            <div className="flex justify-end mt-4 space-x-2">
                {step > 1 && (
                    <button
                        // type="button"
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


            {showAlertError && <ErrorAlert message={messageAlert} />}
        </form>
    );
};

export default FormActuador;
