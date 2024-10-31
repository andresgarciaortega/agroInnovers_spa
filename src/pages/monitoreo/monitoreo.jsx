import React, { useState } from "react";
import './monitoreo.css';
import { Edit, Trash, Eye } from 'lucide-react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Delete from '../../components/delete';

const Monitoring = [
  { id: '01', nombre: 'Dispositivo 1', dispAsignados: true, ipFija: '192.168.0.1', loteProduccion: '1 A' },
  { id: '02', nombre: 'Dispositivo 2', dispAsignados: false, ipFija: '192.168.0.2', loteProduccion: '1 B' },
  { id: '03', nombre: 'Dispositivo 3', dispAsignados: true, ipFija: '192.168.0.3', loteProduccion: '1 C' },
  { id: '04', nombre: 'Dispositivo 4', dispAsignados: false, ipFija: '192.168.0.4', loteProduccion: '1 D' },
  { id: '05', nombre: 'Dispositivo 5', dispAsignados: true, ipFija: '192.168.0.5', loteProduccion: '1 E' },
  { id: '06', nombre: 'Dispositivo 6', dispAsignados: true, ipFija: '192.168.0.6', loteProduccion: '1 F' },
  { id: '07', nombre: 'Dispositivo 7', dispAsignados: false, ipFija: '192.168.0.7', loteProduccion: '1 G' },
  { id: '08', nombre: 'Dispositivo 8', dispAsignados: true, ipFija: '192.168.0.8', loteProduccion: '1 H' },
  { id: '09', nombre: 'Dispositivo 9', dispAsignados: false, ipFija: '192.168.0.9', loteProduccion: '1 I' },
  { id: '10', nombre: 'Dispositivo 10', dispAsignados: true, ipFija: '192.168.0.10', loteProduccion: '1 J' },
];



const Monitoreo = () => {
  const [data, setData] = useState(Monitoring);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const indexOfLastDevice = currentPage * itemsPerPage;
  const indexOfFirstDevice = indexOfLastDevice - itemsPerPage;
  const currentDevices = data.slice(indexOfFirstDevice, indexOfLastDevice);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(data.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleDelete = (device) => {
    setSelectedDevice(device);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setData(data.filter((device) => device.id !== selectedDevice.id));
    setIsDeleteModalOpen(false);
    setSelectedDevice(null);
  };

  const handleCancelDelete = () => {
    setSelectedDevice(null);
    setIsDeleteModalOpen(false);
  };

  const toggleSwitch = (deviceId) => {
    setData(data.map(device => (
      device.id === deviceId ? { ...device, dispAsignados: !device.dispAsignados } : device
    )));
  };

  return (
    <div className="table-container">
      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Monitoreo de Dispositivos</h2>
          <button className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center">
            Crear dispositivo
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disp asignados</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP fija</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lote de producción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentDevices.map((device) => (
                <tr key={device.id}>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{device.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{device.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div
                      className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ease-in-out duration-200 ${device.dispAsignados ? 'bg-[#168C0DFF]' : 'bg-gray-300'
                        }`}
                      onClick={() => toggleSwitch(device.id)}
                    >
                      <span
                        className={`inline-block w-7 h-7 transform bg-white rounded-full transition-transform ease-in-out duration-200 border-2 border-gray-300 shadow-lg ${device.dispAsignados ? 'translate-x-5' : 'translate-x-1'
                          }`}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{device.ipFija}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{device.loteProduccion}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button className="view-button mr-5">
                      <Eye size={18} />
                    </button>
                    <button className="edit-button mr-5">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(device)} className="delete-button">
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

          {isDeleteModalOpen && (
            <Delete
              message={`¿Seguro que desea eliminar el dispositivo ${selectedDevice?.nombre}?`}
              onCancel={handleCancelDelete}
              onConfirm={handleConfirmDelete}
            />
          )}
        </div>
      </div>

      <div className="pagination-container">
        <div className="pagination-info text-xs">
          <span>Cantidad de filas</span>
          <select className="text-xs" value={itemsPerPage} onChange={handleItemsPerPageChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
        <div className="pagination-controls text-xs">
          <span>{indexOfFirstDevice + 1}-{indexOfLastDevice} de {data.length}</span>
          <button className="mr-2" onClick={handlePrevPage} disabled={currentPage === 1}>
            <IoIosArrowBack size={20} />
          </button>
          <button onClick={handleNextPage} disabled={currentPage === Math.ceil(data.length / itemsPerPage)}>
            <IoIosArrowForward size={20} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default Monitoreo;
