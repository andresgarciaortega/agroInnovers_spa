import React, { useEffect, useState } from "react";
import { Edit, Trash, Eye, Plus } from 'lucide-react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoIosWarning } from 'react-icons/io';
import { FaFilter, FaLock } from 'react-icons/fa'; // Nuevos íconos añadidos
import Delete from '../../components/delete';
import GenericModal from '../../components/genericModal';
import TypeService from "../../services/TypeDispositivosService";
import { ImEqualizer } from "react-icons/im";
import FormActuador from './components/formActuador';
import FormViewActuador from './components/FormViewActuador';
import ActuadorService from "../../services/ActuadorService";
import CompanyService from "../../services/CompanyService";
import SuccessAlert from "../../components/alerts/success";
import { IoSearch } from "react-icons/io5";


import { ImEqualizer2 } from "react-icons/im";


import Select from "react-select";
import CompanySelector from "../../components/shared/companySelect";
import { useCompanyContext } from "../../context/CompanyContext";

const Actuador = () => {
  const [companyList, setCompanyList] = useState([]);
  const [actuadorList, setActuadorList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [searchcompanyTerm, setSearchCompanyTerm] = useState("");
  const { selectedCompanyUniversal } = useCompanyContext();

  const [variableList, setVariableList] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenView, setIsModalOpenView] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [messageAlert, setMessageAlert] = useState("");
  const [nameCompany, setNameCompany] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showErrorAlertTable, setShowErrorAlertTable] = useState(false);
  const [newVariable, setNewVariable] = useState({
    actuatorCode: '',
    activationType: '',
    // icon: '',
    gpsPosition: '',
    inputPort: '',
    readingPort: '',
    description: '',
    accessUsername: '',
    accessPassword: '',
    installationDate: '',
    estimatedChangeDate: '',
    actuatorTypeId: 0,
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

  useEffect(() => {
    const fetchTypeActuador = async () => {
      try {
        const data = await TypeService.getAllActuador();
        setActuadorList(data);
        console.log('tipos de actuadores', data);
      } catch (error) {
        console.error('Error fetching actuatorTypeId actuador:', error);
      }
    };

    fetchTypeActuador();
  }, []);

  // useEffect(() => {
  //   const fetchActuador = async () => {
  //     try {
  //       const data = await ActuadorService.getAllActuador();
  //       setVariableList(data);
  //     } catch (error) {
  //       console.error('Error fetching type actuador:', error);
  //     }
  //   };

  //   fetchActuador();
  // }, []);

  useEffect(() => {
    const fetchActuador = async () => {
      const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : '';
      if (!companyId) {
        setVariableList([]);
        return;
      } else {
        setNameCompany(selectedCompanyUniversal.label)
      }

      try {
        const data = await ActuadorService.getAllActuador(companyId);
        if (data.statusCode === 404) {
          setVariableList([]);
          setMessageAlert('Esta empresa no tiene Actuadores registrados.');
          setShowErrorAlertTable(true);
        } else {
          setShowErrorAlertTable(false)
          setVariableList(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error fetching actuadores:', error);
        setVariableList([]);

        setMessageAlert('Esta empresa no tiene actuadores registradas, Intentalo con otra empresa');
        setShowErrorAlertTable(true);
      }
    };

    fetchActuador();
  }, [selectedCompanyUniversal]);



  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption ? selectedOption.value : null);
  };

  const handleSearchChange = (e) => {
    setSearchCompanyTerm(e.target.value);
  };

  const handleVariableSelect = (actuador) => {
    setSelectedCompany(actuador.company_id);
  };

  const handleCloseErrorAlert = () => {
    setShowErrorAlertTable(false);
  };



  const filteredVariable = Array.isArray(variableList)
    ? variableList.filter(actuador =>
      (actuador.id && actuador.id.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
      (actuador.actuatorCode && actuador.actuatorCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (actuador.actuatorType?.actuatorCode && actuador.actuatorType.actuatorCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (actuador.actuatorType?.brand && actuador.actuatorType.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (actuador.actuatorType?.model && actuador.actuatorType.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (actuador.space && actuador.space.toLowerCase().includes(searchTerm.toLowerCase())) || // Reemplaza "space" por el nombre real si es diferente
      (actuador.subspace && actuador.subspace.toLowerCase().includes(searchTerm.toLowerCase())) || // Reemplaza "subspace" por el nombre real si es diferente
      (actuador.monitoringSystem && actuador.monitoringSystem.toLowerCase().includes(searchTerm.toLowerCase())) // Reemplaza "monitoringSystem" por el nombre real si es diferente
    )
    : [];


  // Paginación
  const indexOfLastVariable = currentPage * itemsPerPage;
  const indexOfFirstVariable = indexOfLastVariable - itemsPerPage;
  const currentCompanies = filteredVariable.slice(indexOfFirstVariable, indexOfLastVariable);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredVariable.length / itemsPerPage)) {
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

  const handleOpenModal = (actuador = null, mode = 'create') => {
    setSelectedVariable(actuador);
    setModalMode(mode);
    if (mode === 'edit' || mode === 'view') {
      setNewVariable(actuador);  // Cargar datos del actuador si estamos editando o visualizando
    } else {
      setNewVariable({
        actuatorCode: '',
        icon: '',
        gpsPosition: '',
        inputPort: '',
        readingPort: '',
        description: '',
        accessUsername: '',
        accessPassword: '',
        installationDate: '',
        estimatedChangeDate: '',
      });
    }
    if (mode === 'view') {
      setIsModalOpenView(true);
    } else {
      setIsModalOpen(true);
    }
  };

  // Cerrar el modal
  const closeModal = async () => {
    setIsModalOpen(false);
    setSelectedVariable(null);
    setModalMode('create');
    setIsModalOpenView(false);
    updateService();
  };

  //eliminar
  const handleDelete = (actuador) => {
    setSelectedVariable(actuador);
    setIsDeleteModalOpen(true);
  };

  const showErrorAlertSuccess = (message) => {
    setShowErrorAlert(true)
    setMessageAlert(`Actuador ${message} exitosamente`);

    setTimeout(() => {
      setShowErrorAlert(false)
    }, 2500);
  }

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);
    setSelectedVariable(null);
    const data = await ActuadorService.deleteActuador(selectedVariable.id);
    setMessageAlert("Actuador eliminada exitosamente");
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

      const data = await ActuadorService.getAllActuador(companyId);

      setVariableList(data);
    } catch (error) {
      console.error('Error al actualizar los actuadores:', error);
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
          <span>Gestión de dispositivos</span>
          <span>/</span>
          <span>Actuadores</span>
          <span>/</span>
          <span className="text-black font-bold">   {nameCompany ? nameCompany : ''}</span>
          <span className="text-black font-bold">  </span>
          {selectedCompanyUniversal && (
            <span>{companyList.find(company => company.id === selectedCompanyUniversal)?.actuatorCode}</span>
          )}
        </div>
      </div>
      <div className="relative w-full mt-6 py-5 z-0">
        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="Buscar Actuador"
          className="w-full border border-gray-300 p-2 pl-10 pr-4 rounded-md" // Añadido padding a la izquierda para espacio para el icono
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>
      <div className="bg-white  rounded-lg shadow ">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Actuadores</h2>
          <button className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center" onClick={handleOpenModal}>

            Crear Actuador
          </button>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full">
            <thead className="bg-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Código ID Actuador</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Nombre Comercial</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Tipo actuador</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Marca</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Modelo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Puerto entrada</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Puerto activación</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Espacio</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Subespacio</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Sist. monitoreo y control</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentCompanies.map((actuador, index) => (
                <tr key={actuador.id} className="bg-white border-b">
                  <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{actuador.actuatorCode}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{actuador.actuatorType.commercialName || "No disponible"}</td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {actuador.actuatorType && actuador.actuatorType.icon ? (
                        <img
                          src={actuador.actuatorType.icon}
                          alt={actuador.actuatorType.actuadorCode || "actuador Icon"}
                          className="h-8 w-8 object-contain"
                        />
                      ) : (
                        <span>{actuador.actuatorType?.actuadorCode || "No data"}</span>
                      )}
                    </td>

                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{actuador.actuatorType.brand || "No disponible"}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{actuador.actuatorType?.model || "No disponible"}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{actuador.inputPort}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{actuador.activationPort}</td>
                  <td className="px-6 py-4 text-sm text-gray-700"> -- </td>
                  <td className="px-6 py-4 text-sm text-gray-700"> -- </td>
                  <td className="px-6 py-4 text-sm text-gray-700"> -- </td>

                  <td className="px-6 py-4 text-sm font-medium">
                    <button className="text-[#168C0DFF] px-2 py-2 rounded">
                      <ImEqualizer size={18} />
                    </button>
                    <button className="text-[#168C0DFF] px-2 py-2 rounded">
                      <svg width="24" height="22" viewBox="0 0 24 25" fill="#168C0DFF" xmlns="http://www.w3.org/2000/svg" >
                        <path d="M13.6555 7.78517C13.5482 7.74653 13.4332 7.73414 13.3201 7.74905C13.2071 7.76396 13.0992 7.80573 13.0056 7.87087C12.9123 7.93729 12.8364 8.02517 12.7842 8.12709C12.732 8.22901 12.705 8.34199 12.7056 8.45651V11.7775C12.7056 11.9669 12.6304 12.1486 12.4965 12.2825C12.3625 12.4164 12.1809 12.4917 11.9915 12.4917C11.802 12.4917 11.6204 12.4164 11.4864 12.2825C11.3525 12.1486 11.2773 11.9669 11.2773 11.7775V8.45651C11.2779 8.34199 11.2509 8.22901 11.1987 8.12709C11.1465 8.02517 11.0706 7.93729 10.9773 7.87087C10.8837 7.80573 10.7758 7.76396 10.6628 7.74905C10.5497 7.73414 10.4347 7.74653 10.3274 7.78517C9.39697 8.11654 8.58555 8.71608 7.99551 9.50813C7.40548 10.3002 7.06328 11.2493 7.01209 12.2356C6.9609 13.222 7.20302 14.2014 7.70789 15.0502C8.21276 15.8991 8.95777 16.5794 9.84889 17.0053V21.7761C9.84889 21.9655 9.92413 22.1472 10.0581 22.2811C10.192 22.4151 10.3737 22.4903 10.5631 22.4903C10.7525 22.4903 10.9341 22.4151 11.0681 22.2811C11.202 22.1472 11.2773 21.9655 11.2773 21.7761V16.5268C11.2767 16.3792 11.2303 16.2354 11.1447 16.1151C11.059 15.9949 10.9381 15.9042 10.7988 15.8555C10.1904 15.6395 9.65188 15.2627 9.24063 14.765C8.82938 14.2673 8.56073 13.6675 8.46328 13.0293C8.36583 12.3911 8.44322 11.7384 8.68721 11.1407C8.9312 10.543 9.33266 10.0226 9.84889 9.63492V11.7775C9.84889 12.3457 10.0746 12.8907 10.4764 13.2925C10.8782 13.6943 11.4232 13.92 11.9915 13.92C12.5597 13.92 13.1047 13.6943 13.5065 13.2925C13.9083 12.8907 14.134 12.3457 14.134 11.7775V9.63492C14.6484 10.023 15.0481 10.543 15.2909 11.1399C15.5337 11.7367 15.6105 12.3881 15.5131 13.0251C15.4157 13.662 15.1478 14.2607 14.7378 14.7578C14.3278 15.2548 13.7909 15.6316 13.1841 15.8484C13.0448 15.8971 12.9239 15.9878 12.8382 16.108C12.7526 16.2282 12.7062 16.3721 12.7056 16.5197V21.7761C12.7056 21.9655 12.7809 22.1472 12.9148 22.2811C13.0488 22.4151 13.2304 22.4903 13.4198 22.4903C13.6092 22.4903 13.7909 22.4151 13.9248 22.2811C14.0588 22.1472 14.134 21.9655 14.134 21.7761V17.0053C15.0251 16.5794 15.7701 15.8991 16.275 15.0502C16.7799 14.2014 17.022 13.222 16.9708 12.2356C16.9196 11.2493 16.5774 10.3002 15.9874 9.50813C15.3974 8.71608 14.5859 8.11654 13.6555 7.78517Z" fill="#16A34A" />
                        <path d="M20.8477 10.2492L20.2192 10.1207C20.0515 9.50202 19.8118 8.90517 19.505 8.34235L19.8478 7.82813C20.0359 7.55391 20.1224 7.22268 20.0924 6.89153C20.0624 6.56039 19.9178 6.25008 19.6836 6.01409L18.4623 4.81426C18.2295 4.58316 17.9242 4.43927 17.5977 4.40675C17.2713 4.37424 16.9436 4.45509 16.6697 4.63571L16.1412 4.98566C15.5784 4.67891 14.9815 4.43921 14.3629 4.27148L14.2343 3.65013C14.169 3.32132 13.9901 3.02596 13.729 2.81575C13.4679 2.60554 13.1411 2.49387 12.806 2.50029H11.149C10.8149 2.49355 10.4889 2.60421 10.2279 2.813C9.96695 3.02179 9.78744 3.3155 9.72066 3.64299L9.59211 4.27148C8.97345 4.43921 8.3766 4.67891 7.81378 4.98566L7.32813 4.63571C7.05391 4.44767 6.72268 4.3612 6.39153 4.39118C6.06039 4.42117 5.75008 4.56574 5.51409 4.79998L4.31426 6.02124C4.08316 6.25409 3.93927 6.5594 3.90675 6.88585C3.87424 7.21229 3.95509 7.53999 4.13571 7.81385L4.48566 8.34235C4.1789 8.90517 3.93921 9.50202 3.77148 10.1207L3.15013 10.2492C2.82132 10.3145 2.52596 10.4934 2.31575 10.7545C2.10554 11.0157 1.99387 11.3424 2.00029 11.6776V13.3631C1.99355 13.6972 2.10421 14.0232 2.313 14.2842C2.52179 14.5452 2.8155 14.7247 3.14299 14.7915L3.77148 14.92C3.93921 15.5387 4.1789 16.1355 4.48566 16.6983L4.13571 17.1554C3.94767 17.4296 3.8612 17.7609 3.89118 18.092C3.92117 18.4232 4.06574 18.7335 4.29998 18.9695L5.49981 20.1693C5.77054 20.4341 6.13531 20.5805 6.51396 20.5764C6.79812 20.5873 7.07835 20.5072 7.31385 20.3478L8.09945 19.8265C8.23804 19.7149 8.32995 19.5555 8.3572 19.3797C8.38446 19.2038 8.34508 19.0241 8.24678 18.8758C8.14849 18.7275 7.99836 18.6212 7.82579 18.5777C7.65323 18.5343 7.47066 18.5568 7.31385 18.6409L6.52824 19.1623L5.33555 17.9553L5.93547 17.0554C6.0093 16.9404 6.04855 16.8065 6.04855 16.6698C6.04855 16.533 6.0093 16.3992 5.93547 16.2841C5.50748 15.6118 5.2005 14.8697 5.02845 14.0916C4.99798 13.9569 4.92915 13.834 4.83028 13.7377C4.73142 13.6414 4.60676 13.5757 4.47138 13.5488L3.42152 13.3345V11.649L4.48566 11.4348C4.62104 11.4078 4.7457 11.3422 4.84457 11.2459C4.94343 11.1495 5.01226 11.0266 5.04273 10.892C5.21479 10.1138 5.52176 9.37175 5.94975 8.69944C6.02358 8.58436 6.06283 8.45051 6.06283 8.31378C6.06283 8.17705 6.02358 8.0432 5.94975 7.92812L5.33555 7.02824L6.52824 5.83555L7.42812 6.43547C7.5432 6.5093 7.67705 6.54855 7.81378 6.54855C7.95051 6.54855 8.08436 6.5093 8.19944 6.43547C8.87175 6.00748 9.61381 5.7005 10.392 5.52845C10.5266 5.49798 10.6495 5.42915 10.7459 5.33028C10.8422 5.23142 10.9078 5.10676 10.9348 4.97138L11.149 3.92152H12.8345L13.0488 4.98566C13.0757 5.12104 13.1414 5.2457 13.2377 5.34457C13.334 5.44343 13.4569 5.51226 13.5916 5.54273C14.3697 5.71479 15.1118 6.02176 15.7841 6.44975C15.8992 6.52358 16.033 6.56283 16.1698 6.56283C16.3065 6.56283 16.4404 6.52358 16.5554 6.44975L17.4553 5.84983L18.648 7.04252L18.0481 7.9424C17.9743 8.05748 17.935 8.19134 17.935 8.32806C17.935 8.46479 17.9743 8.59865 18.0481 8.71372C18.4761 9.38604 18.7831 10.1281 18.9551 10.9063C18.9856 11.0409 19.0544 11.1638 19.1533 11.2602C19.2521 11.3565 19.3768 11.4221 19.5122 11.4491L20.5763 11.6633V13.3488L19.5122 13.5631C19.3768 13.59 19.2521 13.6556 19.1533 13.752C19.0544 13.8483 18.9856 13.9712 18.9551 14.1058C18.7831 14.884 18.4761 15.6261 18.0481 16.2984C17.9743 16.4135 17.935 16.5473 17.935 16.6841C17.935 16.8208 17.9743 16.9546 18.0481 17.0697L18.648 17.9696L17.4553 19.1623L16.6697 18.6409C16.5129 18.5568 16.3303 18.5343 16.1578 18.5777C15.9852 18.6212 15.8351 18.7275 15.7368 18.8758C15.6385 19.0241 15.5991 19.2038 15.6263 19.3797C15.6536 19.5555 15.7455 19.7149 15.8841 19.8265L16.6554 20.3407C16.9296 20.5287 17.2609 20.6152 17.592 20.5852C17.9232 20.5552 18.2335 20.4107 18.4695 20.1764L19.6693 18.9766C19.9039 18.7428 20.05 18.4348 20.0826 18.1052C20.1152 17.7756 20.0322 17.4449 19.8478 17.1697L19.4979 16.6412C19.8046 16.0784 20.0443 15.4815 20.2121 14.8629L20.8334 14.7343C21.1622 14.669 21.4576 14.4901 21.6678 14.229C21.878 13.9679 21.9897 13.6411 21.9833 13.306V11.649C21.9837 11.3208 21.871 11.0023 21.6642 10.7474C21.4573 10.4925 21.169 10.3165 20.8477 10.2492Z" fill="#16A34A" />
                      </svg>
                    </button>
                    <button className="text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleOpenModal(actuador, 'view')}>
                      <Eye size={18} />
                    </button>
                    <button className="text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleOpenModal(actuador, 'edit')}>
                      <Edit size={18} />
                    </button>
                    <button className="text-[#168C0DFF] px-2 py-2 rounded" onClick={() => handleDelete(actuador)}>
                      <Trash size={18} />
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>


      </div>


      {/* Modaeliminación */}
      {isDeleteModalOpen && (
        <Delete
          message={`¿Seguro que desea eliminar el actuador  ${selectedVariable?.actuatorCode}?`}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* Modalcrear-editar-*/}
      {isModalOpen && (
        <GenericModal
          title={modalMode === 'edit' ? 'Editar Actuador' : modalMode === 'view' ? 'Ver Actuador' : 'Añadir Actuador'}
          onClose={closeModal}

          companyId={selectedCompany} >

          <FormActuador showErrorAlert={showErrorAlertSuccess} onUpdate={updateService} actuador={newVariable} mode={modalMode} closeModal={closeModal} />
        </GenericModal>
      )}
      {/* modal visualizar */}
      {isModalOpenView && (
        <GenericModal
          title={modalMode === 'edit' ? 'Editar Actuador' : modalMode === 'view' ? 'Ver actuador' : 'Añadir Actuador'}
          onClose={closeModal}

          companyId={selectedCompany} >

          <FormViewActuador showErrorAlert={showErrorAlertSuccess} onUpdate={updateService} actuador={newVariable} mode={modalMode} closeModal={closeModal} />
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

export default Actuador;
