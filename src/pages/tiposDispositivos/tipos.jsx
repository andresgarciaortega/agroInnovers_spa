import { ChevronDown, ChevronUp } from "lucide-react";
import { IoIosWarning, IoIosSearch } from "react-icons/io";
import React, { useEffect, useState } from "react";
import { Edit, Trash, Eye } from "lucide-react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import TypeService from "../../services/TypeDispositivosService";
import Delete from '../../components/delete';
import SuccessAlert from "../../components/alerts/success";

import GenericModal from '../../components/genericModal';
import FormSensor from './componets/FormSensor';
import FormViewSensor from './componets/formViewSensor';
import FormActuador from './componets/FormActuador';
import FormViewActuador from './componets/formViewActuador';
import { ImEqualizer2 } from "react-icons/im";
import CompanySelector from "../../components/shared/companySelect";
import { useCompanyContext } from "../../context/CompanyContext";
import { FaMicrochip } from "react-icons/fa6";

const Tipos = () => {
  const { selectedCompanyUniversal, hiddenSelect } = useCompanyContext();

  const [expandedSection, setExpandedSection] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);

  const [selectedCompany, setSelectedCompany] = useState('');
  const [searchcompanyTerm, setSearchCompanyTerm] = useState("");
  const [nameCompany, setNameCompany] = useState("");
  const [showErrorVariableAlert, setShowErrorVariableAlert] = useState(false);

  const [sensorList, setSensorList] = useState([]);
  const [currentPageSensor, setCurrentPageSensor] = useState(1);
  const [itemsPerPageSensor, setItemsPerPageSensor] = useState(5);
  const [isModalOpenSensor, setIsModalOpenSensor] = useState(false);
  const [isModalOpenSensorView, setIsModalOpenSensorView] = useState(false);
  const [modalModeSensor, setModalModeSensor] = useState("create");
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [messageAlertDelete, setMessageAlertDelete] = useState("");
  // const [searchQuery, setSearchQuery] = useState('');

  const [selectedVariable, setSelectedVariable] = useState(null);
  const [messageAlert, setMessageAlert] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showErrorAlertTable, setShowErrorAlertTable] = useState(false);

  const [actuadorList, setActuadorList] = useState([]);
  const [currentPageActuador, setCurrentPageActuador] = useState(1);
  const [itemsPerPageActuador, setItemsPerPageActuador] = useState(5);
  const [isModalOpenActuador, setIsModalOpenActuador] = useState(false);
  const [isModalOpenActuadorView, setIsModalOpenActuadorView] = useState(false);
  const [modalModeActuador, setModalModeActuador] = useState("create");
  const [selectedActuador, setSelectedActuador] = useState(null);
  const [isDeleteModalOpenActuador, setIsDeleteModalOpenActuador] = useState(false);
  // const [messageAlertDelete, setMessageAlertDelete] = useState("");

  // const [selectedActuador, setSelectedActuador] = useState(null);
  const [messageAlertActuador, setMessageAlertActuador] = useState("");
  const [showErrorAlertActuador, setShowErrorAlertActuador] = useState(false);
  const [showErrorAlertTableActuador, setShowErrorAlertTableActuador] = useState(false);


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
    calibrationPoints: [
      { value: '', normalResponse: '' }
    ],


  });
  const [newActuador, setNewActuador] = useState({
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
    // company_id: companySeleector.value || ''
    calibrationPoints: [
      { value: '', normalResponse: '' }
    ],


  });
  useEffect(() => {
    hiddenSelect(false)
    const fetchSensor = async () => {
      try {
        // Verifica si selectedCompanyUniversal es nulo o si no tiene valor
        const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : ''; // Si no hay empresa seleccionada, se pasa un string vacío

        // Verifica si companyId no es vacío antes de hacer la llamada
        if (!companyId) {
          setSensorList([]); // Asegúrate de vaciar la lista si no hay empresa seleccionada
          return;
        } else {
          setNameCompany(selectedCompanyUniversal.label)
        }

        const data = await TypeService.getAllSensor();

        // Verifica si la respuesta es válida y si contiene datos
        if (data.statusCode === 404) {
          setSensorList([]);
        } else {
          setShowErrorAlertTable(false);
          setSensorList(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error fetching type variables:', error);
        setSensorList([]); // Vaciar la lista en caso de error
        setMessageAlert('Esta empresa no tiene variables registradas, Intentalo con otra empresa');
        setShowErrorAlertTable(true);
      }
    };
    fetchSensor();
  }, []);

  useEffect(() => {
    const fetchActuadores = async () => {
      try {
        // Verifica si selectedCompanyUniversal es nulo o si no tiene valor
        const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : ''; // Si no hay empresa seleccionada, se pasa un string vacío

        // Verifica si companyId no es vacío antes de hacer la llamada
        if (!companyId) {
          setActuadorList([]); // Asegúrate de vaciar la lista si no hay empresa seleccionada
          return;
        } else {
          setNameCompany(selectedCompanyUniversal.label)
        }

        const data = await TypeService.getAllActuador();

        // Verifica si la respuesta es válida y si contiene datos
        if (data.statusCode === 404) {
          setActuadorList([]);
        } else {
          setShowErrorAlertTable(false);
          setActuadorList(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error fetching type actaudor:', error);
        setActuadorList([]); // Vaciar la lista en caso de error
        setMessageAlert('Esta empresa no tiene actuadores registradas, Intentalo con otra empresa');
        setShowErrorAlertTable(true);
      }
    };

    fetchActuadores();
  }, []);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const [searchQuery, setSearchQuery] = useState('');

  // buscar sensor
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase()); // Convertimos a minúsculas para hacer la búsqueda insensible al caso
  };


  const filteredSensorList = sensorList.filter((sensor) => {
    return (
      sensor.commercialName.toLowerCase().includes(searchQuery) ||
      sensor.sensorTypeName.toLowerCase().includes(searchQuery) ||
      sensor.model.toLowerCase().includes(searchQuery) ||
      sensor.brand.toLowerCase().includes(searchQuery)
    );
  });

  // Paginación de sensores
  const indexOfLastSensor = currentPageSensor * itemsPerPageSensor;
  const indexOfFirstSensor = indexOfLastSensor - itemsPerPageSensor;
  const currentSensorList = filteredSensorList.slice(indexOfFirstSensor, indexOfLastSensor);

  const handleNextPageSensor = () => {
    if (currentPageSensor < Math.ceil(filteredSensorList.length / itemsPerPageSensor)) {
      setCurrentPageSensor(currentPageSensor + 1);
    }
  };
  const handlePrevPageSensor = () => {
    if (currentPageSensor > 1) {
      setCurrentPageSensor(currentPageSensor - 1);
    }
  };

  const handleOpenModalSensor = (sensor = null, mode = 'create') => {
    setSelectedSensor(sensor);
    setModalModeSensor(mode);
    if (mode === 'edit' || mode === 'view') {
      setFormData(sensor);
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
        calibrationPoints: [],

      });
    }
    if (mode === 'view') {
      setIsModalOpenSensorView(true);

    } else {
      setIsModalOpenSensor(true);
    }
  };

  // Cerrar el modal
  const closeModalSensor = async () => {
    setIsModalOpenSensor(false);
    setIsModalOpenSensorView(false);

    setSelectedSensor(null);
    setModalModeSensor('create');
    updateServiceSensor();
  };

  const handleDelete = (Sensor) => {
    setSelectedSensor(Sensor);
    setIsDeleteModalOpen(true);
  };

  const showErrorAlertSuccess = (message) => {
    setShowErrorAlert(true)
    setMessageAlert(`${message} exitosamente`);

    setTimeout(() => {
      setShowErrorAlert(false)
    }, 2500);
  }

  const handleConfirmDeleteSensor = async () => {
    setIsDeleteModalOpen(false);
    try {
      setSelectedSensor(null);
      const data = await TypeService.deleteSensor(selectedSensor.id);
      setMessageAlert("Sensor eliminada exitosamente");
      showErrorAlertSuccess("eliminado");

      updateServiceSensor();
    } catch (error) {
      if (error.statusCode === 400 && error.message.includes("ya está asociada")) {
        setMessageAlert(`${message} exitosamente`);
        (error.message);
        setShowErrorVariableAlert(true);
      } else {
        setMessageAlert(`${message} exitosamente`);
        ("No se puede eliminar el tipo de sensor  porque está asociada a uno o más sensores");
        setShowErrorAlert(true);
      }
      console.error("Error al eliminar el tipo de sensor :", error);
    }
  };


  const handleCancelDeleteSensor = () => {
    setSelectedSensor(null);
    setIsDeleteModalOpen(false);
  };
  const handleCloseAlert = () => {
    setShowErrorAlert(false);
  };

  const updateServiceSensor = async () => {
    setShowErrorAlertTable(false);
    const fetchSensor = async () => {
      try {
        const data = await TypeService.getAllSensor();
        console.log("Respuesta de sensores:", data);
        if (Array.isArray(data)) {
          setSensorList(data);
        } else {
          console.error("Formato de datos inesperado sensor", data);
        }
      } catch (error) {
        console.error("Error al traer los sensor:", error);
      }
    };

    fetchSensor();

  };



  const handleSearchClick = () => {
    setSearchVisible(!searchVisible); // Cambiar la visibilidad del campo de búsqueda
  };
  const renderSensorTabla = () => (
    <div>




      <div className="flex items-center justify-end mb-3 m-3">
        <div className="flex items-center">
          <button
            onClick={handleSearchClick} // Mostrar/ocultar el campo de búsqueda
            className="flex items-center bg-gray-100 border border-[#168C0DFF] text-gray-700 px-4 py-2 rounded-lg mr-4 hover:bg-gray-200"
          >
            <IoIosSearch size={18} className="text-[#168C0DFF]" />
          </button>
          {searchVisible && (

            <input
              onChange={handleSearchChange}
              type="text"
              placeholder="Buscar..."
              className="w-full p-2 border rounded-md ml-2"
            />
          )}
        </div>

        <div className="ml-4">
          <button
            onClick={() => handleOpenModalSensor()} // Abre el modal en modo 'create'
            className="bg-[#168C0DFF] text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Crear Tipo Sensor
          </button>

        </div>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre Comercial</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo de Sensor</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modelo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marca</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentSensorList.map((sensor, index) => (
            <tr key={index}>
              <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center space-x-2">
                {sensor.icon && (
                  <img
                    src={sensor.icon}
                    alt={sensor.commercialName}
                    className="h-10 w-10 object-cover rounded-full"
                  />
                )}
                <span>{sensor.commercialName}</span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{sensor.sensorTypeName}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{sensor.model}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{sensor.brand}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleOpenModalSensor(sensor, 'view')}>
                  <Eye size={18} />
                </button>
                <button className="text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleOpenModalSensor(sensor, 'edit')}>
                  <Edit size={18} />
                </button>
                <button className="text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleDelete(sensor)}>
                  <Trash size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center py-2 justify-between border border-gray-200 p-2 rounded-md bg-white">
        <div className="pagination-info text-sm flex items-center space-x-2">
          <span>Cantidad de filas</span>
          <select className="border border-gray-200 rounded py-2 text-sm m-2"
            value={itemsPerPageSensor}
            onChange={(e) => setItemsPerPageSensor(Number(e.target.value))}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
        <div className="pagination-controls text-xs flex items-center space-x-2">
          <span>{indexOfFirstSensor + 1}-{indexOfLastSensor} de {filteredSensorList.length}</span>
          <button
            onClick={handlePrevPageSensor}
            disabled={currentPageSensor === 1}
            className="mr-2 border border-gray-200 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <IoIosArrowBack size={20} />
          </button>
          <button onClick={handleNextPageSensor}
            disabled={currentPageSensor === Math.ceil(filteredSensorList.length / itemsPerPageSensor)}
            className="border border-gray-200 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <IoIosArrowForward size={20} />
          </button>
        </div>
      </div>

      {/* Modaeliminación */}
      {isDeleteModalOpen && (
        <Delete
          message={`¿Seguro que desea eliminar el sensor ${selectedSensor?.commercialName}?`}
          onCancel={handleCancelDeleteSensor}
          onConfirm={handleConfirmDeleteSensor}
        />
      )}

      {/* modal */}
      {isModalOpenSensor && (
        <GenericModal onClose={closeModalSensor}
          title={modalModeSensor === 'edit' ? 'Editar Tipo sensor' : modalModeSensor === 'view' ? 'Ver Tipo sensor' : 'Añadir Tipo Sensor'}>
          <FormSensor
            onUpdate={updateServiceSensor}
            sensor={formData}
            showErrorAlert={showErrorAlertSuccess}
            setFormData={setFormData}
            onClose={closeModalSensor}  // <- Esto ya está correcto
            mode={modalModeSensor} // Para diferenciar el modo de vista
          />
        </GenericModal>
      )}

      {/* modal visualizar */}
      {isModalOpenSensorView && (
        <GenericModal
          // openModal={handleOpenModal}
          title={modalModeSensor === 'edit' ? 'Editar Sensor' : modalModeSensor === 'view' ? 'Ver sensor' : 'Añadir Sensor'}
          onClose={closeModalSensor}

          companyId={selectedCompany} >

          <FormViewSensor showErrorAlert={showErrorAlertSuccess} onUpdate={updateServiceSensor} sensor={formData} mode={modalModeSensor} closeModal={closeModalSensor} />
        </GenericModal>
      )}

      {showErrorAlert && (
        <SuccessAlert
          message={messageAlert}
          onCancel={handleCloseAlert}
        />
      )}

    </div>
  );

  // buscar actuador 
  const [searchQueryAct, setSearchQueryAct] = useState('');


  const handleSearchChangeAct = (e) => {
    setSearchQueryAct(e.target.value.toLowerCase()); // Convertimos a minúsculas para hacer la búsqueda insensible al caso
  };


  const filteredActuadorList = actuadorList.filter((actuador) => {
    return (
      actuador.commercialName.toLowerCase().includes(searchQueryAct) ||
      actuador.actuatorTypeName.toLowerCase().includes(searchQueryAct) ||
      actuador.model.toLowerCase().includes(searchQueryAct) ||
      actuador.brand.toLowerCase().includes(searchQueryAct)
    );
  });

  // Paginación de actuadores
  const indexOfLastActuador = currentPageActuador * itemsPerPageActuador;
  const indexOfFirstActuador = indexOfLastActuador - itemsPerPageActuador;
  const currentActuadorList = filteredActuadorList.slice(indexOfFirstActuador, indexOfLastActuador);

  const handleNextPageActuador = () => {
    if (currentPageActuador < Math.ceil(filteredActuadorList.length / itemsPerPageActuador)) {
      setCurrentPageActuador(currentPageActuador + 1);
    }
  };
  const handlePrevPageActuador = () => {
    if (currentPageActuador > 1) {
      setCurrentPageActuador(currentPageActuador - 1);
    }
  };
  const handleOpenModalActuador = (actuador = null, mode = 'create') => {
    setSelectedActuador(actuador);
    setModalModeActuador(mode);
    if (mode === 'edit' || mode === 'view') {
      setNewActuador(actuador);
    } else {
      setNewActuador({
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
        // company_id: companySeleector.value || ''
        // ,
        calibrationPoints: [],

      });
    }
    if (mode === 'view') {
      setIsModalOpenActuadorView(true);

    } else {
      setIsModalOpenActuador(true);
    }
  };

  // Cerrar el modal
  const closeModalActuador = async () => {
    setIsModalOpenActuador(false);
    setIsModalOpenActuadorView(false);

    setSelectedActuador(null);
    setModalModeActuador('create');
    updateServiceActuador();
  };

  const handleDeleteActuador = (Actuador) => {
    setSelectedActuador(Actuador);
    setIsDeleteModalOpen(true);
  };

  const showErrorAlertSuccessActuador = (message) => {
    setShowErrorAlert(true)
    setMessageAlert(`${message} exitosamente`);

    setTimeout(() => {
      setShowErrorAlert(false)
    }, 2500);
  }

  const handleConfirmDeleteActuador = async () => {
    setIsDeleteModalOpen(false);
    try {
      setSelectedActuador(null);
      const data = await TypeService.deleteActuador(selectedActuador.id);
      setMessageAlert("Actuador eliminada exitosamente");
      showErrorAlertSuccess("eliminado");

      updateServiceActuador();
    } catch (error) {
      if (error.statusCode === 400 && error.message.includes("ya está asociada")) {
        setMessageAlert(`${message} exitosamente`);
        (error.message);
        setShowErrorVariableAlert(true);
      } else {
        setMessageAlert(`${message} exitosamente`);
        ("No se puede eliminar el tipo de actuador  porque está asociada a uno o más actuadores");
        setShowErrorAlert(true);
      }
      console.error("Error al eliminar el tipo de actuador :", error);
    }
  };


  const handleCancelDeleteActuador = () => {
    setSelectedActuador(null);
    setIsDeleteModalOpen(false);
  };
  const handleCloseAlertActuador = () => {
    setShowErrorAlert(false);
  };

  const updateServiceActuador = async () => {
    setShowErrorAlertTable(false);
    const fetchActuador = async () => {
      try {
        const data = await TypeService.getAllActuador();
        console.log("Respuesta de actuadores:", data);
        if (Array.isArray(data)) {
          setActuadorList(data);
        } else {
          console.error("Formato de datos inesperado actuador", data);
        }
      } catch (error) {
        console.error("Error al traer los actuador:", error);
      }
    };

    fetchActuador();

  };


  const renderActuadorTabla = () => (
    <div>
      <div className="flex items-center justify-end mb-5 mt-2 m-3">
        <div className="relative flex items-center mr-4 w-full max-w-[400px]">
          <input
            onChange={handleSearchChangeAct}
            type="text"
            placeholder="Buscar..."
            className="w-full px-4 py-2 pl-10 border border-gray-400 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <IoIosSearch size={18} className="absolute left-3 text-gray-400" />
        </div>

        <button className="bg-[#168C0DFF] text-white px-4 py-2 rounded-lg hover:bg-green-700"
          onClick={() => handleOpenModalActuador()}>
          Crear Tipo Actuador
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-200 ">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre Comercial</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo de Actuador</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modelo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marca</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentActuadorList.map((actuador, index) => (
            <tr key={index}>
              <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center space-x-2">
                {actuador.icon && (
                  <img
                    src={actuador.icon}
                    alt={actuador.commercialName}
                    className="h-10 w-10 object-cover rounded-full"
                  />
                )}
                <span>{actuador.commercialName}</span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{actuador.actuatorTypeName}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{actuador.model}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{actuador.brand}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleOpenModalActuador(actuador, 'view')}>
                  <Eye size={18} />
                </button>
                <button className="text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleOpenModalActuador(actuador, 'edit')}>
                  <Edit size={18} />
                </button>
                <button className="text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleDeleteActuador(actuador)}>
                  <Trash size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center py-2 justify-between border border-gray-200 p-2 rounded-md bg-white">
        <div className="pagination-info text-sm flex items-center space-x-2">
          <span>Cantidad de filas</span>
          <select className="border border-gray-200 rounded py-2 text-sm m-2"
            value={itemsPerPageActuador}
            onChange={(e) => setItemsPerPageActuador(Number(e.target.value))}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
        <div className="pagination-controls text-xs flex items-center space-x-2">
          <span>{indexOfFirstActuador + 1}-{indexOfLastActuador} de {filteredActuadorList.length}</span>
          <button
            onClick={handlePrevPageActuador}
            disabled={currentPageActuador === 1}
            className="mr-2 border border-gray-200 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <IoIosArrowBack size={20} />
          </button>
          <button onClick={handleNextPageActuador}
            disabled={currentPageActuador === Math.ceil(filteredActuadorList.length / itemsPerPageActuador)}
            className="border border-gray-200 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <IoIosArrowForward size={20} />
          </button>
        </div>
      </div>

      {/* Modaeliminación */}
      {isDeleteModalOpen && (
        <Delete
          message={`¿Seguro que desea eliminar el actuador ${selectedActuador?.commercialName}?`}
          onCancel={handleCancelDeleteActuador}
          onConfirm={handleConfirmDeleteActuador}
        />
      )}

      {/* modal */}
      {isModalOpenActuador && (
        <GenericModal onClose={closeModalActuador}
          title={modalModeActuador === 'edit' ? 'Editar Tipo actuador' : modalModeActuador === 'view' ? 'Ver Tipo actuador' : 'Añadir Tipo Actuador'}>
          <FormActuador
            onUpdate={updateServiceActuador}
            actuador={newActuador}
            showErrorAlert={showErrorAlertSuccess}
            setFormData={newActuador}
            onClose={closeModalActuador}  // <- Esto ya está correcto
            mode={modalModeActuador} // Para diferenciar el modo de vista
          />
        </GenericModal>
      )}

      {/* modal visualizar */}
      {isModalOpenActuadorView && (
        <GenericModal
          // openModal={handleOpenModal}
          title={modalModeActuador === 'edit' ? 'Editar Actuador' : modalModeActuador === 'view' ? 'Ver actuador' : 'Añadir Actuador'}
          onClose={closeModalActuador}

          companyId={selectedCompany} >

          <FormViewActuador showErrorAlert={showErrorAlertSuccess} onUpdate={updateServiceActuador} actuador={newActuador} mode={modalModeActuador} closeModal={closeModalActuador} />
        </GenericModal>
      )}

      {showErrorAlert && (
        <SuccessAlert
          message={messageAlert}
          onCancel={handleCloseAlert}
        />
      )}

    </div>
  );

  return (
    <div className="space-y-4 ">

      <div className="">
        <div className="flex items-center space-x-2 text-gray-700">
          <FaMicrochip size={20} /> {/* Ícono de Gestión de Variables */}
          <span>Tipos de Dispositivos</span>
          <span className="text-black font-bold"> </span>
          {selectedCompany && (
            <span>{companyList.find(company => company.id === selectedCompany)?.name}</span>
          )}
        </div>
      </div>

      <div className="shadow-lg shadow-gray-400 rounded-lg">
        <button
          onClick={() => toggleSection("sensores")}
          className={`w-full px-6 py-5 flex justify-between items-center rounded-lg ${expandedSection === "sensores" ? "bg-green-800 text-white" : "bg-gray-50 text-gray-700"}`}
        >
          Tipo de Sensores
          {expandedSection === "sensores" ? <ChevronUp /> : <ChevronDown />}
        </button>
        {expandedSection === "sensores" && renderSensorTabla()}
      </div>
      <div className="shadow-lg shadow-gray-400 rounded-lg">
        <button
          onClick={() => toggleSection("espacios")}
          className={`w-full px-6 py-5 flex justify-between items-center rounded-lg ${expandedSection === "espacios" ? "bg-green-800 text-white" : "bg-gray-50 text-gray-700"}`}
        >
          Tipo de Actuadores
          {expandedSection === "espacios" ? <ChevronUp /> : <ChevronDown />}
        </button>
        {expandedSection === "espacios" && renderActuadorTabla()}
      </div>
    </div>

  );
};

export default Tipos;
