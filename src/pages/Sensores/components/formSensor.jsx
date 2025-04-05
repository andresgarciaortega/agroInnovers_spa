import React, { useEffect, useState } from 'react';
import { IoCloudUploadOutline } from "react-icons/io5";
import TypeService from "../../../services/TypeDispositivosService";
import SensorService from "../../../services/SensorService";
import RegistrerTypeServices from '../../../services/RegistrerType';
import CompanyService from '../../../services/CompanyService';
import { useCompanyContext } from '../../../context/CompanyContext';
import LoadingView from '../../../components/Loading/loadingView';
import ErrorAlert from '../../../components/alerts/error';

const FormSensor = ({ selectedCompany, showErrorAlert, onUpdate, sensor, mode, closeModal, companyId }) => {
  const companySeleector = JSON.parse(localStorage.getItem("selectedCompany"));
  const [isLoading, setIsLoading] = useState(true);
  const [sensorType, setSensorType] = useState([]);
  const [registerTypes, setRegisterTypes] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [isDashboard, setIsDashboard] = useState(false);
  const [isIncrement, setIsIncrement] = useState(false);
  const [formData, setFormData] = useState({
    sensorCode: '',
    gpsPosition: '',
    inputPort: '',
    readingPort: '',
    description: '',
    accessUsername: '',
    accessPassword: '',
    installationDate: '',
    estimatedChangeDate: '',
    sensorTypeId: '',
    company_id: companySeleector.value || ''
  });


  useEffect(() => {
    const fetchSensorTypes = async () => {
      try {
        const typeSensor = await TypeService.getAllSensor();
        setSensorType(Array.isArray(typeSensor) ? typeSensor : []); // Asegura que sea un array
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
        sensorCode: sensor.sensorCode || '',
        gpsPosition: sensor.gpsPosition || '',
        inputPort: sensor.inputPort || '',
        sensorTypeId: sensor.sensorType?.id || '', // Asignación correcta del id de typeVariable
        readingPort: sensor.readingPort || '',
        company_id: sensor.company_id,
        description: sensor.description,
        accessUsername: sensor.accessUsername,
        accessPassword: sensor.accessPassword,
        installationDate: sensor.installationDate,
        estimatedChangeDate: sensor.estimatedChangeDate
      });

    } else {
      setFormData({
        sensorCode: '',
        // icon: '',
        gpsPosition: '',
        inputPort: '',
        readingPort: '',
        description: '',
        accessUsername: '',
        accessPassword: '',
        installationDate: '',
        estimatedChangeDate: '',
        sensorTypeId: '',
        company_id: companySeleector.value || ''
      });
    }
  }, [sensor, mode]); // This effect runs when sensor or mode changes.



  const handleChange = (e) => {
    const { name, value } = e.target;
    const today = new Date().toISOString().split("T")[0]; // Obtiene la fecha actual en formato YYYY-MM-DD

    // if (name === "installationDate" && value > today) {
    //   showErrorAlert("La fecha de instalación no puede ser futura.");
    //   return;
    // }

    // if (name === "estimatedChangeDate" && value < today) {
    //   showErrorAlert("La fecha estimada de cambio no puede ser anterior a hoy.");
    //   return;
    // }

    setFormData({
      ...formData,
      [name]: value,
    });
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)


    // Crear el objeto de datos a enviar
    const formDataToSubmit = {
      ...formData,
      // icon: logoUrl || '',  // Usar la URL de la imagen (nueva o existente)
      sensorCode: formData.sensorCode,
      gpsPosition: formData.gpsPosition,
      inputPort: parseInt(formData.inputPort, 10), // Convertir a número entero
      readingPort: parseInt(formData.readingPort, 10),
      description: formData.description,
      accessUsername: formData.accessUsername,
      accessPassword: formData.accessPassword,
      installationDate: formData.installationDate,
      estimatedChangeDate: formData.estimatedChangeDate,
      sensorTypeId: Number(formData.sensorTypeId),
      company_id: Number(companyId) || Number(formData.company_id),
    };
    try {
      // Enviar la solicitud según el modo
      if (mode === 'create') {
        const createdVariable = await SensorService.createSensor(formDataToSubmit);
        showErrorAlert("creada");
        setIsLoading(false)
      } else if (mode === 'edit') {
        await SensorService.updateSensor(sensor.id, formDataToSubmit);
        setIsLoading(false)
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
  const handleCloseAlert = () => {
    seterrorAlerta(false);
  };

  const handleValidateCode = async () => {
    try {
      const code = formData.sensorCode;
      const company = JSON.parse(localStorage.getItem("selectedCompany"));
      console.log(company)
      const sensorExisting = await TypeService.getSensorByIdCode(code, Number(company.value));
      if (sensorExisting) {
        seterrorAlerta(true)
        setmessageAlert("El código registrado ya existe");
        formData.sensorCode = '';
        setTimeout(() => {
          seterrorAlerta(false)
        }, 950);
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
              <div>
                <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-700">Codigo ID sensor</label>
                <input
                  type="text"
                  id="sensorCode"
                  name="sensorCode"
                  placeholder="Codigo del sensor"
                  value={formData.sensorCode}
                  onChange={handleChange}
                  onBlur={handleValidateCode}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                  disabled={mode === 'view'}
                />
              </div>
              <div >
                <label htmlFor="sensorTypeId" className="block text-sm font-medium text-gray-700">Tipo de sensor</label>
                <select
                  id="sensorTypeId"
                  name="sensorTypeId"
                  value={formData.sensorTypeId}
                  onChange={handleChange}
                  disabled={mode === 'view'}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                >
                  <option value="">Seleccione una opción</option>
                  {sensorType && Array.isArray(sensorType) && sensorType.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.sensorTypeName}
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
                <label htmlFor="readingPort" className="block text-sm font-medium text-gray-700">Puerto de lectura</label>
                <input
                  type="number"
                  id="readingPort"
                  name="readingPort"
                  placeholder="Puerto de lectura"
                  value={formData.readingPort}
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
                placeholder="Descripción del tipo de sensor"
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
                  value={formData.installationDate ? formData.installationDate.split("T")[0] : ""}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]} // Restringe fechas futuras
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                  disabled={mode === 'view'}
                />
              </div>

              <div>
                <label htmlFor="installationDate" className="block text-sm font-medium text-gray-700">Fecha estimada de cambio (editable)</label>

                <input
                  type="date"
                  id="estimatedChangeDate"
                  name="estimatedChangeDate"
                  value={formData.estimatedChangeDate ? formData.estimatedChangeDate.split("T")[0] : ""}
                  onChange={handleChange}
                  min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} // Mínimo: mañana
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
                    {mode === 'create' ? 'Crear Sensor' : 'Guardar Cambios'}

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

export default FormSensor;
