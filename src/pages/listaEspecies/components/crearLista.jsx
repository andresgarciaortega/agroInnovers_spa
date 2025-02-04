import React, { useState, useEffect } from 'react'
import { ChevronDown, Upload, Plus, X } from 'lucide-react'
import CategoryService from '../../../services/CategoryService';
import VaiableService from '../../../services/variableService';
import CompanyService from '../../../services/CompanyService';
import ParameterModal from './formLimit';
import SpeciesService from '../../../services/SpeciesService';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { MenuItem, FormControl, Select, InputLabel, Checkbox, ListItemText } from '@mui/material';
import UploadToS3 from '../../../config/UploadToS3';
import { useCompanyContext } from '../../../context/CompanyContext';


const CrearListas = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const { selectedCompanyUniversal, hiddenSelect } = useCompanyContext();
  const [fieldErrors, setFieldErrors] = useState({
    min_normal_value: '',
    max_normal_value: '',
    min_limit: '',
    max_limit: '',
    variable: '',
  });
  const [image, setImage] = useState(null);
  const [selectedStageId, setSelectedStageId] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [step, setStep] = useState(0);
  const [companyId, setCompanies] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStageId, setCurrentStageId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategory, setSubcategory] = useState([]);
  const [variables, setVariables] = useState([]);
  const [selectedVariables, setSelectedVariables] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    variable: [],
    subcategory: 0,
    scientificName: '',
    company_id: 0,
    commonName: '',
    category: 0,
    image: null,
    description: '',
    stage: [],
    parameters: [],
  });

  const [newParameter, setNewParameter] = useState({
    variable: [],
    min_normal_value: '',
    max_normal_value: '',
    min_limit: '',
    max_limit: '',
  });
  const [stages, setStages] = useState([
    { id: 1, description: '', time_to_production: 0, parameters: [] },
  ]);


  const [selected, setSelected] = useState([]);
  const [formDataVariables, setFormDataVariables] = useState({
    variable: [], // Inicializa como un array vacío
  });

  const handleChangeCategory = (event) => {
    const { value } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      variable: value,
    }));


    setFormDataVariables((prevState) => ({
      ...prevState,
      variable: value, // Guarda los IDs seleccionados en el estado
    }));

    console.log(formDataVariables)
  };


  useEffect(() => {
    hiddenSelect(false)
    const fetchCompany = async () => {
      try {
        const data = await CompanyService.getAllCompany();
        setCompanies(data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    fetchCompany();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {

        const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : '';

        const categories = await CategoryService.getAllCategory(companyId);
        setCategories(categories);

        const variables = await VaiableService.getAllVariable();
        setVariables(variables);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchData();
  }, []);


  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "category") {
      try {

        const subcategory = await CategoryService.getCategoryById(value);
        setSubcategory(subcategory.subcategories);



        const stages = await CategoryService.getCategoryById(value);

        setStages(stages.stages);
      } catch (error) {
        console.error("Error fetching subcategory or stages:", error);
      }
    }
  };


  const handleVariableChange = (e) => {
    const { value } = e.target;
    setSelectedVariables(value);
  };

  const handleNextStep = () => {
    const { category, subcategory, scientificName, commonName, variable, image, description } = formData;

    let newErrors = {};

    // if (!category) newErrors.category = 'Este campo es obligatorio';
    // if (!subcategory) newErrors.subcategory = 'Este campo es obligatorio';
    // if (!scientificName) newErrors.scientificName = 'Este campo es obligatorio';
    // if (!commonName) newErrors.commonName = 'Este campo es obligatorio';
    // if (!variable) newErrors.variable = 'Este campo es obligatorio';
    // // if (!image) newErrors.image = 'Este campo es obligatorio';
    // if (!description) newErrors.description = 'Este campo es obligatorio';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStep((prev) => prev + 1);
  };


  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleOpenModal = (stageId) => {
    // Asegúrate de que estás accediendo correctamente al estado 'stage'
    const selectedStage = stages?.find((s) => s.id === stageId); // Usamos "stage?" para evitar errores si es undefined
    
    if (!selectedStage) {
        console.error("No se encontró la etapa con ID:", stageId);
        return;
    }

    if (!selectedStage.parameters) {
        selectedStage.parameters = [];
    }

    setCurrentStageId(stageId);
    setIsModalOpen(true);
};



  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const [selectedParameterIndex, setSelectedParameterIndex] = useState(null);


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

    // Dentro de handleSaveParameter, después de actualizar los parámetros:
setFormData((prevFormData) => {
    const updatedStages = prevFormData.stage.map((stage) => {
        if (stage.id === selectedStageId) {
            // Si hay parámetros nuevos, agréguelos
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
                // Si no hay parámetros previos, añádelo a la lista de parámetros
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



  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const showErrorAlert = (message) => {
    console.error(message);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let imageUrl = '';
      if (formData.image) {
        imageUrl = await UploadToS3(formData.image);
      }
      const parsedCompanyId = parseInt(formData.company_id, 10);

      const selectedVariables = formData.variable || [];
      const categoryId = isNaN(formData.category) ? 0 : parseInt(formData.category, 10);
      const subcategoryId = isNaN(formData.subcategory) ? 0 : parseInt(formData.subcategory, 10);


      const updatedStages = stages.map(stage => ({
        stage_id: stage.id,
        description: stage.description,
        time_to_production: isNaN(stage.time_to_production) ? 0 : parseInt(stage.time_to_production, 10),
        parameters: (stage.parameters || []).map(param => ({
          variable_id: param.variable_id,
          min_normal_value: param.min_normal_value,
          max_normal_value: param.max_normal_value,
          min_limit: param.min_limit,
          max_limit: param.max_limit
        }))
      }));

      const formDataToSubmit = {
        scientific_name: formData.scientificName,
        common_name: formData.commonName,
        description: formData.description,
        photo: imageUrl,
        category_id: categoryId,
        subcategory_id: subcategoryId,
        company_id: parsedCompanyId,
        stages: updatedStages,
        variables: selectedVariables
      };
      const createdSpecie = await SpeciesService.createSpecie(formDataToSubmit);
      navigate('../ListaEspecie');
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
    }
  }, [isModalOpen]);






  const [formattedStages, setFormattedStages] = useState([]);

  const formatStages = () => {
    const transformed = stages.map(stage => ({
      stage_id: stage.id,
      description: stage.description,
      time_to_production: stage.time_to_production,
    }));
    console.log(transformed)
    setFormattedStages(transformed);
  };
  // const handleParameterChange = (stageIndex, paramIndex, field, value) => {
  //   const updatedStages = [...stages];
  //   updatedStages[stageIndex].parameters[paramIndex][field] = value;
  //   setStages(updatedStages);
  // };

 const handleParameterChange = (e, field) => {
  const value = e.target.value;

  setNewParameter((prev) => ({
    ...prev,
    [field]: field === 'variable' ? [value] : value,
  }));

  console.log("newParameter 1: ", formData)
  console.log("newParameter : ", newParameter)
};

  const addParameterToStage = (stageIndex) => {
    const updatedStages = [...stages];
    const newParameter = {
      variable_id: '',
      min_normal_value: '',
      max_normal_value: '',
      min_limit: '',
      max_limit: ''
    };

    updatedStages[stageIndex].parameters.push(newParameter);
    setStages(updatedStages);
  };


  const handleAddStage = () => {

    setFormData
      ({
        ...formData,
        stage: [...formData.stage,
        { id: null, name: '', description: '' }]
      });
  };


  const handleRemoveStage = (index) => setFormData({
    ...formData, stage: formData.stage.filter((_, i) => i !== index)
  });

  const handleStageChange = (index, field, value) => {
    const updatedStages = [...stages];
    updatedStages[index][field] = value;
    setStages(updatedStages);
  };


  const verData = () => {
    const transformed = stages.map(stage => ({
      stage_id: stage.id,
      description: stage.description,
      time_to_production: stage.time_to_production,
    }));
    setFormattedStages(transformed);
    console.log(formattedStages)
  }
  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="container mx-auto p-8">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-semibold mb-6">Crear Lista de Especies</h2>

          <div className="flex flex-col mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className={`${step === 0 ? 'text-black font-bold' : 'text-black font-bold'} flex items-center`}>

                1.Creación de Parámetros de Producción
                {step > 0 && <FaCheckCircle className="text-[#168C0DFF]  m-1" />}
              </div>
              <div className={`${step === 1 ? 'text-black font-bold' : 'text-gray-500'}`}>
                2.Parámetros de Producción por Etapa
              </div>
            </div>

            <div className="flex items-center mb-6">
              <div className="flex items-center w-full">
                <div
                  className={`flex-grow h-1 ${step === 0 ? 'bg-[#168C0DFF]' : step > 0 ? 'bg-[#168C0DFF]' : 'bg-gray-300'}`}
                ></div>

                <div className="w-8 flex justify-center">
                  <div className="h-1 bg-transparent" />
                </div>

                <div
                  className={`w-[50%] h-1 ${step === 1 ? 'bg-[#168C0DFF]' : 'bg-gray-300'}`}
                ></div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {step === 0 && (

              <div className="grid grid-cols-2 gap-4 mt-5">

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF] cursor-pointer ${errors.category ? 'border-red-500' : 'text-gray-500'}`}
                  >
                    <option value="" className="text-gray-500">Selecciona una opción</option>
                    {categories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>


                <div>
                  <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategoría
                  </label>
                  <select
                    id="subcategory"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF] cursor-pointer ${errors.subcategory ? 'border-red-500' : 'text-gray-500'}`}
                  >
                    <option value="" className="text-gray-500">Selecciona una opción</option>
                    {subcategory?.length > 0 && subcategory.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                  {errors.subcategory && <p className="text-red-500 text-xs mt-1">{errors.subcategory}</p>}
                </div>

                <div>
                  <label htmlFor="scientificName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre científico
                  </label>
                  <input
                    type="text"
                    id="scientificName"
                    name="scientificName"
                    placeholder="Nombre científico"
                    value={formData.scientificName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF] cursor-pointer ${errors.scientificName ? 'border-red-500' : ''}`}
                  />
                  {errors.scientificName && <p className="text-red-500 text-xs mt-1">{errors.scientificName}</p>}
                </div>

                <div>
                  <label htmlFor="commonName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre común
                  </label>
                  <input
                    type="text"
                    id="commonName"
                    name="commonName"
                    placeholder="Nombre común"
                    value={formData.commonName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF] cursor-pointer ${errors.commonName ? 'border-red-500' : ''}`}
                  />
                  {errors.commonName && <p className="text-red-500 text-xs mt-1">{errors.commonName}</p>}
                </div>
                <div>
                  <label htmlFor="variable" className="block text-sm font-medium text-gray-700 mb-1">
                    Variable
                  </label>
                  <FormControl
                    className={`w-full px-3 py-2 pr-10 border border-gray-300 selectorMultipleVariables rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF] cursor-pointer ${errors.variable ? 'border-red-500' : 'text-gray-500'
                      }`}
                  >
                    <Select
                      className='selectorMultipleVariables'
                      multiple
                      value={formData.variable || []}
                      onChange={handleChangeCategory}
                      renderValue={(selectedIds) =>
                        variables
                          .filter((option) => selectedIds.includes(option.id))
                          .map((option) => option.name)
                          .join(', ')
                      }
                    >
                      {variables.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          <Checkbox checked={formData.variable?.includes(option.id)} />
                          <ListItemText primary={option.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>


                </div>
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700  mb-1">Imagen de especie</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="image"
                      name="image"
                      value={formData.image ? formData.image.name : ''}
                      readOnly
                      className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF] cursor-pointer ${errors.image ? 'border-red-500' : ''}`}
                      placeholder="Subir imagen"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Upload className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden "
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                  {errors.variable && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                </div>

                <div className="col-span-2">
                  <label htmlFor="company_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Empresa
                  </label>
                  <select
                    id="company_id"
                    name="company_id"
                    value={formData.company_id}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF] cursor-pointer ${errors.company_id ? 'border-red-500' : 'text-gray-500'}`}
                  >
                    <option value="" className="text-gray-500">Selecciona una opción</option>
                    {companyId?.map((company_id) => (
                      <option key={company_id.id} value={company_id.id}>
                        {company_id.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>
                <div className="col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF] cursor-pointer ${errors.description ? 'border-red-500' : ''}`}
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-1 gap-4 mt-5 border-spacing-2">
                <div>
                  <div className="mt-4">
                    <label htmlFor="stages" className="block text-sm font-medium text-gray-700 mb-1">
                      Etapas
                    </label>
                    <div className="space-y-4">
                      {stages.map((stage, stageIndex) => (
                        <div key={stageIndex} className="mt-4 border-2 border-gray-400 rounded-md p-4 w-full">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-semibold text-gray-800">
                              {`Etapa ${stage?.name || 'Sin nombre'}`}

                            </h3>
                            <button
                              type='button'
                              onClick={() => handleOpenModal(stage.id)}
                              className="inline-flex items-center px-3 py-2 border border-[#168C0DFF] text-sm leading-4 font-medium rounded-md text-[#168C0DFF] bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Añadir Parámetro
                            </button>
                          </div>

                          <div className="flex justify-between mb-2">
                            <div className="w-1/2">
                              <label className="text-sm font-medium text-gray-700">Descripción</label>
                              <input
                                type="text"
                                placeholder="Descripción de la etapa"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                onChange={(e) => handleStageChange(stageIndex, 'description', e.target.value)}
                              />
                            </div>
                            <div className="w-1/2">
                              <label className="text-sm font-medium text-gray-700">Tiempo de Producción</label>
                              <input
                                type="number"
                                placeholder="Tiempo de producción"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                value={stages[stageIndex]?.time_to_production || ''}
                                onChange={(e) => handleStageChange(stageIndex, 'time_to_production', e.target.value)}
                              />

                            </div>
                          </div>

                          <ul className="space-y-2 mt-4">
    {stage.parameters && stage.parameters.length > 0 && (
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
                            <td className="border px-4 py-2">{param.variable.name}</td>
                            <td className="border px-4 py-2">{param.min_normal_value}</td>
                            <td className="border px-4 py-2">{param.max_normal_value}</td>
                            <td className="border px-4 py-2">{param.min_limit}</td>
                            <td className="border px-4 py-2">{param.max_limit}</td>
                            <td className="border px-4 py-2">
                                {/* Aquí puedes agregar botones para editar/eliminar parámetros */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )}
</ul>

                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
          <div className="mt-6 flex justify-end space-x-4">
            {step !== 1 && (
              <button
                onClick={() => navigate('../listaEspecie')}
                className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 mb- hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#168C0DFF]"
              >
                Cancelar
              </button>
            )}

            {step > 0 && (
              <button
                onClick={handlePrevStep}
                className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 mb-1 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#168C0DFF]"
              >
                Anterior
              </button>
            )}

            {step < 1 && (
              <button
                onClick={handleNextStep}
                className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#137B09FF] text-base font-medium text-white hover:bg-[#168C0DFF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#168C0DFF]"
              >
                Siguiente
              </button>
            )}

            {step === 1 && (
              <button
                onClick={verData}
                className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#137B09FF] text-base font-medium text-white hover:bg-[#168C0DFF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#168C0DFF]"
              >
                Finalizar
              </button>
            )}
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
                  {variables
                    ?.filter((variable) => formDataVariables.variable.includes(variable.id)) // Filtrar seleccionados
                    .map((variable) => (
                      <option key={variable.id} value={variable.id}>
                        {variable.name}
                      </option>
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

      </div>
    </form>
  );
};

export default CrearListas;


