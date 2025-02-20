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

const FormEditSeguimiento = ({ lote, onUpdate, reporte, closeModal, showErrorAlert ,mode}) => {
    const [step, setStep] = useState(1);
    const [espacios, setEspacios] = useState([]);
    const [species, setEspecies] = useState([]);
    const [variableType, setVariableType] = useState([]);
    const [loteConEspecies, setLoteConEspecies] = useState(lote);
    // const [species, setTipoEspecies] = useState([]);

    const [variableContainers, setVariableContainers] = useState([]);
    const [selectedSpeciesId, setSelectedSpeciesId] = useState("");
    const [selectedVariableId, setSelectedVariableId] = useState("");
    const today = new Date().toISOString().split('T')[0];

    const [mainVariables, setMainVariables] = useState([]);
    const [espacioDetalles, setEspacioDetalles] = useState(null);
    const [formData, setFormData] = useState({
        productionLotId: '',
        typeVariable: '',
        variableTrackingReports: [
            {
                variable: '',
                updateDate: '',
                updateTime: '',
                weightOrQuantity: ''
            }
        ],
        company_id: '',
        specie: '',
        speciesData: false
    });

    const [viewMode, setViewMode] = useState('general');

    useEffect(() => {
  
        if (reporte) {
            console.log("Reporte recibido para edición:", reporte);
            setFormData(prevFormData => ({
                ...prevFormData,
                productionLotId: reporte.productionLot?.id || prevFormData.productionLotId,
                typeVariable: reporte.typeVariable?.id || prevFormData.typeVariable,
                company_id: reporte.company_id || prevFormData.company_id,
                specie: reporte.specie?.id || prevFormData.specie,
                speciesData: reporte.speciesData ?? prevFormData.speciesData,
                variableTrackingReports: reporte.variableTrackingReports.length > 0
                    ? reporte.variableTrackingReports
                    : prevFormData.variableTrackingReports
            }));

            console.log('tipo de variable', reporte.typeVariable?.id)
            console.log('lote de producción', reporte.productionLot
                ?.id)
            console.log('especie', reporte.specie?.id)
            console.log('variable', reporte.variableTrackingReports?.variable)


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
            const especiesData = await EspeciesService.getAllSpecie(0, {});
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
        setFormData(prevFormData => ({ ...prevFormData, [name]: value || prevFormData[name] }));
        setFormData(prevFormData => ({ ...prevFormData, typeVariable: value }));
    };
 
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.typeVariable || isNaN(parseInt(formData.typeVariable, 10))) {
            alert("El campo Tipo de variable es obligatorio y debe ser un número.");
            return;
        }

        try {
            const preparedData = {
                productionLotId: parseInt(formData.productionLotId, 10),
                speciesData: formData.speciesData,
                specie: formData.speciesData
                    ? (parseInt(formData.specie, 10) || reporte.specie?.id)
                    : null,
                typeVariable: parseInt(formData.typeVariable, 10),
                company_id: parseInt(formData.company_id, 10),
                variableTrackingReports: variableContainers.map(varItem => ({
                   
                    variableId: varItem.variable && !isNaN(Number(varItem.variable))
                        ? Number(varItem.variable?.id)
                        : varItem.variable?.id || 0,

                    updateDate: varItem.updateDate || reporte.variableTrackingReports?.updateDate,
                    updateTime: varItem.updateTime || reporte.variableTrackingReports?.updateTime,
                    weightAmount: varItem.weightOrQuantity
                        ? String(varItem.weightOrQuantity)
                        : String(reporte.variableTrackingReports?.weightAmount || "0")
                }))
            };
console.log('arreglo', preparedData),
console.log('datos de  la variable', variableContainers)

            const response = await ReporteService.updateReporte(reporte.id, preparedData);
            console.log('Reporte editado:', response);
            showErrorAlert(" editado ");

            onUpdate();
            closeModal();
        } catch (error) {
            console.error('Error al editar el reporte:', error);
        }
    };

    const addVariable = () => {
      
        if (!selectedVariableId) return;

        // Buscar la variable seleccionada en la lista de variables disponibles
        const variableSeleccionada = mainVariables.find(v => v.id === parseInt(selectedVariableId));

        if (!variableSeleccionada) {
            console.error("No se encontró la variable seleccionada");
            return;
        }

        const nuevaVariable = {
            variable: variableSeleccionada, // Aquí guardamos toda la información de la variable
            updateDate: '',
            updateTime: '',
            weightOrQuantity: ''
        };

        setVariableContainers(prevVariables => [...prevVariables, nuevaVariable]);
        setSelectedVariableId(""); // Restablece el ID de la variable seleccionada
    };

    const handleAddVariable = (selectedVariable) => {
        setVariableContainers(prevVariables => {
            const updatedVariables = [...prevVariables, selectedVariable];
            console.log("Variables actualizadas:", updatedVariables);
            return updatedVariables;
        });
    };

    const handleContainerChange = (index, field, value) => {
        setVariableContainers(prevContainers =>
            prevContainers.map((container, i) =>
                i === index ? { ...container, [field]: value } : container
            )
        );
    };

    const handleVariableChange = (e) => {
        const value = e.target.value;
        setSelectedVariableId(value); // Actualiza el ID de la variable seleccionada
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
                            disabled ={mode === 'view'}
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
                            disabled ={mode === 'view'}

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
                                                    disabled ={mode === 'view'}


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

            {mode !== 'view' && (
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
            )}

            <div>
                {variableContainers.map((container, index) => (
                    <div key={index} className="border p-3 my-2 rounded-md">
                        <p><strong>Variable:</strong> {container.variable?.name || "Nombre no disponible"}</p>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Fecha Actualización</label>
                                <input
                                    max={today}
                                    disabled={mode === 'view'}
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
                                disabled={mode === 'view'}
                                    type="time"
                                    name="updateTime"
                                    value={container.updateTime}
                                    onChange={(e) => handleContainerChange(index, 'updateTime', e.target.value)}
                                    className="mt-1 block w-full border rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">{container.variable?.unit_of_measurement}</label>
                                <input
                                disabled={mode === 'view'}
                                    type="number"
                                    name="weightOrQuantity"
                                    value={container.weightOrQuantity}
                                    onChange={(e) => handleContainerChange(index, 'weightOrQuantity', e.target.value)}
                                    className="mt-1 block w-full border rounded-md p-2"
                                />
                            </div>
                            {mode !== 'view' && (
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => removeVariable(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end space-x-4 mt-6">
                <button
                    type="button"
                    onClick={ closeModal}
                    className="bg-gray-white border border-gray-400 text-gray-500 px-4 py-2 rounded"
                >
                    Volver
                </button>
                {mode === 'edit' && (
        <button
            type="submit"
            className="bg-[#168C0DFF] text-white px-4 py-2 rounded"
        >
            Editar
        </button>
    )}
            </div>
        </form>
    );
};

export default FormEditSeguimiento;
