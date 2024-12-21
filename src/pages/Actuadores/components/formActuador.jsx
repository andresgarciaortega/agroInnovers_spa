import React, { useEffect, useState } from 'react';
import { IoCloudUploadOutline } from "react-icons/io5";
import UploadToS3 from '../../../config/UploadToS3';
import TypeService from "../../../services/TypeDispositivosService";
import ActuadorService from "../../../services/ActuadorService";
import RegistrerTypeServices from '../../../services/RegistrerType';
import CompanyService from '../../../services/CompanyService';
import { useCompanyContext } from '../../../context/CompanyContext';

const FormActuador = ({ selectedCompany, showErrorAlert, onUpdate, actuador, mode, closeModal, companyId }) => {
  const companySeleector = JSON.parse(localStorage.getItem("selectedCompany"));

  const [sensroType, setSensorType] = useState([]);
  const [registerTypes, setRegisterTypes] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [isDashboard, setIsDashboard] = useState(false);
  const [isIncrement, setIsIncrement] = useState(false);
  const [formData, setFormData] = useState({
    actuatorCode: '',
    activationType: '',
    gpsPosition: '',
    inputPort: '',
    activationPort: '',
    description: '',
    accessUsername: '',
    accessPassword: '',
    installationDate: '',
    estimatedChangeDate: '',
    actuatorTypeId: '',
    company_id: companySeleector.value || ''
  });


  useEffect(() => {
    const fetchSensorTypes = async () => {
      try {

        const typeSensor = await TypeService.getAllActuador();
        setSensorType(typeSensor);
      } catch (error) {
        console.log('tipo de sensores 2,', typeSensor)
        console.error('Error al obtener los tipos de sensores:', error);
      }
      console.log('tipo de actuador 2,', typeSensor)

    };

    const fetchCompanies = async () => {
      try {
        const fetchedCompanies = await CompanyService.getAllCompany();
        setCompanies(fetchedCompanies);
      } catch (error) {
        console.error('Error al obtener las empresas:', error);
      }
    };

    fetchSensorTypes();
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
    if (mode === 'edit' || mode === 'view') {
      setFormData({
        actuatorCode: actuador.actuatorCode || '',
        gpsPosition: actuador.gpsPosition || '',
        activationType: actuador.activationType || '',
        inputPort: actuador.inputPort || '',
        actuatorTypeId: actuador.actuatorType?.id || '', // Asignación correcta del id de typeVariable
        activationPort: actuador.activationPort || '',
        company_id: actuador.company_id,
        description: actuador.description,
        accessUsername: actuador.accessUsername,
        accessPassword: actuador.accessPassword,
        installationDate: actuador.installationDate,
        estimatedChangeDate: actuador.estimatedChangeDate

      });

    } else {
      setFormData({
        actuatorCode: '',
        activationType: '',
        // icon: '',
        gpsPosition: '',
        inputPort: '',
        activationPort: '',
        description: '',
        accessUsername: '',
        accessPassword: '',
        installationDate: '',
        estimatedChangeDate: '',
        actuatorTypeId: '',
        company_id: companySeleector.value || ''
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



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Crear el objeto de datos a enviar
    const formDataToSubmit = {
      ...formData,
      actuatorCode: formData.actuatorCode,
      activationType: formData.activationType, // Acceso correcto al campo
      gpsPosition: formData.gpsPosition,
      inputPort: parseInt(formData.inputPort, 10), // Convertir a número entero
      activationPort: parseInt(formData.activationPort, 10),
      description: formData.description,
      accessUsername: formData.accessUsername,
      accessPassword: formData.accessPassword,
      installationDate: formData.installationDate,
      estimatedChangeDate: formData.estimatedChangeDate,
      actuatorTypeId: Number(formData.actuatorTypeId),
      company_id: Number(companyId) || Number(formData.company_id), 
    };
  
    // Validar que los campos requeridos no sean nulos o vacíos
    if (!formDataToSubmit.activationType || typeof formDataToSubmit.activationType !== 'string') {
      showErrorAlert('El campo activationType es obligatorio y debe ser un texto.');
      return;
    }
  
    try {
      // Enviar la solicitud según el modo
      if (mode === 'create') {
        const createdVariable = await ActuadorService.createActuador(formDataToSubmit);
        showErrorAlert('Actuador creado exitosamente');
      } else if (mode === 'edit') {
        await ActuadorService.updateActuador(actuador.id, formDataToSubmit);
        showErrorAlert('Actuador editado exitosamente');
      }
  
      // Actualizar y cerrar modal
      onUpdate();
      closeModal();
    } catch (error) {
      console.error('Error al guardar el actuador:', error);
      showErrorAlert('Hubo un error al guardar el actuador.');
    }
  };
  



  // const showErrorAlert = (message) => {
  //   alert(message); // Muestra un mensaje de alerta
  // };


//   const handleIconUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData({
//         ...formData,
//         icon: file,
//       });
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
     

      <div className="grid grid-cols-2 gap-4 mt-5">
      <div>
        <label htmlFor="actuatorCode" className="block text-sm font-medium text-gray-700">Codigo ID actuador</label>
        <input
          type="text"
          id="actuatorCode"
          name="actuatorCode"
          placeholder="Codigo del actuador"
          value={formData.actuatorCode}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
          disabled={mode === 'view'}
        />
      </div>
        <div >
          <label htmlFor="actuatorTypeId" className="block text-sm font-medium text-gray-700">Tipo de actuador</label>
          <select
            id="actuatorTypeId"
            name="actuatorTypeId"
            value={formData.actuatorTypeId}
            onChange={handleChange}
            disabled={mode === 'view'}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Seleccione una opción</option>
            {sensroType.map((type) => (
              <option key={type.id} value={type.id}>
                {type.actuatorTypeName}
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
        </div>
        <div>
        <label htmlFor="activationType" className="block text-sm font-medium text-gray-700">Tipo de Activación</label>
        <input
          type="text"
          id="activationType"
          name="activationType"
          placeholder="Tipo de Activación"
          value={formData.activationType}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
          disabled={mode === 'view'}
        />
      </div>
        <div className=' col col-span-2'>
        <label htmlFor="gpsPosition" className="block text-sm font-medium text-gray-700">Posición GPS</label>
        <input
          type="text"
          id="gpsPosition"
          name="gpsPosition"
          placeholder="Posición GPS"
          value={formData.gpsPosition}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
          disabled={mode === 'view'}
        />
      </div>
      <div>
        <label htmlFor="inputPort" className="block text-sm font-medium text-gray-700">Puerto de entrada</label>
        <input
          type="number"
          id="inputPort"
          name="inputPort"
          placeholder="Puerto de entrada"
          value={formData.inputPort}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
          disabled={mode === 'view'}
        />
      </div>
      <div>
        <label htmlFor="activationPort" className="block text-sm font-medium text-gray-700">Puerto de activación</label>
        <input
          type="number"
          id="activationPort"
          name="activationPort"
          placeholder="Puerto de activación"
          value={formData.activationPort}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
          disabled={mode === 'view'}
        />
      </div>
      
      </div>

      
      <div>
      
      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          placeholder="Descripción del tipo de actuador"
          readOnly={mode === 'view'}
        ></textarea>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-5">
      <div  >
        <label htmlFor="accessUsername" className="block text-sm font-medium text-gray-700">Usuario de acceso</label>
        <input
          type="text"
          id="accessUsername"
          name="accessUsername"
          placeholder="Usuario de acceso"
          value={formData.accessUsername}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
          disabled={mode === 'view'}
        />
      </div>
      <div>
        <label htmlFor="accessPassword" className="block text-sm font-medium text-gray-700">Clave de acceso</label>
        <input
          type="password"
          id="accessPassword"
          name="accessPassword"
          placeholder="Clave de acceso"
          value={formData.accessPassword}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
          disabled={mode === 'view'}
        />
      </div>
      <div>
        <label htmlFor="installationDate" className="block text-sm font-medium text-gray-700">Fecha de instalación</label>
        <input
          type="date"
          id="installationDate"
          name="installationDate"
          placeholder="Fecha de instalación"
          value={formData.installationDate.substr(0, 10)}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
          disabled={mode === 'view'}
        />
      </div>
      <div>
        <label htmlFor="estimatedChangeDate" className="block text-sm font-medium text-gray-700">Fecha estimada de cambio (editable)</label>
        <input
          type="date"
          id="estimatedChangeDate"
          name="estimatedChangeDate"
          placeholder="Fecha de cambio"
          value={formData.estimatedChangeDate.substr(0, 10)}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
          disabled={mode === 'view'}
        />
      </div>
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
              {mode === 'create' ? 'Crear Sensor' : 'Guardar Cambios'}

            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default FormActuador;
