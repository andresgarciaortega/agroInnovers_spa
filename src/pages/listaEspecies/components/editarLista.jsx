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
import { Alert } from '@mui/material';
import { MenuItem, FormControl, Select, InputLabel, Checkbox, ListItemText } from '@mui/material';

const EditarLista = () => {
    const navigate = useNavigate();
    const { id } = useParams();
        const [showErrorAlert, setShowErrorAlert] = useState(false);
    
    const [imagePreview, setImagePreview] = useState(null);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [step, setStep] = useState(0);
    // const [stage, setStage] = useState([
    // { name: "", description: "" },
    // ]);


    const [selectedStageId, setSelectedStageId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [messageAlert, setMessageAlert] = useState("");
    const [variables, setVariables] = useState([]);
    const [showAlertError, setShowAlertError] = useState(false);
    const [newSpecie, setNewSpecie] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVariables, setSelectedVariables] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [formData, setFormData] = useState({
        category_id: 0,
        company_id: 0,
        subcategory_id: 0,
        scientificName: '',
        commonName: '',
        variable_id: [],
        image: '',
        descripcion: '',
        stage: [],
        parameters: [],

    });
    const [fieldErrors, setFieldErrors] = useState({
        min_normal_value: '',
        max_normal_value: '',
        min_limit: '',
        max_limit: '',
        variable: '',
    });


    const [newParameter, setNewParameter] = useState({
        variable: '',
        min_normal_value: '',
        max_normal_value: '',
        min_limit: '',
        max_limit: '',
    }); // Nuevo

    const [stage, setStages] = useState([
        { id: '', description: '', time_to_production: '', parameters: [] },
    ]);

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
            console.error('Error fetching categories:', error);
        }
    };

    const fetchSubcategories = async (categoryId) => {
        try {
            const subcategory = await CategoryService.getCategoryById(categoryId);
            setSubcategories(subcategory.subcategories);

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
                company_id: data.company_id || 0,
                subcategory_id: data.subcategory?.id || 0,
                scientificName: data.scientific_name || '',
                commonName: data.common_name || '',
                variable_id: data.variables.map(variable => variable.id) || [],

                image: data.photo || null,
                descripcion: data.description || '',
                stage: data.stages || [],
                parameters: data.parameters || [],
            });
            console.log('datos', formData)

            setImagePreview(data.photo);

            if (data.category) {
                await fetchSubcategories(data.category?.id);
            }
        } catch (error) {
            console.error("Error fetching specie data:", error);
        }
    };

    const handleParameterChange = (e, field) => {
        const value = e.target.value;

        if (field === 'variable') {
            setNewParameter((prev) => ({
                ...prev,
                [field]: value,
            }));
        } else {
            setNewParameter((prev) => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    const [selectedParameterIndex, setSelectedParameterIndex] = useState(null);

    useEffect(() => {
        if (showSuccessAlert) {
            console.log("Show success alert:", showSuccessAlert);
        }
    }, [showSuccessAlert]);
    const handleEditClick = (stageIndex, paramIndex) => {
        const stage = formData.stage[stageIndex];
        const parameter = stage.parameters[paramIndex];

        setNewParameter({
            variable: parameter.variable.id, // Asumiendo que 'variable' tiene un ID
            min_normal_value: parameter.min_normal_value,
            max_normal_value: parameter.max_normal_value,
            min_limit: parameter.min_limit,
            max_limit: parameter.max_limit,
        });
        setSelectedStageId(stage.id); // Guardar el ID de la etapa para luego actualizar
        setSelectedParameterIndex(paramIndex); // Guardar el índice del parámetro
        setIsModalOpen(true); // Abrir el modal
    };

    const handleDeleteClick = (paramId) => {
        setFormData((prevData) => {
            return {
                ...prevData,
                stage: prevData.stage.map((stage) => ({
                    ...stage,
                    parameters: stage.parameters.filter((param) => param.id !== paramId),  // Compara con paramId
                })),
            };
        });
    };



    const handleSaveParameter = () => {
        // Validaciones (tu código actual)
        setFieldErrors({
            min_normal_value: '',
            max_normal_value: '',
            min_limit: '',
            max_limit: '',
            variable: '',
        });

        let hasError = false;

        // Validar si los campos están vacíos
        if (!newParameter.variable) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                variable: 'El campo Variable no puede estar vacío.',
            }));
            hasError = true;
        }

        if (!newParameter.min_normal_value) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                min_normal_value: 'El campo Valor mínimo normal no puede estar vacío.',
            }));
            hasError = true;
        }

        if (!newParameter.max_normal_value) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                max_normal_value: 'El campo Valor máximo normal no puede estar vacío.',
            }));
            hasError = true;
        }

        if (!newParameter.min_limit) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                min_limit: 'El campo Límite mínimo no puede estar vacío.',
            }));
            hasError = true;
        }

        if (!newParameter.max_limit) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                max_limit: 'El campo Límite máximo no puede estar vacío.',
            }));
            hasError = true;
        }

        // Convertir valores a número para evitar problemas con comparaciones
        const minNormalValue = Number(newParameter.min_normal_value);
        const maxNormalValue = Number(newParameter.max_normal_value);
        const minLimit = Number(newParameter.min_limit);
        const maxLimit = Number(newParameter.max_limit);

        if (minNormalValue === maxNormalValue) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                min_normal_value: 'El valor mínimo normal no puede ser igual al valor máximo normal.',
                max_normal_value: 'El valor mínimo normal no puede ser igual al valor máximo normal.',
            }));
            hasError = true;
        }

        // 2️⃣ min_limit NO puede ser igual a max_limit
        if (minLimit === maxLimit) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                min_limit: 'El límite mínimo no puede ser igual al límite máximo.',
                max_limit: 'El límite mínimo no puede ser igual al límite máximo.',
            }));
            hasError = true;
        }
        // Validar que el valor mínimo normal y el límite mínimo no sean iguales
        if (minNormalValue === minLimit) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                min_normal_value: 'El valor mínimo normal no puede ser igual al límite mínimo.',
                min_limit: 'El valor mínimo normal no puede ser igual al límite mínimo.',
            }));
            hasError = true;
        }

        // Validar que el valor mínimo normal sea mayor que el límite mínimo
        if (minNormalValue < minLimit) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                min_normal_value: 'El valor mínimo normal debe ser mayor que el límite mínimo.',
                min_limit: 'El límite mínimo debe ser menor que el valor mínimo normal.',
            }));
            hasError = true;
        }

        // Validar que el valor máximo normal y el límite máximo no sean iguales
        if (maxNormalValue === maxLimit) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                max_normal_value: 'El valor máximo normal no puede ser igual al límite máximo.',
                max_limit: 'El valor máximo normal no puede ser igual al límite máximo.',
            }));
            hasError = true;
        }

        // Validar que el valor máximo normal sea menor que el límite máximo
        if (maxNormalValue > maxLimit) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                max_normal_value: 'El valor máximo normal debe ser menor que el límite máximo.',
                max_limit: 'El límite máximo debe ser mayor que el valor máximo normal.',
            }));
            hasError = true;
        }

        // Si hay un error, evitar continuar
        if (hasError) {
            return;
        }

        // let hasError = false;

        // Validar si los campos están vacíos
        if (!newParameter.variable) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                variable: 'El campo Variable no puede estar vacío.',
            }));
            hasError = true;
        }

        if (!newParameter.min_normal_value) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                min_normal_value: 'El campo Valor mínimo normal no puede estar vacío.',
            }));
            hasError = true;
        }

        if (!newParameter.max_normal_value) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                max_normal_value: 'El campo Valor máximo normal no puede estar vacío.',
            }));
            hasError = true;
        }

        if (!newParameter.min_limit) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                min_limit: 'El campo Límite mínimo no puede estar vacío.',
            }));
            hasError = true;
        }

        if (!newParameter.max_limit) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                max_limit: 'El campo Límite máximo no puede estar vacío.',
            }));
            hasError = true;
        }

        // Validar que el valor mínimo no sea mayor que el valor máximo
        if (newParameter.min_normal_value > newParameter.max_normal_value) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                min_normal_value: 'El valor mínimo normal no puede ser mayor que el valor máximo normal.',
                max_normal_value: 'El valor mínimo normal no puede ser mayor que el valor máximo normal.',
            }));
            hasError = true;
        }

        // Validar que el límite mínimo no sea mayor que el límite máximo
        if (newParameter.min_limit > newParameter.max_limit) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                min_limit: 'El límite mínimo no puede ser mayor que el límite máximo.',
                max_limit: 'El límite mínimo no puede ser mayor que el límite máximo.',
            }));
            hasError = true;
        }

        // Si hay un error, evitar continuar
        if (hasError) {
            return;
        }

        // Buscar la variable seleccionada
        const selectedVariable = variables.find((v) => v.id === Number(newParameter.variable));
        if (!selectedVariable) {
            setErrorMessage("Variable seleccionada no encontrada.");
            return;
        }

        let isDuplicate = false;

        setFormData((prevFormData) => {
            const updatedStages = prevFormData.stage.map((stage) => {
                if (stage.id === selectedStageId) {
                    if (selectedParameterIndex !== null) {
                        const updatedParameters = stage.parameters.map((param, paramIndex) => {
                            if (paramIndex === selectedParameterIndex) {
                                return {
                                    ...param,
                                    variable: selectedVariable,
                                    min_normal_value: newParameter.min_normal_value,
                                    max_normal_value: newParameter.max_normal_value,
                                    min_limit: newParameter.min_limit,
                                    max_limit: newParameter.max_limit,
                                };
                            }
                            return param;
                        });

                        return { ...stage, parameters: updatedParameters };
                    } else {
                        const variableAlreadyAssigned = stage.parameters.some(
                            (param) => param.variable.id === selectedVariable.id
                        );

                        if (variableAlreadyAssigned) {
                            setErrorMessage("Esta variable ya tiene parámetros asignados a esta etapa.");
                            isDuplicate = true;
                            return stage;
                        }

                        return {
                            ...stage,
                            parameters: [
                                ...(stage.parameters || []),
                                {
                                    ...newParameter,
                                    variable: selectedVariable,
                                },
                            ],
                        };
                    }
                }
                return stage;
            });

            if (isDuplicate) {
                setIsModalOpen(true);
                return prevFormData;
            }

            const updatedVariables = variables.map((variable) => {
                if (variable.id === selectedVariable.id) {
                    return { ...variable, parameters: [...(variable.parameters || []), newParameter] };
                }
                return variable;
            });

            setVariables(updatedVariables);

            return { ...prevFormData, stage: updatedStages };
        });

        if (isDuplicate) {
            setIsModalOpen(true);
            return;
        }

        setIsModalOpen(false);
        setNewParameter({
            variable: '',
            min_normal_value: '',
            max_normal_value: '',
            min_limit: '',
            max_limit: '',
        });
        setErrorMessage('');
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


    const handleOpenModal = (stageId) => {
        const stage = formData.stage.find(stage => stage.id === stageId);
        if (!stage.parameters) {
            stage.parameters = [];
        }
        setSelectedStageId(stageId);
        setIsModalOpen(true);
    };


    // Cierra el modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewParameter({ variable: '', min_normal_value: '', max_normal_value: '', min_limit: '', max_limit: '' });
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

        setFormData({ ...formData, stage: updatedStages });

        handleCloseModal(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            let imageUrl = '';
            console.log('imagen  1: ', formData.image)

            if (formData.image?.name) {
                imageUrl = await UploadToS3(formData.image);
            } else {
                imageUrl = formData.image;
            }

            const parsedCompanyId = parseInt(formData.company_id, 10);
            console.log("Datos de especie formData:", formData);

            const formDataToSubmit = {
                scientific_name: formData.scientificName,
                common_name: formData.commonName,
                description: formData.descripcion,
                photo: imageUrl,
                company_id: parsedCompanyId,
                category: formData.category_id ? parseInt(formData.category_id, 10) : 0,
                subcategory: formData.subcategory_id ? parseInt(formData.subcategory_id, 10) : 0,
                stages: Array.isArray(formData.stage)
                    ? formData.stage.map((stageItem) => {
                        const stageId = stageItem.id && !isNaN(parseInt(stageItem.id, 10))
                            ? parseInt(stageItem.id, 10)
                            : 0;
                        const IdStage = stageItem?.stage.id
                        console.log("Etapa ID:", stageItem.id, "ID validado:", stageId);

                        if (stageId === 0) {
                            throw new Error(`Etapa con ID ${stageItem.id} no válida.`);
                        }
                        console.log('id stage', IdStage)
                        return {
                            id: stageId,
                            time_to_production: stageItem.time_to_production ? parseInt(stageItem.time_to_production , 10) : 0,
                            description: stageItem.description || '',
                            parameters: Array.isArray(stageItem.parameters)
                                ? stageItem.parameters.map((param) => ({
                                    variable_id: param?.variable?.id && !isNaN(parseInt(param.variable.id, 10))
                                        ? parseInt(param.variable.id, 10)
                                        : 0,
                                    min_normal_value: param.min_normal_value ? parseInt(param.min_normal_value, 10) : null,
                                    max_normal_value: param.max_normal_value ? parseInt(param.max_normal_value, 10) : null,
                                    min_limit: param.min_limit ? parseInt(param.min_limit, 10) : null,
                                    max_limit: param.max_limit ? parseInt(param.max_limit, 10) : null,
                                }))
                                : [],
                        };
                    })
                    : [],

                variables: formData.variable_id || [],
            };

            console.log('imagen', imageUrl)

            console.log('datos de la etapa:', formDataToSubmit);
            await SpeciesService.updateSpecie(id, formDataToSubmit);
      showErrorAlertSuccess("Editada");

            setShowSuccessAlert(true);
            setTimeout(() =>{ 
                setShowSuccessAlert(false)}, 2000);
                setTimeout(() => {
                    navigate('../ListaEspecie');
                }, 2010);
        } catch (error) {
            console.error("Error al actualizar especie:", error);
            setShowAlertError(true);
            setMessageAlert("Hubo un error al editar la especie.");
        }
    };

    const showErrorAlertSuccess = (message) => {
        setShowErrorAlert(true);
        setMessageAlert(`Especie ${message} exitosamente`);
      
        setTimeout(() => {
          setShowErrorAlert(false);
        }, 2500);
      };


    const handleCancel = () => navigate('../Listaespecie');

    return (
        <form onSubmit={handleSubmit} className="">
            <div className="container mx-auto p-2">
                <div className="bg-white rounded-lg shadow-xl p-6">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className=" py-2 ">
                            {/* <label>Adjuntar Logo</label> */}
                            <div className="border-2 p-2 border-dashed border-gray-300 rounded-lg  text-center cursor-pointer hover:bg-gray-50 h-full" onClick={() => document.getElementById('logo-upload').click()}>
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Logo" className="mx-auto h-full w-full object-contain" />
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
                            <input id="logo-upload" type="file" className="hidden  " onChange={handleImageUpload} accept="image/*" />
                        </div>
                        <div className="flex flex-col justify-center mb-2 p-1 ">
                            <div className="mb-4">
                                <label htmlFor="commonName" className="block text-sm font-medium text-gray-700">
                                    Nombre común
                                </label>
                                <input
                                    type="text"
                                    id="commonName"
                                    name="commonName"
                                    value={formData.commonName}
                                    onChange={(e) => setFormData({ ...formData, commonName: e.target.value })}
                                    className={`w-full px-3 py-2 pr-10 border border-gray- selectorMultipleVariables rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF] cursor-pointer`}

                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="scientificName" className="block text-sm font-medium text-gray-700">
                                    Nombre científico
                                </label>
                                <input
                                    type="text"
                                    id="scientificName"
                                    name="scientificName"
                                    value={formData.scientificName}
                                    onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
                                    className={`w-full px-3 py-2 pr-10 border border-gray- selectorMultipleVariables rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF] cursor-pointer`}

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
                                    className={`w-full px-3 py-2 pr-10 border border-gray- selectorMultipleVariables rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF] cursor-pointer`}

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
                                    className={`w-full px-3 py-2 pr-10 border border-gray- selectorMultipleVariables rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF] cursor-pointer`}

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
                        {formData.stage.map((stage, stageIndex) => (
                            <div key={stage.id} className="mt-4 rounded-md p-4 border border-gray-300">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {`Etapa ${stage.stage.name}`}
                                    </h3>
                                    <button
                                        type='button'
                                        onClick={() => handleOpenModal(stage.id)}
                                        className="inline-flex items-center px-3 py-2 border border-[#168C0DFF] text-sm leading-4 font-medium rounded-md text-[#168C0DFF] bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        Añadir Parámetro
                                    </button>
                                </div>

                                <div className="flex flex-col text-sm">
                                <label htmlFor="scientificName" className="block text-sm font-medium text-gray-700">
                                    Descripción de la etapa
                                </label>
                                <input
                                    type="text"
                                    id="scientificName"
                                    name="scientificName"
                                    value={stage.description}
                                    onChange={(e) => {
                                        const updatedStages = formData.stage.map((s, idx) =>
                                            idx === stageIndex ? { ...s, description: e.target.value } : s
                                        );
                                        setFormData({ ...formData, stage: updatedStages });
                                    }}
                                    className={`w-full px-3 py-2 pr-10 border border-gray- selectorMultipleVariables rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF] cursor-pointer`}

                                    required
                                />
                                    <label htmlFor="scientificName" className="block text-sm font-medium text-gray-700 mt-3">
                                    Tiempo de producción (en días)	
                                </label>
                                <input
                                    type="text"
                                    id="scientificName"
                                    name="scientificName"
                                    value={stage.time_to_production}
                                    onChange={(e) => {
                                        const updatedStages = formData.stage.map((s, idx) =>
                                            idx === stageIndex ? { ...s, time_to_production: e.target.value } : s
                                        );
                                        setFormData({ ...formData, stage: updatedStages });
                                    }}
                                    className={`w-full px-3 py-2 pr-10 border border-gray- selectorMultipleVariables rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF] cursor-pointer`}

                                    required
                                />
                                  

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
                                                            <td className="border px-4 py-2">{param.variable?.name || 'N/A'}</td>

                                                            <td className="border px-4 py-2">{param.min_normal_value}</td>
                                                            <td className="border px-4 py-2">{param.max_normal_value}</td>
                                                            <td className="border px-4 py-2">{param.min_limit}</td>
                                                            <td className="border px-4 py-2">{param.max_limit}</td>
                                                            <td className="border px-4 py-2">
                                                                <button
                                                                    type='button'
                                                                    onClick={() => handleEditClick(stageIndex, paramIndex)}
                                                                    className="text-[#168C0DFF] hover:text-[#0F6A06] px-2 py-2 rounded"
                                                                >
                                                                    <Edit size={20} />
                                                                </button>
                                                                <button
                                                                    type='button'
                                                                    onClick={() => handleDeleteClick(param.id)}
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
                        <button type="submit" className="bg-[#168C0DFF]  text-white px-4 py-2 rounded border border-white">Guardar</button>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="bg-[#345246] text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Añadir Parámetro</h2>
                            <button onClick={handleCloseModal} className="text-white hover:text-gray-200">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
                                <p className="font-bold">Recomendación:</p>
                                <p>
                                    Para poder crear un parámetro es necesario haber creado una variable antes, ya que se debe seleccionar la variable que se va a parametrizar.
                                </p>
                            </div>

                            <label htmlFor="variable" className="block text-sm font-medium text-gray-700 mb-1">Variable</label>
                            <select
                                id="variable"
                                name="variable"
                                value={newParameter.variable}
                                onChange={(e) => handleParameterChange(e, 'variable')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">Selecciona una opción</option>
                                {variables?.map((variable) => (
                                    <option key={variable.id} value={variable.id}>{variable.name}</option>
                                ))}
                            </select>
                            {fieldErrors.variable && (
                                <p className="text-red-500 text-sm mt-1">{fieldErrors.variable}</p>
                            )}

                            <div className="grid grid-cols-2 gap-4 mt-4">
                                {['min_normal_value', 'max_normal_value', 'min_limit', 'max_limit'].map((field) => (
                                    <div key={field}>
                                        <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                                            {field === 'min_normal_value' && 'Valor mínimo normal'}
                                            {field === 'max_normal_value' && 'Valor máximo normal'}
                                            {field === 'min_limit' && 'Límite mínimo'}
                                            {field === 'max_limit' && 'Límite máximo'}
                                        </label>
                                        <input
                                            type="number"
                                            id={field}
                                            value={newParameter[field]}
                                            onChange={(e) => handleParameterChange(e, field)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                        />
                                        {fieldErrors[field] && (
                                            <p className="text-red-500 text-sm mt-1">{fieldErrors[field]}</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                        </div>

                        <div className="bg-gray-50 px-2 py-2 sm:flex sm:flex-row-reverse">
                            <button
                                type='button'
                                onClick={handleSaveParameter}
                                className="m-1 inline-flex justify-end rounded-md border border-transparent shadow-sm px-4 py-1 bg-[#168C0DFF] text-base font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Guardar
                            </button>
                            <button
                                onClick={handleCloseModal}
                                className="m-1 inline-flex justify-end rounded-md border border-gray-300 shadow-sm px-4 py-1 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                    
                </div>

            )}
 {showErrorAlert && (
          <div className="alert alert-danger p-4 rounded-md text-red-600">
          {messageAlert}
      </div>
  )}
  {showSuccessAlert && (
                        <SuccessAlert message="Especie Editada exitosamente" />
                    )}


        </form>

    );
};

export default EditarLista;


