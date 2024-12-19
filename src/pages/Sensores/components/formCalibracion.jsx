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

const FromCalibracion = ({ selectedCompany, sensorId, showErrorAlert, onUpdate, sensor, mode, closeModal, companyId }) => {
    const companySeleector = JSON.parse(localStorage.getItem("selectedCompany"));

    const [variableTypes, setVariableTypes] = useState([]);
    const [registerTypes, setRegisterTypes] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [calibrationPoints, setCalibrationPoints] = useState([]);
    const [isDashboard, setIsDashboard] = useState(false);
    const [isIncrement, setIsIncrement] = useState(false);
    const [formData, setFormData] = useState({
        calibrationDate: '',
        startTime: '',
        endTime: '',
        calibrationReport: '',
        media: '',
        sensorStatus: '',
        estimatedReplacementDate: '',
        observations: '',
        sensor_id: '',
        calibrationPoints: [],

    });


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
                calibrationDate: sensor.name || '',
                startTime: sensor.startTime || '',
                endTime: sensor.endTime || '',
                sensor_id: sensor.sensor_id || '',
                calibrationReport: sensor.calibrationReport || '',
                media: sensor.media || '',
                sensorStatus: sensor.sensorStatus || '',
                estimatedReplacementDate: sensor.estimatedReplacementDate || '',
                observations: sensor.observations || '',
                // company_id: sensor.company_id
            });
            setImagePreview(sensor.media);
        } else {
            setFormData({
                calibrationDate: '',
                startTime: '',
                endTime: '',
                maintenanceType: '',
                replacedParts: '',
                calibrationReport: '',
                media: '',
                sensorStatus: '',
                estimatedReplacementDate: '',
                observations: '',
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
                calibrationDate: formData.calibrationDate,
                startTime: new Date(formData.startTime), // Convertir a instancia de Date
                endTime: new Date(formData.endTime),     // Convertir a instancia de Date
                maintenanceType: formData.maintenanceType,
                replacedParts: formData.replacedParts,
                calibrationReport: formData.calibrationReport,
                sensorStatus: formData.sensorStatus,
                estimatedReplacementDate: formData.estimatedReplacementDate,
                observations: formData.observations,
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
                    console.log('Detalles completos del sensor:', sensorDetails);
    
                    if (!sensorDetails?.calibrationPoints) {
                        console.warn("La propiedad calibrationPoints no está definida en sensorDetails");
                        return;
                    }
                    
                    if (!Array.isArray(sensorDetails.calibrationPoints)) {
                        console.error("calibrationPoints no es un arreglo válido");
                        console.log("Valor de calibrationPoints recibido:", sensorDetails.calibrationPoints);
                        return;
                    }
                    
    
                    const puntosFiltrados = sensorDetails.calibrationPoints.filter(
                        (point) => point.serviceType === 'tipo_servicio_deseado' // Ajusta aquí el tipo
                    );
    
                    setFormData((prevData) => ({
                        ...prevData,
                        estimatedReplacementDate: sensorDetails.estimatedChangeDate || '',
                        calibrationPoints: puntosFiltrados,
                    }));
                    setCalibrationPoints(puntosFiltrados);
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
                <label htmlFor="sensor-calibrationDate" className="block text-sm font-medium text-gray-700">Fecha del mantenimiento</label>
                <input
                    type="date"
                    id="sensor-calibrationDate"
                    name="calibrationDate"
                    placeholder="Fecha del mantenimiento"
                    value={formData.calibrationDate}
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
                    <label htmlFor="calibrationReport" className="block text-sm font-medium text-gray-700">Informe de calibración</label>
                    <input
                        type="text"
                        id="calibrationReport"
                        name="calibrationReport"
                        placeholder="URL de informe"
                        value={formData.calibrationReport}
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
                        value={formData.estimatedReplacementDate.substr(0, 10)}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                        disabled={mode === 'view'}
                    />
                </div>

            </div>


            <div>
                <label htmlFor="observations" className="block text-sm font-medium text-gray-700">Observaciones</label>
                <input
                    type="text"
                    id="observations"
                    name="observations"
                    placeholder="Observaciones"
                    value={formData.observations}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                    disabled={mode === 'view'}
                />
            </div>
            <div>
    <h3 className="text-lg font-semibold">Puntos de Calibración</h3>
    <ul>
        {calibrationPoints.map((point, index) => (
            <li key={index} className="mt-2">
                <strong>Punto {index + 1}:</strong> {point.value} ({point.serviceType})
            </li>
        ))}
    </ul>
</div>


             {/* Tabla de Puntos de Calibración */}
             <div className="mt-5">
                <h3 className="text-lg font-semibold">Puntos de Calibración</h3>
                <table className="min-w-full mt-3 border-collapse">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Calibrador</th>
                            <th className="border px-4 py-2">Fecha de Calibración</th>
                            <th className="border px-4 py-2">Observaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {calibrationPoints.length > 0 ? (
                            calibrationPoints.map((point, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2">Punto {index + 1}</td>
                                    <td className="border px-4 py-2">{point.value}</td>
                                    <td className="border px-4 py-2">{point.normalResponse}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="border px-4 py-2 text-center">No hay puntos de calibración disponibles</td>
                            </tr>
                        )}
                    </tbody>
                </table>
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

export default FromCalibracion;
