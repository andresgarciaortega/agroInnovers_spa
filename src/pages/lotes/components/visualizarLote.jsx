import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoteService from '../../../services/lotesService';
import { IoMdAlert, IoMdCheckmarkCircle } from "react-icons/io";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const VisualizarLote = () => {
    const { id } = useParams();
    const [lote, setLote] = useState(null);
    const [espacioDetalles, setEspacioDetalles] = useState(null);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        const fetchLote = async () => {
            try {
                const response = await LoteService.getAllLotsById(id);
                setLote(response);
                console.log('Lote traído:', response);
            } catch (error) {
                console.error('Error al cargar el lote:', error);
            }
        };

        fetchLote();
    }, [id]);

    if (!lote) {
        return <div>Cargando lote...</div>;
    }

    const calculateDeadIndividuals = (initial, final) => {
        return initial - final;
    };

    const toggleExpand = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Detalle del Lote</h1>
            <div className="grid grid-cols-2 gap-4 border border-gray-300 p-4 shadow-lg">
                {/* Lado izquierdo */}
                <div>
                    <p><strong>Código del Lote:</strong> {lote.lotCode}</p>
                    <p><strong>Estado del lote:</strong> {lote.status}</p>
                    <p><strong>Posición GPS:</strong> {lote.satus}</p>
                    <p><strong>Alertas recibidas:</strong> {lote.alert}</p>
                </div>

                {/* Lado derecho */}
                <div>
                    <p><strong>Fecha de Inicio:</strong> {lote.startDate}</p>
                    <p><strong>Fecha estimada de finalización:</strong> {lote.estimatedEndDate}</p>
                    <p><strong>Nombre de espacio:</strong> {lote.productionSpace?.name}</p>
                    <p><strong>Tipo de espacio:</strong> {lote.productionSpace?.spaceTypeId?.spaceTypeName || 'N/A'}</p>
                </div>
            </div>

            <div className="border border-gray-300 p-4 mt-4 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Especies</h2>
                <div className="grid grid-cols-1 gap-4">
                    {lote.productionLotSpecies.map((especie) => (
                        <div
                            key={especie.id}
                            className="border p-2 rounded-md bg-gray-100 shadow-lg"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p><strong>{especie.specie.common_name}</strong></p>
                                    <p>Etapa: {especie.stage}</p>
                                    <p>Peso Total inicial: {especie.initialWeight} kg</p>
                                    <p>Peso Total Final: {especie.finalWeight} kg</p>
                                </div>

                                <div className="ml-auto text-right">
                                    <p>N° individuos iniciales: {especie.initialIndividuals}</p>
                                    <p>N° individuos finales: {especie.finalIndividuals}</p>
                                    <p>N° individuos muertos: {calculateDeadIndividuals(especie.initialIndividuals, especie.finalIndividuals)}</p>
                                </div>

                                {/* Botón */}
                                <button
                                    onClick={() => toggleExpand(especie.id)}
                                    className="text-gray-400 ml-4"
                                    aria-label={`Expandir/Colapsar ${especie.specie.common_name}`}
                                >
                                    {expanded === especie.id ? <FaChevronUp /> : <FaChevronDown />}
                                </button>
                            </div>

                            {expanded === especie.id && (
                                <div className="mt-2">
                                    <table className="table-auto border-collapse border border-gray-300 w-full">
                                        <thead>
                                            <tr>
                                                <th className="border border-gray-300 px-4 py-2">Nombre del Espacio</th>
                                                <th className="border border-gray-300 px-4 py-2">Individuos Iniciales</th>
                                                <th className="border border-gray-300 px-4 py-2">Individuos Finales</th>
                                                <th className="border border-gray-300 px-4 py-2">Individuos Muertos</th>
                                                <th className="border border-gray-300 px-4 py-2">Peso Inicial</th>
                                                <th className="border border-gray-300 px-4 py-2">Peso Final</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(especie.subspaces) && especie.subspaces.length > 0 ? (
                                                especie.subspaces.map((subespacio) => (
                                                    <tr key={subespacio.id}>
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            {subespacio.productionSpace?.name || 'N/A'}
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            {subespacio.initialIndividuals ?? 'N/A'}
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            {subespacio.finalIndividuals ?? 'N/A'}
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            {subespacio.initialIndividuals != null && subespacio.finalIndividuals != null
                                                                ? calculateDeadIndividuals(subespacio.initialIndividuals, subespacio.finalIndividuals)
                                                                : 'N/A'}
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            {subespacio.initialWeight ? `${subespacio.initialWeight} kg` : 'N/A'}
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            {subespacio.finalWeight ? `${subespacio.finalWeight} kg` : 'N/A'}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td className="border border-gray-300 px-4 py-2 text-center" colSpan="6">
                                                        No hay subespacios disponibles
                                                    </td>
                                                </tr>
                                            )}
                                            {/* Mostrar siempre los datos de la especie si no hay subespacios */}
                                            {especie.subspaces && especie.subspaces.length === 0 && (
                                                <tr>
                                                    <td className="border border-gray-300 px-4 py-2 text-center" colSpan="6">
                                                        <p><strong>Individuos iniciales:</strong> {especie.initialIndividuals || 'N/A'}</p>
                                                        <p><strong>Individuos finales:</strong> {especie.finalIndividuals || 'N/A'}</p>
                                                        <p><strong>Individuos muertos:</strong> {calculateDeadIndividuals(especie.initialIndividuals, especie.finalIndividuals)}</p>
                                                        <p><strong>Peso inicial:</strong> {especie.initialWeight ? `${especie.initialWeight} kg` : 'N/A'}</p>
                                                        <p><strong>Peso final:</strong> {especie.finalWeight ? `${especie.finalWeight} kg` : 'N/A'}</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>


                                    </table>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="border border-gray-300 p-4 mt-4 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Reporte de seguimiento</h2>

            </div>
        </div>

    );
};

export default VisualizarLote;
