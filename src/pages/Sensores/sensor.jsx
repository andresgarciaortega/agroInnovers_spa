import React, { useEffect, useState } from "react";
import { Edit, Trash, Eye, Plus } from 'lucide-react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoIosWarning } from 'react-icons/io';
import { FaFilter, FaLock } from 'react-icons/fa'; // Nuevos íconos añadidos
import Delete from '../../components/delete';
import GenericModal from '../../components/genericModal';
import TypeService from "../../services/TypeDispositivosService";
import { ImEqualizer } from "react-icons/im";
import FormSensor from './components/formSensor';
import FormMantenimientoSensor from './components/formMantenimiento';
import FormCalibrarSensor from './components/formCalibracion';
import FormViewSensor from './components/FormViewSensor';
import SensorService from "../../services/SensorService";
import CompanyService from "../../services/CompanyService";
import SuccessAlert from "../../components/alerts/success";
import { IoSearch } from "react-icons/io5";
import { TbSettingsCog } from "react-icons/tb";
import { Tooltip } from 'react-tooltip';
import { ImEqualizer2 } from "react-icons/im";


import Select from "react-select";
import CompanySelector from "../../components/shared/companySelect";
import { useCompanyContext } from "../../context/CompanyContext";
import { getDecodedToken } from "../../utils/auseAuth";
import ErrorAlert from "../../components/alerts/error";
import LoadingView from "../../components/Loading/loadingView";

