import React, { useEffect, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import LoteService from "../../services/lotesService";
import { useParams } from "react-router-dom";
import CompanySelector from "../../components/shared/companySelect";
import { useCompanyContext } from "../../context/CompanyContext";
import { IoIosWarning, IoMdAlert, IoMdCheckmarkCircle } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { FaFilter } from "react-icons/fa6";
import { Edit, Trash, Eye, Ban } from 'lucide-react';
import Delete from '../../components/delete';
import SuccessAlert from "../../components/alerts/success";
import GenericModal from '../../components/genericModal';
import FormLotes from './components/editarLote';
import { FaRegEye, FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { AiOutlineStop } from "react-icons/ai";
import { BsBan } from "react-icons/bs";
import { PiArrowsCounterClockwiseBold } from "react-icons/pi";
import { GoArrowSwitch } from "react-icons/go";
const Lotes = () => {
  const { companyId } = useParams();
  const [selectedLote, setSelectedLote] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [loteList, setLoteList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("edit");
  const [selectedCompany, setSelectedCompany] = useState('');
  const [step, setStep] = useState(1)
  const { selectedCompanyUniversal } = useCompanyContext();
  const [nameCompany, setNameCompany] = useState("");
  const [lotesList, setLotesList] = useState([]);
  const [showErrorAlertTable, setShowErrorAlertTable] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [expandedLote, setExpandedLote] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [newLote, setNewLote] = useState({
    lotCode: '',
    startDate: '',
    estimatedEndDate: '',
    productionSpaceId: '',
    reportFrequency: '',
    cycleStage: ''
  });
  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : "";
        if (!companyId) {
          setLotesList([]);
          return;
        }

        setNameCompany(selectedCompanyUniversal.label);

        const response = await LoteService.getAllLots(companyId);

        if (response.statusCode === 404 || !Array.isArray(response)) {
          setLotesList([]);
          setShowErrorAlertTable(true);
          setMessageAlert("Esta empresa no tiene lote registrados. Intenta con otra empresa.");
        } else {
          setLotesList(response);
          setShowErrorAlertTable(false);
        }
      } catch (error) {
        console.error("Error fetching lots:", error);
        setLotesList([]);
        setShowErrorAlertTable(true);
        setMessageAlert("Error al cargar los lote. Intenta de nuevo más tarde.");
      }
    };

    fetchLotes();
  }, [selectedCompanyUniversal]);

  const getRemainingDays = (endDate) => {
    const currentDate = new Date();
    const endDateObject = new Date(endDate);
    const timeDifference = endDateObject - currentDate;

    if (timeDifference <= 0) {
      return (
        <div className="flex items-center text-[#168C0DFF]">
          <IoMdCheckmarkCircle className="mr-1" />
          <span>La cosecha está lista</span>
        </div>
      );
    }

    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return (
      <div className="flex items-center text-red-500">
        <IoMdAlert className="mr-1" />
        <span>Faltan {daysRemaining} días para la cosecha</span>
      </div>
    );
  };
  const handleOpenModal = (lote = null, mode = 'create') => {
    setSelectedLote(lote);
    setModalMode(mode);
    if (mode === 'edit' || mode === 'view') {
      setNewLote(lote);
    } else {
      setNewLote({
        lotCode: '',
        startDate: '',
        estimatedEndDate: '',
        productionSpaceId: '',
        reportFrequency: '',
        cycleStage: ''

      });
    }
    setIsModalOpen(true);
  };

  // Cerrar el modal
  const closeModal = async () => {
    setIsModalOpen(false);
    setSelectedLote(null);
    setModalMode('create');
    updateService();
  };
  //eliminar
  const handleDelete = (lote) => {
    setSelectedLote(lote);
    setIsDeleteModalOpen(true);
  };

  const showErrorAlertSuccess = (message) => {
    setShowErrorAlert(true)
    setMessageAlert(`Lote de producción ${message} exitosamente`);

    setTimeout(() => {
      setShowErrorAlert(false)
    }, 2500);
  }

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);
    setSelectedLote(null);
    const data = await LoteService.deleteLots(selectedLote.id);
    setMessageAlert("Lote de producción eliminado exitosamente");
    showErrorAlertSuccess("eliminado");
    updateService();
  };
  const handleCloseAlert = () => {
    setShowErrorAlert(false);
  };

  const handleCancelDelete = () => {
    setSelectedLote(null);
    setIsDeleteModalOpen(false);
  };

  const updateService = async () => {
    setShowErrorAlertTable(false);
    setLoteList([]);

    try {
      const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : "";
      if (!companyId) {
        setLotesList([]);
        return;
      }

      setNameCompany(selectedCompanyUniversal.label);

      const response = await LoteService.getAllLots(companyId);

      if (response.statusCode === 404 || !Array.isArray(response)) {
        setLotesList([]);
        setShowErrorAlertTable(true);
        setMessageAlert("Esta empresa no tiene lote registrados. Intenta con otra empresa.");
      } else {
        setLotesList(response);
        setShowErrorAlertTable(false);
      }
    } catch (error) {
      console.error("Error fetching lots:", error);
      setLotesList([]);
      setShowErrorAlertTable(true);
      setMessageAlert("Error al cargar los lote. Intenta de nuevo más tarde.");
    }
  };
  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id); // Si se hace clic en el mismo, colapsa
  };

  return (
    <div className="flex">
      <div className="absolute transform -translate-y-28 right-30 w-1/2 z-10">
        <div className="relative w-full">
          <CompanySelector />
        </div>
        <br />
        <div className="flex items-center space-x-2 text-gray-700">
          <span>Lotes de producción</span>
          <span>/</span>
          <span className="text-black font-bold">{nameCompany}</span>
        </div>

      </div>

      <div className="flex-1 p-6">
        <div className="relative w-full mt-2  z-0">
          {/* Input de búsqueda */}
          <input
            type="text"
            placeholder="Buscar Lote de producción"
            className="w-full border border-gray-300 p-2 pl-11 pr-4 rounded-md" // Añadido padding a la izquierda para espacio para el icono
          // value={searchTerm}
          // onChange={(e) => setSearchTerm(e.target.value)}
          />

          <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center py-6 border-b">
            <h2 className="text-xl font-semibold">Lotes de producción</h2>

            <div className="flex gap-4 ml-auto">
              <button className="bg-white text-[#168C0DFF] border border-[#168C0DFF] px-6 py-2 rounded-lg flex items-center space-x-2">
                <FaFilter />
                <span>Filtro</span>
              </button>

              <button className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center">
                Cambiar etapa
              </button>
              <button 
  className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center" 
  onClick={() => handleOpenModal(null, 'create')}
>
  Crear lote de producción
</button>

            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lotesList.map((lote) => (
              <div key={lote.id} className="border p-4 rounded-md shadow-lg">
                <div className="text-lg flex items-center justify-between font-bold">
                  <span>{lote.lotCode}</span>
                  <div className="flex items-center gap-2 text-[#168C0DFF]">
                    {/* Ver Lote */}
                    <div className="relative group">
                      <GoArrowSwitch size={19} className="cursor-pointer" />
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-400 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Cambiar etapa
                      </span>
                    </div>
                    <div className="relative group">
                      <Eye size={19} className="cursor-pointer" />
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-400 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver Lote
                      </span>
                    </div>
                    
                   

                    {/* Editar Lote */}
                    <div className="relative group">
                      <FaRegEdit
                        className="cursor-pointer"
                        onClick={() => handleOpenModal(lote, 'edit')}
                      />
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-400 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Editar Lote
                      </span>
                    </div>

                    {/* Eliminar Lote */}
                    <div className="relative group">
                      <FaRegTrashAlt
                        onClick={() => handleDelete(lote)}
                        className="cursor-pointer"
                      />
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-400 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Eliminar Lote
                      </span>
                    </div>

                    {/* Rechazar */}
                    <div className="relative group">
                      <Ban size={19} className="cursor-pointer" />
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-400 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Rechazar
                      </span>
                    </div>
                  </div>

                </div>
                <br />
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground">
                      Estado: {lote.status || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground">
                      Fecha de siembra: {lote.startDate}
                    </span>
                  </div>
                  <div className="flex items-center mt-5">
                    <span className="text-sm text-muted-foreground">
                      Fecha cosecha estimada: {lote.estimatedEndDate}
                    </span>
                  </div>
                  <div className="flex items-center mt-5">
                    {getRemainingDays(lote.estimatedEndDate)}
                  </div>

                  <div className="grid grid-cols-1 gap-4 py-2">
                    {lote.productionLotSpecies.map((especie) => (
                      <div
                        key={especie.id}
                        className="border p-2 rounded-md bg-gray-100 shadow-lg"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p><strong>{especie.specie.common_name}</strong></p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <p>{especie.initialIndividuals}</p>
                            <button
                              onClick={() => toggleExpand(especie.id)}
                              className="text-gray-400"
                              aria-label={`Expandir/Colapsar ${especie.specie.common_name}`}
                            >
                              {expanded === especie.id ? (
                                <FaChevronUp className="transition-transform transform duration-800" />
                              ) : (
                                <FaChevronDown className="transition-transform delay-1000 duration-800" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div
                          className={`mt-2 overflow-hidden transition-all duration-800 ease-in-out ${expanded === especie.id ? 'max-h-screen' : 'max-h-0'
                            }`}
                        >
                          {expanded === especie.id && (
                            <>
                              {/* <p>Etapa: {especie} kg</p> */}
                              <p>Peso inicial: {especie.initialWeight} kg</p>
                              <p>Peso inicial: {especie.initialWeight} kg</p>
                              <p>Fecha de ingreso: {especie.entryDate}</p>
                              <p>Otra información relevante...</p>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <button className="bg-[#168C0DFF] text-white w-full px-6 py-2 rounded-lg  items-center">
                      Crear reporte de seguimiento
                    </button>
                  </div>
                  <div>
                    <button className="bg-white text-[#168C0DFF] border border-[#168C0DFF] w-full px-6 py-2 rounded-lg  items-center">
                      Cierre y cosecha
                    </button>
                  </div>
                  <br />
                </div>
              </div>
            ))}
            {isDeleteModalOpen && (
              <Delete
                message={`¿Seguro que desea eliminar este lote de producción ${selectedLote?.lotCode}?`}
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
              />
            )}
            {showErrorAlert && (
              <SuccessAlert
                message={messageAlert}
                onCancel={handleCloseAlert}
              />

            )}
          </div>
        </div>
        {isModalOpen && (
          <GenericModal
            title={
              step === 1
                ? modalMode === 'edit'
                  ? 'Editar Lote de Producción'
                  : modalMode === 'view'
                    ? 'Ver Lote de Producción'
                    : 'Añadir Lote de Producción'
                : step === 2
                  ? modalMode === 'edit'
                    ? 'Editar Configuración Seguimiento de Producción'
                    : modalMode === 'view'
                      ? 'Ver Configuración Seguimiento de Producción'
                      : 'Añadir Configuración Seguimiento de Producción'
                  : 'Lote de Producción'
            }
            onClose={closeModal}
            companyId={selectedCompany}
          >
            <FormLotes
              showErrorAlert={showErrorAlertSuccess}
              onUpdate={updateService}
              lote={newLote}
              mode={modalMode}
              closeModal={closeModal}
            />
          </GenericModal>

        )}
        {showErrorAlertTable && (
          <div className="alert alert-error flex flex-col items-start space-y-1 p-2 mt-4 bg-red-500 text-white rounded-md">
            <div className="flex space-x-2">
              <IoIosWarning size={20} />
              <p>{messageAlert}</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Lotes;
