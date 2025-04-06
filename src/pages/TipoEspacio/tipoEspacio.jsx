import React, { useEffect, useState } from "react";
import { Edit, Trash, Eye, Plus } from 'lucide-react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoIosWarning } from 'react-icons/io';
import Delete from '../../components/delete';
import GenericModal from '../../components/genericModal';
import FormTipo from './components/formTiposEspacio';
import TipoEspacioService from "../../services/tipoEspacio";
import CompanyService from "../../services/CompanyService";
import SuccessAlert from "../../components/alerts/success";
import { IoSearch } from "react-icons/io5";

import ErrorAlert from "../../components/alerts/error";

import { ImEqualizer2 } from "react-icons/im";


import Select from "react-select";
import CompanySelector from "../../components/shared/companySelect";
import { useCompanyContext } from "../../context/CompanyContext";
import LoadingView from "../../components/Loading/loadingView";
import { Tooltip } from "react-tooltip";

const TipoEspacio = () => {
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [searchcompanyTerm, setSearchCompanyTerm] = useState("");
  const { selectedCompanyUniversal, hiddenSelect } = useCompanyContext();

  const [variableList, setVariableList] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [messageAlert, setMessageAlert] = useState("");
  const [nameCompany, setNameCompany] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showErrorAlertTable, setShowErrorAlertTable] = useState(false);
  const [newVariable, setNewVariable] = useState({
    spaceTypeName: '',
    icon: '',
    description: '',
  });
  const [idcompanyLST, setIdcompanyLST] = useState(JSON.parse(localStorage.getItem('selectedCompany')));

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(true);
    const fetchVariables = async () => {
      const company = selectedCompanyUniversal ?? idcompanyLST;
      if (!company.value) {
        setVariableList([]);
        return;
      } else {
        setNameCompany(company.label)
      }

      try {
        const data = await TipoEspacioService.getAlltipoEspacio(company.value);
        if (data.statusCode === 404) {
          setVariableList([]);
        } else {
          setShowErrorAlertTable(false)
          setVariableList(Array.isArray(data) ? data : []);
          setIsLoading(false);
        }
      } catch (error) {
        setVariableList([])
        setIsLoading(false);
        console.error('Error fetching type spacio:', error);
        setMessageAlert('Esta empresa no tiene tipo de espacios registrados, Intentalo con otra empresa');
        setShowErrorAlertTable(true);
      }
    };

    fetchVariables();
  }, [selectedCompanyUniversal]);

  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption ? selectedOption.value : null);
  };

  const handleSearchChange = (e) => {
    setSearchCompanyTerm(e.target.value);
  };

  const handleVariableSelect = (variable) => {
    setSelectedCompany(variable.company_id);
  };

  const handleCloseErrorAlert = () => {
    setShowErrorAlertTable(false);
  };



  const filteredVariable = variableList.filter(variable =>
    (variable.spaceTypeName && variable.spaceTypeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (variable.description && variable.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );


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

  const handleOpenModal = (variable = null, mode = 'create') => {
    setSelectedVariable(variable);
    setModalMode(mode);
    if (mode === 'edit' || mode === 'view') {
      setNewVariable(variable);
    } else {
      setNewVariable({
        spaceTypeName: '',
        icon: '',
        description: '',

      });
    }
    setIsModalOpen(true);
  };

  // Cerrar el modal
  const closeModal = async () => {
    setIsModalOpen(false);
    setSelectedVariable(null);
    setModalMode('create');
  };

  //eliminar
  const handleDelete = (variable) => {
    setSelectedVariable(variable);
    setIsDeleteModalOpen(true);
  };

  const showErrorAlertSuccess = (message) => {
    setShowErrorAlert(true)
    setMessageAlert(`Tipo de espacio ${message} exitosamente`);

    setTimeout(() => {
      setShowErrorAlert(false)
    }, 2500);
  }


  const [alertSelecte, setAlertSelecte] = useState(false);

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);
    setIsLoading(true)
    try {
      setSelectedVariable(null);
      const data = await TipoEspacioService.deletetipoEspacio(selectedVariable.id);
      if (data) {
        setIsLoading(false)
        setMessageAlert("Tipo de dispositivo eliminado");
        showErrorAlertSuccess("eliminado");
        updateService();
        setAlertSelecte(true);
      } else {
        setMessageAlert(data.message);
        updateService();

        setShowErrorAlert(true);
        setAlertSelecte(false);
      }

    } catch (error) {
      setAlertSelecte(false);

      let errorMessage;
      if (error.statusCode === 400 && error.message.includes("ya está asociada")) {
        setMessageAlert(`${message} exitosamente`);
        (error.message);
        setShowErrorVariableAlert(true);
      } else {
        setMessageAlert(`No se puede eliminar el Tipo de espacio porque está asociado a otros registros`);
        ("No se puede eliminar el Tipo de espacio  porque está asociada a uno o más espacios");
        setShowErrorAlert(true);
      }
      console.error("Error al eliminar el Tipo de espacio :", error);
    }
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
    setAlertSelecte(true);

    try {

      const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : '';

      if (!companyId) {
        setVariableList([]);
        return;
      }

      const data = await TipoEspacioService.getAlltipoEspacio(companyId);

      setVariableList(data);
    } catch (error) {
      console.error('Error al actualizar los tipos de espacio:', error);
    }
  };


  return (
    <div className="table-container containerEmporesa">
      <div className="">
        <div className="flex items-center space-x-2 text-gray-700">
          <ImEqualizer2 size={20} />
          <span>Gestión de espacios</span>
          <span>/</span>
          <span>Tipos de espacios  /</span>
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
          placeholder="Buscar tipo de espacio"
          className="w-full border border-gray-300 p-2 pl-10 pr-4 rounded-md" // Añadido padding a la izquierda para espacio para el icono
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Icono de búsqueda alineado a la izquierda */}
        {/* <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" /> */}
      </div>


      {isLoading ? (
        <LoadingView />
      ) : (
        <>
          <div className="bg-white  rounded-lg shadow ">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Tipos de espacios</h2>
              <button className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center" onClick={handleOpenModal}>

                Crear tipo de espacio
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Icono</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Tipo de espacio</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Descripción</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentCompanies.map((tipoEspacio, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {tipoEspacio.icon ? (
                          <img
                            src={tipoEspacio.icon}
                            alt={tipoEspacio.spaceTypeName}
                            className="h-10 w-10 object-cover rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-500">Sin icono</span>
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {tipoEspacio.spaceTypeName}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {tipoEspacio.description || "Sin descripción"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-1">
                        {/* Botón Ver Detalles */}
                        <button
                          data-tooltip-id="tooltip-ver-tipoespacio"
                          data-tooltip-content="Ver Detalles"
                          className="text-[#168C0DFF] px-2 py-2 rounded hover:bg-gray-100"
                          onClick={() => handleOpenModal(tipoEspacio, 'view')}
                        >
                          <Eye size={18} />
                        </button>

                        {/* Botón Editar */}
                        <button
                          data-tooltip-id="tooltip-editar-tipoespacio"
                          data-tooltip-content="Editar Tipo"
                          className="text-[#168C0DFF] px-2 py-2 rounded hover:bg-gray-100"
                          onClick={() => handleOpenModal(tipoEspacio, 'edit')}
                        >
                          <Edit size={18} />
                        </button>

                        {/* Botón Eliminar */}
                        <button
                          data-tooltip-id="tooltip-eliminar-tipoespacio"
                          data-tooltip-content="Eliminar Tipo"
                          className="text-[#168C0DFF] px-2 py-2 rounded hover:bg-gray-100"
                          onClick={() => handleDelete(tipoEspacio)}
                        >
                          <Trash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Tooltips para los botones de acciones */}
              <Tooltip id="tooltip-ver-tipoespacio" place="top" effect="solid" />
              <Tooltip id="tooltip-editar-tipoespacio" place="top" effect="solid" />
              <Tooltip id="tooltip-eliminar-tipoespacio" place="top" effect="solid" />
              {/* Modaeliminación */}
              {isDeleteModalOpen && (
                <Delete
                  message={`¿Seguro que desea eliminar la variable ${selectedVariable?.spaceTypeName}?`}
                  onCancel={handleCancelDelete}
                  onConfirm={handleConfirmDelete}
                />
              )}
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
      )
      }

      {/* Modalcrear-editar-visualizar*/}
      {isModalOpen && (
        <GenericModal
          title={modalMode === 'edit' ? 'Editar Tipo de estapcio' : modalMode === 'view' ? 'Ver tipo de espacio' : 'Añadir tipo de espacio'}
          onClose={closeModal}

          companyId={selectedCompany} >

          <FormTipo showErrorAlert={showErrorAlertSuccess} onUpdate={updateService} variable={newVariable} mode={modalMode} closeModal={closeModal} />
        </GenericModal>
      )}

      {showErrorAlert && (
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

export default TipoEspacio;
