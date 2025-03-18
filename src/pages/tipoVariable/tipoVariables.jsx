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
import ErrorAlert from "../../components/alerts/error";
import { IoSearch } from "react-icons/io5";
import LoadingView from '../../components/Loading/loadingView';
import CompanyService from "../../services/CompanyService";


import { ImEqualizer2 } from "react-icons/im";
import { IoIosWarning } from 'react-icons/io';


import Select from "react-select";
import CompanySelector from "../../components/shared/companySelect";
import { useCompanyContext } from "../../context/CompanyContext";

const TipoVariable = () => {
  const { selectedCompanyUniversal, hiddenSelect } = useCompanyContext();
  // const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [searchcompanyTerm, setSearchCompanyTerm] = useState("");
  const [nameCompany, setNameCompany] = useState("");
  const [typeVariablesList, setTypeVariablesList] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTypeVariable, setSelectedTypeVariable] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [messageAlert, setMessageAlert] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorVariableAlert, setShowErrorVariableAlert] = useState(false);
  const [showErrorAlertTable, setShowErrorAlertTable] = useState(false);

  const [newTypeVariable, setNewTypeVariable] = useState({
    icon: '',
    name: '',
    description: '',
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    hiddenSelect(false)
    const fetchTypeVariables = async () => {
      try {
        // Verifica si selectedCompanyUniversal es nulo o si no tiene valor
        const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : ''; // Si no hay empresa seleccionada, se pasa un string vacío

        // Verifica si companyId no es vacío antes de hacer la llamada
        if (!companyId) {
          setTypeVariablesList([]); // Asegúrate de vaciar la lista si no hay empresa seleccionada
          return;
        } else {
          setNameCompany(selectedCompanyUniversal.label)
        }

        const data = await VariableType.getAllTypeVariable();

        // Verifica si la respuesta es válida y si contiene datos
        if (data.statusCode === 404) {
          setTypeVariablesList([]);
        } else {
          setShowErrorAlertTable(false);
          setTypeVariablesList(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error fetching type variables:', error);
        setTypeVariablesList([]); // Vaciar la lista en caso de error
        setMessageAlert('Esta empresa no tiene variables registradas, Intentalo con otra empresa');
        setShowErrorAlertTable(true);
      }
    };

    // Llamamos a la función para obtener las variables de tipo de la empresa seleccionada
    fetchTypeVariables();
  }, [selectedCompanyUniversal]); // Asegúrate de usar el valor correcto (selectedCompanyUniversal)


  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption?.value || null);
  };



  // const handleCompanyChange = (selectedOption) => {
  //   setSelectedCompany(selectedOption ? selectedOption.value : null);
  // };

  const handleCloseErrorAlert = () => {
    setShowErrorAlertTable(false);
  };

  // Función de búsqueda que filtra typevariableList según el searchTerm
  const filteredTypeVariable = typeVariablesList.filter(typevariable =>
    (typevariable.name && typevariable.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (typevariable.description && typevariable.description.toLowerCase().includes(searchTerm.toLowerCase())) // Cambiar registrationDate a created_at
  );

  // Paginación
  const indexOfLastTypeVariable = currentPage * itemsPerPage;
  const indexOffIrstTypeVariable = indexOfLastTypeVariable - itemsPerPage;
  const currentTypeVariable = filteredTypeVariable.slice(indexOffIrstTypeVariable, indexOfLastTypeVariable);

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
  // Eliminar
  const handleDelete = (typevariable) => {
    setSelectedTypeVariable(typevariable);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleteModalOpen(false);
      setSelectedTypeVariable(null);

      await VariableType.deleteTypeVariable(selectedTypeVariable.id);

      setMessageAlert("Tipo de variable eliminada exitosamente");
      showErrorAlertSuccess("Eliminado");
      updateTypeVariable();
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

  const updateTypeVariable = async () => {
    const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : '';

    if (!companyId) {
      setTypeVariablesList([]); // Asegúrate de vaciar la lista si no hay empresa seleccionada
      return;
    }

    try {
      const data = await VariableType.getAllTypeVariable();
      setTypeVariablesList(data); // Actualiza typevariableList con los datos más recientes
      setShowErrorAlertTable(false);
    } catch (error) {
      console.error('Error al actualizar los tipos de variable:', error);
    }
  };

  const showErrorAlertSuccess = (message) => {
    setShowSuccessAlert(true)
    setMessageAlert(`Tipo de variable ${message} exitosamente`);

    setTimeout(() => {
      setShowSuccessAlert(false)
    }, 2500);
  }
  const showErrorAlert2 = () => {
    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 2500);
  };


  return (
    <div className="table-container containerEmporesa">
      <div className="">
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

      <div className="relative w-full mt-6 py-5 z-0">
        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="Buscar Tipos de  variable"
          className="w-full border border-gray-300 p-2 pl-10 pr-4 rounded-md" // Añadido padding a la izquierda para espacio para el icono
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Icono de búsqueda alineado a la izquierda */}
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
              {currentTypeVariable.map((typevariable, index) => (
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
                    <button className="bg-customGreen text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleOpenModal(typevariable, 'edit')}>
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
              message={`¿Seguro que desea eliminar el Tipo de variable ${selectedTypeVariable?.name}?`}
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
        <GenericModal title={modalMode === 'edit' ? 'Editar Variable' : modalMode === 'view' ? 'Ver Variable' : 'Añadir Variable'}
          onClose={closeModal}>
          <FormTypeVariable
            showErrorAlert={showErrorAlertSuccess}
            onUpdate={updateTypeVariable}
            typevariable={newTypeVariable}
            mode={modalMode}
            closeModal={closeModal}
          />
        </GenericModal>
      )}
      {showErrorVariableAlert && (
        <div className="alert alert-error flex items-center space-x-2 p-4 bg-red-500 text-white rounded-md">
          <IoIosWarning size={20} />
          <p>{messageAlert}</p>
          <button onClick={handleCloseErrorAlert} className="ml-2">Cerrar</button>
        </div>
      )}

      {showErrorAlert && (
        <ErrorAlert
          message={messageAlert}
          onCancel={handleCloseAlert}
        />
      )}


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

      {showErrorVariableAlert && (
        <div className="alert alert-error fixed top-5 right-5 w-96 shadow-lg">
          <div>
            <IoIosWarning className="text-red-500 w-6 h-6" />
            <span>{messageAlert}</span>
          </div>
          <button
            className="btn btn-sm btn-outline ml-auto"
            onClick={() => setShowErrorVariableAlert(false)}
          >
            Cerrar
          </button>
        </div>
      )}

    </div>
  );
};

export default TipoVariable;
