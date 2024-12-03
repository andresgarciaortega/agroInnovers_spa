import React, { useState, useEffect } from 'react';
import { X, Upload, Plus } from 'lucide-react';


import { Edit, Trash, Eye } from 'lucide-react';

import { useNavigate, useParams } from 'react-router-dom';
import CategoryService from '../../../services/CategoryService';
import UploadToS3 from '../../../config/UploadToS3';
import CompanyService from '../../../services/CompanyService';


import CompanySelector from "../../../components/shared/companySelect";
import { useCompanyContext } from "../../../context/CompanyContext";
import { BiWorld } from "react-icons/bi";

const VisualizarCategoria = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [editIndex, setEditIndex] = useState(null);
    const [editEtapaIndex, setEditEtapandex] = useState(null);

    const [nameCompany, setNameCompany] = useState("");
    const [selectedCompany, setSelectedCompany] = useState('');

    const [isEditMode, setIsEditMode] = useState(true)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [image, setImage] = useState("edit");
    const [newCategory, setNewCategory] = useState({});
    const [showAlertError, setShowAlertError] = useState(false);
    const [messageAlert, setMessageAlert] = useState("");
    const [companyList, setCategoryList] = useState([]);
    const [companies, setCompanies] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        image: null,
        company_id: 0,
        stage: [],
        subcategory: [],
    });

    useEffect(() => {
        fetchCategory();
        fetchCompanies();
    }, []);

    const fetchCategory = async () => {
        try {
            const data = await CategoryService.getCategoryById(id);
            setFormData({
                name: data.name || '',
                image: data.image || null,
                company_id: data.company_id || 0,
                stage: data.stages || [], 
                subcategory: data.subcategories || []
            });
            setNewCategory(data);
        } catch (error) {
            console.error('Error fetching categorias:', error);
        }
    };

    const fetchCompanies = async () => {
        try {
            const data = await CompanyService.getAllCompany();
            setCompanies(data);
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFormData({ ...formData, image: reader.result }); // Actualiza el estado con la nueva imagen
            reader.readAsDataURL(file); // Lee el archivo como una URL de datos (base64)
        }
    };

    const handleAddStage = () => setFormData({ ...formData, stage: [...formData.stage, { id: null, name: '', description: '' }] });
    const handleRemoveStage = (index) => setFormData({ ...formData, stage: formData.stage.filter((_, i) => i !== index) });

    const handleAddSubcategory = () => setFormData({ ...formData, subcategory: [...formData.subcategory, { id: null, name: '' }] });
    const handleRemoveSubcategory = (index) => setFormData({ ...formData, subcategory: formData.subcategory.filter((_, i) => i !== index) });

    const handleStageChange = (index, field, value) => {
        const updatedStages = [...formData.stage];
        updatedStages[index][field] = value;
        setFormData({ ...formData, stage: updatedStages });
    };

    const handleSubcategoryChange = (index, value) => {
        const updatedSubcategories = [...formData.subcategory];
        updatedSubcategories[index].name = value;
        setFormData({ ...formData, subcategory: updatedSubcategories });
    };

    const handleCancel = () => navigate('../especies');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            let imageUrl = image;
            if (image && typeof image === 'object') {
                imageUrl = await UploadToS3(image);
            }

            const parsedCompanyId = parseInt(formData.company_id, 10);
            if (isNaN(parsedCompanyId)) {
                setShowAlertError(true);
                setMessageAlert("El ID de la empresa debe ser un número válido.");
                return;
            }

            const formDataToSubmit = {
                name: formData.name,
                image: imageUrl,
                company_id: parsedCompanyId,
                stages: formData.stage.map((stage) => ({
                    id: stage.id,
                    name: stage.name,
                    description: stage.description,
                    company_id: parsedCompanyId,
                })),
                subcategories: formData.subcategory.map((subcategory) => ({
                    id: subcategory.id,
                    name: subcategory.name,
                    company_id: parsedCompanyId,
                })),
            };

            await CategoryService.updateCategory(id, formDataToSubmit);
            navigate('../especies');
        } catch (error) {
            console.error("Error:", error);
            setShowAlertError(true);
            setMessageAlert("Hubo un error al editar la categoría");
        }
    };
    const handleDeleteImage = () => {
       
        setFormData({ ...formData, image: null });
    };

    const handleEditSubcategory = (index) => {
        setEditIndex(index); 
    };

    const handleCancelEdit = () => {
        setEditIndex(null);
    };

    const handleEditEtapa = (index) => {
        setEditEtapandex(index); 
    };

    const handleCancelEditEtapa = () => {
        setEditEtapandex(null);
    };


    return (
        <form onSubmit={handleSubmit} className="p-6">
            <div className="absolute transform -translate-y-28 right-30 w-1/2 z-10">
                <div className="relative w-full">
                    <CompanySelector />

                </div>
                <br />
                <div className="flex items-center space-x-2 text-gray-700">
                    <BiWorld size={20} />
                    <span>Gestión de especies</span>
                    <span>/</span>
                    <span>Categoría</span>
                    <span>/</span>
                    <span className="text-black font-bold">   {nameCompany ? nameCompany : ''}</span>
                    <span className="text-black font-bold">  </span>
                    {selectedCompany && (
                        <span>{companyList.find(company => company.id === selectedCompany)?.name}</span>
                    )}

                    <span>/</span>
                    <span>Visualizar Categoría</span>
                </div>
            </div>
            {showAlertError && <div className="alert alert-error">{messageAlert}</div>}
            <div className="mb-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
                    {formData.image ? (
                        <img 
                            src={formData.image} 
                            alt="Category"
                            className="mx-auto h-32 object-contain"
                        />
                    ) : (
                        <div className="text-gray-500">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-1">Subir imagen</p>
                        </div>
                    )}

                    <input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        onChange={handleImageUpload}

                        accept="image/*"
                    />
                </div>

            
            </div>


            <div className="grid grid-cols- gap-4">
                <div className="mb-6">
                    <label htmlFor="category-name" className="block text-slg font-medium text-gray-700 mb-1">Nombre categoría</label>
                    <input
                        type="text"
                        id="category-name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="Nombre de la categoría"
                        required
                        disabled
                    />
                </div>
                
            </div>
            <hr className="my-6 border-gray-400" />

            {/* Subcategorías */}
            <div className="mt-6">
                <div className="flex items-center justify-between">
                    <label className="block text-lg font-medium text-gray-700 font-bold">Subcategorías</label>
                    
                </div>

                {formData.subcategory.map((subcategory, index) => (
                    <div key={index} className="flex gap-4 mt-2 items-center">
                        <input
                            type="text"
                            value={subcategory.name}
                            onChange={(e) => handleSubcategoryChange(index, e.target.value)}
                            placeholder="Nombre de la subcategoría"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            disabled={editIndex !== index}
                        />
                       
                    </div>
                ))}
            </div>
            <hr className="my-6 border-gray-400" />


            {/* Etapas */}
            <div className="mt-6">
                <div className="flex items-center justify-between">
                    <label className="block text-lg font-medium text-gray-700 ">Etapas</label>
                    
                </div>

                {formData.stage.map((stage, index) => (
                    <div key={index} className="mt-4 border-2 border-gray-400 rounded-md p-4">

                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-semibold text-gray-800">
                                {`Etapa ${index + 1}`}
                            </h3>
                            
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="w-full">
                                <input
                                    type="text"
                                    value={stage.name}
                                    onChange={(e) => handleStageChange(index, 'name', e.target.value)}
                                    placeholder="Nombre de la etapa"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="mt-2">
                            {/* Descripción de la etapa */}
                            <input
                                type="text"
                                value={stage.description}
                                onChange={(e) => handleStageChange(index, 'description', e.target.value)}
                                placeholder="Descripción de la etapa"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                disabled={editEtapaIndex !== index} // Deshabilita el campo si no está en edición
                            />
                        </div>
                    </div>
                ))}
            </div>



            <div className="flex justify-end space-x-4 mt-8">
                <button type="button"
                 onClick={handleCancel} 
                 className="bg-white text-gray-500 px-4 py-2 rounded border border-gray-400">

                    Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-[#168C0DFF] text-white hover:bg-[#146A0D] rounded-md">
                    Guardar
                </button>
            </div>
        </form>
    );
};

export default VisualizarCategoria;
