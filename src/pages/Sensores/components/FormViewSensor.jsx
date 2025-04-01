import React, { useEffect, useState } from 'react';
import TypeService from "../../../services/TypeDispositivosService";
import SensorMantenimientoService from "../../../services/SensorMantenimiento";
import SensorService from "../../../services/SensorService";
import CalibrarSensor from "../../../services/CalibrarSensor";
import { useCompanyContext } from '../../../context/CompanyContext';
import CompanySelector from "../../../components/shared/companySelect";
import { X } from 'lucide-react';
import { Eye } from 'lucide-react';

const FormViewSensor = ({ sensor, closeModal }) => {
    const { selectedCompanyUniversal } = useCompanyContext();
const [selectedCalibracion, setSelectedCalibracion] = useState(null);
    const [calibracion, setCalibracion] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [sensorList, setSensorList] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [nameCompany, setNameCompany] = useState("");
    const [selectedMantenimiento, setSelectedMantenimiento] = useState(null);
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
            }
        };

        fetchSensorTypes();
    }, []);

    useEffect(() => {
        const fetchSensor = async () => {
            try {
                const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : ''; // Si no hay empresa seleccionada, se pasa un string vacío

                if (!companyId) {
                    setMantenimiento([]); // Asegúrate de vaciar la lista si no hay empresa seleccionada
                    return;
                } else {
                    setNameCompany(selectedCompanyUniversal.label)
                }

                const data = await SensorMantenimientoService.getAllMantenimiento();

                if (data.statusCode === 404) {
                    setMantenimiento([]);
                } else {
                    setShowErrorAlertTable(false);
                    setMantenimiento(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error('Error fetching mantenimiento:', error);
                setMantenimiento([]); 
                // setMessageAlert('Esta empresa no tiene mantenimientos registradas, Intentalo con otra empresa');
                setShowErrorAlertTable(true);
            }
        };
        fetchSensor();
    }, []);

    useEffect(() => {
        const fetchMantenimiento = async () => {
            try {
                if (!sensor || !sensor.id) return;

                const data = await SensorMantenimientoService.getMantenimientoBySensor(sensor.id);
                if (data.statusCode === 404) {
                    setMantenimiento([]);  
                } else {
                    setMantenimiento(data); 
                }
            } catch (error) {
                console.error('Error fetching mantenimiento:', error);
                setMantenimiento([]); 
            }
        };

        fetchMantenimiento();
    }, [sensor]);



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

    useEffect(() => {
        const fetchCalibrar = async () => {
            try {
                if (!sensor || !sensor.id) return;

                const data = await CalibrarSensor.getMantenimientoBysensor(sensor.id);
                if (data.statusCode === 404) {
                    setCalibracion([]);  
                } else {
                    setCalibracion(data); 
                }
            } catch (error) {
                console.error('Error fetching mantenimiento:', error);
                setCalibracion([]); 
            }
        };

        fetchCalibrar();
    }, [sensor]);

    const openModal = async (modalType, id= 0) => {
     
       
        if (modalType === "mantenimiento"){
            try {
                if (!sensor || !sensor.id) return;

                const data = await SensorMantenimientoService.getMantenimientoBySensorAll(id);

                if (data.statusCode === 404) {
                    setMantenimiento([]);  
                } else {
                    setMantenimiento(data);
                }
            } catch (error) {
                console.error('Error fetching mantenimiento:', error);
                setMantenimiento([]); 
            }
        }
        if (modalType === "calibrar"){
            try {
                if (!sensor || !sensor.id) return;

                const data = await CalibrarSensor.getCalibracionBySensorAll(sensor.id);
                if (data.statusCode === 404) {
                    setCalibracion([]);  
                } else {
                    setCalibracion(data); 
                }
            } catch (error) {
                console.error('Error fetching mantenimiento:', error);
                setCalibracion([]); 
            }
        }
        setActiveModal(modalType);
    };

    const closeModalHandler = () => {
        setActiveModal(null);
    };

    const openMantenimientoModal = (mantenimiento) => {
        setSelectedMantenimiento(mantenimiento); 
        setActiveModal("mantenimientoDetalle"); 
    };

    const openCalibracionModal = (calibracion) => {
        setSelectedCalibracion(calibracion);
        setActiveModal("calibracionDetalle");
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
                            onClick={() => openModal("mantenimiento", sensor?.id)}
                            className="mb-2 inline-flex items-center px-12 py-3 border border-[#168C0DFF] text-sm font-medium rounded-md text-[#168C0DFF] bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Ver historial de mantenimiento
                        </button>
                        <button
                            type="button"
                            onClick={() => openModal("calibrar", sensor?.id)}
                            className="mb-2 inline-flex items-center px-16 py-3 border border-[#168C0DFF] text-sm leading-4 font-medium rounded-md text-[#168C0DFF] bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Ver historial de calibración
                        </button>
                    </div>
                </div>

                {activeModal === "mantenimiento" && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white w-full max-w-4xl  rounded-lg shadow-xl relative">
                            <div className="flex justify-between items-center bg-[#345246] text-white p-4 rounded-t-lg">
                                <h2 className="text-xl font-semibold">Historial de Mantenimiento</h2>
                                <button onClick={closeModalHandler} className="text-white hover:text-gray-200 focus:outline-none">
                                    <X size={30} />
                                </button>
                            </div>

                            <div className="m-3 space-y-4 overflow-y-auto max-h-[70vh]">
                                <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                                    <thead className="bg-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Fecha Mantenimiento</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Fecha próxima Mantenimiento</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Informe</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado del Sensor</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tipo de mantenimiento</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900"> </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mantenimiento.length > 0 ? (
                                            mantenimiento.map((manto, index) => (
                                                <tr key={manto.id} className="border-b border-gray-200 hover:bg-gray-100">
                                                    <td className="px-6 py-3 text-sm text-gray-900">{index + 1}</td>
                                                    <td className="px-6 py-3 text-sm text-gray-900">{manto.maintenanceDate.substr(0, 10)}</td>
                                                    <td className="px-6 py-3 text-sm text-gray-900">{manto.estimatedReplacementDate.substr(0, 10)}</td>
                                                    <td className="px-6 py-3 text-sm text-gray-900">{manto.testReport || 'No disponible'}</td>
                                                    <td className="px-6 py-3 text-sm text-gray-900">{manto.sensorStatus || 'Desconocido'}</td>
                                                    <td className="px-6 py-3 text-sm text-gray-900">{manto.maintenanceType || 'Desconocido'}
                                                    </td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            onClick={() => openMantenimientoModal(manto)} // Pasa el mantenimiento al modal
                                                            className="text-[#168C0DFF] px- py-2 rounded"
                                                        >
                                                            <Eye size={20} /> {/* Ícono de ojito */}
                                                        </button>
                                                    </td>

                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-3 text-sm text-center text-gray-900">No se encontraron mantenimientos.</td>
                                            </tr>
                                        )}
                                    </tbody>


                                </table>


                                {/* Botón para cerrar */}
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={closeModalHandler}
                                        className="bg-white text-gray-500 px-4 py-2 rounded border border-gray-400"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeModal === "mantenimientoDetalle" && selectedMantenimiento && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl relative">
                            <div className="flex justify-between items-center bg-[#345246] text-white p-4 rounded-t-lg">
                                <h2 className="text-xl font-semibold">Detalles del Mantenimiento</h2>
                                <button onClick={closeModalHandler} className="text-white hover:text-gray-200 focus:outline-none">
                                    <X size={30} />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4 m-5">
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


                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Fecha de mantenimiento</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedMantenimiento.maintenanceDate}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Hora de inicio</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedMantenimiento.startTime}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Hora de finalización</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedMantenimiento.endTime}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Tipo de mantenimiento</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedMantenimiento.maintenanceType}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Piezas reemplazadas</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedMantenimiento.replacedParts}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Estado del sensor </label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedMantenimiento.sensorStatus}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Informe de pruebas</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedMantenimiento.testReport}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Fotos y videos</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedMantenimiento.media}</p>
                                    </div>
                                   
                                    <div className="flex flex-col">
                                        <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Fecha estimada de cambio</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedMantenimiento.estimatedReplacementDate}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Observaciones</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedMantenimiento.remarks}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end m-4">
                                <button
                                    onClick={closeModalHandler}
                                    className="bg-white text-gray-500 px-4 py-2 rounded border border-gray-400"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeModal === "calibrar" && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white w-full max-w-4xl  rounded-lg shadow-xl relative">
                            {/* Cabecera del Modal */}
                            <div className="flex justify-between items-center bg-[#345246] text-white p-4 rounded-t-lg">
                                <h2 className="text-xl font-semibold">Historial de Calibración</h2>
                                <button onClick={closeModalHandler} className="text-white hover:text-gray-200 focus:outline-none">
                                    <X size={30} />
                                </button>
                            </div>

                            {/* Tabla de Mantenimiento */}
                            <div className="m-3 space-y-4 overflow-y-auto max-h-[70vh]">
                                <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                                    <thead className="bg-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Fecha calibración</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Fecha próxima Calibración</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Informe de calibración</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado del sensor</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900"> </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mantenimiento.length > 0 ? (
                                            calibracion.map((cali, index) => (
                                                <tr key={cali.id} className="border-b border-gray-200 hover:bg-gray-100">
                                                    <td className="px-6 py-3 text-sm text-gray-900">{index + 1}</td>
                                                    <td className="px-6 py-3 text-sm text-gray-900">{cali.calibrationDate.substr(0, 10)}</td>
                                                    <td className="px-6 py-3 text-sm text-gray-900">{cali.estimatedReplacementDate.substr(0, 10)}</td>
                                                    <td className="px-6 py-3 text-sm text-gray-900">{cali.calibrationReport || 'Desconocido'}</td>
                                                    <td className="px-6 py-3 text-sm text-gray-900">{cali.sensorStatus || 'Desconocido'}
                                                    </td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            onClick={() => openCalibracionModal(cali)} // Pasa el mantenimiento al modal
                                                            className="text-[#168C0DFF] px- py-2 rounded"
                                                        >
                                                            <Eye size={20} /> {/* Ícono de ojito */}
                                                        </button>
                                                    </td>

                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-3 text-sm text-center text-gray-900">No se encontraron calibradores.</td>
                                            </tr>
                                        )}
                                    </tbody>


                                </table>


                                {/* Botón para cerrar */}
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={closeModalHandler}
                                        className="bg-white text-gray-500 px-4 py-2 rounded border border-gray-400"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeModal === "calibracionDetalle" && selectedCalibracion && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl relative">
                            <div className="flex justify-between items-center bg-[#345246] text-white p-4 rounded-t-lg">
                                <h2 className="text-xl font-semibold">Detalles de la Calibración</h2>
                                <button onClick={closeModalHandler} className="text-white hover:text-gray-200 focus:outline-none">
                                    <X size={30} />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4 m-5">
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
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Fecha de Calibración</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedCalibracion.calibrationDate}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Hora de inicio</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedCalibracion.startTime}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Hora de finalización</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedCalibracion.endTime}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Estado del sensor </label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedCalibracion.sensorStatus}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Informe de calibración</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedCalibracion.calibrationReport}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Fotos y videos</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedCalibracion.media}</p>
                                    </div>
                                   
                                    <div className="flex flex-col">
                                        <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Fecha estimada de cambio</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedCalibracion.estimatedReplacementDate}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="sensorCode" className="block text-sm font-medium text-gray-900">Observaciones</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedCalibracion.observations}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='m-6'>
                                <table className="min-w-full table-auto border-collapse mb-6 ">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="border px-4 py-2 font-semibold">Punto de Calibración</th>
                                            <th className="border px-4 py-2 font-semibold">Valor</th>
                                            <th className="border px-4 py-2 font-semibold">Valor medido</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedCalibracion.calibrationPoints && selectedCalibracion.calibrationPoints.length > 0 ? (
                                            selectedCalibracion.calibrationPoints.map((param, index) => (
                                                <tr key={index}>
                                                    <td className="border px-4 py-2">Punto {index + 1}</td>
                                                    <td className="border px-4 py-2">{param.value}°C</td>
                                                    <td className="border px-4 py-2">{param.normalResponse} V</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center px-4 py-2">No se encontraron puntos de calibración</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-end m-4">
                                <button
                                    onClick={closeModalHandler}
                                    className="bg-white text-gray-500 px-4 py-2 rounded border border-gray-400"
                                >
                                    Cerrar
                                </button>
                            </div>
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
