import React, { useState, useEffect } from 'react'
import { ChevronDown, Upload, Plus, X } from 'lucide-react'
import { Edit, Trash, Eye } from 'lucide-react';
import CategoryService from '../../../services/CategoryService';
import VaiableService from '../../../services/variableService';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import SpeciesService from '../../../services/SpeciesService';
import UploadToS3 from '../../../config/UploadToS3';
import CompanyService from '../../../services/CompanyService';
import { IoCloudUploadOutline } from "react-icons/io5";
import CompanySelector from "../../../components/shared/companySelect";
import { useCompanyContext } from "../../../context/CompanyContext";

const VisualizarLista = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [imagePreview, setImagePreview] = useState(null);

    const [step, setStep] = useState(0);
    const [stage, setStage] = useState([
        { name: "", description: "" },
    ]);

    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);

    const [newSpecie, setNewSpecie] = useState({});

    const [variables, setVariables] = useState([]);
    const [selectedVariables, setSelectedVariables] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [parameters, setParameters] = useState([]);
    const [formData, setFormData] = useState({
        category_id: 0,
        subcategory_id: 0,
        scientificName: '',
        commonName: '',
        variable_id: 0,
        image: null,
        descripcion: '',
        stage: [],
        parameters: [],

    });


    useEffect(() => {
        fetchSpecie();
        fetchCompanies();
        fetchCategory();
    }, []);

    const fetchCategory = async () => {
        try {
            const data = await CategoryService.getAllCategory();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };


    const fetchSpecie = async () => {
        try {
            const data = await SpeciesService.getSpecieById(id);
            console.log("Fetched data:", data); // Verifica que data.stages esté presente y sea lo esperado.

            setFormData({
                category_id: data.category_id || 0,
                company_id: data.company_id || 0,
                subcategory_id: data.subcategory_id || 0,
                scientificName: data.scientific_name || '',
                commonName: data.common_name || '',
                variable_id: data.variables || 0,
                image: data.photo || null,
                descripcion: data.description || '',
                stage: data.stages || [],
                parameters: data.parameters || []
            });

            setNewSpecie(data);
            setImagePreview(data.image);
            fetchSubcategories(data.category_id);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        console.log("Updated formData:", formData);
    }, [formData]);



    const fetchSubcategories = async () => {
        try {
            const subcategory = await CategoryService.getCategoryById(id);
            setSubcategories(subcategory.subcategories);
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };
    const fetchCompanies = async () => {
        try {
            const data = await CompanyService.getAllCompany();
            setCompanies(data);
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };
    const handleDeleteImage = () => {

        setFormData({ ...formData, image: null });
    };



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === 'category') {
            CategoryService.getSubcategories(value).then((data) => {
                setSubcategories(data);
            });
        }
    };

    const handleAddStage = () => {
        setStage([...stage, { name: '', description: '' }]);
    };

    const handleRemoveStage = (index) => {
        setStage(stage.filter((_, i) => i !== index));
    };

    const handleStageChange = (index, field, value) => {
        const updatedStages = [...formData.stage];
        updatedStages[index][field] = value;
        setFormData({ ...formData, stage: updatedStages });
    };

    const handleVariableChange = (e) => {
        const { value } = e.target;
        setSelectedVariables(value);
    };

    const handleNextStep = () => {
        setStep((prev) => prev + 1);
    };

    const handlePrevStep = () => {
        setStep((prev) => prev - 1);
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSaveParameter = (newParameter) => {
        setParameters((prev) => [...prev, newParameter]);
        setModalOpen(false);
    };

    const handleGoBack = () => {
        navigate('../listaEspecie'); // Redirige a la ruta listaEspecies
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                image: file,
            });

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;
        setFormData({
            ...formData,
            category_id: selectedCategoryId,
            subcategory_id: '' // Resetea la subcategoría cuando cambia la categoría
        });
        fetchSubcategories(selectedCategoryId);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            let imageUrl = '';

            if (formData.image.name) {
                imageUrl = await UploadToS3(formData.image);
            } else {
                imageUrl = newSpecie.image; // Si no hay imagen nueva, usa la anterior
            }

            const parsedCompanyId = parseInt(formData.company_id, 10);
            if (isNaN(parsedCompanyId)) {
                setShowAlertError(true);
                setMessageAlert("El ID de la empresa debe ser un número válido.");
                return;
            }

            const formDataToSubmit = {
                scientific_name: formData.scientificName,
                common_name: formData.commonName,
                description: formData.descripcion,
                photo: imageUrl,
                category_id: parseInt(formData.category, 10),
                subcategory_id: parseInt(formData.subcategory, 10),
                company_id: parsedCompanyId,
                stages: stage.map((stageItem) => ({
                    stage_id: stageItem.id && !isNaN(parseInt(stageItem.id, 10)) ? parseInt(stageItem.id, 10) : 0,
                    description: stageItem.description
                })) // Mapea las etapas
            };

            console.log("Datos a enviar:", formDataToSubmit);

            // Llamada al servicio para actualizar la especie
            await SpeciesService.updateSpecie(id, formDataToSubmit); // Asegúrate de que el servicio esté preparado para manejar este formato

            setShowSuccessAlert(true);
            setTimeout(() => setShowSuccessAlert(false), 3000);
            navigate('../especies'); // Redirige a la lista de especies

        } catch (error) {
            console.error("Error al actualizar especie:", error);
            setShowAlertError(true);
            setMessageAlert("Hubo un error al editar la especie.");
        }
    };
    return (
        <form onSubmit={handleSubmit} className="p-6">
            <div className="container mx-auto p-8">
                <div className="bg-white rounded-lg shadow-xl p-6">
                 

                    {/* Sección dividida en tres partes */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="mb- py-">
                            <label>Adjuntar Logo</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-0 text-center cursor-pointer hover:bg-gray-50" onClick={() => document.getElementById('logo-upload').click()}>
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Company Logo" className="mx-auto h-20 object-contain" />
                                ) : (
                                    <>
                                        <IoCloudUploadOutline className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="mt-1 text-sm text-gray-600">
                                            Haga <span className="text-cyan-500 underline">clic aquí</span> para cargar o arrastre y suelte
                                        </p>
                                        <p className="text-xs text-gray-500">Archivos máximo 10 mb</p>
                                    </>
                                )}
                            </div>
                            <input id="logo-upload" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                        </div>


                        {/* Sección 2: Nombre Común y Científico */}
                        <div className="flex flex-col justify-center">
                            <div className="mb-2">
                                <label htmlFor="commonName" className="block text-sm font-medium text-gray-700">
                                    Nombre común
                                </label>
                                <input
                                    type="text"
                                    id="commonName"
                                    name="commonName"
                                    value={formData.commonName}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="scientificName" className="block text-sm font-medium text-gray-700">
                                    Nombre científico
                                </label>
                                <input
                                    type="text"
                                    id="scientificName"
                                    name="scientificName"
                                    value={formData.scientificName}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col justify-center">
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                    Categoría
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category_id || ''}
                                    onChange={handleCategoryChange}
                                    className="mt-1 block w-full rounded-md text-gray-600 border-gray-500 shadow-sm focus:border-gray-500 focus:ring-gray-500 py-3"
                                    required
                                >
                                    <option value="">Selecciona una opción</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                                    Subcategoría
                                </label>
                                <select
                                    id="subcategory"
                                    name="subcategory"
                                    value={formData.subcategory_id || ''}
                                    onChange={(e) => setFormData({ ...formData, subcategory_id: e.target.value })}
                                    className="mt-1 block w-full rounded-md text-gray-600 border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-3"
                                    required
                                >
                                    <option value="">Selecciona una opción</option>
                                    {subcategories.map((subcategory) => (
                                        <option key={subcategory.id} value={subcategory.id}>
                                            {subcategory.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        {formData.stage.map((stage, index) => (
                            <div key={index} className="mt-4 rounded-md p-4 border border-gray-300">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {`Etapa ${index + 1}`}
                                    </h3>
                                </div>

                                <div className="flex flex-col text-sm">
                                    <p className="text-gray-700">
                                        <span className="">Descripción:</span> <strong>{stage.description}</strong>
                                    </p>
                                    <p className="text-gray-700 mt-2">
                                        <span className="">Tiempo de producción:</span> <strong>{stage.time_to_production}</strong>
                                    </p>

                                    {stage.parameters.length > 0 && (
                                        <div className="mt-4">
                                            <div className="flex justify-between space-x-">
                                                <h4 className="text-sm font-semibold text-gray-800 bg-gray-200 text-center py-1 px-32 w-full">
                                                    Condiciones operación normal
                                                </h4>
                                                <h4 className="text-sm font-semibold text-gray-800 bg-gray-200 py-1 py- w-full">
                                                    Condiciones operación Criticas
                                                </h4>
                                            </div>

                                            <table className="min-w-full table-auto border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-200">
                                                        {/* Aquí solo "Variable" tendrá negrita */}
                                                        <th className="border px-4 py-2 font-bold">Variable</th>
                                                        <th className="border px-4 py-2 font-semibold">Mínimo</th>
                                                        <th className="border px-4 py-2 font-semibold">Máximo</th>
                                                        <th className="border px-4 py-2 font-semibold">Límite Mín</th>
                                                        <th className="border px-4 py-2 font-semibold">Límite Máx</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {stage.parameters.map((param, paramIndex) => (
                                                        <tr key={paramIndex}>
                                                            <td className="border px-4 py-2">{`Variable ${param.id}`}</td>
                                                            <td className="border px-4 py-2">{param.min_normal_value}</td>
                                                            <td className="border px-4 py-2">{param.max_normal_value}</td>
                                                            <td className="border px-4 py-2">{param.min_limit}</td>
                                                            <td className="border px-4 py-2">{param.max_limit}</td>
                                                            
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>


                </div>
            </div>
        </form>

    );
};

export default VisualizarLista;


