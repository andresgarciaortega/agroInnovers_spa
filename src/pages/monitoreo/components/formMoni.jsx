import React, { useEffect, useState } from 'react';
import MonitoreoService from '../../../services/monitoreo';
import CompanyService from '../../../services/CompanyService';
import { useCompanyContext } from '../../../context/CompanyContext';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import LoadingView from '../../../components/Loading/loadingView';
import ErrorAlert from '../../../components/alerts/error';

const FormMoni = ({ selectedCompany, showErrorAlert, onUpdate, monitoreo, mode, closeModal, companyId }) => {
    const companySeleector = JSON.parse(localStorage.getItem("selectedCompany"));
    const [monitoreoList, setMonitoreoList] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [Role, setRole] = useState(JSON.parse(localStorage.getItem('rol')));
    const [idcompanyLST, setIdcompanyLST] = useState(JSON.parse(localStorage.getItem('selectedCompany')));
    const [isLoadingUUID, setIsLoadingUUID] = useState(false);
    const [isDisplayActive, setIsDisplayActive] = useState(false);
    const [formData, setFormData] = useState({
        nombreId: '',
        ipFija: '',
        usuarioAcceso: '',
        claveAcceso: '',
        unidadSincronizacion: '',
        frecuenciaSincronizacion: '',
        company_id: ''
    });
    const [isLoading, setIsLoading] = useState(true);

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
                setIsLoading(false)
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
        setIsLoading(true)
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
            setIsLoading(false)
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
                displayFisico: isDisplayActive == 1 ? true : false,
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

    const [errorAlerta, seterrorAlerta] = useState(false)
    const [messageAlert, setmessageAlert] = useState("")

    const validateCodeUUID = async () => {
        setIsLoadingUUID(true);

        if (formData.ipFija == '') {
            setIsLoadingUUID(false);
            return;
        }

        const uuid = formData.ipFija
        const datavalidate = await MonitoreoService.getMotitoriesByUUIDExisting(uuid, Number(idcompanyLST.value));
        if (datavalidate.success) {
            setIsLoadingUUID(false);
            seterrorAlerta(true)
            setmessageAlert("El código UUID, ya se encuentra registrado con otra compañia");
            formData.ipFija = '';
            setTimeout(() => {
                seterrorAlerta(false)
            }, 1100);
        } else {
            setIsLoadingUUID(false)
        }
    }

    const handleCloseAlert = () => {
        seterrorAlerta(false);
    };

    return (
        <>
            {isLoading ? (
                <LoadingView />
            ) : (
                <>

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
                            {Role.label == "SUPER-ADMINISTRADOR" ? (
                                <>
                                    <div>
                                        <label htmlFor="company_id" className="block text-sm font-medium text-gray-700">Empresa</label>
                                        <select
                                            id="company_id"
                                            name="company_id"
                                            value={formData.company_id}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                            required
                                        >
                                            <option value="">Seleccione una empresa</option>
                                            {companies.map((company) => (
                                                <option
                                                    key={company.id}
                                                    value={company.id}
                                                    selected={company.id === Number(idcompanyLST.value)}
                                                >
                                                    {company.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            ) : ''}

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
                                    {/* <div className="grid gap-2">
                                        <label htmlFor="ip" className="block text-sm font-medium text-gray-700">Código UUID</label>
                                        <input
                                            id="ip"
                                            name="ipFija"
                                            value={mode === 'create' && !isDisplayActive ? '' : formData.ipFija}
                                            onChange={handleChange}
                                            onBlur={validateCodeUUID}
                                            className="border-gray-300 rounded-md shadow-sm p-2 w-full"
                                            placeholder="Ingrese el código UUID"
                                            disabled={mode === 'view'}
                                        />
                                    </div> */}

                                    <div className="grid gap-2 relative">
                                        <label htmlFor="ip" className="block text-sm font-medium text-gray-700">Código UUID</label>
                                        <div className="relative">
                                            <input
                                                id="ip"
                                                name="ipFija"
                                                value={mode === 'create' && !isDisplayActive ? '' : formData.ipFija}
                                                onChange={handleChange}
                                                onBlur={validateCodeUUID}
                                                className="border-gray-300 rounded-md shadow-sm p-2 w-full pr-10" // Añadí pr-10 para espacio del spinner
                                                placeholder="Ingrese el código UUID"
                                                disabled={mode === 'view'}
                                            />
                                            {/* Spinner - solo visible cuando sea necesario (puedes controlarlo con un estado) */}
                                            {isLoadingUUID && (
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
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
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
                </>
            )}

            {errorAlerta &&
                <ErrorAlert message={messageAlert}
                    onCancel={handleCloseAlert} />
            }

        </>

    );
};

export default FormMoni;
