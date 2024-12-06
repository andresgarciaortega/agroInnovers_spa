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

const EditarLista = () => {
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
    const [newParameter, setNewParameter] = useState({
        min_normal_value: '',
        max_normal_value: '',
        min_limit: '',
        max_limit: ''
    });
    const [showModal, setShowModal] = useState(false); // Para controlar si el modal está visible
    const [selectedStageId, setSelectedStageId] = useState(null); // Para guardar la etapa seleccionada
    const [newParamValues, setNewParamValues] = useState({
        minNormalValue: '',
        maxNormalValue: '',
        minLimit: '',
        maxLimit: '',
    }); // Para manejar los valores de los nuevos parámetros


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
        category_id: 0,
        company_id: 0,
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
            setCategories(data); // Asegúrate de que `data` contiene un array de categorías con `id` y `name`
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchSubcategories = async (categoryId) => {
        try {
            const subcategory = await CategoryService.getCategoryById(categoryId);
            setSubcategories(subcategory.subcategories); // Asegúrate de que subcategories es un array con `id` y `name`
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };
<<<<<<< HEAD


=======
>>>>>>> 5cc22948cc31091a3b8d2e10983008b88145f0d6
    const fetchSpecie = async () => {
        try {
            const data = await SpeciesService.getSpecieById(id);
            console.log("Datos de especie:", data);
            setFormData({
                category_id: data.category?.id || 0,
                company_id: data.company_id || 0,
                subcategory_id: data.subcategory?.id || 0,
                scientificName: data.scientific_name || '',
                commonName: data.common_name || '',
                variable_id: data.variables || 0,
                image: data.photo || null,
                descripcion: data.description || '',
                stage: data.stages || [],
                parameters: data.parameters || [],
            });

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
        setStages((prevStages) =>
            prevStages.map((stage, i) =>
                i === index
                    ? { ...stage, [field]: value } // Solo actualiza el campo del stage correspondiente
                    : stage
            )
        );
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

    const handleOpenModal = (stageId) => {
        setSelectedStageId(stageId); 
        setModalOpen(true); 
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewParameter({
            ...newParameter,
            [name]: value
        });
    };
    const handleSaveParameter = () => {
        const updatedStages = formData.stage.map((stage) => {
            if (stage.id === selectedStageId) {
                return {
                    ...stage,
                    parameters: [
                        ...stage.parameters,
                        {
                            id: newParameterId,
                            min_normal_value: newParamValues.minNormalValue,
                            max_normal_value: newParamValues.maxNormalValue,
                            min_limit: newParamValues.minLimit,
                            max_limit: newParamValues.maxLimit,
                        },
                    ],
                };
            }
            return stage;
        });
        setFormData({
            ...formData,
            stage: updatedStages,
        });
        setShowModal(false);
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
    const handleAddParameter = () => {
        const updatedStages = formData.stage.map((stage) => {
            if (stage.id === selectedStageId) {
                return {
                    ...stage,
                    parameters: [
                        ...stage.parameters,
                        {
                            id: stage.parameters.length + 1, // Asigna un id único
                            ...newParameter
                        }
                    ]
                };
            }
            return stage;
        });

        // Actualiza el estado con las etapas modificadas
        setFormData({ ...formData, stage: updatedStages });

        // Cierra el modal después de agregar el parámetro
        handleCloseModal();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            let imageUrl = '';

            if (formData.image.name) {
                imageUrl = await UploadToS3(formData.image);
            } else {
                imageUrl = newSpecie.image;
            }

            const parsedCompanyId = parseInt(formData.company_id, 10);

            const formDataToSubmit = {
                scientific_name: formData.scientificName,
                common_name: formData.commonName,
                description: formData.descripcion,
                photo: imageUrl,
                company_id: parsedCompanyId,
                category: formData.category_id ? parseInt(formData.category_id, 10) : 0,
                subcategory: formData.subcategory_id ? parseInt(formData.subcategory_id, 10) : 0,
                stages: Array.isArray(formData.stage) ? formData.stage.map((stageItem) => ({
                    stage_id: stageItem.id && !isNaN(parseInt(stageItem.id, 10)) ? parseInt(stageItem.id, 10) : 0,
                    time_to_production: stageItem.time_to_production,
                    description: stageItem.description,
                    parameters: Array.isArray(stageItem.parameters)
                        ? stageItem.parameters.map((param) => ({
                            variable_id: param.variable && param.variable.id && !isNaN(parseInt(param.variable.id, 10)) ? parseInt(param.variable.id, 10) : 0,  // Validación de variable_id
                            min_normal_value: param.min_normal_value,
                            max_normal_value: param.max_normal_value,
                            min_limit: param.min_limit,
                            max_limit: param.max_limit,
                        }))
                        : [],
                })) : [],
                variables: formData.variable_id ? formData.variable_id.map(variable => variable.id && !isNaN(parseInt(variable.id, 10)) ? parseInt(variable.id, 10) : null) : [],
            };

            await SpeciesService.updateSpecie(id, formDataToSubmit);
            setShowSuccessAlert(true);
            setTimeout(() => setShowSuccessAlert(false), 3000);
            navigate('../Listaespecie');

        } catch (error) {
            console.error("Error al actualizar especie:", error);
            setShowAlertError(true);
            setMessageAlert("Hubo un error al editar la especie.");
        }
    };
    const handleEditClick = (parameter) => {
        setSelectedParameter(parameter); // Establece el parámetro seleccionado
        setEditModalOpen(true); // Abre el modal
    };

    const handleDeleteClick = (paramId) => {
        setFormData((prevData) => {
            return {
                ...prevData,
                stage: prevData.stage.map((stage) => ({
                    ...stage,
                    parameters: stage.parameters.filter((param) => param.id !== paramId), // Eliminar parámetro por id
                })),
            };
        });
    };

    const handleCancel = () => navigate('../Listaespecie');

    return (
        <form onSubmit={handleSubmit} className="">
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
                            <input id="logo-upload" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
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
                                    value={formData.scientificName}
                                    onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
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
                                >
                                    <option value="">Selecciona una subcategoría</option>
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
                                    <button
                                        onClick={() => handleOpenModal(stage.id)}
                                        className="inline-flex items-center px-3 py-2 border border-[#168C0DFF] text-sm leading-4 font-medium rounded-md text-[#168C0DFF] bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        Añadir Parámetro
                                    </button>
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
                                                        <th className="border px-4 py-2 font-semibold">Acciones</th>
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
                                                            <td className="border px-4 py-2">
                                                                <button onClick={() => handleEditClick(paramIndex)}
                                                                    className="text-[#168C0DFF] hover:text-[#0F6A06] px-2 py-2 rounded"
                                                                >
                                                                    <Edit size={20} />
                                                                </button>
                                                                <button onClick={() => handleDeleteClick(param.id)}
                                                                    className="text-[#168C0DFF] hover:text-[#0F6A06] px-2 py-2 rounded"
                                                                >
                                                                    <Trash size={20} />
                                                                </button>
                                                            </td>
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

                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">Guardar</button>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Agregar Parámetro</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleAddParameter(); }}>
                            <div>
                                <label>Min. Normal:</label>
                                <input
                                    type="number"
                                    name="min_normal_value"
                                    value={newParameter.min_normal_value}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label>Max. Normal:</label>
                                <input
                                    type="number"
                                    name="max_normal_value"
                                    value={newParameter.max_normal_value}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label>Límite Mín:</label>
                                <input
                                    type="number"
                                    name="min_limit"
                                    value={newParameter.min_limit}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label>Límite Máx:</label>
                                <input
                                    type="number"
                                    name="max_limit"
                                    value={newParameter.max_limit}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <button type="submit">Agregar</button>
                            <button type="button" onClick={handleCloseModal}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}

            {/* {isEditModalOpen && (
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
            )} */}
        </form>

    );
};

export default EditarLista;


