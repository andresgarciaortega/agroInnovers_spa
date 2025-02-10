import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoteService from "../../../services/lotesService";
import ReporteService from "../../../services/LoteSeguimiento";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import VariableType from '../../../services/VariableType';
import { Edit, Trash, Eye, Plus } from 'lucide-react';
import { IoIosWarning } from "react-icons/io";
import FormSeguimiento from './FormSeguimiento';
import FormEditSeguimiento from './editarSeguimient';
import GenericModal from '../../../components/genericModal';
import SuccessAlert from "../../../components/alerts/success";
import { useCompanyContext } from "../../../context/CompanyContext";
import { AiOutlineSearch } from "react-icons/ai";
import Delete from '../../../components/delete';

const VisualizarLote = () => {
    const { id } = useParams();
    const [hasSearched, setHasSearched] = useState(false);

    const [selectedLote, setSelectedLote] = useState(null);
    const [selectedReporte, setSelectedReporte] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);

    const { selectedCompanyUniversal } = useCompanyContext();
    const [nameCompany, setNameCompany] = useState("");
    // const [lote, setLote] = useState(null);
    const [seguimiento, setSeguimiento] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [typeVariable, setVariableType] = useState([]);
    const [isModalOpenSeguimiento, setIdModalOpenSeguimiento] = useState(false);
    const [isModalOpenEditSeguimiento, setIdModalOpenEditSeguimiento] = useState(false);
  const [showErrorAlertTable, setShowErrorAlertTable] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    // const [typeVariable, setTipoVariable] = useState("");
    const [tipoReporte, setTipoReporte] = useState("general");
    const [especieSeleccionada, setEspecieSeleccionada] = useState("");
    const [especies, setEspecies] = useState([]);
    const [formData, setFormData] = useState({
        productionLotId: id,
        typeVariableId: '',
        variableTrackingReports: [
            {
                variableId: '',
                updateDate: '',
                updateTime: '',
                weightAmount: ''
            }
        ],
        company_id: '',
        specieId: '', // Especie seleccionada
        speciesData: false // Agrega esta línea para manejar el estado de "por especie"
    });
    const [lote, setLote] = useState({
        lotCode: '',
        startDate: '',
        estimatedEndDate: '',
        productionSpaceId: '',
        reportFrequency: '',
        cycleStage: ''
      });

    useEffect(() => {
        const fetchLote = async () => {
            try {
                const response = await LoteService.getAllLotsById(id);
                setLote(response);

                // Asegúrate de traer las especies completas, no solo sus IDs
                setEspecies(response.productionLotSpecies?.map((item) => ({
                    id: item.specie?.id,
                    name: item.specie?.common_name || "Sin nombre"
                })) || []);

                console.log('Especies:', response.productionLotSpecies?.map((item) => ({
                    id: item.specie?.id,
                    name: item.specie?.common_name || "Sin nombre"
                })));
            } catch (error) {
                console.error("Error al cargar el lote:", error);
            }
        };
        fetchLote();
    }, [id]);





    const fetchSeguimiento = async (filters) => {
        try {
            const response = await ReporteService.getAllReporte(0, filters);
            console.log("Respuesta de la API:", response);
            setSeguimiento(response);
        } catch (error) {
            console.error("Error al cargar el seguimiento:", error);
        }
    };


    const handleBuscar = () => {
        setShowErrorAlertTable(false);
        setHasSearched(true); 
        const filters = {
            typeVariable: formData.typeVariableId ? { id: parseInt(formData.typeVariableId, 10) } : undefined,
            speciesData: tipoReporte === "especie",
            specie: tipoReporte === "especie" && especieSeleccionada
                ? { id: Number(especieSeleccionada) }
                : undefined,
        };

        console.log("Filtros aplicados:", filters);
        fetchSeguimiento(filters);
    };



    useEffect(() => {
        const fetchVariablesType = async () => {
            try {
                const variablesTypeData = await VariableType.getAllTypeVariable();
                setVariableType(variablesTypeData);
            } catch (error) {
                console.error("Error al obtener las tipos de variable:", error);
            }
        };
        fetchVariablesType();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const calcularIndividuosMuertos = (seguimiento) => {
        const mortandadReportes = seguimiento.filter(reporte =>
            reporte.typeVariable?.name === 'Mortandad'
        );

        const sumaMortandad = mortandadReportes.reduce((acc, reporte) => {
            const cantidad = parseFloat(reporte.variableTrackingReports[0]?.weightOrQuantity) || 0;
            return acc + cantidad;
        }, 0);

        return sumaMortandad;
    };

    const toggleExpand = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    const handleOpenModal = () => {
        setSelectedLote(id);
        setIdModalOpenSeguimiento(true);
        setModalMode("create");
        
        setFormData({
            productionLotId: id, 
            typeVariableId: "",
            variableTrackingReports: [
                {
                    variableId: "",
                    updateDate: "",
                    updateTime: "",
                    weightAmount: ""
                }
            ],
            company_id: selectedCompanyUniversal?.value || "",
            specieId: "",
            speciesData: false
        });
    };
    
    const handleOpenModalEdit = (reporte) => {
        if (!reporte) return;
        setSelectedReporte(reporte); 
        setSelectedLote(id);
        setIdModalOpenEditSeguimiento(true);
        setModalMode("edit");
    
        setFormData(reporte);
    };
    
    const handleDelete = (reporte) => {
        setSelectedLote(reporte);
        setIsDeleteModalOpen(true);
      };
  
    
      const handleConfirmDelete = async () => {
        setIsDeleteModalOpen(false);
        setSelectedLote(null);
        await ReporteService.deleteReporte(selectedLote.id);
        setMessageAlert("Reporte de seguimiento eliminado exitosamente");
        showErrorAlertSuccess("eliminado");
        updateService(); // Llama de nuevo a la API para actualizar la lista sin recargar la página
    };
    
      const handleCloseAlert = () => {
        setShowErrorAlert(false);
        updateService(); // Llama de nuevo a la API para actualizar la lista sin recargar la página

      };
    
      const handleCancelDelete = () => {
        setSelectedLote(null);
        setIsDeleteModalOpen(false);
        updateService(); // Llama de nuevo a la API para actualizar la lista sin recargar la página

      };


    // Cerrar el modal
    const closeModal = () => {
        setIdModalOpenSeguimiento(false);
        setIdModalOpenEditSeguimiento(false);
        // setCurrentUser(null);
        setModalMode('create');
    };

    const updateService = async () => {
        setShowErrorAlertTable(false);
        setLoteList([]);

        try {
            const response = await LoteService.getAllLotsById(id);
            setLote(response);

            // Asegúrate de traer las especies completas, no solo sus IDs
            setEspecies(response.productionLotSpecies?.map((item) => ({
                id: item.specie?.id,
                name: item.specie?.common_name || "Sin nombre"
            })) || []);

            console.log('Especies:', response.productionLotSpecies?.map((item) => ({
                id: item.specie?.id,
                name: item.specie?.common_name || "Sin nombre"
            })));
        } catch  (error) {
            console.error("Error fetching lots:", error);
            setLotesList([]);
            setShowErrorAlertTable(true);
            setMessageAlert("Error al cargar los lote. Intenta de nuevo más tarde.");
        }
    };
    // console.log('cargar',updateService() )
    const showErrorAlertSuccess = (message) => {
        setShowErrorAlert(true)
        setMessageAlert(`Reporte de seguimiento ${message} exitosamente`);

        setTimeout(() => {
            setShowErrorAlert(false)
        }, 2500);
    }
    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Detalle del Lote</h1>
            {lote && (
                <div className="grid grid-cols-2 gap-4 border border-gray-300 p-4 shadow-lg">
                    <div>
                        <p><strong>Código del Lote:</strong> {lote.lotCode}</p>
                        <p><strong>Estado del lote:</strong> {lote.status}</p>
                    </div>
                    <div>
                        <p><strong>Fecha de Inicio:</strong> {lote.startDate}</p>
                        <p><strong>Fecha estimada de finalización:</strong> {lote.estimatedEndDate}</p>
                    </div>
                </div>
            )}
            <div className="border border-gray-300 p-4 mt-4 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Especies</h2>
                <div className="grid grid-cols-1 gap-4">
                    {lote?.productionLotSpecies?.map((especie) => (
                        <div
                            key={especie.id}
                            className="border p-2 rounded-md bg-gray-100 shadow-lg"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p><strong>{especie.specie.common_name}</strong></p>
                                    <p>Etapa: {especie.stage}</p>
                                    <p>Peso Total inicial: {especie.initialWeight} kg</p>
                                    <p>Peso Total Final: {especie.finalWeight} kg</p>
                                </div>

                                <div className="ml-auto text-right">
                                    <p>N° individuos iniciales: {especie.initialIndividuals}</p>
                                    <p>N° individuos finales: {especie.finalIndividuals}</p>
                                    <p>N° individuos muertos: {calcularIndividuosMuertos(seguimiento)}</p>
                                </div>


                            </div>


                        </div>
                    ))}
                </div>
            </div>

            {/* Reporte de seguimiento */}
            <div className="border border-gray-300 p-2 mt-4 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Reporte de seguimiento</h2>

                
                <div className="grid grid-cols-7 gap-4 mb-4">
                
                    <select
                        name="typeVariableId"
                        value={formData.typeVariableId}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded-md p-2 col-span-2"
                    >
                        <option value="">Seleccione un tipo de variable</option>
                        {typeVariable.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>

                    <select
                        className="border rounded-md p-2 col-span-2"
                        value={tipoReporte}
                        onChange={(e) => setTipoReporte(e.target.value)}
                    >
                        <option value="">Seleccione un tipo de reporte</option>
                        <option value="general">General</option>
                        <option value="especie">Por Especie</option>
                    </select>

                    <select
                        className="border rounded-md p-2 col-span-2"
                        value={especieSeleccionada}
                        onChange={(e) => setEspecieSeleccionada(e.target.value)}
                        disabled={tipoReporte !== "especie"}
                    >
                        <option value="">Seleccione Especie</option>
                        {especies.map((especie) => (
                            <option key={especie.id} value={especie.id}>
                                {especie.name}
                            </option>
                        ))}
                    </select>

                    {/* Botón de búsqueda con icono de lupa */}
                    <button
                        onClick={handleBuscar}
                        className="bg-gray-200 text-white px-4 py-2 rounded-md flex items-center justify-center col-span-1 shadow-lg"
                       
                    >
                         
                        <AiOutlineSearch className="text-lg mr-1 text-[#168C0DFF]"
                         />
                    </button>
                </div>




                {/* Tabla */}
                <div className="bg-white rounded-lg shadow mt-4">
                    <div className="flex justify-between items-center p-6 border-b seccionNombreBtn">
                        <div className="divisor"></div>
                        <button className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center shadow-lg"
                            onClick={() => handleOpenModal(null, 'create')}
                        >
                            Añadir Reporte de seguimiento
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                    {hasSearched && seguimiento.length === 0 && (
   <div className="alert alert-error flex flex-col items-start space-y-2 p-4 mt-4 bg-red-500 text-white rounded-md">
   <div className="flex items-center space-x-2">
       <IoIosWarning size={20} />
       <p >El tipo de variable en este lote aún no tiene un reporte de seguimiento añadido.</p>

   </div>

</div>
)}

                            <table className="w-full">
                                <thead className="bg-gray-300 ">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider ">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Espacio de producción </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variable</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especie</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad medida</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {seguimiento.map((reporte, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900" style={{ textTransform: 'uppercase' }}>{reporte.productionLot?.productionSpace?.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reporte.variableTrackingReports[0]?.variable?.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reporte.variableTrackingReports[0]?.updateDate}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {tipoReporte === "general"
                                                    ? lote?.productionLotSpecies?.map(especie => especie.specie.common_name).join(", ")
                                                    : reporte.specie?.common_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reporte.variableTrackingReports[0]?.weightOrQuantity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reporte.variableTrackingReports[0]?.variable?.unit_of_measurement}</td>
                                            <td className="bg-customGreen text-[#168C0DFF] px- py-2 rounded">
                                                <button className="bg-customGreen text-[#168C0DFF] px-2 py-2 rounded"
                                                    onClick={() => handleOpenModal(reporte, 'view')}>
                                                    <Eye size={18} />
                                                </button>
                                                <button className="bg-customGreen text-[#168C0DFF] px-2 py-2 rounded"
                                                    onClick={() => handleOpenModalEdit(reporte)}>
                                                    <Edit size={18} />
                                                </button>
                                                <button className="px-2 py-4 whitespace-nowrap text-sm font-medium"
                                                    onClick={() => handleDelete(reporte)}>
                                                    <Trash size={18}
                                                    />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        
                    </div>
                </div>
            </div>
            {isDeleteModalOpen && (
    <Delete
      message={`¿Seguro que desea eliminar este reporte de sgeuimeinto ${selectedLote?.lotCode}?`}
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
            {isModalOpenSeguimiento && (
                <GenericModal
                    title={modalMode === 'edit' ? 'Editar Reporte de seguimiento' : modalMode === 'view' ? 'Ver Reporte de seguimiento' : 'Reporte de seguimiento'}
                    onClose={closeModal}
                    companyId={selectedCompany} >

                    <FormSeguimiento
                        showErrorAlert={showErrorAlertSuccess}
                        onUpdate={updateService}
                        lote={lote}
                        mode={modalMode}
                        closeModal={closeModal}
                    />

                </GenericModal>
            )}
            {isModalOpenEditSeguimiento && (
                <GenericModal
                    title={modalMode === 'edit' ? 'Editar Reporte de seguimiento' : modalMode === 'view' ? 'Ver Reporte de seguimiento' : 'Reporte de seguimiento'}
                    onClose={closeModal}
                    companyId={selectedCompany} >

                    <FormEditSeguimiento
                        showErrorAlert={showErrorAlertSuccess}
                        onUpdate={updateService}
                        lote={lote}
                        reporte={selectedReporte}
                        mode={modalMode}
                        closeModal={closeModal}
                    />

                </GenericModal>
            )}
            {showErrorAlert && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded-md flex items-center">
            <IoIosWarning className="mr-2" /> {messageAlert}
            <button onClick={handleCloseAlert} className="ml-auto text-sm text-red-600">Cerrar</button>
        </div>
    )}
        </div>
    );
};

export default VisualizarLote;
