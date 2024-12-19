import React, { useEffect, useState } from 'react';
import { IoCloudUploadOutline } from "react-icons/io5";
import UploadToS3 from '../../../config/UploadToS3';
import ActuadorMantenimientoService from '../../../services/MantenimientoAct';
import VariableTypeService from '../../../services/VariableType';
import RegistrerTypeServices from '../../../services/RegistrerType';
import CompanyService from '../../../services/CompanyService';
import { useCompanyContext } from '../../../context/CompanyContext';
import ActuadorService from "../../../services/ActuadorService";
import moment from 'moment';

const FromMantenimiento = ({selectedCompany,actuadorId, showErrorAlert, onUpdate, actuador, mode, closeModal, companyId }) => {
  const companySeleector = JSON.parse(localStorage.getItem("selectedCompany"));

  const [variableTypes, setVariableTypes] = useState([]);
  const [registerTypes, setRegisterTypes] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [isDashboard, setIsDashboard] = useState(false);
  const [isIncrement, setIsIncrement] = useState(false);
  const [formData, setFormData] = useState({
    maintenanceDate: '',
    actuator_id: '',
    startTime: '',
    endTime: '',
    maintenanceType: '',
    replacedParts: '',
    testReport: '',
    media: '',
    actuatorStatus: '', // Valor inicial válido
    energyConsumption: '',
    estimatedReplacementDate: '',
    remarks: '',
  });
  


  const [maintenanceTypes] = useState([
    { id: 'Preventivo', name: 'Preventivo' },
    { id: 'Correctivo', name: 'Correctivo'},
    { id: 'Limpieza y revisión física', name: 'Limpieza y revisión física' },
  ]);
  const [actuadorsStatus] = useState([
    { id: 'Apagado', name: 'Apagado' },
    { id: 'Encendido', name: 'Encendido' },
    { id: 'En Mantenimiento', name: 'En Mantenimiento' },
    { id: 'Dañado', name: 'Dañado' },
  ]);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchMantenimiento = async () => {
      try {

        const mantenimientoActuador = await ActuadorMantenimientoService.getAllMantenimiento();
        setVariableTypes(mantenimientoActuador);
      } catch (error) {
        console.error('Error al obtener los mantenimientos del actuador:', error);
      }
    };
    const fetchActuador = async () => {
        try {
  
          const Actuador = await ActuadorService.getAllActuador();
          setVariableTypes(Actuador);
        } catch (error) {
          console.error('Error al obtener los mantenimientos del actuador:', error);
        }
      };

   

    const fetchCompanies = async () => {
      try {
        const fetchedCompanies = await CompanyService.getAllCompany();
        setCompanies(fetchedCompanies);
      } catch (error) {
        console.error('Error al obtener las empresas:', error);
      }
    };

    fetchActuador();

    fetchMantenimiento();
    fetchCompanies();
  }, []); 

  useEffect(() => {
    if (selectedCompany) {
      setFormData((prevData) => ({
        ...prevData,
        company_id: companySeleector.value || '' 
      }));
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (actuadorId) {  
      console.log('ID del actuador recibido:', actuadorId); 
      setFormData((prevData) => ({
        ...prevData,
        actuator_id: actuadorId  
      }));
    } else {
      console.error('actuadorId no está definido o es null.');
    }
  }, [actuadorId]);
  

  
  useEffect(() => {
    if (mode === 'edit' || mode === 'view') {
      setFormData({
        maintenanceDate: actuador.name || '',
        startTime: actuador.startTime || '',
        endTime: actuador.endTime || '',
        actuator_id: actuador.actuator_id|| '',
        energyConsumption: actuador.energyConsumption || '', 
        maintenanceType: actuador.maintenanceType || '', 
        testReport: actuador.testReport || '',
        media: actuador.media || '',
        actuatorStatus: actuador.actuatorStatus || '',
        estimatedReplacementDate: actuador.estimatedReplacementDate || '',
        remarks: actuador.remarks || '',
        // company_id: actuador.company_id
      });
      setImagePreview(actuador.media);
    } else {
      setFormData({
        maintenanceDate: '' ,
        startTime: '' ,
        endTime: '' ,
        maintenanceType: '' ,
        replacedParts: '' ,
        testReport: '' ,
        media: '' ,
        actuatorStatus: '' ,
        estimatedReplacementDate: '' ,
        remarks: '' ,
        actuator_id: '',
        // informational_calculation: '',
        energyConsumption: '',
        // company_id: companySeleector.value || ''
      });
    }
  }, [actuador, mode]); // This effect runs when actuador or mode changes.



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  

// Esta función convierte la hora seleccionada a una fecha completa con la hora elegida.
const handleTimeChange = (e) => {
  const { name, value } = e.target;

  const [hours, minutes] = value.split(":");

  const updatedDate = moment().set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });

  const isoString = updatedDate.toISOString();

  setFormData({
    ...formData,
    [name]: isoString, 
  });
};

