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


const CrearListas = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
const [selectedStageId, setSelectedStageId] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [step, setStep] = useState(0);
  const [companyId, setCompanies] = useState(null);

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
<<<<<<< HEAD
    subcategory:0,
=======
    company_id: 0,
>>>>>>> 5cc22948cc31091a3b8d2e10983008b88145f0d6
    commonName: '',
    category: 0,
    image: null,
    description: '',
    stage: [],
    parameters: [],
  });
  const [stages, setStages] = useState();

  const [stagesJson, setStagesJson] = useState(
    {
      stage_id: '',
      description: '',
      time_to_production: '',
    }
  );


  const [selected, setSelected] = useState([]);

  const handleChangeCategory = (event) => {
    const { value } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      variable: value, // Actualiza `formData.variable` con los IDs seleccionados
    }));
  };


  useEffect(() => {
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
        const categories = await CategoryService.getAllCategory();
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

    // Si no hay errores, continuar al siguiente paso
    setStep((prev) => prev + 1);
  };


  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveParameter = (newParameter) => {
    setParameters((prev) => [...prev, newParameter]);
    console.log('Parámetro guardado:', parameter);
    setIsModalOpen(false);
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

      // Asegurarse de que category_id y subcategory_id sean enteros
      const categoryId = isNaN(formData.category) ? 0 : parseInt(formData.category, 10);
      const subcategoryId = isNaN(formData.subcategory) ? 0 : parseInt(formData.subcategory, 10);

      // Asegurarse de que time_to_production sea un número entero
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

      console.log('datos', formDataToSubmit);

      const createdSpecie = await SpeciesService.createSpecie(formDataToSubmit);
      console.log('crear especie', createdSpecie);
      console.log("especie creada exitosamente");
      navigate('../ListaEspecie');
  } catch (error) {
      console.error("Error:", error);
      console.log("Hubo un error al crear la especie");
  }
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

              {/* Separador en el centro */}
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
                  className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF] cursor-pointer ${errors.variable ? 'border-red-500' : 'text-gray-500'
                    }`}
                >
                  <Select
                    multiple
                    value={formData.variable || []} // Usa `formData.variable` como valor
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
                    {stages.map((stage, index) => (
                      <div key={index} className="mt-4 border-2 border-gray-400 rounded-md p-4 w-full">
                        {/* Título de la etapa y botón para añadir parámetros */}
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-sm font-semibold text-gray-800">
                            {`Etapa ${index + 1}`}
                          </h3>
                          <button
                            onClick={() => handleOpenModal}
                            className="inline-flex items-center px-3 py-2 border border-[#168C0DFF] text-sm leading-4 font-medium rounded-md text-[#168C0DFF] bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Añadir Parámetro
                          </button>
                        </div>

                        {/* Campos de descripción y tiempo de producción */}
                        <div className="flex justify-between mb-2">
                          <div className="w-1/2">
                            <label className="text-sm font-medium text-gray-700">Descripción</label>
                            <input
                              type="text"
                              placeholder="Descripción de la etapa"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              onChange={(e) => handleStageChange(index, 'description', e.target.value)}
                            />
                          </div>
                          <div className="w-1/2">
                            <label className="text-sm font-medium text-gray-700">Tiempo de Producción</label>
                            <input
                              type="number"
                              placeholder="Tiempo de producción"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              onChange={(e) => handleStageChange(index, 'time_to_production', e.target.value)}
                            />
                          </div>
                          <ul className="space-y-2 mt-4">
                          {stage.parameters && stage.parameters.map((parameter, paramIndex) => (
                  <li key={index} className="border border-gray-300 rounded-md p-4">
                    <strong>Variable:</strong> {param.variable}, <strong>Min Normal:</strong> {param.minNormal}, <strong>Max Normal:</strong> {param.maxNormal}
                  </li>
                ))}
              </ul>
                        </div>
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
        <ParameterModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveParameter}
        />
      )}
    </div>
    </form>
  );
};

export default CrearListas;


