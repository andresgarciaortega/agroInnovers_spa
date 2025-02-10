import React, { useEffect, useState } from 'react';
import MonitoreoService from '../../../services/monitoreo';
import CompanyService from '../../../services/CompanyService';
import { useCompanyContext } from '../../../context/CompanyContext';
import { IoEye, IoEyeOff } from 'react-icons/io5';

const FormMoni = ({ selectedCompany, showErrorAlert, onUpdate, monitoreo, mode, closeModal, companyId }) => {
    const companySeleector = JSON.parse(localStorage.getItem("selectedCompany"));
    const [monitoreoList, setMonitoreoList] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [isDisplayActive, setIsDisplayActive] = useState(false);
    const [formData, setFormData] = useState({
        nombreId: '',
        ipFija: '',
        usuarioAcceso: '',
        claveAcceso: '',
        unidadSincronizacion: '',
        frecuenciaSincronizacion: '',
        company_id: companySeleector.value || ''
    });

    useEffect(() => {
        const fetchMonitoreo = async () => {
            try {
                const monitoreo = await MonitoreoService.getAllMonitories();
                setMonitoreoList(monitoreo);
            } catch (error) {
                console.error('Error al obtener los sistemas de monitoreo:', error);
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

        fetchMonitoreo();
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
        if (mode === 'edit' || mode === 'view') {
            setFormData({
                nombreId: monitoreo.nombreId || '',
                ipFija: monitoreo.ipFija || '',
                usuarioAcceso: monitoreo.usuarioAcceso || '',
                claveAcceso: monitoreo.claveAcceso || '',
                unidadSincronizacion: monitoreo.unidadSincronizacion || '',
                frecuenciaSincronizacion: monitoreo.frecuenciaSincronizacion || '',
                company_id: monitoreo.company_id || companySeleector.value,
            });
            setIsDisplayActive(monitoreo.displayFisico || false);
        } else {
            setFormData({
                nombreId: '',
                ipFija: '',  // Se inicia vacío en modo creación
                usuarioAcceso: '',
                claveAcceso: '',
                unidadSincronizacion: '',
                frecuenciaSincronizacion: '',
                company_id: companySeleector.value || '',
            });
            setIsDisplayActive(false);
        }
    }, [monitoreo, mode]);

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
            const formDataToSubmit = {
                nombreId: formData.nombreId,
                displayFisico: isDisplayActive,
                company_id: Number(companyId) || Number(formData.company_id),
            };

            if (isDisplayActive) {
                Object.assign(formDataToSubmit, {
                    ipFija: formData.ipFija,
                    usuarioAcceso: formData.usuarioAcceso,
                    claveAcceso: formData.claveAcceso,
                    unidadSincronizacion: formData.unidadSincronizacion,
                    frecuenciaSincronizacion: Number(formData.frecuenciaSincronizacion),
                });
            }

            if (mode === 'create') {
                await MonitoreoService.createMonitories(formDataToSubmit);
                showErrorAlert("creado");
            } else if (mode === 'edit') {
                await MonitoreoService.updateMonitories(monitoreo.id, formDataToSubmit);
                showErrorAlert("actualizado");
            }

            onUpdate();
            closeModal();
        } catch (error) {
            console.error('Error al guardar el sistema de monitoreo:', error);
            showErrorAlert("Hubo un error al guardar el sistema de monitoreo.");
        }
    };



    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar u ocultar la contraseña

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre Id</label>
                    <input
                        id="name"
                        name="nombreId"
                        value={formData.nombreId}
                        onChange={handleChange}
                        className="border-gray-300 rounded-md shadow-sm p-2 w-full"
                        placeholder="Ingrese el nombre"
                    />
                </div>
                <div className="flex items-start justify-start">
                    <label htmlFor="display" className="text-sm font-medium text-gray-700">Display físico</label>  &nbsp; &nbsp; &nbsp;
                    <div
                        className={`relative inline-flex items-center h-7 rounded-full w-11 cursor-pointer transition-colors ease-in-out duration-200 ${isDisplayActive ? 'bg-green-500' : 'bg-gray-300'}`}
                        onClick={() => setIsDisplayActive(!isDisplayActive)}
                    >
                        <span
                            className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform ease-in-out duration-200 ${isDisplayActive ? 'translate-x-5' : 'translate-x-0'}`}
                        />
                    </div>
                </div>
                {isDisplayActive && (
                    <>
                        <div className="grid gap-2">
                            <label htmlFor="ip" className="block text-sm font-medium text-gray-700">IP Fija</label>
                            <input
                                id="ip"
                                name="ipFija"
                                value={mode === 'create' && !isDisplayActive ? '' : formData.ipFija}
                                onChange={handleChange}
                                className="border-gray-300 rounded-md shadow-sm p-2 w-full"
                                placeholder="Ingrese la IP fija"
                                disabled={mode === 'view'}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Usuario de accesos</label>
                                <input
                                    id="username"
                                    name="usuarioAcceso"
                                    value={formData.usuarioAcceso}
                                    onChange={handleChange}
                                    className="border-gray-300 rounded-md shadow-sm p-2 w-full"
                                    placeholder="Ingrese el usuario"
                                />
                            </div>
                            {/* <div className="grid gap-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Clave de acceso</label>
                                <input
                                    id="password"
                                    name="claveAcceso"
                                    type="password"
                                    value={formData.claveAcceso}
                                    onChange={handleChange}
                                    className="border-gray-300 rounded-md shadow-sm p-2 w-full"
                                    placeholder="Ingrese la clave"
                                />
                            </div> */}

                            <div className="">
                                <div className="grid gap-2">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Clave de acceso</label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="claveAcceso"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.claveAcceso}
                                            onChange={handleChange}
                                            className="border-gray-300 rounded-md shadow-sm p-2 w-full"
                                            placeholder="Ingrese la clave"
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 focus:outline-none"
                                        >
                                            {showPassword ? (
                                                <IoEyeOff /> // Cambiar por un ícono SVG si se prefiere
                                            ) : (
                                                <IoEye />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="syncTime" className="block text-sm font-medium text-gray-700">
                                    Unidad tiempo sincronización
                                </label>
                                <select
                                    id="syncTime"
                                    name="unidadSincronizacion"
                                    value={formData.unidadSincronizacion}
                                    onChange={handleChange}
                                    className="border-gray-300 rounded-md shadow-sm p-2 w-full"
                                >   
                                    <option value="Dias">Días</option>
                                    <option value="Horas">Horas</option>
                                    <option value="Minutos">Minutos</option>
                                </select>
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="syncFreq" className="block text-sm font-medium text-gray-700">Frecuencia sincronización datos</label>
                                <input
                                    id="syncFreq"
                                    name="frecuenciaSincronizacion"
                                    type="number"
                                    value={formData.frecuenciaSincronizacion}
                                    onChange={handleChange}
                                    className="border-gray-300 rounded-md shadow-sm p-2 w-full"
                                    placeholder="Ingrese la frecuencia"
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
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
                            {mode === 'create' ? 'Crear Monitoreo' : 'Guardar Cambios'}
                        </button>
                    </>
                )}
            </div>
        </form>
    );
};

export default FormMoni;
