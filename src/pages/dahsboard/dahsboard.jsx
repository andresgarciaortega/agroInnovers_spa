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

  useEffect(() => {
    hiddenSelect(false)
    const fetchData = async () => {
      try {
        const companies = await CompanyService.getAllCompany();
        setCompanyCount(companies.length);

        const users = await UserService.getAllUser();
        console.log("Usuarios obtenidos:", users);

        setOperarios(users.filter(user => user.roles.some(roles => roles.id === 3)).length);
        setAdministrativos(users.filter(user => user.roles.some(rol => rol.id === 2)).length);
        setSuperAdministrativos(users.filter(user => user.roles.some(rol => rol.id === 1)).length);

        setUserCount(users.length);

        console.log("Usuarios operarios:", operarios);
        console.log("Usuarios administrativos:", administrativos);
        console.log("Usuarios superadministrativos:", superAdministrativos);
        setUserCount(users.length);

        const variables = await variableService.getAllVariable();
        setVariableCount(variables.length);

        const variableTypes = await VariableType.getAllTypeVariable();
        setVariableTypeCount(variableTypes.length);

        const actuators = await ActuadorService.getAllActuador();
        setActuatorCount(actuators.length);

        const actuatorsType = await TypeDispositivoService.getAllActuador();
        setActuatorTypeCount(actuatorsType.length);

        const sensors = await SensorService.getAllSensor();
        setSensorCount(sensors.length);

        const sensorsType = await TypeDispositivoService.getAllSensor();
        setSensorTypeCount(sensorsType.length);

        const spaces = await espacios.getAllEspacio();
        setSpaceCount(spaces.length);

        const spacesType = await tipoEspacio.getAlltipoEspacio();
        setSpaceTypeCount(spacesType.length);

        const species = await SpeciesService.getAllSpecie();
        setSpeciesCount(species.length);

        const categories = await CategoryService.getAllCategory();
        setCategoryCount(categories.length);

        const lots = await lotesService.getAllLots();
        setLotInProcessCount(lots.filter(lote => lote.status === 'in_process').length);
        setHarvestedLotCount(lots.filter(lote => lote.status === 'harvested').length);
        setRejectedLotCount(lots.filter(lote => lote.status === 'rejected').length);
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
      items: [{ label: "Empresas registradas", count: companyCount }],
    },
    {
      title: "Usuarios",
      icon: HiOutlineUserGroup,
      items: [{ label: "Super administradores", count: superAdministrativos },
      { label: "Administrativos de cuenta empresarial", count: administrativos },
      { label: "Usuarios de operación", count: operarios }


      ],

    },
    {
      title: "Variables",
      icon: ImEqualizer2,
      items: [
        { label: "Tipos de variables", count: variableTypeCount },
        { label: "Variables", count: variableCount },
      ],
    },
    {
      title: "Dispositivos",
      icon: Cpu,
      items: [
        { label: "Tipo de Actuadores", count: actuatorTypeCount },
        { label: "Actuadores", count: actuatorCount },
        { label: "Tipo de Sensores", count: sensorTypeCount },
        { label: "Sensores", count: sensorCount },
      ],
    },
    {
      title: "Espacios de producción",
      icon: BsBox,
      items: [
        { label: "Tipo de Espacios de producción ", count: spaceTypeCount },
        { label: "Espacios de producción registrados", count: spaceCount },
      ],
    },
    {
      title: "Especies",
      icon: GlobeAsiaAustraliaIcon,
      items: [
        { label: "Categorías de especie", count: categoryCount },
        { label: "Especies", count: speciesCount },
      ],
    },
    {
      title: "Lotes de producción",
      icon: PiArrowsCounterClockwiseBold,
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
