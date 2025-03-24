import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { IoIosWarning, IoIosArrowBack, IoIosArrowForward } from "react-icons/io"; // Importar íconos
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

  const [currentPageLotes, setCurrentPageLotes] = useState(1);
  const [currentPageEspacios, setCurrentPageEspacios] = useState(1);
  const [itemsPerPageLotes, setItemsPerPageLotes] = useState(5);
  const [itemsPerPageEspacios, setItemsPerPageEspacios] = useState(5);

  useEffect(() => {
    const fetchSistemas = async () => {
      try {
        const data = await SystemMonitory.getMotitoriesById(id);
        setMonitorName(data.nombreId); // Guardar el nombre del monitor
        const espaciosData = data.productionSpaces.map((espacio) => ({
          id: espacio.id,
          NameSpacio: espacio.name,
          SubEspacio: espacio.subProductionSpaces?.length || 0,
          TypeSpacio: {
            name: espacio.spaceTypeId.spaceTypeName,
            image: espacio.spaceTypeId.icon,
          },
          PosicionGps: espacio.gpsPosition,
        }));

        setEspacios(espaciosData);

        // Extraer lotes de producción
        const lotesData = data.productionSpaces.flatMap((espacio) =>
          espacio.productionLots.map((lote) => ({
            id: lote.id,
            name: lote.lotCode,
            NameSpacio: espacio.name,
            SubEspacio: espacio.subProductionSpaces?.length || 0,
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

  // Paginación
  const indexOfLastLote = currentPageLotes * itemsPerPageLotes;
  const indexOfFirstLote = indexOfLastLote - itemsPerPageLotes;
  const paginatedLotes = lotes.slice(indexOfFirstLote, indexOfLastLote);

  const indexOfLastEspacio = currentPageEspacios * itemsPerPageEspacios;
  const indexOfFirstEspacio = indexOfLastEspacio - itemsPerPageEspacios;
  const paginatedEspacios = espacios.slice(indexOfFirstEspacio, indexOfLastEspacio);

  const handleItemsPerPageChangeLotes = (e) => {
    setItemsPerPageLotes(Number(e.target.value));
    setCurrentPageLotes(1); // Resetear a la primera página
  };

  const handleItemsPerPageChangeEspacios = (e) => {
    setItemsPerPageEspacios(Number(e.target.value));
    setCurrentPageEspacios(1); // Resetear a la primera página
  };

  const renderPagination = (currentPage, setCurrentPage, totalItems, itemsPerPage, handleItemsPerPageChange) => (
    <div className="flex items-center py-2 justify-between border border-gray-200 p-2 rounded-md bg-white">
      <div className="border border-gray-200 rounded py-2 text-sm m-2">
        <span>Cantidad de filas</span>
        <select className="text-xs" value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>
      <div className="pagination-controls text-xs flex items-center space-x-2">
        <span>
          {indexOfFirstLote + 1}-{Math.min(indexOfLastLote, totalItems)} de {totalItems}
        </span>
        <button
          className="mr-2 border border-gray-200 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <IoIosArrowBack size={20} />
        </button>
        <button
          className="border border-gray-200 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
        >
          <IoIosArrowForward size={20} />
        </button>
      </div>
    </div>
  );

  const renderLotesTable = () => (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre de lote</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Espacio</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sub espacio</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Cosecha</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedLotes.map((lote, index) => (
            <tr key={lote.id}>
              <td className="px-6 py-4 text-sm text-gray-500">{indexOfFirstLote + index + 1}</td>
              <td className="px-6 py-4 text-sm text-blue-400 underline border-blue-300">{lote.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{lote.NameSpacio}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{lote.SubEspacio}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{lote.fechaCosecha}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{lote.Estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {renderPagination(currentPageLotes, setCurrentPageLotes, lotes.length, itemsPerPageLotes, handleItemsPerPageChangeLotes)}
    </div>
  );

  const renderEspaciosTable = () => (
    <div>
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
          {paginatedEspacios.map((espacio, index) => (
            <tr key={espacio.id}>
              <td className="px-6 py-4 text-sm text-gray-500">{indexOfFirstEspacio + index + 1}</td>
              <td className="px-6 py-4 text-sm text-blue-400 underline border-blue-300">
                {espacio.NameSpacio}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{espacio.SubEspacio}</td>
              <td className="px-6 py-4 text-sm text-gray-500 flex items-center space-x-2">
                {espacio.TypeSpacio.image && (
                  <img src={espacio.TypeSpacio.image} alt={espacio.TypeSpacio.name} className="w-10 h-10 rounded-md" />
                )}
                <span>{espacio.TypeSpacio.name}</span>
              </td>
              <td
                className="px-6 py-4 text-sm text-blue-400 underline border-blue-300 cursor-pointer"
                onClick={() => {
                  if (espacio.PosicionGps) {
                    const [latitude, longitude] = espacio.PosicionGps.split(',').map(Number);
                    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=15`;
                    window.open(mapUrl, '_blank');
                  }
                }}
              >
                Ver posición
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {renderPagination(currentPageEspacios, setCurrentPageEspacios, espacios.length, itemsPerPageEspacios, handleItemsPerPageChangeEspacios)}
    </div>
  );

  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-bold">{monitorName}</h1>
      </div>
      <div className="border border-gray-300 rounded-lg ">
        <button
          onClick={() => toggleSection("lotes")}
          className={`w-full px-6 py-5 flex justify-between items-center rounded-lg ${expandedSection === "lotes" ? "bg-green-800 shadow-lg text-white" : "bg-gray-50 shadow-lg text-gray-700"
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
          className={`w-full px-6 py-5 flex justify-between items-center rounded-lg ${expandedSection === "espacios" ? "bg-green-800 shadow-lg text-white" : "bg-gray-50 shadow-lg text-gray-700"
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