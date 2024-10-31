import React, { useState } from "react";
import { Edit, Trash, Eye, Plus } from 'lucide-react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { IoCloudUploadOutline } from "react-icons/io5";
import Delete from '../../components/delete';

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

const ListaEspecies = () => {
  const [companies, setCompanies] = useState(species);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const navigate = useNavigate();
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

  // Abrir Crear
  //   const handleNavigate = () => {
  //     navigate('/');
  //   };

  // Abrir Editar
  const handleOpenEditModal = (variables) => {
    setModalMode("edit");
    setNewCompany(variables);
    setIsModalOpen(true);
  };

  // Abrir Visualizar
  const handleOpenViewModal = (variables) => {
    setModalMode("view");
    setNewCompany(variables);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewCompany({
      name: '',
      Type: '',
      unit: '',
      typerecord: ''

    });
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
          <h2 className="text-xl font-semibold">Especies</h2>
          <button
            className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center"
            onClick={() => navigate('../crearLista')}
          >
            Crear especie
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
        <div className="modal">
          <div className="modal-content">
            <h2 className="titlee">
              {modalMode === "create" ? "Añadir Variable" : modalMode === "edit" ? "Editar Variable" : "Visualizar Variable"}
            </h2>
            <form onSubmit={handleCreateOrEditCompany}>
              <div className="mb-6 py-5">
                <label>Adjuntar Logo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50" onClick={() => document.getElementById('logo-upload').click()}>
                  {newCompany.logo ? (
                    <img src={newCompany.logo} alt="Company Logo" className="mx-auto h-20 object-contain" />
                  ) : (
                    <>
                      <IoCloudUploadOutline className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-600">
                        Haga <span className="text-cyan-500 underline">clic aquí</span> para cargar o arrastre y suelte
                      </p>
                      <p className="text-xs text-gray-500">Archivos máximo 10 mb</p>
                    </>
                  )}
                </div>
                <input id="logo-upload" type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
              </div>
              <div >
                <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 ">Nombre de la variable</label>
                <input
                  type="text"
                  id="company-name"
                  name="name"
                  value={newCompany.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-5">
                <div>
                  <label htmlFor="company-name" className="block text-sm font-medium text-gray-700">Unidad de medida</label>
                  <input
                    type="text"
                    id="company-name"
                    name="unit"
                    value={newCompany.unit}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="company-email" className="block text-sm font-medium text-gray-700">Tipo de registro</label>
                  <input
                    type="email"
                    id="company-email"
                    name="typerecord"
                    value={newCompany.typerecord}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>

              </div>
              <div className="mt-5">
                <label htmlFor="document" className="block text-sm font-medium text-gray-700">Tipo de variable</label>
                <input
                  type="text"
                  id="document"
                  name="Type"
                  value={newCompany.Type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div className="modal-actions">
                {modalMode === "view" ? (
                  <button type="button" className="cancelbutton" onClick={handleCloseModal}>
                    Volver
                  </button>
                ) : (
                  <>
                    <button type="button" className="cancelbutton" onClick={handleCloseModal}>
                      Cerrar
                    </button>
                    <button type="submit" className="createbutton">
                      {modalMode === "create" ? "Crear Empresa" : "Guardar Cambios"}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ListaEspecies;
