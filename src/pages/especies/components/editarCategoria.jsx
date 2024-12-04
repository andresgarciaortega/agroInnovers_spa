import React, { useState, useEffect } from 'react';
import { X, Upload, Plus } from 'lucide-react';

import { IoCloudUploadOutline } from "react-icons/io5";

import { Edit, Trash, Eye } from 'lucide-react';
import SuccessAlert from "../../../components/alerts/success";
import ErrorAlert from "../../../components/alerts/error";

import { useNavigate, useParams } from 'react-router-dom';
import CategoryService from '../../../services/CategoryService';
import UploadToS3 from '../../../config/UploadToS3';
import CompanyService from '../../../services/CompanyService';


import CompanySelector from "../../../components/shared/companySelect";
import { useCompanyContext } from "../../../context/CompanyContext";
import { BiWorld } from "react-icons/bi";

const EditarCategorias = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [editIndex, setEditIndex] = useState(null);
    const [editEtapaIndex, setEditEtapandex] = useState(null);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);


    const [nameCompany, setNameCompany] = useState("");
    const [selectedCompany, setSelectedCompany] = useState('');

    const [isEditMode, setIsEditMode] = useState(true)


    const [imagePreview, setImagePreview] = useState(null);

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
            setImagePreview(data.image);

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

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                image: file,
            });

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleAddStage = () => {

        setFormData
            ({
                ...formData,
                stage: [...formData.stage,
                { id: null, name: '', description: '' }]
            });
    };

    const handleAddSubcategory = () => {

        setFormData({
            ...formData,
            subcategory: [...formData.subcategory,
            { id: null, name: '' }]
        });
    };

    const handleRemoveStage = (index) => setFormData({
        ...formData, stage: formData.stage.filter((_, i) => i !== index)
    });


    const handleRemoveSubcategory = (index) =>
        setFormData({
            ...formData, subcategory: formData.subcategory.filter((_, i) => i !== index)

        });

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
            // let imageUrl = image;
            // if (image && typeof image === 'object') {
            //     imageUrl = await UploadToS3(image);
            // }
            let imageUrl = '';

            if (formData.image.name) {

                imageUrl = await UploadToS3(formData.image);
            } else {

                imageUrl = newCategory.image;
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
                    id: stage.id && !isNaN(parseInt(stage.id, 10)) ? parseInt(stage.id, 10) : 0,
                    name: stage.name,
                    description: stage.description,
                    company_id: parsedCompanyId,
                })),
                subcategories: formData.subcategory.map((subcategory) => ({
                    id: subcategory.id && !isNaN(parseInt(subcategory.id, 10)) ? parseInt(subcategory.id, 10) : 0,
                    name: subcategory.name,
                    company_id: parsedCompanyId,
                })),

            };

            console.log(formDataToSubmit);

            await CategoryService.updateCategory(id, formDataToSubmit);

            setShowSuccessAlert(true);
            setTimeout(() => setShowSuccessAlert(false), 3000);
            console.log("Show success alert:", showSuccessAlert);
            navigate('../especies');

        } catch (error) {
            console.error("Error:", error);
            setShowAlertError(true);
            setMessageAlert("Hubo un error al editar la categoría");
            console.log("Show error alert:", showAlertError);

        }


    };

    useEffect(() => {
        if (showSuccessAlert) {
            console.log("Show success alert:", showSuccessAlert);
        }
    }, [showSuccessAlert]);

    useEffect(() => {
        if (showAlertError) {
            console.log("Show error alert:", showAlertError);
        }
    }, [showAlertError]);

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

    const handleCloseAlertError = () => {
        setShowAlertError(false);
    };


    const handleCancelAlertError = () => {
        setShowAlertError(false);
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
                    <span>Editar Categoría</span>
                </div>
            </div>


            <div className="mb-6">
                <div className="mb- py-">
                    <label>Adjuntar Logo</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-0 text-center cursor-pointer hover:bg-gray-50" onClick={() => document.getElementById('logo-upload').click()}>
                        {imagePreview ? (
                            <img src={imagePreview} alt="Company Logo" className="mx-auto h-20 object-contain" />
                        ) : (
                            <>
                                <IoCloudUploadOutline className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-1 text-sm text-gray-600">
                                    Haga <span className="text-cyan-500 underline">clic aquí</span> para cargar o arrastre y suelte
                                </p>
                                <p className="text-xs text-gray-500">Archivos máximo 10 mb</p>
                            </>
                        )}
                    </div>
                    <input id="logo-upload" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </div>

                {imagePreview && (
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
                
            </div>
            <hr className="my-6 border-gray-400" />

            {/* Subcategorías */}
            <div className="mt-6">
                <div className="flex items-center justify-between">
                    <label className="block text-lg font-medium text-gray-700 ">Subcategorías</label>
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
            <hr className="my-6 border-gray-400" />


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

                                <input
                                    type="text"
                                    value={stage.name}
                                    onChange={(e) => handleStageChange(index, 'name', e.target.value)}
                                    placeholder="Nombre de la etapa"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    disabled={editEtapaIndex !== index}
                                />
                            </div>
                        </div>

                        <div className="mt-2">

                            <input
                                type="text"
                                value={stage.description}
                                onChange={(e) => handleStageChange(index, 'description', e.target.value)}
                                placeholder="Descripción de la etapa"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                disabled={editEtapaIndex !== index}
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
            {showSuccessAlert && (
                <div className="alert alert-success text-green-700 bg-green-100 border border-green-400 rounded-lg p-4">
                    ¡Categoría editada con éxito!
                </div>
            )}
            {showSuccessAlert && <SuccessAlert message="Categoría actualizada exitosamente!" />}

            {showAlertError && (
                <ErrorAlert
                    message={messageAlert}

                    onCancel={handleCancelAlertError}
                />
            )}
        </form>
    );
};

export default EditarCategorias;
