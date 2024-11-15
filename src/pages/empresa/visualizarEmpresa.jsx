import React, { useEffect, useState } from 'react';
import { IoCloudUploadOutline } from "react-icons/io5";
import CompanyService from "../../services/CompanyService";
import TypeDocumentsService from '../../services/fetchTypes';
import GenericModal from '../../components/genericModal';
import { useParams } from 'react-router-dom';

import { Package2, Factory, Variable, Activity, Cpu, Users } from 'lucide-react';


const VisualizarEmpresa = ({ }) => {
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

  const [documentTypes, setDocumentTypes] = useState([]); // Estado para los tipos de documentos
  const [showAlertError, setShowAlertError] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const { companyId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");

  const [company, setCompany] = useState({});


  // useEffect(() => {
  //   console.log("Updating company data in formData:", company);
  //   if (company) {
  //     setFormData(company);

  //   }
  // }, [company]);

  useEffect(() => {
    const fetchCompaniesData = async () => {
      try {
        const data = await CompanyService.getCompanyById(companyId);
        setCompanyList(data);
        setCompany(data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompaniesData();
  }, []);


  useEffect(() => {

    const fetchDocumentTypes = async () => {
      try {
        const typeDocuments = await TypeDocumentsService.getAllTypeDocuments();
        const personaTypes = typeDocuments.filter(type => type.process === 'EMPRESA');
        setDocumentTypes(personaTypes);
      } catch (error) {
        console.error('Error al obtener tipos de documentos:', error);
      }
    };
    fetchDocumentTypes();
    if (company) {
      setFormData({
        name: company.name || '',
        email_user_admin: company.email_user_admin || '',
        phone: company.phone || '',
        location: company.location || '',
        // type_document_id: company.typeDocument.id || 0,
        nit: company.nit || '',
        gps: company.gps || '',
        email_billing: company.email_billing || '',
        logo: company.logo || '',
      });
    }
  });




  return (
    <div className="flex">
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">{formData.name} </h1>
            {/* <button className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center" onClick={() => handleOpenModal()}>
            Añadir empresa
          </button> */}
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
      
    </div>
  );
};

export default VisualizarEmpresa;
