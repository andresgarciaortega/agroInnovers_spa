import React, { useEffect, useState } from 'react';
import { IoCloudUploadOutline } from "react-icons/io5";
import UploadToS3 from '../../../config/UploadToS3';
import SensorMantenimientoService from '../../../services/SensorMantenimiento';
import VariableTypeService from '../../../services/VariableType';
import RegistrerTypeServices from '../../../services/RegistrerType';
import CompanyService from '../../../services/CompanyService';
import { useCompanyContext } from '../../../context/CompanyContext';
import SensorService from "../../../services/SensorService";
import moment from 'moment';

const FromMantenimiento = ({selectedCompany,sensorId, showErrorAlert, onUpdate, sensor, mode, closeModal, companyId }) => {
  const companySeleector = JSON.parse(localStorage.getItem("selectedCompany"));

  const [variableTypes, setVariableTypes] = useState([]);
  const [registerTypes, setRegisterTypes] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [isDashboard, setIsDashboard] = useState(false);
  const [isIncrement, setIsIncrement] = useState(false);
  const [formData, setFormData] = useState({
   maintenanceDate: '' ,
  startTime: '' ,
  endTime: '' ,
  maintenanceType: '' ,
  replacedParts: '' ,
  testReport: '' ,
  media: '' ,
  sensorStatus: '' ,
  estimatedReplacementDate: '' ,
  remarks: '' ,
  sensor_id: '',
    // company_id: companySeleector.value || ''
  });


  const [maintenanceTypes] = useState([
    { id: 'Preventivo', name: 'Preventivo' },
    { id: 'Correctivo', name: 'Correctivo'},
    { id: 'Limpieza y revisión física', name: 'Limpieza y revisión física' },
  ]);
  const [sensorsStatus] = useState([
    { id: 'Apagado', name: 'Apagado' },
    { id: 'Encendido', name: 'Encendido' },
    { id: 'En Mantenimiento', name: 'En Mantenimiento' },
    { id: 'Dañado', name: 'Dañado' },
  ]);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchMantenimiento = async () => {
      try {

        const mantenimientoSensor = await SensorMantenimientoService.getAllMantenimiento();
        setVariableTypes(mantenimientoSensor);
      } catch (error) {
        console.error('Error al obtener los mantenimientos del sensor:', error);
      }
    };
    const fetchSensor = async () => {
        try {
  
          const Sensor = await SensorService.getAllSensor();
          setVariableTypes(Sensor);
        } catch (error) {
          console.error('Error al obtener los mantenimientos del sensor:', error);
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

    fetchSensor();

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
    if (sensorId) {  
      console.log('ID del sensor recibido:', sensorId); 
      setFormData((prevData) => ({
        ...prevData,
        sensor_id: sensorId  
      }));
    } else {
      console.error('sensorId no está definido o es null.');
    }
  }, [sensorId]);
  

  
  useEffect(() => {
    if (mode === 'edit' || mode === 'view') {
      setFormData({
        maintenanceDate: sensor.name || '',
        startTime: sensor.startTime || '',
        endTime: sensor.endTime || '',
        sensor_id: sensor.sensor_id|| '', 
        maintenanceType: sensor.maintenanceType || '', 
        testReport: sensor.testReport || '',
        media: sensor.media || '',
        sensorStatus: sensor.sensorStatus || '',
        estimatedReplacementDate: sensor.estimatedReplacementDate || '',
        remarks: sensor.remarks || '',
        // company_id: sensor.company_id
      });
      setImagePreview(sensor.media);
    } else {
      setFormData({
        maintenanceDate: '' ,
        startTime: '' ,
        endTime: '' ,
        maintenanceType: '' ,
        replacedParts: '' ,
        testReport: '' ,
        media: '' ,
        sensorStatus: '' ,
        estimatedReplacementDate: '' ,
        remarks: '' ,
        sensor_id: '',
        informational_calculation: '',
        // company_id: companySeleector.value || ''
      });
    }
  }, [sensor, mode]); // This effect runs when sensor or mode changes.



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

  // Obtener la hora seleccionada en formato HH:mm (ejemplo: "12:00")
  const [hours, minutes] = value.split(":");

  // Usar Moment.js para obtener la fecha actual y combinarla con la hora seleccionada
  const updatedDate = moment().set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });

  // Convertir la fecha completa a formato ISO 8601 (con fecha y hora)
  const isoString = updatedDate.toISOString();

  // Actualizar el estado con la nueva fecha y hora en formato ISO
  setFormData({
    ...formData,
    [name]: isoString, // Guardar la fecha y hora en formato ISO
  });
};

