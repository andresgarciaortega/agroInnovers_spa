import React, { useEffect, useState } from 'react';
import { IoCloudUploadOutline } from "react-icons/io5";
import EspacioService from "../../../services/espacios";
import TypeDocumentsService from '../../../services/fetchTypes';
import GenericModal from '../../../components/genericModal';
import SystemMonitory from "../../../services/monitoreo";
// import FormCompany from './FormCompany/formCompany';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { FaChevronDown, FaChevronUp, FaTrash, FaEdit } from 'react-icons/fa';
import { Package2, Factory, Variable, Activity, Cpu, Users } from 'lucide-react';
import { Trash, Edit } from 'lucide-react';
import FormMedicion from './meidicionControl';


const ViewEspacio = ({ }) => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [expandedSpaces, setExpandedSpaces] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("edit");
    const [newCompany, setNewCompany] = useState({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState("");
    const [companyList, setCompanyList] = useState([]);
    const [monitoringSystems, setmonitoringSystems] = useState([]);
    const [typeDocuments, setTypeDocuments] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        gpsPosition: '',
        climateConditions: '',
        dimensionUnit: '',
        shape: '',
        length: '',
        width: '',
        depth: '',
        area: '',
        volume: '',
        specificFeatures: '',
        monitoringSystemId: null,
        subProductionSpaces: [],
        variables: [],
        configureMeasurementControls: [],
    });
    const [newControl, setNewControl] = useState({
        measurementType: '',
        sensorId: '',
        actuatorId: '',
        samplingTimeUnit: '',
        samplingFrequency: '',
        numberOfSamples: '',
        controlType: '',
        actuationTimeUnit: '',
        activationParameterRange: '',
        activationFrequency: '',
        alertMessage: '',
    });
    const [isEditable, setIsEditable] = useState(false);

    useEffect(() => {
        fetchSpace();
        feychMonitoring();
    }, []);

    const fetchSpace = async () => {
        try {
            const data = await EspacioService.getEspacioById(id);

            setFormData(
                {
                    ...data,
                    configureMeasurementControls: Array.isArray(data.configureMeasurementControls)
                        ? data.configureMeasurementControls
                        : [],
                }
            );

            console.log('Espacio cargado:', data);
        } catch (error) {
            console.error('Error al cargar el espacio:', error);
        }
    };

    const feychMonitoring = async () => {
        console.log('id', id)
        try {
            const data = await SystemMonitory.getAllMonitories();
            setmonitoringSystems(data);

            // setNewCompany(data)
            console.log('datos', data)
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    useEffect(() => {
        if (formData.configureMeasurementControls.length > 0) {
            const variables = formData.configureMeasurementControls.map(
                (control) => control.variable_production || null
            );

            setFormData((prevState) => ({
                ...prevState,
                variables,
            }));
        }
    }, [formData.configureMeasurementControls]);
    const showSuccessAlertSuccess = (message) => {
        setShowSuccessAlert(true)
        setMessageAlert(`Empresa ${message} exitosamente`);

        setTimeout(() => {
            setShowSuccessAlert(false)
        }, 2500);
    }

    const updateCompanies = async () => {
        try {
            const data = await CompanyService.getCompanyById(id);
            setFormData(data);
            setNewCompany(data)
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    const handleGoBack = () => {
        navigate("../espacio");
    };
    const toggleExpand = (id) => {
        setExpandedSpaces((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };
    const openMap = (gpsPosition) => {
        const [latitude, longitude] = gpsPosition.split(',').map(Number);
        setSelectedPosition({ latitude, longitude });
    };

    const handleInputChange = (index, field, value) => {
        const newSubSpaces = [...formData.subProductionSpaces];
        newSubSpaces[index][field] = value;
        setFormData({ ...formData, subProductionSpaces: newSubSpaces });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Datos de configureMeasurementControls:', formData.subProductionSpaces.map(subSpace => subSpace.configureMeasurementControls));

        const data = {
            id: formData.id,
            name: formData.name,
            gpsPosition: formData.gpsPosition,
            climateConditions: formData.climateConditions,
            dimensionUnit: formData.dimensionUnit,
            shape: formData.shape,
            length: typeof formData.length === 'number' && formData.length >= 0 ? formData.length : undefined,
            width: typeof formData.width === 'number' && formData.width >= 0 ? formData.width : undefined,
            depth: typeof formData.depth === 'number' && formData.depth >= 0 ? formData.depth : undefined,
            area: typeof formData.area === 'number' && formData.area >= 0 ? formData.area : undefined,
            volume: typeof formData.volume === 'number' && formData.volume >= 0 ? formData.volume : undefined,
            specificFeatures: formData.specificFeatures,
            subProductionSpaces: formData.subProductionSpaces.map(subSpace => ({
                ...subSpace,
                width: typeof subSpace.width === 'number' && subSpace.width >= 0 ? subSpace.width : undefined,
                depth: typeof subSpace.depth === 'number' && subSpace.depth >= 0 ? subSpace.depth : undefined,
                area: typeof subSpace.area === 'number' && subSpace.area >= 0 ? subSpace.area : undefined,
                volume: typeof subSpace.volume === 'number' && subSpace.volume >= 0 ? subSpace.volume : undefined,
                monitoringSystemId: subSpace.monitoringSystemId ? parseInt(subSpace.monitoringSystemId.id, 10) : null,
                species: Array.isArray(subSpace.species) ? subSpace.species : [],
                assignDevices: Array.isArray(subSpace.assignDevices) ? subSpace.assignDevices : [],
                configureMeasurementControls: Array.isArray(subSpace.configureMeasurementControls)
                    ? subSpace.configureMeasurementControls.map(control => ({
                        measurementType: control.measurementType || '',
                        sensorId: control.sensor ? control.sensor.id : null,
                        actuatorId: control.actuator ? control.actuator.id : null,
                        samplingTimeUnit: control.samplingTimeUnit || '',
                        samplingFrequency: control.samplingFrequency || null,
                        numberOfSamples: control.numberOfSamples || null,
                        controlType: control.controlType || '',
                        actuationTimeUnit: control.actuationTimeUnit || '',
                        activationParameterRange: control.activationParameterRange || '',
                        activationFrequency: control.activationFrequency || null,
                        alertMessage: control.alertMessage || '',
                        productionParameterId: control.parameter_production ? control.id : control.parameter_production || null,
                    }))
                    : [],
            })),
            monitoringSystemId: formData.monitoringSystemId ? parseInt(formData.monitoringSystemId.id, 10) : null,
        };

        try {
            const response = await EspacioService.updateEspacio(formData.id, data);
            console.log('Espacio actualizado con éxito', response);
            navigate('../espacio');
        } catch (error) {
            console.error('Error al actualizar el espacio:', error);
            if (error.response) {
                console.log('Respuesta del servidor:', error.response.data);
            }
        }
    };




    const handleDeleteSubSpace = (index) => {
        const updatedSubSpaces = formData.subProductionSpaces.filter((_, i) => i !== index);
        setFormData({ ...formData, subProductionSpaces: updatedSubSpaces });
    };
    const handleOpenModal = (control, mode) => {
        console.log("control antes de editar : ", control)
        setNewControl({
            measurementType: control.measurementType,
            sensorId: control.sensor?.id || '',
            actuatorId: control.actuator?.id || '',
            samplingTimeUnit: control.samplingTimeUnit,
            samplingFrequency: control.samplingFrequency,
            numberOfSamples: control.numberOfSamples,
            controlType: control.controlType,
            actuationTimeUnit: control.actuationTimeUnit,
            activationParameterRange: control.activationParameterRange,
            alertMessage: control.alertMessage,
            // Puedes agregar más campos si es necesario
            id: control.id,
            activationFrequency: control.activationFrequency
        });
        setModalMode(mode);
        setIsModalOpen(true);
    };



    const closeModal = async (e) => {
        e?.preventDefault()
        setIsModalOpen(false);
        setSelectedLote(null);
        setModalMode('create');
        updateService();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex">
                <div className="flex-1 p-6">
                    <div className="max-w-7xl mx-auto">
                        <button
                            type='button'
                            className="btn-volver  bottom-5 right-5  text-gray-300  hover:text-gray-500"
                            onClick={handleGoBack}
                            title="Volver"
                        >
                            <IoArrowBack size={24} />
                        </button>
                        <div className="flex justify-between items-center mb-8">

                            <h1 className="text-2xl font-bold">{formData.name} </h1>
                            <button
    type="button"
    className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg"
    onClick={(e) => {
        if (isEditable) {
            handleSubmit(e); // Ahora pasamos `e` correctamente
        } else {
            setIsEditable(true);
        }
    }}
>
    {isEditable ? 'Guardar Cambios' : 'Editar Espacio'}
</button>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-muted-foreground">Nombre Espacio</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        disabled={!isEditable} />
                                </div>

                                <div>
                                    <label className="text-sm text-muted-foreground">Posición GPS</label>
                                    <input
                                        type="text"
                                        value={formData.gpsPosition}

                                        onChange={(e) => setFormData({ ...formData, gpsPosition: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        disabled={!isEditable}
                                    />
                                </div>


                                <div>
                                    <label className="text-sm text-muted-foreground">Condiciones de clima</label>
                                    <input
                                        type="text"
                                        value={formData.climateConditions}

                                        onChange={(e) => setFormData({ ...formData, climateConditions: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        disabled={!isEditable}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Unidad de dimensionamiiento</label>
                                    <input
                                        type="text"
                                        onChange={(e) => setFormData({ ...formData, dimensionUnit: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        disabled={!isEditable}
                                        value={formData.dimensionUnit} />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Área (metros²)</label>
                                    <input type="number"
                                        value={formData.area}
                                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        disabled={!isEditable} />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-muted-foreground">Forma</label>
                                    <input
                                        type="text"
                                        value={formData.shape}
                                        onChange={(e) => setFormData({ ...formData, shape: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        disabled={!isEditable} />
                                </div>

                                <div>
                                    <label className="text-sm text-muted-foreground">Largo</label>
                                    <input
                                        type="number"
                                        value={formData.length}
                                        onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        disabled={!isEditable} />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Ancho</label>
                                    <input
                                        type="number"

                                        value={formData.width}
                                        onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        disabled={!isEditable} />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Produndo</label>
                                    <input
                                        type="number"
                                        value={formData.depth}
                                        onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        disabled={!isEditable} />

                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground" >Volumen (metros³)</label>
                                    <input
                                        type="number"
                                        value={formData.volume}
                                        onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        disabled={!isEditable} />
                                </div>
                            </div>

                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-1 mt-4">
                            <label className="text-sm text-muted-foreground">Sistema de monitoreo y control</label>
                            <select
                                className="w-full p-2 border rounded"
                                value={formData.monitoringSystemId?.id || ''}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    monitoringSystemId: {
                                        ...formData.monitoringSystemId,
                                        id: e.target.value
                                    }
                                })}
                                disabled={!isEditable}
                            >
                                <option value="" disabled>Selecciona un sistema de monitoreo</option>
                                {monitoringSystems.map(system => (
                                    <option key={system.id} value={system.id}>
                                        {system.nombreId}
                                    </option>
                                ))}
                            </select>
                        </div>


                        <div className="grid grid-cols-1 md:grid-coFls-1 gap- mb-8 mt-4">
                            <label className="text-sm text-muted-foreground">Características especifícas</label>
                            <textarea
                                type="text"
                                className="w-full p-2 border rounded"
                                value={formData.specificFeatures}

                                onChange={(e) => setFormData({ ...formData, specificFeatures: e.target.value })}

                                disabled={!isEditable}
                            />
                        </div>
                        <div >


                            <div className="space-y-4  mb-9">

                                <div className="grid grid-cols-2 gap-4 border border-gray-200">
                                    {Array.isArray(formData.configureMeasurementControls) && formData.configureMeasurementControls.length > 0 ? (
                                        formData.configureMeasurementControls.map((control, index) => (
                                            <div
                                                key={index}
                                                className="bg-white shadow-md rounded-lg flex items-center gap-4"
                                                style={{ height: "169px" }}
                                            >

                                                <div className="w-60">
                                                    <img
                                                        src={control.variable_production.icon}
                                                        alt={control.variable_production.name}
                                                        className="rounded-lg object-contain h-full"
                                                    />
                                                </div>


                                                <div>
                                                    <p className="text-lg font-semibold">{control.variable_production.name}</p>
                                                    <p className="text-sm text-gray-600">
                                                        Medición: {control.measurementType}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Sensor: {control.sensor?.sensorCode}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Control: {control.controlType}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Actuador: {control.actuator?.actuatorCode}
                                                    </p>

                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 col-span-2">No hay controles de medición configurados.</p>
                                    )}
                                </div>
                            </div>
                        </div>



                        <div className="md:grid-cols-3 gap-6 ">
                            <div className="grid grid-cols-1 md:grid-cols-7 gap-[14px]  mb-8 ">
                                <div className={`col-span-${isEditable ? '7' : '7'} flex items-start gap-[14px]   rounded-lg`} >
                                    {formData.subProductionSpaces.map((subSpace, index) => (
                                        <div
                                            key={subSpace.id}
                                            className="p-4 rounded-md shadow-lg w-full bg-white border border-gray-300"
                                        >
                                            <div
                                                className="flex items-center justify-between cursor-pointer"
                                                onClick={() => toggleExpand(subSpace.id)}
                                            >
                                                <h2 className="text-lg font-bold">{subSpace.name}</h2>
                                                <span className="text-xl text-gray-500">
                                                    {expandedSpaces[subSpace.id] ? (
                                                        <FaChevronDown />
                                                    ) : (
                                                        <FaChevronUp />
                                                    )}
                                                </span>
                                            </div>

                                            {expandedSpaces[subSpace.id] ? (
                                                <div className="space-y mt-2 mb-3 m-2">
                                                    <p>
                                                        <strong className='text-gray-800 font-semibold '>Área:</strong> {subSpace.area}{' '}
                                                        {subSpace.dimensionUnit}²
                                                    </p>
                                                    <p>

                                                        <button
                                                            className="text-blue-600 underline"
                                                            onClick={() => window.open(
                                                                `https://www.google.com/maps?q=${selectedPosition.latitude},${selectedPosition.longitude}&z=15`,
                                                                "_blank"
                                                            )}
                                                        >
                                                            Ver Posición
                                                        </button>

                                                    </p>
                                                    <div>
                                                        <label className="block text-sm font-medium mt-5">Nombre subespacio</label>
                                                        <input
                                                            type="text"
                                                            value={subSpace.name}
                                                            onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                                            className="border rounded-md w-full p-2"
                                                            disabled={!isEditable}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium">Posición GPS</label>
                                                            <input
                                                                type="text"
                                                                value={subSpace.gpsPosition}
                                                                onChange={(e) => handleInputChange(index, 'gpsPosition', e.target.value)}
                                                                className="border rounded-md w-full p-2"
                                                                disabled={!isEditable}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium">Unidad de dimensionamiento</label>
                                                            <input
                                                                type="text"
                                                                value={subSpace.dimensionUnit}
                                                                onChange={(e) => handleInputChange(index, 'dimensionUnit', e.target.value)}
                                                                className="border rounded-md w-full p-2"
                                                                disabled={!isEditable}
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium">Forma</label>
                                                            <input
                                                                type="text"
                                                                value={subSpace.shape}
                                                                onChange={(e) => handleInputChange(index, 'shape', e.target.value)}
                                                                className="border rounded-md w-full p-2"
                                                                disabled={!isEditable}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium">Largo</label>
                                                            <input
                                                                type="text"
                                                                value={subSpace.length}
                                                                onChange={(e) => handleInputChange(index, 'length', e.target.value)}
                                                                className="border rounded-md w-full p-2"
                                                                disabled={!isEditable}
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium">Ancho</label>
                                                            <input
                                                                type="text"
                                                                value={subSpace.width}
                                                                onChange={(e) => handleInputChange(index, 'width', e.target.value)}
                                                                className="border rounded-md w-full p-2"
                                                                disabled={!isEditable}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium">Profundidad</label>
                                                            <input
                                                                type="text"
                                                                value={subSpace.depth}
                                                                onChange={(e) => handleInputChange(index, 'depth', e.target.value)}
                                                                className="border rounded-md w-full p-2"
                                                                disabled={!isEditable}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium">Área {subSpace.dimensionUnit}²</label>
                                                            <input
                                                                type="number"
                                                                value={subSpace.area}
                                                                onChange={(e) => handleInputChange(index, 'area', e.target.value)}
                                                                className="border rounded-md w-full p-2"
                                                                disabled={!isEditable}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium">Volumen{subSpace.dimensionUnit}³</label>
                                                            <input
                                                                type="number"
                                                                value={subSpace.volume}
                                                                onChange={(e) => handleInputChange(index, 'volume', e.target.value)}
                                                                className="border rounded-md w-full p-2"
                                                                disabled={!isEditable}
                                                            />
                                                        </div>
                                                    </div>
                                                    {Array.isArray(subSpace.configureMeasurementControls) && subSpace.configureMeasurementControls.length > 0 ? (
                                                        <div className="space-y-4 mb-9 mt-5 ">
                                                            <div className="grid grid-cols- gap-4 border border-gray-200">
                                                                {subSpace.configureMeasurementControls.map((control, controlIndex) => (
                                                                    <div
                                                                        key={controlIndex}
                                                                        className="bg-slate-50 shadow-md flex items-center gap-4 border-gray-200  relative"

                                                                        style={{ height: "169px" }}
                                                                    >
                                                                        <div className="w-60">
                                                                            <img
                                                                                src={control.variable_production.icon}
                                                                                alt={control.variable_production.name}
                                                                                className="rounded-lg object-contain h-full"
                                                                            />
                                                                        </div>

                                                                        <div>
                                                                            <p className="text-lg font-semibold">{control.variable_production.name}</p>
                                                                            <p className="text-sm text-gray-600">Medición: {control.measurementType}</p>
                                                                            <p className="text-sm text-gray-600">Sensor: {control.sensor?.sensorCode}</p>
                                                                            <p className="text-sm text-gray-600">Control: {control.controlType}</p>
                                                                            <p className="text-sm text-gray-600">Actuador: {control.actuator.actuatorCode}</p>
                                                                        </div>
                                                                        {/* <div className="absolute top-2 right-2 flex gap-2">
                                                                                <Edit size={18}
                                                                                    className=" text-[#168C0DFF] cursor-pointer "
                                                                                    onClick={() => handleOpenModal(control, 'edit')}
                                                                                />
                                                                                <Trash size={18}
                                                                                    className="text-[#168C0DFF] cursor-pointer"
                                                                                    onClick={() => handleDeleteClick(index)}
                                                                                />
                                                                            </div> */}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-center text-gray-500 col-span-2">No hay controles de medición configurados.</p>
                                                    )}
                                                </div>

                                            ) : (
                                                <>
                                                    <p>
                                                        <strong className='text-gray-800 font-semibold'>Área:</strong> {subSpace.area}{' '}
                                                        {subSpace.dimensionUnit}²
                                                    </p>
                                                    <p>

                                                        <button
                                                            className="text-blue-600 underline"
                                                            onClick={() => window.open(
                                                                `https://www.google.com/maps?q=${selectedPosition.latitude},${selectedPosition.longitude}&z=15`,
                                                                "_blank"
                                                            )}
                                                        >
                                                            Ver Posición
                                                        </button>

                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    ))}

                                    {/* {selectedPosition && window.open(
    `https://www.google.com/maps?q=${selectedPosition.latitude},${selectedPosition.longitude}&z=15`,
    "_blank"
)} */}



                                </div>

                                {/* Botones de editar y eliminar */}
                                {isEditable && (
                                    <div className="col-span-1 mt-2  flex justify- items-start">
                                        <button
                                            onClick={() => handleDeleteSubSpace(index)}
                                            className="text-red-500"
                                        >
                                            <FaTrash /> {/* Icono de eliminar */}
                                        </button>

                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
            {isModalOpen && (
                <GenericModal
                    title={
                        modalMode === 'edit'
                            ? 'Editar Medición y Control'
                            : modalMode === 'view'
                                ? 'Ver Medición y Control'
                                : 'Añadir Medición y Control'
                    }
                    onClose={closeModal}
                >
                    <FormMedicion
                        // selectedVariableId={selectedVariableId}
                        onClose={() => setIsModalOpen(false)}
                        control={newControl}
                        mode={modalMode}
                    />
                </GenericModal>
            )}
        </form>

    );

};

export default ViewEspacio;
