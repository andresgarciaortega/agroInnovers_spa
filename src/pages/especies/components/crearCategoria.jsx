import React, { useState, useEffect } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CategoryService from '../../../services/CategoryService';
import SubCategoryService from '../../../services/SubcategoryService';
import StagesService from '../../../services/StagesService';
import UploadToS3 from '../../../config/UploadToS3';
import CompanyService from '../../../services/CompanyService';
import { IoCloudUploadOutline } from "react-icons/io5";
import SuccessAlert from "../../../components/alerts/success";
import { useCompanyContext } from '../../../context/CompanyContext';
import { BiWorld } from "react-icons/bi";

const CrearCategorias = ({ }) => {
    const navigate = useNavigate();
    const { selectedCompanyUniversal, hiddenSelect } = useCompanyContext();
    const [nameCompany, setNameCompany] = useState("");

    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [stage, setStage] = useState([]);
    const [companyId, setCompanyId] = useState('');
    const [subcategory, setSubcategory] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [setShowErrorAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState("");
    const [formData, setFormData] = useState({
        category_id: 0,
        company_id: 0,
        subcategory_id: 0,
        scientificName: '',
        commonName: '',
        variable_id: 0,
        image: null,
        descripcion: '',
        stage: [],
        parameters: [],
    });

    useEffect(() => {
        hiddenSelect(false)
        setNameCompany(selectedCompanyUniversal.label)

        const fetchCompany = async () => {
            try {
                const data = await CompanyService.getAllCompany();
                setCompanies(data);
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };
        fetchCompany();
    }, []);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                image: file,
            });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        try {
            let imageUrl = '';
            if (formData.image) {
                imageUrl = await UploadToS3(formData.image);
            }

            const parsedCompanyId = parseInt(companyId, 10);
            if (isNaN(parsedCompanyId)) {
                handleErrorAlert("El ID de la empresa debe ser un número válido.");
                return;
            }

            const categoryData = {
                name: name.trim(),
                image: imageUrl || '',
                company_id: parsedCompanyId,
            };

            const createdCategory = await CategoryService.createCategory(categoryData);
            const createdCategoryId = createdCategory.id;

            const subcategoryResponses = await Promise.all(
                subcategory.map(async (subcategoryData) => {
                    try {
                        const response = await SubCategoryService.createSubcategory({
                            ...subcategoryData,
                            company_id: parsedCompanyId,
                            category_species_id: createdCategoryId,
                        });
                        return response;
                    } catch (error) {
                        console.error("Error creando subcategoría:", subcategoryData, error);
                        throw error;
                    }
                })
            );

            const stageResponses = await Promise.all(
                stage.map(async (stageData) => {
                    try {
                        const response = await StagesService.createStages({
                            ...stageData,
                            company_id: parsedCompanyId,
                            category_species_id: createdCategoryId,
                        });
                        return response;
                    } catch (error) {
                        console.error("Error creando etapa:", stageData, error);
                        throw error;
                    }
                })
            );
            setShowSuccessAlert(true);
            setTimeout(() => {
                setShowSuccessAlert(false);
            }, 2500);
            console.log("Categoría, subcategorías y etapas creadas correctamente.");
            setTimeout(() => {
                navigate('../especies');
            }, 3000);

        } catch (error) {
            console.error("Error durante la creación:", error);
            handleErrorAlert(`Hubo un error al crear la categoría: ${error.message}`);
        }
    };


    const handleAddStage = () => {
        setStage([...stage, { name: '', description: '' }]);
    };

    const handleRemoveStage = (index) => {
        setStage(stage.filter((_, i) => i !== index));
    };

    const handleAddSubcategory = () => {
        setSubcategory([...subcategory, { name: '' }]);
    };

    const handleRemoveSubcategory = (index) => {
        setSubcategory(subcategory.filter((_, i) => i !== index));
    };

    const handleStageChange = (index, field, value) => {
        const updatedstage = [...stage];
        updatedstage[index][field] = value;
        setStage(updatedstage);
    };

    const handleSubcategoryChange = (index, value) => {
        const updatedsubcategory = [...subcategory];
        updatedsubcategory[index].name = value;
        setSubcategory(updatedsubcategory);
    };

    useEffect(() => {
        if (showSuccessAlert) {
            console.log("Show success alert:", showSuccessAlert);
        }
    }, [showSuccessAlert]);

    const showErrorAlert = (message) => {
        console.error(message);
    };

    const handleErrorAlert = (message) => {
        setMessageAlert(message);
        setShowErrorAlert(true);

        setTimeout(() => {
            setShowErrorAlert(false);
            setMessageAlert('');
        }, 3000);
    };
    const validateForm = () => {
        if (!name) {
            handleErrorAlert("El nombre de la categoría es obligatorio.");
            return false;
        }
        if (!companyId) {
            handleErrorAlert("La empresa es obligatoria.");
            return false;
        }
        if (stage.length === 0) {
            handleErrorAlert("Debe agregar al menos una etapa.");
            return false;
        }
        
        return true;
    };
    // const SuccessAlert = ({ message }) => {
    //     return (
    //         <div className="fixed top-0 right-0 m-4 bg-green-500 text-white p-4 rounded shadow">
    //             {message || '¡Operación exitosa!'}
    //         </div>
    //     );
    // };


    <CrearCategorias showErrorAlert={handleErrorAlert} />
    const handleCancel = () => {
        navigate('../especies');
    };



    return (
        <form onSubmit={handleSubmit} className="p-6">

            <div className="">
                <div className="flex items-center space-x-2 text-gray-700">
                    <BiWorld size={20} />
                    <span>Gestión de especies</span>
                    <span>/</span>
                    <span>Categoría</span>
                    <span>/</span>
                    <span className="text-black font-bold">   {nameCompany ? nameCompany : ''}</span>
                    <span className="text-black font-bold">  </span>
                    <span>/</span>
                    <span>Crear Categoría</span>
                </div>
            </div>


            <div className="mt-6">

                <div className="mb- py-">
                    <label className="block text-sm font-medium text-gray-700 mb-1" >Adjuntar Logo</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-0 text-center cursor-pointer hover:bg-gray-50"
                        onClick={() => document.getElementById('image-upload').click()}>
                        {image && typeof image === 'string' ? (
                            <img src={image} alt="Category" className="mx-auto h-32 object-contain" />
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
                </div>

                <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                    accept="image/*"
                />
                {image && (
                    <button
                        type="button"
                        onClick={() => setImage(null)}
                        className="mt-2 text-red-600 hover:text-red-800"
                    >
                        Eliminar imagen
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="mb-6">
                    <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-1">Nombre categoría</label>
                    <input
                        type="text"
                        id="category-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="Nombre de la categoría"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Empresa</label>
                    <select
                        name="company"
                        value={companyId || ''}
                        onChange={(e) => setCompanyId(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    >
                        <option value="" disabled>Seleccione una opción</option>
                        {companies.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subcategorías</label>
                    <button
                        type="button"
                        onClick={handleAddSubcategory}
                        className="mb-2 inline-flex items-center px-3 py-2 border border-[#168C0DFF] text-sm leading-4 font-medium rounded-md text-[#168C0DFF] bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <Plus size={16} className="mr-2" />
                        Añadir subcategoría
                    </button>
                    <div className="space-y-2">
                        {subcategory.map((subcategory, index) => (
                            <div key={index} className="p-2 border border-gray-200 rounded-md">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">Subcategoría {index + 1}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSubcategory(index)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            <label className="block text-sm font-medium text-gray-700">Nombre Subcategoría</label>

                                <input
                                    type="text"
                                    value={subcategory.name}
                                    onChange={(e) => handleSubcategoryChange(index, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    placeholder="Nombre de subcategoría"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Etapas</label>
                    <button
                        type="button"
                        onClick={handleAddStage}
                        className="mb-2 inline-flex items-center px-3 py-2 border border-[#168C0DFF] text-sm leading-4 font-medium rounded-md text-[#168C0DFF] bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <Plus size={16} className="mr-2" />
                        Añadir etapa
                    </button>
                    <div className="space-y-2">
                        {stage.map((stage, index) => (
                            <div key={index} className="p-2 border border-gray-200 rounded-md">
                                <div className="flex justify-between items-center mb-2">
                                    {/* Mostrar el nombre si existe, de lo contrario, mostrar "Etapa {index + 1}" */}
                                    <span className="font-medium">Etapa {index + 1}</span>

                                    {/* <span className="font-medium">{stage.name ? stage.name : `Etapa ${index + 1}`}</span> */}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveStage(index)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            <label className="block text-sm font-medium text-gray-700">Nombre Etapa</label>
                                
                                <input
                                    type="text"
                                    value={stage.name}
                                    onChange={(e) => handleStageChange(index, 'name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    placeholder="Nombre de etapa"
                                />
                            <label className="block text-sm font-medium text-gray-700 mt-5">Descripción</label>

                                <textarea
                                    value={stage.description}
                                    onChange={(e) => handleStageChange(index, 'description', e.target.value)}
                                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    placeholder="Descripción de la etapa"
                                />
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            <div className="flex justify-end space-x-4 ">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-white text-gray-500 px-4 py-2 rounded border border-gray-400"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-[#168C0DFF] text-white hover:bg-[#146A0D] rounded-md"
                >
                    Crear Categoría
                </button>
            </div>
            {showErrorAlert && (
                <div className="alert alert-danger p-4 rounded-md text-red-600">
                    {messageAlert}
                </div>
            )}
            {showSuccessAlert && (
                <SuccessAlert message="Categoría creada exitosamente" />
            )}



        </form>
    );
};

export default CrearCategorias;
