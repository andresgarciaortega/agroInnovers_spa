import React from 'react'
import { Monitor, Cpu, Factory, Fish, Package } from 'lucide-react'
import { GlobeAsiaAustraliaIcon } from '@heroicons/react/24/outline';
import { HiOutlineUserGroup } from "react-icons/hi";
import { ImEqualizer2 } from "react-icons/im";
import { BsBox } from "react-icons/bs";
import { PiArrowsCounterClockwiseBold } from "react-icons/pi";
import { FaRegBuilding} from 'react-icons/fa';

const Dashboard = () => {
  const dashboardItems = [
    {
      title: "Empresas",
      icon: FaRegBuilding,
      items: [
        { label: "Empresas registradas", count: 10 },
      ],
    },
    {
      title: "Usuarios",
      icon: HiOutlineUserGroup,
      items: [
        { label: "Super administradores", count: 2 },
        { label: "Administradores de cuenta empresarial", count: 2 },
        { label: "Usuarios de operación", count: 5 },
      ],
    },
    {
      title: "Variables",
      icon: ImEqualizer2,
      items: [
        { label: "Tipos de variables", count: 4 },
        { label: "Variables", count: 20 },
      ],
    },
    {
      title: "Sistema de monitoreo",
      icon: Monitor,
      items: [
        { label: "Sistemas físico", count: 2 },
        { label: "Sistemas virtuales", count: 3 },
      ],
    },
    {
      title: "Dispositivos",
      icon: Cpu,
      items: [
        { label: "Tipos de actuadores", count: 2 },
        { label: "Actuadores", count: 20 },
        { label: "Tipos de sensores", count: 4 },
      ],
    },
    {
      title: "Espacios de producción",
      icon: BsBox,
      items: [
        { label: "Tipos de espacio de producción", count: 3 },
        { label: "Espacios de producción registrados", count: 7 },
        { label: "• 6 en producción", count: null },
        { label: "• 1 sin producir", count: null },
      ],
    },
    {
      title: "Especies",
      icon: GlobeAsiaAustraliaIcon ,
      items: [
        { label: "Categorías de especie", count: 2 },
        { label: "Especies", count: 5 },
      ],
    },
    {
      title: "Lotes de producción",
      icon: PiArrowsCounterClockwiseBold,
      items: [
        { label: "En proceso", count: 5 },
        { label: "Cosechados", count: 10 },
        { label: "Rechazado", count: 1 },
      ],
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Portal de Super administrador</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="border p-4 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex flex-row items-center space-x-4 pb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
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
                      <span className="font-medium bg-primary/10 px-2 py-0.5 rounded bg-gradient-to-r from-gray-200 to-gray-300 shadow-lg p-6 ">
                        {subItem.count}
                      </span>
                    )}
                    <span 
                      className={`text-muted-foreground ${subItem.label.includes('•') ? 'ml-4' : ''}`}
                    >
                      {subItem.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Dashboard;
