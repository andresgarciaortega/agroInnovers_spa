import React, { useEffect, useState } from 'react';
import { IoCloudUploadOutline } from "react-icons/io5";
import EspacioService from "../../../services/espacios";
import SensorService from '../../../services/SensorService';
import ActuadorService from '../../../services/ActuadorService';
import GenericModal from '../../../components/genericModal';
import SystemMonitory from "../../../services/monitoreo";
// import FormCompany from './FormCompany/formCompany';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { FaChevronDown, FaChevronUp, FaTrash, FaEdit } from 'react-icons/fa';
import { Package2, Factory, Variable, Activity, Cpu, Users } from 'lucide-react';


const EditarEspacio = ({ }) => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [expandedSpaces, setExpandedSpaces] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("edit");
    const [newCompany, setNewCompany] = useState({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState("");
    const [companyList, setCompanyList] = useState([]);
    const [sensors, setSensor] = useState([]);
    const [actuators, setActuador] = useState([]);
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
    const [isEditable, setIsEditable] = useState(false);
const [expandedControls, setExpandedControls] = useState({});
    useEffect(() => {
        fetchSpace();
        feychMonitoring();
        feychActuador();
        feychSensor();
    }, []);

    const fetchSpace = async () => {
        try {
            const data = await EspacioService.getEspacioById(id);

            // Actualizar el estado completo, incluyendo configureMeasurementControls
            setFormData({
                ...data,
                configureMeasurementControls: Array.isArray(data.configureMeasurementControls)
                    ? data.configureMeasurementControls
                    : [],
            });

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
    const feychSensor = async () => {
        console.log('id', id)
        try {
            const data = await SensorService.getAllSensor();
            setSensor(data);

            // setNewCompany(data)
            console.log('datos', data)
        } catch (error) {
            console.error('Error fetching sensor:', error);
        }
    };
    const feychActuador = async () => {
        console.log('id', id)
        try {
            const data = await ActuadorService.getAllActuador();
            setActuador(data);

            // setNewCompany(data)
            console.log('datos', data)
        } catch (error) {
            console.error('Error fetching actuadores:', error);
        }
    };

    useEffect(() => {
        if (formData.configureMeasurementControls.length > 0) {
            const variables = formData.configureMeasurementControls.map(
                (control) => control.parameter_production?.variable || null
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

    // Función para actualizar la lista de empresas
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
    const toggleExpandVariable = (controlId) => {
        setExpandedControls((prev) => ({
            ...prev,
            [controlId]: !prev[controlId],
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
    const handleInputChangeVariable = (index, field, value) => {
        // Clonamos el estado para no mutar directamente
        const updatedControls = [...formData.configureMeasurementControls];
      
        // Actualizamos el campo específico en el índice adecuado
        updatedControls[index] = {
          ...updatedControls[index],
          [field]: value,
        };
      
        // Si el campo es un 'sensorCode' o 'actuatorCode', se actualiza el sensor o actuador completo en el objeto
        if (field === 'sensorCode') {
          const selectedSensor = sensors.find((sensor) => sensor.sensorCode === value);
          updatedControls[index].sensor = selectedSensor || null; // Asigna el objeto completo del sensor
        }
      
        if (field === 'actuatorCode') {
          const selectedActuator = actuators.find((actuator) => actuator.actuatorCode === value);
          updatedControls[index].actuator = selectedActuator || null; // Asigna el objeto completo del actuador
        }
      
        // Actualizamos el estado de los controles
        setFormData({
          ...formData,
          configureMeasurementControls: updatedControls,
        });
      };
      
    
   const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
        id: formData.id,
        name: formData.name,
        gpsPosition: formData.gpsPosition,
        climateConditions: formData.climateConditions,
        dimensionUnit: formData.dimensionUnit,
        shape: formData.shape,
        length: Math.max(formData.length || 0, 0),
        width: Math.max(formData.width || 0, 0),
        depth: Math.max(formData.depth || 0, 0),
        area: Math.max(formData.area || 0, 0),
        volume: Math.max(formData.volume || 0, 0),
        specificFeatures: formData.specificFeatures,
        subProductionSpaces: formData.subProductionSpaces.map(subSpace => ({
            ...subSpace,
            width: Math.max(subSpace.width || 0, 0),
            depth: Math.max(subSpace.depth || 0, 0),
            monitoringSystemId: subSpace.monitoringSystemId ? parseInt(subSpace.monitoringSystemId.id, 10) : null,
            species: Array.isArray(subSpace.species) ? subSpace.species : [],
            assignDevices: Array.isArray(subSpace.assignDevices) ? subSpace.assignDevices : [],
            configureMeasurementControls: Array.isArray(subSpace.configureMeasurementControls)
                ? subSpace.configureMeasurementControls.map(control => ({
                    ...control,
                    sensorId: parseInt(control.sensorId, 10),
                    actuatorId: parseInt(control.actuatorId, 10),
                    productionParameterId: parseInt(control.productionParameterId, 10),
                }))
                : [],
        })),
        monitoringSystemId: formData.monitoringSystemId ? parseInt(formData.monitoringSystemId.id, 10) : null,
    };
    

    try {
        const response = await EspacioService.updateEspacio(formData.id, data);
        console.log('Espacio actualizado con éxito', response);

        navigate('../espacio'); // Cambia '/espacios' por la ruta real de tu vista de espacios
    } catch (error) {
        console.error('Error al actualizar el espacio:', error);
    }
};

    
    
    
    

    const handleDeleteSubSpace = (index) => {
        const updatedSubSpaces = formData.subProductionSpaces.filter((_, i) => i !== index);
        setFormData({ ...formData, subProductionSpaces: updatedSubSpaces });
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
                            type='submit'
                                className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg"

                            >
                                Editar espacio
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
                                        disabled={false} />
                                </div>

                                <div>
                                    <label className="text-sm text-muted-foreground">Posición GPS</label>
                                    <input
                                        type="text"
                                        value={formData.gpsPosition}

                                        onChange={(e) => setFormData({ ...formData, gpsPosition: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        disabled={false}
                                    />
                                </div>


                                <div>
                                    <label className="text-sm text-muted-foreground">Condiciones de clima</label>
                                    <input
                                        type="text"
                                        value={formData.climateConditions}

                                        onChange={(e) => setFormData({ ...formData, climateConditions: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        disabled={false}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Unidad de dimensionamiiento</label>
                                    <input
                                        type="text"
                                        onChange={(e) => setFormData({ ...formData, dimensionUnit: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        disabled={false}
                                        value={formData.dimensionUnit} />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Área (metros²)</label>
                                    <input type="number"
                                        value={formData.area}
                                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        disabled={false} />
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
                                        disabled={false} />
                                </div>

                                <div>
                                    <label className="text-sm text-muted-foreground">Largo</label>
                                    <input
                                        type="number"
                                        value={formData.length}
                                        onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        disabled={false} />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Ancho</label>
                                    <input
                                        type="number"

                                        value={formData.width}
                                        onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        disabled={false} />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Produndo</label>
                                    <input
                                        type="number"
                                        value={formData.depth}
                                        onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        disabled={false} />

                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground" >Volumen (metros³)</label>
                                    <input
                                        type="number"
                                        value={formData.volume}
                                        onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        disabled={false} />
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
                                disabled={false}
                            >
                                <option value="" disabled>Selecciona un sistema de monitoreo</option>
                                {monitoringSystems.map(system => (
                                    <option key={system.id} value={system.id}>
                                        {system.nombreId} {/* Asegúrate de que 'nombreId' sea el nombre del sistema que quieres mostrar */}
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

                                disabled={false}
                            />
                        </div>
                        <div >


<div className="space-y-4 mb-9">
    <div className="grid grid-cols-2 gap-4 border border-gray-200">
        {Array.isArray(formData.configureMeasurementControls) && formData.configureMeasurementControls.length > 0 ? (
            formData.configureMeasurementControls.map((control, index) => {
                const isExpanded = expandedControls[control.id];

                return (
                    <div
    key={index}
    className={`bg-white shadow-md rounded-lg flex items-center gap-4 transition-all duration-700 ${isExpanded ? 'max-h-[1000px]' : 'max-h-40'}`}
>

                        <div className="w-60">
                            <img
                                src={control.parameter_production.variable.icon}
                                alt={control.parameter_production.variable.name}
                                className="rounded-lg object-contain h-full"
                            />
                        </div>

                        <div className="flex flex-col flex-grow relative">
                            {/* Botón de Expandir/Colapsar en la esquina superior derecha */}
                            <div
                                className="absolute top-0 right-0 p-2 cursor-pointer text-blue-600"
                                onClick={() => toggleExpandVariable(control.id)}
                            >
                                <span className="text-xl text-gray-500"></span>
                                {isExpanded ? (
                                  <FaChevronDown className="text-xl text-gray-500" />
                                ) : (
                                    <FaChevronUp className="text-xl text-gray-500"/>
                                )}
                            </div>

                            <p className=" font-semibold m-3">
                                {isExpanded ? control.parameter_production.variable.name : ''}
                            </p>

                            {!isExpanded && (
                                <>
                                    
                                    <p className="text-sm text-gray-900 font-semibold"> {control.parameter_production.variable.name }</p>
                                    <p className="text-sm text-gray-600">Medición: {control.measurementType}</p>
                                    <p className="text-sm text-gray-600">Sensor: {control.sensor?.sensorCode}</p>
                                    <p className="text-sm text-gray-600">Control: {control.controlType}</p>
                                    <p className="text-sm text-gray-600">Actuador: {control.actuator?.actuatorCode}</p>
                                </>
                            )}

{isExpanded && (
  <div className="space-y-2 m-4">
     <div>
      <label className="block text-sm font-medium">Medición</label>
      <p className="border rounded-md w-full p-2 bg-gray-100">{control.measurementType || 'N/A'}</p>
    </div>

    <div>
      <label className="block text-sm font-medium">Sensor</label>
      <select
  value={control.sensor?.sensorCode || ''}
  onChange={(e) => handleInputChangeVariable(index, 'sensorCode', e.target.value)}
  className="border rounded-md w-full p-2"
>
  <option value="">Seleccione un Sensor</option>
  {sensors.map((sensor) => (
    <option key={sensor.id} value={sensor.sensorCode}>
      {sensor.sensorCode}
    </option>
  ))}
</select>
    </div>

    <div>
      <label className="block text-sm font-medium">Control</label>
      <p className="border rounded-md w-full p-2 bg-gray-100">{control.controlType || 'N/A'}</p>
    </div>

    <div>
      <label className="block text-sm font-medium">Actuador</label>
      <select
  value={control.actuator?.actuatorCode || ''}
  onChange={(e) => handleInputChangeVariable(index, 'actuatorCode', e.target.value)}
  className="border rounded-md w-full p-2"
>
  <option value="">Seleccione un Actuador</option>
  {actuators.map((actuator) => (
    <option key={actuator.id} value={actuator.actuatorCode}>
      {actuator.actuatorCode}
    </option>
  ))}
</select>
    </div>
  </div>
)}


                        </div>
                    </div>
                );
            })
        ) : (
            <p className="text-center text-gray-500 col-span-2">No hay controles de medición configurados.</p>
        )}
    </div>
</div>


                        </div>



                        <div className="md:grid-cols-3 gap-6 ">
                            <div className="grid grid-cols-1 md:grid-cols-7 gap-8 mb-8 ">
                                <div className={`col-span-7 flex items-start bg-white border border-gray-300 rounded-lg`} >
                                    {formData.subProductionSpaces.map((subSpace, index) => (
                                        <div
                                            key={subSpace.id}
                                            className="border p-4 rounded-md shadow-lg w-full transition-all duration-100 "
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
                                                            onClick={() => openMap(subSpace.gpsPosition)}
                                                            className="text-blue-600 underline"
                                                        >
                                                            Ver posición
                                                        </button>
                                                    </p>
                                                    <div>
                                                        <label className="block text-sm font-medium mt-5">Nombre subespacio</label>
                                                        <input
                                                            type="text"
                                                            value={subSpace.name}
                                                            onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                                            className="border rounded-md w-full p-2"
                                                            disabled={false}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                        <div>
                                                            <label className="block text-sm font-medium">Posición GPS</label>
                                                            <input
                                                                type="text"
                                                                value={subSpace.gpsPosition}
                                                                onChange={(e) => handleInputChange(index, 'gpsPosition', e.target.value)}
                                                                className="border rounded-md w-full p-2"
                                                                disabled={false}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium">Unidad de dimensionamiento</label>
                                                            <input
                                                                type="text"
                                                                value={subSpace.dimensionUnit}
                                                                onChange={(e) => handleInputChange(index, 'dimensionUnit', e.target.value)}
                                                                className="border rounded-md w-full p-2"
                                                                disabled={false}
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium">Forma</label>
                                                            <input
                                                                type="text"
                                                                value={subSpace.shape}
                                                                onChange={(e) => handleInputChange(index, 'shape', e.target.value)}
                                                                className="border rounded-md w-full p-2"
                                                                disabled={false}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium">Largo</label>
                                                            <input
                                                                type="text"
                                                                value={subSpace.length}
                                                                onChange={(e) => handleInputChange(index, 'length', e.target.value)}
                                                                className="border rounded-md w-full p-2"
                                                                disabled={false}
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium">Ancho</label>
                                                            <input
                                                                type="text"
                                                                value={subSpace.width}
                                                                onChange={(e) => handleInputChange(index, 'width', e.target.value)}
                                                                className="border rounded-md w-full p-2"
                                                                disabled={false}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium">Profundidad</label>
                                                            <input
                                                                type="text"
                                                                value={subSpace.depth}
                                                                onChange={(e) => handleInputChange(index, 'depth', e.target.value)}
                                                                className="border rounded-md w-full p-2"
                                                                disabled={false}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium">Área {subSpace.dimensionUnit}²</label>
                                                            <input
                                                                type="number"
                                                                value={subSpace.area}
                                                                onChange={(e) => handleInputChange(index, 'area', e.target.value)}
                                                                className="border rounded-md w-full p-2"
                                                                disabled={false}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium">Volumen{subSpace.dimensionUnit}³</label>
                                                            <input
                                                                type="number"
                                                                value={subSpace.volume}
                                                                onChange={(e) => handleInputChange(index, 'volume', e.target.value)}
                                                                className="border rounded-md w-full p-2"
                                                                disabled={false}
                                                            />
                                                        </div>
                                                    </div>
                                                    {Array.isArray(subSpace.configureMeasurementControls) && subSpace.configureMeasurementControls.length > 0 ? (
                                                        <div className="space-y-4 mb-9 mt-5 ">
                                                            <div className="grid grid-cols-2 gap-4 border  rounded-lg">
                                                                {subSpace.configureMeasurementControls.map((control, controlIndex) => (
                                                                    <div
                                                                        key={controlIndex}
                                                                        className="bg-slate-50 shadow-md flex items-center gap-4 border-gray-200 rounded-lg"
                                                                        style={{ height: "169px" }}
                                                                    >
                                                                        <div className="w-60 ">
                                                                            <img
                                                                                src={control.parameter_production.variable.icon}
                                                                                alt={control.parameter_production.variable.name}
                                                                                className="rounded-lg object-contain h-full"
                                                                            />
                                                                        </div>

                                                                        <div>
                                                                            <p className="text-lg font-semibold">{control.parameter_production.variable.name}</p>
                                                                            <p className="text-sm text-gray-600">Medición: {control.measurementType}</p>
                                                                            <p className="text-sm text-gray-600">Sensor: {control.sensorId?.sensorCode}</p>
                                                                            <p className="text-sm text-gray-600">Control: {control.controlType}</p>
                                                                            <p className="text-sm text-gray-600">Actuador: {control.actuatorId}</p>
                                                                        </div>
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
                                                            onClick={() => openMap(subSpace.gpsPosition)}
                                                            className="text-blue-600 underline"
                                                        >
                                                            Ver posición
                                                        </button>
                                                    </p>
                                                </>
                                            )}
                                            <div className="col-span-1 mt-2  flex justify- items-start">
                                        <button
                                        type='button'
                                            onClick={() => handleDeleteSubSpace(index)}
                                            className="text-red-500"
                                        >
                                            <FaTrash /> {/* Icono de eliminar */}
                                        </button>

                                    </div>
                                        </div>
                                        
                                    ))}
                                     

                                    {selectedPosition && (
                                        <div className="justify-start col-span-1">
                                            {/* Botón para cerrar el mapa */}
                                            <button
                                                onClick={() => setSelectedPosition(null)}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg hover:bg-red-600"
                                                title="Cerrar mapa"
                                            >
                                                &times;
                                            </button>
                                            <iframe
                                                src={`https://www.google.com/maps?q=${selectedPosition.latitude},${selectedPosition.longitude}&z=15&output=embed`}
                                                width="100%"
                                                height="300"
                                                style={{ border: 0 }}
                                                allowFullScreen=""
                                                loading="lazy"
                                                title="Mapa"
                                            ></iframe>
                                        </div>
                                        
                                    )}
                                </div>

                                {/* Botones de editar y eliminar */}
                                
                                   
                                
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </form>
    );

};

export default EditarEspacio;
