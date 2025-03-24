import React, { useEffect, useState } from 'react';
import LoteService from "../../../services/lotesService";
import EspacioService from "../../../services/espacios";
import SpeciesService from "../../../services/SpeciesService";

const FormCambiarEtapa = ({ lote, onUpdate, closeModal, showErrorAlert }) => {
    const [espacios, setEspacios] = useState([]);
    const [especies, setEspecies] = useState([]);
    const [etapas, setEtapas] = useState([]); // Inicializar etapas como un array vacío
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

    useEffect(() => {
        fetchLotes();
        if (lote) {
            setFormData(prev => ({
                ...prev,
                lotCode: lote.lotCode || '',
                specieId: lote.productionLotSpecies?.[0]?.specie?.id || '',
                cycleStage: lote.cycleStage || ''
            }));
            if (lote.id) fetchEspeciesPorLote(lote.id);
        }
    }, [lote]);

    const fetchEspacios = async () => {
        try {
            const espaciosData = await EspacioService.getAllEspacio();
            setEspacios(espaciosData);
        } catch (error) {
            console.error("Error al obtener los espacios:", error);
        }
    };

    const [lotes, setLotes] = useState([]);

    const fetchLotes = async () => {
        try {
            const lotesData = await LoteService.getAllLots();
            setLotes(lotesData);
        } catch (error) {
            console.error("Error al obtener los lotes:", error);
        }
    };

    const fetchEspeciesPorLote = async (loteId) => {
        try {
            const searchParameter = {
                productionLotSpecie: {
                    productionLot: {
                        id: parseInt(loteId),
                    },
                },
            };
            const especiesData = await SpeciesService.getAllSpecie(0, searchParameter);
            setEspecies(especiesData);
        } catch (error) {
            console.error("Error al obtener las especies:", error);
        }
    };

    const fetchEtapasPorEspecie = async (especieId) => {
        try {
            const especieData = await SpeciesService.getSpecieById(especieId);
            if (especieData && especieData.stages) {
                const etapasList = especieData.stages.map(stageItem => ({
                    id: stageItem.stage.id,
                    name: stageItem.stage.name
                }));
                setEtapas(etapasList);
            } else {
                setEtapas([]);
            }
        } catch (error) {
            console.error("Error al obtener las etapas:", error);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name === "productionCycleStage") {
            setFormData(prevFormData => ({
                ...prevFormData,
                trackingConfig: {
                    ...prevFormData.trackingConfig,
                    productionCycleStage: value
                }
            }));
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value
            }));
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
    
        const data = {
            trackingConfig: {
                trackingStartDate: "", // Se manda vacío
                trackingFrequency: "", // Se manda vacío
                productionCycleStage: formData.trackingConfig.productionCycleStage, // Solo este tiene valor
            },
        };
    
    
        try {
            await LoteService.updateLots(lote, data);
            showErrorAlert("con cambio de etapa");
    
            onUpdate(); 
            closeModal();
        } catch (error) {
            console.error("Error al actualizar la etapa de producción:", error);
        }
    };
    


    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium">Lote de producción</label>
                <select
                    name="lotCode"
                    value={formData.lotCode}
                    onChange={(e) => {
                        const selectedLoteId = e.target.value;
                        setFormData(prevFormData => ({
                            ...prevFormData,
                            lotCode: selectedLoteId,
                            specieId: '', // Reinicia especie
                            cycleStage: '' // Reinicia etapa
                        }));
                        fetchEspeciesPorLote(selectedLoteId); // Cargar especies para el nuevo lote
                    }}
                    className="mt-1 block w-full border rounded-md p-2"
                    required
                >
                    <option value="">Seleccione un lote</option>
                    {lotes.map(lote => (
                        <option key={lote.id} value={lote.id}>
                            {lote.lotCode}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mt-4">
                <label className="block text-sm font-medium">Especie</label>
                <select
                    name="specieId"
                    value={formData.specieId || ""}
                    onChange={(e) => {
                        const { value } = e.target;
                        setFormData(prevFormData => ({
                            ...prevFormData,
                            specieId: value,
                            cycleStage: '' // Reinicia la etapa al cambiar la especie
                        }));
                        fetchEtapasPorEspecie(value); // Actualiza las etapas para la especie seleccionada
                    }}
                    className="mt-1 block w-full border rounded-md p-2"
                    required
                >
                    <option value="">Seleccione una opción</option>
                    {especies.map(especie => (
                        <option key={especie.id} value={especie.id}>
                            {especie.common_name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mt-4">
                <label className="block text-sm font-medium">Etapa de producción</label>
                <select
                    name="productionCycleStage"
                    value={formData.productionCycleStage}
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
                    onClick={closeModal}
                    className="bg-gray-white border border-gray-400 text-gray-500 px-4 py-2 rounded"
                >
                    Volver
                </button>
                <button
                    type="submit"
                    className="bg-[#168C0DFF] text-white px-4 py-2 rounded"
                >
                    Cambiar etapa
                </button>
            </div>
        </form>
    );
};

export default FormCambiarEtapa;
