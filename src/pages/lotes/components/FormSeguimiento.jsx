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

const FormSeguimiento = ({ lote, onUpdate, closeModal }) => {
    const [step, setStep] = useState(1);
    const [espacios, setEspacios] = useState([]);
    const [Especies, setEspecies] = useState([]);
    const [variableType, setVariableType] = useState([]);
    const [loteConEspecies, setLoteConEspecies] = useState(lote);
    const [species, setTipoEspecies] = useState([]);

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
        specieId: '', // Especie seleccionada
        speciesData: false // Agrega esta línea para manejar el estado de "por especie"
    });
    
    const [viewMode, setViewMode] = useState('general'); 

    useEffect(() => {
        if (lote) {
        console.log("Lote recibido:", lote);

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
            console.log('lote traido', lote)


            setLoteConEspecies(lote);
        }
        fetchEspacios();
        fetchEspecies(0,{});
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
                const data = await SpeciesService.getAllSpecie(0,{});
                setTipoEspecies(data);
            } catch (error) {
                console.error('Error fetching species:', error);
            }
        };
        fetchEspecies();
    }, [{}]);

    useEffect(() => {
        const fetchVariables = async () => {
          if (!formData.variableTypeId) return;
      
          try {
            let data = [];
            if (viewMode === "species" && selectedSpeciesId) {
              data = await SpeciesService.getVariableBySpecie({
                species: { id: selectedSpeciesId },
                typeVariable: { id: parseInt(formData.variableTypeId) },
              });
            } else if (viewMode === "general") {
              data = await SpeciesService.getVariableBySpecie({
                typeVariable: { id: parseInt(formData.variableTypeId) },
              });
            }
            setMainVariables(data.length > 0 ? data : []);
          } catch (error) {
            console.error("Error fetching variables:", error);
            setMainVariables([]);
          }
        };
      
        fetchVariables();
      }, [formData.variableTypeId, selectedSpeciesId, viewMode]);
      
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
    };
    

    const handleModeChange = (e) => {
        const mode = e.target.value;
        setViewMode(mode);
        
        if (mode === 'general') {
            setFormData({ ...formData, speciesData: false, specieId: null });
        } else {
            setFormData({ ...formData, speciesData: true });
        }
    };
    

    const handleSpeciesChange = (e) => {
        const value = e.target.value;
        setSelectedSpeciesId(value);
        setFormData({ ...formData, specieId: value }); // Actualiza el formulario
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.typeVariableId || isNaN(formData.typeVariableId)) {
            alert("El campo Tipo de variable es obligatorio y debe ser un número.");
            return;
        }
    
        try {
            const preparedData = {
                productionLotId: parseInt(formData.productionLotId, 10),
                speciesData: formData.speciesData,
                specieId: formData.speciesData ? parseInt(formData.specieId, 10) : null,
                typeVariableId: parseInt(formData.typeVariableId, 10),
                company_id: parseInt(formData.company_id, 10),
                variableTrackingReports: (formData.variableTrackingReports || []).map((report) => ({
                    variableId: parseInt(report.variableId, 10),
                    updateDate: report.updateDate,
                    updateTime: report.updateTime,
                    weightAmount: report.weightAmount.toString(),
                })),
            };
    
            const response = await ReporteService.createReporte(preparedData);
            console.log('Reporte creado:', response);
            onUpdate();
            closeModal();
        } catch (error) {
            console.error('Error al crear el reporte:', error);
        }
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
        console.log("ID de variable seleccionada:", selectedVariableId);
        console.log("Lista de variables disponibles:", mainVariables);

        const variableName = mainVariables.find((v) => v.id === Number(selectedVariableId))?.name;

        if (!variableName) {
            console.warn("No se encontró una variable con el ID seleccionado.");
            return;
        }

        const newVariable = {
            id: Date.now(),
            name: variableName,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            quantity: ""
        };

        setVariableContainers([...variableContainers, newVariable]);
        setSelectedVariableId(""); 
    };



    const handleContainerChange = (id, field, value) => {
        setVariableContainers(prevContainers =>
            prevContainers.map(container =>
                container.id === id ? { ...container, [field]: value } : container
            )
        );
    };
    const handleVariableChange = (e) => {
        setSelectedVariableId(e.target.value); 
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p><strong>Código de lote:</strong> {lote?.lotCode}</p>
                    <p><strong>Estado del lote:</strong> {lote?.status}</p>
                    <p><strong>Tipo de espacio:</strong> {espacioDetalles?.spaceTypeId.spaceTypeName}</p>
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
                setSelectedSpeciesId(value); // Actualiza el estado del ID seleccionado
                setFormData({ ...formData, specieId: value }); // Actualiza el formulario
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
                    name="variableTypeId"
                    value={formData.typeVariableId }
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
                    <button
                        type="button"
                        onClick={addVariable}
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                        Añadir variable
                    </button>
                )}

            </div>

            <div>
                {/* <h3 className="font-bold mt-4">Variables añadidas</h3> */}
                {variableContainers.length === 0 ? (
                    <p>No se han añadido variables.</p>
                ) : (
                    variableContainers.map((container) => (
                        <div key={container.id} className="border p-3 my-2 rounded-md">
                            <p><strong>Varable:</strong> {container.name}</p>
                          
                            <div>
                                <label className="block text-sm font-medium">Fecha Actualización</label>
                                <input
                                    type="date"
                                    name="finalIndividuals"
                                    value={container.updateDate}
                                    onChange={(e) => handleContainerChange(container.id, 'date', e.target.value)}

                                    className="mt-1 block w-full border rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Hora Actualización</label>
                                <input
                                    type="time"
                                    name="finalIndividuals"
                                    value={container.updateTime}
                                    onChange={(e) => handleContainerChange(container.id, 'time', e.target.value)}

                                    className="mt-1 block w-full border rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Cantidad/Peso</label>
                                <input
                                    type="number"
                                    name="finalIndividuals"
                                    value={container.weightAmount}
                                    onChange={(e) => handleContainerChange(container.id, 'quantity', e.target.value)}

                                    className="mt-1 block w-full border rounded-md p-2"
                                />
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
                Editar
            </button>
        </div>
        </form>
    );
};

export default FormSeguimiento;