const formatTime = (time) => {
  return moment(time).format('HH:mm');
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Validar y transformar campos específicos
    const energyConsumption = parseFloat(formData.energyConsumption);
    if (isNaN(energyConsumption)) {
      throw new Error("El valor de energyConsumption debe ser un número.");
    }

    // const actuatorStatus = String(formData.actuatorStatus || '').trim();
    // if (!actuatorStatus) {
    //   throw new Error("El estado del actuador es obligatorio.");
    // }

    // Datos formateados correctamente
    const formDataToSubmit = {
      ...formData,
      media: formData.media || '',
      maintenanceDate: formData.maintenanceDate,
      startTime: new Date(formData.startTime),
      endTime: new Date(formData.endTime),
      maintenanceType: formData.maintenanceType,
      replacedParts: formData.replacedParts,
      testReport: formData.testReport,
      actuatorStatus: formData.actuatorStatus,
      estimatedReplacementDate: formData.estimatedReplacementDate,
      remarks: formData.remarks,
      energyConsumption: energyConsumption,
      actuator_id: actuadorId || formData.actuator_id,
    };

    console.log('Datos enviados al servicio:', formDataToSubmit);
    console.log('mode',mode)

    if (mode === 'mantenimiento') {
      const createdMantenimiento = await ActuadorMantenimientoService.createMantenimiento(formDataToSubmit);
      console.log('Respuesta del backend:', createdMantenimiento);
      showErrorAlert("Mantenimiento creado correctamente.");
    } else if (mode === 'edit') {
      await ActuadorMantenimientoService.updateMantenimiento(actuadorId, formDataToSubmit);
      showErrorAlert("Mantenimiento actualizado correctamente.");
    }

    onUpdate();
    closeModal();
  } catch (error) {
    console.error('Error al guardar el mantenimiento:', error);
    console.error('Detalles del error:', error.response?.data);
    showErrorAlert("Hubo un error al guardar el mantenimiento.");
  }
};


 useEffect(() => {
  if (actuadorId) {
    const fetchActuadorDetails = async () => {
      try {
        const actuadorDetails = await ActuadorService.getActuadorById(actuadorId);
        console.log('Detalles del actuador:', actuadorDetails);

        setFormData((prevData) => {
          console.log('Formulario actualizado:', { ...prevData, estimatedReplacementDate: actuadorDetails.estimatedChangeDate });
          return {
            ...prevData,
            estimatedReplacementDate: actuadorDetails.estimatedChangeDate || '',
          };
        });
      } catch (error) {
        console.error('Error al obtener los detalles del actuador:', error);
      }
    };

    fetchActuadorDetails();
  }
}, [actuadorId]);



  const handleIconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        icon: file,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="actuador-maintenanceDate" className="block text-sm font-medium text-gray-700">Fecha del mantenimiento</label>
        <input
          type="date"
          id="actuador-maintenanceDate"
          name="maintenanceDate"
          placeholder="Fecha del mantenimiento"
          value={formData.maintenanceDate}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
          disabled={mode === 'view'}
        />
      </div>
      
      
      <div className="grid grid-cols-2 gap-4 mt-5">
      <div>
        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Hora Inicio</label>
        <input
          type="time"
          id="startTime"
          name="startTime"
          placeholder="Hora Inicio"
          value={formatTime(formData.startTime)}
          onChange={handleTimeChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
          disabled={mode === 'view'}
        />
      </div>
      <div>
        <label htmlFor="endTimee" className="block text-sm font-medium text-gray-700">Hora Finalización</label>
        <input
          type="time"
          id="endTimee"
          name="endTime"
          placeholder="Hora Finalización"
          value={formatTime(formData.endTime)}
          onChange={handleTimeChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
          disabled={mode === 'view'}
        />
      </div>
        <div>
          <label htmlFor="maintenanceType" className="block text-sm font-medium text-gray-700">Tipo de mantenimiento</label>
          <select
            name="maintenanceType"
            value={formData.maintenanceType}
            onChange={handleChange}
            disabled={mode === 'view'}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Seleccione una opción</option>
            {maintenanceTypes.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
        </div>
        <div>
        <label htmlFor="energyConsumption" className="block text-sm font-medium text-gray-700">Partes reemplazadas</label>
        <input
          type="text"
          id="replacedParts"
          name="replacedParts"
          placeholder="Consumo de energía"
          value={formData.replacedParts}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
          disabled={mode === 'view'}
        />
      </div>
      <div>
        <label htmlFor="energyConsumption" className="block text-sm font-medium text-gray-700">Consumo de energía</label>
        <input
          type="number"
          id="energyConsumption"
          name="energyConsumption"
          placeholder="Consumo de energía"
          value={formData.energyConsumption}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
          disabled={mode === 'view'}
        />
      </div>
      <div>
        <label htmlFor="testReport" className="block text-sm font-medium text-gray-700">Informe de pruebas</label>
        <input
          type="text"
          id="testReport"
          name="testReport"
          placeholder="URL de informe"
          value={formData.testReport}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
          disabled={mode === 'view'}
        />
      </div>
      
      <div>
        <label htmlFor="media" className="block text-sm font-medium text-gray-700">Imagen o video</label>
        <input
          type="text"

          id="media"
          name="media"
          placeholder="URL de Imagen o video"
          value={formData.media}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
          disabled={mode === 'view'}
        />
      </div>
      
      <div>
  <label htmlFor="actuatorStatus" className="block text-sm font-medium text-gray-700">Estado del Actuador</label>
  <select
    id="actuatorStatus"
    name="actuatorStatus"
    value={formData.actuatorStatus}
    onChange={handleChange}
    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
    required
    disabled={mode === 'view'}
  >
    {actuadorsStatus.map((status) => (
      <option key={status.id} value={status.id}>
        {status.name}
      </option>
    ))}
  </select>
</div>
      </div>
      <div>
        <label htmlFor="estimatedReplacementDate" className="block text-sm font-medium text-gray-700">Fecha estimada de cambio(editable)</label>
        <input
          type="date"
          id="estimatedReplacementDate"
          name="estimatedReplacementDate"
          placeholder="Hora Finalización"
          value={formData.estimatedReplacementDate.substr(0,10)}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
          disabled={mode === 'view'}
        />
      </div>

    
      <div>
        <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">Observaciones</label>
        <input
          type="text"
          id="remarks"
          name="remarks"
          placeholder="Observaciones"
          value={formData.remarks}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
          disabled={mode === 'view'}
        />
      </div>

      {/* BOTONES */}

      <div className="flex justify-end space-x-2">
        {mode === 'view' ? (
          <button
            type="button"
            onClick={closeModal}
            className="bg-white text-gray-500 px-4 py-2 rounded border border-gray-400"
          >
            Volver
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={closeModal}
              className="bg-white text-gray-500 px-4 py-2 rounded border border-gray-400"
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="bg-[#168C0DFF] text-white px-4 py-2 rounded"
            >
              {mode === 'create' ? 'Crear Mantenimiento' : 'Crear Mantenimiento'}

            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default FromMantenimiento;
