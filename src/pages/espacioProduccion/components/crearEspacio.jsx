import React, { useState, useEffect } from 'react';

import { FaCheckCircle } from 'react-icons/fa';
import MonitoreoService from '../../../services/monitoreo';
import TipoEspacioService from '../../../services/tipoEspacio';
import EspacioService from '../../../services/espacios';
import SensorService from '../../../services/SensorService';
import Actuadorervice from '../../../services/ActuadorService';
import SpeciesService from '../../../services/SpeciesService';
import { MenuItem, FormControl, Select, InputLabel, Checkbox, ListItemText } from '@mui/material';

const CrearEspacio = () => {

  const [showSubspaceField, setShowSubspaceField] = useState(false);
  const [disableSpecies, setDisableSpecies] = useState(false);
  const [subspaces, setSubspaces] = useState([]);
  const [expandedSubspace, setExpandedSubspace] = useState(null);
  const [subspaceCount, setSubspaceCount] = useState(1); // Controla la cantidad de subespacios
  const [isYesSelected, setIsYesSelected] = useState(false);
  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');
  const [devicesList, setDevicesList] = useState([]);
  const [variable, VariableList] = useState([]);
  const [step, setStep] = useState(0);
  const [subespacioCreado, setSubespacioCreado] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState([]);
  const [selectedVariable, setSelectedVariable] = useState('');

  const handleNextStep = () => {
    if (step < 2) setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  const [inheritSensors, setInheritSensors] = useState(false);

  const [deviceType, setDeviceType] = useState(""); // Tipo de dispositivo seleccionado
  const [selectedDevice, setSelectedDevice] = useState("");
  const [heredar, setHeredar] = useState(false);

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
    species: [], // Lista vacía para IDs de especies
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
        const data = await SensorService.getAllSensor(52);
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
        const data = await Actuadorervice.getAllActuador(52);
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
    const fetchTipoEspacio = async () => {
      try {
        const data = await TipoEspacioService.getAlltipoEspacio(42);
        setTipoEspacio(data);
        console.log('tipos', data);
      } catch (error) {
        console.error('Error fetching tipoEspacio:', error);
      }
    };
    fetchTipoEspacio();
  }, []);




  const handleAddSubspaceClick = () => {
    const newSubspace = {
      id: Date.now(), // Generamos un ID único para el subespacio
      species: [...formData.species], // Copiamos las especies seleccionadas
      name: '',
      gpsPosition: '',
      dimensionUnit: '',
      shape: '',
      length: '',
      width: '',
      depth: '',
      area: '',
      volume: '',
      specificFeatures: ''
    };  // Datos iniciales para un subespacio
    setSubspaces([...subspaces, newSubspace]); // Agrega el nuevo subespacio al estado
  };


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

  const handleDeviceTypeChange = (e) => {
    setDeviceType(e.target.value);
    setSelectedDevice(""); // Reinicia el dispositivo seleccionado al cambiar el tipo
  };
  const handleInheritChange = () => {
    setInheritSensors(!inheritSensors); // Alterna el valor de heredar sensores
  };

  // Obtener dispositivos según el tipo seleccionado
  const getDevicesByType = () => {
    if (deviceType === "actuador") {
      return tipoActuador.map((device) => ({
        id: device.id,
        code: device.actuatorCode,
      }));
    } else if (deviceType === "sensor") {
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
      { deviceType: "", selectedDevice: "" } // Agrega un nuevo dispositivo vacío
    ]);


    // setDeviceType('');
    // setSelectedDevice('');
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
        species: typeof value === 'string' ? value.split(',') : value, // Actualiza las especies
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
  const handleSpeciesChange = (e) => {
    const speciesId = e.target.value;
    const speciesFound = species.find(s => s.id === speciesId);
    setSelectedSpecies(speciesFound);
    setSelectedVariable(''); // Reiniciar la variable seleccionada cuando cambie la especie
  };
  const handleVariableChange = (e) => {
    setSelectedVariable(e.target.value);
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

            {/* Steps Progress Bar */}
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
                <div >
                  <label htmlFor="scientificName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre espacio
                  </label>
                  <input
                    type="text"
                    id="scientificName"
                    name="scientificName"
                    placeholder="Nombre espacio"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF]"
                  />
                </div>
                <div >
                  <label htmlFor="scientificName" className="block text-sm font-medium text-gray-700 mb-1">
                    posición GPS
                  </label>
                  <input
                    type="number"
                    id="scientificName"
                    name="scientificName"
                    placeholder="posición GPS"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF]"
                  />
                </div>
                <div>
                  <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
                    sist monitoreo y control
                  </label>
                  <select
                    id="subcategory"
                    name="subcategory"
                  // value={formData.subcategory}
                  // onChange={handleChange}
                  // className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF] cursor-pointer ${errors.subcategory ? 'border-red-500' : 'text-gray-500'}`}
                  >
                    <option value="" className="text-gray-500">Selecciona una opción</option>
                    {monitoreo?.length > 0 && monitoreo.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.nombreId}
                      </option>
                    ))}
                  </select>
                  {/* {errors.subcategory && <p className="text-red-500 text-xs mt-1">{errors.subcategory}</p>} */}
                </div>

                <div>
                  <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de espacio
                  </label>
                  <select
                    id="subcategory"
                    name="subcategory"
                  // value={formData.subcategory}
                  // onChange={handleChange}
                  // className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF] cursor-pointer ${errors.subcategory ? 'border-red-500' : 'text-gray-500'}`}
                  >
                    <option value="" className="text-gray-500">Selecciona una opción</option>
                    {tipoEspacio?.length > 0 && tipoEspacio.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.spaceTypeName}
                      </option>
                    ))}
                  </select>
                  {/* {errors.subcategory && <p className="text-red-500 text-xs mt-1">{errors.subcategory}</p>} */}
                </div>
                <div >
                  <label htmlFor="scientificName" className="block text-sm font-medium text-gray-700 mb-1">
                    condiciones de clima
                  </label>
                  <input
                    type="text"
                    id="scientificName"
                    name="scientificName"
                    placeholder="condiciones de clima "
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF]"
                  />
                </div>
                <div >
                  <label htmlFor="scientificName" className="block text-sm font-medium text-gray-700 mb-1">
                    unidad de dimensionamiento
                  </label>
                  <input
                    type="text"
                    id="scientificName"
                    name="scientificName"
                    placeholder="unidad de dimensionamiento"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF]"
                  />
                </div>
                <div >
                  <label htmlFor="scientificName" className="block text-sm font-medium text-gray-700 mb-1">
                    forma
                  </label>
                  <input
                    type="number"
                    id="scientificName"
                    name="scientificName"
                    placeholder="forma"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF]"
                  />
                </div>
                <div >
                  <label htmlFor="scientificName" className="block text-sm font-medium text-gray-700 mb-1">
                    largo
                  </label>
                  <input
                    type="number"
                    id="scientificName"
                    name="scientificName"
                    placeholder="largo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF]"
                  />
                </div>
                <div >
                  <label htmlFor="scientificName" className="block text-sm font-medium text-gray-700 mb-1">
                    ancho
                  </label>
                  <input
                    type="number"
                    id="scientificName"
                    name="scientificName"
                    placeholder="ancho"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF]"
                  />
                </div>
                <div >
                  <label htmlFor="scientificName" className="block text-sm font-medium text-gray-700 mb-1">
                    profundo
                  </label>
                  <input
                    type="number"
                    id="scientificName"
                    name="scientificName"
                    placeholder="profundo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF]"
                  />
                </div>
                <div >
                  <label htmlFor="scientificName" className="block text-sm font-medium text-gray-700 mb-1">
                    área
                  </label>
                  <input
                    type="number"
                    id="scientificName"
                    name="scientificName"
                    placeholder="área"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF]"
                  />
                </div>
                <div >
                  <label htmlFor="scientificName" className="block text-sm font-medium text-gray-700 mb-1">
                    Volumen
                  </label>
                  <input
                    type="number"
                    id="scientificName"
                    name="scientificName"
                    placeholder="Volumen"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF]"
                  />
                </div>
                <div >
                  <label htmlFor="scientificName" className="block text-sm font-medium text-gray-700 mb-1">
                    caracteristicas especificas
                  </label>
                  <input
                    type="text"
                    id="scientificName"
                    name="scientificName"
                    placeholder="caracteristicas especificas"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF]"
                  />
                </div>
                <div>
                  <label htmlFor="especie" className="block text-sm font-medium text-gray-700 mb-1">
                    Especies
                  </label>
                  <FormControl fullWidth disabled={disableSpecies}
                  >
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

                  <div>
                    <div className="col-span-3">
                      <button
                        type="button"
                        onClick={handleAddSubspaceClick}
                        disabled={disableSpecies}
                        className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600"
                      >
                        Añadir Subespacio
                      </button>
                    </div>
                    <div className="mt-4">
                      {subspaces.map((subspace, index) => (
                        <div key={subspace.id} className="border rounded-md p-4 mb-2">
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg">
                              {`Subespacio ${index + 1}`}
                            </h3>
                            <div className="flex items-center gap-2">
                              <button
                                type='button'
                                onClick={() => handleExpandSubspace(subspace.id)}
                                className="text-blue-500"
                              >
                                {expandedSubspace === subspace.id ? "Colapsar" : "Expandir"}
                              </button>
                              <button
                                onClick={() => handleRemoveSubspace(subspace.id)}
                                className="text-red-500"
                              >
                                X
                              </button>
                            </div>
                          </div>
                          {expandedSubspace === subspace.id && (
                            <div className="grid grid-cols-2 gap-4 mt-5">
                              <div className="mb-2">
                                <label className="block text-sm font-medium">
                                  Nombre espacio
                                </label>
                                <input
                                  type="text"
                                  value={subspace.name}
                                  onChange={(e) =>
                                    handleInputChange(subspace.id, "name", e.target.value)
                                  }
                                  className="w-full px-3 py-2 border rounded-md"
                                />
                              </div>
                              <div className="mb-2">
                                <label className="block text-sm font-medium">Posición GPS:</label>
                                <input
                                  type="number"
                                  value={subspace.gpsPosition}
                                  onChange={(e) =>
                                    handleInputChange(subspace.id, "gpsPosition", e.target.value)
                                  }
                                  className="w-full px-3 py-2 border rounded-md"
                                />
                              </div>
                              <div className="mb-2">
                                <label className="block text-sm font-medium">Unidad de Dimensión:</label>
                                <input
                                  type="text"
                                  value={subspace.dimensionUnit}
                                  onChange={(e) =>
                                    handleInputChange(subspace.id, "dimensionUnit", e.target.value)
                                  }
                                  className="w-full px-3 py-2 border rounded-md"
                                />
                              </div>
                              <div className="mb-2">
                                <label className="block text-sm font-medium">Forma:</label>
                                <input
                                  type="text"
                                  value={subspace.shape}
                                  onChange={(e) =>
                                    handleInputChange(subspace.id, "shape", e.target.value)
                                  }
                                  className="w-full px-3 py-2 border rounded-md"
                                />
                              </div>
                              <div className="mb-2">
                                <label className="block text-sm font-medium">Longitud:</label>
                                <input
                                  type="number"
                                  value={subspace.length}
                                  onChange={(e) =>
                                    handleInputChange(subspace.id, "length", e.target.value)
                                  }
                                  className="w-full px-3 py-2 border rounded-md"
                                />
                              </div>
                              <div className="mb-2">
                                <label className="block text-sm font-medium">Anchura:</label>
                                <input
                                  type="number"
                                  value={subspace.width}
                                  onChange={(e) =>
                                    handleInputChange(subspace.id, "width", e.target.value)
                                  }
                                  className="w-full px-3 py-2 border rounded-md"
                                />
                              </div>
                              <div className="mb-2">
                                <label className="block text-sm font-medium">Profundidad:</label>
                                <input
                                  type="number"
                                  value={subspace.depth}
                                  onChange={(e) =>
                                    handleInputChange(subspace.id, "depth", e.target.value)
                                  }
                                  className="w-full px-3 py-2 border rounded-md"
                                />
                              </div>
                              <div className="mb-2">
                                <label className="block text-sm font-medium">Área:</label>
                                <input
                                  type="number"
                                  value={subspace.area}
                                  onChange={(e) =>
                                    handleInputChange(subspace.id, "area", e.target.value)
                                  }
                                  className="w-full px-3 py-2 border rounded-md"
                                />
                              </div>
                              <div className="mb-2">
                                <label className="block text-sm font-medium">Volumen:</label>
                                <input
                                  type="number"
                                  value={subspace.volume}
                                  onChange={(e) =>
                                    handleInputChange(subspace.id, "volume", e.target.value)
                                  }
                                  className="w-full px-3 py-2 border rounded-md"
                                />
                              </div>
                              {formData.subProductionSpaces.map((subspace, index) => (
                                <div key={index}>
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
                              ))}

                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                  </div>

                </div>
              </div>
            )}
            {step === 1 && (

              <div className="grid grid-cols-1 gap-4  ">
                <div className='border border-gray-500'>
                  <h2>Espacios</h2>
                  <label>¿Necesitas asignar dispositivos?</label>
                  <div className="flex items-center space-x-4 mt-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isYesSelected}
                        onChange={handleYesCheckboxChange}
                        className="hidden" // Ocultar checkbox original
                      />
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isYesSelected ? "bg-green-500 border-green-500" : "border-gray-400"}`}
                      >
                        {isYesSelected && <span className="w-3 h-3 bg-white rounded-full"></span>}
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
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!isYesSelected ? "bg-green-500 border-green-500" : "border-gray-400"}`}
                      >
                        {!isYesSelected && <span className="w-3 h-3 bg-white rounded-full"></span>}
                      </span>
                      <span className="text-sm font-medium">No</span>
                    </label>
                  </div>

                  {isYesSelected && (
                    <div>
                      <button
                        type='button'
                        onClick={handleAddDevice}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Añadir más
                      </button>
                    </div>
                  )}

                  <div>
                    {/* Selector de tipo de dispositivo */}
                    <div className="flex space-x-4">
                      <div className="w-1/2 mb-2">
                        <label className="block text-sm font-medium">Tipo de dispositivo:</label>
                        <select
                          value={deviceType}
                          onChange={handleDeviceTypeChange}
                          className="w-full px-3 py-2 border rounded-md"
                          disabled={!isYesSelected}
                        >
                          <option value="">Seleccione un tipo</option>
                          <option value="actuador">Actuador</option>
                          <option value="sensor">Sensor</option>
                        </select>
                      </div>

                      {/* Selector de dispositivos */}
                      <div className="mb-2">
                        <label className="block text-sm font-medium">Nombre dispositivo:</label>
                        <select
                          value={selectedDevice}
                          onChange={(e) => setSelectedDevice(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                          disabled={!isYesSelected || !deviceType}
                        >
                          <option value="">Seleccione un dispositivo</option>
                          {getDevicesByType().map((device) => (
                            <option key={device.id} value={device.id}>
                              {device.code}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Mostrar campos de tipo de dispositivo y nombre si se ha hecho clic en "Añadir más" */}
                  {devicesList.length > 0 && (
                    <div className="mt-4">
                      {devicesList.map((device, index) => (
                        <div key={index} className="flex space-x-4">
                          {/* Campo de Tipo de Dispositivo */}
                          <div className="w-1/2 mb-2">
                            <label className="block text-sm font-medium">Tipo de dispositivo:</label>
                            <select
                              value={device.deviceType}
                              onChange={(e) => {
                                const newDevicesList = [...devicesList];
                                newDevicesList[index].deviceType = e.target.value;
                                newDevicesList[index].selectedDevice = ''; // Resetear el nombre cuando cambie el tipo
                                setDevicesList(newDevicesList);
                              }}
                              className="w-full px-3 py-2 border rounded-md"
                            >
                              <option value="">Seleccione un tipo</option>
                              <option value="actuador">Actuador</option>
                              <option value="sensor">Sensor</option>
                            </select>
                          </div>

                          {/* Campo de Nombre de Dispositivo */}
                          <div className="w-1/2 mb-2">
                            <label className="block text-sm font-medium">Nombre dispositivo:</label>
                            <select
                              value={device.selectedDevice}
                              onChange={(e) => {
                                const newDevicesList = [...devicesList];
                                newDevicesList[index].selectedDevice = e.target.value;
                                setDevicesList(newDevicesList);
                              }}
                              className="w-full px-3 py-2 border rounded-md"
                            >
                              <option value="">Seleccione un dispositivo</option>
                              {getDevicesByType().map((dev) => (
                                <option key={dev.id} value={dev.id}>
                                  {dev.code}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>

                  {/* Paso 2: Mostrar los campos de cada subespacio */}
                  {subspaces.length > 0 && (
                    <div>
                      <div className="grid grid-cols-2 gap-4">
                        {subspaces.map((subspace, index) => (
                          <div key={subspace.id} className="border border-gray-500 p-4">
                            <h3>Subespacio {index + 1}</h3>

                            {/* Contenedor en fila para "¿Necesitas asignar dispositivos?" y "Heredar Dispositivo" */}
                            <div className="flex space-x-8 mb-4">
                              {/* Preguntar si necesita asignar dispositivos */}
                              <div className="flex flex-col">
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
                                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isYesSelected ? "bg-green-500 border-green-500" : "border-gray-400"}`}
                                    >
                                      {isYesSelected && <span className="w-3 h-3 bg-white rounded-full"></span>}
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
                                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!isYesSelected ? "bg-green-500 border-green-500" : "border-gray-400"}`}
                                    >
                                      {!isYesSelected && <span className="w-3 h-3 bg-white rounded-full"></span>}
                                    </span>
                                    <span className="text-sm font-medium">No</span>
                                  </label>
                                </div>
                              </div>

                              {/* Heredar Dispositivo */}
                              <div className="flex flex-col">
                                <label>Heredar Dispositivo</label>
                                <div className="flex items-center space-x-4 mt-4">
                                  <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={isYesSelected}
                                      onChange={handleYesCheckboxChange}
                                      className="hidden"
                                    />
                                    <span
                                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isYesSelected ? "bg-green-500 border-green-500" : "border-gray-400"}`}
                                    >
                                      {isYesSelected && <span className="w-3 h-3 bg-white rounded-full"></span>}
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
                                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!isYesSelected ? "bg-green-500 border-green-500" : "border-gray-400"}`}
                                    >
                                      {!isYesSelected && <span className="w-3 h-3 bg-white rounded-full"></span>}
                                    </span>
                                    <span className="text-sm font-medium">No</span>
                                  </label>
                                </div>
                              </div>
                            </div>

                            {/* Selección de tipo de dispositivo */}
                            <div className="mb-2">
                              <label className="block text-sm font-medium">Tipo de dispositivo:</label>
                              <select
                                value={deviceType}
                                onChange={handleDeviceTypeChange}
                                className="w-full px-3 py-2 border rounded-md"
                                disabled={!isYesSelected}
                              >
                                <option value="">Seleccione un tipo</option>
                                <option value="actuador">Actuador</option>
                                <option value="sensor">Sensor</option>
                              </select>
                            </div>

                            {/* Selector de dispositivos */}
                            <div className="mb-2">
                              <label className="block text-sm font-medium">Nombre dispositivo:</label>
                              <select
                                value={selectedDevice}
                                onChange={(e) => setSelectedDevice(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                                disabled={!isYesSelected || !deviceType}
                              >
                                <option value="">Seleccione un dispositivo</option>
                                {getDevicesByType().map((device) => (
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
              // <div className="text-center">
              //   <p>Selector de especies registradas</p>
              //   <div>
              //     <h4>Espacio Principal</h4>
              //     <select
              //       value=""
              //       onChange={handleChangeCategoryEspace}
              //       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              //     >
              //       <option value="" disabled>
              //         Selecciona una especie
              //       </option>
              //       {/* Verifica si formData.species es un arreglo antes de mapear */}
              //       {Array.isArray(formData.species) && formData.species.length > 0 ? (
              //         formData.species.map((species, index) => (
              //           <option key={index} value={species}>
              //             {species}
              //           </option>
              //         ))
              //       ) : (
              //         <option disabled>No hay especies disponibles</option>
              //       )}
              //     </select>
              //     <p>Especies seleccionadas: {Array.isArray(formData.species) ? formData.species.join(', ') : 'No hay especies'}</p>
              //     <button onClick={handleAddSpecies} className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600">
              //       Añadir
              //     </button>
              //   </div>

              //   <div>
              //     <h4>Especies Agregadas</h4>
              //     <ul>
              //       {selectedSpecies.map((species, index) => (
              //         <li key={index}>{species}</li>
              //       ))}
              //     </ul>
              //   </div>
              // </div>
              <div>
              <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-1">
                Especies
              </label>
              <select
                id="species"
                name="species"
                onChange={handleSpeciesChange} // Actualizar estado al seleccionar una especie
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm"
             
             >
                <option value="" className="text-gray-500">Selecciona una opción</option>
                {species?.length > 0 && species.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.common_name} {/* Mostrar el nombre común de la especie */}
                  </option>
                ))}
              </select>
        
              {/* {selectedSpecies && selectedSpecies.variables?.length > 0 && ( */}
                <div className="mt-4">
                  <label htmlFor="variable" className="block text-sm font-medium text-gray-700 mb-1">
                    Variables Asociadas
                  </label>
                  <select
                    id="variable"
                    name="variable"
                    // onChange={handleVariableChange}
                    onChange={handleChange}
                    value={selectedVariable}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm"
                  >
                    <option value="" className="text-gray-500">Selecciona una variable</option>
                    {selectedSpecies.variables?.length > 0 && selectedSpecies.variables.map((variable, index) => (
                      <option key={index} value={variable}>
                        {variable} {/* Mostrar las variables asociadas a la especie seleccionada */}
                      </option>
                    ))}
                  </select>
                </div>
              {/* )} */}
        
              {/* Mostrar la especie seleccionada y la variable seleccionada */}
              {selectedSpecies && selectedVariable && (
                <div className="mt-4">
                  <p><strong>Especie seleccionada:</strong> {selectedSpecies.common_name}</p>
                  <p><strong>Variable seleccionada:</strong> {selectedVariable}</p>
                </div>
              )}
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
                  onClick={() => alert('Formulario finalizado')}
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
