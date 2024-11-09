import React, { useState, useEffect } from "react";
import { Edit, Trash, Eye, Plus } from 'lucide-react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiPlusCircle } from "react-icons/fi";
import { IoCloudUploadOutline } from "react-icons/io5";
import Delete from '../../components/delete';
import GenericModal from '../../components/genericModal';
import FormCategory from './FormSpecies/formCategory';
import SuccessAlert from "../../components/alerts/success";
import { IoSearch } from "react-icons/io5";
import LoadingView from '../../components/Loading/loadingView';
import CategoryServices from "../../services/CategoryService";

const Especie = () => {
  const [categoryList, setCategoryList] = useState([]); // Cambié los datos 'quemados' por un estado vacío.
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    image: '',
    stages: '',
    subcategories: ''
  });

  // Función para cargar los datos desde la API
  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true);
      try {
        const data = await CategoryServices.getAllCategory();
        setCategoryList(data);
      } catch (error) {
        console.error('Error fetching Category:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, []);

  // Función de búsqueda que filtra categoryList según el searchTerm
  const filteredCategory = categoryList.filter(category =>
    (category.name && category.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (category.subcategories && category.subcategories.toLowerCase().includes(searchTerm.toLowerCase()))  // Cambiar registrationDate a created_at
  );

  // Paginación
  const indexOfLastCompany = currentPage * itemsPerPage;
  const indexOfFirstCompany = indexOfLastCompany - itemsPerPage;
  const currentCompanies = filteredCategory.slice(indexOfFirstCompany, indexOfLastCompany);

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

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };


  // Eliminar
  const handleDelete = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
    const data = await CategoryServices.deleteCategory(selectedCategory.id);
    setMessageAlert("Categoria eliminada exitosamente");
    showErrorAlertSuccess("eliminado");
    updateCategory();

  };

  const handleCancelDelete = () => {
    setSelectedCategory(null);
    setIsDeleteModalOpen(false);
  };
  const handleCloseAlert = () => {
    setShowErrorAlert(false);
  };

  const handleOpenModal = (category = null, mode = 'create') => {
    setSelectedCategory(category);
    setModalMode(mode);
    if (mode === 'edit' || mode === 'view') {
      setNewCategory(category);
    } else {
      setNewCategory({
        name: '',
        image: '',
        stages: '',
        subcategories: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setModalMode('create');
    updateCategory();
  };

   // Función para actualizar la lista de categorias
   const updateCategory = async () => {
    try {
      const data = await CategoryServices.getAllCategory();
      setCategoryList(data); // Actualiza typevariableList con los datos más recientes
    } catch (error) {
      console.error('Error al actualizar la lista de categoria:', error);
    }
  };

  const showErrorAlertSuccess = (message) => {
    setShowErrorAlert(true)
    setMessageAlert(`Categoría ${message} exitosamente`);

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
          <h2 className="text-xl font-semibold">Lista de categorías</h2>
          <button className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center" onClick={handleOpenModal}>
            Crear categoría
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-300 ">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre subcategoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Etapas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentCompanies.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 flex items-center space-x-2">
                    {category.image && (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-10 w-10 object-cover rounded-full"
                      />
                    )}
                    <span>{category.name}</span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <ul>
                      {category.stages.map((stage, index) => (
                        <div key={index}>
                          {stage.subcategories.map((subcategory, subIndex) => (
                            <li key={subIndex} className="list-disc pl-4">
                              {subcategory.name}
                            </li>
                          ))}
                        </div>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {/* {category.stages.map((stage, index) => (
                      <div key={index}>{stage.name}</div> */}
                    {/* ))} */}
                    <span className="text-cyan-500 border-b-2 underline font-bold bg-blue-50 px-2 py-1 rounded-md">
                      {category.stages.length}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="view-button mr-5" onClick={() => handleOpenModal(category)}>
                      <Eye size={18} />
                    </button>
                    <button className="edit-button mr-5" onClick={() => handleOpenModal(category)}>
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(category)} className="delete-button">
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Modal eliminación */}
          {isDeleteModalOpen && (
            <Delete
              message={`¿Seguro que desea eliminar el usuario ${selectedCategory?.name}?`}
              onCancel={handleCancelDelete}
              onConfirm={handleConfirmDelete}
            />
          )}
        </div>
      </div>
      <div className="pagination-container">
        <div className="pagination-info text-xs">
          <span>Cantidad de filas</span>
          <select className="text-xs" value={itemsPerPage} onChange={handleItemsPerPageChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
        <div className="pagination-controls text-xs ">
          <span>{indexOfFirstCompany + 1}-{indexOfLastCompany} de {categoryList.length}</span>
          <button className="mr-2" onClick={handlePrevPage} disabled={currentPage === 1}>
            <IoIosArrowBack size={20} />
          </button>
          <button onClick={handleNextPage} disabled={currentPage === Math.ceil(categoryList.length / itemsPerPage)}>
            <IoIosArrowForward size={20} />
          </button>
        </div>
      </div>

      {/* Modal crear-editar-visualizar */}
      {isModalOpen && (
        <GenericModal
          title={modalMode === 'edit' ? 'Editar Especie' : modalMode === 'view' ? 'Ver Especie' : 'Añadir Especie'}
          onClose={closeModal}
        >
          <FormCategory
            species={newCategory}
            mode={modalMode}
            closeModal={closeModal}
          />
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

export default Especie;
