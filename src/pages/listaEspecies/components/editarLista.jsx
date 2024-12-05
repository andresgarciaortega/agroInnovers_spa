import React, { useState, useEffect } from 'react'
import { ChevronDown, Upload, Plus, X } from 'lucide-react'
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
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

const EditarLista = () => {
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
        variable_id:0,
        image: null,
        description:0,
        stage: [],
        parameters: [],

    });


    useEffect(() => {
        fetchSpecie();
        fetchCompanies();
    }, []);

        const fetchSpecie = async () => {
            try {
                const data = await SpeciesService.getSpecieById(id);

                setFormData({
                    category_id: data.category_id || 0,
                    subcategory_id: data.subcategory_id || 0,
                    scientificName: data.scientificName || '',
                    commonName: data.commonName || '',
                    variable_id: data.variable_id || 0,
                    image: data.image || null,
                    description: data.description || '',
                    stage: data.stages || [],
                    parameters: data.parameters || []
                });
                console.log("datos:", setFormData);


                setNewSpecie(data);
                setImagePreview(data.image);
                
            } catch (error) {
                console.error("Error fetching data:", error);
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
        const updatedstage = [...stage];
        updatedstage[index][field] = value;
        setStage(updatedstage);
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

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            let imageUrl = '';
    
            if ( formData.image.name) {
                imageUrl = await UploadToS3(formData.image);
            } else {
                imageUrl = newSpecie.image ; // Si no hay imagen nueva, usa la anterior
            }
    
            const parsedCompanyId = parseInt(formData.company_id, 10);
            if (isNaN(parsedCompanyId)) {
                setShowAlertError(true);
                setMessageAlert("El ID de la empresa debe ser un número válido.");
                return;
            }
    
            const formDataToSubmit = {
                scientific_name: formData.scientificName, // Mapea el nombre científico
                common_name: formData.commonName,         // Mapea el nombre común
                description: formData.description,       // Mapea la descripción
                photo: imageUrl,                         // Mapea la URL de la foto
                category_id: parseInt(formData.category, 10),  // Mapea la categoría (convertido a entero)
                subcategory_id: parseInt(formData.subcategory, 10), // Mapea la subcategoría (convertido a entero)
                company_id: parsedCompanyId,            // Mapea el ID de la empresa
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
        <h2 className="text-2xl font-semibold mb-6">Crear Lista de Especies</h2>

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
                {imagePreview && (
                    <button
                        type="button"
                        onClick={handleDeleteImage}
                        className="mt-2 text-red-600 hover:text-red-800"
                    >
                        Eliminar imagen
                    </button>
                )}

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

            {/* Sección 3: Categoría y Subcategorías */}
            <div className="flex flex-col justify-center">
                <div className="mb-2">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Categoría
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        value={formData.subcategory}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

        {/* Parte de Etapas */}
        <div className="mb-6">
            <div className="space-y-2">
                {stage.map((stage, index) => (
                    <div key={index} className="p-2 border border-gray-200 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Etapa {index + 1}</span>
                            <button
                                onClick={() => handleRemoveStage(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <input
                            type="text"
                            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm"
                            value={stage.name}
                            onChange={(e) => handleStageChange(index, "name", e.target.value)}
                            placeholder="Nombre de la etapa"
                        />

                        <textarea
                            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm"
                            value={stage.description}
                            onChange={(e) => handleStageChange(index, "description", e.target.value)}
                            placeholder="Descripción de la etapa"
                        />
                    </div>
                ))}
            </div>
        </div>
    </div>
</div>
</form>

    );
};

export default EditarLista;


