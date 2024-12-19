import React, { useEffect, useState } from 'react';
import TypeService from "../../../services/TypeDispositivosService";
import MantenimientoActuador from "../../../services/MantenimientoAct";
import CalibrarActuador from "../../../services/CalibradorAct";
import { X } from 'lucide-react';
import { Eye } from 'lucide-react';
import SensorService from "../../../services/SensorService";
import { useCompanyContext } from '../../../context/CompanyContext';

const FormViewActuador = ({ actuador, closeModal }) => {
    const { selectedCompanyUniversal } = useCompanyContext();

    const [selectedCalibracion, setSelectedCalibracion] = useState(null);
    const [calibracion, setCalibracion] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [nameCompany, setNameCompany] = useState("");
    const [selectedMantenimiento, setSelectedMantenimiento] = useState(null);
    const [actuadorType, setSensorType] = useState([]);
    const [mantenimiento, setMantenimiento] = useState([]);
    const [activeModal, setActiveModal] = useState(null);
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
        // company_id: companySeleector.value || ''
    });

    useEffect(() => {
        const fetchSensorTypes = async () => {
            try {
                const typeSensor = await TypeService.getAllActuador();
                setSensorType(typeSensor);
            } catch (error) {
                console.log('Error al obtener los tipos de actuadores:', error);
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

                const data = await MantenimientoActuador.getAllMantenimiento();

                console.log('manteminientos', data)
                if (data.statusCode === 404) {
                    setMantenimiento([]);
                } else {
                    setShowErrorAlertTable(false);
                    setMantenimiento(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error('Error fetching mantenimiento:', error);
                setMantenimiento([]); // Vaciar la lista en caso de error
                // setMessageAlert('Esta empresa no tiene mantenimientos registradas, Intentalo con otra empresa');
                setShowErrorAlertTable(true);
            }
        };
        fetchSensor();
    }, []);

    useEffect(() => {
        const fetchMantenimiento = async () => {
            try {
                // Asegúrate de que el ID del actuador esté disponible
                if (!actuador || !actuador.id) return;

                // Llama al servicio para obtener los mantenimientos asociados al actuador
                const data = await MantenimientoActuador.getMantenimientoByActuador(actuador.id);
                console.log("Datos de mantenimiento:", data);
                // Maneja la respuesta y actualiza el estado
                if (data.statusCode === 404) {
                    setMantenimiento([]);  // Si no se encuentran mantenimientos
                } else {
                    setMantenimiento(data); // Asume que data es un array de mantenimientos
                }
            } catch (error) {
                console.error('Error fetching mantenimiento:', error);
                setMantenimiento([]); // Vaciar la lista en caso de error
            }
        };

        fetchMantenimiento();
    }, [actuador]);
    useEffect(() => {
        const fetchCalibrar = async () => {
            try {
                // Asegúrate de que el ID del actuador esté disponible
                if (!actuador || !actuador.id) return;

                // Llama al servicio para obtener los mantenimientos asociados al actuador
                const data = await CalibrarActuador.getMantenimientoByactuador(actuador.id);
                console.log("Datos de mantenimiento:", data);
                // Maneja la respuesta y actualiza el estado
                if (data.statusCode === 404) {
                    setCalibracion([]);  // Si no se encuentran mantenimientos
                } else {
                    setCalibracion(data); // Asume que data es un array de mantenimientos
                }
            } catch (error) {
                console.error('Error fetching mantenimiento:', error);
                setCalibracion([]); // Vaciar la lista en caso de error
            }
        };

        fetchCalibrar();
    }, [actuador]);


    useEffect(() => {
        if (actuador) {
            setFormData({
                actuatorCode: actuador.actuatorCode || '',
                gpsPosition: actuador.gpsPosition || '',
                activationType: actuador.activationType || '',
                inputPort: actuador.inputPort || '',
                actuatorTypeId: actuador.actuatorType?.id || '', // Asignación correcta del id de typeVariable
                activationPort: actuador.activationPort || '',
                // company_id: actuador.company_id
                description: actuador.description,
                accessUsername: actuador.accessUsername,
                accessPassword: actuador.accessPassword,
                installationDate: actuador.installationDate,
                estimatedChangeDate: actuador.estimatedChangeDate
            });
        }
    }, [actuador]);

    const openModal = (modalType) => {
        setActiveModal(modalType);
    };

    const closeModalHandler = () => {
        setActiveModal(null);
    };

    const openMantenimientoModal = (mantenimiento) => {
        setSelectedMantenimiento(mantenimiento); // Establecer el mantenimiento seleccionado
        setActiveModal("mantenimientoDetalle");
    };

    const openCalibracionModal = (calibracion) => {
        setSelectedCalibracion(calibracion);
        setActiveModal("calibracionDetalle");
    };
    return (
        <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mt-5">
                {/* Imagen - Columna Izquierda */}
                <div className="flex flex-col items-center">
                    {actuador.actuatorType && actuador.actuatorType.icon ? (
                        <img
                            src={actuador.actuatorType.icon}
                            alt={actuador.actuatorType.actuadorCode || "Actuador Icon"}
                            className="w-72 h-72 object-contain mb-4 border border-gray-400 p-2 rounded-lg "

                        />
                    ) : (
                        <span>{actuador.actuatorType?.actuadorCode || "No data"}</span>
                    )}
                    {/* Botones */}
                    <div className="space-y-2 mt-5">
                        <button
                            onClick={() => openModal("mantenimiento")}

                            type="button"
                            className="mb-2 inline-flex items-center px-10 py-3 border border-[#168C0DFF] text-sm  font-medium rounded-md text-[#168C0DFF] bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Ver historial de mantenimiento
                        </button>
                        <button
                            onClick={() => openModal("calibrar")}
                            type="button"
                            className="mb-2 inline-flex items-center px-14 py-3 border border-[#168C0DFF] text-sm leading-4 font-medium rounded-md text-[#168C0DFF] bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Ver historial de calibración
                        </button>
                    </div>
                </div>

                {activeModal === "mantenimiento" && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white w-full max-w-4xl  rounded-lg shadow-xl relative">
                            {/* Cabecera del Modal */}
                            <div className="flex justify-between items-center bg-[#345246] text-white p-4 rounded-t-lg">
                                <h2 className="text-xl font-semibold">Historial de Mantenimiento</h2>
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
                                                    <td className="px-6 py-3 text-sm text-gray-900">{manto.actuadorStatus || 'Desconocido'}</td>
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
                                    {actuador.actuatorType && actuador.actuatorType.icon ? (
                                        <img
                                            src={actuador.actuatorType.icon}
                                            alt={actuador.actuatorType.actuadorCode || "Actuador Icon"}
                                            className="w-72 h-72 object-contain mb-4 border border-gray-400 p-2 rounded-lg "

                                        />
                                    ) : (
                                        <span>{actuador.actuatorType?.actuadorCode || "No data"}</span>
                                    )}


                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Fecha de mantenimiento</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedMantenimiento.maintenanceDate}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Hora de inicio</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedMantenimiento.startTime}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Hora de finalización</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedMantenimiento.endTime}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Tipo de mantenimiento</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedMantenimiento.maintenanceType}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Piezas reemplazadas</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedMantenimiento.replacedParts}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Informe de pruebas</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedMantenimiento.testReport}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Fotos y videos</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedMantenimiento.media}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Estado del actuador </label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedMantenimiento.actuatorStatus}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Fecha estimada de cambio</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedMantenimiento.estimatedReplacementDate}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Observaciones</label>
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
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado del Actuador</th>
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
                                                    <td className="px-6 py-3 text-sm text-gray-900">{cali.actuatorStatus || 'Desconocido'}
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
                                    {actuador.actuatorType && actuador.actuatorType.icon ? (
                                        <img
                                            src={actuador.actuatorType.icon}
                                            alt={actuador.actuatorType.actuadorCode || "Actuador Icon"}
                                            className="w-72 h-72 object-contain mb-4 border border-gray-400 p-2 rounded-lg "
                                        />
                                    ) : (
                                        <span>{actuador.actuatorType?.actuadorCode || "No data"}</span>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Fecha de Calibración</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedCalibracion.calibrationDate}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Hora de inicio</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedCalibracion.startTime}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Hora de finalización</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedCalibracion.endTime}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Informe de calibración</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedCalibracion.calibrationReport}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Fotos y videos</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedCalibracion.media}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Estado del actuador </label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedCalibracion.actuatorStatus}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Fecha estimada de cambio</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedCalibracion.estimatedReplacementDate}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Observaciones</label>
                                        <p className="mt-1 text-sm text-gray-600">{selectedCalibracion.observations}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <table className="min-w-full table-auto border-collapse mb-4 mt-4">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="border px-4 py-2 font-semibold">Punto de Calibración</th>
                                            <th className="border px-4 py-2 font-semibold">Valor</th>
                                            <th className="border px-4 py-2 font-semibold">Respuesta</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedCalibracion.calibrationPoints && selectedCalibracion.calibrationPoints.length > 0 ? (
                                            selectedCalibracion.calibrationPoints.map((param, index) => (
                                                <tr key={index}>
                                                    <td className="border px-4 py-2">Punto {index + 1}</td>
                                                    <td className="border px-4 py-2">{param.value}°C</td>
                                                    <td className="border px-4 py-2">{param.measuredValue} V</td>
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
                        <label htmlFor="actuadorCode" className="block text-sm font-medium text-gray-900">Codigo ID actuador</label>
                        <p className="mt-1 text-sm text-gray-600">{actuador.actuatorCode}</p>
                    </div>



                    <div className="flex flex-col">
                        <label htmlFor="inputPort" className="block text-sm font-medium text-gray-900">Puerto de entrada</label>
                        <p className="mt-1 text-sm text-gray-600">{actuador.inputPort}</p>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="inputPort" className="block text-sm font-medium text-gray-900">Tipo de activador</label>
                        <p className="mt-1 text-sm text-gray-600">{actuador.activationType}</p>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="activationPort" className="block text-sm font-medium text-gray-900">Puerto de activador</label>
                        <p className="mt-1 text-sm text-gray-600">{actuador.activationPort}</p>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <label htmlFor="gpsPosition" className="block text-sm font-medium text-gray-900">Posición GPS</label>
                        <p className="mt-1 text-sm text-gray-600">{actuador.gpsPosition}</p>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-900">Descripción</label>
                        <p className="mt-1 text-sm  text-gray-600">{actuador.description}</p>
                    </div>
                    <hr className=" flex flex-col col-span-2 border-gray-400" />
                    <div className="flex flex-col mt-5">
                        <label htmlFor="accessUsername" className="block text-sm font-medium text-gray-900">Usuario de acceso</label>
                        <p className="mt-1 text-sm text-gray-600">{actuador.accessUsername}</p>
                    </div>

                    <div className="flex flex-col mt-5">
                        <label htmlFor="accessPassword" className="block text-sm font-medium text-gray-900">Clave de acceso</label>
                        <p className="mt-1 text-sm text-gray-600">{actuador.accessPassword}</p>
                    </div>

                    <hr className=" flex flex-col col-span-2 border-gray-400" />

                    <div className="flex flex-col mt-5">
                        <label htmlFor="installationDate" className="block text-sm font-medium text-gray-900">Fecha de instalación</label>
                        <p className="mt-1 text-sm text-gray-600">{actuador.installationDate.substr(0, 10)}</p>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="estimatedChangeDate" className="block text-sm font-medium text-gray-900">Fecha estimada de cambio</label>
                        <p className="mt-1 text-sm text-gray-600">{actuador.estimatedChangeDate.substr(0, 10)}</p>
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

export default FormViewActuador;
