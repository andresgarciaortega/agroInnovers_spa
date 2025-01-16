import React, { useEffect, useState } from 'react';
import LoteService from "../../../services/lotesService";
import EspacioService from "../../../services/espacios";
import { FaTrash } from 'react-icons/fa';

const FormCambiarEtapa = ({ lote, onUpdate, closeModal }) => {
    const [step, setStep] = useState(1);
    const [espacios, setEspacios] = useState([]); // Lista de espacios disponibles
    const [especies, setEspecies] = useState([]); // Lista de especies asociadas al lote
    const [etapas, setEtapas] = useState([]); // Lista de etapas de la especie seleccionada
    const [formData, setFormData] = useState({
        lotCode: '',
        startDate: '',
        estimatedEndDate: '',
        productionSpaceId: '',
        reportFrequency: '',
        cycleStage: '', // Aquí se incluirá la etapa de producción
        trackingConfig: [],
        specieId: '', // ID de la especie seleccionada
    });

    const [loteConEspecies, setLoteConEspecies] = useState(lote); // Estado para manejar el lote con las especies

    useEffect(() => {
        if (lote) {
            setFormData({
                lotCode: lote.lotCode || '',
                startDate: lote.startDate || '',
                estimatedEndDate: lote.estimatedEndDate || '',
                productionSpaceId: lote.productionSpace?.id || '',
                reportFrequency: lote.reportFrequency || '',
                cycleStage: lote.cycleStage || '',
                specieId: lote.productionLotSpecies?.[0]?.specie?.id || '', // Asumiendo que el primer lote tiene una especie
                trackingConfig: lote.trackingConfig || { 
                    trackingStartDate: '', 
                    trackingFrequency: '',
                    productionCycleStage: ''
                }
            });
    
            if (lote.productionSpace?.id) {
                fetchEspacioDetalles(lote.productionSpace.id); 
            }
            fetchEspeciesPorLote(lote.id); // Cargar las especies asociadas al lote
        }
        fetchEspacios(); // Cargar los espacios
    }, [lote]);

    useEffect(() => {
        if (formData.specieId) {
            fetchEtapasPorEspecie(formData.specieId); // Cargar las etapas al seleccionar una especie
        }
    }, [formData.specieId]);
    useEffect(() => {
        if (lote && lote.id) {
            fetchEspeciesPorLote(lote.id);
            console.log('fetchEspeciesPorLote', lote.id) // Cargar las especies asociadas al lote
        }
    }, [lote]);
    useEffect(() => {
        console.log('especies', especies);  // Verifica que las especies estén correctamente asignadas
    }, [especies]);
    
    
    const fetchEspacios = async () => {
        try {
            const espaciosData = await EspacioService.getAllEspacio();
            setEspacios(espaciosData); 
        } catch (error) {
            console.error("Error al obtener los espacios:", error);
        }
    };

    const fetchEspeciesPorLote = async (loteId) => {
        try {
            const especiesData = await LoteService.getSpecieByLote({ productionLot: { id: loteId } });
            setEspecies(especiesData);
        } catch (error) {
            console.error("Error al obtener las especies:", error);
        }
    };
    

    const fetchEtapasPorEspecie = async (especieId) => {
        try {
            const etapasData = await LoteService.getEtapasPorEspecie(especieId);
            setEtapas(etapasData);
        } catch (error) {
            console.error("Error al obtener las etapas:", error);
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
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loteConEspecies.productionLotSpecies.length === 0) {
            console.error("El lote debe tener al menos una especie.");
            return;  
        }

        try {
            await LoteService.updateLots(lote.id, {
                ...formData,
                productionLotSpecies: loteConEspecies.productionLotSpecies 
            });

            onUpdate();
            closeModal();
        } catch (error) {
            console.error("Error al actualizar el lote:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium">Lote de producción</label>
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

            <div className="mt-4">
                <label className="block text-sm font-medium">Especie</label>
                <select
                    name="specieId"
                    value={formData.specieId}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded-md p-2"
                    required
                >
                    <option value="">Seleccione una opción</option>
                    {especies.map(especie => (
                        <option key={especie.id} value={especie.id}>
                            {especie.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mt-4">
                <label className="block text-sm font-medium">Etapa de producción</label>
                <select
                    name="cycleStage"
                    value={formData.cycleStage}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded-md p-2"
                    required
                >
                    <option value="">Seleccione una opción</option>
                    {etapas.map(etapa => (
                        <option key={etapa.id} value={etapa.id}>
                            {etapa.name}
                        </option>
                    ))}
                </select>
            </div>

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
        </form>
    );
};

export default FormCambiarEtapa;