const Sensor = () => {
  const [idcompanyLST, setIdcompanyLST] = useState(JSON.parse(localStorage.getItem('selectedCompany')));

  const [companyList, setCompanyList] = useState([]);
  const [sensorId, setSensorId] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [searchcompanyTerm, setSearchCompanyTerm] = useState("");
  const { selectedCompanyUniversal, hiddenSelect } = useCompanyContext();

  const [variableList, setVariableList] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenView, setIsModalOpenView] = useState(false);
  const [isModalOpenMante, setIdModalOpenMante] = useState(false);
  const [isModalOpenCali, setIsModalOpenCali] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [messageAlert, setMessageAlert] = useState("");
  const [nameCompany, setNameCompany] = useState(idcompanyLST.label);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showErrorAlertTable, setShowErrorAlertTable] = useState(false);
  const [newVariable, setNewVariable] = useState({
    sensorCode: '',
    // icon: '',
    gpsPosition: '',
    inputPort: '',
    readingPort: '',
    description: '',
    accessUsername: '',
    accessPassword: '',
    installationDate: '',
    estimatedChangeDate: '',
    sensorTypeId: 0,
  });
  const [alertSelecte, setAlertSelecte] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    hiddenSelect(true)
    const fetchCompanies = async () => {
      try {
        const data = await CompanyService.getAllCompany();
        setCompanyList(data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);



  useEffect(() => {
    setIsLoading(true)
    const fetchSensores = async () => {

      const decodedToken = await getDecodedToken();
      setUserRoles(decodedToken.roles?.map(role => role.name) || []);

      const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : idcompanyLST.value;
      if (!companyId) {
        setVariableList([]);
        return;
      }


      try {
        const data = await SensorService.getAllSensor(companyId, {}); // Servicio que filtra por empresa
        if (data?.length === 0) {
          setVariableList([]);
          setIsLoading(false)

          setMessageAlert('Esta empresa no tiene sensores registrados.');
          setShowErrorAlertTable(true);
        } else {
          setVariableList(Array.isArray(data) ? data : []);
          setShowErrorAlertTable(false);
          setIsLoading(false)

        }
      } catch (error) {
        console.error('Error fetching sensores:', error);
        setVariableList([]);
        setIsLoading(false)

        setMessageAlert('Error al cargar los sensores.');
        setShowErrorAlertTable(true);
      }
    };

    fetchSensores();
  }, [selectedCompanyUniversal], {});


  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption ? selectedOption.value : null);
  };

  const handleSearchChange = (e) => {
    setSearchCompanyTerm(e.target.value);
  };

  const handleVariableSelect = (sensor) => {
    setSelectedCompany(sensor.company_id);
  };

  const handleCloseErrorAlert = () => {
    setShowErrorAlertTable(false);
  };



  const filteredVariable = Array.isArray(variableList)
    ? variableList.filter(sensor =>
      (sensor.id && sensor.id.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sensor.sensorCode && sensor.sensorCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sensor.sensorType?.sensorCode && sensor.sensorType.sensorCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sensor.sensorType?.brand && sensor.sensorType.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sensor.sensorType?.model && sensor.sensorType.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sensor.space && sensor.space.toLowerCase().includes(searchTerm.toLowerCase())) || // Reemplaza "space" por el nombre real si es diferente
      (sensor.subspace && sensor.subspace.toLowerCase().includes(searchTerm.toLowerCase())) || // Reemplaza "subspace" por el nombre real si es diferente
      (sensor.monitoringSystem && sensor.monitoringSystem.toLowerCase().includes(searchTerm.toLowerCase())) // Reemplaza "monitoringSystem" por el nombre real si es diferente
    )
    : [];


  // Paginación
  const indexOfLastVariable = currentPage * itemsPerPage;
  const indexOfFirstVariable = indexOfLastVariable - itemsPerPage;
  const currentCompanies = filteredVariable.slice(indexOfFirstVariable, indexOfLastVariable);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredVariable.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleOpenModal = (sensor = null, mode = 'create') => {
    setSelectedVariable(sensor);
    setModalMode(mode);
    setSensorId(sensor);

    if (mode === 'edit' || mode === 'view') {
      setNewVariable(sensor); // Cargar datos del sensor si estamos editando o visualizando
    } else {
      setNewVariable({
        sensorCode: '',
        icon: '',
        gpsPosition: '',
        inputPort: '',
        readingPort: '',
        description: '',
        accessUsername: '',
        accessPassword: '',
        installationDate: '',
        estimatedChangeDate: '',
      });
    }

    // Lógica para abrir modales según el modo
    if (mode === 'view') {
      setIsModalOpenView(true);
    } else if (mode === 'mantenimiento') {
      setIdModalOpenMante(true);
    } else if (mode === 'calibrar') {
      setIsModalOpenCali(true); // Abre el modal de calibración
    } else {
      setIsModalOpen(true); // Modal general
    }
  };



  // Cerrar el modal
  const closeModal = async () => {
    setAlertSelecte(true);

    setIsModalOpen(false);
    setSelectedVariable(null);
    setModalMode('create');
    setIsModalOpenView(false);
    setIdModalOpenMante(false);
    setIsModalOpenCali(false)

    // updateService();
  };

  //eliminar
  const handleDelete = (sensor) => {
    setSelectedVariable(sensor);
    setIsDeleteModalOpen(true);
  };

  const showErrorAlertSuccess = (message) => {
    setShowErrorAlert(true)
    setMessageAlert(`Sensor ${message} exitosamente`);

    setTimeout(() => {
      setShowErrorAlert(false)
    }, 2500);
  }



  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);
    setSelectedVariable(null);
    const data = await SensorService.deleteSensor(selectedVariable.id);
    if (data.success) {
      setMessageAlert(data.message);
      showErrorAlertSuccess("eliminado");
      updateService();
      setAlertSelecte(true);
    } else {
      setMessageAlert(data.message);
      setShowErrorAlert(true);
      setAlertSelecte(false);
    }

    // setMessageAlert("Sensor eliminada exitosamente");
    // showErrorAlertSuccess("eliminado");
    // updateService();
  };


  const handleCancelDelete = () => {
    setSelectedVariable(null);
    setIsDeleteModalOpen(false);
  };
  const handleCloseAlert = () => {
    setShowErrorAlert(false);
  };

  const updateService = async () => {
    setShowErrorAlertTable(false);
    setVariableList([]);

    try {

      const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : idcompanyLST.value;

      if (!companyId) {
        setVariableList([]);
        return;
      }

      const data = await SensorService.getAllSensor(companyId, {});

      setVariableList(data);
    } catch (error) {
      console.error('Error al actualizar los sensores:', error);
    }
  };

  return (
    <div className="table-container containerEmporesa">
      <div className="">
        <div className="flex items-center space-x-2 text-gray-700">
          <ImEqualizer2 size={20} />
          <span>Gestión de dispositivos</span>
          <span>/</span>
          <span>Sensores</span>
          <span>/</span>
          <span className="text-black font-bold">   {nameCompany ? nameCompany : ''}</span>
          <span className="text-black font-bold">  </span>
          {selectedCompanyUniversal && (
            <span>{companyList.find(company => company.id === selectedCompanyUniversal)?.sensorCode}</span>
          )}
        </div>
      </div>
      <div className="relative w-full mt-6 py-5 z-0">
        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="Buscar Sensor"
          className="w-full border border-gray-300 p-2 pl-10 pr-4 rounded-md" // Añadido padding a la izquierda para espacio para el icono
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>


      {isLoading ? (
        <LoadingView />
      ) : (
        <>
          <div className="bg-white  rounded-lg shadow ">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Sensores</h2>
              <button className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center" onClick={handleOpenModal}>

                Crear Sensor
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Código ID Sensor</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Tipo sensor</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Marca</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Modelo</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Puerto entrada</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Puerto Lectura</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Espacio</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Subespacio</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Sist. monitoreo y control</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCompanies.map((sensor, index) => (
                    <tr key={sensor.id} className="bg-white border-b">
                      <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                      {/* <td className="px-6 py-4 text-sm text-gray-900">{sensor.sensorCode}</td> */}
                      <td className="px-6 py-4 text-sm text-gray-900">{sensor.sensorCode}</td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <td className=" whitespace-nowrap text-sm text-gray-700">
                          {sensor.sensorType && sensor.sensorType.icon ? (
                            <img
                              src={sensor.sensorType.icon}
                              alt={sensor.sensorType.sensorCode || "Sensor Icon"}
                              className="h-8 w-8 object-contain"
                            />
                          ) : (
                            <span>{sensor.sensorType?.sensorCode || "No data"}</span>
                          )}
                        </td>

                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{sensor.sensorType.brand || "No disponible"}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{sensor.sensorType?.model || "No disponible"}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{sensor.inputPort}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{sensor.readingPort}</td>

                      <td className="px-6 py-4 text-sm text-gray-700"> -- </td>
                      <td className="px-6 py-4 text-sm text-gray-700"> -- </td>
                      <td className="px-6 py-4 text-sm text-gray-700"> -- </td>

                      <td className="px-6 py-4 text-sm font-medium flex space-x-1">
                        {/* Botón Calibrar */}
                        <button
                          data-tooltip-id="tooltip-calibrar"
                          data-tooltip-content="Calibrar Sensor"
                          className="text-[#168C0DFF] px-2 py-2 rounded hover:bg-gray-100"
                          onClick={() => handleOpenModal(sensor.id, 'calibrar')}
                        >
                          <ImEqualizer size={18} />
                        </button>

                        {/* Botón Mantenimiento */}
                        <button
                          data-tooltip-id="tooltip-mantenimiento"
                          data-tooltip-content="Realizar Mantenimiento"
                          className="text-[#168C0DFF] px-2 py-2 rounded hover:bg-gray-100"
                          onClick={() => handleOpenModal(sensor.id, 'mantenimiento')}
                        >
                          <TbSettingsCog size={18} />
                        </button>

                        {/* Botón Ver Detalles */}
                        <button
                          data-tooltip-id="tooltip-detalles"
                          data-tooltip-content="Ver Detalles"
                          className="text-[#168C0DFF] px-2 py-2 rounded hover:bg-gray-100"
                          onClick={() => handleOpenModal(sensor, 'view')}
                        >
                          <Eye size={18} />
                        </button>

                        {/* Botón Editar */}
                        <button
                          data-tooltip-id="tooltip-editar"
                          data-tooltip-content="Editar Sensor"
                          className="text-[#168C0DFF] px-2 py-2 rounded hover:bg-gray-100"
                          onClick={() => handleOpenModal(sensor, 'edit')}
                        >
                          <Edit size={18} />
                        </button>

                        {/* Botón Eliminar */}
                        <button
                          data-tooltip-id="tooltip-eliminar"
                          data-tooltip-content="Eliminar Sensor"
                          className="text-[#168C0DFF] px-2 py-2 rounded hover:bg-gray-100"
                          onClick={() => handleDelete(sensor)}
                        >
                          <Trash size={18} />
                        </button>
                      </td>


                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Añade esto al final del componente (fuera de la tabla) */}
<Tooltip id="tooltip-calibrar" place="top" effect="solid" />
<Tooltip id="tooltip-mantenimiento" place="top" effect="solid" />
<Tooltip id="tooltip-detalles" place="top" effect="solid" />
<Tooltip id="tooltip-editar" place="top" effect="solid" />
<Tooltip id="tooltip-eliminar" place="top" effect="solid" />

            </div>

          </div>
          <div className="flex items-center py-2 justify-between border border-gray-200 p-2 rounded-md bg-white">
            <div className="border border-gray-200 rounded py-2 text-sm m-2">
              <span>Cantidad de filas</span>
              <select className="text-xs" value={itemsPerPage} onChange={handleItemsPerPageChange}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
            </div>
            <div className="pagination-controls text-xs flex items-center space-x-2">
              <span>{indexOfFirstVariable + 1}-{indexOfLastVariable} de {variableList.length}</span>
              <button className="mr-2 border border-gray-200 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
                onClick={handlePrevPage} disabled={currentPage === 1}>
                <IoIosArrowBack size={20} />
              </button>
              <button className="border border-gray-200 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
                onClick={handleNextPage} disabled={currentPage === Math.ceil(variableList.length / itemsPerPage)}>
                <IoIosArrowForward size={20} />
              </button>
            </div>
          </div>
        </>
      )}
      {/* Modaeliminación */}
      {isDeleteModalOpen && (
        <Delete
          message={`¿Seguro que desea eliminar el sensor  ${selectedVariable?.sensorCode}?`}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* Modalcrear-editar-*/}
      {isModalOpen && (
        <GenericModal
          title={modalMode === 'edit' ? 'Editar Sensor' : modalMode === 'view' ? 'Ver Sensor' : 'Añadir Sensor'}
          onClose={closeModal}
          companyId={selectedCompany} >
          <FormSensor
            showErrorAlert={showErrorAlertSuccess}
            onUpdate={updateService}
            sensor={newVariable}
            mode={modalMode}
            closeModal={closeModal} />
        </GenericModal>
      )}

      {/* modal visualizar */}
      {isModalOpenView && (
        <GenericModal
          // openModal={handleOpenModal}
          title={modalMode === 'edit' ? 'Editar Sensor' :
            modalMode === 'view' ? 'Ver sensor' : 'Añadir Sensor'}
          onClose={closeModal}

          companyId={selectedCompany} >

          <FormViewSensor
            showErrorAlert={showErrorAlertSuccess}
            onUpdate={updateService}
            sensor={newVariable}
            mode={modalMode}
            closeModal={closeModal} />
        </GenericModal>
      )}
      {/* mantenimiento */}
      {isModalOpenMante && (
        <GenericModal
          title={modalMode === 'edit' ? 'Editar Sensor' : modalMode === 'view' ? 'Ver sensor' : 'Añadir Mantenimiento'}
          onClose={closeModal}

          companyId={selectedCompany} >

          <FormMantenimientoSensor showErrorAlert={showErrorAlertSuccess}
            onUpdate={updateService}
            sensor={newVariable}
            mode={modalMode}
            closeModal={closeModal}
            sensorId={sensorId || ''} />
        </GenericModal>
      )}

      {/* calibrar */}
      {isModalOpenCali && (
        <GenericModal
          title={modalMode === 'edit' ? 'Editar Sensor' : modalMode === 'view' ? 'Ver sensor' : 'Añadir Calibrar'}
          onClose={closeModal}

          companyId={selectedCompany} >

          <FormCalibrarSensor showErrorAlert={showErrorAlertSuccess}
            onUpdate={updateService}
            sensor={newVariable}
            mode={modalMode}
            closeModal={closeModal}
            sensorId={sensorId || ''} />
        </GenericModal>
      )}

      {showErrorAlert && (
        // <SuccessAlert
        //   message={messageAlert}
        //   onCancel={handleCloseAlert}
        // />
        <div className="alert-container">
          {alertSelecte ? (
            <SuccessAlert message={messageAlert} />
          ) : (
            <ErrorAlert message={messageAlert}
              onCancel={handleCloseAlert} />
          )}
        </div>
      )}

      {showErrorAlertTable && (
        <div className="alert alert-error flex flex-col items-start space-y-2 p-4 bg-red-500 text-white rounded-md">
          <div className="flex items-center space-x-2">
            <IoIosWarning size={20} />
            <p>{messageAlert}</p>
          </div>
          <div className="flex justify-end w-full">
            <button
              onClick={handleCloseErrorAlert}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
              Cancelar
            </button>
          </div>
        </div>
      )}






    </div>
  );
};

export default Sensor;
