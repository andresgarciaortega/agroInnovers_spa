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
import { useCompanyContext } from '../../../context/CompanyContext';
import { Trash, Edit, Factory, Variable, Activity, Cpu, Users } from 'lucide-react';
import SuccessAlert from "../../../components/alerts/success";
import useUploadToS3 from '../../../store/cargaDocument';
import LoadingView from '../../../components/Loading/loadingView';
import ErrorAlert from '../../../components/alerts/error';


const CrearListas = () => {
  const navigate = useNavigate();
  const { uploadFile } = useUploadToS3(); // Usamos el hook

  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
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
  const [companies, setCompanies] = useState(null);
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
    // { id: 1, description: '', time_to_production: 0, parameters: [] },
  ]);


  const [isLoading, setIsLoading] = useState(true);
  // const [idcompanyLST, setIdcompanyLST] = useState(JSON.parse(localStorage.getItem('selectedCompany')));
  const [Role, setRole] = useState(JSON.parse(localStorage.getItem('rol')));
  const [idcompanyLST, setIdcompanyLST] = useState(() => {
    return JSON.parse(localStorage.getItem("selectedCompany")) || { value: "", label: "" };
  });
  const [companyId, setCompanyId] = useState(idcompanyLST.value); // Asegurar que el valor inicial sea el correcto
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

  };


  useEffect(() => {
    hiddenSelect(true)
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
    setIsLoading(true)
    const fetchData = async () => {
      try {

        const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : '';

        const categories = await CategoryService.getAllCategory(companyId);
        setCategories(categories.data);

        if (!categories.data || categories.statusCode == 400) {
          setIsLoading(false)
          setShowAlertError(true);
          setMessageAlert(`No se tiene registro de categorias`);
          setTimeout(() => {
            navigate('/home/listaEspecie')
            setShowErrorAlert(false);
          }, 2500);

        }
        const variables = await VaiableService.getAllVariable(companyId);
        setVariables(variables);
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchData();
  }, [selectedCompanyUniversal]);


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

  useEffect(() => {
    if (showSuccessAlert) {
    }
  }, [showSuccessAlert]);

  const handleVariableChange = (e) => {
    const { value } = e.target;
    setSelectedVariables(value);
  };

  const handleNextStep = () => {
    const { category, subcategory, scientificName, commonName, variable, image, description, company_id } = formData;

    let newErrors = {};

    if (!category) newErrors.category = 'Este campo es obligatorio';
    if (!subcategory) newErrors.subcategory = 'Este campo es obligatorio';
    if (!scientificName) newErrors.scientificName = 'Este campo es obligatorio';
    if (!commonName) newErrors.commonName = 'Este campo es obligatorio';
    if (!variable || variable.length === 0) newErrors.variable = 'Este campo es obligatorio';
    if (!image) newErrors.image = 'Este campo es obligatorio';
    if (!description) newErrors.description = 'Este campo es obligatorio';

    // Check if company is required based on role
    if (Role.label === "SUPER-ADMINISTRADOR") {
      if (!company_id && !selectedCompanyUniversal?.value) {
        newErrors.company_id = 'Este campo es obligatorio';
      }
    }

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
    const stage = stages.find(stage => stage.id === stageId);
    if (!stage.parameters) {
      stage.parameters = [];
    }
    setSelectedStageId(stageId);
    setIsModalOpen(true);
  };

  // const handleOpenModal = (stageId) => {
  //   // Asegúrate de que estás accediendo correctamente al estado 'stage'
  //   const selectedStage = stages?.find((s) => s.id === stageId); // Usamos "stage?" para evitar errores si es undefined

  //   if (!selectedStage) {
  //     console.error("No se encontró la etapa con ID:", stageId);
  //     return;
  //   }

  //   if (!selectedStage.parameters) {
  //     selectedStage.parameters = [];
  //   }

  //   setCurrentStageId(stageId);
  //   setIsModalOpen(true);
  // };



  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewParameter({
      variable: '',
      min_normal_value: '',
      max_normal_value: '',
      min_limit: '',
      max_limit: '',
    });
    setSelectedParameterIndex(null); // Limpiar el índice del parámetro seleccionado
    setErrorMessage('');
  };

  const [selectedParameterIndex, setSelectedParameterIndex] = useState(null);


  const handleEditClick = (stageIndex, paramIndex) => {
    // Obtener el parámetro seleccionado
    const stage = stages[stageIndex];
    const parameter = stage.parameters[paramIndex];

    // Guardar la información actual del parámetro en el estado `newParameter`
    setNewParameter({
      variable: parameter.variable.id,
      min_normal_value: parameter.min_normal_value,
      max_normal_value: parameter.max_normal_value,
      min_limit: parameter.min_limit,
      max_limit: parameter.max_limit,
    });

    // Guardar la etapa y el índice del parámetro que se está editando
    setSelectedStageId(stage.id);
    setSelectedParameterIndex(paramIndex);
    setIsModalOpen(true); // Abrir el modal para editar
  };




  // const handleDeleteClick = (paramId) => {
  //   setFormData((prevData) => {
  //     return {
  //       ...prevData,
  //       stage: prevData.stage.map((stage) => ({
  //         ...stage,
  //         parameters: stage.parameters.filter((param) => param.id !== paramId),  // Compara con paramId
  //       })),
  //     };
  //   });
  // };

  useEffect(() => {
    setStages(formData.stage);
  }, [formData.stage]);


  const handleSaveParameter = () => {
    // Limpiar errores previos
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

    // Validar que el valor mínimo normal no sea mayor que el valor máximo normal
    if (minNormalValue > maxNormalValue) {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        min_normal_value: 'El valor mínimo normal no puede ser mayor que el valor máximo normal.',
        max_normal_value: 'El valor mínimo normal no puede ser mayor que el valor máximo normal.',
      }));
      hasError = true;
    }

    // Validar que el límite mínimo no sea mayor que el límite máximo
    if (minLimit > maxLimit) {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        min_limit: 'El límite mínimo no puede ser mayor que el límite máximo.',
        max_limit: 'El límite mínimo no puede ser mayor que el límite máximo.',
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

    // Buscar la variable seleccionada
    const selectedVariable = variables.find((v) => v.id === Number(newParameter.variable));
    if (!selectedVariable) {
      setErrorMessage("Variable seleccionada no encontrada.");
      return;
    }

    // Verificar si la variable ya tiene parámetros creados
    const variableHasParameters = stages.some((stage) => {
      return (
        stage.id === selectedStageId && // ✅ Validar que sea el mismo stage
        stage.parameters?.some((param) => param.variable.id === selectedVariable.id) // ✅ Misma variable
      );
    });

    if (variableHasParameters) {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        variable: 'Ya hay parámetros creados con esta variable.',
      }));
      return; // Evitar continuar si ya hay parámetros
    }

    // Crear el nuevo parámetro
    const newParam = {
      ...newParameter,
      variable: selectedVariable,
    };

    // Actualizar el estado de `stages`
    setStages((prevStages) => {
      return prevStages.map((stage) => {
        if (stage.id === selectedStageId) {
          return {
            ...stage,
            parameters: [...(stage.parameters || []), newParam], // Agregar el nuevo parámetro
          };
        }
        return stage;
      });
    });

    // Cerrar el modal y limpiar el formulario
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

  // Sincronizar `stages` con `formData`
  useEffect(() => {
    setStages(formData.stage);
  }, [formData.stage]);

  // Eliminar parámetro
  // const handleDeleteClick = (paramId) => {
  //   setStages((prevStages) => {
  //     return prevStages.map((stage) => {
  //       if (stage.id === selectedStageId) {
  //         return {
  //           ...stage,
  //           parameters: stage.parameters.filter((param) => param.id !== paramId),
  //         };
  //       }
  //       return stage;
  //     });
  //   });
  // };

  // const handleDeleteClick = (stageIndex, paramId) => {
  //   setStages((prevStages) => {
  //     return prevStages.map((stage, index) => {
  //       if (index === stageIndex) {
  //         return {
  //           ...stage,
  //           parameters: stage.parameters.filter((param) => param.id !== paramId),
  //         };
  //       }
  //       return stage;
  //     });
  //   });
  // };

  const handleDeleteClick = (stageIndex, paramIndex, param) => {
    setStages((prevStages) => {
      return prevStages.map((stage, index) => {
        if (index === stageIndex) {
          const updatedParameters = [...stage.parameters]; // Copia el array de parámetros
          updatedParameters.splice(paramIndex, 1); // Elimina el parámetro en la posición correcta
          return {
            ...stage,
            parameters: updatedParameters,
          };
        }
        return stage;
      });
    });
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
  // const showErrorAlert = (message) => {
  //   console.error(message);
  // };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true)
    try {
      let imageUrl = 'https://www.shutterstock.com/image-vector/default-image-icon-vector-missing-260nw-2086941550.jpg';
      if (formData.image) {
        imageUrl = await uploadFile(formData.image);
      }

      // Get company ID from either universal context or form data
      const companyId = selectedCompanyUniversal?.value || formData.company_id;

      // Validate company selection for super admin
      if (Role.label === "SUPER-ADMINISTRADOR" && !companyId) {
        setShowErrorAlert(true);
        setMessageAlert("Debe seleccionar una empresa");
        return;
      }

      const selectedVariables = formData.variable || [];
      const categoryId = isNaN(formData.category) ? 0 : parseInt(formData.category, 10);
      const subcategoryId = isNaN(formData.subcategory) ? 0 : parseInt(formData.subcategory, 10);

      const updatedStages = stages.map(stage => ({
        stage_id: stage.id,
        description: stage.description,
        time_to_production: isNaN(stage.time_to_production) ? 0 : parseInt(stage.time_to_production, 10),
        parameters: (stage.parameters || []).map(param => ({
          variable_id: param?.variable?.id && !isNaN(parseInt(param.variable.id, 10))
            ? parseInt(param.variable.id, 10)
            : 0,
          min_normal_value: isNaN(param.min_normal_value) ? 0 : parseInt(param.min_normal_value, 10),
          max_normal_value: isNaN(param.max_normal_value) ? 0 : parseInt(param.max_normal_value, 10),
          min_limit: isNaN(param.min_limit) ? 0 : parseInt(param.min_limit, 10),
          max_limit: isNaN(param.max_limit) ? 0 : parseInt(param.max_limit, 10)
        }))
      }));

      const formDataToSubmit = {
        scientific_name: formData.scientificName,
        common_name: formData.commonName,
        description: formData.description,
        photo: imageUrl,
        category_id: categoryId,
        subcategory_id: subcategoryId,
        company_id: parseInt(companyId, 10), // Use the selected company ID
        stages: updatedStages,
        variables: selectedVariables
      };

      const createdSpecie = await SpeciesService.createSpecie(formDataToSubmit);
      setIsLoading(false)
      showErrorAlertSuccess("Creada");
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 2500);
      setTimeout(() => {
        navigate('../ListaEspecie');
      }, 3000);

    } catch (error) {
      setIsLoading(false)
      console.error("Error:", error);
      setShowErrorAlert(true);
      setMessageAlert("Error al crear la especie");
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

  const showErrorAlertSuccess = (message) => {
    setShowErrorAlert(true);
    setMessageAlert(`Especie ${message} exitosamente`);

    setTimeout(() => {
      setShowErrorAlert(false);
    }, 2500);
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
  }

  const [showAlertError, setShowAlertError] = useState(false);

  const handleCloseAlert = () => {
    setShowAlertError(false);
  };




  return (
    <>
      {isLoading ? (
        <LoadingView />
      ) : (
        <>
          <form onSubmit={handleSubmit} className="p-">
            <div className="container mx-auto py-2">
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
                        {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                      </div>





                      {Role.label == "SUPER-ADMINISTRADOR" ? (
                        <>
                          <div className="col-span-2">
                            <label htmlFor="company_id" className="block text-sm font-medium text-gray-700 mb-1">
                              Empresa
                            </label>
                            <select
                              id="company_id"
                              name="company_id"
                              value={selectedCompanyUniversal?.value || formData.company_id}
                              onChange={handleChange}
                              className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF] cursor-pointer ${errors.company_id ? 'border-red-500' : 'text-gray-500'}`}
                            >
                              <option value="" className="text-gray-500">Selecciona una opción</option>
                              {companies?.map((company_id) => (
                                <option
                                  key={company_id.id}
                                  value={company_id.id || idcompanyLST?.value || ""}
                                  selected={company_id.id === Number(selectedCompanyUniversal?.value)}
                                >
                                  {company_id.name}
                                </option>
                              ))}
                            </select>
                            {errors.empresa && <p className="text-red-500 text-xs mt-1">{errors.empresa}</p>}
                          </div>
                        </>) : ''
                      }

















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
                            {stages
                              .sort((a, b) => a.id - b.id)
                              .map((stage, stageIndex) => (
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
                                    <div className="w-1/2 p-1">
                                      <label className="text-sm font-medium text-gray-700">Descripción</label>
                                      <input
                                        type="text"
                                        placeholder="Descripción de la etapa"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        onChange={(e) => handleStageChange(stageIndex, 'description', e.target.value)}
                                        
                                      />
                                    </div>
                                    <div className="w-1/2 p-1">
                                      <label className="text-sm font-medium text-gray-700">Tiempo de Producción</label>
                                      <input
                                        type="number"
                                        placeholder="Tiempo de producción en días"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        value={stages[stageIndex]?.time_to_production || ''}
                                        onChange={(e) => handleStageChange(stageIndex, 'time_to_production', e.target.value)}
                                      />

                                    </div>
                                    {/* <h1>arreglo : {stage?.parameters?.length}</h1> */}
                                  </div>

                                  <ul className="space-y-2 mt-4">
                                    {stage?.parameters?.length > 0 && (
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
                                            {stage.parameters?.map((param, paramIndex) => (
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
                                                    onClick={() => handleDeleteClick(stageIndex, paramIndex, param)}
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
                      type='button'

                      onClick={handlePrevStep}
                      className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 mb-1 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#168C0DFF]"
                    >
                      Anterior
                    </button>
                  )}

                  {step < 1 && (
                    <button
                      type='button'
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
              {showErrorAlert && (
                <div className="alert alert-danger p-4 rounded-md text-red-600">
                  {messageAlert}
                </div>
              )}
              {showSuccessAlert && (
                <SuccessAlert message="Especie creada exitosamente" />
              )}
            </div>

            {showAlertError && (
              <ErrorAlert
                message={messageAlert}
                onCancel={handleCloseAlert}
              />
            )}


          </form>
        </>
      )}
    </>

  );
};

export default CrearListas;


