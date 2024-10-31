import React, { useState } from "react";
import PropTypes from "prop-types";
import { ChevronDown, ChevronUp, Edit, Eye, Pencil, Trash } from 'lucide-react';

// Define el tipo de Device usando PropTypes
const DevicePropTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  model: PropTypes.string.isRequired,
  brand: PropTypes.string.isRequired,
};

const Tipos = () => {
  const [sensors, setSensors] = useState([
    { id: '01', name: 'Sensor 1', type: 'Default', model: 'xt345', brand: 'Siemens' },
    { id: '02', name: 'Sensor 2', type: 'Default', model: 'xt345', brand: 'Siemens' },
    { id: '03', name: 'Sensor 3', type: 'Default', model: 'xt345', brand: 'Siemens' },
  ]);

  const [actuators, setActuators] = useState([
    { id: '01', name: 'Actuador 1', type: 'Default', model: 'xt345', brand: 'Siemens' },
    { id: '02', name: 'Actuador 2', type: 'Default', model: 'xt345', brand: 'Siemens' },
    { id: '03', name: 'Actuador 3', type: 'Default', model: 'xt345', brand: 'Siemens' },
  ]);

  const [expandedSection, setExpandedSection] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleAddDevice = () => {
    console.log('Add device clicked');
  };

  const handleAction = (action, deviceId) => {
    console.log(`${action} clicked for device ${deviceId}`);
  };

  const renderDeviceTable = (devices, type) => (
    <div className="p-4 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre comercial</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo {type}</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {devices.map((device) => (
            <tr key={device.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{device.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                  {device.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.model}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.brand}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="view-button mr-5" onClick={() => "handleOpenViewModal(user)"}>
                  <Eye size={18} />
                </button>
                <button className="edit-button mr-5" onClick={() => "handleOpenEditModal(user)"}>
                  <Edit size={18} />
                </button>
                <button onClick={() => "handleDelete(user)"} className="delete-button">
                  <Trash size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex items-center">
        <span className="mr-2 text-sm text-gray-700">Cantidad de filas:</span>
        <select
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
          className="border border-gray-300 rounded-md text-sm p-1 "
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center p-5 border-b">
        <h2 className="text-xl font-semibold">Tipos de dispositivos</h2>
        <button className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center">
          Crear dispositivo
        </button>
      </div>

      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg">
          <button
            className={`w-full px-6 py-5 flex justify-between items-center rounded-lg ${expandedSection === 'sensores' ? 'bg-green-800 text-white' : 'bg-gray-50 text-black'}`}
            onClick={() => toggleSection('sensores')}
          >
            <span className="text-sm font-semibold">Sensores</span>
            {expandedSection === 'sensores' ? (
              <ChevronUp size={20} className="text-white" />
            ) : (
              <ChevronDown size={20} className="text-gray-400" />
            )}
          </button>
          {expandedSection === 'sensores' && renderDeviceTable(sensors, 'sensor')}
        </div>
        <div className="border border-gray-200 rounded-lg">
          <button
            className={`w-full px-6 py-5 flex justify-between items-center rounded-lg ${expandedSection === 'actuadores' ? 'bg-green-800 text-white' : 'bg-gray-50 text-gray-700'}`}
            onClick={() => toggleSection('actuadores')}
          >
            <span className="text-sm font-semibold">Actuadores</span>
            {expandedSection === 'actuadores' ? (
              <ChevronUp size={20} className={expandedSection === 'actuadores' ? 'text-white' : 'text-gray-400'} />
            ) : (
              <ChevronDown size={20} className={expandedSection === 'actuadores' ? 'text-white' : 'text-gray-400'} />
            )}
          </button>
          {expandedSection === 'actuadores' && renderDeviceTable(actuators, 'actuador')}
        </div>
      </div>
    </div>
  );
};

Tipos.propTypes = {
  sensors: PropTypes.arrayOf(PropTypes.shape(DevicePropTypes)),
  actuators: PropTypes.arrayOf(PropTypes.shape(DevicePropTypes)),
};

export default Tipos;
