import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Edit, Trash, Eye } from 'lucide-react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import Delete from '../../components/delete';
import GenericModal from '../../components/genericModal';
import FormCategory from './components/formCategory';
import SuccessAlert from "../../components/alerts/success";
import ErrorAlert from "../../components/alerts/error";
import LoadingView from '../../components/Loading/loadingView';
import CategoryServices from "../../services/CategoryService";
import CompanyServices from "../../services/CompanyService";


import { HiOutlineUserGroup } from "react-icons/hi";
import { IoIosWarning } from 'react-icons/io';


import { BiWorld } from "react-icons/bi";
import CompanySelector from "../../components/shared/companySelect";
import { useCompanyContext } from "../../context/CompanyContext";
import { getDecodedToken } from "../../utils/auseAuth";
import { Tooltip } from "react-tooltip";


const Especie = () => {


  const navigate = useNavigate();

  const [idcompanyLST, setIdcompanyLST] = useState(JSON.parse(localStorage.getItem('selectedCompany')));
  const { selectedCompanyUniversal, hiddenSelect } = useCompanyContext();

  const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [searchcompanyTerm, setSearchCompanyTerm] = useState("");
  const [nameCompany, setNameCompany] = useState(idcompanyLST.label);
  const [showErrorAlertTable, setShowErrorAlertTable] = useState(false);

  const [categoryList, setCategoryList] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubategory, setSelectedSubategory] = useState(null);
  const [selectedStages, setSelectedStages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [userRoles, setUserRoles] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    image: '',
    stages: '',
    subcategories: ''
  });

  useEffect(() => {
    hiddenSelect(true)
    const fetchCompanies = async () => {
      try {
        const data = await CompanyServices.getAllCompany();
        setCompanyList(data);
      } catch (error) {
        console.error('Error fetching companies:', error);

      }
    };

    fetchCompanies();
  }, []);

  // useEffect(() => {
  //   fetchCategory();
  // }, []);


  useEffect(() => {
    setIsLoading(true)
    const fetchCategory = async () => {

      const decodedToken = await getDecodedToken();
      setUserRoles(decodedToken.roles?.map(role => role.name) || []);
      const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : idcompanyLST.value;
      if (!companyId) {
        setCategoryList([]);
        return;
      }

      try {
        const data = await CategoryServices.getAllCategory(companyId);
        if (data.statusCode == 404) {
          setCategoryList([]);
          setMessageAlert('Esta empresa no tiene categorías registradas, Intentalo con otra empresa');
          setShowErrorAlertTable(true)
        } else {
          setShowErrorAlertTable(false)
          setIsLoading(false)
          setCategoryList(Array.isArray(data.data) ? data.data : []);
        }
        setIsLoading(false)

      } catch (error) {
        setCategoryList([])
        setIsLoading(false)
        console.error('Error fetching categories:', error);
        setMessageAlert('Esta empresa no tiene categorías registradas, Intentalo con otra empresa');
        setShowErrorAlertTable(true);
      }
    };

    fetchCategory();
  }, [selectedCompanyUniversal]);



  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption ? selectedOption.value : null);
  };

  const handleSearchChange = (e) => {
    setSearchCompanyTerm(e.target.value);
  };

  const handleVariableSelect = (categoria) => {
    setSelectedCompany(categoria.company_id);
  };

  const handleCloseErrorAlert = () => {
    setShowErrorAlertTable(false);
  };


  const filteredCategory = Array.isArray(categoryList)
    ? categoryList.filter(category =>
      // Filtro por nombre de la categoría
      (category.name && category.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      // Filtro por subcategorías que coincidan con el término de búsqueda
      (category.subcategories && category.subcategories.some(sub => sub.name.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      // Filtro por cantidad de subcategorías si el término es un número
      (!isNaN(searchTerm) &&
        category.subcategories &&
        category.subcategories.length === parseInt(searchTerm))
    )
    : [];


  const indexOfLastCategory = currentPage * itemsPerPage;
  const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
  const currentCategories = filteredCategory.slice(indexOfFirstCategory, indexOfLastCategory);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredCategory.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };





  const handleDeleteCategory = (category) => {
    setSelectedCategory(category);
    setSelectedSubategory(category);
    setSelectedStages(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;

    try {
      setIsDeleteModalOpen(false);

      await CategoryServices.deleteCategory(selectedCategory.id);

      // Mensaje de éxito
      const successMessage = "Categoría eliminada exitosamente";
      setMessageAlert(successMessage);
      showErrorAlertSuccess(successMessage);

      // Actualiza la lista de categorías
      updateService();
    } catch (error) {
      updateService();

      // Determina el mensaje según el tipo de error
      let errorMessage;
      if (error.response && error.response.status === 500) {
        errorMessage =
          "Esta categoría no se puede eliminar porque tiene etapas y subcategorías asociadas.";
      } else {
        errorMessage = "Esta categoría no se puede eliminar porque ya etsa asociada a una especie.";
      }

      // Muestra la alerta de error con el mensaje adecuado
      showErrorAlertError(errorMessage);
    }
  };

  const showErrorAlertSuccess = (message) => {
    setShowErrorAlert(true);
    setMessageAlert(message); // Mensaje de éxito
    setTimeout(() => setShowErrorAlert(false), 2500);
  };

  const showErrorAlertError = (message) => {
    setShowErrorAlert(true);
    setMessageAlert(message); // Mensaje personalizado según el error
    setTimeout(() => setShowErrorAlert(false), 3000);
  };


  const handleCancel = () => {
    setShowErrorAlert(false);
  };


  const handleOpenModal = (category = null, mode = 'create') => {
    setSelectedCategory(category);
    setModalMode(mode);
    setNewCategory(category || {
      name: '',
      image: '',
      stages: '',
      subcategories: ''
    });
    setIsModalOpen(true);
  };

  const handleCloseAlert = () => {
    setShowErrorAlert(false);
  };

  const updateService = async () => {
    try {
      const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : idcompanyLST.value;
      if (!companyId) {
        setCategoryList([]);
        return;
      }

      const data = await CategoryServices.getAllCategory(companyId);
      setCategoryList(data.data);
    } catch (error) {
      console.error('Error al actualizar las categorías:', error);
    }
  };

  const handleEditCategory = (category) => {
    navigate(`../editarCategoria/${category.id}`);
  };
  const handleViewCategory = (category) => {
    navigate(`../visualizarCategoria/${category.id}`);
  };


  return (
    <div className="table-container containerEmporesa">
      <div className="">
        <div className="flex items-center space-x-2 text-gray-700">
          <BiWorld size={20} />
          <span>Gestión de especies</span>
          <span>/</span>
          <span>Categoría</span>
          <span>/</span>
          <span className="text-black font-bold">   {nameCompany ? nameCompany : ''}</span>
          <span className="text-black font-bold">  </span>
          {selectedCompany && (
            <span>{companyList.find(company => company.id === selectedCompany)?.name}</span>
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
              placeholder="Buscar Categoría"
              className="w-full border border-gray-300 p-2 pl-10 pr-4 rounded-md" // Añadido padding a la izquierda para espacio para el icono
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Icono de búsqueda alineado a la izquierda */}
          </div>
          <div className="bg-white rounded-lg shadow">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Lista de categorías</h2>
              <button className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center" onClick={() => navigate('../crearCategoria')}>
                Crear categoría
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Icono</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Nombre categoría</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Subcategorías</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Etapas</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="h-12 w-12 object-cover rounded-full"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-500">Sin imagen</span>
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {category.name}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold text-[#168C0DFF] bg-blue-50">
                          {category.subcategories.length} subcategoría(s)
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold text-cyan-600 bg-cyan-50">
                          {category.stages.length} etapa(s)
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-1">
                        {/* Botón Ver Detalles */}
                        <button
                          data-tooltip-id="tooltip-ver-categoria"
                          data-tooltip-content="Ver Detalles"
                          className="text-[#168C0DFF] px-2 py-2 rounded hover:bg-gray-100"
                          onClick={() => handleViewCategory(category, 'view')}
                        >
                          <Eye size={18} />
                        </button>

                        {/* Botón Editar */}
                        <button
                          data-tooltip-id="tooltip-editar-categoria"
                          data-tooltip-content="Editar Categoría"
                          className="text-[#168C0DFF] px-2 py-2 rounded hover:bg-gray-100"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit size={18} />
                        </button>

                        {/* Botón Eliminar */}
                        <button
                          data-tooltip-id="tooltip-eliminar-categoria"
                          data-tooltip-content="Eliminar Categoría"
                          className="text-[#168C0DFF] px-2 py-2 rounded hover:bg-gray-100"
                          onClick={() => handleDeleteCategory(category)}
                        >
                          <Trash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Tooltips para los botones de acciones */}
              <Tooltip id="tooltip-ver-categoria" place="top" effect="solid" />
              <Tooltip id="tooltip-editar-categoria" place="top" effect="solid" />
              <Tooltip id="tooltip-eliminar-categoria" place="top" effect="solid" />

            </div>
          </div>
          <div className="flex items-center py-2 justify-between border border-gray-200 p-2 rounded-md bg-white">
            <div className="pagination-info text-sm flex items-center space-x-2">
              <span>Cantidad de filas</span>
              <select className="border border-gray-200 rounded py-2 text-sm m-2"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
            </div>
            <div className="pagination-controls text-xs flex items-center space-x-2">
              <span>{indexOfFirstCategory + 1}-{indexOfLastCategory} de {categoryList.length}</span>
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="mr-2 border border-gray-200 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
              >
                <IoIosArrowBack size={20} />
              </button>
              <button onClick={handleNextPage}
                disabled={currentPage === Math.ceil(categoryList.length / itemsPerPage)}
                className="border border-gray-200 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
              >
                <IoIosArrowForward size={20} />
              </button>
            </div>
          </div>

        </>
      )}

      {isDeleteModalOpen && (
        <Delete
          message={`¿Estás seguro de que quieres eliminar la categoría ${selectedCategory.name}?`}
          isOpen={isDeleteModalOpen}
          onConfirm={handleConfirmDelete}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
      {showErrorAlert && (
        <div className="alert-container">
          {messageAlert.includes("exitosamente") ? (
            <SuccessAlert message={messageAlert} />
          ) : (
            <ErrorAlert message={messageAlert}
              onCancel={handleCancel} />
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

export default Especie;