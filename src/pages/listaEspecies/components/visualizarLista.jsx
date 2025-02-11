import React, { useState, useEffect } from 'react'
import { ChevronDown, Upload, Plus, X } from 'lucide-react'
import { Edit, Trash, Eye } from 'lucide-react';
import CategoryService from '../../../services/CategoryService';
import VaiableService from '../../../services/variableService';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import SpeciesService from '../../../services/SpeciesService';
import ParameterModal from './formLimit';
import SuccessAlert from "../../../components/alerts/success";
import ErrorAlert from "../../../components/alerts/error";
import UploadToS3 from '../../../config/UploadToS3';
import CompanyService from '../../../services/CompanyService';
import { IoCloudUploadOutline } from "react-icons/io5";
import CompanySelector from "../../../components/shared/companySelect";
import { useCompanyContext } from "../../../context/CompanyContext";
import { MenuItem, FormControl, Select, InputLabel, Checkbox, ListItemText } from '@mui/material';


const VisualizarLista = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [imagePreview, setImagePreview] = useState(null);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedParameter, setSelectedParameter] = useState(null);

    const [step, setStep] = useState(0);
    const [stage, setStage] = useState([
        { name: "", description: "" },
    ]);

    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [messageAlert, setMessageAlert] = useState("");

    const [showAlertError, setShowAlertError] = useState(false);
    const [newSpecie, setNewSpecie] = useState({});

    const [variables, setVariables] = useState([]);
    const [selectedVariables, setSelectedVariables] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [parameters, setParameters] = useState([]);
    const [formData, setFormData] = useState({
        category_id: '',
        company_id: 0,
        subcategory_id: '',
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
            setCategories(data); // Asegúrate de que `data` contiene un array de categorías con `id` y `name`
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchSubcategories = async (categoryId) => {
        try {
            const subcategory = await CategoryService.getCategoryById(categoryId);
            setSubcategories(subcategory.subcategories); // Asegúrate de que subcategories es un array con `id` y `name`
            const variables = await VaiableService.getAllVariable();
            setVariables(variables);
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };



    const fetchSpecie = async () => {
        try {
            const data = await SpeciesService.getSpecieById(id);
            console.log("Datos de especie:", data);
            setFormData({
                category_id: data.category?.id || 0,
                company_id: data.company_id|| 0,
                subcategory_id: data.subcategory?.id  || 0,
                scientificName: data.scientific_name || '',
                commonName: data.common_name || '',
                variable_id:  data.variables.map(variable => variable.id) || [],
                image: data.photo || null,
                descripcion: data.description || '',
                stage: data.stages || [],
                parameters: data.parameters || [],
            });
            console.log('categoria', formData.category_id)
            console.log('csubategoria', formData.subcategory_id)
            setImagePreview(data.photo);

            if (data.category) {
                await fetchSubcategories(data.category?.id);
            }
        } catch (error) {
            console.error("Error fetching specie data:", error);
        }
    };

    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;

        setFormData({
            ...formData,
            category_id: selectedCategoryId,
            subcategory_id: '',
        });

        if (selectedCategoryId) {
            fetchSubcategories(selectedCategoryId);
        } else {
            setSubcategories([]);
        }
    };

    useEffect(() => {

    }, [formData]);

    useEffect(() => {
    }, [formData]);



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
        navigate('../listaEspecie');
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

    const handleEditClick = (parameter) => {
        setSelectedParameter(parameter); // Establece el parámetro seleccionado
        setEditModalOpen(true); // Abre el modal
    };

    const handleDeleteClick = async (parameterId) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este parámetro?")) {
            try {
                await SpeciesService.deleteParameter(parameterId); // Llama al servicio para eliminar
                setParameters((prev) => prev.filter((param) => param.id !== parameterId)); // Actualiza el estado
            } catch (error) {
                console.error("Error al eliminar parámetro:", error);
            }
        }
    };

    const handleCancel = () => navigate('../Listaespecie');

    return (
        <div >
            <div className="container mx-auto p-2">
                <div className="bg-white rounded-lg shadow-xl p-6">
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
                            <input id="logo-upload" type="file" className="hidden" disabled onChange={handleImageUpload} accept="image/*" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className="mb-2">
                                <label htmlFor="commonName" className="block text-sm font-medium text-gray-700">
                                    Nombre común
                                </label>
                                <input
                                    type="text"
                                    id="commonName"
                                    name="commonName"
                                    disabled
                                    value={formData.commonName}
                                    onChange={(e) => setFormData({ ...formData, commonName: e.target.value })}
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
                                    disabled
                                    value={formData.scientificName}
                                    onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                                    Descripción
                                </label>
                                <input
                                    type="text"
                                    id="descripcion"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                    className={`w-full px-3 py-2 pr-10 border border-gray- selectorMultipleVariables rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF] cursor-pointer`}
                                    disabled

                                    required
                                />
                            </div>
                        </div>
                        

                        <div className="flex flex-col justify-center">
                            <div className="mb-4">
                                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                                    Categoría
                                </label>
                                <select
                                    id="category_id"
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleCategoryChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    required
                                    disabled
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="subcategory_id" className="block text-sm font-medium text-gray-700">
                                    Subcategoría
                                </label>
                                <select
                                    id="subcategory_id"
                                    name="subcategory_id"
                                    value={formData.subcategory_id}
                                    onChange={(e) =>
                                        setFormData({ ...formData, subcategory_id: e.target.value })
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    required
                                    disabled
                                >
                                    <option value="">Selecciona una subcategoría</option>
                                    {subcategories.map((subcategory) => (
                                        <option key={subcategory.id} value={subcategory.id}>
                                            {subcategory.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="variable" className="block text-sm font-medium text-gray-700 mb-1">
                                    Variable
                                </label>
                                <FormControl
                                    className={`w-full px-3 py-2 pr-10 border border-gray- selectorMultipleVariables rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF] cursor-pointer`}
                                >
                                    <Select
                                        className='selectorMultipleVariables'
                                        multiple
                                    disabled

                                        value={formData.variable_id || []}
                                        onChange={(e) =>
                                            setFormData({ ...formData, variable_id: e.target.value })
                                        }
                                        renderValue={(selectedIds) =>
                                            variables
                                                .filter((option) => selectedIds.includes(option.id))
                                                .map((option) => option.name)
                                                .join(', ')
                                        }
                                    >
                                        {variables.map((option) => (
                                            <MenuItem key={option.id} value={option.id}>
                                                <Checkbox checked={formData.variable_id?.includes(option.id)} />
                                                <ListItemText primary={option.name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
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
                    <div className="flex justify-end space-x-4 mt-8">
                        <button type="button"
                            onClick={handleCancel}
                            className="bg-white text-gray-500 px-4 py-2 rounded border border-gray-400">

                            Volver
                        </button>
                    </div>
                </div>
            </div>
            {isEditModalOpen && (
                <ParameterModal
                    isOpen={isEditModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    parameter={selectedParameter}
                    onSave={(updatedParameter) => {
                        setParameters((prev) =>
                            prev.map((param) =>
                                param.id === updatedParameter.id ? updatedParameter : param
                            )
                        );
                        setEditModalOpen(false);
                    }}
                />
            )}
        </div>

    );
};

export default VisualizarLista;


