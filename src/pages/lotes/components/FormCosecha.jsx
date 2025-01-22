import React, { useEffect, useState } from 'react';
import LoteService from "../../../services/lotesService";
import EspacioService from "../../../services/espacios";
import EspeciesService from "../../../services/SpeciesService";
import { FaTrash, FaEdit } from 'react-icons/fa';
import GenericModal from '../../../components/genericModal';

const FormCosechar = ({ lote, onUpdate, closeModal, showErrorAlert }) => {
    const [step, setStep] = useState(1);
    const [espacios, setEspacios] = useState([]);
    const [Especies, setEspecies] = useState([]);
    const [espacioDetalles, setEspacioDetalles] = useState(null);
    const [formData, setFormData] = useState({
        finalWeight: '',
        finalIndividuals: '',
        selectedSpecieId: '',  
    });

    const [loteConEspecies, setLoteConEspecies] = useState(lote);
    const [modalEspecie, setModalEspecie] = useState(null);
    const [harvestData, setHarvestData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [especieNotFound, setEspecieNotFound] = useState(false); // Estado para manejar el mensaje de especie no encontrada

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
            console.log('lote traido', lote)

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

        if (name === 'selectedSpecieId') {
            // Verificar si la especie seleccionada está en el lote
            const especieSeleccionada = Especies.find(specie => specie.id === value);
            const especieEnLote = loteConEspecies.productionLotSpecies.some(specie => specie.specie.id === value);

            if (!especieEnLote) {
                setEspecieNotFound(true); // Si no está en el lote, mostrar el mensaje
            } else {
                setEspecieNotFound(false); // Si está en el lote, ocultar el mensaje
            }
        }
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
                await LoteService.updateCosecha(lote.id, { harvest: [newHarvestData] });
                setIsEditing(false)
                showErrorAlert("cosechado");
                ("Cosechado");
            } else {
                setHarvestData(prevHarvestData => [...prevHarvestData, newHarvestData]);
                await LoteService.updateCosecha(lote.id, { harvest: [newHarvestData] });
                showErrorAlert("cosechado");

            }
    
            setLoteConEspecies(prevState => ({
                ...prevState,
                productionLotSpecies: prevState.productionLotSpecies.map(specie =>
                    specie.id === modalEspecie.id ? { ...specie, isHarvested: true } : specie
                )
            }));
    
            onUpdate();
            closeModalHandler();
            closeModal();
        } catch (error) {
            console.error("Error al actualizar la cosecha:", error);
        }
    };

    const openModal = (especie) => {
        setModalEspecie(especie);
        const editingMode = especie.finalWeight !== undefined && especie.finalIndividuals !== undefined;
        setIsEditing(editingMode);
    
        if (!editingMode) {
            setFormData({
                finalWeight: '',
                finalIndividuals: ''
            });
        } else {
            setFormData({
                finalWeight: especie.finalWeight || '',
                finalIndividuals: especie.finalIndividuals || ''
            });
        }
    };

    const closeModalHandler = () => {
        setModalEspecie(null);
        setIsEditing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium">Especie</label>
                <select
                    name="selectedSpecieId"
                    value={formData.selectedSpecieId}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded-md p-2"
                >
                    <option value="">Seleccione una opción</option>
                    {Especies.map(species => (
                        <option key={species.id} value={species.id}>
                            {species.common_name}
                        </option>
                    ))}
                </select>
            </div>

            {especieNotFound && (
                <div className="text-red-500 mt-2">
                    Esta especie no está en este lote.
                </div>
            )}

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
                                            type="button"
                                            onClick={() => openModal(especie)}
                                            className="text-[#168C0DFF]"
                                        >
                                            <FaEdit />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
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
                <GenericModal
                    title={isEditing ? `Cosechar` : `Cosechar a ${modalEspecie.specie.common_name}`}
                    onClose={closeModalHandler}
                >
                    <div>
                        <h3 className="font-semibold mb-4">
                            {isEditing ? `Especie` : `Cosechar a`} {modalEspecie.specie.common_name}
                        </h3>
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
                                {isEditing ? `Guardar` : `Cosechar`}
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
                    type="button"
                    onClick={() => closeModal()}
                    className="bg-[#168C0DFF] text-white px-4 py-2 rounded"
                >
                    Crear
                </button>
            </div>

        </form>
    );
};

export default FormCosechar;
