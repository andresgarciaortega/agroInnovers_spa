import React, { useEffect, useState } from "react";
import { Monitor, Cpu, Factory, Fish, Package, Variable } from 'lucide-react';
import { GlobeAsiaAustraliaIcon } from '@heroicons/react/24/outline';
import { HiOutlineUserGroup } from "react-icons/hi";
import { ImEqualizer2 } from "react-icons/im";
import { BsBox } from "react-icons/bs";
import { PiArrowsCounterClockwiseBold } from "react-icons/pi";
import { FaRegBuilding } from 'react-icons/fa';
import CompanyService from "../../services/CompanyService";
import UserService from "../../services/UserService";
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
import { useCompanyContext } from "../../context/CompanyContext";
import { useNavigate } from "react-router-dom";
import TypeDocumentsService from "../../services/fetchTypes";
import RegistrerTypeServices from "../../services/RegistrerType";

const Dashboard = () => {
  const [companyCount, setCompanyCount] = useState(0);
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
  const [lotInProcessCount, setLotInProcessCount] = useState(0);
  const [harvestedLotCount, setHarvestedLotCount] = useState(0);
  const [rejectedLotCount, setRejectedLotCount] = useState(0);
  const [operarios, setOperarios] = useState([]);
  const [administrativos, setAdministrativos] = useState([]);
  const [superAdministrativos, setSuperAdministrativos] = useState([]);
  const { selectedCompanyUniversal, hiddenSelect } = useCompanyContext();
  const navigate = useNavigate();

  useEffect(() => {
    hiddenSelect(false);
  
    const fetchData = async () => {
      try {
        const companies = await CompanyService.getAllCompany();
        setCompanyCount(companies.length);
        // localStorage.setItem('companies', JSON.stringify(companies)); // Guardar en localStorage
  
        const users = await UserService.getAllUser();
        setOperarios(users.filter(user => user.roles.some(roles => roles.id === 3)).length);
        setAdministrativos(users.filter(user => user.roles.some(rol => rol.id === 2)).length);
        setSuperAdministrativos(users.filter(user => user.roles.some(rol => rol.id === 1)).length);
        setUserCount(users.length);
        // localStorage.setItem('users', JSON.stringify(users)); // Guardar en localStorage
  
        const variables = await variableService.getAllVariable();
        setVariableCount(variables.length);
        // localStorage.setItem('variables', JSON.stringify(variables)); // Guardar en localStorage
  
        const variableTypes = await VariableType.getAllTypeVariable();
        setVariableTypeCount(variableTypes.length);
        // localStorage.setItem('variableTypes', JSON.stringify(variableTypes)); // Guardar en localStorage
  
        const actuators = await ActuadorService.getAllActuador(0, {});
        setActuatorCount(actuators.length);
        // localStorage.setItem('actuators', JSON.stringify(actuators)); // Guardar en localStorage
  
        const actuatorsType = await TypeDispositivoService.getAllActuador(0, {});
        setActuatorTypeCount(actuatorsType.length);
        // localStorage.setItem('actuatorsType', JSON.stringify(actuatorsType)); // Guardar en localStorage
  
        const sensors = await SensorService.getAllSensor(0, {});
        setSensorCount(sensors.length);
        // localStorage.setItem('sensors', JSON.stringify(sensors)); // Guardar en localStorage
  
        const sensorsType = await TypeDispositivoService.getAllSensor(0, {});
        setSensorTypeCount(sensorsType.length);
        // localStorage.setItem('sensorsType', JSON.stringify(sensorsType)); // Guardar en localStorage
  
        const spaces = await espacios.getAllEspacio();
        setSpaceCount(spaces.length);
        // localStorage.setItem('spaces', JSON.stringify(spaces)); // Guardar en localStorage
  
        const spacesType = await tipoEspacio.getAlltipoEspacio();
        setSpaceTypeCount(spacesType.length);
        // localStorage.setItem('spacesType', JSON.stringify(spacesType)); // Guardar en localStorage
  
        const species = await SpeciesService.getAllSpecie(0, {});
        setSpeciesCount(species.length);
        // localStorage.setItem('species', JSON.stringify(species)); // Guardar en localStorage
  
        const categories = await CategoryService.getAllCategory(0, {});
        setCategoryCount(categories.length);
        // localStorage.setItem('categories', JSON.stringify(categories)); // Guardar en localStorage
  
        const lots = await lotesService.getAllLots();
        setLotInProcessCount(lots.filter(lote => lote.status === 'Producción').length);
        setHarvestedLotCount(lots.filter(lote => lote.status === 'Cosechado').length);
        setRejectedLotCount(lots.filter(lote => lote.status === 'Rechazado').length);
        // localStorage.setItem('lots', JSON.stringify(lots)); // Guardar en localStorage
  
        const typeDocuments = await TypeDocumentsService.getAllTypeDocuments();
        const typeRegisters = await RegistrerTypeServices.getAllRegistrerType();
        const roles = await TypeDocumentsService.getAllTypeUsers();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);


  const dashboardItems = [
    {
      title: "Empresas",
      icon: FaRegBuilding,
       route: "/home/empresa",
      items: [{ label: "Empresas registradas", count: companyCount }],
    },
    {
      title: "Usuarios",
      route: "/home/usuarios",
      icon: HiOutlineUserGroup,
      items: [{ label: "Super administradores", count: superAdministrativos },
      { label: "Administrativos de cuenta empresarial", count: administrativos },
      { label: "Usuarios de operación", count: operarios }


      ],

    },
    {
      title: "Variables",
      icon: ImEqualizer2,
      route: "/home/variables",
      items: [
        { label: "Tipos de variables", count: variableTypeCount, route: "/home/tipoVariables" },
        { label: "Variables", count: variableCount, route: "/home/variables", },
      ],
    },
    {
      title: "Dispositivos",
      icon: Cpu,
       route: "/home/tipos",
      items: [
        { label: "Tipo de Actuadores", count: actuatorTypeCount,  route: "/home/tipos" },
        { label: "Actuadores", count: actuatorCount , route: "/home/actuador" },
        { label: "Tipo de Sensores", count: sensorTypeCount , route: "/home/tipos" },
        { label: "Sensores", count: sensorCount , route: "/home/sensor" },
      ],
    },
    {
      title: "Espacios de producción",
      icon: BsBox,
       route: "/home/espacio",
      items: [
        { label: "Tipo de Espacios de producción ", count: spaceTypeCount , route: "/home/tipoEspacio"},
        { label: "Espacios de producción registrados", count: spaceCount,  route: "/home/espacio" },
      ],
    },
    {
      title: "Especies",
      icon: GlobeAsiaAustraliaIcon,
      route: "/home/especies", 
      items: [
        { label: "Categorías de especie", count: categoryCount  ,  route: "/home/listaEspecie"},
        { label: "Especies", count: speciesCount  , route: "/home/especies" },
      ],
    },
    {
      title: "Lotes de producción",
      icon: PiArrowsCounterClockwiseBold,
      route: "/home/lotes",
      items: [
        { label: "En proceso", count: lotInProcessCount },
        { label: "Cosechados", count: harvestedLotCount },
        { label: "Rechazado", count: rejectedLotCount },
      ],
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Portal de Super administrador</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="border p-4 rounded-lg hover:bg-accent/50 transition-colors"
              onClick={() => item.route && navigate(item.route)}
            >
              <div className="flex flex-row items-center space-x-4 pb-2">
                <div className="p-2 bg-primary/10 rounded-lg  shadow-sm">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold">{item.title}</h2>
              </div>
              <div className="space-y-2">
                {item.items.map((subItem, subIndex) => (
                  <div
                    key={subIndex}
                    className="flex items-center space-x-2 text-sm"
                  >
                    {subItem.count !== null && (
                      <span className="font-medium bg-primary/10 px-2 py-0.5 rounded bg-gradient-to-r from-gray-100 to-gray-300 shadow-md">
                        {subItem.count}
                      </span>
                    )}
                    <span
                      className={`text-muted-foreground ${subItem.label.includes("•") ? "ml-4" : ""
                        }`}
                    >
                      {subItem.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div id="tooltip-default" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
        Tooltip content
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>


    </div>
  );
};

export default Dashboard;
