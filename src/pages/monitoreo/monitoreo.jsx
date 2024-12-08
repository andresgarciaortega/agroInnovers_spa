import React, { useEffect, useState } from "react";
import './monitoreo.css';
import { Edit, Trash, Eye } from 'lucide-react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Delete from '../../components/delete';
import { useCompanyContext } from "../../context/CompanyContext";
import SystemMonitory from "../../services/monitoreo";
import SuccessAlert from "../../components/alerts/success";
import CompanySelector from "../../components/shared/companySelect";

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
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorVariableAlert, setShowErrorVariableAlert] = useState(false);
  const [showErrorAlertTable, setShowErrorAlertTable] = useState(false);

  const { selectedCompanyUniversal } = useCompanyContext();
  const [selectedCompany, setSelectedCompany] = useState('');

  const indexOfLastDevice = currentPage * itemsPerPage;
  const indexOfFirstDevice = indexOfLastDevice - itemsPerPage;
  const currentDevices = data.slice(indexOfFirstDevice, indexOfLastDevice);


  useEffect(() => {
    const fetchTypeVariables = async () => {
      try {
        // Verifica si selectedCompanyUniversal es nulo o si no tiene valor
        const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : ''; // Si no hay empresa seleccionada, se pasa un string vacío

        // Verifica si companyId no es vacío antes de hacer la llamada
        if (!companyId) {
          setData([]); // Asegúrate de vaciar la lista si no hay empresa seleccionada
          return;
        } else {
          setNameCompany(selectedCompanyUniversal.label)
        }
        const data = await SystemMonitory.getAllMonitories(companyId);

        // Verifica si la respuesta es válida y si contiene datos
        if (data.statusCode === 404) {
          setData([]);
        } else {
          setShowErrorAlertTable(false);
          setData(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error fetching type variables:', error);
        setData([]); // Vaciar la lista en caso de error
        setMessageAlert('Esta empresa no tiene variables registradas, Intentalo con otra empresa');
        setShowErrorAlertTable(true);
      }
    };

    // Llamamos a la función para obtener las variables de tipo de la empresa seleccionada
    fetchTypeVariables();
  }, [selectedCompanyUniversal]); // Asegúrate de usar el valor correcto (selectedCompanyUniversal)





  const handleNextPage = () => {
    if (currentPage < Math.ceil(data.length / itemsPerPage)) {
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

  const handleDelete = (device) => {
    setSelectedDevice(device);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleteModalOpen(false);
      setSelectedDevice(null);
      await SystemMonitory.deleteMonitories(selectedDevice.id);
      console.log(SystemMonitory)
      setMessageAlert("Tipo de variable eliminada exitosamente");
      showErrorAlertSuccess("Eliminado");
      updateListMonitories();
    } catch (error) {

      if (error.statusCode === 400 && error.message.includes("ya está asociada")) {
        setMessageAlert(error.message);
        setShowErrorVariableAlert(true);
      } else {
        setMessageAlert("No se puede eliminar el Tipo de variable porque está asociada a uno o más variables");
        setShowErrorAlert(true);
      }
      console.error("Error al eliminar el tipo de variable:", error);
    }
  };

  const showErrorAlertSuccess = (message) => {
    setShowSuccessAlert(true)
    setMessageAlert(`Tipo de variable ${message} exitosamente`);

    setTimeout(() => {
      setShowSuccessAlert(false)
    }, 2500);
  }

  const updateListMonitories = async () => {
    const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : ''; // Si no hay empresa seleccionada, se pasa un string vacío
    try {
      if (!companyId) {
        setData([]); // Asegúrate de vaciar la lista si no hay empresa seleccionada
        return;
      } else {
        setNameCompany(selectedCompanyUniversal.label)
      }

      const data = await SystemMonitory.getAllMonitories(companyId);
      setData(data); // Actualiza typevariableList con los datos más recientes
      setShowErrorAlertTable(false);
    } catch (error) {
      console.error('Error al actualizar los tipos de variable:', error);
    }
  };



  const handleCancelDelete = () => {
    setSelectedDevice(null);
    setIsDeleteModalOpen(false);
  };

  const toggleSwitch = (deviceId) => {
    setData(data.map(device => (
      device.id === deviceId ? { ...device, dispAsignados: !device.dispAsignados } : device
    )));
  };

  const handleCloseAlert = () => {
    setShowErrorAlert(false);
  };

  
  const handleCloseErrorAlert = () => {
    setShowErrorAlertTable(false);
  };



  return (
    <div className="table-container">

      <div className="absolute transform -translate-y-28 right-30 w-1/2 z-10">
        <div className="relative w-full">
          <CompanySelector />
        </div>

        <br />
        <div className="flex items-center space-x-2 text-gray-700">
          <ImEqualizer2 size={20} /> {/* Ícono de Gestión de Variables */}
          <span>Gestión de variables</span>
          <span>/</span>
          <span>Tipo de variables</span>
          <span>/</span>
          <span className="text-black font-bold"> {nameCompany ? nameCompany : ''} </span>
          <span className="text-black font-bold"> </span>
          {selectedCompany && (
            <span>{companyList.find(company => company.id === selectedCompany)?.name}</span>
          )}

        </div>

      </div>




      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Monitoreo de Dispositivos</h2>
          <button className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center">
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
              {currentDevices.map((device, index) => (
                <tr key={device.id}>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{device.nombreId}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div
                      className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ease-in-out duration-200 ${device.displayFisico ? 'bg-[#168C0DFF]' : 'bg-gray-300'
                        }`}
                      onClick={() => toggleSwitch(device.displayFisico)}
                    >
                      <span
                        className={`inline-block w-7 h-7 transform bg-white rounded-full transition-transform ease-in-out duration-200 border-2 border-gray-300 shadow-lg ${device.dispAsignados ? 'translate-x-5' : 'translate-x-1'
                          }`}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{device.ipFija ? device.ipFija : 'No asignado'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700"> -- </td>
                  <td className="px-6 py-4 text-sm text-gray-700"> -- </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button className="view-button mr-5">
                      <Eye size={18} />
                    </button>
                    <button className="edit-button mr-5">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(device)} className="delete-button">
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>




          {isDeleteModalOpen && (
            <Delete
              message={`¿Seguro que desea eliminar el dispositivo ${selectedDevice?.nombre}?`}
              onCancel={handleCancelDelete}
              onConfirm={handleConfirmDelete}
            />
          )}
        </div>
      </div>

      {showSuccessAlert && (
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



      <div className="pagination-container">
        <div className="pagination-info text-xs">
          <span>Cantidad de filas</span>
          <select className="text-xs" value={itemsPerPage} onChange={handleItemsPerPageChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
        <div className="pagination-controls text-xs">
          <span>{indexOfFirstDevice + 1}-{indexOfLastDevice} de {data.length}</span>
          <button className="mr-2" onClick={handlePrevPage} disabled={currentPage === 1}>
            <IoIosArrowBack size={20} />
          </button>
          <button onClick={handleNextPage} disabled={currentPage === Math.ceil(data.length / itemsPerPage)}>
            <IoIosArrowForward size={20} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default Monitoreo;
