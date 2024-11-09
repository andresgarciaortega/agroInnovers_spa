import React, { useEffect, useState } from "react";
import { Edit, Trash, Eye, Plus } from 'lucide-react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiPlusCircle } from "react-icons/fi";
import { IoCloudUploadOutline } from "react-icons/io5";
import Delete from '../../components/delete';
// import Success from '../../component/alert//success';
import GenericModal from '../../components/genericModal';
import FormVariable from './FormVariable/formVariable';
import VariableService from "../../services/variableService";
import SuccessAlert from "../../components/alerts/success";
import { IoSearch } from "react-icons/io5";


const Variable = () => {
  const [variableList, setVariableList] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [messageAlert, setMessageAlert] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [newVariable, setNewVariable] = useState({
    name: '',
    icon: '',
    unit_of_measurement: '',
    type_variable_id: '',
    type_register_id: '',
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Cargar empresas cuando el componente se monta
  useEffect(() => {
    const fetchVariables = async () => {
      try {
        const data = await VariableService.getAllVariable();
        setVariableList(data);
      } catch (error) {
        console.error('Error fetching variables:', error);
      }
    };

    fetchVariables();
  }, []);


  const filteredVariable = variableList.filter(variable =>
    (variable.name && variable.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (variable.unit_of_measurement && variable.unit_of_measurement.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (variable.type_variable_id && variable.type_variable_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (variable.type_register_id && variable.location.toLowerCase().includes(searchTerm.toLowerCase()))  // Cambiar registrationDate a created_at
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
    updateService(); 
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

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);
    setSelectedVariable(null);
    const data = await VariableService.deleteVariable(selectedVariable.id);
    setMessageAlert("Variable eliminada exitosamente");
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
    try {
      const data = await VariableService.getAllVariable();

      setVariableList(data); // Actualiza companyList con los datos más recientes
    } catch (error) {
      console.error('Error al actualizar las variables:', error);
    }
  };








  return (
    <div className="table-container">
      <div className="absolute transform -translate-y-20 right-30 w-1/2">
        <IoSearch className="absolute left-3 top-3 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar empresa "
          className="w-full border border-gray-300 p-2 pl-10 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Variables</h2>
          <button className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center" onClick={handleOpenModal}>

            Crear Variable
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-300 ">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider ">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Variable</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo variable</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad medida</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo registro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentCompanies.map((variable, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{variable.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <span className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {variable.typeVariable && variable.typeVariable.length > 0 ? variable.typeVariable.name : variable.typeVariable.name }
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{variable.unit_of_measurement}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Asegúrate de que variable.type_register_id tiene un valor válido */}
                    <span className="px-2 inline-flex justify-center text-sm leading-5 py-1 font-semibold text-gray-500 bg-gray-300 rounded-sm">
                    {variable.typeRegister ? variable.typeRegister.name : 'N/A'}

                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="view-button mr-5" onClick={() => handleOpenModal(variable, 'view')}>
                      <Eye size={18} />
                    </button>
                    <button className="edit-button mr-5" onClick={() => handleOpenModal(variable, 'edit')}>
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(variable)} className="delete-button">
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Modaeliminación */}
          {isDeleteModalOpen && (
            <Delete
              message={`¿Seguro que desea eliminar el usuario ${selectedVariable?.name}?`}
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

      {/* Modalcrear-editar-visualizar*/}
      {isModalOpen && (
        <GenericModal title={modalMode === 'edit' ? 'Editar Variable' : modalMode === 'view' ? 'Ver Cariable' : 'Añadir Variable'} onClose={closeModal}>
          <FormVariable showErrorAlert={showErrorAlertSuccess} onUpdate={updateService} variable={newVariable} mode={modalMode} closeModal={closeModal} />
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
};

export default Variable;
