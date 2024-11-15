import React, { useState, useEffect } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CategoryService from '../../services/CategoryService';
import UploadToS3 from '../../config/UploadToS3';
import CompanyService from '../../services/CompanyService';
import { IoCloudUploadOutline } from "react-icons/io5";

const CrearCategorias = ({ showErrorAlert }) => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [stage, setStage] = useState([]);
    const [companyId, setCompanyId] = useState('');
    const [subcategory, setSubcategory] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [showAlertError, setShowAlertError] = useState(false);
    const [messageAlert, setMessageAlert] = useState("");
    const [formData, setFormData] = useState({
        name: '',
        image: null,
        company_id: '',
        stage: [],
        subcategory: [],
    });

    useEffect(() => {
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

    const validateForm = () => {
        if (!name) {
            showErrorAlert("El nombre de la categoría es obligatorio.");
            return false;
        }
        if (!companyId) {
            showErrorAlert("La empresa es obligatoria.");
            return false;
        }
        if (stage.length === 0) {
            showErrorAlert("Debe agregar al menos una etapa.");
            return false;
        }
        if (subcategory.length === 0) {
            showErrorAlert("Debe agregar al menos una subcategoría.");
            return false;
        }
        return true;
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
                showErrorAlert("El ID de la empresa debe ser un número válido.");
                return;
            }

            const formDataToSubmit = {
                ...formData,
                name,
                image: imageUrl,
                company_id: parsedCompanyId,
                stage: stage.map(stage => ({
                    name: stage.name,
                    description: stage.description,
                    company_id: parsedCompanyId,
                })),
                subcategory: subcategory.map(subcategory => ({
                    name: subcategory.name,
                    company_id: parsedCompanyId,
                })),
            };

            const createdCategory = await CategoryService.createCategory(formDataToSubmit);
            console.log("Categoría creada exitosamente");
            navigate('../especies');
        } catch (error) {
            console.error("Error:", error);
            console.log("Hubo un error al crear la categoría");
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
    const handleErrorAlert = (message) => {
        // Lógica para mostrar el mensaje de error, por ejemplo:
        console.error(message);
    };

    <CrearCategorias showErrorAlert={handleErrorAlert} />
    const handleCancel = () => {
        navigate('../especies');
    };

    return (
        <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-6">

                <div className="mb- py-">
                    <label  className="block text-sm font-medium text-gray-700 mb-1" >Adjuntar Logo</label>
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

            <div className="grid grid-cols-2 gap-4">
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
                                    <span className="font-medium">Etapa {index + 1}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveStage(index)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={stage.name}
                                    onChange={(e) => handleStageChange(index, 'name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    placeholder="Nombre de etapa"
                                />
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

            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-white text-gray-500 px-4 py-2 rounded border border-gray-400"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-[#168C0DFF] text-white hover:bg-[#146A0D] rounded-md"
                >
                    Crear Categoría
                </button>
            </div>

        </form>
    );
};

export default CrearCategorias;
