import React, { useState, useEffect } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryService from '../../services/CategoryService';
import UploadToS3 from '../../config/UploadToS3';
import CompanyService from '../../services/CompanyService';

const EditarCategorias = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [stages, setStages] = useState([]);
    const [companyId, setCompanyId] = useState('');
    const [subcategories, setSubcategories] = useState([]);
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
        const fetchCategory = async () => {
            try {
                const categoryData = await CategoryService.getCategoryById(id);
                setName(categoryData.name);
                setImage(categoryData.image);
                setCompanyId(categoryData.company_id);
                setStages(categoryData.stages || []);
                setSubcategories(categoryData.subcategories || []);
            } catch (error) {
                console.error('Error fetching category data:', error);
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

        fetchCompanies();
        if (id) fetchCategory();
    }, [id]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleAddStage = () => setStages([...stages, { id: null, name: '', description: '' }]);
    const handleRemoveStage = (index) => setStages(stages.filter((_, i) => i !== index));

    const handleAddSubcategory = () => setSubcategories([...subcategories, { id: null, name: '' }]);
    const handleRemoveSubcategory = (index) => setSubcategories(subcategories.filter((_, i) => i !== index));

    const handleStageChange = (index, field, value) => {
        const updatedStages = [...stages];
        updatedStages[index][field] = value;
        setStages(updatedStages);
    };

    const handleSubcategoryChange = (index, value) => {
        const updatedSubcategories = [...subcategories];
        updatedSubcategories[index].name = value;
        setSubcategories(updatedSubcategories);
    };

    const handleCancel = () => navigate('../especies');

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            let imageUrl = image;
            if (image && typeof image === 'object') {
                imageUrl = await UploadToS3(image);
            }

            const parsedCompanyId = parseInt(companyId, 10);
            if (isNaN(parsedCompanyId)) {
                setShowAlertError(true);
                setMessageAlert("El ID de la empresa debe ser un número válido.");
                return;
            }

            const formDataToSubmit = {
                name,
                image: imageUrl,
                company_id: parsedCompanyId,
                stages: stages.map((stage) => ({
                    id: stage.id,
                    name: stage.name,
                    description: stage.description,
                    company_id: parsedCompanyId,
                })),
                subcategories: subcategories.map((subcategory) => ({
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

    return (
        <form onSubmit={handleSubmit} className="p-6">
            {showAlertError && <div className="alert alert-error">{messageAlert}</div>}
            <div className="mb-6">
                <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
                    onClick={() => document.getElementById('image-upload').click()}
                >
                    {image && typeof image === 'string' ? (
                        <img src={image} alt="Category" className="mx-auto h-32 object-contain" />
                    ) : (
                        <div className="text-gray-500">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-1">Subir imagen</p>
                        </div>
                    )}
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
                        {companies.map((company) => (
                            <option key={company.id} value={company.id}>
                                {company.name}
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
                        {subcategories.map((subcategory, index) => (
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Nombre de subcategoría"
                                    required
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
                        {stages.map((stage, index) => (
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Nombre de la etapa"
                                    required
                                />
                                <textarea
                                    value={stage.description}
                                    onChange={(e) => handleStageChange(index, 'description', e.target.value)}
                                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Descripción"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-between">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                    Guardar cambios
                </button>
            </div>
        </form>
    );
};

export default EditarCategorias;
