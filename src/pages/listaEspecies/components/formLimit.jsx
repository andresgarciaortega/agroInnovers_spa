import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import VaiableService from "../../../services/variableService";

const FormLimit = ({ isOpen, onClose, onSave, selectedParameter }) => {
  const [errors, setErrors] = useState({});
  const [variables, setVariables] = useState([]);
  const [parameter, setParameter] = useState({
    variable: "",
    minNormal: "",
    maxNormal: "",
    minLimit: "",
    maxLimit: "",
  });

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

    if (selectedParameter) {
      setParameter(selectedParameter);
    } else {
      resetForm();
    }
  }, [selectedParameter]);

  const resetForm = () => {
    setParameter({
      variable: "",
      minNormal: "",
      maxNormal: "",
      minLimit: "",
      maxLimit: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParameter((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!parameter.variable) newErrors.variable = "La variable es obligatoria";
    if (!parameter.minNormal) newErrors.minNormal = "El valor mínimo normal es obligatorio";
    if (!parameter.maxNormal) newErrors.maxNormal = "El valor máximo normal es obligatorio";
    if (!parameter.minLimit) newErrors.minLimit = "El límite mínimo es obligatorio";
    if (!parameter.maxLimit) newErrors.maxLimit = "El límite máximo es obligatorio";

    // Validar números negativos
    if (parameter.minNormal < 0) newErrors.minNormal = "El valor mínimo no puede ser negativo";
    if (parameter.maxNormal < 0) newErrors.maxNormal = "El valor máximo no puede ser negativo";
    if (parameter.minLimit < 0) newErrors.minLimit = "El límite mínimo no puede ser negativo";
    if (parameter.maxLimit < 0) newErrors.maxLimit = "El límite máximo no puede ser negativo";

    // Validar que el valor mínimo sea menor que el valor máximo
    if (parseFloat(parameter.minNormal) > parseFloat(parameter.maxNormal)) {
      newErrors.minNormal = "El valor mínimo debe ser menor al valor máximo";
    }
    if (parseFloat(parameter.minLimit) > parseFloat(parameter.maxLimit)) {
      newErrors.minLimit = "El límite mínimo debe ser menor al límite máximo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (!isOpen) return null;

  const handleSave = () => {
    if (validateForm()) {
      onSave(parameter);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-green-700 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {selectedParameter ? "Editar Parámetro" : "Añadir Parámetro"}
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
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
                className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 cursor-pointer ${errors.variable ? "border-red-500" : "text-gray-500"}`}
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
              {/* Campos de entrada */}
              {["minNormal", "maxNormal", "minLimit", "maxLimit"].map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
                    {field === "minNormal" && "Valor mínimo normal"}
                    {field === "maxNormal" && "Valor máximo normal"}
                    {field === "minLimit" && "Límite mínimo"}
                    {field === "maxLimit" && "Límite máximo"}
                  </label>
                  <input
                    type="number"
                    id={field}
                    name={field}
                    value={parameter[field]}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${errors[field] ? "border-red-500" : ""}`}
                  />
                  {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                </div>
              ))}
            </div>
            {Object.keys(errors).some((key) => errors[key]) && (
              <p className="text-red-500 text-xs mt-1">Corrige los errores antes de guardar.</p>
            )}
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-700 text-base font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={handleSave}
            disabled={!validateForm()} // Deshabilitar el botón si hay errores
          >
            {selectedParameter ? "Actualizar" : "Guardar"}
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
