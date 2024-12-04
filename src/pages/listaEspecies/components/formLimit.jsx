import React, { useState, useEffect } from 'react'
import { ChevronDown, Upload, Plus, X } from 'lucide-react'
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import CategoryService from '../../../services/CategoryService';
import SubcategoryService from '../../../services/SubcategoryService';
import StagesService from '../../../services/StagesService';
import VaiableService from '../../../services/variableService';



const FormLimit = ({ isOpen, onClose, onSave }) => {
  const [errors, setErrors] = useState({});
  const [variables, setVariables] = useState([]);
  const [parameter, setParameter] = useState({
    variable: '',
    minNormal: '',
    maxNormal: '',
    minLimit: '',
    maxLimit: '',
    minAlertMessage: '',
    maxAlertMessage: ''
  });
  const [savedParameters, setSavedParameters] = useState([]); // Estado para guardar los parámetros

  useEffect(() => {
    const fetchData = async () => {
      try {
        const variables = await VaiableService.getAllVariable();
        setVariables(variables);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParameter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Guarda el parámetro en el estado de parámetros guardados
    setSavedParameters((prev) => [...prev, parameter]);
    onSave(parameter);
    setParameter({ // Limpiar el formulario
      variable: '',
      minNormal: '',
      maxNormal: '',
      minLimit: '',
      maxLimit: '',
      minAlertMessage: '',
      maxAlertMessage: ''
    });
    onClose();
  };

  if (!isOpen) return null;

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
              <label htmlFor="variable" className="block text-sm font-medium text-gray-700 mb-1">
                Variable
              </label>
              <select
                id="variable"
                name="variable"
                value={parameter.variable}
                onChange={handleChange}
                className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF] cursor-pointer ${errors.variable ? 'border-red-500' : 'text-gray-500'}`}
              >
                <option value="" className="text-gray-500">Selecciona una opción</option>
                {variables?.map((variable) => (
                  <option key={variable.id} value={variable.id}>
                    {variable.name}
                  </option>
                ))}
              </select>
              {errors.variable && <p className="text-red-500 text-xs mt-1">{errors.variable}</p>}
            </div>
           
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="minNormal" className="block text-sm font-medium text-gray-700 mb-1 mb-1">Valor mínimo normal</label>
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
                <label htmlFor="maxNormal" className="block text-sm font-medium text-gray-700 mb-1 mb-1">Valor máximo normal</label>
                <input
                  type="text"
                  id="maxNormal"
                  name="maxNormal"
                  value={parameter.maxNormal}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#168C0DFF] focus:border-green-500"
                />
              </div>
              <div>
                <label htmlFor="minLimit" className="block text-sm font-medium text-gray-700 mb-1 mb-1">Limite minimo</label>
                <input
                  type="text"
                  id="minLimit"
                  name="minLimit"
                  value={parameter.minLimit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#168C0DFF] focus:border-green-500"
                />
              </div>
              <div>
                <label htmlFor="maxLimit" className="block text-sm font-medium text-gray-700 mb-1 mb-1">Limite máximo</label>
                <input
                  type="text"
                  id="maxLimit"
                  name="maxLimit"
                  value={parameter.maxLimit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#168C0DFF] focus:border-green-500"
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
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 mb-1 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormLimit;
