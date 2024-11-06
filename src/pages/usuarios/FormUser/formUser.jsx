import React, { useEffect, useState } from 'react';
import TypeDocumentsService from '../../../services/fetchTypes';
import CompanyService from '../../../services/CompanyService';
import UsersService from '../../../services/UserService';
import ErrorAlert from '../../../components/alerts/error';
import { IoEye, IoEyeOff } from 'react-icons/io5';

const FormUser = ({ showErrorAlert, onUpdate, user, mode, closeModal }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    mobile: '',
    registrationDate: '',
    typeDocument: '',
    company: '',
    document: '',
    userType: null,
    password: '',
    confirmPass: ''
  });
  const [errorMessages, setErrorMessages] = useState({
    name: '',
    email: '',
    mobile: '',
    document: '',
    password: '',
    confirmPass: ''
  });


  const [documentTypes, setDocumentTypes] = useState([]); // Estado para los tipos de documentos
  const [usersTypes, setUsersTypes] = useState([]); // Estado para los tipos de usuarios
  const [companies, setCompanies] = useState([]); // Estado para los tipos de usuarios
  const [showAlertError, setShowAlertError] = useState(false); // Estado para los tipos de usuarios
  const [messageAlert, setMessageAlert] = useState(""); // Estado para los tipos de usuarios

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {

    const fetchDocumentTypes = async () => {
      try {
        const types = await TypeDocumentsService.getAllTypeDocuments();
        const companies = await CompanyService.getAllCompany();
        const typeUsers = await TypeDocumentsService.getAllTypeUsers();

        setDocumentTypes(types);
        setUsersTypes(typeUsers)
        setCompanies(companies)

      } catch (error) {
        console.error('Error al obtener tipos de documentos:', error);
      }
    };

    fetchDocumentTypes();


    if (mode === 'edit' || mode === 'view') {
      setFormData(user);
    } else {
      setFormData({
        name: '',
        email: '',
        mobile: '',
        registrationDate: '',
        typeDocument: '',
        company: '', // Asegúrate de que este campo esté vacío
        document: '',
        userType: '',
        password: '',
        confirmPass: ''
      });
    }
  }, [user, mode]);

  const handlePasswordToggle = () => {
    setPasswordVisible(!passwordVisible); // Alternar visibilidad
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let errorMessage = '';

    if (name === 'name') {
      if (/\d/.test(value)) {
        errorMessage = 'El nombre no puede llevar números';
        e.target.style.borderColor = 'red';
      } else {
        e.target.style.borderColor = '';
      }
    }

    if (name === 'mobile') {
      if (!/^\d{10}$/.test(value)) {
        errorMessage = 'El celular debe tener diez dígitos numéricos';
        e.target.style.borderColor = 'red';
      } else {
        e.target.style.borderColor = '';
      }
    }

    if (name === 'document') {
      if (!/^\d{8,12}$/.test(value)) {
        errorMessage = 'El documento debe tener entre 8 y 12 dígitos';
        e.target.style.borderColor = 'red';
      } else {
        e.target.style.borderColor = '';
      }
    }

    if (name === 'confirmPass' || name === 'password') {
      const updatedFormData = { ...formData, [name]: value };
      setFormData(updatedFormData);

      if (updatedFormData.password && updatedFormData.confirmPass && updatedFormData.password !== updatedFormData.confirmPass) {
        errorMessage = 'Las contraseñas deben coincidir';
        document.querySelector('[name="password"]').style.borderColor = 'red';
        document.querySelector('[name="confirmPass"]').style.borderColor = 'red';
      } else {
        document.querySelector('[name="password"]').style.borderColor = '';
        document.querySelector('[name="confirmPass"]').style.borderColor = '';
      }
    } else {

      setFormData({
        ...formData,
        [name]: value
      });
    }
    // Mostrar mensaje de error debajo del campo, si hay uno
    setErrorMessages({
      ...errorMessages,
      [name]: errorMessage
    });
  };
  // Lógica para habilitar/deshabilitar el botón de envío
  useEffect(() => {
    const isFormValid =
      formData.name &&
      formData.email &&
      formData.mobile &&
      formData.typeDocument &&
      formData.company &&
      formData.document &&
      formData.userType &&
      formData.password &&
      formData.confirmPass &&
      !Object.values(errorMessages).some((error) => error !== '');

    setIsButtonDisabled(!isFormValid);
  }, [formData, errorMessages]);

  const handleEmailBlur = async () => {
    if (mode !== 'edit') {
      const emailExisting = await UsersService.getUserEmail(formData.email);
      if (emailExisting) {
        setShowAlertError(true);
        setMessageAlert("Los sentimos! el email ya esta registrado")
        setFormData({
          ...formData,
          email: '' // Limpia el campo de email
        });
        setTimeout(() => {
          setShowAlertError(false);
        }, 1200);
      }
    }

  }

  const handleDocumentBlur = async () => {
    if (mode !== 'edit') {
      const emailExisting = await UsersService.getUserDocument(formData.document);
      if (emailExisting) {
        setShowAlertError(true);
        setMessageAlert("Los sentimos! el documento ya esta registrado")
        setFormData({
          ...formData,
          document: '' // Limpia el campo de email
        });
        setTimeout(() => {
          setShowAlertError(false);
        }, 1500);
      }
    }
  }


  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      type_user_id: Number(formData.userType),
      type_document_id: Number(formData.typeDocument),
      companies_id: Number(formData.company),
      name: formData.name,
      lastname: formData.lastname || " ", // Asegúrate de agregar el apellido en el formulario si es necesario
      email: formData.email,
      password: formData.password || "#Innov3rsHuil4", // Asegúrate de capturar la contraseña
      phone: formData.mobile,
      document: formData.document,
      photo: formData.photo || "https://example.com/photo.jpg", // Asegúrate de capturar la foto
      roles: formData.userType ? [Number(formData.userType)] : []// Ajusta esto según sea necesario
    };

    try {
      if (mode === 'create') {
        const response = await UsersService.createUser(formattedData);
        showErrorAlert("creada")
      } else if (mode === 'edit') {
        showErrorAlert("Editada")
        // Lógica para editar usuario
        await UsersService.updateUser(user.id, formData); // Editar usuario existente
      }

      onUpdate();
      closeModal();
    } catch (error) {
      const errorMessage = error.message || 'Ocurrió un error inesperado.';
      setMessageAlert(error.message)
    }
  };

  const handleCloseAlert = () => {
    setShowAlertError(false);
  };




  return (
    <form onSubmit={handleSubmit} className="space-y-4 ">
      <div className="border-gray-300 rounded-lg py-2   cursor-pointer mr-0">
        <label className="block text-sm font-medium text-gray-700 ">Nombre completo</label>
        <input
          type="text"
          name="name"
          placeholder="Nombre completo"
          value={formData.name}
          onChange={handleChange}
          disabled={mode === 'view'}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
        {errorMessages.name && <p className="text-red-500 text-sm">{errorMessages.name}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleEmailBlur}
            disabled={mode === 'view'}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {errorMessages.email && <p className="text-red-500 text-sm">{errorMessages.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Celular</label>
          <input
            type="text"
            name="mobile"
            placeholder="Celular"
            value={formData.phone}
            onChange={handleChange}
            disabled={mode === 'view'}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {errorMessages.mobile && <p className="text-red-500 text-sm">{errorMessages.mobile}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de documento</label>
          <select
            name="typeDocument"
            value={formData.typeDocument}
            onChange={handleChange}
            disabled={mode === 'view'}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="" disabled>Seleccione una opción</option>
            {documentTypes.map((type) => (
              <option key={type.id} value={type.id}> {/* Cambia `type.id` y `type.value` según tu respuesta */}
                {type.name} {/* Cambia `type.label` según tu respuesta */}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Documento</label>
          <input
            type="text"
            name="document"
            placeholder="Documento"
            value={formData.document}
            onChange={handleChange}
            onBlur={handleDocumentBlur}

            disabled={mode === 'view'}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {errorMessages.document && <p className="text-red-500 text-sm">{errorMessages.document}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Empresa</label>
          <select
            name="company"
            value={formData.company} // Asegúrate de que el valor esté ligado a formData
            onChange={handleChange}
            disabled={mode === 'view'}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="" disabled>Seleccione una opción</option>
            {companies.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>




        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Rol</label>
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            disabled={mode === 'view'}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="" disabled >Seleccione un opción</option>
            {usersTypes.map((type) => (
              <option key={type.id} value={type.id}> {/* Cambia `type.id` y `type.value` según tu respuesta */}
                {type.name} {/* Cambia `type.label` según tu respuesta */}
              </option>
            ))}
          </select>
        </div>
        <div className="border-gray-300 rounded-lg cursor-pointer mr-0">
          <label className="block text-sm font-medium text-gray-700 ">Contraseña</label>
          <div className="relative">
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              disabled={mode === 'view'}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 pr-10" // pr-10 para espacio para el icono
            />

            <button
              type="button"
              onClick={handlePasswordToggle}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
            >
              {passwordVisible ? <IoEyeOff /> : <IoEye />}
            </button>
          </div>
        </div>

        <div className="border-gray-300 rounded-lg cursor-pointer mr-0">
          <label className="block text-sm font-medium text-gray-700 ">Confirmar Contraseña</label>
          <div className="relative">
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="confirmPass"
              placeholder="Contraseña"
              value={formData.confirmPass}
              onChange={handleChange}
              disabled={mode === 'view'}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 pr-10" // pr-10 para espacio para el icono
            />
            {errorMessages.confirmPass && <p className="text-red-500 text-sm">{errorMessages.confirmPass}</p>}
            <button
              type="button"
              onClick={handlePasswordToggle}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
            >
              {passwordVisible ? <IoEyeOff /> : <IoEye />}
            </button>
          </div>
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
              {mode === 'create' ? "Crear Usuario" : "Guardar Cambios"}
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

export default FormUser;
