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
import { useCompanyContext } from '../../../context/CompanyContext';

const CrearEspacio = () => {
  const [selectedVariables, setSelectedVariables] = useState({
    main: [],
    subspaces: []
  });
  const [ids, setIds] = useState([])
  const [showSubspaceField, setShowSubspaceField] = useState(false);
  const [disableSpecies, setDisableSpecies] = useState(false);
  const [subspaces, setSubspaces] = useState([
    // { assignDevices: false, inheritDevices: false}
    // , deviceType: "", selectedDevice: "" }
  ]);
  const [selectedVariableId, setSelectedVariableId] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const { selectedCompanyUniversal, hiddenSelect } = useCompanyContext();

  const [expandedSubspace, setExpandedSubspace] = useState(null);
  const [subspaceCount, setSubspaceCount] = useState(1);
  const [isYesSelected, setIsYesSelected] = useState(true);
  const [isYesSubSelected, setIsYesSubSelected] = useState(true);
  const [isYesHeSelected, setIsYesHeSelected] = useState(true);
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

 
  const [inheritSensors, setInheritSensors] = useState(false);
  const [variablesBySubspace, setVariablesBySubspace] = useState({});

  const [deviceType, setDeviceType] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [heredar, setHeredar] = useState(false);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState("");
  const [variables, setVariables] = useState([]);
  const [mainVariables, setMainVariables] = useState([]);

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

  const [subEspacio, setSubEspacio] = useState(
    {
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
    });
  const [especiesEspacio, setEspecieEspasios] = useState([]);
  const [especiesSubspacio, setEspecieSubspasios] = useState({ species: [], });

  const handleNextStep = () => {
    if (step < 2) setStep((prev) => prev + 1);
    console.log("primer dato : ", formData)
    console.log("primer dato subspaces: ", subspaces)
  };

  const handlePrevStep = () => {
    if (step > 0) setStep((prev) => prev - 1);
    console.log("devicesList : ", devicesList)
  };


  useEffect(() => {
    hiddenSelect(true)
    const fetchMonitoreo = async () => {
      try {
        const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : '';
        const data = await MonitoreoService.getAllMonitories(companyId);
        setMonitoreo(data);
      } catch (error) {
        console.error('Error fetching monitoreo:', error);
      }
    };
    fetchMonitoreo();
  }, [selectedCompanyUniversal]);

  useEffect(() => {
    const fetchTipoSensor = async () => {
      try {
        const data = await SensorService.getAllSensor(0, {});
        setTipoSensor(data);
        console.log('sensores', data)
      } catch (error) {
        console.error('Error fetching tipo sensor:', error);
      }
    };
    fetchTipoSensor(0, {});
  }, []);

  useEffect(() => {
    const fetchTipoActuador = async () => {
      try {
        const data = await Actuadorervice.getAllActuador(0, {});
        setTipoActuador(data);
        console.log('actuadores', data)

      } catch (error) {
        console.error('Error fetching tio actuador:', error);
      }
    };
    fetchTipoActuador(0, {});
  }, []);

  useEffect(() => {
    const fetchEspecies = async () => {
      try {
        const data = await SpeciesService.getAllSpecie(0, {});
        setTipoEspecies(data);
        console.log('especies traidas', data);
      } catch (error) {
        console.error('Error fetching species:', error);
      }
    };
    fetchEspecies(0, {});
  }, []);


  useEffect(() => {
    const fetchVariable = async () => {
      if (!selectedSpeciesId) return;

      try {
        const data = await SpeciesService.getVariableBySpecie({ species: { id: selectedSpeciesId } });
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
  }, [selectedSpeciesId]);

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
    // setSelectedSpecies([]); 

    setSubspaces((prevSubspaces) => [
      ...prevSubspaces,
      {
        id: Date.now(),
        name: "",
        gpsPosition: "",
        dimensionUnit: "",
        shape: "",
        length: "",
        width: "",
        depth: "",
        area: "",
        volume: "",
        species: [],
        assignDevices: false,
        inheritDevices: false,
        deviceType: "",
        selectedDevice: "",
      },
    ]);
  };



  const handleOpenModal = (lote = null, mode = 'create') => {

  };

  // Cerrar el modal
  const closeModal = async () => {

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
    // setIsYesHeSelected(true);

  };

  const handleNoCheckboxChange = (index) => {
    setIsYesSelected(false);
    setIsYesHeSelected(false);
    setDisableSpecies(false);
    setDevicesList([]);
    setSubspaces((prevSubspaces) =>
      prevSubspaces.map((sub, i) => {
        if (i === index) {
          return {
            ...sub,
            inheritDevices: false, // Se marca "No" para heredar

          };
        }
        return sub;
      })
    );


  };


  const handleNoSubCheckboxChange = (index) => {
    setIsYesSubSelected(false);

  };

  const handleNoHerCheckboxChange = (index) => {
    setIsYesHeSelected(false);

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

  };


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
      prevSubspaces.map((sub, i) => {
        if (i === index) {
          switch (field) {
            case "inheritDevices":
              return {
                ...sub,
                inheritDevices: true,
                assignDevices: false,  // Desmarcar "Asignar dispositivos"
                deviceType: "",
                selectedDevice: "",
              };

            case "assignDevices":
              return {
                ...sub,
                assignDevices: true,
                inheritDevices: false, // Desmarcar "Heredar dispositivos"
              };

            case "noInheritDevices":  // Esta opción marca "No" para heredar dispositivos
              return {
                ...sub,
                inheritDevices: false, // Marcar "No"
                assignDevices: false,  // Asegurar que "Asignar dispositivos" también quede desmarcado
                deviceType: "",
                selectedDevice: "",
              };

            default:
              return sub;
          }
        }
        return sub;
      })
    );
  };

  let data = []
  const handleAddVariable = (e,type, index) => {
    e.preventDefault();
    console.log("selectedVariableId :::::::::", selectedVariables.main)
    data.push(selectedVariables.main)
    console.log(data)
    if (type === 'main') {
      data.push(selectedVariables.main)
      setSelectedVariables((prev) => ({
        ...prev,
        main: data, // Agrega nuevaVariable al arreglo main
      }));
      console.log("selectedVariables == ", selectedVariables);

    } else {
      // Agregar variable al subespacio correspondiente
      setSelectedVariables((prev) => {
        const updatedSubspaces = [...prev.subspaces];
        updatedSubspaces[index] = updatedSubspaces[index]
          ? [...updatedSubspaces[index], selectedVariableId]
          : [selectedVariableId];
        return { ...prev, subspaces: updatedSubspaces };
      });
    }
  };





  
  const handleVariableChangeForSubspace = (index, variable) => {
  };


  const handleChangeCategoryEspace = (event) => {
    const { value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      species: value,

    }));
    let valueSpecie = []
    valueSpecie.push(value)

    setEspecieEspasios(valueSpecie)
    console.log('arreglo de especies', especiesEspacio)
  };

  // const handleChangeCategory = (event, index) => {
  //   const { value } = event.target;
  //   console.log('especies subespacio event', event, 'index', index, 'value', value)
  //   setEspecieSubspasios(value);
  //   setFormData((prevFormData) => {
  //     const updatedSubspaces = [...prevFormData.subProductionSpaces];
  //     updatedSubspaces[index] = {
  //       ...updatedSubspaces[index],
  //       species: value,
  //     };
  //     let valueSpecie = []
  //     valueSpecie.push(value)

  //     setEspecieSubspasios(valueSpecie)
  //     console.log('arreglo de especies', especiesSubspacio)
  //     return {
  //       ...prevFormData,
  //       subProductionSpaces: updatedSubspaces,
  //     };
  //   });
  // };

  const handleChangeCategory = (event, index) => {
    const { value } = event.target;

    setSubspaces((prevSubspaces) => {
      const updatedSubspaces = [...prevSubspaces];

      // Asegurar que `species` sea un array
      updatedSubspaces[index] = {
        ...updatedSubspaces[index],
        species: Array.isArray(value) ? value : [value], // Asegurar que siempre sea un array
      };

      console.log("Subespacios actualizados:", updatedSubspaces);
      return updatedSubspaces;
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

  };


  const handleSpeciesChange = (index, specieId) => {
    // Actualizar el estado de la especie seleccionada para ese subespacio
    const newSelectedSpecies = { ...selectedSpecies, [index]: specieId };
    setSelectedSpecies(newSelectedSpecies);  // Esto actualizará el estado seleccionado
    if (index === 'main') {
      setSelectedSpeciesId(specieId);
    }
    // Resetear la variable seleccionada para ese subespacio
    setSelectedVariables((prev) => ({ ...prev, [index]: "" }));

    // Verificar el valor de specieId para saber si se está enviando correctamente
    console.log('specieId:', specieId);

    // Realizar la consulta para obtener las variables asociadas a la especie seleccionada
    const fetchVariablesForSubspace = async () => {
      try {
        const data = await SpeciesService.getVariableBySpecie({ species: { id: specieId } });
        console.log(data)
        if (index !== 0) {
          setMainVariables(data);
        }

        setVariablesBySubspace((prev) => ({
          ...prev,
          [index]: data.statusCode === 404 ? [] : data,  // Si no hay datos, usar arreglo vacío
        }));
      } catch (error) {
        console.error(`Error fetching variables for subspace ${index}:`, error);
        setVariablesBySubspace((prev) => ({
          ...prev,
          [index]: [],  // Manejar el error y poner un arreglo vacío en ese subespacio
        }));
      }
    };

    // Si hay un ID de especie, realizar la consulta
    if (specieId) fetchVariablesForSubspace();
  };

  let datosVariables = []
  const handleVariableChange = (e, space, variableId) => {
    e.preventDefault()
    if (space === "main") {
      datosVariables.push(variableId)
      setSelectedVariables((prev) => ({
        ...prev,
        main: datosVariables,
      }));
    } else {
      setSelectedVariables((prev) => ({
        ...prev,
        subspaces: {
          ...prev.subspaces,
          [space]: variableId,
        },
      }));
    }
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

  };


  const handleMedicionControl = (variable) => {
    setIsModalOpen(true)
  };

  return (
    <form className="">
      <div className="container mx-auto p-2">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-semibold mb-6">Crear Lista de Especies</h2>

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
                    type="numtextber"
                    id="gpsPosition"
                    name="gpsPosition"
                    value={formData.gpsPosition || ''}
                    onChange={handleChange}
                    placeholder="Link de posición GPS"
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
                    <option value="" className="text-gray-300">Selecciona una opción</option>
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
                    type="text"
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
                  <div className="mb-4 justify justify-end">
                    <button
                      type="button"
                      onClick={handleAddSubspaceClick}
                      // disabled={disableSpecies}
                      className="inline-flex justify-end rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#137B09FF] text-white hover:bg-[#168C0DFF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#168C0DFF]">
                      Añadir Subespacio
                    </button>
                  </div>

                  <div className="w-full grid grid-cols-1 gap-4 ">
                    {subspaces.length > 0 && subspaces.map((subspace, index) => (
                      <div key={subspace.id} className="w-full border rounded-md p-4 mb-2">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-lg">{`Subespacio ${index + 1}`}</h3>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleExpandSubspace(subspace.id)}
                              className="text-gray-300"
                            >
                              {expandedSubspace === subspace.id ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                            <button
                              onClick={() => handleRemoveSubspace(subspace.id)}
                              className="text-red-300"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </div>
                        {expandedSubspace === subspace.id && (
                          <div className="w-full grid grid-cols-2 gap-4 mt-5">
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
                                type="text"
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

                            <div className="mb-2 w-full">
                              <label htmlFor={`species-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                Especies para el Subespacio {index + 1}
                              </label>
                              <FormControl fullWidth> 
                                <Select
                                  multiple
                                  id={`species-${index}`}
                                  value={subspaces[index]?.species || []} // Usar el estado `subspaces`
                                  onChange={(event) => handleChangeCategory(event, index)}
                                  renderValue={(selectedIds) =>
                                    species
                                      .filter((option) => selectedIds.includes(option.id))
                                      .map((option) => option.common_name)
                                      .join(", ")
                                  }
                                >
                                  {species.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                      <Checkbox checked={subspaces[index]?.species?.includes(option.id)} />
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
                <div className='border border-gray-400 rounded-md shadow shadow-gray-400 p-4'>
                  <h2>Espacio</h2>

                  <label>¿Necesitas asignar dispositivos?</label>
                  <div className="flex items-center justify-between mt-4">
                    {/* Contenedor de los botones de radio a la izquierda */}
                    <div className="flex items-center space-x-4">
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

                    {/* Botón a la derecha */}
                    {isYesSelected && (
                      <div className="ml-auto flex justify-end p-2">
                        <button
                          type="button"
                          onClick={handleAddDevice}
                          className="mt-4 bg-white border border-[#168C0DFF] text-[#168C0DFF] px-4 py-2 rounded flex items-center gap-2"
                        >
                          <FiPlusCircle />
                          Añadir más
                        </button>
                      </div>
                    )}
                  </div>


                  <div>
                    {devicesList.map((device, index) => (
                      <div key={index} className="flex space-x-4 mt-6 ">
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

                            {/* Opción para asignar dispositivos */}
                            <div className="mb-4">
                              <label>¿Necesitas asignar dispositivos?</label>
                              <div className="flex items-center space-x-4 mt-2">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`assignDevices-${index}`} // Agrupar radio buttons por subespacio
                                    checked={subspace.assignDevices}
                                    onChange={() => handleSubspaceCheckboxChange(index, "assignDevices")}
                                    className="hidden"
                                  />
                                  <span
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${subspace.assignDevices ? "bg-green-500 border-green-500" : "border-gray-400"
                                      }`}
                                  >
                                    {subspace.assignDevices && <span className="w-3 h-3 bg-white rounded-full"></span>}
                                  </span>
                                  <span className="text-sm font-medium">Sí</span>
                                </label>

                                <label className="flex items-center space-x-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`assignDevices-${index}`} // Mismo name para que solo se seleccione uno
                                    checked={!subspace.assignDevices}
                                    onChange={() => handleSubspaceCheckboxChange(index, "assignDevices")}
                                    className="hidden"
                                  />
                                  <span
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!subspace.assignDevices ? "bg-white border-[#168C0DFF]" : "border-gray-400"
                                      }`}
                                  >
                                    {!subspace.assignDevices && <span className="w-3 h-3 bg-[#168C0DFF] rounded-full"></span>}
                                  </span>
                                  <span className="text-sm font-medium">No</span>
                                </label>
                              </div>
                            </div>

                            {/* Opción para heredar dispositivos */}
                            <div className="mb-4">
                              <label>Heredar dispositivos</label>
                              <div className="flex items-center space-x-4 mt-2">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`inheritDevices-${index}`} // Agrupar radio buttons por subespacio
                                    checked={subspace.inheritDevices}
                                    onChange={() => handleSubspaceCheckboxChange(index, "inheritDevices")}
                                    className="hidden"
                                  />
                                  <span
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${subspace.inheritDevices ? "bg-green-500 border-green-500" : "border-gray-400"
                                      }`}
                                  >
                                    {subspace.inheritDevices && <span className="w-3 h-3 bg-white rounded-full"></span>}
                                  </span>
                                  <span className="text-sm font-medium">Sí</span>
                                </label>

                                <label className="flex items-center space-x-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`inheritDevices-${index}`} // Mismo name para que solo se seleccione uno
                                    checked={!subspace.inheritDevices}
                                    onChange={() => handleSubspaceCheckboxChange(index, "noInheritDevices")}
                                    className="hidden"
                                  />
                                  <span
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!subspace.inheritDevices ? "bg-white border-[#168C0DFF]" : "border-gray-400"
                                      }`}
                                  >
                                    {!subspace.inheritDevices && <span className="w-3 h-3 bg-[#168C0DFF] rounded-full"></span>}
                                  </span>
                                  <span className="text-sm font-medium">No</span>
                                </label>
                              </div>
                            </div>

                            {/* Tipo de dispositivo */}
                            <div className="mb-2">
                              <label className="block text-sm font-medium">Tipo de dispositivo:</label>
                              <select
                                value={subspace.deviceType}
                                onChange={(e) => handleSubspaceDeviceTypeChange(index, e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                                disabled={!subspace.assignDevices || subspace.inheritDevices}
                              >
                                <option value="">Seleccione un tipo</option>
                                <option value="actuador">Actuador</option>
                                <option value="sensor">Sensor</option>
                              </select>
                            </div>

                            {/* Nombre del dispositivo */}
                            <div className="mb-2">
                              <label className="block text-sm font-medium">Nombre del dispositivo:</label>
                              <select
                                value={subspace.selectedDevice}
                                onChange={(e) => handleSubspaceDeviceChange(index, e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                                disabled={!subspace.assignDevices || subspace.inheritDevices || !subspace.deviceType}
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
                      onChange={(e) => handleSpeciesChange("main", e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm"
                    >
                      <option value="" className="text-gray-500">
                        Selecciona una opción
                      </option>
                      {species
                        ?.filter((sub) => (especiesEspacio.flat()).includes(sub.id)) // Convertir en array plano
                        .map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.common_name}
                          </option>
                        ))}
                    </select>


                    {/* Selector de variables para especie principal */}
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
                        onChange={(e) => handleVariableChange(e, "main", e.target.value)}
                        value={selectedVariables["main"] || ""}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm"
                      >
                        <option value="" className="text-gray-500">
                          Selecciona una variable
                        </option>
                        {mainVariables.length > 0 &&
                          mainVariables.map((variable, index) => (
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
                        onClick={(e) => handleAddVariable(e, 'main')} // Pasar 'main' como tipo
                        className="mt-4 bg-white border border-[#168C0DFF] text-[#168C0DFF] px-4 py-2 rounded flex items-center gap-2"
                      >
                        <FiPlusCircle />
                        Añadir Variable
                      </button>
                    </div>
                  )}
                  {selectedVariables.main.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-medium">Variables del Espacio:</h3>
                      <div className="mt-2 grid grid-cols-1 gap-2">
                        {Array.isArray(selectedVariables.main) &&
                          selectedVariables.main.map((variable, index) => (
                            <div
                              key={index}
                              className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md"
                            >
                              <div className="flex justify-between items-center">
                                <span>{variable.name || variable}</span>
                                <button
                                  type="button"
                                  onClick={() => handleMedicionControl(variable)}
                                  className="ml-4 px-4 py-2 bg-[#168C0DFF] text-white rounded-md shadow-md hover:bg-green-800"
                                >
                                  Medición y Control
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
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



                </div>
                <div className='p-3'>
                  {subspaces.map((subspace, index) => (
                    <div
                      key={index}
                      className="border border-gray-400 rounded-md shadow shadow-gray-400 p-4"
                    >
                      <h3>Subespacio {index + 1}</h3>
                      {/* Selección de especie */}
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
                          onChange={(e) => handleSpeciesChange(index, e.target.value)}
                          value={selectedSpecies[index] || ""}
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

                        {/* Selección de variables */}
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
                            onChange={(e) => handleVariableChange(e, index, e.target.value)}
                            value={selectedVariables.subspaces[index] || ""}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm"
                          >
                            <option value="" className="text-gray-500">
                              Selecciona una variable
                            </option>
                            {(variablesBySubspace[index] || []).map((variable, varIndex) => (
                              <option key={varIndex} value={variable.id}>
                                {variable.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Botón para añadir la variable seleccionada */}
                        {selectedVariables.subspaces[index] && (
                          <button
                            type="button"
                            onClick={() => handleAddVariable(index)}
                            className="mt-4 bg-white border border-[#168C0DFF] text-[#168C0DFF] px-4 py-2 rounded flex items-center gap-2"
                          >
                            <FiPlusCircle />
                            Añadir Variable
                          </button>
                        )}

                        {subspaces.map((subspace, index) => (
                          <div key={index} className="border border-gray-400 rounded-md shadow shadow-gray-400 p-4">
                            <h3>Subespacio {index + 1}</h3>

                            {/* Mostrar variables seleccionadas para cada subespacio */}
                            {Array.isArray(selectedVariables.subspaces[index]) && selectedVariables.subspaces[index].length > 0 && (
                              <div className="mt-6">
                                <h3 className="text-lg font-medium">Variables del Subespacio:</h3>
                                <div className="mt-2 grid grid-cols-1 gap-2">
                                  {selectedVariables.subspaces[index].map((variable, varIndex) => (
                                    <div
                                      key={varIndex}
                                      className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md"
                                    >
                                      <div className="flex justify-between items-center">
                                        <span>{variable.name || variable}</span>
                                        <button
                                          type="button"
                                          onClick={() => handleMedicionControl(variable)}
                                          className="ml-4 px-4 py-2 bg-[#168C0DFF] text-white rounded-md shadow-md hover:bg-green-800"
                                        >
                                          Medición y Control
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          </div>
                        ))}


                      </div>
                    </div>
                  ))}
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
