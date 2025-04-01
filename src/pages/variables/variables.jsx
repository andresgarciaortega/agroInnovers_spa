import React, { useEffect, useState } from "react";
import { Edit, Trash, Eye, Plus } from 'lucide-react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoIosWarning } from 'react-icons/io';
import Delete from '../../components/delete';
import GenericModal from '../../components/genericModal';
import FormVariable from './FormVariable/formVariable';
import VariableService from "../../services/variableService";
import CompanyService from "../../services/CompanyService";
import SuccessAlert from "../../components/alerts/success";
import { IoSearch } from "react-icons/io5";
import ErrorAlert from "../../components/alerts/error";


import { ImEqualizer2 } from "react-icons/im";


import Select from "react-select";
import CompanySelector from "../../components/shared/companySelect";
import { useCompanyContext } from "../../context/CompanyContext";
import { getDecodedToken } from "../../utils/auseAuth";
import LoadingView from "../../components/Loading/loadingView";
import { Tooltip } from "react-tooltip";

const Variable = () => {
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [searchcompanyTerm, setSearchCompanyTerm] = useState("");
  const { selectedCompanyUniversal, hiddenSelect } = useCompanyContext();
  const [idcompanyLST, setIdcompanyLST] = useState(JSON.parse(localStorage.getItem('selectedCompany')));
  const [variableList, setVariableList] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [messageAlert, setMessageAlert] = useState("");
  const [nameCompany, setNameCompany] = useState(idcompanyLST.label);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showErrorAlertTable, setShowErrorAlertTable] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [newVariable, setNewVariable] = useState({
    name: '',
    icon: '',
    unit_of_measurement: '',
    type_variable_id: '',
    type_register_id: '',
  });

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
    const fetchVariables = async () => {
      setIsLoading(true)
      setShowErrorAlertTable(false);

      const decodedToken = await getDecodedToken();
      setUserRoles(decodedToken.roles?.map(role => role.name) || []);

      const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : idcompanyLST.value;
      if (!companyId) {
        setVariableList([]);
        return;
      }

      try {
        const data = await VariableService.getAllVariable(companyId);
        if (data.statusCode === 404) {
          setVariableList([]);
        } else {
          setShowErrorAlertTable(false)
          setVariableList(Array.isArray(data) ? data : []);
        }
        setIsLoading(false)
      } catch (error) {
        setVariableList([])
        console.error('Error fetching variables:', error);
        setMessageAlert('Esta empresa no tiene variables registradas, Intentalo con otra empresa');
        setShowErrorAlertTable(true);
        setIsLoading(false)
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
    (variable.name && variable.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (variable.unit_of_measurement && variable.unit_of_measurement.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (variable.type_variable_id && variable.type_variable_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (variable.type_register_id && variable.type_register_id.toLowerCase().includes(searchTerm.toLowerCase()))
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
    setAlertSelecte(true);
  };

  //eliminar
  const handleDelete = (variable) => {
    setSelectedVariable(variable);
    setIsDeleteModalOpen(true);
  };

  const showErrorAlertSuccess = (message) => {
    setShowErrorAlert(true)
    setMessageAlert(`Variable ${message} exitosamente`);

    setTimeout(() => {
      setShowErrorAlert(false)
    }, 2500);
  }
  const [alertSelecte, setAlertSelecte] = useState(false);


  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);
    try {
      setSelectedVariable(null);
      const data = await VariableService.deleteVariable(selectedVariable.id);
      if (data) {
        setMessageAlert(data.message);
        showErrorAlertSuccess("eliminado");
        updateService();
        setAlertSelecte(true);
      } else {
        setMessageAlert(data.message);
        setShowErrorAlert(true);
        setAlertSelecte(false);
      }
    } catch (error) {

      let errorMessage;
      if (error.statusCode === 400 && error.message.includes("ya está asociada")) {
        setMessageAlert(`${message} exitosamente`);
        (error.message);
        // setShowErrorVariableAlert(true);
      } else {
        setMessageAlert(`No se puede eliminar la variable porque está asociado a otros registros`);
        ("No se puede eliminar la variable  porque está asociada a uno o más sensores");
        setShowErrorAlert(true);
      }
      console.error("Error al eliminar la variable :", error);
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
    try {
      const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : idcompanyLST.value;
      if (!companyId) {
        setVariableList([]);
        return;
      }
      const data = await VariableService.getAllVariable(companyId);
      setVariableList(data);
    } catch (error) {
      console.error('Error al actualizar las variables:', error);
    }
  };


  return (
    <div className="table-container containerEmporesa">
      <div className="mb-5">
        <div className="flex items-center space-x-2 text-gray-700">
          <ImEqualizer2 size={20} />
          <span>Gestión de variables</span>
          <span>/</span>
          <span>Variables</span>
          <span>/</span>
          <span className="text-black font-bold">   {nameCompany ? nameCompany : ''}</span>
          <span className="text-black font-bold">  </span>
          {selectedCompanyUniversal && (
            <span>{companyList.find(company => company.id === selectedCompanyUniversal)?.name}</span>
          )}
        </div>
      </div>
      <div className=" w-full mt-6 py-5 z-0">
        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="Buscar variable"
          className="w-full border border-gray-300 p-2 pl-10 pr-4 rounded-md" // Añadido padding a la izquierda para espacio para el icono
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      </div>



      <div className="bg-white  rounded-lg shadow ">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Variables</h2>
          <button className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center" onClick={handleOpenModal}>

            Crear Variable
          </button>
        </div>


        {isLoading ? (
          <LoadingView />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Icono</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Nombre Variable</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Tipo variable</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Unidad medida</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Tipo registro</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentCompanies.map((variable, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {variable.icon ? (
                          <img
                            src={variable.icon}
                            alt={variable.name}
                            className="h-10 w-10 object-cover rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-500">Sin icono</span>
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {variable.name}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {variable.typeVariable?.name || 'No especificado'}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {variable.unit_of_measurement || 'N/A'}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex justify-center text-sm leading-5 py-1 font-semibold rounded-sm ${variable.typeRegister
                            ? 'text-gray-700 bg-gray-200'
                            : 'text-gray-500 bg-gray-100'
                          }`}>
                          {variable.typeRegister?.name || 'N/A'}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-1">
                        {/* Botón Ver Detalles */}
                        <button
                          data-tooltip-id="tooltip-ver-variable"
                          data-tooltip-content="Ver Detalles"
                          className="text-[#168C0DFF] px-2 py-2 rounded hover:bg-gray-100"
                          onClick={() => handleOpenModal(variable, 'view')}
                        >
                          <Eye size={18} />
                        </button>

                        {/* Botón Editar */}
                        <button
                          data-tooltip-id="tooltip-editar-variable"
                          data-tooltip-content="Editar Variable"
                          className="text-[#168C0DFF] px-2 py-2 rounded hover:bg-gray-100"
                          onClick={() => handleOpenModal(variable, 'edit')}
                        >
                          <Edit size={18} />
                        </button>

                        {/* Botón Eliminar */}
                        <button
                          data-tooltip-id="tooltip-eliminar-variable"
                          data-tooltip-content="Eliminar Variable"
                          className="text-[#168C0DFF] px-2 py-2 rounded hover:bg-gray-100"
                          onClick={() => handleDelete(variable)}
                        >
                          <Trash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Tooltips para los botones de acciones */}
              <Tooltip id="tooltip-ver-variable" place="top" effect="solid" />
              <Tooltip id="tooltip-editar-variable" place="top" effect="solid" />
              <Tooltip id="tooltip-eliminar-variable" place="top" effect="solid" />
              {/* Modaeliminación */}
              {isDeleteModalOpen && (
                <Delete
                  message={`¿Seguro que desea eliminar la variable ${selectedVariable?.name}?`}
                  onCancel={handleCancelDelete}
                  onConfirm={handleConfirmDelete}
                />
              )}
            </div>
          </>
        )}
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

      {/* Modalcrear-editar-visualizar*/}
      {isModalOpen && (
        <GenericModal
          title={modalMode === 'edit' ? 'Editar Variable' : modalMode === 'view' ? 'Ver variable' : 'Añadir Variable'}
          onClose={closeModal}

          companyId={selectedCompany} >

          <FormVariable showErrorAlert={showErrorAlertSuccess} onUpdate={updateService} variable={newVariable} mode={modalMode} closeModal={closeModal} />
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

export default Variable;
