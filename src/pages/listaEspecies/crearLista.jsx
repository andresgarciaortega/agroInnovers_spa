import React, { useState } from 'react'
import { ChevronDown, Upload, Plus, X } from 'lucide-react'
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

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
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none bg-no-repeat bg-right pr-10"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
            <div>
              <label htmlFor="minAlertMessage" className="block text-sm font-medium text-gray-700 mb-1">Mensaje alerta límite mínimo</label>
              <select
                id="minAlertMessage"
                name="minAlertMessage"
                value={parameter.minAlertMessage}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none bg-no-repeat bg-right pr-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundSize: '1.5em 1.5em'
                }}
              >
                <option value="">Seleccionar mensaje</option>
                {/* Add options here */}
              </select>
            </div>
            <div>
              <label htmlFor="maxAlertMessage" className="block text-sm font-medium text-gray-700 mb-1">Límite alerta límite máximo</label>
              <select
                id="maxAlertMessage"
                name="maxAlertMessage"
                value={parameter.maxAlertMessage}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none bg-no-repeat bg-right pr-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundSize: '1.5em 1.5em'
                }}
              >
                <option value="">Seleccionar mensaje</option>
                {/* Add options here */}
              </select>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
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

const CrearListas = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    scientificName: '',
    commonName: '',
    classification: '',
    parameterName: ''
  })
  const [isModalOpen, setModalOpen] = useState(false)
  const [parameters, setParameters] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNextStep = () => {
    setStep(prev => prev + 1)
  }

  const handlePrevStep = () => {
    setStep(prev => prev - 1)
  }

  const handleOpenModal = () => {
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  const handleSaveParameter = (newParameter) => {
    setParameters(prev => [...prev, newParameter])
  }
  const steps = [
    'Paso 1',
    'Paso 2',
  ];

  return (
    <div className="container mx-auto p-8">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-semibold mb-6">Crear Lista de Especies</h2>
        <div className="space-y-6">
        <Stepper className='text-green-500' activeStep={1} alternativeLabel>
  {steps.map((label) => (
    <Step key={label}>
      <StepLabel className=''>{label}</StepLabel>
    </Step>
  ))}
</Stepper>
          {step === 1 && (
            <div className="grid grid-cols-2 gap-4 mt-5">
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Categoría</label>
              <select
                id="unit"
                name="unit"
                value=""
                onChange=""
                className="mt-1 text-sm block w-full rounded-md text-gray-600 border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-3"
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="kg">Kilogramos</option>
                <option value="m">Metros</option>
                <option value="l">Litros</option>
                <option value="pcs">Piezas</option>
              </select>
            </div>
    
            <div>
              <label htmlFor="typerecord" className="block text-sm font-medium text-gray-700">Subcategoría</label>
              <select
                id="typerecord"
                name="typerecord"
                value=""
                onChange=""
                className="mt-1 text-sm block w-full rounded-md text-gray-600 border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-3"
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="automatico">Automático</option>
                <option value="manual">Manual</option>
              </select>
            </div>
              <div>
                <label htmlFor="company-name" className="block text-sm font-medium text-gray-700">Nombre cientifíco</label>
                <input 
                  type="text" 
                  id="company-name" 
                  name="unit" 
                  value=""
                  onChange=""
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" 
                  required 
                />
              </div>
              <div>
                <label htmlFor="company-email" className="block text-sm font-medium text-gray-700">Nombre común</label>
                <input 
                  type="email" 
                  id="company-email" 
                  name="typerecord" 
                  value=""
                  onChange=""
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" 
                  required 
                />
              </div>
              <div>
              <label htmlFor="typerecord" className="block text-sm font-medium text-gray-700">Variables</label>
              <select
                id="typerecord"
                name="typerecord"
                value=""
                onChange=""
                className="mt-1 text-sm block w-full rounded-md text-gray-600 border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-3"
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="automatico">Automático</option>
                <option value="manual">Manual</option>
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
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 cursor-pointer"
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
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value=""
                onChange="{handleInputChange}"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Descripción de la especie"
              ></textarea>
            </div>
            </div>
            
            
          )}
          {step === 2 && (
            <div className="grid grid-cols-2 gap-4 mt-5 border-spacing-2">
              <div>
                <label htmlFor="parameterName" className="block text-sm font-medium text-gray-700 mb-1">Nombre del parámetro</label>
                <input
                  type="text"
                  id="parameterName"
                  name="parameterName"
                  value={formData.parameterName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label htmlFor="parameterName" className="block text-sm font-medium text-gray-700 mb-1">Nombre del parámetro</label>
                <input
                  type="text"
                  id="parameterName"
                  name="parameterName"
                  value={formData.parameterName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <button
                  onClick={handleOpenModal}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
        <div className="mt-6 flex justify-between">
          {step > 1 && (
            <button
              onClick={handlePrevStep}
              className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Anterior
            </button>
          )}
          {step < 2 && (
            
            <button
              onClick={handleNextStep}
              className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Siguiente
            </button>
           
          )}
          
        </div>
      </div>

      <ParameterModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveParameter}
      />
    </div>
  )
}

export default CrearListas
