import React, { useEffect, useState } from 'react';
import LoteService from "../../../services/lotesService";
import EspacioService from "../../../services/espacios";
import EspeciesService from "../../../services/SpeciesService";
import { FaTrash, FaEdit } from 'react-icons/fa';
import GenericModal from '../../../components/genericModal';

const FormCosechar = ({ lote, onUpdate, closeModal }) => {
    const [step, setStep] = useState(1);
    const [espacios, setEspacios] = useState([]);
    const [Especies, setEspecies] = useState([]);
    const [espacioDetalles, setEspacioDetalles] = useState(null);
    const [formData, setFormData] = useState({
        finalWeight: '',
        finalIndividuals: '',
    });

    const [loteConEspecies, setLoteConEspecies] = useState(lote); // Estado para manejar el lote con las especies
    const [modalEspecie, setModalEspecie] = useState(null); // Estado para controlar el modal de cada especie
    const [harvestData, setHarvestData] = useState([]); // Array para almacenar las especies cosechadas
    const [isEditing, setIsEditing] = useState(false); // Estado para controlar si estamos en modo edición

    useEffect(() => {
        if (lote) {
            setFormData({
                lotCode: lote.lotCode || '',
                startDate: lote.startDate || '',
                estimatedEndDate: lote.estimatedEndDate || '',
                productionSpaceId: lote.productionSpace?.id || '',
                reportFrequency: lote.reportFrequency || '',
                cycleStage: lote.cycleStage || '',
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
        fetchEspecies();
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

    const fetchEspacioDetalles = async (id) => {
        try {
            const espacios = await EspacioService.getAllEspacio();
            const espacio = espacios.find(espacio => espacio.id === id);
            setEspacioDetalles(espacio);
        } catch (error) {
            console.error("Error al obtener detalles del espacio:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.finalWeight || !formData.finalIndividuals) {
            console.error("Ambos campos son necesarios.");
            return;
        }

        const newHarvestData = {
            id: modalEspecie.id,
            finalWeight: parseFloat(formData.finalWeight),
            finalIndividuals: parseInt(formData.finalIndividuals, 10)
        };

        try {
            if (isEditing) {
                // Editar la cosecha existente
                await LoteService.updateCosecha(lote.id, { harvest: [newHarvestData] });
            } else {
                // Crear nueva cosecha
                setHarvestData(prevHarvestData => [...prevHarvestData, newHarvestData]);
                await LoteService.updateCosecha(lote.id, { harvest: [newHarvestData] });
            }

            // Cambiar estado de isHarvested a true
            setLoteConEspecies(prevState => ({
                ...prevState,
                productionLotSpecies: prevState.productionLotSpecies.map(specie =>
                    specie.id === modalEspecie.id ? { ...specie, isHarvested: true } : specie
                )
            }));

            onUpdate();
            closeModalHandler();
        } catch (error) {
            console.error("Error al actualizar la cosecha:", error);
        }
    };
    const openModal = (especie) => {
        setModalEspecie(especie);

        // Revisar si la especie tiene valores de cosecha para poner en modo edición
        const editingMode = especie.finalWeight !== undefined && especie.finalIndividuals !== undefined;
        setIsEditing(editingMode);

        if (!editingMode) {
            // Si es un nuevo registro, vaciar los valores de formData
            setFormData({
                finalWeight: '',
                finalIndividuals: ''
            });
        } else {
            // Si es edición, cargar los valores existentes
            setFormData({
                finalWeight: especie.finalWeight || '',
                finalIndividuals: especie.finalIndividuals || ''
            });
        }
    };




    const openCreateModal = () => {
        setModalEspecie(null);
        setFormData({ finalWeight: '', finalIndividuals: '' });
        setIsEditing(false);  // Modo creación
    };

    const closeModalHandler = () => {
        setModalEspecie(null); // Solo se cierra el modal de cosecha
        setIsEditing(false); // Reinicia el modo
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium">Especie</label>
                <select
                    name="productionSpaceId"
                    value={formData.productionSpaceId}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded-md p-2"
                    required
                >
                    <option value="">Seleccione una opción</option>
                    {Especies.map(species => (
                        <option key={species.id} value={species.id}>
                            {species.common_name}
                        </option>
                    ))}
                </select>
            </div>

            {loteConEspecies.productionLotSpecies.length > 0 && (
                <div>
                    <div className="grid grid-cols-2 gap-4 py-2">
                        {loteConEspecies.productionLotSpecies.map((especie) => (
                            <div key={especie.id} className="border p-4 rounded-md bg-gray-100 shadow-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p><strong>{especie.specie.common_name}</strong></p>
                                        <p>Peso inicial: {especie.initialWeight} kg</p>
                                        <p>Individuos: {especie.initialIndividuals}</p>
                                    </div>
                                    {especie.finalWeight && especie.finalIndividuals ? (
                                        <button
                                            type='button'
                                            onClick={() => openModal(especie)}
                                            className="text-[#168C0DFF]"
                                        >
                                            <FaEdit />
                                        </button>
                                    ) : (
                                        <button
                                            type='Button'
                                            onClick={() => openModal(especie)}
                                            className="bg-[#168C0DFF] text-white px-4 py-2 rounded"
                                        >
                                            Cosechar
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {modalEspecie && (
                
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-z0">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <div className="bg-[#345246] text-white px-6 py-3 rounded-t-lg flex justify-between items-center mt-[-24px] m-[-24px] mb-4">
                    <h3 className="text-xl font-bold mb-4">{isEditing ? `Editar` : `Cosechar a`} {modalEspecie.specie.common_name}</h3>

          
        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Peso Total</label>
                                <input
                                    type="number"
                                    name="finalWeight"
                                    value={formData.finalWeight}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border rounded-md p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Cantidad de Individuos Finales</label>
                                <input
                                    type="number"
                                    name="finalIndividuals"
                                    value={formData.finalIndividuals}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border rounded-md p-2"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={closeModalHandler}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-[#168C0DFF] text-white px-4 py-2 rounded"
                            >
                                {isEditing ? `Actualizar` : `Cosechar`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
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

export default FormCosechar;
