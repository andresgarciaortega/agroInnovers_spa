import React, { useEffect, useState } from 'react';
import { IoCloudUploadOutline } from "react-icons/io5";
import UploadToS3 from '../../../config/UploadToS3';
import VariablesService from '../../../services/variableService';
import VariableTypeService from '../../../services/VariableType';
import RegistrerTypeServices from '../../../services/RegistrerType';
import CompanyService from '../../../services/CompanyService';
import { useCompanyContext } from '../../../context/CompanyContext';

const FormVariable = ({ selectedCompany, showErrorAlert, onUpdate, variable, mode, closeModal, companyId }) => {
  const companySeleector = JSON.parse(localStorage.getItem("selectedCompany"));

  const [variableTypes, setVariableTypes] = useState([]);
  const [registerTypes, setRegisterTypes] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [isDashboard, setIsDashboard] = useState(false);
  const [isIncrement, setIsIncrement] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    unit_of_measurement: '',
    type_variable_id: '',
    type_register_id: '',
    informational_calculation: '',
    company_id: companySeleector.value || ''
  });


  const [unitsOfMeasurement] = useState([
    { id: 'Kilogramos (kg)', name: 'Kilogramos (kg)' },
    { id: 'Metros (m)', name: 'Metros (m)' },
    { id: 'Litros (L)', name: 'Litros (L)' },
    { id: 'Gramos (g)', name: 'Gramos (g)' },
  ]);
  const [informativeCalculations] = useState([
    { id: 'Promedio', name: 'Promedio' },
    { id: 'Suma', name: 'Suma' },
    { id: 'Máximo', name: 'Máximo' },
    { id: 'Mínimo', name: 'Mínimo' },
  ]);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchVariableTypes = async () => {
      try {

        const typeVariables = await VariableTypeService.getAllTypeVariable();
        setVariableTypes(typeVariables);
      } catch (error) {
        console.error('Error al obtener los tipos de variable:', error);
      }
    };

    const fetchRegisterTypes = async () => {
      try {
        const typeRegisters = await RegistrerTypeServices.getAllRegistrerType();
        setRegisterTypes(typeRegisters);
      } catch (error) {
        console.error('Error al obtener los tipos de registro:', error);
      }
    };

    const fetchCompanies = async () => {
      try {
        const fetchedCompanies = await CompanyService.getAllCompany();
        setCompanies(fetchedCompanies);
      } catch (error) {
        console.error('Error al obtener las empresas:', error);
      }
    };

    fetchVariableTypes();
    fetchRegisterTypes();
    fetchCompanies();
  }, []); // The empty dependency array ensures this only runs once when the component mounts.

  useEffect(() => {
    if (selectedCompany) {
      setFormData((prevData) => ({
        ...prevData,
        company_id: companySeleector.value || '' // Sincroniza selectedCompany con el formulario
      }));
    }
  }, [selectedCompany]); // This effect only runs when selectedCompany changes.

  useEffect(() => {
    if (mode === 'edit' || mode === 'view') {
      setFormData({
        name: variable.name || '',
        icon: variable.icon || '',
        unit_of_measurement: variable.unit_of_measurement || '',
        type_variable_id: variable.typeVariable?.id || '', // Asignación correcta del id de typeVariable
        type_register_id: variable.typeRegister?.id || '', // Asignación correcta del id de typeRegister
        informational_calculation: variable.informational_calculation || '',
        company_id: variable.company_id
      });

      setIsDashboard(variable.visible_in_dashboard);
      setIsIncrement(variable.is_incremental);
      setImagePreview(variable.icon);
    } else {
      setFormData({
        name: '',
        icon: '',
        unit_of_measurement: '',
        type_variable_id: '',
        type_register_id: '',
        informational_calculation: '',
        company_id: companySeleector.value || ''
      });
    }
  }, [variable, mode]); // This effect runs when variable or mode changes.



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Verificar si se ha seleccionado una nueva imagen
      let logoUrl = '';
      if (formData.icon.name) {
        logoUrl = await UploadToS3(formData.icon);
      } else if (mode === 'edit' && variable.icon) {
        logoUrl = variable.icon;
      }
  
      // Crear el objeto de datos a enviar
      const formDataToSubmit = {
        ...formData,
        icon: logoUrl || '',
        informational_calculation: formData.informational_calculation,
        type_variable_id: Number(formData.type_variable_id),
        type_register_id: Number(formData.type_register_id),
        is_incremental: isIncrement ? isIncrement : false, // Enviar nulo si no es incremental
        visible_in_dashboard: isDashboard,
        company_id: Number(companyId) || Number(formData.company_id),
      };
  
      if (mode === 'create') {
        await VariablesService.createVariable(formDataToSubmit);
        showErrorAlert("creada");
      } else if (mode === 'edit') {
        await VariablesService.updateVariable(variable.id, formDataToSubmit);
        showErrorAlert("editada");
      }
  
      onUpdate();
      closeModal();
    } catch (error) {
      console.error('Error al guardar la variable:', error);
      showErrorAlert("Hubo un error al guardar la variable.");
    }
  };
  



  // const showErrorAlert = (message) => {
  //   alert(message); // Muestra un mensaje de alerta
  // };


  const handleIconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        icon: file,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb- py-" disabled={mode === 'view'}>
        <label>Adjuntar Logo</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-0 text-center cursor-pointer hover:bg-gray-50" onClick={() => document.getElementById('logo-upload').click()}>
          {imagePreview ? (
            <img src={imagePreview} alt="Logo de Variable" className="mx-auto h-20 object-contain" />
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
        <input id="logo-upload" type="file" className="hidden" onChange={handleIconUpload} accept="image/*" />
      </div>

      <div>
        <label htmlFor="variable-name" className="block text-sm font-medium text-gray-700">Nombre variable</label>
        <input
          type="text"
          id="variable-name"
          name="name"
          placeholder="Nombre Variable"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
          disabled={mode === 'view'}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-5">
        <div>
          <label htmlFor="unit_of_measurement" className="block text-sm font-medium text-gray-700">Unidad de medida</label>
          <select
            name="unit_of_measurement"
            value={formData.unit_of_measurement}
            onChange={handleChange}
            disabled={mode === 'view'}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Seleccione una opción</option>
            {unitsOfMeasurement.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="type_register_id" className="block text-sm font-medium text-gray-700">Tipo de registro</label>
          <select
            id="type_register_id"
            name="type_register_id"
            value={formData.type_register_id}
            onChange={handleChange}
            disabled={mode === 'view'}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          >

            <option value="">Seleccione una opción</option>
            {registerTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <div >
          <label htmlFor="type_variable_id" className="block text-sm font-medium text-gray-700">Tipo de variable</label>
          <select
            id="type_variable_id"
            name="type_variable_id"
            value={formData.type_variable_id}
            onChange={handleChange}
            disabled={mode === 'view'}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Seleccione una opción</option>
            {variableTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <div >
          <label htmlFor="company_id" className="block text-sm font-medium text-gray-700">Empresa</label>
          <select
            id="company_id"
            name="company_id"
            value={formData.company_id}
            onChange={handleChange}
            disabled={mode === 'view'}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Seleccione una empresa</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
      </div>



      <div className="mt-5">
        <label htmlFor="informational_calculation" className="block text-sm font-medium text-gray-700">Cálculo informativo</label>
        <select
          id="informational_calculation"
          name="informational_calculation"
          value={formData.informational_calculation}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
          disabled={mode === 'view'}
        >
          <option value="">Seleccione una opción</option>
          {informativeCalculations.map((calc) => (
            <option key={calc.id} value={calc.id}>
              {calc.name}
            </option>
          ))}
        </select>
      </div>


      <div className="grid grid-cols-3 gap-4 mt-5">


        {/* ACIVACIÓN DE VISIBLE EN DASHBAODR */}
        <div className="mt-5 flex items-center">
          <span className="text-sm font-medium text-gray-700 mr-">Visible en Dashboard</span>
          <div
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ease-in-out duration-200 ${isDashboard ? 'bg-[#168C0DFF]' : 'bg-gray-300'
              } ${mode === 'view' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            onClick={() => {
              if (mode !== 'view') {
                setIsDashboard(!isDashboard);
              }
            }}
          >
            <span
              className={`inline-block w-5 h-5 transform rounded-full bg-white transition-transform ease-in-out duration-200 ${isDashboard ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
          </div>
        </div>

        {/* ACIVACIÓN DE ES INCREMENTAL */}

        {/* <div className="mt-5 flex items-center">
          <span className="text-sm font-medium text-gray-700 mr-3">Es incremental</span>
          <div
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ease-in-out duration-200 ${isIncrement ? 'bg-[#168C0DFF]' : 'bg-gray-300'
              } ${mode === 'view' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            onClick={() => {
              if (mode !== 'view') {
                setIsIncrement(!isIncrement);
              }
            }}
          >
            <span
              className={`inline-block w-5 h-5 transform rounded-full bg-white transition-transform ease-in-out duration-200 ${isIncrement ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
          </div>
        </div> */}
      </div>


      {/* BOTONES */}

      <div className="flex justify-end space-x-2">
        {mode === 'view' ? (
          <button
            type="button"
            onClick={closeModal}
            className="bg-white text-gray-500 px-4 py-2 rounded border border-gray-400"
          >
            Volver
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={closeModal}
              className="bg-white text-gray-500 px-4 py-2 rounded border border-gray-400"
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="bg-[#168C0DFF] text-white px-4 py-2 rounded"
            >
              {mode === 'create' ? 'Crear Variable' : 'Guardar Cambios'}

            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default FormVariable;
