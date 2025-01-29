import React, { useEffect, useState } from 'react';
import LoteService from "../../../services/lotesService";
import EspacioService from "../../../services/espacios";
import { FaTrash } from 'react-icons/fa';
import { Edit, Trash, Eye, Ban } from 'lucide-react';
import EspeciesService from "../../../services/SpeciesService";
import GenericModal from '../../../components/genericModal';
import CrearEspacio from '../../espacioProduccion/components/crearEspacio';
import CompanyService from '../../../services/CompanyService';

const FormCrearLote = ({ lote, onUpdate, closeModal, showErrorAlert }) => {
    const [step, setStep] = useState(1);
    const [espacios, setEspacios] = useState([]);
    const [espacioDetalles, setEspacioDetalles] = useState(null);
    const [etapas, setEtapas] = useState([]);
    const [espaciosSeleccionados, setEspaciosSeleccionados] = useState([]);
    const [lotes, setLotes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [especies, setEspecies] = useState([]);
    const [especieSeleccionada, setEspecieSeleccionada] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [messageAlert, setMessageAlert] = useState("");

    const [formData, setFormData] = useState({
        lotCode: '',
        startDate: '',
        estimatedEndDate: '',
        productionSpaceId: '',
        reportFrequency: '',
        cycleStage: '',
        productionLotSpecies: [
            {
                specieId: '',
                initialIndividuals: '',
                initialWeight: ''
            }
        ],
        trackingConfig: {
            startDate: '',
            trackingReportFrequency: '',
            productionCycleStage: ''
        }
    });
       const [trackingConfig, setTrackingConfig] = useState(
            {
                startDate: '',
                trackingReportFrequency: '',
                productionCycleStage: ''
            })

    const [loteConEspecies, setLoteConEspecies] = useState({
        productionLotSpecies: []
    });

    useEffect(() => {
        if (lote) {
            console.log('Lote recibido:', lote);
            const trackingConfigData = lote.trackingConfig?.length > 0 ? lote.trackingConfig[0] : {};
            setFormData({
                lotCode: lote.lotCode || '',
                startDate: lote.startDate || '',
                estimatedEndDate: lote.estimatedEndDate || '',
                productionSpaceId: lote.productionSpace?.id || '',
                reportFrequency: lote.reportFrequency || '',
                cycleStage: lote.cycleStage || '',
                trackingConfig: {
                    startDate: trackingConfigData.startDate || '',
                    trackingReportFrequency: trackingConfigData.trackingReportFrequency || '',
                    productionCycleStage: trackingConfigData.productionCycleStage || ''
                }
            });
            if (lote.productionSpace?.id) {
                fetchEspacioDetalles(lote.productionSpace.id);
            }
            setLoteConEspecies(lote);
        }
        fetchEspacios();
        fetchEtapas();
        fetchEspecies();
        fetchCompanies();

    }, [lote]);

    const fetchEspacios = async () => {
        try {
            const espaciosData = await EspacioService.getAllEspacio();
            setEspacios(espaciosData);
        } catch (error) {
            console.error("Error al obtener los espacios:", error);
        }
    };
    const fetchCompanies = async () => {
        try {
            const fetchedCompanies = await CompanyService.getAllCompany();
            setCompanies(fetchedCompanies);
        } catch (error) {
            console.error('Error al obtener las empresas:', error);
        }
    };

    const fetchEspacioDetalles = async (id) => {
        try {
            const espacios = await EspacioService.getAllEspacio();
            const espacio = espacios.find(espacio => espacio.id === id);
            setEspacioDetalles(espacio);
        } catch (error) {
            console.error("Error al obtener detalles del espacio:", error);
        }
    };


    const fetchEspecies = async () => {
        try {
            const especiesData = await EspeciesService.getAllSpecie(0, {});
            setEspecies(especiesData);
        } catch (error) {
            console.error("Error al obtener las especies:", error);
        }
    };

    const fetchEtapasPorEspecie = async (especieId) => {
        try {
            const especieData = await EspeciesService.getSpecieById(especieId);
            if (especieData && especieData.stages) {
                const etapasList = especieData.stages.map(stageItem => ({
                    id: stageItem.stage.id,
                    name: stageItem.stage.name
                }));
                setEtapas(etapasList);
                console.log('etapas:', etapasList)
            } else {
                setEtapas([]);
            }
        } catch (error) {
            console.error("Error al obtener las etapas:", error);
        }
    };

    useEffect(() => {
        if (lote) {
            console.log('Lote recibido:', lote);
            const trackingConfigData = lote.trackingConfig?.length > 0 ? lote.trackingConfig[0] : {};
            setFormData({
                lotCode: lote.lotCode || '',
                startDate: lote.startDate || '',
                estimatedEndDate: lote.estimatedEndDate || '',
                productionSpaceId: lote.productionSpace?.id || '',
                reportFrequency: lote.reportFrequency || '',
                cycleStage: lote.cycleStage || '',
                trackingConfig: {
                    startDate: trackingConfigData.startDate || '',
                    trackingReportFrequency: trackingConfigData.trackingReportFrequency || '',
                    productionCycleStage: trackingConfigData.productionCycleStage || ''
                }
            });
            if (lote.productionSpace?.id) {
                fetchEspacioDetalles(lote.productionSpace.id);
            }
            setLoteConEspecies(lote);
        }
        fetchEspacios();
        fetchEtapas();
    }, [lote]);

    const fetchEtapas = async () => {
        try {
            const response = await EspacioService.getAllStage();
            const data = await response.json();
            console.log("Etapas recibidas:", data);
            setEtapas(data);
        } catch (error) {
            console.error("Error al obtener las etapas:", error);
        }
    };

    const handleCloseAlert = () => {
        setShowAlertError(false);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('trackingConfig.')) {
            const trackingField = name.split('.')[1];

            if (trackingField === "productionCycleStage") {
                const selectedStage = etapas.find((etapa) => etapa.id === parseInt(value));
                setTrackingConfig(prevFormData => ({
                    ...prevFormData,
                    trackingConfig: {
                        ...prevFormData.trackingConfig,
                        [trackingField]: selectedStage || value
                    }
                }));
            } else {
                setTrackingConfig(prevFormData => ({
                    ...prevFormData,
                    trackingConfig: {
                        ...prevFormData.trackingConfig,
                        [trackingField]: value
                    }
                }));
            }
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value
            }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loteConEspecies.productionLotSpecies.length === 0) {
            console.error("El lote debe tener al menos una especie.");
            return;
        }

        const updatedSpecies = loteConEspecies.productionLotSpecies.map(specie => {
            const specieId = specie.specie ? specie.specie.id : null;
            if (!specieId) {
                console.error("Cada especie debe tener un specieId válido.");
                return null;
            }

            return {
                ...specie,
                specieId: Number(specieId),
                initialIndividuals: Number(specie.initialIndividuals),
                initialWeight: Number(specie.initialWeight),
            };
        }).filter(specie => specie !== null);

        const data = {
            lotCode: formData.lotCode,
            startDate: formData.startDate,
            estimatedEndDate: formData.estimatedEndDate,
            productionSpaceId: Number(formData.productionSpaceId),
            reportFrequency: formData.reportFrequency,
            cycleStage: formData.cycleStage,
            trackingConfig: {trackingConfig
            },
            productionLotSpecies: updatedSpecies,
            company_id: Number(formData.company_id),
        };

        try {
            await LoteService.createLots(data);
            showErrorAlert("Creado");

            onUpdate();
            closeModal();
        } catch (error) {
            console.error("Error al actualizar el lote:", error);
        }

    };

    useEffect(() => {
        fetchEspecies();
    }, []);

    const handleAbrirModal = () => {
        setIsModalOpen(true);
    };

    // const handleCerrarModal = () => {
    //     setIsModalOpen(false);
    //     setEspecieSeleccionada(null);
    // };

    const handleSeleccionarEspecie = (event) => {
        const especieId = event.target.value;
        setFormData({
            ...formData,
            specieId: especieId
        });
    };

    const handleAgregarEspecie = () => {
        console.log('especies', especies)
        console.log('specieId', formData.specieId)

        const especieSeleccionada = especies.find(especie => especie.id === parseInt(formData.specieId));
        if (especieSeleccionada) {
            const nuevaEspecie = {
                specieId: especieSeleccionada.id,
                specie: especieSeleccionada,
                initialIndividuals: formData.initialIndividuals,
                initialWeight: formData.initialWeight,
            };

            setLoteConEspecies((prevState) => ({
                ...prevState,
                productionLotSpecies: Array.isArray(prevState.productionLotSpecies)
                    ? [...prevState.productionLotSpecies, nuevaEspecie]
                    : [nuevaEspecie],
            }));


            handleCerrarModal();
        } else {
            console.error("No se seleccionó ninguna especie.");
        }
        setIsModalOpen(false)
    };

    const handleEdit = (especie) => {
        setIsEditMode(true); // Establecer el modo editar
        setFormData({
            specieId: especie.specie.id,
            initialIndividuals: especie.initialIndividuals,
            initialWeight: especie.initialWeight,
            startDate: especie.startDate,
            reportFrequency: especie.reportFrequency,
            cycleStage: especie.cycleStage,
        });
        setIsModalOpen(true); // Abrir el modal
    };
    const handleCreate = () => {
        setIsEditMode(false); // Establecer el modo crear
        setFormData({
            specieId: '',
            initialIndividuals: '',
            initialWeight: '',
            startDate: '',
            reportFrequency: '',
            cycleStage: '',
        });
        setIsModalOpen(true); // Abrir el modal
    };
    const handleCerrarModal = () => {
        setIsModalOpen(false);
    };

    const handleDelete = (especie) => {
        const updatedSpecies = loteConEspecies.productionLotSpecies.filter(
            (s) => s.specie.id !== especie.specie.id
        );
        setLoteConEspecies({
            ...loteConEspecies,
            productionLotSpecies: updatedSpecies,
        });
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
                <>
                    <h3 className="text-lg font-semibold">Paso 1: Editar lotes de producción</h3>
                    <div>
                        <label className="block text-sm font-medium">Código del lote</label>
                        <input
                            type="text"
                            name="lotCode"
                            value={formData.lotCode}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded-md p-2"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium">Fecha de inicio</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="mt-1 block w-full border rounded-md p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Fecha fin estimada</label>
                            <input
                                type="date"
                                name="estimatedEndDate"
                                value={formData.estimatedEndDate}
                                onChange={handleChange}
                                className="mt-1 block w-full border rounded-md p-2"
                                required
                            />
                        </div>
                    </div>
                    <div >
                        <label htmlFor="company_id" className="block text-sm font-medium text-gray-700">Empresa</label>
                        <select
                            id="company_id"
                            name="company_id"
                            value={formData.company_id}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            required
                        >
                            <option value="">Seleccione una empresa</option>
                            {companies.map((company) => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Espacio de producción</label>
                        <select
                            name="productionSpaceId"
                            value={formData.productionSpaceId}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded-md p-2"
                            required
                        >
                            <option value="">Seleccione una opción</option>
                            {espacios.map(espacio => (
                                <option key={espacio.id} value={espacio.id}>
                                    {espacio.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {formData.productionSpaceId && (
                        <div className="p-4 border rounded-md bg-white mt-4 shadow-xl">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-lg">
                                    {espacios.find(espacio => espacio.id === formData.productionSpaceId)?.name}
                                </h4>

                                <button
                                    type="button"
                                    onClick={handleAbrirModal}
                                    className="px-4 py-2 bg-[#168C0DFF] text-white rounded-md"
                                >
                                    Añadir especie
                                </button>
                            </div>

                            {loteConEspecies.productionLotSpecies && loteConEspecies.productionLotSpecies.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-lg font-semibold">Especies añadidas:</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {loteConEspecies.productionLotSpecies.map((especie, index) => (
                                            <div key={index} className="p-4 border rounded-md bg-white shadow-md">
                                                <strong>{especie.specie.common_name}</strong>
                                                <div>Individuos iniciales: {especie.initialIndividuals}</div>
                                                <div>Peso inicial: {especie.initialWeight} kg</div>

                                                <div className="flex justify-end mt-2 space-x-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEdit(especie)}
                                                        className="text-[#168C0DFF]"
                                                    >
                                                        <Edit />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}



                        </div>
                    )}

                    {isModalOpen && (
                        <GenericModal onClose={handleCerrarModal} title={isEditMode ? 'Editar especie' : 'Añadir especie a producir'}>
                            <div className="mt-4">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Especie</label>
                                    <select
                                        name="specieId"
                                        value={formData.specieId}
                                        onChange={(e) => {
                                            const { value } = e.target;
                                            setFormData((prevFormData) => ({
                                                ...prevFormData,
                                                specieId: value,
                                                cycleStage: '',
                                            }));
                                            fetchEtapasPorEspecie(value);
                                        }}
                                        className="mt-1 block w-full border rounded-md p-2"
                                        required
                                    >
                                        <option value="">Seleccione una opción</option>
                                        {especies.map((especie) => (
                                            <option key={especie.id} value={especie.id}>
                                                {especie.common_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium">Individuos iniciales</label>
                                        <input
                                            type="number"
                                            name="initialIndividuals"
                                            value={formData.initialIndividuals}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border rounded-md p-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Peso Inicial</label>
                                        <input
                                            type="number"
                                            name="initialWeight"
                                            value={formData.initialWeight}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border rounded-md p-2"
                                            required
                                        />
                                    </div>
                                </div>

                                <h2 className="mb-4">Configurar seguimiento de producción</h2>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium">Fecha de inicio</label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border rounded-md p-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Frecuencia reporte de seguimiento</label>
                                        <input
                                            type="number"
                                            name="reportFrequency"
                                            value={formData.reportFrequency}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border rounded-md p-2"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Etapa de producción</label>
                                    <select
                                        name="cycleStage"
                                        value={formData.cycleStage}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border rounded-md p-2"
                                        required
                                    >
                                        <option value="">Seleccione una opción</option>
                                        {etapas.map((etapa) => (
                                            <option key={etapa.id} value={etapa.id}>
                                                {etapa.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex justify-end mt-4">
                                    <button
                                        type="button"
                                        onClick={handleCerrarModal}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 mr-2"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleAgregarEspecie}
                                        className="bg-[#168C0DFF] text-white px-4 py-2 rounded"
                                    >
                                        {isEditMode ? 'Guardar cambios' : 'Agregar'}
                                    </button>
                                </div>
                            </div>
                        </GenericModal>
                    )}


                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={() => closeModal()}

                            className="bg-gray-white border border-gray-400 text-gray-500 px-4 py-2 rounded"
                        >
                            Volver
                        </button>
                        <button
                            type="submit"
                            className="bg-[#168C0DFF] text-white px-4 py-2 rounded"
                        >
                            Crear Lote de producción
                        </button>
                    </div>
                </>
            )}

            {showAlertError && (
                <ErrorAlert
                    message={messageAlert}
                    onCancel={handleCloseAlert}
                />
            )}
        </form>
    );
};

export default FormCrearLote;
