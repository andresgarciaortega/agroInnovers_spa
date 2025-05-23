import React, { useEffect, useState } from 'react';
import { IoCloudUploadOutline } from "react-icons/io5";
import VariableTypeService from '../../../services/VariableType';
import CompanyService from '../../../services/CompanyService';
import { useCompanyContext } from '../../../context/CompanyContext';
import LoadingView from '../../../components/Loading/loadingView';
import useUploadToS3 from '../../../store/cargaDocument';

const FormTypeVariable = ({ showErrorAlert, onUpdate, typevariable, mode, closeModal }) => {
  const companySeleector = JSON.parse(localStorage.getItem("selectedCompany"));
  const [isLoading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [messageAlert, setMessageAlert] = useState("");
  const [showAlertError, setShowAlertError] = useState(false);
  const { uploadFile } = useUploadToS3(); // Usamos el hook

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: null,
    idCompany: companySeleector.value || '',
  });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await CompanyService.getAllCompany();
        setCompanies(data);
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    fetchCompany();
  }, []);





















  useEffect(() => {
    if (mode === 'edit' || mode === 'view') {
      setFormData({
        name: typevariable.name || '',
        description: typevariable.description || '',
        icon: typevariable.icon || null,
        idCompany: typevariable.company_id,
      });
      setImagePreview(typevariable.icon);
    } else {
      setFormData({
        name: '',
        description: '',
        icon: '',
        idCompany: companySeleector.value || '',
      });
    }
  }, [typevariable, mode, companySeleector.value]);



  useEffect(() => {

  }, [])



















  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  
  const handleCompanyChange = (e) => {
    const selectedCompanyId = parseInt(e.target.value, 10);
    setFormData({
      ...formData,
      idCompany: selectedCompanyId,
    });
  };


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     let iconUrl = '';
  //     // Si se ha seleccionado una nueva imagen
  //     if (formData.icon.name) {
  //       // Subir la nueva imagen a S3 y obtener la URL
  //       iconUrl = await UploadToS3(formData.icon);
  //     } else {
  //       // Si no se seleccionó una nueva imagen y estamos en modo edición, mantener la URL de la imagen existente
  //       iconUrl = typevariable.icon;
  //     }


  //     const formDataToSubmit = {
  //       name: formData.name,
  //       description: formData.description,
  //       icon: iconUrl,
  //       company_id: parseInt(formData.idCompany, 10), 
  //     };


  //     if (mode === 'create') {
  //       await VariableTypeService.createTypeVariable(formDataToSubmit);
  //       showErrorAlert("Variable creada");
  //     } else if (mode === 'edit') {
  //       await VariableTypeService.updateTypeVariable(typevariable.id, formDataToSubmit);
  //       showErrorAlert("Variable actualizada");
  //     }

  //     onUpdate();
  //     closeModal();
  //   } catch (error) {
  //     console.error("Error en la solicitud:", error);
  //     setMessageAlert("Hubo un error al guardar.");
  //     setShowAlertError(true);
  //   }
  // };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    // 📌 Obtener la fecha y hora actual en formato 'YYYY-MM-DD HH:mm:ss'
    const now = getCurrentDateTime();
    try {
      let iconUrl = '';

      // Si se ha seleccionado una nueva imagen
      if (formData.icon?.name) {
        // Subir la nueva imagen a S3 y obtener la URL
        iconUrl = await uploadFile(formData.icon);
      } else {
        // Si no se seleccionó una nueva imagen y estamos en modo edición, mantener la URL de la imagen existente
        iconUrl = typevariable.icon || 'https://www.shutterstock.com/image-vector/default-image-icon-vector-missing-260nw-2086941550.jpg';
      }

      // Preparar los datos para enviar
      const formDataToSubmit = {
        name: formData.name,
        description: formData.description,
        icon: iconUrl,
        company_id: parseInt(formData.idCompany, 10),
        updated_at: now // 🔥 Agregar la fecha actual
      };


      // Clave del localStorage
      const cacheKey = 'cache_/type-variables';
      let cacheData = JSON.parse(localStorage.getItem(cacheKey)) || { data: [] };

      if (mode === 'create') {
        // Crear un nuevo tipo de variable
        const createdVariableType = await VariableTypeService.createTypeVariable(formDataToSubmit);
        // Agregar el nuevo tipo de variable a la lista
        cacheData.data.push(createdVariableType);
        setIsLoading(false)
        showErrorAlert("Variable creada");
      } else if (mode === 'edit') {
        // Actualizar un tipo de variable existente
        const updatedVariableType = await VariableTypeService.updateTypeVariable(typevariable.id, formDataToSubmit);
        // Buscar el tipo de variable a actualizar
        const variableTypeIndex = cacheData.data.findIndex((vt) => vt.id === typevariable.id);

        if (variableTypeIndex !== -1) {
          // Fusionar los campos actualizados con los campos existentes
          cacheData.data[variableTypeIndex] = {
            ...cacheData.data[variableTypeIndex], // Campos existentes
            ...updatedVariableType, // Campos actualizados
          };
        }
        setIsLoading(false)
        showErrorAlert("Variable actualizada");
      }

      // Guardar la lista actualizada en el localStorage
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));

      // Actualizar la lista de tipos de variable en la interfaz
      onUpdate();

      // Cerrar el modal
      closeModal();
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setMessageAlert("Hubo un error al guardar.");
      setShowAlertError(true);
    }
  };





  const [imagePreview, setImagePreview] = useState(null);

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
  const formDataToSubmit = {
    ...formData,
    company_id: parseInt(formData.idCompany, 10), // Cambia la clave a company_id

  };
  delete formDataToSubmit.idCompany; // Elimina idCompany si no es necesario


  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {isLoading ? (
        <LoadingView />
      ) : (
        <>


          <div className="mb-4">
            <label>Adjuntar Icono</label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-0 text-center cursor-pointer hover:bg-gray-50"
              onClick={() => document.getElementById('icon-upload').click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Icono" className="mx-auto h-20 object-contain" />
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
              id="icon-upload"
              type="file"
              className="hidden"
              onChange={handleIconUpload}
              accept="image/*"

              disabled={mode === 'view'} />
          </div>

          <div className="flex space-x-4 w-full">
            <div className="w-1/2">
              <label htmlFor="typevariable-name" className="block text-sm font-medium text-gray-700">Nombre variable</label>
              <input
                type="text"
                id="typevariable-name"
                name="name"
                placeholder="Nombre Variable"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
                disabled={mode === 'view'}
              />
            </div>

            {/* <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Empresa</label>
          <select
            name="company"
            value={formData.idCompany || ''}
            onChange={handleCompanyChange}
            required
            disabled={mode === 'view'}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="" disabled>Seleccione una opción</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div> */}
          </div>

          <div className="col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Descripción del tipo de variable"
              readOnly={mode === 'view'}
            ></textarea>
          </div>

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

        </>
      )}

    </form>
  );
};

export default FormTypeVariable;
