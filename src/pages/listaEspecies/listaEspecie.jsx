import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import ErrorAlert from "../../components/alerts/error";
import { Edit, Trash, Eye, Plus } from 'lucide-react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoIosWarning } from 'react-icons/io';
import Delete from '../../components/delete';
import GenericModal from '../../components/genericModal';
// import FormEspecie from './FormEspecie/formSpecies';
import SpeciesService from "../../services/SpeciesService";
import CompanyService from "../../services/CompanyService";
import CategoryService from "../../services/CategoryService";
import SuccessAlert from "../../components/alerts/success";
import Error from "../../components/alerts/error";
import { IoSearch } from "react-icons/io5";


import { ImEqualizer2 } from "react-icons/im";


import Select from "react-select";
import CompanySelector from "../../components/shared/companySelect";
import { useCompanyContext } from "../../context/CompanyContext";
import { getDecodedToken } from "../../utils/auseAuth";
import LoadingView from "../../components/Loading/loadingView";

const ListaEspecies = () => {
  const [idcompanyLST, setIdcompanyLST] = useState(JSON.parse(localStorage.getItem('selectedCompany')));
  const [companyList, setCompanyList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [searchcompanyTerm, setSearchCompanyTerm] = useState("");
  const { selectedCompanyUniversal, hiddenSelect } = useCompanyContext();
  const navigate = useNavigate();
  const [speciesList, setSpeciesList] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEspecie, setSelectedEspecie] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [messageAlert, setMessageAlert] = useState("");
  const [nameCompany, setNameCompany] = useState(idcompanyLST.label);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showErrorAlertTable, setShowErrorAlertTable] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [newEspecie, setNewEspecie] = useState({
    scientific_name: '',
    common_name: '',
    category_id: '',
    time_to_production: ''
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
    const fetchCategory = async () => {
      try {
        const data = await CategoryService.getAllCategory();
        setCategoryList(data);
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching Category:', error);
      }
    };


    fetchCategory();
  }, []);

  useEffect(() => {
    setIsLoading(true)

    const fetchEspecies = async () => {
      const decodedToken = await getDecodedToken();
      setUserRoles(decodedToken.roles?.map(role => role.name) || []);

      const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : idcompanyLST.value;
      if (!companyId) {
        setSpeciesList([]);
        return;
      }
      try {
        const data = await SpeciesService.getAllSpecie(companyId, {});
        
        if (data.statusCode === 404) {
          setShowErrorAlertTable(true)
          setMessageAlert('Esta empresa no tiene categorías registradas, Intentalo con otra empresa');
          setSpeciesList([]);
        } else {
          setShowErrorAlertTable(false)
          setSpeciesList(Array.isArray(data) ? data : []);
          setIsLoading(false)
        }

        if (data.length == 0) {
          setShowErrorAlertTable(true)
          setMessageAlert('Esta empresa no tiene categorías registradas, Intentalo con otra empresa');
          setSpeciesList([]);
        }
      } catch (error) {
        setSpeciesList([])
        console.error('Error fetching especies:', error);
        setMessageAlert('Esta empresa no tiene especies registradas, Intentalo con otra empresa');
        setShowErrorAlertTable(true);
      }
    };

    fetchEspecies();
  }, [selectedCompanyUniversal], {});

  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption ? selectedOption.value : null);
  };

  const handleSearchChange = (e) => {
    setSearchCompanyTerm(e.target.value);
  };

  const handleEspecieSelect = (especie) => {
    setSelectedCompany(especie.company_id);
  };

  const handleCloseErrorAlert = () => {
    setShowErrorAlertTable(false);
  };



  const filteredEspecie = speciesList.filter(especie =>
    (especie.scientific_name && especie.scientific_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (especie.common_name && especie.common_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (especie.type_especie_id && especie.type_especie_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (especie.time_to_production && especie.time_to_production.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  // Paginación
  const indexOfLastEspecie = currentPage * itemsPerPage;
  const indexOfFirstEspecie = indexOfLastEspecie - itemsPerPage;
  const currentSpecies = filteredEspecie.slice(indexOfFirstEspecie, indexOfLastEspecie);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredEspecie.length / itemsPerPage)) {
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

  const handleOpenModal = (especie = null, mode = 'create') => {
    setSelectedEspecie(especie);
    setModalMode(mode);
    if (mode === 'edit' || mode === 'view') {
      setNewEspecie(especie);
    } else {
      setNewEspecie({
        icon: '',
        scientific_name: '',
        common_name: '',
        category_id: '',
        time_to_production: [],

      });
    }
    setIsModalOpen(true);
  };

  // Cerrar el modal
  const closeModal = async () => {
    setIsModalOpen(false);
    setSelectedEspecie(null);
    setModalMode('create');
    updateService();
  };

  //eliminar
  const handleDelete = (species) => {
    setSelectedEspecie(species);
    setIsDeleteModalOpen(true);
  };

  const showErrorAlertSuccess = (message) => {
    setShowErrorAlert(true)
    setMessageAlert(`Especie ${message} exitosamente`);

    setTimeout(() => {
      setShowErrorAlert(false)
    }, 2500);
  }

  const showErrorAlertFailure = (message) => {
    setShowErrorAlert(true);
    setMessageAlert(`La especie se ${message} exitosamente`);

    setTimeout(() => {
      setShowErrorAlert(false);
    }, 2500);
  };


  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);
    setSelectedEspecie(null);

    try {

      const data = await SpeciesService.deleteSpecie(selectedEspecie.id);

      if (data.success) {
        showErrorAlertSuccess("eliminado");
        updateService();
      } else {
        console.error('La especie se elimino correctamente ', data);
        showErrorAlertFailure("eliminó");
      }
    } catch (error) {
      updateService();
      console.error('La especie se elimino correctamente ', error);
      showErrorAlertFailure("elimino");
    }
  };




  const handleCancelDelete = () => {
    setSelectedEspecie(null);
    setIsDeleteModalOpen(false);
  };
  const handleCloseAlert = () => {
    setShowErrorAlert(false);
  };

  const updateService = async () => {
    setShowErrorAlertTable(false);
    // setSpeciesList([]);
    if (!companyId) {
      setSpeciesList([]);
      return;
    } else {
      setNameCompany(selectedCompanyUniversal.label)
    }

    try {
      const data = await SpeciesService.getAllSpecie(companyId, {});
      if (data.statusCode === 404) {
        setSpeciesList([]);
      } else {
        setShowErrorAlertTable(false)
        setSpeciesList(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      setSpeciesList([])
      console.error('Error fetching especies:', error);
      setMessageAlert('Esta empresa no tiene especies registradas, Intentalo con otra empresa');
      setShowErrorAlertTable(true);
    }

  };

  const handleEditSpecie = (species) => {
    navigate(`../editarLista/${species.id}`);
  };
  const handleViewSpecie = (species) => {
    navigate(`../visualizarLista/${species.id}`);
  };




  return (
    <div className="table-container containerEmporesa">
      <div className="">
        <div className="flex items-center space-x-2 text-gray-700">
          <ImEqualizer2 size={20} />
          <span>Gestión de Especies</span>
          <span>/</span>
          <span>Lista de Especies</span>
          <span>/</span>
          <span className="text-black font-bold">   {nameCompany ? nameCompany : ''}</span>
          <span className="text-black font-bold">  </span>
          {selectedCompanyUniversal && (
            <span>{companyList.find(company => company.id === selectedCompanyUniversal)?.name}</span>
          )}
        </div>
      </div>


      {isLoading ? (
        <LoadingView />
      ) : (
        <>
          <div className="relative w-full mt-6 py-5 z-0">
            {/* Input de búsqueda */}
            <input
              type="text"
              placeholder="Buscar Especie"
              className="w-full border border-gray-300 p-2 pl-10 pr-4 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

          </div>
          <div className="bg-white  rounded-lg shadow ">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Lista de Especies</h2>
              <button className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center" onClick={() => navigate('../crearLista')}>

                Crear Especie
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full ">
                <thead className="bg-gray-300  ">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider ">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Icono</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre común</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre cientifíco</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo producción</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentSpecies.map((species, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {species.photo && (
                          <img
                            src={species.photo}
                            alt={species.common_name}
                            className="h-10 w-10 object-cover rounded-full"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{species.common_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{species.scientific_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {species.category && species.category.name ? species.category.name : 'Categoría no disponible'}
                        </span>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {species.stages?.map((stage, stageIndex) => (
                      <div key={stageIndex}>
                        {Math.round(stage.time_to_production / 30)} meses
                      </div>
                    ))}
                  </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(() => {
                          const totalTimeInDays = species.stages?.reduce((totalTime, stage) => {
                            return totalTime + stage.time_to_production;
                          }, 0);

                          const months = Math.floor(totalTimeInDays / 30); // Meses completos
                          const days = totalTimeInDays % 30; // Días restantes

                          if (months === 0) {
                            return `${days} día${days !== 1 ? "s" : ""}`;
                          } else if (days === 0) {
                            return `${months} mes${months !== 1 ? "es" : ""}`;
                          } else {
                            return `${months} mes${months !== 1 ? "es" : ""} y ${days} día${days !== 1 ? "s" : ""}`;
                          }
                        })()}
                      </td>




                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className=" text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleViewSpecie(species, 'view')}>
                          <Eye size={18} />
                        </button>
                        <button className=" text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleEditSpecie(species)}>
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(species)} className=" text-[#168C0DFF] px-2 py-2 rounded">
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
                  message={`¿Seguro que desea eliminar la especie ${selectedEspecie?.common_name}?`}
                  onCancel={handleCancelDelete}
                  onConfirm={handleConfirmDelete}
                />
              )}
            </div>
          </div>
          <div className="flex items-center py-2 justify-between border border-gray-200 p-2 rounded-md bg-white">
            <div className="border border-gray-200 rounded py-2 text-sm m-2">
              <span>Cantidad de filas</span>
              <select className="text-xs"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
            </div>
            <div className="pagination-controls text-xs flex items-center space-x-2">
              <span>{indexOfFirstEspecie + 1}-{indexOfLastEspecie} de {speciesList.length}</span>
              <button className="mr-2 border border-gray-200 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
                onClick={handlePrevPage} disabled={currentPage === 1}>
                <IoIosArrowBack size={20} />
              </button>
              <button className="border border-gray-200 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
                onClick={handleNextPage}
                disabled={currentPage === Math.ceil(speciesList.length / itemsPerPage)}>
                <IoIosArrowForward size={20} />
              </button>
            </div>
          </div>
        </>
      )}


      {/* Modalcrear-editar-visualizar*/}
      {/* {isModalOpen && (
        <GenericModal
          title={modalMode === 'edit' ? 'Editar Especie' : modalMode === 'view' ? 'Ver Cariable' : 'Añadir Especie'}
          onClose={closeModal}

          companyId={selectedCompany} >

          <FormEspecie showErrorAlert={showErrorAlertSuccess} onUpdate={updateService} especie={newEspecie} mode={modalMode} closeModal={closeModal} />
        </GenericModal>
      )} */}
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

      {showErrorAlert && (
        <div className="alert-container">
          {messageAlert && <SuccessAlert message={messageAlert} onCancel={closeModal} />}
        </div>
      )}

      {/* {showErrorAlertTable && (
        <div className="alert-container">
          <ErrorAlert message={messageAlert} onCancel={closeModal} />
        </div>
      )} */}





    </div>
  );
};

export default ListaEspecies;
