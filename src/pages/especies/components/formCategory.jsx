import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { Plus } from 'lucide-react';
import CategoryService from '../../../services/CategoryService';

const FormCategory = ({ showErrorAlert, onUpdate, category, mode, closeModal, categoryData = null }) => {
    const [name, setName] = useState(categoryData?.name || '');
    const [image, setImage] = useState(categoryData?.image || null);
    const [stages, setStages] = useState(categoryData?.stages || []);
    const [subcategories, setSubcategories] = useState(categoryData?.subcategories || []);
    const [showAlertError, setShowAlertError] = useState(false);
    const [messageAlert, setMessageAlert] = useState("");

    useEffect(() => {
        if (mode === 'edit' || mode === 'view') {
            setName(category?.name || '');
            setImage(category?.image || null);
            setStages(category?.stages || []);
            setSubcategories(category?.subcategories || []);
        } else {
            setName('');
            setImage(null);
            setStages([]);
            setSubcategories([]);
        }
    }, [category, mode]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            let imageUrl = image;

            if (image) {
                // Si hay una imagen, sube a S3
                imageUrl = await UploadToS3(image); // Subir imagen a S3 y obtener la URL
            }

            const formData = {
                name,
                image: imageUrl,
                stages,
                subcategories,
            };

            if (mode === 'create') {
                await CategoryService.createCategory(formData);
                showErrorAlert('creada');
            } else if (mode === 'edit') {
                await CategoryService.updateCategory(category.id, formData);
                showErrorAlert('editada');
            }

            onUpdate();
            closeModal();
        } catch (error) {
            console.error("Error:", error);
            setMessageAlert("Hubo un error al guardar.");
            setShowAlertError(true);
        }
    };

    const handleAddStage = () => {
        setStages([...stages, { name: '', description: '' }]);
    };

    const handleRemoveStage = (index) => {
        setStages(stages.filter((_, i) => i !== index));
    };

    const handleAddSubcategory = () => {
        setSubcategories([...subcategories, { name: '' }]);
    };

    const handleRemoveSubcategory = (index) => {
        setSubcategories(subcategories.filter((_, i) => i !== index));
    };

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

    return (
        <form onSubmit={handleSubmit} className="p-6">
            {/* Imagen de categoría */}
            <div className="mb-6">
                <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
                    onClick={() => document.getElementById('image-upload').click()}
                >
                    {image ? (
                        <img src={URL.createObjectURL(image)} alt="Category" className="mx-auto h-32 object-contain" />
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

            {/* Nombre de la categoría */}
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

            {/* Etapas */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Etapas</label>
                <button
                    type="button"
                    onClick={handleAddStage}
                    className="mb-2 inline-flex items-center px-3 py-2 border border-green-500 text-sm leading-4 font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    <Plus size={16} className="mr-2" />
                    Añadir etapas
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 mb-2"
                                placeholder="Nombre de etapa"
                            />
                            <input
                                type="text"
                                value={stage.description}
                                onChange={(e) => handleStageChange(index, 'description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                placeholder="Descripción de etapa"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Subcategorías */}
            {stages.length > 0 && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subcategorías</label>
                    <button
                        type="button"
                        onClick={handleAddSubcategory}
                        className="mb-2 inline-flex items-center px-3 py-2 border border-green-500 text-sm leading-4 font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    placeholder="Nombre de subcategoría"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                    {mode === 'create' ? 'Crear categoría' : 'Actualizar categoría'}
                </button>
            </div>
        </form>
    );
};

export default FormCategory;
