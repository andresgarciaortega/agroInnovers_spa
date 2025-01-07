import React, { useEffect, useState } from 'react';
import LoteService from "../../../services/lotesService";
import EspacioService from "../../../services/espacios";
import { FaTrash } from 'react-icons/fa';

const FormEditarLote = ({ lote, onUpdate, closeModal }) => {
    const [step, setStep] = useState(1);
    const [espacios, setEspacios] = useState([]); // Lista de espacios disponibles
    const [espacioDetalles, setEspacioDetalles] = useState(null);
    const [formData, setFormData] = useState({
        lotCode: '',
        startDate: '',
        estimatedEndDate: '',
        productionSpaceId: '',
        reportFrequency: '',
        cycleStage: ''
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
                cycleStage: lote.cycleStage || ''
            });
            if (lote.productionSpace?.id) {
                fetchEspacioDetalles(lote.productionSpace.id); 
            }
            setLoteConEspecies(lote); 
        }
        fetchEspacios(); 
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Verificar si hay especies antes de enviar
        if (loteConEspecies.productionLotSpecies.length === 0) {
            console.error("El lote debe tener al menos una especie.");
            return;  // Detener el envío si no hay especies
        }
    
        // Asegúrate de que el id de cada especie sea un número
        const updatedSpecies = loteConEspecies.productionLotSpecies.map(specie => ({
            ...specie,
            specieId: Number(specie.specieId)  // Convertir el specieId a número
        }));
    
        try {
            // Enviar los datos de la actualización, incluyendo las especies con specieId numérico
            await LoteService.updateLots(lote.id, { 
                ...formData, 
                productionLotSpecies: updatedSpecies // Usar las especies con specieId numérico
            });
    
            // Llamar a la función de actualización para refrescar la vista
            onUpdate();
            
            // Cerrar el modal después de la actualización
            closeModal();
        } catch (error) {
            console.error("Error al actualizar el lote:", error);
        }
    };
    
    const handleEliminarEspecie = (especieId) => {
        const updatedSpecies = loteConEspecies.productionLotSpecies.filter(especie => especie.id !== especieId);
        setLoteConEspecies({
            ...loteConEspecies,
            productionLotSpecies: updatedSpecies // Actualiza el estado después de eliminar una especie
        });
    
        // Verifica si hay especies restantes antes de enviar
        if (updatedSpecies.length === 0) {
            console.log("No hay especies para enviar.");
        } else {
            // Si todavía hay especies, actualiza el lote
            LoteService.updateLots(lote.id, {
                ...formData,
                productionLotSpecies: updatedSpecies
            }).then(() => {
                onUpdate();
            }).catch((error) => console.error("Error al eliminar la especie:", error));
        }
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
                                                        onClick={() => handleEliminarEspecie(especie.id)}
                                                        className="text-red-600"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}


                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="bg-[#168C0DFF] text-white px-4 py-2 rounded"
                        >
                            Siguiente
                        </button>
                    </div>
                </>
            )}

{step === 2 && (
  <>
    <h3 className="text-lg font-semibold">Paso 2: Configuración de reportes</h3>

    <div className="grid grid-cols-2 gap-4 mt-4">
      <div className="col-span-1">
        <label className="block text-sm font-medium">Fecha de inicio</label>
        <input
          type="date"
          name="reportStartDate"
          value={formData.reportStartDate}
          onChange={handleChange}
          className="mt-1 block w-full border rounded-md p-2"
          required
        />
      </div>

      <div className="col-span-1">
        <label className="block text-sm font-medium">Frecuencia de reporte</label>
        <input
          type="text"
          name="reportFrequency"
          value={formData.reportFrequency}
          onChange={handleChange}
          className="mt-1 block w-full border rounded-md p-2"
          required
        />
      </div>
    </div>

    <div className="mt-4">
      <label className="block text-sm font-medium">Etapa del ciclo</label>
      <input
        type="text"
        name="cycleStage"
        value={formData.cycleStage}
        onChange={handleChange}
        className="mt-1 block w-full border rounded-md p-2"
        required
      />
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
  </>
)}

        </form>
    );
};

export default FormEditarLote;
