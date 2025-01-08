import React, { useState, useEffect } from 'react';

import { FaCheckCircle } from 'react-icons/fa';
import MonitoreoService from '../../../services/monitoreo';
import TipoEspacioService from '../../../services/tipoEspacio';
import EspacioService from '../../../services/espacios';
import SensorService from '../../../services/SensorService';
import Actuadorervice from '../../../services/ActuadorService';
import GenericModal from '../../../components/genericModal';
import FormMedicion from './meidicionControl';

import SpeciesService from '../../../services/SpeciesService';
import { MenuItem, FormControl, Select, InputLabel, Checkbox, ListItemText } from '@mui/material';
import { FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import { FiPlusCircle } from "react-icons/fi";

const CrearEspacio = () => {

  const [showSubspaceField, setShowSubspaceField] = useState(false);
  const [disableSpecies, setDisableSpecies] = useState(false);
  const [subspaces, setSubspaces] = useState([
    { assignDevices: false, inheritDevices: false, deviceType: "", selectedDevice: "" }
  ]);
  const [selectedVariableId, setSelectedVariableId] = useState(null);
  const [modalMode, setModalMode] = useState("create");

  const [expandedSubspace, setExpandedSubspace] = useState(null);
  const [subspaceCount, setSubspaceCount] = useState(1);
  const [isYesSelected, setIsYesSelected] = useState(false);
  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');
  const [devicesList, setDevicesList] = useState([]);
  const [variable, VariableList] = useState([]);
  const [step, setStep] = useState(0);
  const [subespacioCreado, setSubespacioCreado] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState([]);
  const [selectedVariable, setSelectedVariable] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editVariable, setEditVariable] = useState(null); // Variable para editar

  const handleNextStep = () => {
    if (step < 2) setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  const [inheritSensors, setInheritSensors] = useState(false);

  const [deviceType, setDeviceType] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [heredar, setHeredar] = useState(false);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState("");
  const [variables, setVariables] = useState([]);

  const [monitoreo, setMonitoreo] = useState([]);
  const [tipoEspacio, setTipoEspacio] = useState([]);
  const [species, setTipoEspecies] = useState([]);
  const [tipoSensor, setTipoSensor] = useState([]);
  const [tipoActuador, setTipoActuador] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    gpsPosition: '',
    monitoringSystemId: null,
    spaceTypeId: '',
    climateConditions: '',
    dimensionUnit: '',
    shape: '',
    length: '',
    width: '',
    depth: '',
    area: '',
    volume: '',
    specificFeatures: '',
    species: [],
    productionSpaceType: null,
    subProductionSpaces: [
      {
        name: '',
        gpsPosition: '',
        dimensionUnit: '',
        shape: '',
        length: '',
        width: '',
        depth: '',
        area: '',
        volume: '',
        species: [],
        monitoringSystemId: null,
        assignDevices: [
          {
            deviceType: '',
            sensorId: null,
            actuatorId: null
          }
        ],
        configureMeasurementControls: [
          {
            measurementType: '',
            sensorId: null,
            actuatorId: null,
            samplingTimeUnit: '',
            samplingFrequency: '',
            numberOfSamples: '',
            controlType: '',
            actuationTimeUnit: '',
            activationParameterRange: '',
            activationFrequency: '',
            alertMessage: '',
            productionParameterId: null
          }
        ]
      }
    ],
    assignDevices: [
      {
        deviceType: '',
        sensorId: null,
        actuatorId: null
      }
    ],
    configureMeasurementControls: [
      {
        measurementType: '',
        sensorId: null,
        actuatorId: null,
        samplingTimeUnit: '',
        samplingFrequency: '',
        numberOfSamples: '',
        controlType: '',
        actuationTimeUnit: '',
        activationParameterRange: '',
        activationFrequency: '',
        alertMessage: '',
        productionParameterId: null
      }
    ]
  });



  useEffect(() => {
    const fetchMonitoreo = async () => {
      try {
        const data = await MonitoreoService.getAllMonitories();
        setMonitoreo(data);
      } catch (error) {
        console.error('Error fetching monitoreo:', error);
      }
    };
    fetchMonitoreo();
  }, []);

  useEffect(() => {
    const fetchTipoSensor = async () => {
      try {
        const data = await SensorService.getAllSensor();
        setTipoSensor(data);
        console.log('sensores', data)
      } catch (error) {
        console.error('Error fetching tipo sensor:', error);
      }
    };
    fetchTipoSensor();
  }, []);

  useEffect(() => {
    const fetchTipoActuador = async () => {
      try {
        const data = await Actuadorervice.getAllActuador();
        setTipoActuador(data);
        console.log('actuadores', data)

      } catch (error) {
        console.error('Error fetching tio actuador:', error);
      }
    };
    fetchTipoActuador();
  }, []);

  useEffect(() => {
    const fetchEspecies = async () => {
      try {
        const data = await SpeciesService.getAllSpecie();
        setTipoEspecies(data);
        console.log('species', data);
      } catch (error) {
        console.error('Error fetching species:', error);
      }
    };
    fetchEspecies();
  }, []);
  useEffect(() => {
    const fetchVariable = async () => {
      if (!selectedSpeciesId) return;

      try {
        const data = await SpeciesService.getVariableBySpecie(selectedSpeciesId);
        console.log("Datos de variables de la especie:", data);

        if (data.statusCode === 404) {
          setVariables([]);
        } else {
          setVariables(data);
        }
      } catch (error) {
        console.error('Error fetching variables de la especie:', error);
        setVariables([]);
      }
    };

    fetchVariable();
  }, [selectedSpeciesId]); // Ejecutar cuando cambie la especie seleccionada


  useEffect(() => {
    const fetchTipoEspacio = async () => {
      try {
        const data = await TipoEspacioService.getAlltipoEspacio();
        setTipoEspacio(data);
        console.log('tipos', data);
      } catch (error) {
        console.error('Error fetching tipoEspacio:', error);
      }
    };
    fetchTipoEspacio();
  }, []);

  const handleAddSubspaceClick = () => {
    setDisableSpecies(true);
    setFormData({ ...formData, species: [] });
    setSubspaces([
      ...subspaces,
      {
        id: Date.now(),
        name: '',
        gpsPosition: '',
        dimensionUnit: '',
        shape: '',
        length: '',
        width: '',
        depth: '',
        area: '',
        volume: '',
        species: []
      }
    ]);
  };

  const handleOpenModal = (lote = null, mode = 'create') => {
    setSelectedLote(lote);
    setModalMode(mode);
    if (mode === 'edit' || mode === 'view') {
      setNewLote(lote);
    } else {
      setNewLote({
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
    }
    setIsModalOpen(true);
  };

  // Cerrar el modal
  const closeModal = async () => {
    setIsModalOpen(false);
    setSelectedLote(null);
    setModalMode('create');
    updateService();
  };


  // const handleAddSubspaceClick = () => {
  //   const newSubspace = {
  //     id: Date.now(),
  //     species: [...formData.species],
  //     name: '',
  //     gpsPosition: '',
  //     dimensionUnit: '',
  //     shape: '',
  //     length: '',
  //     width: '',
  //     depth: '',
  //     area: '',
  //     volume: '',
  //     specificFeatures: ''
  //   };
  //   setSubspaces([...subspaces, newSubspace]);
  // };


  const handleExpandSubspace = (id) => {
    setExpandedSubspace(expandedSubspace === id ? null : id);
  };

  const handleRemoveSubspace = (id) => {
    const updatedSubspaces = subspaces.filter((sub) => sub.id !== id);
    setSubspaces(updatedSubspaces);
    if (updatedSubspaces.length === 0) {
      setDisableSpecies(false);
    }
  };

  const handleInputChange = (id, field, value) => {
    setSubspaces((prevSubspaces) =>
      prevSubspaces.map((sub) =>
        sub.id === id ? { ...sub, [field]: value } : sub
      )
    );
  };
  const handleYesCheckboxChange = () => {
    setIsYesSelected(true);
    setDisableSpecies(true);
  };

  const handleNoCheckboxChange = () => {
    setIsYesSelected(false);
    setDisableSpecies(false);
  };

  const handleDeviceTypeChange = (index, type) => {
    const newDevicesList = [...devicesList];
    newDevicesList[index].deviceType = type;
    newDevicesList[index].selectedDevice = ""; // Limpiar dispositivo seleccionado
    setDevicesList(newDevicesList);
  };
  const handleDeviceSelectionChange = (index, selectedDevice) => {
    const newDevicesList = [...devicesList];
    newDevicesList[index].selectedDevice = selectedDevice;
    setDevicesList(newDevicesList);
  };


  const handleInheritChange = () => {
    setInheritSensors(!inheritSensors);
  };

  // Obtener dispositivos según el tipo 
  const getDevicesByType = (type) => {
    if (type === "actuador") {
      return tipoActuador.map((device) => ({
        id: device.id,
        code: device.actuatorCode,
      }));
    } else if (type === "sensor") {
      return tipoSensor.map((device) => ({
        id: device.id,
        code: device.sensorCode,
      }));
    }
    return [];
  };

  const handleAddDevice = () => {
    setDevicesList([
      ...devicesList,
      { deviceType: "", selectedDevice: "" }
    ]);


    // setDeviceType('');
    // setSelectedDevice('');
  };
  // const handleSubspaceCheckboxChange = (index, field) => {
  //   setSubspaces((prevSubspaces) =>
  //     prevSubspaces.map((subspace, i) =>
  //       i === index ? { ...subspace, [field]: !subspace[field] } : subspace
  //     )
  //   );
  // };

  const handleSubspaceDeviceTypeChange = (index, type) => {
    const updatedSubspaces = [...subspaces];
    updatedSubspaces[index].deviceType = type;
    updatedSubspaces[index].selectedDevice = "";
    setSubspaces(updatedSubspaces);
  };


  const handleSubspaceDeviceChange = (index, deviceId) => {
    const updatedSubspaces = [...subspaces];
    updatedSubspaces[index].selectedDevice = deviceId;
    setSubspaces(updatedSubspaces);
  };

  const handleSubspaceCheckboxChange = (index, field) => {
    setSubspaces((prevSubspaces) =>
      prevSubspaces.map((sub, i) =>
        i === index ? { ...sub, [field]: !sub[field] } : sub
      )
    );
  };

  const [selectedVariables, setSelectedVariables] = useState([]);

  const handleAddVariable = () => {
    if (selectedVariable && !selectedVariables.includes(selectedVariable)) {
      setSelectedVariables([...selectedVariables, selectedVariable]);
    }
  };



  const handleChangeCategoryEspace = (event) => {
    const { value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      species: value,
    }));
  };
  const handleChangeCategory = (event, index) => {
    const { value } = event.target;

    setFormData((prevFormData) => {
      const updatedSubspaces = [...prevFormData.subProductionSpaces];
      updatedSubspaces[index] = {
        ...updatedSubspaces[index],
        species: typeof value === 'string' ? value.split(',') : value,
      };

      return {
        ...prevFormData,
        subProductionSpaces: updatedSubspaces,
      };
    });
  };
  const handleAddSpecies = () => {
    setSelectedSpecies((prev) => [...prev, ...formData.species]);
    setFormData((prevState) => ({
      ...prevState,
      species: [],
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === "heredar") {
      setHeredar(checked);
    }
  };
  // const handleSpeciesChange = (e) => {
  //   const speciesId = e.target.value;
  //   const speciesFound = species.find(s => s.id === speciesId);
  //   setSelectedSpecies(speciesFound);
  //   setSelectedVariable('');
  // };
  const handleSpeciesChange = (e) => {
    const specieId = e.target.value;
    setSelectedSpeciesId(specieId);
    setSelectedVariable("");
  };

  // const handleVariableChange = (e) => {
  //   const selected = variables.find((v) => v.id === e.target.value);
  //   setSelectedVariable(selected);
  // };

  const handleVariableChange = (index, value) => {
    setSelectedVariables((prev) => ({
      ...prev,
      [index]: value, // Actualiza solo el índice correspondiente
    }));
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "productionParameterId") {
      try {

        const subcategory = await EspacioService.getEspacioById(value);
        VariableList(productionParameterId.productionParameterId);

      } catch (error) {
        console.error("Error fetching subcategory or stages:", error);
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const parseNumber = (value) => {
      return value !== undefined && value !== null && !isNaN(value) ? parseInt(value, 10) : null;
    };

    const data = {
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
      monitoringSystemId: parseNumber(formData.monitoringSystemId),
      spaceTypeId: parseNumber(formData.spaceTypeId),
      species: Array.isArray(formData.species) ? formData.species : [],
      subProductionSpaces: formData.subProductionSpaces.map(subSpace => ({
        name: subSpace.name,
        gpsPosition: subSpace.gpsPosition,
        dimensionUnit: subSpace.dimensionUnit,
        shape: subSpace.shape,
        length: Math.max(subSpace.length || 0, 0),
        width: Math.max(subSpace.width || 0, 0),
        depth: Math.max(subSpace.depth || 0, 0),
        area: Math.max(subSpace.area || 0, 0),
        volume: Math.max(subSpace.volume || 0, 0),
        species: Array.isArray(subSpace.species) ? subSpace.species : [],
        monitoringSystemId: parseNumber(subSpace.monitoringSystemId),
        assignDevices: Array.isArray(subSpace.assignDevices) ? subSpace.assignDevices : [],
        configureMeasurementControls: Array.isArray(subSpace.configureMeasurementControls)
          ? subSpace.configureMeasurementControls.map(control => ({
            measurementType: control.measurementType,
            sensorId: parseNumber(control.sensorId),
            actuatorId: parseNumber(control.actuatorId),
            samplingTimeUnit: control.samplingTimeUnit,
            samplingFrequency: parseNumber(control.samplingFrequency),
            numberOfSamples: parseNumber(control.numberOfSamples),
            controlType: control.controlType,
            actuationTimeUnit: control.actuationTimeUnit,
            activationParameterRange: control.activationParameterRange,
            activationFrequency: parseNumber(control.activationFrequency),
            alertMessage: control.alertMessage,
            productionParameterId: parseNumber(control.productionParameterId)
          }))
          : [],
      })),
      assignDevices: Array.isArray(formData.assignDevices) ? formData.assignDevices : [],
      configureMeasurementControls: Array.isArray(formData.configureMeasurementControls)
        ? formData.configureMeasurementControls.map(control => ({
          measurementType: control.measurementType,
          sensorId: parseNumber(control.sensorId),
          actuatorId: parseNumber(control.actuatorId),
          samplingTimeUnit: control.samplingTimeUnit,
          samplingFrequency: parseNumber(control.samplingFrequency),
          numberOfSamples: parseNumber(control.numberOfSamples),
          controlType: control.controlType,
          actuationTimeUnit: control.actuationTimeUnit,
          activationParameterRange: control.activationParameterRange,
          activationFrequency: parseNumber(control.activationFrequency),
          alertMessage: control.alertMessage,
          productionParameterId: parseNumber(control.productionParameterId)
        }))
        : []
    };

    try {
      const response = await EspacioService.createEspacio(data);
      console.log('Espacio creado con éxito', response);
      navigate('../espacio');
    } catch (error) {
      console.error('Error al crear el espacio:', error);
    }
  };


  const handleMedicionControl = (variable) => {
    setSelectedVariableId(variable.id);
    setIsModalOpen(true);
  };

  return (
    <form className="p-6">
      <div className="container mx-auto p-8">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-semibold mb-6">Crear Lista de Especies</h2>

          {/* Steps Header */}
          <div className="flex flex-col mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className={`${step === 0 ? 'text-black font-bold' : 'text-gray-500'} flex items-center`}>
                1. Creación de Parámetros de Producción
                {step > 0 && <FaCheckCircle className="text-[#168C0DFF] ml-2" />}
              </div>
              <div className={`${step === 1 ? 'text-black font-bold' : 'text-gray-500'} flex items-center`}>
                2. Parámetros por Etapa
                {step > 1 && <FaCheckCircle className="text-[#168C0DFF] ml-2" />}
              </div>
              <div className={`${step === 2 ? 'text-black font-bold' : 'text-gray-500'}`}>
                3. Revisión y Confirmación
              </div>
            </div>

            <div className="flex items-center mb-6">
              <div className="flex-grow h-1 bg-gray-300 relative">
                <div
                  className={`h-1 bg-[#168C0DFF]`}
                  style={{ width: `${(step + 1) * (100 / 3)}%` }}
                ></div>
                <div className="absolute inset-0 flex justify-between">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className={`w-1 h-1 bg-white rounded-full border ${step >= index ? 'border-[#168C0DFF]' : 'border-gray-300'
                        }`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="space-y-6">
            {step === 0 && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre espacio
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    placeholder="Nombre espacio"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF]"
                  />
                </div>
                <div>
                  <label htmlFor="gpsPosition" className="block text-sm font-medium text-gray-700 mb-1">
                    Posición GPS
                  </label>
                  <input
                    type="number"
                    id="gpsPosition"
                    name="gpsPosition"
                    value={formData.gpsPosition || ''}
                    onChange={handleChange}
                    placeholder="Posición GPS"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF]"
                  />
                </div>
                <div>
                  <label htmlFor="monitoringSystemId" className="block text-sm font-medium text-gray-700 mb-1">
                    Sistema de monitoreo y control
                  </label>
                  <select
                    id="monitoringSystemId"
                    name="monitoringSystemId"
                    value={formData.monitoringSystemId || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF] cursor-pointer"
                  >
                    <option value="" className="text-gray-500">Selecciona una opción</option>
                    {monitoreo?.length > 0 && monitoreo.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.nombreId}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="spaceTypeId" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de espacio
                  </label>
                  <select
                    id="spaceTypeId"
                    name="spaceTypeId"
                    value={formData.spaceTypeId || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF] cursor-pointer"
                  >
                    <option value="" className="text-gray-500">Selecciona una opción</option>
                    {tipoEspacio?.length > 0 && tipoEspacio.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.spaceTypeName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="climateConditions" className="block text-sm font-medium text-gray-700 mb-1">
                    Condiciones de clima
                  </label>
                  <input
                    type="text"
                    id="climateConditions"
                    name="climateConditions"
                    value={formData.climateConditions || ''}
                    onChange={handleChange}
                    placeholder="Condiciones de clima"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF]"
                  />
                </div>
                <div>
                  <label htmlFor="dimensionUnit" className="block text-sm font-medium text-gray-700 mb-1">
                    Unidad de dimensionamiento
                  </label>
                  <input
                    type="text"
                    id="dimensionUnit"
                    name="dimensionUnit"
                    value={formData.dimensionUnit || ''}
                    onChange={handleChange}
                    placeholder="Unidad de dimensionamiento"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF]"
                  />
                </div>
                <div>
                  <label htmlFor="shape" className="block text-sm font-medium text-gray-700 mb-1">
                    Forma
                  </label>
                  <input
                    type="number"
                    id="shape"
                    name="shape"
                    value={formData.shape || ''}
                    onChange={handleChange}
                    placeholder="Forma"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF]"
                  />
                </div>
                <div>
                  <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
                    Largo
                  </label>
                  <input
                    type="number"
                    id="length"
                    name="length"
                    value={formData.length || ''}
                    onChange={handleChange}
                    placeholder="Largo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF]"
                  />
                </div>
                <div>
                  <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                    Ancho
                  </label>
                  <input
                    type="number"
                    id="width"
                    name="width"
                    value={formData.width || ''}
                    onChange={handleChange}
                    placeholder="Ancho"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF]"
                  />
                </div>
                <div>
                  <label htmlFor="depth" className="block text-sm font-medium text-gray-700 mb-1">
                    Profundo
                  </label>
                  <input
                    type="number"
                    id="depth"
                    name="depth"
                    value={formData.depth || ''}
                    onChange={handleChange}
                    placeholder="Profundo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF]"
                  />
                </div>
                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                    Área
                  </label>
                  <input
                    type="number"
                    id="area"
                    name="area"
                    value={formData.area || ''}
                    onChange={handleChange}
                    placeholder="Área"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF]"
                  />
                </div>
                <div>
                  <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-1">
                    Volumen
                  </label>
                  <input
                    type="number"
                    id="volume"
                    name="volume"
                    value={formData.volume || ''}
                    onChange={handleChange}
                    placeholder="Volumen"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF]"
                  />
                </div>
                <div>
                  <label htmlFor="specificFeatures" className="block text-sm font-medium text-gray-700 mb-1">
                    Características específicas
                  </label>
                  <input
                    type="text"
                    id="specificFeatures"
                    name="specificFeatures"
                    value={formData.specificFeatures || ''}
                    onChange={handleChange}
                    placeholder="Características específicas"
                    className="w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF]"
                  />
                </div>
                <div>
                  <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-1">
                    Especies
                  </label>
                  <FormControl fullWidth disabled={disableSpecies}>
                    <Select
                      multiple
                      value={formData.species || []}
                      onChange={handleChangeCategoryEspace}

                      renderValue={(selectedIds) =>
                        species
                          .filter((option) => selectedIds.includes(option.id))
                          .map((option) => option.common_name)
                          .join(', ')
                      }
                    >
                      {species.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          <Checkbox checked={formData.species?.includes(option.id)} />
                          <ListItemText primary={option.common_name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="w-full">
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={handleAddSubspaceClick}
                      disabled={disableSpecies}
                      className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600"
                    >
                      Añadir Subespacio
                    </button>
                  </div>

                  <div className="w-full grid grid-cols-1 gap-4">
                    {subspaces.map((subspace, index) => (
                      <div key={subspace.id} className="w-full border rounded-md p-4 mb-2">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-lg">{`Subespacio ${index + 1}`}</h3>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleExpandSubspace(subspace.id)}
                              className="text-blue-500"
                            >
                              {expandedSubspace === subspace.id ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                            <button
                              onClick={() => handleRemoveSubspace(subspace.id)}
                              className="text-red-500"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </div>
                        {expandedSubspace === subspace.id && (
                          <div className="w-full grid grid-cols-1 gap-4 mt-5">
                            <div className="mb-2 w-full">
                              <label className="block text-sm font-medium">Nombre espacio</label>
                              <input
                                type="text"
                                value={subspace.name}
                                onChange={(e) => handleInputChange(subspace.id, 'name', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                              />
                            </div>
                            <div className="mb-2 w-full">
                              <label className="block text-sm font-medium">Posición GPS:</label>
                              <input
                                type="number"
                                value={subspace.gpsPosition}
                                onChange={(e) => handleInputChange(subspace.id, 'gpsPosition', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                              />
                            </div>
                            <div className="mb-2 w-full">
                              <label className="block text-sm font-medium">Unidad de Dimensión:</label>
                              <input
                                type="text"
                                value={subspace.dimensionUnit}
                                onChange={(e) => handleInputChange(subspace.id, 'dimensionUnit', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                              />
                            </div>
                            <div className="mb-2 w-full">
                              <label className="block text-sm font-medium">Forma:</label>
                              <input
                                type="text"
                                value={subspace.shape}
                                onChange={(e) => handleInputChange(subspace.id, 'shape', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                              />
                            </div>
                            <div className="mb-2 w-full">
                              <label className="block text-sm font-medium">Longitud:</label>
                              <input
                                type="number"
                                value={subspace.length}
                                onChange={(e) => handleInputChange(subspace.id, 'length', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                              />
                            </div>
                            <div className="mb-2 w-full">
                              <label className="block text-sm font-medium">Anchura:</label>
                              <input
                                type="number"
                                value={subspace.width}
                                onChange={(e) => handleInputChange(subspace.id, 'width', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                              />
                            </div>
                            <div className="mb-2 w-full">
                              <label className="block text-sm font-medium">Profundidad:</label>
                              <input
                                type="number"
                                value={subspace.depth}
                                onChange={(e) => handleInputChange(subspace.id, 'depth', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                              />
                            </div>
                            <div className="mb-2 w-full">
                              <label className="block text-sm font-medium">Área:</label>
                              <input
                                type="number"
                                value={subspace.area}
                                onChange={(e) => handleInputChange(subspace.id, 'area', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                              />
                            </div>
                            <div className="mb-2 w-full">
                              <label className="block text-sm font-medium">Volumen:</label>
                              <input
                                type="number"
                                value={subspace.volume}
                                onChange={(e) => handleInputChange(subspace.id, 'volume', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                              />
                            </div>

                            <div className="mb-2 w-full ">
                              <label htmlFor={`species-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                Especies para el Subespacio {index + 1}
                              </label>
                              <FormControl fullWidth>
                                <Select
                                  multiple
                                  id={`species-${index}`}
                                  value={subspace.species || []}
                                  onChange={(event) => handleChangeCategory(event, index)}
                                  renderValue={(selectedIds) =>
                                    species
                                      .filter((option) => selectedIds.includes(option.id))
                                      .map((option) => option.common_name)
                                      .join(', ')
                                  }
                                >
                                  {species.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                      <Checkbox checked={subspace.species?.includes(option.id)} />
                                      <ListItemText primary={option.common_name} />
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            )}
            {step === 1 && (

              <div className="grid grid-cols-1 gap-4  ">
                <div className='border border-gray-400 rounded-md shadow shadow-gray-400'>
                  <h2>Espacio</h2>

                  <label>¿Necesitas asignar dispositivos?</label>
                  <div className="flex items-center space-x-4 mt-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isYesSelected}
                        onChange={handleYesCheckboxChange}
                        className="hidden"
                      />
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isYesSelected ? "bg-white border-[#168C0DFF]" : "border-gray-400"}`}
                      >
                        {isYesSelected && <span className="w-3 h-3 bg-[#168C0DFF] rounded-full"></span>}
                      </span>
                      <span className="text-sm font-medium">Sí</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!isYesSelected}
                        onChange={handleNoCheckboxChange}
                        className="hidden"
                      />
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!isYesSelected ? "bg-white border-[#168C0DFF]" : "border-gray-400"}`}
                      >
                        {!isYesSelected && <span className="w-3 h-3 bg-[#168C0DFF] rounded-full"></span>}
                      </span>
                      <span className="text-sm font-medium">No</span>
                    </label>
                  </div>

                  {isYesSelected && (
                    <div className='flex justify-end'>
                      <button
                        type='button'
                        onClick={handleAddDevice}
                        className="mt-4 bg-white border border-[#168C0DFF] text-[#168C0DFF] px-4 py-2 rounded flex items-center gap-2"
                      >
                        <FiPlusCircle />
                        Añadir más
                      </button>
                    </div>
                  )}

                  <div>
                    {devicesList.map((device, index) => (
                      <div key={index} className="flex space-x-4 mt-6">
                        <div className="w-1/2 mb-2">
                          <label className="block text-sm font-medium">Tipo de dispositivo:</label>
                          <select
                            value={device.deviceType}
                            onChange={(e) => handleDeviceTypeChange(index, e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            disabled={!isYesSelected}
                          >
                            <option value="">Seleccione un tipo</option>
                            <option value="actuador">Actuador</option>
                            <option value="sensor">Sensor</option>
                          </select>
                        </div>

                        <div className="mb-2">
                          <label className="block text-sm font-medium">Nombre dispositivo:</label>
                          <select
                            value={device.selectedDevice}
                            onChange={(e) => handleDeviceSelectionChange(index, e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            disabled={!isYesSelected || !device.deviceType}
                          >
                            <option value="">Seleccione un dispositivo</option>
                            {getDevicesByType(device.deviceType).map((dev) => (
                              <option key={dev.id} value={dev.id}>
                                {dev.code}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>



                <div>

                  {subspaces.length > 0 && (
                    <div>
                      <div className="grid grid-cols-2 gap-4">
                        {subspaces.map((subspace, index) => (
                          <div key={index} className="border border-gray-400 rounded-md shadow shadow-gray-400 p-4">
                            <h3>Subespacio {index + 1}</h3>

                            <div className="mb-4">
                              <label>¿Necesitas asignar dispositivos?</label>
                              <div className="flex items-center space-x-4 mt-2">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={subspace.assignDevices}
                                    onChange={() => handleSubspaceCheckboxChange(index, "assignDevices")}
                                    className="hidden"
                                  />
                                  <span
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${subspace.assignDevices ? "bg-green-500 border-green-500" : "border-gray-400"}`}
                                  >
                                    {subspace.assignDevices && <span className="w-3 h-3 bg-white rounded-full"></span>}
                                  </span>
                                  <span className="text-sm font-medium">Sí</span>
                                </label>
                              </div>
                            </div>

                            <div className="mb-4">
                              <label>Heredar dispositivos</label>
                              <div className="flex items-center space-x-4 mt-2">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={subspace.inheritDevices}
                                    onChange={() => handleSubspaceCheckboxChange(index, "inheritDevices")}
                                    className="hidden"
                                  />
                                  <span
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${subspace.inheritDevices ? "bg-green-500 border-green-500" : "border-gray-400"}`}
                                  >
                                    {subspace.inheritDevices && <span className="w-3 h-3 bg-white rounded-full"></span>}
                                  </span>
                                  <span className="text-sm font-medium">Sí</span>
                                </label>
                              </div>
                            </div>

                            <div className="mb-2">
                              <label className="block text-sm font-medium">Tipo de dispositivo:</label>
                              <select
                                value={subspace.deviceType}
                                onChange={(e) => handleSubspaceDeviceTypeChange(index, e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                                disabled={!subspace.assignDevices}
                              >
                                <option value="">Seleccione un tipo</option>
                                <option value="actuador">Actuador</option>
                                <option value="sensor">Sensor</option>
                              </select>
                            </div>

                            <div className="mb-2">
                              <label className="block text-sm font-medium">Nombre del dispositivo:</label>
                              <select
                                value={subspace.selectedDevice}
                                onChange={(e) => handleSubspaceDeviceChange(index, e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                                disabled={!subspace.assignDevices || !subspace.deviceType}
                              >
                                <option value="">Seleccione un dispositivo</option>
                                {getDevicesByType(subspace.deviceType).map((device) => (
                                  <option key={device.id} value={device.id}>
                                    {device.code}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ))}

                      </div>
                    </div>
                  )}

                </div>
              </div>


            )}

            {step === 2 && (
              <div>
                <div className="border border-gray-400 p-3 rounded-lg">
                  <div>
                    <h2 className="font-bold p-1">Espacio</h2>
                  </div>
                  <div className="py-3 px-3">
                    <label
                      htmlFor="species"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Especies
                    </label>
                    <select
                      id="species"
                      name="species"
                      onChange={handleSpeciesChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm"
                    >
                      <option value="" className="text-gray-500">
                        Selecciona una opción
                      </option>
                      {species?.length > 0 &&
                        species.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.common_name}
                          </option>
                        ))}
                    </select>

                    {/* Selector de variables */}
                    <div className="mt-4">
                      <label
                        htmlFor="variable"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Variables Asociadas
                      </label>
                      <select
                        id="variable"
                        name="variable"
                        onChange={(e) => handleVariableChange('main', e.target.value)} // Selector principal
                        value={selectedVariables['main'] || ''}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm"
                      >
                        <option value="" className="text-gray-500">
                          Selecciona una variable
                        </option>
                        {variables.length > 0 &&
                          variables.map((variable, index) => (
                            <option key={index} value={variable.id}>
                              {variable.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  {selectedVariables['main'] && (
                    <div>
                      <button
                        type="button"
                        onClick={handleAddVariable}
                        className="mt-4 bg-white border border-[#168C0DFF] text-[#168C0DFF] px-4 py-2 rounded flex items-center gap-2"
                      >
                        <FiPlusCircle />
                        Añadir Variable
                      </button>
                    </div>
                  )}

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
                        selectedVariableId={selectedVariableId}
                        onClose={() => setIsModalOpen(false)}
                      />
                    </GenericModal>
                  )}

                  {subspaces.length > 0 && (
                    <div className="py-5">
                      <div className="grid grid-cols-2 gap-4">
                        {subspaces.map((subspace, index) => (
                          <div
                            key={index}
                            className="border border-gray-400 rounded-md shadow shadow-gray-400 p-4"
                          >
                            <h3>Subespacio {index + 1}</h3>
                            <div className="py-3 px-3">
                              <label
                                htmlFor={`species-${index}`}
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Especies
                              </label>
                              <select
                                id={`species-${index}`}
                                name={`species-${index}`}
                                onChange={handleSpeciesChange}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm"
                              >
                                <option value="" className="text-gray-500">
                                  Selecciona una opción
                                </option>
                                {species?.length > 0 &&
                                  species.map((sub) => (
                                    <option key={sub.id} value={sub.id}>
                                      {sub.common_name}
                                    </option>
                                  ))}
                              </select>

                              <div className="mt-4">
                                <label
                                  htmlFor={`variable-${index}`}
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Variables Asociadas
                                </label>
                                <select
                                  id={`variable-${index}`}
                                  name={`variable-${index}`}
                                  onChange={(e) =>
                                    handleVariableChange(index, e.target.value)
                                  }
                                  value={selectedVariables[index] || ''}
                                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm"
                                >
                                  <option value="" className="text-gray-500">
                                    Selecciona una variable
                                  </option>
                                  {variables.length > 0 &&
                                    variables.map((variable, varIndex) => (
                                      <option key={varIndex} value={variable.id}>
                                        {variable.name}
                                      </option>
                                    ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-4">
              {step > 0 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#168C0DFF]"
                >
                  Anterior
                </button>
              )}
              {step < 2 && (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#137B09FF] text-white hover:bg-[#168C0DFF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#168C0DFF]"
                >
                  Siguiente
                </button>
              )}
              {step === 2 && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#137B09FF] text-white hover:bg-[#168C0DFF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#168C0DFF]"
                >
                  Finalizar
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </form>
  );
};

export default CrearEspacio;
