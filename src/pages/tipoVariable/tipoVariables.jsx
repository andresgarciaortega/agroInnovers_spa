import React, { useState } from "react";
import { Edit, Trash, Eye, Plus } from 'lucide-react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiPlusCircle } from "react-icons/fi";
import { IoCloudUploadOutline } from "react-icons/io5";
import Delete from '../../components/delete';
import GenericModal from '../../components/genericModal';
import FormTypeVariable from './FormTypeVariable/formTypeVariable';

const variables = [
  { icon: '01', nameType: 'Peso', descripcion: 'Consumo' },
  { icon: '02', nameType: 'Altura', descripcion: 'Dimensión' },
  { icon: '03', nameType: 'Temperatura', descripcion: 'Clima' },
  { icon: '04', nameType: 'Velociconad', descripcion: 'Movimiento' },
  { icon: '05', nameType: 'Volumen', descripcion: 'Capaciconad' },
  { icon: '06', nameType: 'Distancia', descripcion: 'Longitud' },
  { icon: '07', nameType: 'Presión', descripcion: 'Fuerza'},
  { icon: '08', nameType: 'Tiempo', descripcion: 'Duración' }
];

const TipoVariable = () => {
  const [typeVariables, setTypeVariables] = useState(variables);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTypeVariable, setSelectedTypeVariable] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [newTypeVariable, setNewTypeVariable] = useState({
    icon: '',
    maneType: '',
    descripcion: '',
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
  const indexOfLastTypeVariable = currentPage * itemsPerPage;
  const indexOffIrstTypeVariable = indexOfLastTypeVariable - itemsPerPage;
  const currentCompanies = typeVariables.slice(indexOffIrstTypeVariable, indexOfLastTypeVariable);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(typeVariables.length / itemsPerPage)) {
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
  const handleDelete = (user) => {
    setSelectedCompany(user);
    setIsDeleteModalOpen(true);
  };


  const handleConfirmDelete = () => {
    setTypeVariables(typeVariables.filter((user) => user.name !== selectedCompany.name));
    setIsDeleteModalOpen(false);
    setSelectedCompany(null);
  };


  const handleCancelDelete = () => {
    setSelectedCompany(null);
    setIsDeleteModalOpen(false);
  };


  
  const handleOpenModal = (company = null, mode = 'create') => {
    setSelectedTypeVariable(company);
    setModalMode(mode);
    if (mode === 'edit' || mode === 'view') {
      setNewTypeVariable(company);
    } else {
      setNewTypeVariable({
        name: '',
        type: '',
        unit: '',
        address: '',
        typerecord: '',
      });
    }
    setIsModalOpen(true);
  };

  // Cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTypeVariable(null);
    setModalMode('create');
  };


  return (
    <div className="table-container">
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
              {currentCompanies.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  <img
                      src="../assets/imagenes/logo.jpegg"
                      alt=""
                      className="w-6 h-6 rounded-full mr-2"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{user.nameType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.descripcion}</td>
             
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="view-button mr-5" onClick={() => handleOpenModal(user, 'view')}>
                      <Eye size={18} />
                    </button>
                    <button className="edit-button mr-5" onClick={() => handleOpenModal(user, 'edit')}>
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
          <span>{indexOffIrstTypeVariable + 1}-{indexOfLastTypeVariable} de {typeVariables.length}</span>
          <button className="mr-2 border border-gray-200 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
           onClick={handlePrevPage} disabled={currentPage === 1}>
            <IoIosArrowBack size={20} />
          </button>
          <button className="border border-gray-200 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
           onClick={handleNextPage} disabled={currentPage === Math.ceil(typeVariables.length / itemsPerPage)}>
            <IoIosArrowForward size={20} />
          </button>
        </div>
      </div>

      {/* Modalcrear-editar-visualizar*/}
      
       {isModalOpen && (
        <GenericModal title={modalMode === 'edit' ? 'Editar Variable' : modalMode === 'view' ? 'Ver Cariable' : 'Añadir Variable'} onClose={closeModal}>
          <FormTypeVariable company={newTypeVariable} mode={modalMode} closeModal={closeModal} />
        </GenericModal>
      )}

    </div>
  );
};

export default TipoVariable;
