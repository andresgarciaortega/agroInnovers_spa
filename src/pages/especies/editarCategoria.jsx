import React, { useState, useEffect } from 'react';
import { X, Upload, Plus } from 'lucide-react';


import { Edit, Trash, Eye } from 'lucide-react';

import { useNavigate, useParams } from 'react-router-dom';
import CategoryService from '../../services/CategoryService';
import UploadToS3 from '../../config/UploadToS3';
import CompanyService from '../../services/CompanyService';


import CompanySelector from "../../components/shared/companySelect";
import { useCompanyContext } from "../../context/CompanyContext";
import { ImEqualizer2 } from "react-icons/im";

const EditarCategorias = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [editIndex, setEditIndex] = useState(null);
    const [editEtapaIndex, setEditEtapandex] = useState(null);

    const [nameCompany, setNameCompany] = useState("");
    const [selectedCompany, setSelectedCompany] = useState('');



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
                stage: data.stages || [], // Aquí tomas las etapas desde la respuesta
                subcategory: data.subcategories || [] // Aquí tomas las subcategorías
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
        // Restablecer el estado de la imagen a null
        setFormData({ ...formData, image: null });
    };

    const handleEditSubcategory = (index) => {
        setEditIndex(index); // Activamos la edición de la subcategoría
    };

    const handleCancelEdit = () => {
        setEditIndex(null); // Cancelamos la edición
    };

    const handleEditEtapa = (index) => {
        setEditEtapandex(index); // Activamos la edición de la subcategoría
    };

    const handleCancelEditEtapa = () => {
        setEditEtapandex(null); // Cancelamos la edición
    };


    return (
        <form onSubmit={handleSubmit} className="p-6">
            <div className="absolute transform -translate-y-28 right-30 w-1/2 z-10">
                <div className="relative w-full">
                    <CompanySelector />

                </div>
                <br />
                <div className="flex items-center space-x-2 text-gray-700">
                    <ImEqualizer2 size={20} />
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
                    <span>Editar Categoría</span>
                </div>
            </div>
            {showAlertError && <div className="alert alert-error">{messageAlert}</div>}
            <div className="mb-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
                    {formData.image ? (
                        <img
                            onClick={() => document.getElementById('image-upload').click()} // Abre el selector de archivos al hacer clic en la imagen
                            src={formData.image}  // Usa la URL de la imagen que has obtenido
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

                {/* Mostrar el botón "Eliminar imagen" solo si hay una imagen */}
                {formData.image && (
                    <button
                        type="button"
                        onClick={handleDeleteImage}
                        className="mt-2 text-red-600 hover:text-red-800"
                    >
                        Eliminar imagen
                    </button>
                )}
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
                    />
                </div>
                {/* <div>
                    <label className="block text-sm font-medium text-gray-700">Empresa</label>
                    <select
                        name="company"
                        value={formData.company_id || ''}
                        onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    >
                        <option value="" disabled>Seleccione una opción</option>
                        {companies.map((company) => (
                            <option key={company.id} value={company.id}>
                                {company.name}
                            </option>
                        ))}
                    </select>
                </div> */}
            </div>

            {/* Subcategorías */}
            <div className="mt-6">
                <div className="flex items-center justify-between">
                    <label className="block text-lg font-medium text-gray-700 font-bold">Subcategorías</label>
                    <button
                        type="button"
                        onClick={handleAddSubcategory}
                        className="mb-2 inline-flex items-center px-2 py-1 border border-[#168C0DFF] text-sm leading-1 font-medium rounded-md text-[#168C0DFF] bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <Plus className="mr-2" />
                        Agregar subcategoría
                    </button>
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
                        <div className="flex gap-2">
                            {editIndex === index ? (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="text-[#168C0DFF] hover:text-red-500"
                                >
                                    Cancelar
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => handleEditSubcategory(index)}
                                    className="text-[#168C0DFF] hover:text-[#0F6A06]"
                                >
                                    <Edit />
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => handleRemoveSubcategory(index)}
                                className="text-[#168C0DFF] hover:text-[#0F6A06]"
                            >
                                <Trash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>


            {/* Etapas */}
            <div className="mt-6">
                <div className="flex items-center justify-between">
                    <label className="block text-lg font-medium text-gray-700 ">Etapas</label>
                    <button
                        type="button"
                        onClick={handleAddStage}
                        className="mb-2 inline-flex items-center px-8 py-1 border border-[#168C0DFF] text-sm leading-1 font-medium rounded-md text-[#168C0DFF] bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <Plus className="mr-2" />
                        Agregar etapa
                    </button>
                </div>

                {formData.stage.map((stage, index) => (
                    <div key={index} className="mt-4 border-2 border-gray-400 rounded-md p-4">

                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-semibold text-gray-800">
                                {`Etapa ${index + 1}`}
                            </h3>
                            <div className="flex gap-4">
                                {editEtapaIndex === index ? (
                                    <button
                                        type="button"
                                        onClick={handleCancelEditEtapa}
                                        className="text-[#168C0DFF] hover:text-red-500"
                                    >
                                        Cancelar
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => handleEditEtapa(index)}
                                        className="text-[#168C0DFF] hover:text-[#0F6A06]"
                                    >
                                        <Edit />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveStage(index)}
                                    className="text-[#168C0DFF] hover:text-[#0F6A06]"
                                >
                                    <Trash />
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="w-full">
                                {/* Nombre de la etapa */}
                                <input
                                    type="text"
                                    value={stage.name}
                                    onChange={(e) => handleStageChange(index, 'name', e.target.value)}
                                    placeholder="Nombre de la etapa"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    disabled={editEtapaIndex !== index} // Deshabilita el campo si no está en edición
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





            <div className="mt-8 flex gap-4">
                <button type="button" onClick={handleCancel} className="px-6 py-2 text-white bg-gray-400 rounded-lg hover:bg-gray-500">
                    Cancelar
                </button>
                <button type="submit" className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700">
                    Guardar
                </button>
            </div>
        </form>
    );
};

export default EditarCategorias;
