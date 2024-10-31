import React, { useState } from "react";
import { Edit, Trash, Eye, Plus } from 'lucide-react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiPlusCircle } from "react-icons/fi";
import { IoCloudUploadOutline } from "react-icons/io5";
import Delete from '../../components/delete';

import { X, Upload } from 'lucide-react';

const species = [
  { id: '01', commonName: 'Carpas', scientificName: 'Cyprinus carpio', category: 'Agua dulce', productionTime: '2021-03-19' },
  { id: '02', commonName: 'Tilapia', scientificName: 'Oreochromis niloticus', category: 'Agua dulce', productionTime: '2021-04-15' },
  { id: '03', commonName: 'Trucha', scientificName: 'Oncorhynchus mykiss', category: 'Agua dulce', productionTime: '2021-05-10' },
  { id: '04', commonName: 'Salmon', scientificName: 'Salmo salar', category: 'Agua dulce', productionTime: '2021-06-01' },
  { id: '05', commonName: 'Gambusia', scientificName: 'Gambusia affinis', category: 'Agua dulce', productionTime: '2021-07-12' },
  { id: '06', commonName: 'Bagre', scientificName: 'Ictalurus punctatus', category: 'Agua dulce', productionTime: '2021-08-25' },
  { id: '07', commonName: 'Perca', scientificName: 'Perca fluviatilis', category: 'Agua dulce', productionTime: '2021-09-30' },
  { id: '08', commonName: 'Largemouth Bass', scientificName: 'Micropterus salmoides', category: 'Agua dulce', productionTime: '2021-10-20' },
  { id: '09', commonName: 'Pejerrey', scientificName: 'Odontesthes bonariensis', category: 'Agua dulce', productionTime: '2021-11-15' },
  { id: '10', commonName: 'Mojarra', scientificName: 'Mojarra spp.', category: 'Agua dulce', productionTime: '2021-12-05' }

];

