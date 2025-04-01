import React, { useEffect, useState } from 'react';
import { IoCloudUploadOutline } from "react-icons/io5";
import TipoEspacioService from '../../../services/tipoEspacio';
import VariableTypeService from '../../../services/VariableType';
import RegistrerTypeServices from '../../../services/RegistrerType';
import CompanyService from '../../../services/CompanyService';
import { useCompanyContext } from '../../../context/CompanyContext';
import useUploadToS3 from '../../../store/cargaDocument';
import LoadingView from '../../../components/Loading/loadingView';

const FormTipo = ({ selectedCompany, showErrorAlert, onUpdate, variable, mode, closeModal, companyId }) => {
  const companySeleector = JSON.parse(localStorage.getItem("selectedCompany"));
  const { uploadFile } = useUploadToS3(); // Usamos el hook

  const [variableTypes, setVariableTypes] = useState([]);
  const [registerTypes, setRegisterTypes] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [isDashboard, setIsDashboard] = useState(false);
  const [isIncrement, setIsIncrement] = useState(false);
  const [formData, setFormData] = useState({
    spaceTypeName: '',
    icon: '',
    description: '',
    company_id: companySeleector.value || ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    setIsLoading(false)
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
        spaceTypeName: variable.spaceTypeName || '',
        icon: variable.icon || '',
        description: variable.description || '',

        company_id: variable.company_id
      });
      setImagePreview(variable.icon);
      setIsLoading(false)
    } else {
      setFormData({
        spaceTypeName: '',
        icon: '',
        description: '',

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
    setIsLoading(true)

    try {
      // Verificar si se ha seleccionado una nueva imagen
      let logoUrl = '';
      if (formData.icon.name) {
        logoUrl = await uploadFile(formData.icon);
      } else if (mode === 'edit' && variable.icon) {
        logoUrl = variable.icon;
      }

      // Crear el objeto de datos a enviar
      const formDataToSubmit = {
        ...formData,
        icon: logoUrl || 'https://www.shutterstock.com/image-vector/default-image-icon-vector-missing-260nw-2086941550.jpg',
        spaceTypeName: formData.spaceTypeName,
        description: formData.description,
        company_id: Number(companyId) || Number(formData.company_id),
      };

      if (mode === 'create') {
        await TipoEspacioService.createtipoEspacio(formDataToSubmit);
        setIsLoading(false)
        showErrorAlert("creado");
      } else if (mode === 'edit') {
        await TipoEspacioService.updatetipoEspacio(variable.id, formDataToSubmit);
        setIsLoading(false)
        showErrorAlert("editado");
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
    <>
      {isLoading ? (
        <LoadingView />
      ) : (
        <>
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
              <input
                id="logo-upload"
                type="file"
                className="hidden"
                disabled={mode === 'view'}
                onChange={handleIconUpload} accept="image/*" />
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

            <div>
              <label htmlFor="spaceTypeName" className="block text-sm font-medium text-gray-700">Nombre tipo de espacio</label>
              <input
                type="text"
                id="spaceTypeName"
                name="spaceTypeName"
                placeholder="Nombre tipo de espacio"
                value={formData.spaceTypeName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
                disabled={mode === 'view'}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                type="text"
                id="description"
                name="description"
                placeholder="Descripción"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
                disabled={mode === 'view'}
              />
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
                    {mode === 'create' ? 'Crear tipo de espacio' : 'Guardar Cambios'}

                  </button>
                </>
              )}
            </div>
          </form>
        </>
      )
      }
    </>
  );
};

export default FormTipo;
