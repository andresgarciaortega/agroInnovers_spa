import React, { useState ,useEffect} from 'react'
import { ChevronDown, Upload, Plus, X } from 'lucide-react'
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import CategoryService from '../../../services/CategoryService';
import VaiableService from '../../../services/variableService';



const ParameterModal = ({ isOpen, onClose, onSave }) => {
  const [parameter, setParameter] = useState({
    variable: '',
    minNormal: '',
    maxNormal: '',
    minLimit: '',
    maxLimit: '',
    minAlertMessage: '',
    maxAlertMessage: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setParameter(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    onSave(parameter)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-green-700 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-semibold">Añadir parámetros</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
            <p className="font-bold">Recomendación:</p>
            <p>Para poder crear un parámetro es necesario haber creado una variable antes, ya que se debe seleccionar la variable que se va a parametrizar.</p>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="variable" className="block text-sm font-medium text-gray-700 mb-1">Variable</label>
              <select
                id="variable"
                name="variable"
                value={parameter.variable}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#168C0DFF] focus:border-[#168C0DFF] sm:text-sm appearance-none bg-no-repeat bg-right pr-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundSize: '1.5em 1.5em'
                }}
              >
                <option value="">Seleccionar variable</option>
                {/* Add options here */}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="minNormal" className="block text-sm font-medium text-gray-700 mb-1">Valor mínimo normal</label>
                <input
                  type="text"
                  id="minNormal"
                  name="minNormal"
                  value={parameter.minNormal}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#168C0DFF] focus:border-[#168C0DFF]"
                />
              </div>
              <div>
                <label htmlFor="maxNormal" className="block text-sm font-medium text-gray-700 mb-1">Valor máximo normal</label>
                <input
                  type="text"
                  id="maxNormal"
                  name="maxNormal"
                  value={parameter.maxNormal}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#168C0DFF] focus:border-green-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="minLimit" className="block text-sm font-medium text-gray-700 mb-1">Límite mínimo</label>
                <input
                  type="text"
                  id="minLimit"
                  name="minLimit"
                  value={parameter.minLimit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label htmlFor="maxLimit" className="block text-sm font-medium text-gray-700 mb-1">Límite máximo</label>
                <input
                  type="text"
                  id="maxLimit"
                  name="maxLimit"
                  value={parameter.maxLimit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
         
          
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#168C0DFF] text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={handleSave}
          >
            Guardar
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
// o tu librería de stepper



import { FaCheckCircle } from 'react-icons/fa'; // Icono de verificación

const CrearListas = () => {
  const [step, setStep] = useState(0);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [variables, setVariables] = useState([]);
  const [selectedVariables, setSelectedVariables] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [parameters, setParameters] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    scientificName: '',
    commonName: '',
    variable: '',
    image: '',
    description: '',
  });

  useEffect(() => {
    CategoryService.getAllCategory().then((data) => {
      setCategories(data);
    });
    VaiableService.getAllVariable().then((data) => {
      setVariables(data);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'category') {
      CategoryService.getSubcategories(value).then((data) => {
        setSubcategories(data);
      });
    }
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

  return (
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
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Categoría
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 text-sm block w-full rounded-md text-gray-600  border-gray-500 shadow-sm focus:border-gray-500 focus:ring-gray-500 py-3"
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
                  onChange={handleChange}
                  className="mt-1 text-sm block w-full rounded-md text-gray-600 border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-3"
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

              <div>
                <label htmlFor="scientificName" className="block text-sm font-medium text-gray-700">
                  Nombre científico
                </label>
                <input
                  type="text"
                  id="scientificName"
                  name="scientificName"
                  value={formData.scientificName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="commonName" className="block text-sm font-medium text-gray-700">
                  Nombre común
                </label>
                <input
                  type="text"
                  id="commonName"
                  name="commonName"
                  value={formData.commonName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="variable" className="block text-sm font-medium text-gray-700">
                  Variables
                </label>
                <select
                  id="variable"
                  name="variable"
                  value={formData.variable}
                  onChange={handleVariableChange}
                  className="mt-1 text-sm block w-full rounded-md text-gray-600 border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-3"
                  required
                >
                  <option value="">Selecciona una opción</option>
                  {variables.map((variable) => (
                    <option key={variable.id} value={variable.id}>
                      {variable.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Imagen de especie</label>
              <div className="relative">
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image ? formData.image.name : ''}
                  readOnly
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#168C0DFF] focus:border-[#168C0DFF] cursor-pointer"
                  placeholder="Subir imagen" 
                  onClick={() => document.getElementById('image-upload')?.click()} 
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Upload className="h-5 w-5 text-gray-800" />
                </div>
              </div>
              <input
                id="image-upload"
                type="file"
                className="hidden "
                onChange="{handleImageUpload}"
                accept="image/*"
              />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#168C0DFF] focus:border-[#168C0DFF]"
                  placeholder="Descripción de la especie"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-2 gap-4 mt-5 border-spacing-2">
              <div>
                <button
                  onClick={handleOpenModal}
                  className="mb-2 inline-flex items-center px-3 py-2 border border-[#168C0DFF] text-sm leading-4 font-medium rounded-md text-[#168C0DFF] bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Añadir Parámetro
                </button>
              </div>

              <ul className="space-y-2 mt-4">
                {parameters.map((param, index) => (
                  <li key={index} className="border border-gray-300 rounded-md p-4">
                    <strong>Variable:</strong> {param.variable}, <strong>Min Normal:</strong> {param.minNormal}, <strong>Max Normal:</strong> {param.maxNormal}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-4">
  {step > 0 && (
    <button
      onClick={handlePrevStep}
      className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#168C0DFF]"
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
      onClick={() => alert('Finalizar')}
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
  );
};

export default CrearListas;