const Especie = ({ onClose, onSubmit }) => {
  const [companies, setCompanies] = useState(species);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [stages, setStages] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [newCompany, setNewCompany] = useState({
    name: '',
    Type: '',
    unit: '',
    typerecord: ''
  });

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCompany((prev) => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Paginación
  const indexOfLastCompany = currentPage * itemsPerPage;
  const indexOfFirstCompany = indexOfLastCompany - itemsPerPage;
  const currentCompanies = companies.slice(indexOfFirstCompany, indexOfLastCompany);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(companies.length / itemsPerPage)) {
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };


  //eliminar
  const handleDelete = (user) => {
    setSelectedCompany(user);
    setIsDeleteModalOpen(true);
  };


  const handleConfirmDelete = () => {
    setCompanies(companies.filter((user) => user.name !== selectedCompany.name));
    setIsDeleteModalOpen(false);
    setSelectedCompany(null);
  };


  const handleCancelDelete = () => {
    setSelectedCompany(null);
    setIsDeleteModalOpen(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleAddStage = () => {
    setStages([...stages, { name: '', description: '' }]);
  };

  const handleStageChange = (index, field, value) => {
    const newStages = [...stages];
    newStages[index][field] = value;
    setStages(newStages);
  };

  const handleRemoveStage = (index) => {
    setStages(stages.filter((_, i) => i !== index));
  };

  const handleAddSubcategory = () => {
    setSubcategories([...subcategories, { name: '' }]);
  };

  const handleSubcategoryChange = (index, value) => {
    const newSubcategories = [...subcategories];
    newSubcategories[index].name = value;
    setSubcategories(newSubcategories);
  };

  const handleRemoveSubcategory = (index) => {
    setSubcategories(subcategories.filter((_, i) => i !== index));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ name, image, stages, subcategories });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewCompany((prevCompany) => ({
      ...prevCompany,
      [name]: value,
    }));
  };

  const handleCreateOrEditCompany = (event) => {
    event.preventDefault();
    if (modalMode === "create") {
      const newCompanyData = {
        id: (companies.length + 1).toString().padStart(2, '0'),
        ...newCompany,
        date: new Date().toLocaleDateString(),
      };
      setCompanies([...companies, newCompanyData]);
    } else if (modalMode === "edit") {
      const updatedCompanies = companies.map(variables =>
        variables.id === newCompany.id ? newCompany : variables
      );
      setCompanies(updatedCompanies);
    }
    handleCloseModal();
  };


  return (
    <div className="table-container">
      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Lista de categorías</h2>
          <button className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center" onClick={handleOpenModal}>
            {/* <FiPlusCircle size={20} className="mr-2" /> */}
            Crear categoría
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-300 ">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider ">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre común</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre cientifico</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo producción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentCompanies.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 flex items-center">
                    <img
                      src="../assets/imagenes/logo.jpegg"
                      alt=""
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    {user.commonName}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.scientificName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.productionTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="view-button mr-5" onClick={() => handleOpenViewModal(user)}>
                      <Eye size={18} />
                    </button>
                    <button className="edit-button mr-5" onClick={() => handleOpenEditModal(user)}>
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(user)} className="delete-button">
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
              message={`¿Seguro que desea eliminar el usuario ${selectedCompany?.name}?`}
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
          <span>{indexOfFirstCompany + 1}-{indexOfLastCompany} de {companies.length}</span>
          <button className="mr-2" onClick={handlePrevPage} disabled={currentPage === 1}>
            <IoIosArrowBack size={20} />
          </button>
          <button onClick={handleNextPage} disabled={currentPage === Math.ceil(companies.length / itemsPerPage)}>
            <IoIosArrowForward size={20} />
          </button>
        </div>
      </div>

      {/* Modalcrear-editar-visualizar*/}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="bg-[#345246] text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
              <h2 className="text-xl font-semibold">Crear categoría</h2>
              <button onClick={handleCloseModal} className="text-white hover:text-gray-200">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
                  onClick={() => document.getElementById('image-upload').click()}
                >
                  {image ? (
                    <img src={URL.createObjectURL(image)} alt="Category" className="mx-auto h-32 object-contain" />
                  ) : (
                    <div className="text-gray-500">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-1">Subir imagen</p>
                    </div>
                  )}
                </div>
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
                {image && (
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="mt-2 text-red-600 hover:text-red-800"
                  >
                    Eliminar imagen
                  </button>
                )}
              </div>
              <div className="mb-6">
                <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-1">Nombre categoría</label>
                <input
                  type="text"
                  id="category-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Text here"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Etapas</label>
                <button
                  type="button"
                  onClick={handleAddStage}
                  className="mb-2 inline-flex items-center px-3 py-2 border border-green-500 text-sm leading-4 font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Plus size={16} className="mr-2" />
                  Añadir etapas
                </button>
                <div className="space-y-2">
                  {stages.map((stage, index) => (
                    <div key={index} className="p-2 border border-gray-200 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Etapa {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveStage(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={stage.name}
                        onChange={(e) => handleStageChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 mb-2"
                        placeholder="Nombre de etapa"
                      />
                      <input
                        type="text"
                        value={stage.description}
                        onChange={(e) => handleStageChange(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="Descripción de etapa"
                      />
                    </div>
                  ))}
                </div>
              </div>
              {stages.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subcategorías</label>
                  <button
                    type="button"
                    onClick={handleAddSubcategory}
                    className="mb-2 inline-flex items-center px-3 py-2 border border-green-500 text-sm leading-4 font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Plus size={16} className="mr-2" />
                    Añadir subcategorías
                  </button>
                  <div className="space-y-2">
                    {subcategories.map((subcategory, index) => (
                      <div key={index} className="p-2 border border-gray-200 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Subcategoría {index + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubcategory(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={subcategory.name}
                          onChange={(e) => handleSubcategoryChange(index, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                          placeholder="Nombre subcategoría"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#168C0DFF] hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Crear categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Especie;
