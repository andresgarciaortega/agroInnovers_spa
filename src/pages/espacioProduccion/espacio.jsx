import React, { useEffect, useState } from "react";
import { Edit, Trash, Eye, Plus } from 'lucide-react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoIosWarning } from 'react-icons/io';
import Delete from '../../components/delete';
import GenericModal from '../../components/genericModal';
// import FormTipo from './components/formTiposEspacio';
import EspacioService from "../../services/espacios";
import CompanyService from "../../services/CompanyService";
import SuccessAlert from "../../components/alerts/success";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';


import { ImEqualizer2 } from "react-icons/im";


import Select from "react-select";
import CompanySelector from "../../components/shared/companySelect";
import { useCompanyContext } from "../../context/CompanyContext";

const Espacio = () => {
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [searchcompanyTerm, setSearchCompanyTerm] = useState("");
  const { selectedCompanyUniversal } = useCompanyContext();
  const navigate = useNavigate();

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
    name: '',
    icon: '',
    gpsPosition: '',

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

  // useEffect(() => {
  //   const fetchEspecies = async () => {
  //     try {
  //       const data = await EspacioService.getAllEspacio();
  //       setVariableList(data);
  //       console.log('espacios', variableList)
  //     } catch (error) {
  //       console.error('Error fetching space:', error);
  //     }
  //   };

  //   fetchEspecies();
  // }, []);

  useEffect(() => {
    const fetchEspecies = async () => {
      const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : '';
      if (!companyId) {
        setVariableList([]);
        return;
      } else {
        setNameCompany(selectedCompanyUniversal.label)
      }

      try {
        const data = await EspacioService.getAllEspacio(companyId);
        if (data.statusCode === 404) {
          setVariableList([]);
        } else {
          setShowErrorAlertTable(false)
          setVariableList(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        setVariableList([])
        console.error('Error fetching space:', error);
        setMessageAlert('Esta empresa no tiene Espacios registrados, Intentalo con otra empresa');
        setShowErrorAlertTable(true);
      }
    };

    fetchEspecies();
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



  // const filteredVariable = variableList.filter(variable =>
  //   (variable.name && variable.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
  //   (variable.gpsPosition && variable.gpsPosition.toLowerCase().includes(searchTerm.toLowerCase()))
  // );


  // Paginación
  // const indexOfLastVariable = currentPage * itemsPerPage;
  // const indexOfFirstVariable = indexOfLastVariable - itemsPerPage;
  // const variableList = filteredVariable.slice(indexOfFirstVariable, indexOfLastVariable);

  // const handleNextPage = () => {
  //   if (currentPage < Math.ceil(filteredVariable.length / itemsPerPage)) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };

  // const handlePrevPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // };

  // const handleItemsPerPageChange = (event) => {
  //   setItemsPerPage(Number(event.target.value));
  //   setCurrentPage(1);
  // };

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
    updateService();
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

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);
    setSelectedVariable(null);
    const data = await EspacioService.deleteEspacio(selectedVariable.id);
    setMessageAlert("Tipo de espacio eliminado exitosamente");
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

      const data = await EspacioService.getAllEspacio(companyId);

      setVariableList(data);
    } catch (error) {
      console.error('Error al actualizar los tipos de espacio:', error);
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
          <span>Gestión de espacios</span>
          <span>/</span>
          <span>Tipos de espacios</span>
          <span>/</span>
          <span className="text-black font-bold">   {nameCompany ? nameCompany : ''}</span>
          <span className="text-black font-bold">  </span>
          {selectedCompanyUniversal && (
            <span>{companyList.find(company => company.id === selectedCompanyUniversal)?.name}</span>
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
        <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>



      <div className="bg-white  rounded-lg shadow ">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Espacios</h2>
          <button className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center" onClick={() => navigate('../crearEspacio')}>

            Crear tipo de espacio
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full ">
            <thead className="bg-gray-300  ">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider ">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Nombre espacio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de espacio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Áreas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volumen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posición GPS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {variableList.map((tipoEspacio, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{index + 1}</td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{tipoEspacio.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {tipoEspacio.spaceTypeId?.icon ? (
                      <img
                        src={tipoEspacio.spaceTypeId.icon}
                        alt={tipoEspacio.spaceTypeId.name || "Tipo de espacio"}
                        className="w-6 h-6 object-contain"
                      />
                    ) : (
                      tipoEspacio.spaceTypeId?.name || "Sin tipo de espacio"
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{tipoEspacio.area}</td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{tipoEspacio.volume}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{tipoEspacio.gpsPosition}</td>



                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className=" text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleOpenModal(tipoEspacio, 'view')}>
                      <Eye size={18} />
                    </button>
                    <button className=" text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleOpenModal(tipoEspacio, 'edit')}>
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(tipoEspacio)} className=" text-[#168C0DFF] px-2 py-2 rounded">
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
              message={`¿Seguro que desea eliminar el Espacio ${selectedVariable?.name}?`}
              onCancel={handleCancelDelete}
              onConfirm={handleConfirmDelete}
            />
          )}
        </div>
      </div>
      {/* <div className="flex items-center py-2 justify-between border border-gray-200 p-2 rounded-md bg-white">
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
      </div> */}

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

export default Espacio;
