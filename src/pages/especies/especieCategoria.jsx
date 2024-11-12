import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Edit, Trash, Eye } from 'lucide-react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import Delete from '../../components/delete';
import GenericModal from '../../components/genericModal';
import FormCategory from './FormSpecies/formCategory';
import SuccessAlert from "../../components/alerts/success";
import LoadingView from '../../components/Loading/loadingView';
import CategoryServices from "../../services/CategoryService";

const Especie = () => {
  const navigate = useNavigate();
  const [categoryList, setCategoryList] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [newCategory, setNewCategory] = useState({
    name: '',
    image: '',
    stages: '',
    subcategories: ''
  });

  useEffect(() => {
    fetchCategory();
  }, []);


  const fetchCategory = async () => {
    setIsLoading(true);
    try {
      const response = await CategoryServices.getAllCategory();
      const data = response.data;
      console.log('datos categoria ', data)
      if (Array.isArray(data)) {
        setCategoryList(data);
      } else {
        setCategoryList([]);
      }
    } catch (error) {
      console.error('Error fetching Category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategory = Array.isArray(categoryList)
    ? categoryList.filter(category =>
      (category.name && category.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (category.subcategories && category.subcategories.some(sub => sub.name.toLowerCase().includes(searchTerm.toLowerCase())))
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

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
    await CategoryServices.deleteCategory(selectedCategory.id);
    setMessageAlert("Categoria eliminada exitosamente");
    showErrorAlertSuccess("eliminado");
    fetchCategory();
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



  const showErrorAlertSuccess = (message) => {
    setShowErrorAlert(true);
    setMessageAlert(`Categoría ${message} exitosamente`);
    setTimeout(() => setShowErrorAlert(false), 2500);
  };

  // Función para actualizar la lista de empresas
  const updateCategory = async () => {
    try {
      const data = await CategoryServices.getAllCategory();

      setCategoryList(data); 
    } catch (error) {
      console.error('Error al actualizar las categorias:', error);
    }
  };

  const handleEditCategory = (category) => {
    navigate('../editarCategoria', { state: { categoryData: category, mode: 'edit' } });
  };


  return (
    <div className="table-container">
      {isLoading && <LoadingView />}
      <div className="absolute transform -translate-y-20 right-30 w-1/2">
        <IoSearch className="absolute left-3 top-3 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar categoría "
          className="w-full border border-gray-300 p-2 pl-10 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategorías</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Etapas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentCategories.map((category) => (
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
                    <span className="text-[#168C0DFF] border-b-2 underline  font-bold bg-blue-50 px-2 py-1 rounded-md">
                      {category.subcategories.length}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="text-cyan-500 border-b-2 underline font-bold bg-blue-50 px-2 py-1 rounded-md">
                      {category.stages.length}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="bg-customGreen text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleOpenModal(category, 'view')}>
                      <Eye size={18} />
                    </button>
                    <button className="bg-customGreen text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleEditCategory(category)}>
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(category)} className="bg-customGreen text-[#168C0DFF] px-2 py-2 rounded">
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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

      {isDeleteModalOpen && (
        <Delete
          message={`¿Estás seguro de que quieres eliminar la categoría ${selectedCategory.name}?`}
          isOpen={isDeleteModalOpen}
          onConfirm={handleConfirmDelete}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
      {showErrorAlert && <SuccessAlert message={messageAlert} onClose={() => setShowErrorAlert(false)} />}
    </div>
  );
};

export default Especie;
