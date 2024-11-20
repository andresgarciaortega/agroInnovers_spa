import React, { useEffect, useState } from 'react';

import { IoCloudUploadOutline } from "react-icons/io5";
import CompanyService from '../../../services/CompanyService';
import TypeDocumentsService from '../../../services/fetchTypes';
import Success from '../../../components/alerts/success';
import UploadToS3 from '../../../config/UploadToS3';
import ErrorAlert from '../../../components/alerts/error';



const FormCompany = ({ showSuccessAlert, onUpdate, company, mode, closeModal }) => {

  const [formData, setFormData] = useState({
    name: '',
    email_user_admin: '',
    phone: '',
    location: '',
    type_document_id: company.typeDocument?.id || '',
    nit: '',
    gps: "",
    email_billing: "",
    logo: ''
  });

  const [errorMessages, setErrorMessages] = useState({
    phone: ''
  });



  useEffect(() => {
    if (company && Object.keys(company).length > 0) {
      setFormData({
        ...company,
        type_document_id: company.typeDocument?.id || '' 
      });
    } else {
      console.warn("Prop 'company' está vacía o inválida:", company);
    }
  }, [company]);
  


  const [documentTypes, setDocumentTypes] = useState([]); 
  const [showAlertError, setShowAlertError] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  
  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const typeDocuments = await TypeDocumentsService.getAllTypeDocuments();
        const personaTypes = typeDocuments.filter(type => type.process === 'EMPRESA');
        setDocumentTypes(personaTypes);
      } catch (error) {
        console.error('Error al obtener tipos de documentos:', error);
      }
    };
  
    fetchDocumentTypes();
  
    if (mode === 'edit' || mode === 'view') {
      setFormData({
        ...company,
        type_document_id: company.typeDocument?.id || '' 
      });
      setImagePreview(company.logo);
      setIsButtonDisabled(false);
    } else {
      setFormData({
        name: '',
        email_user_admin: '',
        phone: '',
        location: '',
        type_document_id: '',
        nit: '',
        gps: "",
        email_billing: "",
        logo: ''
      });
    }
  }, [company, mode]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = '';

    if (name === 'phone') {
      if (!/^\d{10}$/.test(value)) {
        errorMessage = 'El celular debe tener diez dígitos numéricos';
        e.target.style.borderColor = 'red'; 
      } else {
        e.target.style.borderColor = ''; 
      }
    }

    // Actualiza el estado con los nuevos valores
    setFormData({
      ...formData,
      [name]: value
    });

    setErrorMessages({
      ...errorMessages,
      [name]: errorMessage
    });
  };
  useEffect(() => {
    if (mode !== 'edit') {
      // Función para habilitar/deshabilitar el botón de envío
      const isFormValid =
        formData.name &&
        formData.email_user_admin &&
        formData.phone &&
        formData.location &&
        formData.type_document_id &&
        formData.nit &&
        formData.gps &&
        formData.email_billing &&
        /^\d{10}$/.test(formData.phone) &&
        !Object.values(errorMessages).some((error) => error !== '');

      setIsButtonDisabled(!isFormValid);
    }
  }, [formData, errorMessages]);


  const handleDocumentBlur = async () => {
    if (mode !== 'edit') {
      const emailExisting = await CompanyService.getCompanyDocument(formData.nit);
      if (emailExisting) {
        setShowAlertError(true);
        setMessageAlert("Los sentimos! el documento ya esta registrado")
        setFormData({
          ...formData,
          nit: '' 
        });
        setTimeout(() => {
          setShowAlertError(false);
        }, 1500);
      }
    }
  }

  const handleEmilBlur = async () => {
    if (mode !== 'edit') {
      const emailExisting = await CompanyService.getFacturacionEmail(formData.email_user_admin);
      if (emailExisting) {
        setShowAlertError(true);
        setMessageAlert("Los sentimos! el email ya esta registrado")
        setFormData({
          ...formData,
          email_user_admin: '' 
        });
        setTimeout(() => {
          setShowAlertError(false);
        }, 1500);
      }
    }
  }


  const handleCloseAlert = () => {
    setShowAlertError(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación del celular
    const phoneRegex = /^[0-9]{10}$/; 
    if (!phoneRegex.test(formData.phone)) {
      setShowAlertError(true);
      setMessageAlert("El celular debe tener exactamente 10 dígitos.");
      setTimeout(() => {
        setShowAlertError(false);
      }, 1500);
      return;
    }
    try {
      let logoUrl = '';
      
      if (formData.logo.name) {
        
        logoUrl = await UploadToS3(formData.logo);
      } else {
        
        logoUrl = company.icon;
      }


      const formDataToSubmit = {
        ...formData,
        logo: logoUrl, 
        email: formData.email_user_admin,
        type_document_id: Number(formData.type_document_id)
      };

      if (mode === 'create') {
        const createdCompany = await CompanyService.createCompany(formDataToSubmit);
        showSuccessAlert("creada")
      } else if (mode === 'edit') {
        showSuccessAlert("Editada")
        const updatedCompany = await CompanyService.updateCompany(company.id, formDataToSubmit);
      }

      onUpdate();
      closeModal();
    } catch (error) {
      console.error('Error al guardar la empresa:', error);
    }
  };


  const [imagePreview, setImagePreview] = useState(null); 

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        logo: file, 
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
      <div className="mb- py-">
        <label>Adjuntar Logo</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-0 text-center cursor-pointer hover:bg-gray-50" onClick={() => document.getElementById('logo-upload').click()}>
          {imagePreview ? (
            <img src={imagePreview} alt="Company Logo" className="mx-auto h-20 object-contain" />
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
        <input id="logo-upload" type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre de la empresa</label>
          <input
            type="text"
            name="name"
            placeholder="Nombre de la empresa"
            value={formData.name}
            onChange={handleChange}
            disabled={mode === 'view'}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de documento</label>
          <select
            name="type_document_id"
            value={formData.type_document_id || ''}  // Asegúrate de que nunca sea undefined
            onChange={handleChange}
            disabled={mode === 'view'}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="" disabled>
              Selecciona una opción
            </option>
            {documentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Documento</label>
          <input
            type="text"
            name="nit"
            placeholder="Documento"
            value={formData.nit}
            onChange={handleChange}
            onBlur={handleDocumentBlur}
            disabled
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
          <input
            type="email"
            name="email_user_admin"
            placeholder="Correo electrónico"
            value={formData.email_user_admin}
            onChange={handleChange}
            onBlur={handleEmilBlur}
            disabled={mode === 'view'}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Celular</label>
          <input
            type="text"
            name="phone"
            placeholder="Celular"
            value={formData.phone}
            onChange={handleChange}
            disabled={mode === 'view'}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {errorMessages.phone && <p className="text-red-500 text-sm">{errorMessages.phone}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Dirección</label>
          <input
            type="text"
            name="location"
            placeholder="Dirección"
            value={formData.location}
            onChange={handleChange}
            disabled={mode === 'view'}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Posición GPS</label>
          <input
            type="text"
            name="gps"
            placeholder="Posición GPS"
            value={formData.gps}
            onChange={handleChange}
            disabled={mode === 'view'}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email de facturación</label>
          <input
            type="text"
            name="email_billing"
            placeholder="Email de facturación"
            value={formData.email_billing}
            onChange={handleChange}
            disabled={mode === 'view'}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

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
              disabled={isButtonDisabled}
              className={`${isButtonDisabled
                ? 'bg-[#168C0DFF] text-gray-100 cursor-not-allowed '
                : 'bg-[#168C0DFF] text-white hover:bg-[#146A0D] '
                } px-4 py-2 rounded`}
            >
              {mode === 'create' ? "Crear Empresa" : "Guardar Cambios"}
            </button>
          </>
        )}
      </div>

      {showAlertError && (
        <ErrorAlert
          message={messageAlert}
          onCancel={handleCloseAlert}
        />
      )}
    </form>
  );
};

export default FormCompany;
