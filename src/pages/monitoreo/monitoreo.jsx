import React, { useEffect, useState } from "react";
import { Edit, Trash, Eye } from 'lucide-react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Delete from '../../components/delete';
import { useCompanyContext } from "../../context/CompanyContext";
import SystemMonitory from "../../services/monitoreo";
import SuccessAlert from "../../components/alerts/success";
import CompanySelector from "../../components/shared/companySelect";
import { useNavigate } from 'react-router-dom';
import GenericModal from '../../components/genericModal';
import FormMonitoreo from './components/formMoni';
// import MonitoreoService from '../../../services/monitoreo';


// Icons
import { ImEqualizer2 } from "react-icons/im";
import { IoSearch } from "react-icons/io5";
import { IoIosWarning } from 'react-icons/io';


const Monitoreo = () => {
  const [data, setData] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [nameCompany, setNameCompany] = useState("");
  const [messageAlert, setMessageAlert] = useState("");
  const [messageAlertDelete, setMessageAlertDelete] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorVariableAlert, setShowErrorVariableAlert] = useState(false);
  const [showErrorAlertTable, setShowErrorAlertTable] = useState(false);
  const navigate = useNavigate();
  const { selectedCompanyUniversal } = useCompanyContext();
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedVariable, setSelectedVariable] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
 

  const [newSistem, setNewSistem] = useState({
    nombreId: '',
    // displayFisico: true,
    ipFija: '',
    usuarioAcceso: '',
    claveAcceso: '',
    unidadSincronizacion: '',
    frecuenciaSincronizacion: '',

  });

  useEffect(() => {
    const fetchMonitoreo = async () => {
      try {
        
        const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : ''; 

       
        if (!companyId) {
          setData([]); 
          return;
        } else {
          setNameCompany(selectedCompanyUniversal.label)
        }
        const data = await SystemMonitory.getAllMonitories(companyId);

     
        if (data.statusCode === 404) {
          setData([]);
        } else {
          setShowErrorAlertTable(false);
          setData(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error fetching type Monitoreo:', error);
        setData([]); 
        setMessageAlert('Esta empresa no tiene Monitoreo registradas, Intentalo con otra empresa');
        setShowErrorAlertTable(true);
      }
    };

    fetchMonitoreo();
  }, [selectedCompanyUniversal]); 

  const filteredMonitoreo = data.filter(monitoreo => {
    const searchLower = searchTerm.toLowerCase();
  
    // Filtrar por nombreId, ipFija y displayFisico
    return (
      (monitoreo.nombreId && monitoreo.nombreId.toLowerCase().includes(searchLower)) ||
      (monitoreo.ipFija && monitoreo.ipFija.toLowerCase().includes(searchLower)) ||
      (monitoreo.displayFisico !== undefined && 
        (searchLower === 'activo' ? monitoreo.displayFisico === true : 
        searchLower === 'inactivo' ? monitoreo.displayFisico === false : 
        (monitoreo.nombreId && monitoreo.nombreId.toLowerCase().includes(searchLower)) ||
        (monitoreo.ipFija && monitoreo.ipFija.toLowerCase().includes(searchLower))
      ))
    );
  });
  
  
  
  const indexOfLastDevice = currentPage * itemsPerPage;
  const indexOfFirstDevice = indexOfLastDevice - itemsPerPage;
  const currentDevices = filteredMonitoreo.slice(indexOfFirstDevice, indexOfLastDevice);
  



  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredMonitoreo.length / itemsPerPage)) {
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

  const handleDelete = (monitoreo) => {
    setSelectedDevice(monitoreo);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleteModalOpen(false);
      setSelectedDevice(null);
      await SystemMonitory.deleteMonitories(selectedDevice.id);
      console.log(SystemMonitory)
      setMessageAlertDelete("Monitoreo de dispositivos eliminada exitosamente");
      showErrorAlertSuccess("Eliminado");
      updateListMonitories();
    } catch (error) {

      if (error.statusCode === 400 && error.message.includes("ya está asociada")) {
        setMessageAlertDelete(error.message);
        setShowErrorVariableAlert(true);
      } else {
        setMessageAlertDelete("No se puede eliminar el Monitoreo de dispositivos porque está asociada a uno o más Monitoreo");
        setShowErrorAlert(true);
      }
      console.error("Error al eliminar el Monitoreo de dispositivos:", error);
    }
  };

  const showErrorAlertSuccess = (message) => {
    setShowSuccessAlert(true)
    setMessageAlert(`Sistema de Monitoreo ${message} Exitosamente`);
    setMessageAlertDelete(`Sistema de Monitoreo  ${message} Exitosamente`);

    setTimeout(() => {
      setShowSuccessAlert(false)
    }, 2500);
  }

  const updateListMonitories = async () => {
    try {
        
      const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : ''; 

     
      if (!companyId) {
        setData([]); 
        return;
      } else {
        setNameCompany(selectedCompanyUniversal.label)
      }
      const data = await SystemMonitory.getAllMonitories(companyId);

   
      if (data.statusCode === 404) {
        setData([]);
      } else {
        setShowErrorAlertTable(false);
        setData(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching type Monitoreo:', error);
      setData([]); 
      setMessageAlert('Esta empresa no tiene Monitoreo registradas, Intentalo con otra empresa');
      setShowErrorAlertTable(true);
    }
  };

  const handleOpenModal = (monitoreo = null, mode = 'create') => {
    setSelectedVariable(monitoreo);
    setModalMode(mode);
    if (mode === 'edit' || mode === 'view') {
      setNewSistem(monitoreo);
    } else {
      setNewSistem({
        name: '',
        icon: '',
        unit_of_measurement: '',
        type_variable_id: '',
        type_register_id: '',

      });
    }
    setIsModalOpen(true);
  };

  // Cerrar el modal
  const closeModal = async () => {
    setIsModalOpen(false);
    setSelectedVariable(null);
    setModalMode('create');
    // updateService();
  };


  const handleCancelDelete = () => {
    setSelectedDevice(null);
    setIsDeleteModalOpen(false);
  };

  const toggleSwitch = (deviceId) => {
    setData(data.map(monitoreo => (
      monitoreo.id === deviceId ? { ...monitoreo, dispAsignados: !monitoreo.dispAsignados } : monitoreo
    )));
  };

  const handleCloseAlert = () => {
    setShowErrorAlert(false);
    setIsDeleteModalOpen(false);

  };


  const handleCloseErrorAlert = () => {
    setShowErrorAlertTable(false);
  };

  const updateService = async () => {
    setShowErrorAlertTable(false);
    setData([]);

    try {

      const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : '';

      if (!companyId) {
        setData([]);
        return;
      }

      const data = await SystemMonitory.getAllMonitories(companyId);

      setData(data);
    } catch (error) {
      console.error('Error al actualizar los sistemas de monitoreo:', error);
    }
  };



  return (
    <div className="table-container">

      <div className="absolute transform -translate-y-28 right-30 w-1/2 z-10">
        <div className="relative w-full">
          <CompanySelector />
        </div>

        <br />
        <div className="flex items-center space-x-2 text-gray-700">
          <ImEqualizer2 size={20} /> {/* Ícono de Gestión de Monitoreo */}
          <span>Gestión de Monitoreo</span>
          <span>/</span>
          <span>Sistema de Monitoreo</span>
          <span>/</span>
          <span className="text-black font-bold"> {nameCompany ? nameCompany : ''} </span>
          <span className="text-black font-bold"> </span>
          {selectedCompany && (
            <span>{companyList.find(company => company.id === selectedCompany)?.name}</span>
          )}

        </div>
      </div>
      <div className="relative w-full mt-6 py-5 z-0">
        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="Buscar Sistema de monitoreo"
          className="w-full border border-gray-300 p-2 pl-10 pr-4 rounded-md" // Añadido padding a la izquierda para espacio para el icono
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Icono de búsqueda alineado a la izquierda */}
        <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Monitoreo de Dispositivos</h2>
          <button className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center" onClick={handleOpenModal}>
            Crear dispositivo
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disp asignados</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP fija</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lote de producción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Espacios de producción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentDevices.map((monitoreo, index) => (
                <tr key={monitoreo.id}>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{monitoreo.nombreId}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div
                      className={`relative inline-flex items-center h-7 rounded-full w-11 cursor-pointer transition-colors ease-in-out duration-200 
                        ${monitoreo.displayFisico ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      onClick={() => toggleSwitch(monitoreo.displayFisico)}
                    >
                      <span
                        className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform ease-in-out duration-200 shadow shadow-gray-700
                           ${monitoreo.displayFisico ? 'translate-x-5' : 'translate-x-0'
                          }`}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{monitoreo.displayFisico ? monitoreo.ipFija : 'Sin asignar'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700"> -- </td>
                  <td className="px-6 py-4 text-sm text-gray-700"> -- </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button className=" text-[#168C0DFF] px-2 py-2 rounded">
                      <Eye size={18} onClick={() => navigate('../visualizarMonitoreo')} />
                    </button>
                    <button className=" text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleOpenModal(monitoreo, 'edit')}>
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(monitoreo)} className=" text-[#168C0DFF] px-2 py-2 rounded">
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

          {isModalOpen && (
            <GenericModal
              title={modalMode === 'edit' ? 'Editar Sistema de monitoreo' : modalMode === 'view' ? 'Ver Monitoreo' : 'Añadir Sistema de monitoreo'}
              onClose={closeModal}

              companyId={selectedCompany} >

              <FormMonitoreo showErrorAlert={showErrorAlertSuccess}
                onUpdate={updateService}
                monitoreo={newSistem} mode={modalMode} closeModal={closeModal} />
            </GenericModal>
          )}


          {isDeleteModalOpen && (
            <Delete
              message={`¿Seguro que desea eliminar el dispositivo ${selectedDevice?.nombreId}?`}
              onCancel={handleCancelDelete}
              onConfirm={handleConfirmDelete}
            />
          )}
        </div>
      </div>

      {showSuccessAlert && (
        <SuccessAlert
          message={messageAlert}
          onCancel={closeModal}

        />
      )}
       {showSuccessAlert && (
        <SuccessAlert
          message={messageAlertDelete}
          onCancel={closeModal}

        />
      )}


      {showErrorAlertTable && (
        <div className="alert alert-error flex flex-col items-start space-y-1 p-2 mt-4 bg-red-500 text-white rounded-md">
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
          <span>{indexOfFirstDevice + 1}-{indexOfLastDevice} de {data.length}</span>
          <button className="mr-2 border border-gray-200 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
           onClick={handlePrevPage} disabled={currentPage === 1}>
            <IoIosArrowBack size={20} />
          </button>
          <button className="border border-gray-200 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
          onClick={handleNextPage} disabled={currentPage === Math.ceil(data.length / itemsPerPage)}>
            <IoIosArrowForward size={20} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default Monitoreo;
