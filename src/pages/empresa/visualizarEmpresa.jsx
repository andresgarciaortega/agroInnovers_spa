import React, { useEffect, useState } from 'react';
import { IoCloudUploadOutline } from "react-icons/io5";
import CompanyService from "../../services/CompanyService";
import TypeDocumentsService from '../../services/fetchTypes';
import GenericModal from '../../components/genericModal';
import FormCompany from './FormCompany/formCompany';
import { useParams, useNavigate } from 'react-router-dom'; 
import { IoArrowBack } from 'react-icons/io5';
import UserService from "../../services/UserService";
import Sistema from "../../services/monitoreo";
import variableService from "../../services/variableService";
import VariableType from "../../services/VariableType";
import ActuadorService from "../../services/ActuadorService";
import SensorService from "../../services/SensorService";
import TypeDispositivoService from "../../services/TypeDispositivosService";
import tipoEspacio from "../../services/tipoEspacio";
import espacios from "../../services/espacios";
import SpeciesService from "../../services/SpeciesService";
import CategoryService from "../../services/CategoryService";
import lotesService from "../../services/lotesService";
import { Package2, Factory, Variable, Activity, Cpu, Users } from 'lucide-react';
import { useCompanyContext } from "../../context/CompanyContext";


const VisualizarEmpresa = ({ }) => {

  const { companyId } = useParams();
  const navigate = useNavigate(); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("edit");
  const [newCompany, setNewCompany] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [typeDocuments, setTypeDocuments] = useState([]);

  const [userCount, setUserCount] = useState(0);
    const [variableCount, setVariableCount] = useState(0);
    const [variableTypeCount, setVariableTypeCount] = useState(0);
    const [actuatorCount, setActuatorCount] = useState(0);
    const [actuatorTypeCount, setActuatorTypeCount] = useState(0);
    const [sensorCount, setSensorCount] = useState(0);
    const [sensorTypeCount, setSensorTypeCount] = useState(0);
    const [spaceCount, setSpaceCount] = useState(0);
    const [spaceTypeCount, setSpaceTypeCount] = useState(0);
    const [speciesCount, setSpeciesCount] = useState(0);
    const [categoryCount, setCategoryCount] = useState(0);
    const [sistema, setSistema] = useState(0);
    const [lotInProcessCount, setLotInProcessCount] = useState(0);
    const [harvestedLotCount, setHarvestedLotCount] = useState(0);
    const [rejectedLotCount, setRejectedLotCount] = useState(0);
    const [operarios, setOperarios] = useState([]);
    const [administrativos, setAdministrativos] = useState([]);
    const [superAdministrativos, setSuperAdministrativos] = useState([]);
  const { selectedCompanyUniversal, hiddenSelect } = useCompanyContext();

  const [formData, setFormData] = useState({
    name: '',
    email_user_admin: '',
    phone: '',
    location: '',
    type_document_id: 0,
    nit: '',
    gps: "",
    email_billing: "",
    logo: ''
  });

  useEffect(() => {
    fetchCompaniesData();
    fetchTypeDocumento();
    fetchTypeDocumento();
  }, []);

  const fetchCompaniesData = async () => {
    try {
      const data = await CompanyService.getCompanyById(companyId);
      setFormData(data);
      setNewCompany(data)
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };
 
  const fetchTypeDocumento = async () => {
    try {
      const data = await fectchTypes.getAllTypeDocuments();
      setFormData(data);
      setTypeDocument(data)
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  // Abrir el modal
  const handleOpenModal = async () => {
    try {
      await fetchCompaniesData(); // Asegurarte de que los datos están cargados
      setIsModalOpen(true);       // Abrir el modal
    } catch (error) {
      console.error("Error al abrir el modal:", error);
    }
  };

  useEffect(() => {
    hiddenSelect(false)
    const fetchData = async () => {
      try {
        // const companies = await CompanyService.getAllCompany();
        // setCompanyCount(companies.length);

        const users = await UserService.getAllUser(companyId);
        console.log("Usuarios obtenidos:", users);

        setOperarios(users.filter(user => user.roles.some(roles => roles.id === 3)).length);
        setAdministrativos(users.filter(user => user.roles.some(rol => rol.id === 2)).length);
        setSuperAdministrativos(users.filter(user => user.roles.some(rol => rol.id === 1)).length);

        setUserCount(users.length);

        console.log("Usuarios operarios:", operarios);
        console.log("Usuarios administrativos:", administrativos);
        console.log("Usuarios superadministrativos:", superAdministrativos);
        setUserCount(users.length);

        const variables = await variableService.getAllVariable(companyId);
        setVariableCount(variables.length);

        const variableTypes = await VariableType.getAllTypeVariable();
        setVariableTypeCount(variableTypes.length);
        console.log('tipos d evariable', variableTypeCount.name)

        const actuators = await ActuadorService.getAllActuador(companyId,{});
        setActuatorCount(actuators.length);

        const actuatorsType = await TypeDispositivoService.getAllActuador(companyId);
        setActuatorTypeCount(actuatorsType.length);

        const sistemas = await Sistema.getAllMonitories(companyId);
        setSistema(sistemas.length);
        console.log(sistemas,'sistemas')

        const sensors = await SensorService.getAllSensor(companyId, {});
        setSensorCount(sensors.length);

        const sensorsType = await TypeDispositivoService.getAllSensor(companyId);
        setSensorTypeCount(sensorsType.length);

        const spaces = await espacios.getAllEspacio(companyId);
        setSpaceCount(spaces.length);

        const spacesType = await tipoEspacio.getAlltipoEspacio(companyId);
        setSpaceTypeCount(spacesType.length);

        const species = await SpeciesService.getAllSpecie(companyId);
        setSpeciesCount(species.length);

        const categories = await CategoryService.getAllCategory(companyId);
        setCategoryCount(categories.length);

        const lots = await lotesService.getAllLots(companyId);
        setLotInProcessCount(lots.filter(lote => lote.status === 'Producción').length);
        setHarvestedLotCount(lots.filter(lote => lote.status === 'Cosechado').length);
        setRejectedLotCount(lots.filter(lote => lote.status === 'Rechazado').length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };


    fetchData(companyId);
  }, []);

  // Cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalMode('edit');
  };



  const showSuccessAlertSuccess = (message) => {
    setShowSuccessAlert(true)
    setMessageAlert(`Empresa ${message} exitosamente`);

    setTimeout(() => {
      setShowSuccessAlert(false)
    }, 2500);
  }

  // Función para actualizar la lista de empresas
  const updateCompanies = async () => {
    try {
      const data = await CompanyService.getCompanyById(companyId);
      setFormData(data);
      setNewCompany(data)
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };
 const handleGoBack = () => {
    navigate("../empresa");  // Redirige a la vista de 'empresa'
  };


  return (
    <div className="flex">
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
        <button 
          className="btn-volver  bottom-5 right-5  text-gray-300  hover:text-gray-500"
          onClick={handleGoBack}
          title="Volver"  // El texto que aparece al pasar el cursor
        >
          <IoArrowBack size={24} />  {/* El ícono de flecha */}
        </button>
          <div className="flex justify-between items-center mb-8">
            
            <h1 className="text-2xl font-bold">{formData.name} </h1>
            <button className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center" onClick={() => handleOpenModal()}>
              Editar empresa
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Nombre de la empresa</label>
                <input type="text" className="w-full p-2 border rounded" value={formData.name} readOnly />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Documento</label>
                <input type="text" className="w-full p-2 border rounded" value={formData.nit} readOnly />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Celular</label>
                <input type="text" className="w-full p-2 border rounded" value={formData.phone} readOnly />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Página URL</label>
                <input type="text" className="w-full p-2 border rounded" value={formData.gps} readOnly />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Tipo de documento</label>
                <select className="w-full p-2 border rounded" value={formData.type_document_id} disabled>
                  <option value="nit">NIT</option>
                  <option value="cc">Cédula</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Correo electrónico</label>
                <input type="email" className="w-full p-2 border rounded" value={formData.email_user_admin} readOnly />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Dirección</label>
                <input type="text" className="w-full p-2 border rounded" value={formData.location} readOnly />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email de facturación</label>
                <input type="email" className="w-full p-2 border rounded" value={formData.email_billing} readOnly />
              </div>
            </div>
          </div>
        
          

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border p-4 rounded-md  shadow-lg ">
              <div className="text-lg flex items-center gap-2 font-bold ">
                Lotes de producción 2024
              </div>
              <br />
              <div className="space-y-2">
                <div className="flex items-center ">

                  <span className="px-3 py-1 text-sm text-green-500 bg-green-100 rounded-md">{lotInProcessCount}</span>
                  <span className="text-sm text-muted-foreground">En proceso</span>
                </div>
                <div className="flex items-center ">
                  <span className="px-3 py-1 text-sm text-yellow-500 bg-yellow-100 rounded-md">{harvestedLotCount}</span>
                  <span className="text-sm text-muted-foreground">Cosechados</span>
                </div>
                <div className="flex items-center mt-5">
                  <span className="px-3 py-1 text-sm text-red-500 bg-red-100 r">{rejectedLotCount}</span> 
                  <span className="text-sm text-muted-foreground">Rechazado</span>

                </div>
                <br />

                <span className='font-semibold py-4'> Especies</span>
                <br />
                <span className='py-2'> Tilapia roja</span>

                <div className="text-sm text-muted-foreground px-3">

                  • 300.000 sembrados
                  <br />
                  • 280.000 cocechados
                  <br />
                  • 280.000 cocechados
                </div>
              </div>
            </div>

            <div className="border p-4 rounded-md shadow-lg ">
              <div className="text-lg flex items-center gap-2 font-bold ">
                Espacio de producción
              </div>
              <br />
              <div className="space-y-2">
                <span className='py-2 font-medium justify-between'>{spaceCount}</span>
                {/* <div className="flex items-center ">
                  <span className="px-3 py-1 text-sm text-green-500 bg-green-100 rounded-md">2</span>
                  <span className="text-sm text-muted-foreground">En producción</span>
                </div>
                <div className="flex items-center">
                  <span className="px-3 py-1 text-sm text-red-500 bg-red-100 rounded-md">1</span>
                  <span className="text-sm text-muted-foreground ">Sin producir</span>
                </div> */}
              </div>
              <div className="space-y-2 py-5">
                <span className='font-medium justify-between '>8 lagos de conencionales</span>
                <div className="flex items-center ">
                  <span className="px-3 py-1 text-sm text-green-500 bg-green-100 rounded-md">6</span>
                  <span className="text-sm text-muted-foreground">En producción</span>
                </div>
                <div className="flex items-center">
                  <span className="px-3 py-1 text-sm text-red-500 bg-red-100 rounded-md">1</span>
                  <span className="text-sm text-muted-foreground">Sin producir</span>
                </div>
              </div>
            </div>

            <div className="border p-4 rounded-md shadow-lg ">
              <div className="text-lg flex items-center gap-2 font-bold">
                Variables
              </div>
              <br />
              <div className="space-y-2">
                <div className="flex items-center  ">
                  <span className="px-3 py-1 text-sm text-blue-500 bg-blue-100 rounded-md">2</span>
                  <span className="text-sm text-muted-foreground">Variable de control</span>
                </div>
                <div className="flex items-center ">
                  <span className="px-3 py-1 text-sm text-blue-500 bg-blue-100 rounded-md">2</span>
                  <span className="text-sm text-muted-foreground">Variable de calidad</span>
                </div>
                <div className="flex items-center ">
                  <span className="px-3 py-1 text-sm text-blue-500 bg-blue-100 rounded-md">2</span>
                  <span className="text-sm text-muted-foreground">Variable de consumo</span>
                </div>
                <div className="flex items-center ">
                  <span className="px-3 py-1 text-sm text-blue-500 bg-blue-100 rounded-md">1</span>
                  <span className="text-sm text-muted-foreground">Variable de de residuo</span>
                </div>
              </div>
            </div>

            <div className="border p-4 rounded-md shadow-lg">
              <div className="text-lg flex items-center gap-2 font-bold">
                Sistema de monitoreo
              </div>
              <br />
              <div>
                <div className="flex items-center ">
                  <span className="px-3 py-1 text-sm  text-blue-500 bg-blue-100  rounded-md">{sistema}</span>
                  <span className="text-sm text-muted-foreground">Sistemas</span>
                </div>
              </div>
            </div>

            <div className="border p-4 rounded-md shadow-lg">
              <div className="text-lg flex items-center gap-2  font-bold">
                Dispositivos
              </div>
              <br />
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="px-3 py-1 text-sm text-blue-500 bg-blue-100 rounded-md">{sensorCount}</span>
                  <span className="text-sm text-muted-foreground">Sensores internos</span>
                </div>
                <div className="flex items-center">
                  <span className="px-3 py-1 text-sm text-blue-500 bg-blue-100 rounded-md">{actuatorCount}</span>
                  <span className="text-sm text-muted-foreground">Actuadores</span>
                </div>
              </div>
            </div>

            <div className="border p-4 rounded-md shadow-lg ">
              <div className="text-lg flex items-center gap-2 font-bold">
                Usuarios
              </div>
              <br />
              <div>
                <div className="flex items-center ">
                  <span className="px-3 py-1 text-sm text-blue-500 bg-blue-100 rounded-md">{administrativos}</span>
                  <span className="text-sm text-muted-foreground">Administradores de cuenta</span>
                </div>
                <div className="flex items-center ">
                  <span className="px-3 py-1 text-sm text-blue-500 bg-blue-100 rounded-md">{operarios}</span>
                  <span className="text-sm text-muted-foreground">Usuarios de operación</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <GenericModal
          title={modalMode === 'edit' ? 'Editar Empresa' : modalMode === 'view' ? 'Ver Empresa' : 'Añadir Empresa'}
          onClose={closeModal}>
          <FormCompany
            showSuccessAlert={showSuccessAlertSuccess}
            onUpdate={updateCompanies}
            company={newCompany}
            mode={modalMode}
            typeDocuments={typeDocuments}
            closeModal={closeModal} />
          {console.log(newCompany)}
        </GenericModal>
      )}
    </div>
  );
};

export default VisualizarEmpresa;
