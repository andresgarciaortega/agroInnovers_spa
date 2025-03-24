import React, { useEffect, useState } from 'react';
import LoteService from "../../../services/lotesService";
import EspacioService from "../../../services/espacios";
import { FaTrash } from 'react-icons/fa';
import { Edit, Trash, Eye, Ban } from 'lucide-react';

const FormEditarLote = ({ lote, onUpdate, closeModal,showErrorAlert }) => {
    const [step, setStep] = useState(1);
    const [espacios, setEspacios] = useState([]); // Lista de espacios disponibles
    const [espacioDetalles, setEspacioDetalles] = useState(null);
    const [etapas, setEtapas] = useState([]); // Estado para almacenar las etapas
    const [espaciosSeleccionados, setEspaciosSeleccionados] = useState([]); // Espacios seleccionados para agregar
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        lotCode: '',
        startDate: '',
        estimatedEndDate: '',
        productionSpaceId: '',
        reportFrequency: '',
        cycleStage: '',
        trackingConfig: {
            trackingStartDate: '',
            trackingFrequency: '',
            productionCycleStage: ''
        }
    });

    const [loteConEspecies, setLoteConEspecies] = useState({
        productionLotSpecies: []  // Array vacío al inicio
    });

    useEffect(() => {
        if (lote) {
            const trackingConfigData = lote.trackingConfig?.length > 0 ? lote.trackingConfig[0] : {};
            setFormData({
                lotCode: lote.lotCode || '',
                startDate: lote.startDate || '',
                estimatedEndDate: lote.estimatedEndDate || '',
                productionSpaceId: lote.productionSpace?.id || '',
                reportFrequency: lote.reportFrequency || '',
                cycleStage: lote.cycleStage || '',  // Puedes mantener esta línea si aún es necesario, pero este campo no se usará para mostrar el selector
                trackingConfig: {
                    trackingStartDate: trackingConfigData.trackingStartDate || '',
                    trackingFrequency: trackingConfigData.trackingFrequency || '',
                    productionCycleStage: trackingConfigData.productionCycleStage || '' // Este es el campo que necesitamos actualizar
                }
            });
            if (lote.productionSpace?.id) {
                fetchEspacioDetalles(lote.productionSpace.id);
            }
            setLoteConEspecies(lote);  // Aquí aseguramos que el lote se actualice con las especies correctas
        }
        fetchEspacios();
        fetchEtapas();  // Llamada a la API de etapas
    }, [lote]);

    const fetchEspacios = async () => {
        try {
            const espaciosData = await EspacioService.getAllEspacio();
            setEspacios(espaciosData);
        } catch (error) {
            console.error("Error al obtener los espacios:", error);
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

    const handleSelectEspacio = (espacioId) => {
        // Si ya está seleccionado, no hacer nada
        if (espaciosSeleccionados.includes(espacioId)) return;
    
        // Seleccionar el espacio y agregar sus subespacios si tiene
        const espacioSeleccionado = espacios.find(espacio => espacio.id === espacioId);
        if (espacioSeleccionado) {
            setEspaciosSeleccionados(prev => [...prev, espacioId]);
            if (espacioSeleccionado.subespacios && espacioSeleccionado.subespacios.length > 0) {
                espacioSeleccionado.subespacios.forEach(subespacio => {
                    setEspaciosSeleccionados(prev => [...prev, subespacio.id]);
                });
            }
        }
    };
    

    const handleAgregarEspacios = (espacioId) => {
        // Encuentra el espacio y sus subespacios
        const espacio = espacios.find(esp => esp.id === espacioId);
        if (espacio) {
            setEspaciosSeleccionados(prev => [...prev, espacioId]);
            if (espacio.subespacios && espacio.subespacios.length > 0) {
                // Si tiene subespacios, agregarlos también
                espacio.subespacios.forEach(subespacio => {
                    setEspaciosSeleccionados(prev => [...prev, subespacio.id]);
                });
            }
        }
    };
    useEffect(() => {
        if (lote) {
            const trackingConfigData = lote.trackingConfig?.length > 0 ? lote.trackingConfig[0] : {};
            setFormData({
                lotCode: lote.lotCode || '',
                startDate: lote.startDate || '',
                estimatedEndDate: lote.estimatedEndDate || '',
                productionSpaceId: lote.productionSpace?.id || '',
                reportFrequency: lote.reportFrequency || '',
                cycleStage: lote.cycleStage || '',  // Puedes mantener esta línea si aún es necesario, pero este campo no se usará para mostrar el selector
                trackingConfig: {
                    trackingStartDate: trackingConfigData.trackingStartDate || '',
                    trackingFrequency: trackingConfigData.trackingFrequency || '',
                    productionCycleStage: trackingConfigData.productionCycleStage || '' // Este es el campo que necesitamos actualizar
                }
            });
            if (lote.productionSpace?.id) {
                fetchEspacioDetalles(lote.productionSpace.id);
            }
            setLoteConEspecies(lote);  // Aquí aseguramos que el lote se actualice con las especies correctas
        }
        fetchEspacios();
        fetchEtapas();  // Llamada a la API de etapas
    }, [lote]);

    // Función para obtener las etapas desde la API
    const fetchEtapas = async () => {
        try {
            const response = await EspacioService.getAllStage();  // Reemplaza con la URL de tu API
            const data = await response.json();
            setEtapas(data);
        } catch (error) {
            console.error("Error al obtener las etapas:", error);
        }
    };


   

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('trackingConfig.')) {
            const trackingField = name.split('.')[1];

            if (trackingField === "productionCycleStage") {
                const selectedStage = etapas.find((etapa) => etapa.id === parseInt(value));
                setFormData(prevFormData => ({
                    ...prevFormData,
                    trackingConfig: {
                        ...prevFormData.trackingConfig,
                        [trackingField]: selectedStage || value
                    }
                }));
            } else {
                setFormData(prevFormData => ({
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
                specieId: Number(specieId)

            };
        }).filter(specie => specie !== null);

        if (updatedSpecies.length === 0) {
            console.error("No se puede enviar el lote con especies inválidas.");
            return;
        }

        const data = {
            lotCode: formData.lotCode,
            startDate: formData.startDate,
            estimatedEndDate: formData.estimatedEndDate,
            productionSpaceId: formData.productionSpaceId,
            reportFrequency: formData.reportFrequency,
            cycleStage: formData.cycleStage,
            productionTracking: {
                startDate: formData.trackingConfig.trackingStartDate,   // Corregido
                trackingReportFrequency: Number(formData.trackingConfig.trackingFrequency),
                productionCycleStage: formData.trackingConfig.productionCycleStage
            },
            productionLotSpecies: updatedSpecies,
        };

        try {
            await LoteService.updateLots(lote.id, data);
            showErrorAlert(" Editado");

            onUpdate();
            closeModal();
        } catch (error) {
            console.error("Error al actualizar el lote:", error);
        }
    };



    const handleEliminarEspecie = (specieId) => {
        const updatedSpecies = loteConEspecies.productionLotSpecies.filter(
            (especie) => especie.specieId !== specieId
        );

        setLoteConEspecies((prevState) => ({
            ...prevState,
            productionLotSpecies: updatedSpecies
        }));
    };






    // const handleEliminarEspecie = (especieId) => {
    //     const updatedSpecies = loteConEspecies.productionLotSpecies.filter(especie => especie.id !== especieId);
    //     setLoteConEspecies({
    //         ...loteConEspecies,
    //         productionLotSpecies: updatedSpecies
    //     });

    //     LoteService.updateLots(lote.id, {
    //         ...formData,
    //         productionLotSpecies: updatedSpecies
    //     }).then(() => {
    //         onUpdate();
    //     }).catch((error) => console.error("Error al eliminar la especie:", error));
    // };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
                <>
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
                                max={today}

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
                                min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} // Mínimo: mañana

                                className="mt-1 block w-full border rounded-md p-2"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Espacio de producción</label>
                        <select
                            name="productionSpaceId"
                            value={formData.productionSpaceId}
                            onChange={handleChange}
                            disabled
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
                        <div className="p-4 border rounded-md bg-white mt-4 shadow-xl ">
                            <h4 className="font-bold text-lg">{espacios.find(espacio => espacio.id === formData.productionSpaceId)?.name}</h4>
                            {/* <p ><strong className=' font-medium'>Nombre:</strong> {espacioDetalles.name}</p>
                            <p><strong className=' font-medium'>Condiciones climáticas:</strong> {espacioDetalles.climateConditions}</p>
                            <p><strong className=' font-medium'>Dimensiones:</strong> {espacioDetalles.length} x {espacioDetalles.width} {espacioDetalles.dimensionUnit}</p> */}
                            {loteConEspecies.productionLotSpecies.length > 0 && (
                                <div>
                                    <div className="grid grid-cols-2 gap-4 py-2">
                                        {loteConEspecies.productionLotSpecies.map((especie) => (
                                            <div key={especie.id} className="border p-4 rounded-md bg-gray-100 shadow-lg ">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p><strong>{especie.specie.common_name}</strong></p>
                                                        <p>Peso inicial: {especie.initialWeight} kg</p>
                                                        <p>Individuos: {especie.initialIndividuals}</p>
                                                    </div>
                                                    <button
                                                    type='button'
                                                        onClick={() => handleEliminarEspecie(especie.id)}
                                                        className="text-[#168C0DFF]"
                                                    >
                                                        <Trash size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminarEspecie(especie.id)}
                                                        className="text-[#168C0DFF]"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
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
                            Editar
                        </button>
                    </div>
                </>
            )}


        </form>
    );
};

export default FormEditarLote;
