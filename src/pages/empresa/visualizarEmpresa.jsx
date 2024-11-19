import React, { useEffect, useState } from 'react';
import { IoCloudUploadOutline } from "react-icons/io5";
import CompanyService from "../../services/CompanyService";
import TypeDocumentsService from '../../services/fetchTypes';
import GenericModal from '../../components/genericModal';
import FormCompany from './FormCompany/formCompany';
import { useParams } from 'react-router-dom';

import { Package2, Factory, Variable, Activity, Cpu, Users } from 'lucide-react';


const VisualizarEmpresa = ({ }) => {

  const {companyId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("edit");
  const [newCompany, setNewCompany] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [companyList, setCompanyList] = useState([]);

  useEffect(() => {
    fetchCompaniesData();
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





  // Abrir el modal
  const handleOpenModal = async () => {
    setIsModalOpen(true);
  };


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



  return (
    <div className="flex">
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
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

                  <span className="px-3 py-1 text-sm text-green-500 bg-green-100 rounded-md">5</span>
                  <span className="text-sm text-muted-foreground">En proceso</span>
                </div>
                <div className="flex items-center ">
                  <span className="px-3 py-1 text-sm text-yellow-500 bg-yellow-100 rounded-md">2</span>
                  <span className="text-sm text-muted-foreground">Cosechados</span>
                </div>
                <div className="flex items-center mt-5">
                  <span className="px-3 py-1 text-sm text-red-500 bg-red-100 r">1</span>
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
                <span className='py-2 font-medium justify-between'> 2 lagos de intensiva</span>
                <div className="flex items-center ">
                  <span className="px-3 py-1 text-sm text-green-500 bg-green-100 rounded-md">2</span>
                  <span className="text-sm text-muted-foreground">En producción</span>
                </div>
                <div className="flex items-center">
                  <span className="px-3 py-1 text-sm text-red-500 bg-red-100 rounded-md">1</span>
                  <span className="text-sm text-muted-foreground ">Sin producir</span>
                </div>
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
                  <span className="px-3 py-1 text-sm  text-blue-500 bg-blue-100  rounded-md">2</span>
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
                  <span className="px-3 py-1 text-sm text-blue-500 bg-blue-100 rounded-md">2</span>
                  <span className="text-sm text-muted-foreground">Sensores internos</span>
                </div>
                <div className="flex items-center">
                  <span className="px-3 py-1 text-sm text-blue-500 bg-blue-100 rounded-md">20</span>
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
                  <span className="px-3 py-1 text-sm text-blue-500 bg-blue-100 rounded-md">3</span>
                  <span className="text-sm text-muted-foreground">Administradores de cuenta</span>
                </div>
                <div className="flex items-center ">
                  <span className="px-3 py-1 text-sm text-blue-500 bg-blue-100 rounded-md">5</span>
                  <span className="text-sm text-muted-foreground">Usuarios de operación</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <GenericModal title={modalMode === 'edit' ? 'Editar Empresa' : modalMode === 'view' ? 'Ver Empresa' : 'Añadir Empresa'} onClose={closeModal}>
          <FormCompany showSuccessAlert={showSuccessAlertSuccess} onUpdate={updateCompanies} company={newCompany} mode={modalMode} closeModal={closeModal} />
          {console.log(newCompany)}
        </GenericModal>
      )}
    </div>
  );
};

export default VisualizarEmpresa;