// Formatear la hora para mostrarla en el campo de entrada (HH:mm)
const formatTime = (time) => {
  return moment(time).format('HH:mm');
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSubmit = {
        ...formData,
        media: formData.media || '', // Usar la URL de la imagen (nueva o existente)
        maintenanceDate: formData.maintenanceDate,
        startTime: new Date(formData.startTime), // Convertir a instancia de Date
        endTime: new Date(formData.endTime),     // Convertir a instancia de Date
        maintenanceType: formData.maintenanceType,
        replacedParts: formData.replacedParts,
        testReport: formData.testReport,
        sensorStatus: formData.sensorStatus,
        estimatedReplacementDate: formData.estimatedReplacementDate,
        remarks: formData.remarks,
        sensor_id: sensorId || formData.sensor_id,
      };
  
      if (mode === 'create') {
        const createdMantenimiento = await SensorMantenimientoService.createMantenimiento(formDataToSubmit);
        console.log('Mantenimiento creado:', formDataToSubmit);
        showErrorAlert("Mantenimiento creado correctamente.");
      } else if (mode === 'edit') {
        await SensorMantenimientoService.updateMantenimiento(sensorId, formDataToSubmit);
        showErrorAlert("Mantenimiento actualizado correctamente.");
      }
      console.log('Datos enviados:', formDataToSubmit);
  
      // Actualizar y cerrar modal
      onUpdate();
      closeModal();
  
    } catch (error) {
      console.error('Error al guardar el mantenimiento:', error);
      showErrorAlert("Hubo un error al guardar el mantenimiento.");
    }
  };

 useEffect(() => {
  if (sensorId) {
    const fetchSensorDetails = async () => {
      try {
        const sensorDetails = await SensorService.getSensorById(sensorId);
        console.log('Detalles del sensor:', sensorDetails);

        setFormData((prevData) => {
          console.log('Formulario actualizado:', { ...prevData, estimatedReplacementDate: sensorDetails.estimatedChangeDate });
          return {
            ...prevData,
            estimatedReplacementDate: sensorDetails.estimatedChangeDate || '',
          };
        });
      } catch (error) {
        console.error('Error al obtener los detalles del sensor:', error);
      }
    };

    fetchSensorDetails();
  }
}, [sensorId]);



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
        <label htmlFor="sensor-maintenanceDate" className="block text-sm font-medium text-gray-700">Fecha del mantenimiento</label>
        <input
          type="date"
          id="sensor-maintenanceDate"
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
        <label htmlFor="replacedParts" className="block text-sm font-medium text-gray-700">Piezas reemplazadas</label>
        <input
          type="text"
          id="replacedParts"
          name="replacedParts"
          placeholder="Piezas reemplazadas"
          value={formData.replacedParts}
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
          <label htmlFor="sensorStatus" className="block text-sm font-medium text-gray-700">Estado del sensor</label>
          <select
            id="sensorStatus"
            name="sensorStatus"
            value={formData.sensorStatus}
            onChange={handleChange}
            disabled={mode === 'view'}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          >

            <option value="">Seleccione una opción</option>
            {sensorsStatus.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
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
       
        {/* <div >
          <label htmlFor="type_variable_id" className="block text-sm font-medium text-gray-700">Tipo de sensor</label>
          <select
            id="type_variable_id"
            name="type_variable_id"
            value={formData.type_variable_id}
            onChange={handleChange}
            disabled={mode === 'view'}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Seleccione una opción</option>
            {variableTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <div >
          <label htmlFor="company_id" className="block text-sm font-medium text-gray-700">Empresa</label>
          <select
            id="company_id"
            name="company_id"
            value={formData.company_id}
            onChange={handleChange}
            disabled={mode === 'view'}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Seleccione una empresa</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div> */}
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
