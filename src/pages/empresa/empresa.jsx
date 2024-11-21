import React, { useEffect, useState } from "react";
import { Edit, Trash, Eye, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiPlusCircle } from "react-icons/fi";
import Delete from '../../components/delete';
import GenericModal from '../../components/genericModal';
import FormCompany from './FormCompany/formCompany';
import CompanyService from "../../services/CompanyService";
import SuccessAlert from "../../components/alerts/success";
import { IoSearch } from "react-icons/io5";
import ErrorAlert from "../../components/alerts/error";
import LoadingView from '../../components/Loading/loadingView';


const Empresa = () => {
  const [companyList, setCompanyList] = useState([]);
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [messageAlert, setMessageAlert] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showSuccessAlertTable, setShowSuccessAlertTable] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    registrationDate: '',
  });

  const [searchTerm, setSearchTerm] = useState("");


  // Cargar empresas cuando el componente se monta
  useEffect(() => {
    const fetchCompanies = async () => {
      
      setIsLoading(true);
      try {
        const data = await CompanyService.getAllCompany();
        setCompanyList(data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }finally {
        setIsLoading(false);
      }
    };
  
    fetchCompanies();
  }, []);


  // Función de búsqueda que filtra companyList según el searchTerm
  const filteredCompanies = companyList.filter(company =>
    (company.name && company.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (company.email_billing && company.email_billing.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (company.phone && company.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (company.location && company.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (company.created_at && company.created_at.toLowerCase().includes(searchTerm.toLowerCase())) // Cambiar registrationDate a created_at
  );


  // Paginación
  const indexOfLastCompany = currentPage * itemsPerPage;
  const indexOfFirstCompany = indexOfLastCompany - itemsPerPage;
  const currentCompanies = filteredCompanies.slice(indexOfFirstCompany, indexOfLastCompany);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredCompanies.length / itemsPerPage)) {
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
  const handleOpenModal = (company = null, mode = 'create') => {
    setSelectedCompany(company);
    setModalMode(mode);
    if (mode === 'edit' || mode === 'view') {
      setNewCompany(company);
    } else {
      setNewCompany({
        name: '',
        email: '',
        mobile: '',
        address: '',
        registrationDate: '',
      });
    }
    setIsModalOpen(true);
  };

  // Cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCompany(null);
    setModalMode('create');
  };

  // Eliminar
  const handleDelete = (company) => {
    setSelectedCompany(company);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);
    setSelectedCompany(null);

    // const data = await CompanyService.deleteCompany(selectedCompany.id);
    const data = await CompanyService.deleteCompany(selectedCompany.id);
if (data.message) {
    setMessageAlert(data.message);
    showErrorAlertr(data.message)
} else {
    setMessageAlert("Empresa eliminada exitosamente");
    showSuccessAlertSuccess("Compañía eliminada correctamente")
}

    
    updateCompanies()
  };

  const handleCancelDelete = () => {
    setSelectedCompany(null);
    setIsDeleteModalOpen(false);
  };

  const handleCloseAlert = () => {
    setShowSuccessAlert(false);
  };


  // Función para actualizar la lista de empresas
  const updateCompanies = async () => {
    try {
      const data = await CompanyService.getAllCompany();

      setCompanyList(data); // Actualiza companyList con los datos más recientes
    } catch (error) {
      console.error('Error al actualizar las empresas:', error);
    }
  };

  const showSuccessAlertSuccess = (message) => {
    setShowSuccessAlert(true)
    setMessageAlert(`Empresa ${message} exitosamente`);

    setTimeout(() => {
      setShowSuccessAlert(false)
    }, 2500);
  }

  const showErrorAlertr = (message) => {
    setShowErrorAlert(true)
    setMessageAlert(`${message}`);

    setTimeout(() => {
      setShowErrorAlert(false)
    }, 2500);
  }

  const handleViewCompany = (companyId) => {
    navigate(`../visualizarEmpresa/${companyId}`);
  };

  return (
    <div className="table-container">
    {isLoading && <LoadingView />}
      {/* Barra de búsqueda */}
      <div className="absolute transform -translate-y-20 right-30 w-1/2 buscadorModulo">
        <IoSearch className="absolute left-3 top-3 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar empresa "
          className="w-full border border-gray-300 p-2 pl-10 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-6 border-b seccionNombreBtn">
          <h2 className="text-xl font-semibold">Empresas</h2>
          <div className="divisor"></div>
          <button className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center" onClick={() => handleOpenModal()}>
            <FiPlusCircle size={20} className="mr-2" />
            Añadir empresa
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentCompanies.map((company, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900" style={{ textTransform: 'uppercase' }}>{company.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.email_billing}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.created_at}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="bg-customGreen text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleViewCompany(company.id)} >
                      <Eye size={18} />
                    </button>
                    <button className="bg-customGreen text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleOpenModal(company, 'edit')}>
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(company)} className="bg-customGreen text-[#168C0DFF] px-2 py-2 rounded">
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
              message={`¿Seguro que desea eliminar la empresa ${selectedCompany?.name}?`}
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
          <span>{currentPage} de {Math.ceil(companyList.length / itemsPerPage)}</span>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="mr-2 border border-gray-200 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <IoIosArrowBack size={20} />
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(companyList.length / itemsPerPage)}
            className="border border-gray-200 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <IoIosArrowForward size={20} />
          </button>
        </div>
      </div>

      {/* Modal crea,editar,visualizar*/}
      {isModalOpen && (
        <GenericModal title={modalMode === 'edit' ? 'Editar Empresa' : modalMode === 'view' ? 'Ver Empresa' : 'Añadir Empresa'} onClose={closeModal}>
          <FormCompany 
          showSuccessAlert={showSuccessAlertSuccess} 
          onUpdate={updateCompanies} 
          company={newCompany}
           mode={modalMode} 
           closeModal={closeModal} />
        </GenericModal>
      )}

      {showSuccessAlert && (
        <SuccessAlert
          message={messageAlert}
          onCancel={handleCloseAlert}
        />
      )}

      {showErrorAlert && (
        <ErrorAlert
          message={messageAlert}
          onCancel={handleCloseAlert}
        />
      )}

    </div>
  );
};

export default Empresa;
