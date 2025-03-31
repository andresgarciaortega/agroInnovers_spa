import React, { useEffect, useState } from 'react';
import { IoCloudUploadOutline } from "react-icons/io5";
import SensorCalibradorService from '../../../services/CalibrarSensor';
import VariableTypeService from '../../../services/VariableType';
import RegistrerTypeServices from '../../../services/RegistrerType';
import CompanyService from '../../../services/CompanyService';
import { useCompanyContext } from '../../../context/CompanyContext';
import SensorService from "../../../services/SensorService";
import moment from 'moment';

const FromCalibracion = ({ selectedCompany, sensorId, showErrorAlert, onUpdate, sensor, mode, closeModal, companyId }) => {
    const companySeleector = JSON.parse(localStorage.getItem("selectedCompany"));
    const currentDate = moment().format('YYYY-MM-DD');
    const currentTime = moment().format('HH:mm');
    const [errors, setErrors] = useState({
        startTime: '',
        endTime: '',
    });
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
        const SensorCalibrador = async () => {
            try {

                const CalibrarSensor = await SensorCalibradorService.getAllMantenimiento();
                setVariableTypes(CalibrarSensor);
            } catch (error) {
                console.error('Error al obtener los calibraciones del sensor:', error);
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

        SensorCalibrador();
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

        if (name === 'maintenanceDate' && value > currentDate) {
            showErrorAlert('La fecha no puede ser posterior a la fecha actual.');
            return;
        }

        setFormData({
            ...formData,
            [name]: value,
        });
    };



    const handleTimeChange = (e) => {
        const { name, value } = e.target;

        // Validaciones de hora
        if (name === 'startTime' || name === 'endTime') {
            if (moment(value, 'HH:mm').isAfter(moment(currentTime, 'HH:mm'))) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [name]: 'La hora no puede ser posterior a la hora actual.',
                }));
                return;
            }

            if (name === 'endTime' && moment(value, 'HH:mm').isBefore(moment(formData.startTime, 'HH:mm'))) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    endTime: 'La hora de finalización debe ser después de la hora de inicio.',
                }));
                return;
            }
        }

        // Limpiar errores si la validación pasa
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const formatTime = (time) => {
        return moment(time).format('HH:mm');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            if (
                moment(formData.startTime, 'HH:mm').isAfter(moment(currentTime, 'HH:mm')) ||
                moment(formData.endTime, 'HH:mm').isAfter(moment(currentTime, 'HH:mm'))
            ) {
                showErrorAlert('La hora del mantenimiento no puede ser en el futuro.');
                return;
            }

            const [startHour, startMinute] = formData.startTime.split(':');
            const [endHour, endMinute] = formData.endTime.split(':');

            const calibrationDate = moment(formData.calibrationDate).toDate();

            const startDate = new Date(calibrationDate);
            startDate.setHours(startHour, startMinute, 0, 0);

            const endDate = new Date(calibrationDate);
            endDate.setHours(endHour, endMinute, 0, 0);

            if (startDate >= endDate) {
                showErrorAlert('La hora de inicio debe ser anterior a la hora de finalización.');
                return;
            }

            const formDataToSubmit = {
                ...formData,
                media: formData.media || '',
                calibrationDate: calibrationDate,
                startTime: startDate,
                endTime: endDate,
                maintenanceType: formData.maintenanceType,
                replacedParts: formData.replacedParts,
                calibrationReport: formData.calibrationReport,
                sensorStatus: formData.sensorStatus,
                estimatedReplacementDate: formData.estimatedReplacementDate,
                observations: formData.observations,
                sensor_id: sensorId || formData.sensor_id,
                calibrationPoints: formData.calibrationPoints || [],
            };

            if (mode === 'calibrar') {
                const createdMantenimiento = await SensorCalibradorService.createMantenimiento(formDataToSubmit);
                showErrorAlert("calibración creado");
            } else if (mode === 'edit') {
                await SensorCalibradorService.updateMantenimiento(sensorId, formDataToSubmit);
                showErrorAlert("calibración actualizado correctamente.");
            }

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

                    const sensorTypePoints = sensorDetails.sensorType?.calibrationPoints || [];

                    setFormData((prevData) => ({
                        ...prevData,
                        estimatedReplacementDate: sensorDetails.estimatedChangeDate || '',
                        calibrationPoints: sensorTypePoints,
                    }));

                    setCalibrationPoints(sensorTypePoints);
                } catch (error) {
                    console.error('Error al obtener los detalles del sensor:', error);
                }
            };

            fetchSensorDetails();
        }
    }, [sensorId]);

    // Usar un efecto para ver los cambios de formData
    useEffect(() => {
    }, [formData]);



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
    <label htmlFor="sensor-calibrationDate" className="block text-sm font-medium text-gray-700">
        Fecha de calibración
    </label>
    <input
        type="date"
        id="sensor-calibrationDate"
        name="calibrationDate"
        placeholder="Fecha de calibración"
        value={formData.calibrationDate}
        onChange={handleChange}
        max={currentDate} // Usa la fecha actual como límite máximo
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
                        onChange={handleTimeChange}
                        className={`mt-1 block w-full border ${errors.startTime ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
                        required
                        disabled={mode === 'view'}
                    />
                    {errors.startTime && (
                        <p className="mt-1 text-sm text-red-500">{errors.startTime}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="endTimee" className="block text-sm font-medium text-gray-700">Hora Finalización</label>
                    <input
                        type="time"
                        id="endTimee"
                        name="endTime"
                        placeholder="Hora Finalización"
                        value={formData.endTime}
                        onChange={handleTimeChange}
                        className={`mt-1 block w-full border ${errors.endTime ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
                        required
                        disabled={mode === 'view'}
                    />
                    {errors.endTime && (
                        <p className="mt-1 text-sm text-red-500">{errors.endTime}</p>
                    )}
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
            {/* Tabla de Puntos de Calibración */}
            <div className="mt-5">
                <h3 className="text-lg font-semibold">Puntos de Calibración</h3>
                <table className="min-w-full mt-3 border-collapse">
                    <thead>
                        <tr>
                        <th className="border px-4 py-2">Punto de calibración</th>
                            <th className="border px-4 py-2">Valor</th>
                            <th className="border px-4 py-2">Valor medido</th>
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
                            {mode === 'create' ? 'Crear Calibración' : 'Crear Calibración'}

                        </button>
                    </>
                )}
            </div>
        </form>
    );
};

export default FromCalibracion;
