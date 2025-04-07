import React, { useEffect, useState } from 'react';
import { IoCloudUploadOutline } from "react-icons/io5";
import TypeService from "../../../services/TypeDispositivosService";
import ActuadorService from "../../../services/ActuadorService";
import RegistrerTypeServices from '../../../services/RegistrerType';
import CompanyService from '../../../services/CompanyService';
import { useCompanyContext } from '../../../context/CompanyContext';
import LoadingView from '../../../components/Loading/loadingView';
import ErrorAlert from '../../../components/alerts/error';

const FormActuador = ({ selectedCompany, showErrorAlert, onUpdate, actuador, mode, closeModal, companyId }) => {
  const companySeleector = JSON.parse(localStorage.getItem("selectedCompany"));

  const [sensroType, setSensorType] = useState([]);
  const [registerTypes, setRegisterTypes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
    uuid: '',
    company_id: companySeleector.value || ''
  });


  useEffect(() => {
    const fetchSensorTypes = async () => {
      try {
        const typeSensor = await TypeService.getAllActuador();
        setSensorType(typeSensor);
      } catch (error) {
        console.error('Error al obtener los tipos de sensores:', error);
      }

    };

    const fetchCompanies = async () => {
      try {
        const fetchedCompanies = await CompanyService.getAllCompany();
        setCompanies(fetchedCompanies);
        setIsLoading(false)
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
    setIsLoading(true)

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
        setIsLoading(false)
      } else if (mode === 'edit') {
        await ActuadorService.updateActuador(actuador.id, formDataToSubmit);
        showErrorAlert('Actuador editado exitosamente');
        setIsLoading(false)
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


  const [errorAlerta, seterrorAlerta] = useState(false)
  const [messageAlert, setmessageAlert] = useState("")
  const [isValidatingActuator, setIsValidatingActuator] = useState(false);

  const handleCloseAlert = () => {
    seterrorAlerta(false);
  };


  const handleValidateCode = async () => {
    setIsValidatingActuator(true);
    if (formData.actuatorCode == '') {
      setIsValidatingActuator(false);
      return;
    }
    try {
      const code = formData.actuatorCode;
      const company = JSON.parse(localStorage.getItem("selectedCompany"));
      const sensorExisting = await ActuadorService.getActuadorByIdCode(code, Number(company.value));
      if (sensorExisting.success) {
        seterrorAlerta(true)
        setIsValidatingActuator(false);
        setmessageAlert("El código registrado ya existe");
        setTimeout(() => {
          seterrorAlerta(false)
        }, 950);
        formData.actuatorCode = '';
      } else {
        setIsValidatingActuator(false);
      }
    } catch (error) {
      console.error('Error al obtener los tipos de sensores:', error);
    }
  }

  return (
    <>
      {isLoading ? (
        <LoadingView />
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">


            <div className="grid grid-cols-2 gap-4 mt-5">
              {/* <div>
                <label htmlFor="actuatorCode" className="block text-sm font-medium text-gray-700">Codigo ID actuador</label>
                <input
                  type="text"
                  id="actuatorCode"
                  name="actuatorCode"
                  placeholder="Codigo del actuador"
                  value={formData.actuatorCode}
                  onChange={handleChange}
                  onBlur={handleValidateCode}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                  disabled={mode === 'view'}
                />
              </div> */}

              <div className="relative">
                <label htmlFor="actuatorCode" className="block text-sm font-medium text-gray-700">Codigo ID actuador</label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    id="actuatorCode"
                    name="actuatorCode"
                    placeholder="Codigo del actuador"
                    value={formData.actuatorCode}
                    onChange={handleChange}
                    onBlur={handleValidateCode}
                    className="block w-full border border-gray-300 rounded-md p-2 pr-10" // Añadido pr-10
                    required
                    disabled={mode === 'view'}
                  />
                  {/* Spinner - visible solo durante validación */}
                  {isValidatingActuator && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Validando...</span>
                      </div>
                    </div>
                  )}
                </div>
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
                  max={new Date().toISOString().split("T")[0]} // Restringe fechas futuras

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
                  min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} // Mínimo: mañana

                  value={formData.estimatedChangeDate.substr(0, 10)}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                  disabled={mode === 'view'}
                />
              </div>
            </div>


            {errorAlerta &&
              <ErrorAlert message={messageAlert}
                onCancel={handleCloseAlert} />
            }


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
                    {mode === 'create' ? 'Crear Actuador' : 'Guardar Cambios'}

                  </button>
                </>
              )}
            </div>
          </form>
        </>
      )}
    </>


  );
};

export default FormActuador;
