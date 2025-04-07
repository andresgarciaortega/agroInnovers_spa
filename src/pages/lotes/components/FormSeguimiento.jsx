import React, { useEffect, useState } from 'react';
import LoteService from "../../../services/lotesService";
import ReporteService from "../../../services/LoteSeguimiento";
import EspacioService from "../../../services/espacios";
import EspeciesService from "../../../services/SpeciesService";
import VariableService from "../../../services/variableService";
import { FaTrash, FaEdit } from 'react-icons/fa';
import GenericModal from '../../../components/genericModal';
import SpeciesService from '../../../services/SpeciesService';
import VariableType from '../../../services/VariableType';
import LoadingView from "../../../components/Loading/loadingView";

const FormSeguimiento = ({ lote, onUpdate, closeModal, showErrorAlert }) => {
    const [step, setStep] = useState(1);
    const [espacios, setEspacios] = useState([]);
    const [Especies, setEspecies] = useState([]);
    const [variableType, setVariableType] = useState([]);
    const [loteConEspecies, setLoteConEspecies] = useState(lote);
    const [species, setTipoEspecies] = useState([]);
    const today = new Date().toISOString().split('T')[0];
    const [isLoading, setIsLoading] = useState(true);

    const [variableContainers, setVariableContainers] = useState([]);
    const [selectedSpeciesId, setSelectedSpeciesId] = useState("");
    const [selectedVariableId, setSelectedVariableId] = useState("");

    const [selectedVariables, setSelectedVariables] = useState({
        main: [],
        subspaces: {}
    });
    const [variables, setVariables] = useState([]);
    const [mainVariables, setMainVariables] = useState([]);
    const [espacioDetalles, setEspacioDetalles] = useState(null);
    const [formData, setFormData] = useState({
        productionLotId: '',
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
        specieId: '',
        speciesData: false
    });
    const [variableTrackingReports, setVariableTrackingReports] = useState(
        {
            variableId: '',
            updateDate: '',
            updateTime: '',
            weightAmount: ''
        })

    const [viewMode, setViewMode] = useState('general');

    useEffect(() => {
        console.log("lote", lote)
        if (lote) {

            setFormData({
                productionLotId: lote.id || '',
                startDate: lote.startDate || '',

                estimatedEndDate: lote.estimatedEndDate || '',
                productionSpaceId: lote.productionSpace?.id || '',
                reportFrequency: lote.reportFrequency || '',
                company_id: lote.company_id || '',
                status: lote.status || '',
                trackingConfig: lote.trackingConfig || {
                    trackingStartDate: '',
                    trackingFrequency: '',
                    productionCycleStage: ''
                }
            });

            if (lote.productionSpace?.id) {
                fetchEspacioDetalles(lote.productionSpace.id);
            }


            setLoteConEspecies(lote);
        }
        fetchEspacios();
        fetchEspecies(0, {});
        fetchVariablesType()
    }, [lote]);

    const fetchEspacios = async () => {
        try {
            const espaciosData = await EspacioService.getAllEspacio();
            setEspacios(espaciosData);
        } catch (error) {
            console.error("Error al obtener los espacios:", error);
        }
    };

    const fetchEspecies = async () => {
        try {
            const especiesData = await EspeciesService.getAllSpecie();
            setEspecies(especiesData);
        } catch (error) {
            console.error("Error al obtener las especies:", error);
        }
    };

    const fetchVariablesType = async () => {
        try {
            const variablesTypeData = await VariableType.getAllTypeVariable();
            setVariableType(variablesTypeData);
            setIsLoading(false)

        } catch (error) {
            console.error("Error al obtener las tipos de variable:", error);
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

    useEffect(() => {
        const fetchEspecies = async () => {
            try {
                const data = await SpeciesService.getAllSpecie(0, {});
                setTipoEspecies(data);
            } catch (error) {
                console.error('Error fetching species:', error);
            }
        };
        fetchEspecies();
    }, [{}]);

    useEffect(() => {
        const fetchVariables = async () => {
            if (!formData.typeVariableId) return;

            try {
                let data = [];
                if (viewMode === "species" && selectedSpeciesId) {
                    data = await SpeciesService.getVariableBySpecie({
                        species: { id: selectedSpeciesId },
                        typeVariable: { id: parseInt(formData.typeVariableId) },
                    });
                } else if (viewMode === "general") {
                    data = await SpeciesService.getVariableBySpecie({
                        typeVariable: { id: parseInt(formData.typeVariableId) },
                    });
                }
                setMainVariables(data.length > 0 ? data : []);
            } catch (error) {
                console.error("Error fetching variables:", error);
                setMainVariables([]);
            }
        };

        fetchVariables();
    }, [formData.typeVariableId, selectedSpeciesId, viewMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
        setFormData(prevFormData => ({ ...prevFormData, typeVariableId: value }));
    };
    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
    // };




    const handleModeChange = (e) => {
        const mode = e.target.value;
        setViewMode(mode);

        setSelectedSpeciesId("");
        setFormData({ ...formData, specieId: "" });

        if (mode === 'general') {
            setFormData({ ...formData, speciesData: false, specieId: null });
        } else {
            setFormData({ ...formData, speciesData: true });
        }
    };


    const handleSpeciesChange = (e) => {
        const value = e.target.value;
        setSelectedSpeciesId(value);
        setFormData({ ...formData, specieId: value });
    };

    // const handleSubmit = async (e) => {
    //     setIsLoading(true);
    //     e.preventDefault();
    //     try {
    //         const preparedData = {
    //             productionLotId: parseInt(formData.productionLotId, 10),
    //             speciesData: formData.speciesData,
    //             specieId: formData.speciesData ? parseInt(formData.specieId, 10) : null,
    //             typeVariableId: parseInt(formData.typeVariableId, 10),
    //             company_id: parseInt(formData.company_id, 10),
    //             variableTrackingReports: [variableTrackingReports]
    //         };

    //         const response = await ReporteService.createReporte(preparedData);
    //         setIsLoading(false);
    //         showErrorAlert("Reporte de seguimiento creado");



    //         onUpdate();
    //         closeModal();
    //     } catch (error) {
    //         console.error('Error al crear el reporte:', error);
    //     }
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setIsLoading(true);
    //     try {
    //         const preparedData = {
    //             productionLotId: parseInt(formData.productionLotId, 10),
    //             speciesData: formData.speciesData,
    //             specieId: formData.speciesData ? parseInt(formData.specieId, 10) : null,
    //             typeVariableId: parseInt(formData.typeVariableId, 10),
    //             company_id: parseInt(formData.company_id, 10),
    //             variableTrackingReports: [variableTrackingReports]
    //         };

    //         const response = await ReporteService.createReporte(preparedData);

    //         // Fetch lot information by ID
    //         const loteInfo = await LoteService.getAllLotsById(lote.id)

    //         setIsLoading(false);
    //         showErrorAlert("Reporte de seguimiento creado");
    //         onUpdate();
    //         closeModal();
    //     } catch (error) {
    //         setIsLoading(false);
    //         console.error('Error al crear el reporte:', error);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        try {
            // 1. Preparar datos del reporte
            const preparedData = {
                productionLotId: parseInt(formData.productionLotId, 10),
                speciesData: formData.speciesData,
                specieId: formData.speciesData ? parseInt(formData.specieId, 10) : null,
                typeVariableId: parseInt(formData.typeVariableId, 10),
                company_id: parseInt(formData.company_id, 10),
                variableTrackingReports: [variableTrackingReports]
            };
    
            // 2. Crear el reporte primero y obtener su ID
            const reporteCreado = await ReporteService.createReporte(preparedData);
            const idReporte = reporteCreado.id; // Asumiendo que el servicio devuelve el ID
    
            console.log(`Reporte creado con ID: ${idReporte}`);
    
            // 3. Obtener información completa del lote
            const loteInfo = await LoteService.getAllLotsById(lote.id);
            
            // 4. Obtener variables configuradas en el espacio de producción
            const variablesEspacio = loteInfo.productionSpace?.configureMeasurementControls || [];
    
            // 5. Procesar cada especie del lote SOLO SI ESTÁ EN PRODUCCIÓN
            for (const especieLote of loteInfo.productionLotSpecies) {
                if (especieLote.status !== "Producción") {
                    continue;
                }
    
                // 6. Obtener última etapa registrada
                const trackingConfigs = especieLote.trackingConfigs || [];
                const ultimaEtapa = trackingConfigs[trackingConfigs.length - 1]?.productionCycleStage;
                if (!ultimaEtapa) continue;
    
                // 7. Obtener información completa de la especie
                const especieCompleta = await SpeciesService.getSpecieById(especieLote.specie.id);
    
                // 8. Buscar la etapa correspondiente en los stages de la especie
                const etapaEspecie = especieCompleta.stages?.find(
                    stage => stage.stage.id === ultimaEtapa.id
                );
                if (!etapaEspecie) continue;
    
                // 9. Validar cada variable del espacio contra los parámetros de la etapa
                for (const variableEspacio of variablesEspacio) {
                    const variableId = variableEspacio.variable_production?.id;
                    if (!variableId) continue;
    
                    const parametro = etapaEspecie.parameters?.find(
                        param => param.variable.id === variableId
                    );
                    if (!parametro) continue;
    
                    const valorReportado = parseFloat(preparedData.variableTrackingReports[0]?.weightAmount);
                    if (isNaN(valorReportado)) continue;
    
                    const nombreVariable = variableEspacio.variable_production.name;
                    let mensajeAlerta = '';
    
                    if (valorReportado < parametro.min_limit) {
                        mensajeAlerta = `ALERTA: El valor reportado para la variable ${nombreVariable} es ${valorReportado} y está por debajo del límite mínimo que es de ${parametro.min_limit}`;
                    } else if (valorReportado > parametro.max_limit) {
                        mensajeAlerta = `ALERTA: El valor reportado para la variable ${nombreVariable} es ${valorReportado} y está por encima del límite máximo que es de ${parametro.max_limit}`;
                    }
    
                    // Crear alerta si se exceden los límites
                    if (mensajeAlerta) {
                        console.log(mensajeAlerta);
                        await ReporteService.createAlertReporte({
                            description: mensajeAlerta,
                            idReeporte: Number(idReporte)
                        });
                    }
                }
            }
    
            setIsLoading(false);
            console.log("✅ Proceso completado: Reporte creado y validaciones ejecutadas");
            onUpdate();
            closeModal();
        } catch (error) {
            setIsLoading(false);
            console.error('❌ Error en el proceso:', error);
        }
    };


























    const handleVariableTypeChange = (e) => {
        const value = e.target.value;
        setFormData(prevFormData => ({ ...prevFormData, typeVariableId: value }));
    };





    // const validateForm = (data) => {
    //     const errors = [];
    //     // if (!data.productionLotId) errors.push("productionLotId es requerido");
    //     // if (!data.typeVariableId) errors.push("typeVariableId es requerido");
    //     // if (!data.company_id) errors.push("company_id es requerido");
    //     data.variableTrackingReports.forEach((report, index) => {
    //         // if (!report.variableId) errors.push(`variableId en el índice ${index} es requerido`);
    //         if (!report.updateDate) errors.push(`updateDate en el índice ${index} es requerido`);
    //         if (!report.updateTime) errors.push(`updateTime en el índice ${index} es requerido`);
    //         if (!report.weightAmount) errors.push(`weightAmount en el índice ${index} es requerido`);
    //     });
    //     if (errors.length > 0) {
    //         console.error("Errores en el formulario:", errors);
    //         return false;
    //     }
    //     return true;
    // };


    const addVariable = () => {

        const variableName = mainVariables.find((v) => v.id === Number(selectedVariableId))?.name;

        const selectedVariable = mainVariables.find((v) => v.id === Number(selectedVariableId));
        if (!variableName) {
            console.warn("No se encontró una variable con el ID seleccionado.");
            return;
        }
        const newVariable = {
            id: selectedVariableId,
            name: selectedVariable.name,
            unit_of_measurement: selectedVariable.unit_of_measurement,
            variableId: selectedVariableId,
            updateDate: new Date().toLocaleDateString(),
            updateTime: new Date().toLocaleTimeString(),
            weightAmount: ""
        };



        setVariableContainers([...variableContainers, newVariable]);
        setSelectedVariableId("");
    };
    const filteredSpecies = species.filter(specie =>
        lote?.productionLotSpecies?.some(lotSpecie => lotSpecie.specie.id === specie.id)
    );

    const handleContainerChange = (index, field, value) => {
        setVariableContainers(prevContainers =>
            prevContainers.map((container, i) =>
                i === index ? { ...container, [field]: value } : container
            )
        );

        setVariableTrackingReports((prevFormDataAcces) => ({
            ...prevFormDataAcces,
            variableId: Number(index),
            [field]: value,
        }));
    };

    // const handleContainerChange = (id, name, value) => {
    //     setVariableContainers(prevContainers =>
    //         prevContainers.map((container, i) =>
    //             i === id ? { ...container, [field]: value } : container
    //         )
    //     );
    //     setVariableTrackingReports((prevFormDataAcces) => ({
    //         ...prevFormDataAcces,
    //         variableId: Number(id),
    //         [name]: value,
    //     }));
    // };

    const handleVariableChange = (e) => {
        setSelectedVariableId(e.target.value);
    };


    return (
        <>
            {isLoading ? (
                <LoadingView />
            ) : (
                <>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p><strong>Código de lote:</strong> {lote?.lotCode}</p>
                                <p><strong>Estado del lote:</strong> {lote?.status}</p>
                                {/* <p><strong>Tipo de espacio:</strong> {espacioDetalles?.spaceTypeId.spaceTypeName}</p> */}
                                <p><strong>Especies:</strong>
                                    {lote?.productionLotSpecies?.map((specie, index) => (
                                        <span key={index}>{specie.specie.common_name}{index < lote.productionLotSpecies.length - 1 ? ', ' : ''}</span>
                                    ))}
                                </p>
                            </div>
                            <div>
                                <p><strong>Fecha de inicio:</strong> {new Date(lote?.startDate).toLocaleDateString()}</p>
                                <p><strong>Fecha estimada de finalización:</strong> {new Date(lote?.estimatedEndDate).toLocaleDateString()}</p>
                                <p><strong>Nombre del espacio:</strong> {espacioDetalles?.name}</p>
                            </div>
                        </div>

                        <div>
                            <h2 className='font-bold pb-3'>Dato general o por especie</h2>


                            <div className="flex items-center space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="viewMode"
                                        value="general"
                                        checked={viewMode === "general"}
                                        onChange={handleModeChange}
                                        className="accent-blue-500"
                                    />
                                    <span>General</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="viewMode"
                                        value="species"
                                        checked={viewMode === "species"}
                                        onChange={handleModeChange}
                                        className="accent-green-500"
                                    />
                                    <span>Por especie</span>
                                </label>
                            </div>
                        </div>

                        {viewMode === "species" && (
                            <div>
                                <label htmlFor="specieId" className="block text-sm font-medium">
                                    Especie:
                                </label>
                                <select
                                    id="specieId"
                                    name="specieId"
                                    value={selectedSpeciesId}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSelectedSpeciesId(value);
                                        setFormData({ ...formData, specieId: value });
                                    }}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Seleccione una especie</option>
                                    {filteredSpecies.map((specie) => (
                                        <option key={specie.id} value={specie.id}>
                                            {specie.common_name}
                                        </option>
                                    ))}

                                </select>
                            </div>
                        )}



                        <div>
                            <label className="block text-sm font-medium">Tipo de variable</label>
                            <select
                                name="typeVariableId"
                                value={formData.typeVariableId}
                                onChange={handleChange}
                                className="mt-1 block w-full border rounded-md p-2"
                            >
                                <option value="">Seleccione un tipo de variable</option>
                                {variableType.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="variable" className="block text-sm font-medium text-gray-700 mb-1">
                                Variables
                            </label>
                            <select
                                id="variable"
                                name="variable"
                                onChange={handleVariableChange}
                                value={selectedVariableId}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="" className="text-gray-500">Selecciona una variable</option>
                                {mainVariables.length > 0 &&
                                    mainVariables.map((variable) => (
                                        <option key={variable.id} value={variable.id}>
                                            {variable.name}
                                        </option>
                                    ))}
                            </select>

                            {selectedVariableId && (
                                <div className="flex justify-end space-x-4 ">
                                    <button
                                        type="button"
                                        onClick={addVariable}
                                        className="mt-4 px-4 py-2 bg-[#168C0DFF] text-white rounded-md"
                                    >
                                        Añadir variable
                                    </button>
                                </div>

                            )}

                        </div>

                        <div>
                            {variableContainers.length === 0 ? (
                                <p>No se han añadido variables.</p>
                            ) : (
                                variableContainers.map((container, index) => (
                                    <div key={index} className="border p-3 my-2 rounded-md">
                                        <p><strong>Variable:</strong> {container.name}</p>
                                        <div className="grid grid-cols-3 gap-4"> {/* Aquí se especifica el diseño en 3 columnas */}
                                            <div>
                                                <label className="block text-sm font-medium">Fecha Actualización</label>
                                                <input
                                                    type="date"
                                                    max={today}

                                                    name="updateDate"
                                                    value={formData.updateDate}
                                                    onChange={(e) => handleContainerChange(container.id, 'updateDate', e.target.value)}
                                                    className="mt-1 block w-full border rounded-md p-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium">Hora Actualización</label>
                                                <input
                                                    type="time"
                                                    name="updateTime"
                                                    value={formData.updateTime}
                                                    onChange={(e) => handleContainerChange(container.id, 'updateTime', e.target.value)}
                                                    className="mt-1 block w-full border rounded-md p-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium">{container.unit_of_measurement}</label>
                                                <input
                                                    type="number"
                                                    name="weightAmount"
                                                    value={formData.weightAmount}
                                                    onChange={(e) => handleContainerChange(container.id, 'weightAmount', e.target.value)}
                                                    className="mt-1 block w-full border rounded-md p-2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="bg-gray-white border border-gray-400 text-gray-500 px-4 py-2 rounded"
                            >
                                Volver
                            </button>
                            <button
                                type="submit"
                                className="bg-[#168C0DFF] text-white px-4 py-2 rounded"
                            >
                                Crear
                            </button>
                        </div>
                    </form>
                </>
            )}
        </>

    );
};

export default FormSeguimiento;
