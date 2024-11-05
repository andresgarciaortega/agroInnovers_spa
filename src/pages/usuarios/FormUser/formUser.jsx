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
    userType: '',
    password: ''
  });

  const [documentTypes, setDocumentTypes] = useState([]); // Estado para los tipos de documentos
  const [usersTypes, setUsersTypes] = useState([]); // Estado para los tipos de usuarios
  const [companies, setCompanies] = useState([]); // Estado para los tipos de usuarios
  const [showAlertError, setShowAlertError] = useState(false); // Estado para los tipos de usuarios
  const [messageAlert, setMessageAlert] = useState(""); // Estado para los tipos de usuarios

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
        userType: '',
        typeDocument: '', // Inicializa aquí si no está en modo edición
      });
    }
  }, [user, mode]);

  const handlePasswordToggle = () => {
    setPasswordVisible(!passwordVisible); // Alternar visibilidad
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


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
      roles: [Number(formData.userType)]// Ajusta esto según sea necesario
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
            <option value="">Seleccione una opción</option>
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
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Empresa</label>
          {/* <input
            type="text"
            name="company"
            placeholder="Empresa"
            value={formData.company}
            onChange={handleChange}
            disabled={mode === 'view'}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          /> */}
          <select
            name="company"
            // value={formData.company.id}
            onChange={handleChange}
            disabled={mode === 'view'}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Seleccione una opción</option>
            {companies.map((type) => (
              <option key={type.id} value={type.id}> {/* Cambia `type.id` y `type.value` según tu respuesta */}
                {type.name} {/* Cambia `type.label` según tu respuesta */}
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
            <option value="">Seleccione un opción</option>
            {usersTypes.map((type) => (
              <option key={type.id} value={type.id}> {/* Cambia `type.id` y `type.value` según tu respuesta */}
                {type.name} {/* Cambia `type.label` según tu respuesta */}
              </option>
            ))}
          </select>
        </div>
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
