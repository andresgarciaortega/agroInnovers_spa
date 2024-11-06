import React, { useEffect, useState } from "react";
import { Edit, Trash, Eye, Plus } from 'lucide-react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiPlusCircle } from "react-icons/fi";
import { IoCloudUploadOutline } from "react-icons/io5";
import Delete from '../../components/delete';
import GenericModal from '../../components/genericModal';
import FormTypeVariable from './FormTypeVariable/formTypeVariable';
import VariableType from "../../services/VariableType";
import SuccessAlert from "../../components/alerts/success";
import { IoSearch } from "react-icons/io5";
import LoadingView from '../../components/Loading/loadingView';




const TipoVariable = () => {
  const [typeVariablesList, setTypeVariablesList] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTypeVariable, setSelectedTypeVariable] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [messageAlert, setMessageAlert] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [newTypeVariable, setNewTypeVariable] = useState({
    icon: '',
    name: '',
    description: '',
  });


  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  // Cargar tios cuando el componente se monta
  useEffect(() => {
    const fetchTypeVariable = async () => {
      setIsLoading(true);
      try {
        const data = await VariableType.getAllTypeVariable();
        setTypeVariablesList(data);
      } catch (error) {
        console.error('Error fetching TypeVariable:', error);
      }finally {
        setIsLoading(false);
      }
    };

    fetchTypeVariable();
  }, []);

  // Función de búsqueda que filtra typevariableList según el searchTerm
  const filteredTypeVariable = typeVariablesList.filter(typevariable =>
    (typevariable.name && typevariable.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (typevariable.description && typevariable.description.toLowerCase().includes(searchTerm.toLowerCase())) // Cambiar registrationDate a created_at
  );

  // Paginación
  const indexOfLastTypeVariable = currentPage * itemsPerPage;
  const indexOffIrstTypeVariable = indexOfLastTypeVariable - itemsPerPage;
  const currentCompanies = filteredTypeVariable.slice(indexOffIrstTypeVariable, indexOfLastTypeVariable);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredTypeVariable.length / itemsPerPage)) {
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



  //eliminar
  const handleDelete = (typevariable) => {
    setSelectedTypeVariable(typevariable);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);
    setSelectedTypeVariable(null);
    const data = await VariableType.deleteTypeVariable(selectedTypeVariable.id);
    setMessageAlert("tipo de variable eliminada exitosamente");
    showErrorAlertSuccess("eliminado");
    updateTypeVariable();
    
  };


  const handleCancelDelete = () => {
    setSelectedTypeVariable(null);
    setIsDeleteModalOpen(false);
  };
  const handleCloseAlert = () => {
    setShowErrorAlert(false);
  };



  const handleOpenModal = (typevariable = null, mode = 'create') => {
    setSelectedTypeVariable(typevariable);
    setModalMode(mode);
    if (mode === 'edit' || mode === 'view') {
      setNewTypeVariable(typevariable);
    } else {
      setNewTypeVariable({
        icon: '',
        name: '',
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  // Cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTypeVariable(null);
    setModalMode('create');
    updateTypeVariable();
  };

  // Función para actualizar la lista de empresas
  const updateTypeVariable = async () => {
    try {
      const data = await VariableType.getAllTypeVariable();

      setTypeVariablesList(data); // Actualiza typevariableList con los datos más recientes
    } catch (error) {
      console.error('Error al actualizar los tipos de variable:', error);
    }
  };

  const showErrorAlertSuccess = (message) => {
    setShowErrorAlert(true)
    setMessageAlert(`Tipo de variable ${message} exitosamente`);

    setTimeout(() => {
      setShowErrorAlert(false)
    }, 2500);
  }


  return (
    <div className="table-container">
      {isLoading && <LoadingView />} 
      <div className="absolute transform -translate-y-20 right-30 w-1/2">
        <IoSearch className="absolute left-3 top-3 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar tipo de variable "
          className="w-full border border-gray-300 p-2 pl-10 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Tipo de Variables</h2>
          <button className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center" onClick={handleOpenModal}>

            Crear Tipo de Variable
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-300 ">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider ">Icono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre de tipo de Variable</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentCompanies.map((typevariable, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typevariable.icon && (
                      <img
                        src={typevariable.icon}
                        alt={typevariable.name}
                        className="h-10 w-10 object-cover rounded-full"
                      />
                    )}
                  </td>


                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{typevariable.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{typevariable.description}</td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="bg-customGreen text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleOpenModal(typevariable, 'view')}>
                      <Eye size={18} />
                    </button>
                    <button className="bg-customGreen text-[#168C0DFF] px-2 py-2 rounded"onClick={() => handleOpenModal(typevariable, 'edit')}>
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(typevariable)} className="bg-customGreen text-[#168C0DFF] px-2 py-2 rounded">
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
              message={`¿Seguro que desea eliminar el usuario ${selectedTypeVariable?.name}?`}
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
          <span>{indexOffIrstTypeVariable + 1}-{indexOfLastTypeVariable} de {typeVariablesList.length}</span>
          <button className="mr-2 border border-gray-200 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
            onClick={handlePrevPage} disabled={currentPage === 1}>
            <IoIosArrowBack size={20} />
          </button>
          <button className="border border-gray-200 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
            onClick={handleNextPage} disabled={currentPage === Math.ceil(typeVariablesList.length / itemsPerPage)}>
            <IoIosArrowForward size={20} />
          </button>
        </div>
      </div>

      {/* Modalcrear-editar-visualizar*/}

      {isModalOpen && (
        <GenericModal title={modalMode === 'edit' ? 'Editar Variable' : modalMode === 'view' ? 'Ver Cariable' : 'Añadir Variable'} onClose={closeModal}>
          <FormTypeVariable showErrorAlert={showErrorAlertSuccess} onUpdate={updateTypeVariable} typevariable={newTypeVariable} mode={modalMode} closeModal={closeModal} />
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

export default TipoVariable;
