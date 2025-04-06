import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { IoCloudUploadOutline } from "react-icons/io5";
import LoteService from "../../services/lotesService";
import ReporteService from "../../services/LoteSeguimiento";
import { useParams } from "react-router-dom";
import CompanySelector from "../../components/shared/companySelect";
import { useCompanyContext } from "../../context/CompanyContext";
import { IoIosWarning, IoMdAlert, IoMdCheckmarkCircle } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { FaFilter } from "react-icons/fa6";
import { ImEqualizer2 } from "react-icons/im";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import { Edit, Trash, Eye, Ban } from 'lucide-react';
import Delete from '../../components/delete';
import SuccessAlert from "../../components/alerts/success";
import GenericModal from '../../components/genericModal';
import FormLotes from './components/editarLote';
import FormCambiarEtapa from './components/FromCambiarEtapa';
import FormRechazar from './components/rechazar';
import FormCosecha from './components/FormCosecha';
import FormCrear from './components/crearLote';
import FormSeguimiento from './components/FormSeguimiento';
import { FaRegEye, FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { GoArrowSwitch } from "react-icons/go";
import LoadingView from "../../components/Loading/loadingView";

const Lotes = () => {
  const [idcompanyLST, setIdcompanyLST] = useState(JSON.parse(localStorage.getItem('selectedCompany')));
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [selectedLote, setSelectedLote] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [loteList, setLoteList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("edit");
  const [selectedCompany, setSelectedCompany] = useState('');
  const [step, setStep] = useState(1)
  const { selectedCompanyUniversal, hiddenSelect, showHidden } = useCompanyContext();
  const [nameCompany, setNameCompany] = useState(idcompanyLST.label);
  const [lotesList, setLotesList] = useState([]);
  const [showErrorAlertTable, setShowErrorAlertTable] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [expandedLote, setExpandedLote] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [isModalOpenRechazar, setIsModalOpenRechazar] = useState(false);
  const [isModalOpenCosecha, setIdModalOpenCosecha] = useState(false);
  const [isModalCrear, setIsModalCrear] = useState(false);
  const [isModalOpenSeguimiento, setIdModalOpenSeguimiento] = useState(false);
  const [isModalOpenEtapa, setIsModalOpenEtapa] = useState(false);
  const [newLote, setNewLote] = useState({
    lotCode: '',
    startDate: '',
    estimatedEndDate: '',
    productionSpaceId: '',
    reportFrequency: '',
    cycleStage: ''
  });

  const [especies, setEspecies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    hiddenSelect(false); // Change to false to show the selector
  }, []);

  useEffect(() => {
    const company = selectedCompanyUniversal ?? idcompanyLST;
    if (!company.value) {
      setLotesList([]);
      return;
    } else {
      setNameCompany(company.label);
    }

    hiddenSelect(true);

    const fetchLotes = async () => {
      setIsLoading(true)
      try {
        const response = await LoteService.getAllLots(company.value);
        const storedIpFija = localStorage.getItem('uuid'); // Obtener IP del localStorage

        if (response.statusCode === 404 || !Array.isArray(response)) {
          setLotesList([]);
          setShowErrorAlertTable(true);
          setMessageAlert(storedIpFija
            ? `No se encontraron lotes con el sistema de monitoreo ${storedIpFija}`
            : "Esta empresa no tiene lotes registrados. Intenta con otra empresa."
          );
          return;
        }

        // Filtrar por ipFija si existe en localStorage
        let filteredLotes = response;
        if (storedIpFija) {
          filteredLotes = response.filter(lote =>
            lote.productionSpace?.monitoringSystemId?.ipFija === storedIpFija
          );

          if (filteredLotes.length === 0) {
            setShowErrorAlertTable(true);
            setMessageAlert(`No se encontraron lotes con el sistema de monitoreo ${storedIpFija}`);
          } else {
            setShowErrorAlertTable(false);
          }
        } else {
          setShowErrorAlertTable(false);
        }

        setLotesList(filteredLotes);
        setIsLoading(false)

      } catch (error) {
        console.error("Error fetching lots:", error);
        setLotesList([]);
        setShowErrorAlertTable(true);
        setMessageAlert("Error al cargar los lotes. Intenta de nuevo más tarde.");
      setIsLoading(false)

      }
    };

    fetchLotes();
  }, [selectedCompanyUniversal]);




  useEffect(() => {
    const company = selectedCompanyUniversal ?? idcompanyLST;
    if (!company.value) {
      setLotesList([]);
    } else {
      const fetchReportesSeguimiento = async () => {
        try {
          // Obtener reportes de seguimiento
          const reportes = await ReporteService.getAllReporte(company.value, {});

          const reportesPorEspecie = reportes.reduce((acc, reporte) => {
            const especieId = reporte.specieId;
            if (!acc[especieId]) {
              acc[especieId] = [];
            }
            acc[especieId].push({
              variableName: reporte.variableName,
              weightAmount: reporte.weightAmount,
              updateDate: reporte.updateDate,
            });
            return acc;
          }, {});

          // Asignar los reportes a cada especie
          setEspecies((prevEspecies) =>
            prevEspecies.map((especie) => ({
              ...especie,
              reportesSeguimiento: reportesPorEspecie[especie.id] || [],
            }))
          );
        } catch (error) {
          console.error("Error al obtener reportes de seguimiento:", error);
        }
      };
      fetchReportesSeguimiento();
    }

  }, [companyId]);


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

  const handleOpenModal = (lote = null, mode = "create") => {
    // Cierra todos los modales antes de abrir el necesario
    setIsModalOpen(false);
    setIsModalCrear(false);
    setIdModalOpenCosecha(false);
    setIsModalOpenRechazar(false);
    setIsModalOpenEtapa(false);
    setIdModalOpenSeguimiento(false);

    setSelectedLote(lote);
    setNewLote(lote);

    switch (mode) {
      case "edit":
        setNewLote(lote); // Cargar datos del lote en el modal
        setIsModalOpen(true);
        break;
      case "create":
        setNewLote({
          lotCode: "",
          startDate: "",
          estimatedEndDate: "",
          productionSpaceId: "",
          reportFrequency: "",
          cycleStage: "",
        }); // Inicializar con valores vacíos
        setIsModalCrear(true);
        break;
      case "cosechar":
        setIdModalOpenCosecha(true);
        break;
      case "rechazar":
        setIsModalOpenRechazar(true);
        break;
      case "etapa":
        setIsModalOpenEtapa(true);
        break;
      case "seguimiento":
        setIdModalOpenSeguimiento(true);
        break;
      default:
        console.error("Modo de modal desconocido:", mode);
    }
  };




  // Cerrar el modal
  const closeModal = async () => {
    setIsModalOpen(false);
    setIsModalCrear(false);
    setIdModalOpenCosecha(false);
    setIsModalOpen(false);
    setIsModalOpenRechazar(false);
    setIsModalOpenEtapa(false);
    setIdModalOpenSeguimiento(false);
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
    setMessageAlert(` ${message} exitosamente`);

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
      const company = selectedCompanyUniversal ?? idcompanyLST;
      if (!company.value) {
        setLotesList([]);
        return;
      }

      const response = await LoteService.getAllLots(company.value);

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

  const handleViewLot = (lote) => {
    navigate(`../visualizarLote/${lote.id}`);
  };

  const indexOfLastCompany = currentPage * itemsPerPage;
  const indexOfFirstCompany = indexOfLastCompany - itemsPerPage;
  const currentCompanies = lotesList.slice(indexOfFirstCompany, indexOfLastCompany);


  const handleNextPage = () => {
    if (currentPage < Math.ceil(lotesList.length / itemsPerPage)) {
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


  return (
    <div className="table-container containerEmporesa">
      <div className="mb-5">
        <div className="flex items-center space-x-2 text-gray-700">
          <ImEqualizer2 size={20} /> {/* Ícono de Gestión de Variables */}
          <span>Lotes de producción</span>
          <span>/</span>
          <span className="text-black font-bold">{nameCompany}</span>
        </div>
      </div>

      <>
        {isLoading ? (
          <LoadingView />
        ) : (
          <>
            <div className="flex-1 ">
              <div className="mb-5 max-w-7xl mx-auto">
                {/* Input de búsqueda */}
                <input
                  type="text"
                  placeholder="Buscar Lote de producción"
                  className="w-full p-2 pl-11 pr-4 rounded-md" // Añadido padding a la izquierda para espacio para el icono
                // value={searchTerm}
                // onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="max-w-7xl mx-auto mb-6">
                <div className="flex justify-between items-center py-6 border-b seccionLotes">
                  <h2 className="text-xl font-semibold">Lotes de producción</h2>

                  <div className="flex gap-4 ml-auto">
                    <button className="bg-white text-[#168C0DFF] border border-[#168C0DFF] px-6 py-2 rounded-lg flex items-center space-x-2">
                      <FaFilter />
                      <span>Filtro</span>
                    </button>

                    {/* <button className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center">
                Cambiar etapa
              </button> */}
                    <button
                      className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center"
                      onClick={() => handleOpenModal(null, 'create')}
                    >
                      Crear lote de producción
                    </button>

                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {currentCompanies.map((lote) => (
                    <div key={lote.id}
                      className="border p-4 rounded-md shadow-lg border-gray-300">
                      <div className="text-lg flex items-center justify-between font-bold">
                        <span>{lote.lotCode}</span>
                        <div className="flex items-center gap-2 text-[#168C0DFF]">
                          <div className="relative group">
                            <Eye size={19} className="cursor-pointer"
                              onClick={() => handleViewLot(lote)} />
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-400 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              Ver Lote
                            </span>
                          </div>
                          {lote.status !== 'Rechazado' && lote.status !== 'Cosechado' && (
                            <>
                              <div className="relative group">
                                <GoArrowSwitch size={19}
                                  className="cursor-pointer"
                                  onClick={() => handleOpenModal(lote.id, 'etapa')}
                                />
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-400 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                  Cambiar etapa
                                </span>
                              </div>

                              <div className="relative group">
                                <FaRegEdit
                                  className="cursor-pointer"
                                  onClick={() => handleOpenModal(lote, 'edit')}
                                />
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-400 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                  Editar Lote
                                </span>
                              </div>
                              <div className="relative group">
                                <FaRegTrashAlt
                                  onClick={() => handleDelete(lote)}
                                  className="cursor-pointer"
                                />
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-400 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                  Eliminar Lote
                                </span>
                              </div>
                              <div className="relative group">
                                <Ban size={19} className="cursor-pointer"
                                  onClick={() => handleOpenModal(lote, 'rechazar')}
                                />
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-400 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                  Rechazar
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <br />
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span
                            className={`text-sm ${lote.status === "Rechazado"
                              ? "text-red-600 font-bold uppercase"
                              : lote.status === "Cosechado"
                                ? "text-green-600 font-bold uppercase"
                                : "text-muted-foreground"
                              }`}
                          >
                            Estado: {
                              lote.status === "Rechazado"
                                ? "RECHAZADO"
                                : lote.status === "Cosechado"
                                  ? "COSECHADO"
                                  : lote.status || "N/A"
                            }
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
                        {lote.status !== 'Rechazado' && lote.status !== 'Cosechado' && (
                          <div className="flex items-center mt-5">
                            {getRemainingDays(lote.estimatedEndDate)}
                          </div>
                        )}

                        <div className="grid grid-cols-1 gap-4 py-2">
                          {lote.productionLotSpecies.map((especie) => (
                            <div
                              key={especie.id}
                              className={`border p-2 rounded-md shadow-lg ${especie.status === "Cosechado"
                                ? "bg-green-200"
                                : especie.rejected
                                  ? "bg-red-200"
                                  : "bg-white"
                                }`} // Cambia el color según el estado de la especie o si está rechazada
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p><strong>{especie.specie.common_name}</strong></p>
                                  <p>{especie.status === "Cosechado" ? "Cosechado" : especie.rejected ? "Rechazado" : "En Producción"}</p>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <p>{especie.initialIndividuals} individuos</p>
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
                                className={`mt-2 overflow-hidden transition-all duration-800 ease-in-out ${expanded === especie.id ? 'max-h-screen' : 'max-h-0'}`}
                              >
                                {expanded === especie.id && (
                                  <>
                                    <p>Etapa: {especie.trackingConfigs?.[0]?.productionCycleStage?.name || "Etapa no disponible"}</p>
                                    <p>Peso inicial: {especie.initialWeight} kg</p>

                                    {/* Verifica si la especie fue rechazada */}
                                    {especie.rejected && (
                                      <p className="text-red-600 font-medium mt-2">
                                        Razón de rechazo: {especie.rejectionReason}
                                      </p>
                                    )}

                                    {/* Verifica si hay reportes de seguimiento */}
                                    {especie.reportesSeguimiento && especie.reportesSeguimiento.length > 0 ? (
                                      <>
                                        <h4 className="mt-2 font-bold">Reportes de seguimiento:</h4>
                                        <ul>
                                          {especie.reportesSeguimiento.map((reporte, index) => (
                                            <li key={index} className="mt-1">
                                              <strong>Variable:</strong> {reporte.variableName} <br />
                                              <strong>Cantidad:</strong> {reporte.weightAmount} <br />
                                              <strong>Última fecha:</strong> {new Date(reporte.updateDate).toLocaleDateString()}
                                            </li>
                                          ))}
                                        </ul>
                                      </>
                                    ) : (
                                      <p>No hay reportes de seguimiento disponibles.</p>
                                    )}
                                  </>
                                )}
                              </div>


                            </div>
                          ))}
                        </div>

                        {lote.status !== 'Rechazado' && lote.status !== 'Cosechado' && (
                          <>
                            <div>
                              <button
                                className="bg-[#168C0DFF] text-white w-full px-6 py-2 rounded-lg items-center"
                                onClick={() => handleOpenModal(lote, 'seguimiento')}
                              >
                                Crear reporte de seguimiento
                              </button>
                            </div>
                            <div>
                              <button
                                className="bg-white text-[#168C0DFF] border border-[#168C0DFF] w-full px-6 py-2 rounded-lg items-center"
                                onClick={() => handleOpenModal(lote, 'cosechar')}
                              >
                                Cierre y cosecha
                              </button>
                            </div>
                          </>
                        )}


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
                <div className="flex items-center py-2 justify-between border border-gray-200 p-2 rounded-md bg-white mt-6">

                  <div className="pagination-info text-sm flex items-center space-x-2">
                    <span>Cantidad de filas</span>
                    <select
                      className="border border-gray-200 rounded py-2 text-sm m-2"
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                    >
                      <option value={6}>6</option>
                      <option value={12}>12</option>
                      <option value={21}>21</option>
                    </select>
                  </div>


                  <div className="pagination-controls text-xs flex items-center space-x-2">
                    <span>{currentPage} de {Math.ceil(lotesList.length / itemsPerPage)}</span>
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="mr-2 border border-gray-200 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
                    >
                      <IoIosArrowBack size={20} />
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === Math.ceil(lotesList.length / itemsPerPage)}
                      className="border border-gray-200 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
                    >
                      <IoIosArrowForward size={20} />
                    </button>
                  </div>
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
              {isModalCrear && (
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
                  <FormCrear
                    showErrorAlert={showErrorAlertSuccess}
                    onUpdate={updateService}
                    lote={newLote}
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

              {isModalOpenCosecha && (
                <GenericModal
                  title={modalMode === 'edit' ? 'Editar Cierre y cosecha' : modalMode === 'view' ? 'Ver Cierre y cosecha' : 'Cierre y cosecha'}
                  onClose={closeModal}
                  companyId={selectedCompany} >

                  <FormCosecha
                    showErrorAlert={showErrorAlertSuccess}
                    onUpdate={updateService}
                    lote={newLote}
                    mode={modalMode}
                    closeModal={closeModal}
                  />

                </GenericModal>
              )}
              {isModalOpenRechazar && (
                <GenericModal
                  title={modalMode === 'edit' ? 'Editar Rechazar' : modalMode === 'view' ? 'Ver Rechazar' : 'Rechazar'}
                  onClose={closeModal}
                  companyId={selectedCompany} >

                  <FormRechazar
                    showErrorAlert={showErrorAlertSuccess}
                    onUpdate={updateService}
                    lote={newLote}
                    mode={modalMode}
                    closeModal={closeModal}
                  />

                </GenericModal>
              )}

              {isModalOpenEtapa && (
                <GenericModal
                  title={modalMode === 'edit' ? 'Cambiar etapa' : modalMode === 'view' ? 'Cambiar etapa' : 'Cambiar etapa'}
                  onClose={closeModal}
                  companyId={selectedCompany} >

                  <FormCambiarEtapa
                    showErrorAlert={showErrorAlertSuccess}
                    onUpdate={updateService}
                    lote={newLote}
                    mode={modalMode}
                    closeModal={closeModal}
                  />

                </GenericModal>
              )}

              {isModalOpenSeguimiento && (
                <GenericModal
                  title={'Crear Reporte de seguimiento'}
                  onClose={closeModal}
                  companyId={selectedCompany} >

                  <FormSeguimiento
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
          </>
        )}
      </>


    </div>
  );
};

export default Lotes;
