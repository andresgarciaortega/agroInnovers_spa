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

const FormEditSeguimiento = ({ lote, onUpdate, reporte, closeModal, showErrorAlert }) => {
    const [step, setStep] = useState(1);
    const [espacios, setEspacios] = useState([]);
    const [species, setEspecies] = useState([]);
    const [variableType, setVariableType] = useState([]);
    const [loteConEspecies, setLoteConEspecies] = useState(lote);
    // const [species, setTipoEspecies] = useState([]);

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
        typeVariable: '',
        variableTrackingReports: [
            {
                variableId: '',
                updateDate: '',
                updateTime: '',
                weightOrQuantity: ''
            }
        ],
        company_id: '',
        specie: '',
        speciesData: false
    });
    const [variableTrackingReports, setVariableTrackingReports] = useState(
        {
            variableId: '',
            updateDate: '',
            updateTime: '',
            weightOrQuantity: ''
        })

    const [viewMode, setViewMode] = useState('general');

    // useEffect(() => {
    //     if (lote) {
    //         console.log("Lote recibido:", lote);

    //         setFormData({
    //             productionLotId: lote.id || '',
    //             startDate: lote.startDate || '',

    //             estimatedEndDate: lote.estimatedEndDate || '',
    //             productionSpaceId: lote.productionSpace?.id || '',
    //             reportFrequency: lote.reportFrequency || '',
    //             company_id: lote.company_id || '',
    //             status: lote.status || '',
    //             trackingConfig: lote.trackingConfig || {
    //                 trackingStartDate: '',
    //                 trackingFrequency: '',
    //                 productionCycleStage: ''
    //             }
    //         });

    //         if (lote.productionSpace?.id) {
    //             fetchEspacioDetalles(lote.productionSpace.id);
    //         }
    //         console.log('lote traido', lote)


    //         setLoteConEspecies(lote);
    //     }
    //     fetchEspacios();
    //     fetchEspecies(0, {});
    //     fetchVariablesType()
    // }, [lote]);

    useEffect(() => {
        if (reporte) {
            console.log("Reporte recibido para edición:", reporte);
            setFormData({
                productionLotId: reporte.productionLotId || '',
                typeVariable: reporte.typeVariable?.id || 0,
                company_id: reporte.company_id || '',
                specie: reporte.specie?.id || 0,
                speciesData: reporte.speciesData || false,
                variableTrackingReports: reporte.variableTrackingReports || [{
                    variable: '',
                    updateDate: '',
                    updateTime: '',
                    weightOrQuantity: ''
                }]
            });
            console.log('tipo de variable', reporte.typeVariable?.id)
            console.log('especie', reporte.specie?.id)


            // Si hay variables en el reporte, cargarlas en `variableContainers`
            if (reporte.variableTrackingReports && reporte.variableTrackingReports.length > 0) {
                setVariableContainers(reporte.variableTrackingReports);
            }
        }
        fetchEspacios();
        fetchEspacioDetalles(lote.id);
        fetchEspecies(0, {});
        fetchVariablesType()
    }, [reporte]);
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
            const especiesData = await EspeciesService.getAllSpecie(0,{});
            setEspecies(especiesData);
        } catch (error) {
            console.error("Error al obtener las especies:", error);
        }

    };

    const fetchVariablesType = async () => {
        try {
            const variablesTypeData = await VariableType.getAllTypeVariable();
            setVariableType(variablesTypeData);
        } catch (error) {
            console.error("Error al obtener las tipos de variable:", error);
        }
        // fetchVariablesType();
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

    // useEffect(() => {
    //     const fetchEspecies = async () => {
    //         try {
    //             const data = await SpeciesService.getAllSpecie(0, {});
    //             setTipoEspecies(data);
    //         } catch (error) {
    //             console.error('Error fetching species:', error);
    //         }
    //     };
    //     // fetchEspecies();
    // }, [{}]);

    useEffect(() => {
        const fetchVariables = async () => {
            if (!formData.typeVariable) return;

            try {
                let data = [];
                if (viewMode === "species" && selectedSpeciesId) {
                    data = await SpeciesService.getVariableBySpecie({
                        species: { id: selectedSpeciesId },
                        typeVariable: { id: parseInt(formData.typeVariable) },
                    });
                } else if (viewMode === "general") {
                    data = await SpeciesService.getVariableBySpecie({
                        typeVariable: { id: parseInt(formData.typeVariable) },
                    });
                }
                setMainVariables(data.length > 0 ? data : []);
            } catch (error) {
                console.error("Error fetching variables:", error);
                setMainVariables([]);
            }
        };

        fetchVariables();
    }, [formData.typeVariable, selectedSpeciesId, viewMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
        setFormData(prevFormData => ({ ...prevFormData, typeVariable: value }));
    };
    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
    // };




    const handleModeChange = (e) => {
        const mode = e.target.value;
        setViewMode(mode);

        setSelectedSpeciesId("");
        setFormData({ ...formData, specie: "" });

        if (mode === 'general') {
            setFormData({ ...formData, speciesData: false, specie: null });
        } else {
            setFormData({ ...formData, speciesData: true });
        }
    };


    const handleSpeciesChange = (e) => {
        const value = e.target.value;
        setSelectedSpeciesId(value);
        setFormData({ ...formData, specie: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.typeVariable || isNaN(parseInt(formData.typeVariable, 10))) {
            alert("El campo Tipo de variable es obligatorio y debe ser un número.");
            return;
        }
    
        try {
            const preparedData = {
                productionLotId: formData.productionLotId ? parseInt(formData.productionLotId, 10) : null,
                speciesData: formData.speciesData,
                specie: formData.speciesData ? parseInt(formData.specie, 10) : null,
                typeVariable: parseInt(formData.typeVariable, 10),
                company_id: parseInt(formData.company_id, 10),
                variableTrackingReports: variableContainers.map(varItem => ({
                    variableId: parseInt(varItem.variableId, 10),
                    updateDate: varItem.updateDate,
                    updateTime: varItem.updateTime,
                    weightOrQuantity: varItem.weightOrQuantity
                }))
            };
    
            const response = await ReporteService.updateReporte(reporte.id, preparedData);
            console.log('Reporte editado:', response);
            showErrorAlert("Reporte de seguimiento editado correctamente");
    
            onUpdate();
            closeModal();
        } catch (error) {
            console.error('Error al editar el reporte:', error);
        }
    };
    
    

    const handleVariableTypeChange = (e) => {
        const value = e.target.value;
        setFormData(prevFormData => ({ ...prevFormData, typeVariable: value }));
    };





    // const validateForm = (data) => {
    //     const errors = [];
    //     // if (!data.productionLotId) errors.push("productionLotId es requerido");
    //     // if (!data.typeVariable) errors.push("typeVariable es requerido");
    //     // if (!data.company_id) errors.push("company_id es requerido");
    //     data.variableTrackingReports.forEach((report, index) => {
    //         // if (!report.variableId) errors.push(`variableId en el índice ${index} es requerido`);
    //         if (!report.updateDate) errors.push(`updateDate en el índice ${index} es requerido`);
    //         if (!report.updateTime) errors.push(`updateTime en el índice ${index} es requerido`);
    //         if (!report.weightOrQuantity) errors.push(`weightOrQuantity en el índice ${index} es requerido`);
    //     });
    //     if (errors.length > 0) {
    //         console.error("Errores en el formulario:", errors);
    //         return false;
    //     }
    //     return true;
    // };

    const addVariable = () => {
        const newVariable = {
            variableId: selectedVariableId,
            updateDate: new Date().toLocaleDateString(),
            updateTime: new Date().toLocaleTimeString(),
            weightOrQuantity: ""
        };

        setVariableContainers([...variableContainers, newVariable]);
        setSelectedVariableId("");
    };
    
    

    const handleContainerChange = (index, field, value) => {
        setVariableContainers(prevContainers =>
            prevContainers.map((container, i) =>
                i === index ? { ...container, [field]: value } : container
            )
        );
    };

    const handleVariableChange = (e) => {
        setSelectedVariableId(e.target.value);
    };

    const removeVariable = (index) => {
        setVariableContainers(prevContainers => prevContainers.filter((_, i) => i !== index));
    };
    return (
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
                            checked={formData.speciesData === false}
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
                            checked={formData.speciesData === true}
                            onChange={handleModeChange}
                            className="accent-green-500"
                        />
                        <span>Por especie</span>
                    </label>
                </div>
            </div>

            {formData.speciesData && (
                 <div>
                 <label htmlFor="specieId" className="block text-sm font-medium">
                     Especie:
                 </label>
                 <select
                     id="specieId"
                     name="specieId"
                     value={formData.specie}
                     onChange={(e) => {
                         const value = e.target.value;
                         setSelectedSpeciesId(value);
                         setFormData({ ...formData, specieId: value });
                     }}
                     className="w-full p-2 border rounded"
                 >
                     <option value="">Seleccione una especie</option>
                     {species.map((specie) => (
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
                    name="typeVariable"
                    value={formData.typeVariable}
                    onChange={handleChange}
                    disabled
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
                    value={formData.variableId}
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
                {variableContainers.map((container, index) => (
                    <div key={index} className="border p-3 my-2 rounded-md">
                        <p><strong>Variable:</strong> {container.variable?.name}</p>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Fecha Actualización</label>
                                <input
                                    type="date"
                                    name="updateDate"
                                    value={container.updateDate}
                                    onChange={(e) => handleContainerChange(index, 'updateDate', e.target.value)}
                                    className="mt-1 block w-full border rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Hora Actualización</label>
                                <input
                                    type="time"
                                    name="updateTime"
                                    value={container.updateTime}
                                    onChange={(e) => handleContainerChange(index, 'updateTime', e.target.value)}
                                    className="mt-1 block w-full border rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Cantidad/Peso</label>
                                <input
                                    type="number"
                                    name="weightOrQuantity"
                                    value={container.weightOrQuantity}
                                    onChange={(e) => handleContainerChange(index, 'weightOrQuantity', e.target.value)}
                                    className="mt-1 block w-full border rounded-md p-2"
                                />
                            </div>
                            <div>
                                <button
                                    type="button"
                                    onClick={() => removeVariable(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
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
                    Editar
                </button>
            </div>
        </form>
    );
};

export default FormEditSeguimiento;
