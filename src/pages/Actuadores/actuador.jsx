import React, { useEffect, useState } from "react";
import { Edit, Trash, Eye, Plus } from 'lucide-react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoIosWarning } from 'react-icons/io';
import { FaFilter, FaLock } from 'react-icons/fa'; // Nuevos íconos añadidos
import Delete from '../../components/delete';
import GenericModal from '../../components/genericModal';
import TypeService from "../../services/TypeDispositivosService";
import { ImEqualizer } from "react-icons/im";
import FormActuador from './components/formActuador';
import FormViewActuador from './components/FormViewActuador';
import ActuadorService from "../../services/ActuadorService";
import CompanyService from "../../services/CompanyService";
import SuccessAlert from "../../components/alerts/success";
import { IoSearch } from "react-icons/io5";
import { TbSettingsCog } from "react-icons/tb";

import FromMantenimiento from './components/formMantenimient';
import FormCalibrarActuador from './components/formCalibracion';


import { ImEqualizer2 } from "react-icons/im";


import Select from "react-select";
import CompanySelector from "../../components/shared/companySelect";
import { useCompanyContext } from "../../context/CompanyContext";

const Actuador = () => {
  const [companyList, setCompanyList] = useState([]);
  const [actuadorList, setActuadorList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [searchcompanyTerm, setSearchCompanyTerm] = useState("");
  const { selectedCompanyUniversal } = useCompanyContext();
  const [actuadorId, setActuadorId] = useState([]);

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
  const [nameCompany, setNameCompany] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showErrorAlertTable, setShowErrorAlertTable] = useState(false);
  const [newVariable, setNewVariable] = useState({
    actuatorCode: '',
    activationType: '',
    // icon: '',
    gpsPosition: '',
    inputPort: '',
    readingPort: '',
    description: '',
    accessUsername: '',
    accessPassword: '',
    installationDate: '',
    estimatedChangeDate: '',
    actuatorTypeId: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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
    const fetchTypeActuador = async () => {
      try {
        const data = await TypeService.getAllActuador();
        setActuadorList(data);
        console.log('tipos de actuadores', data);
      } catch (error) {
        console.error('Error fetching actuatorTypeId actuador:', error);
      }
    };

    fetchTypeActuador();
  }, []);

  // useEffect(() => {
  //   const fetchActuador = async () => {
  //     try {
  //       const data = await ActuadorService.getAllActuador();
  //       setVariableList(data);
  //     } catch (error) {
  //       console.error('Error fetching type actuador:', error);
  //     }
  //   };

  //   fetchActuador();
  // }, []);

  useEffect(() => {
    const fetchActuador = async () => {
      const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : '';
      if (!companyId) {
        setVariableList([]);
        return;
      } else {
        setNameCompany(selectedCompanyUniversal.label)
      }

      try {
        const data = await ActuadorService.getAllActuador(companyId);
        if (data.statusCode === 404) {
          setVariableList([]);
          setMessageAlert('Esta empresa no tiene Actuadores registrados.');
          setShowErrorAlertTable(true);
        } else {
          setShowErrorAlertTable(false)
          setVariableList(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error fetching actuadores:', error);
        setVariableList([]);

        setMessageAlert('Esta empresa no tiene actuadores registradas, Intentalo con otra empresa');
        setShowErrorAlertTable(true);
      }
    };

    fetchActuador();
  }, [selectedCompanyUniversal]);



  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption ? selectedOption.value : null);
  };

  const handleSearchChange = (e) => {
    setSearchCompanyTerm(e.target.value);
  };

  const handleVariableSelect = (actuador) => {
    setSelectedCompany(actuador.company_id);
  };

  const handleCloseErrorAlert = () => {
    setShowErrorAlertTable(false);
  };



  const filteredVariable = Array.isArray(variableList)
    ? variableList.filter(actuador =>
      (actuador.id && actuador.id.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
      (actuador.actuatorCode && actuador.actuatorCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (actuador.actuatorType?.actuatorCode && actuador.actuatorType.actuatorCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (actuador.actuatorType?.brand && actuador.actuatorType.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (actuador.actuatorType?.model && actuador.actuatorType.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (actuador.space && actuador.space.toLowerCase().includes(searchTerm.toLowerCase())) || // Reemplaza "space" por el nombre real si es diferente
      (actuador.subspace && actuador.subspace.toLowerCase().includes(searchTerm.toLowerCase())) || // Reemplaza "subspace" por el nombre real si es diferente
      (actuador.monitoringSystem && actuador.monitoringSystem.toLowerCase().includes(searchTerm.toLowerCase())) // Reemplaza "monitoringSystem" por el nombre real si es diferente
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

  const handleOpenModal = (actuador = null, mode = 'create') => {
    setSelectedVariable(actuador);
    setModalMode(mode);
    setActuadorId(actuador); 
    if (mode === 'edit' || mode === 'view') {
      setNewVariable(actuador);  // Cargar datos del actuador si estamos editando o visualizando
    } else {
      setNewVariable({
        actuatorCode: '',
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
    setIsModalOpen(false);
    setSelectedVariable(null);
    setModalMode('create');
    setIsModalOpenView(false);
    setIdModalOpenMante(false); 
    setIsModalOpenCali(false)
    updateService();
  };

  //eliminar
  const handleDelete = (actuador) => {
    setSelectedVariable(actuador);
    setIsDeleteModalOpen(true);
  };

  const showErrorAlertSuccess = (message) => {
    setShowErrorAlert(true)
    setMessageAlert(`Actuador ${message} exitosamente`);

    setTimeout(() => {
      setShowErrorAlert(false)
    }, 2500);
  }

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);
    setSelectedVariable(null);
    const data = await ActuadorService.deleteActuador(selectedVariable.id);
    setMessageAlert("Actuador eliminada exitosamente");
    showErrorAlertSuccess("eliminado");
    updateService();
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

      const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : '';

      if (!companyId) {
        setVariableList([]);
        return;
      }

      const data = await ActuadorService.getAllActuador(companyId);

      setVariableList(data);
    } catch (error) {
      console.error('Error al actualizar los actuadores:', error);
    }
  };


  return (
    <div className="table-container ">
      <div className="absolute transform -translate-y-28 right-30 w-1/2 z-10">
        <div className="relative w-full">
          <CompanySelector />

        </div>
        <br />
        <div className="flex items-center space-x-2 text-gray-700">
          <ImEqualizer2 size={20} />
          <span>Gestión de dispositivos</span>
          <span>/</span>
          <span>Actuadores</span>
          <span>/</span>
          <span className="text-black font-bold">   {nameCompany ? nameCompany : ''}</span>
          <span className="text-black font-bold">  </span>
          {selectedCompanyUniversal && (
            <span>{companyList.find(company => company.id === selectedCompanyUniversal)?.actuatorCode}</span>
          )}
        </div>
      </div>
      <div className="relative w-full mt-6 py-5 z-0">
        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="Buscar Actuador"
          className="w-full border border-gray-300 p-2 pl-10 pr-4 rounded-md" // Añadido padding a la izquierda para espacio para el icono
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>
      <div className="bg-white  rounded-lg shadow ">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Actuadores</h2>
          <button className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center" onClick={handleOpenModal}>

            Crear Actuador
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Código ID Actuador</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Nombre Comercial</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Tipo actuador</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Marca</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Modelo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Puerto entrada</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Puerto activación</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Espacio</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Subespacio</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Sist. monitoreo y control</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentCompanies.map((actuador, index) => (
                <tr key={actuador.id} className="bg-white border-b">
                  <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{actuador.actuatorCode}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{actuador.actuatorType.commercialName || "No disponible"}</td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {actuador.actuatorType && actuador.actuatorType.icon ? (
                        <img
                          src={actuador.actuatorType.icon}
                          alt={actuador.actuatorType.actuadorCode || "actuador Icon"}
                          className="h-8 w-8 object-contain"
                        />
                      ) : (
                        <span>{actuador.actuatorType?.actuadorCode || "No data"}</span>
                      )}
                    </td>

                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{actuador.actuatorType.brand || "No disponible"}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{actuador.actuatorType?.model || "No disponible"}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{actuador.inputPort}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{actuador.activationPort}</td>
                  <td className="px-6 py-4 text-sm text-gray-700"> -- </td>
                  <td className="px-6 py-4 text-sm text-gray-700"> -- </td>
                  <td className="px-6 py-4 text-sm text-gray-700"> -- </td>

                  <td className="px-6 py-4 text-sm font-medium">
                    <button className="text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleOpenModal(actuador.id, 'calibrar')}>
                      <ImEqualizer size={18} />
                    </button>
                    <button className="text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleOpenModal(actuador.id, 'mantenimiento')}>
                      <TbSettingsCog size={18} />
                    </button>
                    <button className="text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleOpenModal(actuador, 'view')}>
                      <Eye size={18} />
                    </button>
                    <button className="text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleOpenModal(actuador, 'edit')}>
                      <Edit size={18} />
                    </button>
                    <button className="text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleDelete(actuador)}>
                      <Trash size={18} />
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>


      </div>


      {/* Modaeliminación */}
      {isDeleteModalOpen && (
        <Delete
          message={`¿Seguro que desea eliminar el actuador  ${selectedVariable?.actuatorCode}?`}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* Modalcrear-editar-*/}
      {isModalOpen && (
        <GenericModal
          title={modalMode === 'edit' ? 'Editar Actuador' : modalMode === 'view' ? 'Ver Actuador' : 'Añadir Actuador'}
          onClose={closeModal}

          companyId={selectedCompany} >

          <FormActuador showErrorAlert={showErrorAlertSuccess} onUpdate={updateService} actuador={newVariable} mode={modalMode} closeModal={closeModal} />
        </GenericModal>
      )}
      {/* modal visualizar */}
      {isModalOpenView && (
        <GenericModal
          title={modalMode === 'edit' ? 'Editar Actuador' : modalMode === 'view' ? 'Ver actuador' : 'Añadir Actuador'}
          onClose={closeModal}

          companyId={selectedCompany} >

          <FormViewActuador showErrorAlert={showErrorAlertSuccess} onUpdate={updateService} actuador={newVariable} mode={modalMode} closeModal={closeModal} />
        </GenericModal>
      )}

{isModalOpenMante && (
        <GenericModal
          title={modalMode === 'edit' ? 'Editar Actuador' : modalMode === 'view' ? 'Ver actuador' : 'Añadir Mantenimiento'}
          onClose={closeModal}

          companyId={selectedCompany} >

          <FromMantenimiento showErrorAlert={showErrorAlertSuccess}
           onUpdate={updateService}
            actuador={newVariable} 
            mode={modalMode} 
            closeModal={closeModal}
            actuadorId={actuadorId || ''} />
        </GenericModal>
      )}

      {/* calibrar */}
      {/* mantenimiento */}
      {isModalOpenCali && (
        <GenericModal
          title={modalMode === 'edit' ? 'Editar Actuador' : modalMode === 'view' ? 'Ver actuador' : 'Añadir Calibrar'}
          onClose={closeModal}

          companyId={selectedCompany} >

          <FormCalibrarActuador showErrorAlert={showErrorAlertSuccess}
           onUpdate={updateService}
            actuador={newVariable} 
            mode={modalMode} 
            closeModal={closeModal}
            actuadorId={actuadorId || ''} />
        </GenericModal>
      )}

      {showErrorAlert && (
        <SuccessAlert
          message={messageAlert}
          onCancel={handleCloseAlert}
        />
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

export default Actuador;
