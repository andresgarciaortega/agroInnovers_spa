import React, { useEffect, useState } from 'react';
import EspacioService from "../../../services/espacios";
import EspeciesService from "../../../services/SpeciesService";
import LoteService from "../../../services/lotesService";
import VariableType from '../../../services/VariableType';

const FormRechazar = ({ lote, onUpdate, closeModal,showErrorAlert }) => {
  const [viewMode, setViewMode] = useState('general');
  const [espacioDetalles, setEspacioDetalles] = useState(null);
  const [especies, setEspecies] = useState([]);
  const [loteConEspecies, setLoteConEspecies] = useState([]);
  const [variables, setVariables] = useState([]);
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
    company_id: ''
});


useEffect(() => {
  if (lote && lote.lotCode) {
      setFormData({
          productionLotId: lote.lotCode || '',
          startDate: lote.startDate || '',
          productionLotSpecies:lote.productionLotSpecies || '',
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
  fetchEspecies()
}, [lote]);


  const fetchEspacioDetalles = async (id) => {
    try {
      const espacios = await EspacioService.getAllEspacio();
      const espacio = espacios.find(esp => esp.id === id);
      setEspacioDetalles(espacio);
    } catch (error) {
      console.error("Error al obtener detalles del espacio:", error);
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

  const handleModeChange = (e) => {
    setViewMode(e.target.value);
    if (e.target.value === 'general') {
      setFormData({ ...formData, specieId: '' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica para la razón del rechazo
    if (!formData.rejectionReason) {
        alert("Por favor, indique una razón para el rechazo.");
        return;
    }

    let rejectionData = {}; // Inicializar rejectionData como un objeto vacío

    // Configuración para rechazo general
    if (viewMode === 'general') {
        rejectionData = {
            speciesData: false,
            reason: formData.rejectionReason,
        };
    } 
    // Configuración para rechazo por especie
    else if (viewMode === 'species') {
        if (!formData.specieId) {
            alert("Por favor, seleccione una especie válida.");
            return;
        }

        // Validar que existan datos de lote y especies
        if (
            !loteConEspecies || 
            !loteConEspecies.productLotSpecies || 
            loteConEspecies.productLotSpecies.length === 0
        ) {
            alert("No se encontraron datos de especies en el lote.");
            return;
        }

        // Filtrar y construir los datos para el rechazo por especie
        const specieRejectData = loteConEspecies.productLotSpecies
            .filter(specie => specie.specieId === formData.specieId)
            .map(specie => ({
                id: specie.id,
                reason: formData.rejectionReason,
            }));

        // Validar si se encontraron datos para la especie seleccionada
        if (specieRejectData.length === 0) {
            alert("No se encontró información para la especie seleccionada.");
            return;
        }

        rejectionData = {
            speciesData: true,
            reject: specieRejectData,
        };
    } else {
        alert("Modo de rechazo no válido.");
        return;
    }

    // Enviar los datos de rechazo
    try {
        console.log("Enviando rechazo:", rejectionData);
        await LoteService.updateRechazo(lote.id, rejectionData);
showErrorAlert("Rechazado realizado ");

        onUpdate(); // Actualiza la vista
        closeModal(); // Cierra el modal
    } catch (error) {
        console.error("Error al procesar el rechazo:", error);
        alert("Ocurrió un error al intentar rechazar el lote.");
    }
};

  


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p><strong>Código de lote:</strong> {lote?.lotCode}</p>
          <p><strong>Estado del lote:</strong> {lote?.status}</p>
          <p><strong>Espacio:</strong> {espacioDetalles?.name}</p>
        </div>
        <div>
          <p><strong>Fecha de inicio:</strong> {new Date(lote?.startDate).toLocaleDateString()}</p>
          <p><strong>Fecha estimada de finalización:</strong> {new Date(lote?.estimatedEndDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div>
        <h2 className="font-bold pb-3">Rechazar por lote o por especie</h2>
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
            value={formData.specieId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Seleccione una especie</option>
            {especies.map((specie) => (
              <option key={specie.id} value={specie.id}>
                {specie.common_name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="rejectionReason" className="block text-sm font-medium">
          Razón del rechazo:
        </label>
        <textarea
          id="rejectionReason"
          name="rejectionReason"
          value={formData.rejectionReason}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="4"
        />
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
                Rechazar
            </button>
        </div>
    </form>
  );
};

export default FormRechazar;
