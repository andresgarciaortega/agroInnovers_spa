import React, { useEffect, useState } from 'react';
import TypeDocumentsService from '../../../services/fetchTypes';
import CompanyService from '../../../services/CompanyService';
import UsersService from '../../../services/UserService';
import ErrorAlert from '../../../components/alerts/error';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import LoadingView from '../../../components/Loading/loadingView';

const FormUser = ({ showErrorAlert, onUpdate, user, mode, closeModal }) => {

  const companySeleector = JSON.parse(localStorage.getItem("selectedCompany"));


  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    registrationDate: '',
    typeDocument: '',
    company: companySeleector.value || '',
    document: '',
    roles: null,
    password: '',
    confirmPass: '',
    photo:'https://img.freepik.com/vector-premium/negocios-economia-global_24877-41082.jpg'
  });
  const [errorMessages, setErrorMessages] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
    password: '',
    confirmPass: ''
  });


  const [documentTypes, setDocumentTypes] = useState([]);
  const [usersTypes, setUsersTypes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [showAlertError, setShowAlertError] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  const [idcompanyLST, setIdcompanyLST] = useState(JSON.parse(localStorage.getItem('selectedCompany')));
  const [Role, setRole] = useState(JSON.parse(localStorage.getItem('rol')));


  useEffect(() => {
    setIsLoading(true);

    const fetchDocumentTypes = async () => {
      try {
        const types = await TypeDocumentsService.getAllTypeDocuments();
        const companies = await CompanyService.getAllCompany();
        const roles = await TypeDocumentsService.getAllTypeUsers();
        const personaTypes = types.filter(type => type.process === 'PERSONA');
        setDocumentTypes(personaTypes);
        setUsersTypes(roles?.data ? roles?.data : roles);
        setCompanies(companies);
        setIsLoading(false);

      } catch (error) {
        console.error('Error al obtener tipos de documentos:', error);
      }
    };

    fetchDocumentTypes();

    if (mode === 'edit' || mode === 'view') {
      // Verificar `typeDocument`
      const userTypeDocumentId = user.typeDocument?.id ?? user.type_document_id ?? '';

      // Verificar `roles`, que puede ser un array de objetos o de números
      const roleId = Array.isArray(user.roles)
        ? (typeof user.roles[0] === 'object' ? user.roles[0]?.id : user.roles[0])
        : '';

      // Verificar `company`, que puede venir como objeto o ID
      const companyId = user.company?.id ?? user.companies_id ?? '';

      setFormData({
        ...user,
        roles: roleId,
        typeDocument: userTypeDocumentId,
        company: companyId,
        password: user.password || '',
        confirmPass: user.password || ''
      });

    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        registrationDate: '',
        typeDocument: '',
        company: companySeleector.value || '',
        document: '',
        roles: '',
        password: '',
        confirmPass: '',
        photo:'https://img.freepik.com/vector-premium/negocios-economia-global_24877-41082.jpg'
      });
    }
  }, [user, mode]);

  const handlePasswordToggle = () => {
    setPasswordVisible(!passwordVisible);
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

    if (name === 'phone') {
      if (!/^\d{10}$/.test(value)) {
        errorMessage = 'El celular debe tener diez dígitos numéricos';
        e.target.style.borderColor = 'red';
      } else {
        e.target.style.borderColor = '';
      }
    }


    if (name === 'document') {
      if (!/^\d{8,10}$/.test(value)) {
        errorMessage = 'El documento debe tener entre 8 y 10 dígitos';
        e.target.style.borderColor = 'red';
      } else {
        e.target.style.borderColor = '';
      }
    }

    if (name === 'confirmPass' || name === 'password') {
      const updatedFormData = { ...formData, [name]: value };
      setFormData(updatedFormData);

      if (updatedFormData.password && updatedFormData.confirmPass) {
        if (updatedFormData.password !== updatedFormData.confirmPass) {
          errorMessage = 'Las contraseñas deben coincidir';
          document.querySelector('[name="password"]').style.borderColor = 'red';
          document.querySelector('[name="confirmPass"]').style.borderColor = 'red';
        } else {
          // Clear error if passwords match
          errorMessage = '';
          document.querySelector('[name="password"]').style.borderColor = '';
          document.querySelector('[name="confirmPass"]').style.borderColor = '';
        }
      }
    } else {

      setFormData({
        ...formData,
        [name]: value
      });
    }
    setErrorMessages({
      ...errorMessages,
      [name]: errorMessage
    });
  };

  const handleEmailBlur = async () => {
    if (mode !== 'edit') {
      const emailExisting = await UsersService.getUserEmail(formData.email);
      if (emailExisting.success) {
        setShowAlertError(true);
        setMessageAlert("Los sentimos! el email ya esta registrado")
        setFormData({
          ...formData,
          email: ''
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
      if (emailExisting.success) {
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
    setIsLoading(true);

    // 📌 Obtener la fecha y hora actual en formato 'YYYY-MM-DD HH:mm:ss'
    const now = getCurrentDateTime();

    const formattedData = {
      type_user_id: Number(formData.roles),
      type_document_id: Number(formData.typeDocument),
      companies_id: Number(formData.company),
      name: formData.name,
      phone: formData.phone.toString(),
      lastname: formData.lastname || " ",
      email: formData.email,
      password: mode === "create" ? formData.password : changePassword ? formData.password : user.password,
      document: formData.document,
      photo:'https://img.freepik.com/vector-premium/negocios-economia-global_24877-41082.jpg',
      roles: [Number(formData.roles)],
      updated_at: now // 🔥 Agregar la fecha actual
    };


    try {
      const cacheKey = "cache_/users?page=1&limit=10000&companyId=0";
      let cacheData = JSON.parse(localStorage.getItem(cacheKey)) || { data: [] };

      if (mode === "create") {
        // Crear un nuevo usuario
        const response = await UsersService.createUser(formattedData);
        cacheData.data.push(response);
        setIsLoading(false);
        showErrorAlert("Creado");

      } else if (mode === "edit") {
        // Actualizar usuario
        const updatedUser = await UsersService.updateUser(user.id, formattedData);
        const userIndex = cacheData.data.findIndex((u) => u.id === user.id);

        if (userIndex !== -1) {
          cacheData.data[userIndex] = { ...cacheData.data[userIndex], ...updatedUser, updated_at: now };
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        }
        setIsLoading(false);
        showErrorAlert("Editado");

      }

      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      onUpdate();
      closeModal();
    } catch (error) {
      const errorMessage = error.message || "Ocurrió un error inesperado.";
      setMessageAlert(error.message);
    }
  };

  const handleCloseAlert = () => {
    setShowAlertError(false);
  };

  const handleChangePasswordToggle = () => {
    setFormData({
      ...formData,
      password: '',
      confirmPass: ''
    });
    setChangePassword(!changePassword);
  };




  return (
    <>
      {isLoading ? <LoadingView /> : (
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
                disabled={mode === 'view' || mode === 'edit'}
                required

                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
              {errorMessages.email && <p className="text-red-500 text-sm">{errorMessages.email}</p>}
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
                name="document"
                placeholder="Documento"
                value={formData.document}
                disabled={mode === 'edit' || mode === 'view'} // Deshabilitar si mode es 'edit' o 'view'
                onChange={handleChange}
                onBlur={handleDocumentBlur}

                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
              {errorMessages.document && <p className="text-red-500 text-sm">{errorMessages.document}</p>}
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-gray-700">Empresa</label>
              <select
                name="company"
                value={formData.company}
                onChange={handleChange}
                disabled={mode === 'edit' || mode === 'view'} // Deshabilitar si mode es 'edit' o 'view'
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

            </div> */}
            {Role.label == "SUPER-ADMINISTRADOR" ? (
              <>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">Empresa</label>
                  <select
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                    disabled={mode === 'edit' || mode === 'view'} // Deshabilitar si mode es 'edit' o 'view'
                  >
                    <option value="">Seleccione una empresa</option>
                    {companies.map((type) => (
                      <option key={type.id} value={type.id}  selected={type.id === Number(idcompanyLST.value)}>
                        {type.name}
                      </option>
                    ))}

                  </select>
                </div>
              </>
            ) : ''}









            <div>
              <label className="block text-sm font-medium text-gray-700">Rol</label>
              <select
                name="roles"
                value={formData.roles}
                onChange={handleChange}
                disabled={mode === 'edit' || mode === 'view'} // Deshabilitar si mode es 'edit' o 'view'
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="" disabled >Seleccione un opción</option>
                {usersTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {mode === 'edit' && (
            <div className="mt-5 flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-3">Cambiar contraseña</span>
              <div
                className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-200 ease-in-out ${changePassword ? 'bg-[#168C0DFF]' : 'bg-gray-300'
                  } cursor-pointer`}
                onClick={handleChangePasswordToggle}
              >
                <span
                  className={`inline-block w-5 h-5 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${changePassword ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </div>
            </div>

          )}


          {(mode === 'create' || changePassword) && (
            <>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    required={mode === 'create' || changePassword}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                  <span
                    onClick={handlePasswordToggle}
                    className="absolute right-3 m-5 mr-6 -mt-7 cursor-pointer text-gray-500"
                  >
                    {passwordVisible ? <IoEyeOff /> : <IoEye />}
                  </span>
                  {errorMessages.password && <p className="text-red-500 text-sm">{errorMessages.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    name="confirmPass"
                    placeholder="Confirmar contraseña"
                    value={formData.confirmPass}
                    onChange={handleChange}
                    required={mode === 'create' || changePassword}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                  {errorMessages.confirmPass && <p className="text-red-500 text-sm">{errorMessages.confirmPass}</p>}
                </div>
              </div>


            </>

          )}


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
                {/* <button
              type="button"
              onClick={closeModal}
              className="bg-white text-gray-500 px-4 py-2 rounded border border-gray-400"
            >
              Cerrar
            </button>
            <button
              type="submit"
              disabled={mode === 'create' && isButtonDisabled}
              className={`${mode === 'create' && isButtonDisabled
                ? 'bg-[#168C0DFF] text-gray-100 cursor-not-allowed'
                : 'bg-[#168C0DFF] text-white hover:bg-[#146A0D]'
                } px-4 py-2 rounded`}
            >
              {mode === 'create' ? "Crear Usuario" : "Guardar Cambios"}
            </button>



          </> */}

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
                  {mode === 'create' ? 'Crear usuario' : 'Guardar Cambios'}

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
      )}
    </>
  );
};

export default FormUser;
