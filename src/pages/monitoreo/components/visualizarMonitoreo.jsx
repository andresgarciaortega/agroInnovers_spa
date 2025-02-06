import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { IoIosWarning } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import SystemMonitory from "../../../services/monitoreo";

const VisualizarMonitoreo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [expandedSection, setExpandedSection] = useState(null);
  const [espacios, setEspacios] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [monitorName, setMonitorName] = useState("");

  useEffect(() => {
    const fetchSistemas = async () => {
      try {
        const data = await SystemMonitory.getMotitoriesById(id);
console.log('datos', data)
setMonitorName(data.nombreId); // Guardar el nombre del monitor
        const espaciosData = data.productionSpaces.map((espacio) => ({
          id: espacio.id,
          NameSpacio: espacio.name,
          SubEspacio: espacio.shape.length, // Asumiendo que "shape" representa subespacio
          TypeSpacio: espacio.spaceTypeId.spaceTypeName, // Tipo de espacio
          PosicionGps: espacio.gpsPosition,
        }));

        setEspacios(espaciosData);

        // Extraer lotes de producción
        const lotesData = data.productionSpaces.flatMap((espacio) =>
          espacio.productionLots.map((lote) => ({
            id: lote.id,
            name: lote.lotCode,
            NameSpacio: espacio.name,
            SubEspacio: espacio.shape.length, // Mapeo a subespacio
            fechaCosecha: lote.estimatedEndDate,
            Estado: lote.status,
          }))
        );

        setLotes(lotesData);
      } catch (error) {
        console.error("Error fetching monitoring data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSistemas();
  }, [id]);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (isLoading) {
    return <div className="text-center text-gray-500">Cargando datos...</div>;
  }

  const renderLotesTable = () => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre de lote</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Espacio</th>
          {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sub espacio</th> */}
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Cosecha</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {lotes.map((lote, index) => (
          <tr key={lote.id}>
            <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
            <td className="px-6 py-4 text-sm text-cyan-400 underline border-blue-300">{lote.name}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{lote.NameSpacio}</td>
            {/* <td className="px-6 py-4 text-sm text-gray-500">{lote.SubEspacio}</td> */}
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
          {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sub espacio</th> */}
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo de Espacio</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posición GPS</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {espacios.map((espacio, index) => (
          <tr key={espacio.id}>
            <td className="px-6 py-4 text-sm text-gray-500">{index+1}</td>
            <td className="px-6 py-4 text-sm text-cyan-400 underline border-blue-300">
              {espacio.NameSpacio}
            </td>
            {/* <td className="px-6 py-4 text-sm text-gray-500">{espacio.SubEspacio}</td> */}
            <td className="px-6 py-4 text-sm text-gray-500">{espacio.TypeSpacio}</td>
            <td className="px-6 py-4 text-sm text-cyan-400 underline border-blue-300">{espacio.PosicionGps}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="space-y-4 p-6">
      <div>
      <h1 className="text-2xl font-bold">{monitorName}</h1>
      </div>
      <div className="border border-gray-300 rounded-lg ">
        <button
          onClick={() => toggleSection("lotes")}
          className={`w-full px-6 py-5 flex justify-between items-center rounded-lg ${
            expandedSection === "lotes" ? "bg-green-800 shadow-lg text-white" : "bg-gray-50 shadow-lg text-gray-700"
          }`}
        >
          Lotes de Producción
          {expandedSection === "lotes" ? <ChevronUp /> : <ChevronDown />}
        </button>
        {expandedSection === "lotes" && renderLotesTable()}
      </div>

      <div className="border border-gray-300 rounded-lg">
        <button
          onClick={() => toggleSection("espacios")}
          className={`w-full px-6 py-5 flex justify-between items-center rounded-lg ${
            expandedSection === "espacios" ? "bg-green-800 shadow-lg text-white" : "bg-gray-50 shadow-lg text-gray-700"
          }`}
        >
          Espacios de Producción
          {expandedSection === "espacios" ? <ChevronUp /> : <ChevronDown />}
        </button>
        {expandedSection === "espacios" && renderEspaciosTable()}
      </div>

    
    </div>
  );
};

export default VisualizarMonitoreo;
