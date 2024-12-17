import React, { useEffect, useState } from 'react';
import { IoCloudUploadOutline } from "react-icons/io5";
import UploadToS3 from '../../../config/UploadToS3';
import SensorMantenimientoService from '../../../services/SensorMantenimiento';
import VariableTypeService from '../../../services/VariableType';
import RegistrerTypeServices from '../../../services/RegistrerType';
import CompanyService from '../../../services/CompanyService';
import { useCompanyContext } from '../../../context/CompanyContext';
import SensorService from "../../../services/SensorService";

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
    company_id: companySeleector.value || ''
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
  }, []); // The empty dependency array ensures this only runs once when the component mounts.

  useEffect(() => {
    if (selectedCompany) {
      setFormData((prevData) => ({
        ...prevData,
        company_id: companySeleector.value || '' // Sincroniza selectedCompany con el formulario
      }));
    }
  }, [selectedCompany]); // This effect only runs when selectedCompany changes.

  useEffect(() => {
    if (sensorId) {  // Si hay un sensorId, actualizamos el formulario
      setFormData((prevData) => ({
        ...prevData,
        sensor_id: sensorId  // Asignamos el ID del sensor
      }));
    }
  }, [sensorId]);

  
  useEffect(() => {
    if (mode === 'edit' || mode === 'view') {
      setFormData({
        maintenanceDate: sensor.name || '',
        startTime: sensor.startTime || '',
        endTime: sensor.endTime || '',
        sensor_id: sensor.sensor?.id || '', // Asignación correcta del id de typeVariable
        maintenanceType: sensor.maintenanceType || '', // Asignación correcta del id de typeRegister
        testReport: sensor.testReport || '',
        media: sensor.media || '',
        sensorStatus: sensor.sensorStatus || '',
        estimatedReplacementDate: sensor.estimatedReplacementDate || '',
        remarks: sensor.remarks || '',
        company_id: sensor.company_id
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
        company_id: companySeleector.value || ''
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



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Verificar si se ha seleccionado una nueva imagen
      let logoUrl = '';
      // Si se ha seleccionado una nueva imagen
      if (formData.media) {
        // Subir la nueva imagen a S3 y obtener la URL
        logoUrl = await UploadToS3(formData.media);
      } else if (mode === 'edit' && sensor.media) {
        // Si no se seleccionó una nueva imagen y estamos en modo edición, mantener la URL de la imagen existente
        logoUrl = sensor.media;
      }

      // Crear el objeto de datos a enviar
      const formDataToSubmit = {
        ...formData,
        media: logoUrl || '',  // Usar la URL de la imagen (nueva o existente)
        maintenanceDate: formData.maintenanceDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        maintenanceType: formData.maintenanceType,
        replacedParts: formData.replacedParts,
        testReport: formData.testReport,
        media: formData.media,
        sensorStatus: formData.sensorStatus,
        estimatedReplacementDate: formData.estimatedReplacementDate,
        remarks: formData.remarks,
        sensor_id: formData.sensor_id,
        company_id: Number(companyId) || Number(formData.company_id),  // Usar el ID de la empresa
      };
      if (mode === 'create') {
        const createdMantenimiento = await SensorMantenimientoService.createMantenimiento(formDataToSubmit);
        showErrorAlert("creada");
      } else if (mode === 'edit') {
        await SensorMantenimientoService.updateMantenimiento(sensor.id, formDataToSubmit);
        showErrorAlert("editada");
      }

      // Actualizar y cerrar modal
      onUpdate();
      closeModal();

    } catch (error) {
      console.error('Error al guardar la sensor:', error);
      showErrorAlert("Hubo un error al guardar la sensor.");
    }
  };


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
      {/* <div className="mb- py-" disabled={mode === 'view'}>
        <label>Adjuntar Logo</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-0 text-center cursor-pointer hover:bg-gray-50" onClick={() => document.getElementById('logo-upload').click()}>
          {imagePreview ? (
            <img src={imagePreview} alt="Logo de Variable" className="mx-auto h-20 object-contain" />
          ) : (
            <>
              <IoCloudUploadOutline className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-1 text-sm text-gray-600">
                Haga <span className="text-cyan-500 underline">clic aquí</span> para cargar o arrastre y suelte
              </p>
              <p className="text-xs text-gray-500">Archivos máximo 10 mb</p>
            </>
          )}
        </div>
        <input id="logo-upload" type="file" className="hidden" onChange={handleIconUpload} accept="image/*" />
      </div> */}

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
          value={formData.startTime}
          onChange={handleChange}
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
          value={formData.endTime}
          onChange={handleChange}
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
          value={formData.estimatedReplacementDate}
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
              {mode === 'create' ? 'Crear Variable' : 'Crear Mantenimiento'}

            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default FromMantenimiento;
