import React, { useEffect, useState } from "react";
import { Edit, Trash, Eye, Plus } from 'lucide-react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiPlusCircle } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import Delete from '../../components/delete';
import GenericModal from '../../components/genericModal';
import FormUser from './FormUser/formUser';
import UsersService from "../../services/UserService";
import CompanyService from "../../services/CompanyService";
import UploadToS3 from "../../config/UploadToS3";
import SuccessAlert from "../../components/alerts/success";
import { IoSearch } from "react-icons/io5";
import LoadingView from '../../components/Loading/loadingView';

import { HiOutlineUserGroup } from "react-icons/hi";
import { IoIosWarning } from 'react-icons/io';


import Select from "react-select";
import CompanySelector from "../../components/shared/companySelect";
import { useCompanyContext } from "../../context/CompanyContext";


const Usuario = () => {

  const { selectedCompanyUniversal } = useCompanyContext();
  // const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [searchcompanyTerm, setSearchCompanyTerm] = useState("");
  const [nameCompany, setNameCompany] = useState("");
  const { hiddenSelect } = useCompanyContext();

  const [usersList, setUsersList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showErrorAlertTable, setShowErrorAlertTable] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    documentType: '',
    registrationDate: '',
    roles: ''
  });


  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    hiddenSelect(true)

    const fetchCompanies = async () => {
      try {
        const data = await CompanyService.getAllCompany();
        console.log("Fetched companies:", data);
        setCompanyList(data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);


























  

  useEffect(() => {
    const fetchUsersList = async () => {

      const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : '';

      if (!companyId) {
        setUsersList([]);
        return;
      } else {
        setNameCompany(selectedCompanyUniversal.label)
      }

      try {
        const data = await UsersService.getAllUser(companyId);
        if (data.statusCode === 404) {
          setUsersList([]);
        } else {
          setShowErrorAlertTable(false)
          setUsersList(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        setUsersList([])
        console.error('Error fetching usuarios:', error);
        setMessageAlert('Esta empresa no tiene usuarios registradas, Intentalo con otra empresa');
        setShowErrorAlertTable(true);
      }
    };


    fetchUsersList();
  }, [selectedCompanyUniversal]);

  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption ? selectedOption.value : null);
    console.log("Selected company:", selectedOption ? selectedOption.value : null);
  };


  const handleCloseErrorAlert = () => {
    setShowErrorAlertTable(false);
  };

  const filteredUser = usersList.filter(users =>
    (users.name && users.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (users.email && users.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (users.phone && users.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (users.type_document_id && users.type_document_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (users.created_at && users.created_at.toLowerCase().includes(searchTerm.toLowerCase())) // Cambiar registrationDate a created_at
  );

  // Paginación
  const indexOfLastCompany = currentPage * itemsPerPage;
  const indexOfFirstCompany = indexOfLastCompany - itemsPerPage;
  const currentCompanies = filteredUser.slice(indexOfFirstCompany, indexOfLastCompany);


  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredUser.length / itemsPerPage)) {
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

  // Abrir el modal
  const handleOpenModal = (users = null, mode = 'create') => {
    setSelectedUsers(users);
    setModalMode(mode);
    if (mode === 'edit') {
      setNewUser(users);
    } else if (mode === 'view') {
      setNewUser(users);
    } else {
      setNewUser({
        name: '',
        email: '',
        phone: '',
        company: '',
        documentType: '',
        registrationDate: '',
        roles: ''
      });
    }
    setIsModalOpen(true);
  };

  // Cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    // setCurrentUser(null);
    setModalMode('create');
  };

  // Eliminar
  const handleDelete = (user) => {
    setSelectedUsers(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);
    setSelectedUsers(null);
    const data = await UsersService.deleteUser(selectedUsers.id);
    setMessageAlert("Usuario eliminado exitosamente");
    showErrorAlertSuccess("eliminado")
    updateListUsers()

  };

  const handleCancelDelete = () => {
    setSelectedUsers(null);
    setIsDeleteModalOpen(false);
  };


  const handleCloseAlert = () => {
    setShowErrorAlert(false);
  };


  const updateListUsers = async () => {
    try {

      const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : '';


      if (!companyId) {
        setUsersList([]);
        return;
      }


      const data = await UsersService.getAllUser(companyId);

      setUsersList(data);
    } catch (error) {
      console.error('Error al actualizar los usuarios:', error);
    }
  };


  const showErrorAlertSuccess = (message) => {
    setShowErrorAlert(true)
    setMessageAlert(`Usuario ${message} exitosamente`);

    setTimeout(() => {
      setShowErrorAlert(false)
    }, 2500);
  }

  return (
    <div className="table-container containerEmporesa">
      <div className="mb-5 z-50">
        <div className="flex items-center space-x-2 text-gray-700">
          <HiOutlineUserGroup size={20} />
          <span>Usuarios</span>
          <span className="text-black font-bold"> / {nameCompany ? nameCompany : ''} </span>
          {selectedCompany && (
            <span className="text-black font-bold">
              {companyList.find(company => company.id === selectedCompany)?.name || 'No seleccionado'}
            </span>
          )}
        </div>
      </div>

      <div className="mb-5 buscadorTable">
        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="Buscar Usuario"
          className="w-full border border-gray-300 p-2 pl-10 pr-4 rounded-md" // Añadido padding a la izquierda para espacio para el icono
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-6 border-b seccionNombreBtn">
          <h2 className="text-xl font-semibold">Usuarios</h2>
          <div className="divisor"></div>
          <button className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center" onClick={() => handleOpenModal()}>
            <FiPlusCircle size={20} className="mr-2" />
            Añadir usuario
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-300 ">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider ">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Celular</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Día de registro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentCompanies.map((user, index) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900" style={{ textTransform: 'uppercase' }}>{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.created_at}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex justify-center text-sm leading-5 py-1 font-bold rounded-md ${user?.roles[0]?.name === 'SUPER-ADMINISTRADOR'
                        ? 'text-blue-500 bg-cyan-100 font-bold '
                        : user?.roles[0]?.name === 'ADMINISTRADOR'
                          ? 'text-teal-500 bg-cyan-100 '
                          : user?.roles[0]?.name === 'OPERARIO'
                            ? 'text-[#168C0DFF] bg-cyan-100 '
                            : 'text-gray-500'
                        }`}
                    >
                      {user?.roles[0]?.name}
                    </span>
                  </td>
                  <td className="bg-customGreen text-[#168C0DFF] px- py-2 rounded">
                    <button className="bg-customGreen text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleOpenModal(user, 'view')}>
                      <Eye size={18} />
                    </button>
                    <button className="bg-customGreen text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleOpenModal(user, 'edit')}>
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(user)} className="px-2 py-4 whitespace-nowrap text-sm font-medium">
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Modal de eliminación */}
          {isDeleteModalOpen && (
            <Delete
              message={`¿Seguro que desea eliminar el usuario ${selectedUsers?.name}?`}
              onCancel={handleCancelDelete}
              onConfirm={handleConfirmDelete}
            />
          )}
        </div>
      </div>

      <div className="flex items-center py-2 justify-between border border-gray-200 p-2 rounded-md bg-white">

        <div className="pagination-info text-sm flex items-center space-x-2">
          <span>Cantidad de filas</span>
          <select
            className="border border-gray-200 rounded py-2 text-sm m-2"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>


        <div className="pagination-controls text-xs flex items-center space-x-2">
          <span>{currentPage} de {Math.ceil(usersList.length / itemsPerPage)}</span>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="mr-2 border border-gray-200 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <IoIosArrowBack size={20} />
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(usersList.length / itemsPerPage)}
            className="border border-gray-200 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <IoIosArrowForward size={20} />
          </button>
        </div>
      </div>

      {/* Modal crea,editar,visualizar*/}
      {isModalOpen && (
        <GenericModal
          title={modalMode === 'edit' ? 'Editar Usuario' : modalMode === 'view' ? 'Ver Usuario' : 'Añadir Usuario'}
          onClose={closeModal}>
          <FormUser
            showErrorAlert={showErrorAlertSuccess}
            onUpdate={updateListUsers}
            user={newUser} mode={modalMode} closeModal={closeModal} />
        </GenericModal>
      )}

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

export default Usuario;
