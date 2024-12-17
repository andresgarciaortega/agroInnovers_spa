import React, { useEffect, useState } from 'react';
import TypeService from "../../../services/TypeDispositivosService";
import SensorMantenimientoService from "../../../services/SensorMantenimiento";
import SensorService from "../../../services/SensorService";
import { useCompanyContext } from '../../../context/CompanyContext';
import CompanySelector from "../../../components/shared/companySelect";

const FormViewSensor = ({ sensor, closeModal }) => {
      const { selectedCompanyUniversal } = useCompanyContext();
    
     const [companyList, setCompanyList] = useState([]);
      const [sensorList, setSensorList] = useState([]);
      const [selectedCompany, setSelectedCompany] = useState('');
  const [nameCompany, setNameCompany] = useState("");

    const [sensorType, setSensorType] = useState([]);
    const [mantenimiento, setMantenimiento] = useState([]);
    const [activeModal, setActiveModal] = useState(null);
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
        // company_id: companySeleector.value || ''
    });

    useEffect(() => {
        const fetchSensorTypes = async () => {
            try {
                const typeSensor = await TypeService.getAllSensor();
                setSensorType(typeSensor);
            } catch (error) {
                console.log('Error al obtener los tipos de sensores:', error);
            }
        };

        fetchSensorTypes();
    }, []);

    useEffect(() => {
        const fetchSensor = async () => {
            try {
              // Verifica si selectedCompanyUniversal es nulo o si no tiene valor
              const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : ''; // Si no hay empresa seleccionada, se pasa un string vacío
      
              // Verifica si companyId no es vacío antes de hacer la llamada
              if (!companyId) {
                setMantenimiento([]); // Asegúrate de vaciar la lista si no hay empresa seleccionada
                return;
              } else {
                setNameCompany(selectedCompanyUniversal.label)
              }
      
              const data = await SensorMantenimientoService.getAllMantenimiento();
      
console.log('manteminientos',data )       
       if (data.statusCode === 404) {
                setMantenimiento([]);
              } else {
                setShowErrorAlertTable(false);
                setMantenimiento(Array.isArray(data) ? data : []);
              }
            } catch (error) {
              console.error('Error fetching mantenimiento:', error);
              setMantenimiento([]); // Vaciar la lista en caso de error
              setMessageAlert('Esta empresa no tiene mantenimientos registradas, Intentalo con otra empresa');
              setShowErrorAlertTable(true);
            }
          };
          fetchSensor();
        }, []);
        

    useEffect(() => {
        if (sensor) {
            setFormData({
                sensorCode: sensor.sensorCode || '',
                gpsPosition: sensor.gpsPosition || '',
                inputPort: sensor.inputPort || '',
                sensorTypeId: sensor.sensorType?.id || '',
                readingPort: sensor.readingPort || '',
                description: sensor.description || '',
                accessUsername: sensor.accessUsername || '',
                accessPassword: sensor.accessPassword || '',
                installationDate: sensor.installationDate || '',
                estimatedChangeDate: sensor.estimatedChangeDate || '',
            });
        }
    }, [sensor]);

    const openModal = (modalType) => {
        setActiveModal(modalType);
    };

    const closeModalHandler = () => {
        setActiveModal(null);
    };

    return (
        <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mt-5">
                <div className="flex flex-col items-center">
                    {sensor.sensorType && sensor.sensorType.icon ? (
                        <img
                            src={sensor.sensorType.icon}
                            alt={sensor.sensorType.sensorCode || "Sensor Icon"}
                            className="w-72 h-72 object-contain mb-4 border border-gray-400 p-2 rounded-lg "
                        />
                    ) : (
                        <span>{sensor.sensorType?.sensorCode || "No data"}</span>
                    )}

                    {/* Botones */}
                    <div className="space-y-2 mt-5">
                        <button
                            type="button"
                            onClick={() => openModal("mantenimiento")}
                            className="mb-2 inline-flex items-center px-12 py-3 border border-[#168C0DFF] text-sm font-medium rounded-md text-[#168C0DFF] bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Ver historial de mantenimiento
                        </button>
                        <button
                            type="button"
                            onClick={() => openModal("calibracion")}
                            className="mb-2 inline-flex items-center px-16 py-3 border border-[#168C0DFF] text-sm leading-4 font-medium rounded-md text-[#168C0DFF] bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Ver historial de calibración
                        </button>
                    </div>
                </div>

                {activeModal === "mantenimiento" && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded shadow-lg">
                            <h2 className="text-xl font-bold mb-4">Historial de Mantenimiento</h2>

                            <table className="w-full">
                                <thead className="bg-gray-300">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Fecha Calibración</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Fecha proxima calibración</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">informe calibración</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Estado del sensor</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Ver calibración</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>

                            </table>
                            <button
                                onClick={closeModalHandler}
                                className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
                {/* Información de Sensor - Columna Derecha */}
                <div className="grid grid-cols-2 gap-4 mt-5">
                    <div className="flex flex-col">
                        <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Codigo ID sensor</label>
                        <p className="mt-1 text-sm text-gray-600">{sensor.sensorCode}</p>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="gpsPosition" className="block text-sm font-medium text-gray-900">Posición GPS</label>
                        <p className="mt-1 text-sm text-gray-600">{sensor.gpsPosition}</p>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="inputPort" className="block text-sm font-medium text-gray-900">Puerto de entrada</label>
                        <p className="mt-1 text-sm text-gray-600">{sensor.inputPort}</p>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="readingPort" className="block text-sm font-medium text-gray-900">Puerto de lectura</label>
                        <p className="mt-1 text-sm text-gray-600">{sensor.readingPort}</p>
                    </div>

                    <div className="flex flex-col col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-900">Descripción</label>
                        <p className="mt-1 text-sm  text-gray-600">{sensor.description}</p>
                    </div>
                    <hr className=" flex flex-col col-span-2 border-gray-400" />

                    <div className="flex flex-col mt-5">
                        <label htmlFor="accessUsername" className="block text-sm font-medium text-gray-900">Usuario de acceso</label>
                        <p className="mt-1 text-sm text-gray-600">{sensor.accessUsername}</p>
                    </div>
                    <div className="flex flex-col mt-5">
                        <label htmlFor="accessPassword" className="block text-sm font-medium text-gray-900">Clave de acceso</label>
                        <p className="mt-1 text-sm text-gray-600">{sensor.accessPassword}</p>
                    </div>
                    <hr className="my- flex flex-col col-span-2 border-gray-400" />

                    <div className="flex flex-col mt-5">
                        <label htmlFor="installationDate" className="block text-sm font-medium text-gray-900">Fecha de instalación</label>
                        <p className="mt-1 text-sm text-gray-600">{sensor.installationDate.substr(0, 10)}</p>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="estimatedChangeDate" className="block text-sm font-medium text-gray-900">Fecha estimada de cambio</label>
                        <p className="mt-1 text-sm text-gray-600">{sensor.estimatedChangeDate.substr(0, 10)}</p>
                    </div>
                </div>

            </div>

            {/* Botón para cerrar el modal */}
            <div className="flex justify-end mt-5">
                <button
                    type="button"
                    onClick={closeModal}
                    className="bg-white text-gray-500 px-4 py-2 rounded border border-gray-400"
                >
                    Volver
                </button>
            </div>
        </form>
    );
};

export default FormViewSensor;
