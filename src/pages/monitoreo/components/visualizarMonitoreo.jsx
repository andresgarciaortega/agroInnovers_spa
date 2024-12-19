import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { IoIosWarning } from "react-icons/io";

const VisualizarMonitoreo = () => {
  const [lotes, setLotes] = useState([
    { id: "01", name: "Lote 1", NameSpacio: "Espacio 1", SubEspacio: "3", fechaCosecha: "12/08/24", Estado: "En producción" },
    { id: "02", name: "Lote 2", NameSpacio: "Espacio 2", SubEspacio: "3", fechaCosecha: "12/08/24", Estado: "En producción" },
    { id: "03", name: "Lote 3", NameSpacio: "Espacio 3", SubEspacio: "3", fechaCosecha: "12/08/24", Estado: "En producción" },
  ]);

  const [espacios, setEspacios] = useState([
    { id: "01", NameSpacio: "Espacio 1", SubEspacio: "Zona A", TypeSpacio: "Producción", PosicionGps: "12.34, -56.78" },
    { id: "02", NameSpacio: "Espacio 2", SubEspacio: "Zona B", TypeSpacio: "Producción", PosicionGps: "23.45, -67.89" },
    { id: "03", NameSpacio: "Espacio 3", SubEspacio: "Zona C", TypeSpacio: "Almacenamiento", PosicionGps: "34.56, -78.90" },
  ]);

  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderLotesTable = () => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre de lote</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Espacio de espacio</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sub espacio</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Cosecha</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {lotes.map((lote) => (
          <tr key={lote.id}>
            <td className="px-6 py-4 text-sm text-gray-500">{lote.id}</td>
            <td className="px-6 py-4 text-sm text-cyan-400 underline  border-blue-300">{lote.name}</td>
            <td className="px-6 py-4 text-sm text-cyan-400 underline  border-blue-300">{lote.NameSpacio}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{lote.SubEspacio}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{lote.fechaCosecha}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{lote.Estado}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderEspaciosTable = () => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre Espacio</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sub espacio</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo de Espacio</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posición GPS</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {espacios.map((espacio) => (
          <tr key={espacio.id}>
            <td className="px-6 py-4 text-sm text-gray-500">{espacio.id}</td>
            <td className="px-6 py-4 text-sm text-cyan-400 underline  border-blue-300">
              {espacio.NameSpacio}
            </td>

            <td className="px-6 py-4 text-sm text-gray-500">{espacio.SubEspacio}</td>
            <td className="px-6 py-4 text-sm text-gray-500">
              <img
                src={`/path-to-images/${espacio.TypeSpacio.toLowerCase()}.png`}
                alt={espacio.TypeSpacio}
                className="h-8 w-8"
              />
            </td>
            <td className="px-6 py-4 text-sm text-cyan-400 underline  border-blue-300">{espacio.PosicionGps}</td>
          </tr>
        ))}
      </tbody>
    </table>

  );

  return (
    <div className="space-y-4 p-6">
      <div>
        <button
          onClick={() => toggleSection("lotes")}
          className={`w-full px-6 py-5 flex justify-between items-center rounded-lg  ${expandedSection === "lotes" ? "bg-green-800 text-white" : "bg-gray-50 text-gray-700"}`}
        >
          Lotes de Producción
          {expandedSection === "lotes" ? <ChevronUp /> : <ChevronDown />}
        </button>
        {expandedSection === "lotes" && renderLotesTable()}
      </div>

      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleSection("espacios")}
          className={`w-full px-6 py-5 flex justify-between items-center rounded-lg ${expandedSection === "espacios" ? "bg-green-800 text-white" : "bg-gray-50 text-gray-700"}`}
        >
          Espacios de Producción
          {expandedSection === "espacios" ? <ChevronUp /> : <ChevronDown />}
        </button>
        {expandedSection === "espacios" && renderEspaciosTable()}
      </div>

      <div className="alert alert-error flex flex-col items-start space-y-2 p-4 mt-4 bg-red-500 text-white rounded-md">
        <div className="flex items-center space-x-2">
          <IoIosWarning size={20} />
          <p>Recuerda que esto es solo una visualización, la vista real se optendra mas adelante</p>
        </div>
        <div className="flex justify-end w-full">

        </div>
      </div>
    </div>
  );
};

export default VisualizarMonitoreo;
