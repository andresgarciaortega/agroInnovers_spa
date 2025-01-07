import React, { useEffect, useState } from "react";
import Select from "react-select";
import { IoSearch } from "react-icons/io5";
import CompanyService from "../../services/CompanyService";
import { useCompanyContext } from "../../context/CompanyContext";

const CompanySelector = () => {
    const [companyList, setCompanyList] = useState([]);
    const { selectedCompanyUniversal, setSelectedCompanyUniversal } = useCompanyContext(); // Accede al estado global

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const data = await CompanyService.getAllCompany();
                setCompanyList(data);
            } catch (error) {
                console.error("Error fetching companies:", error);
            }
        }; 
        fetchCompanies(); 
    }, []);

    // Leer empresa del localStorage y establecerla como valor predeterminado en el contexto si no hay selección
    useEffect(() => {
        const savedCompany = localStorage.getItem("selectedCompany");
        if (savedCompany && !selectedCompanyUniversal) {
            // Si hay una empresa guardada en localStorage y no se ha seleccionado ninguna
            const company = JSON.parse(savedCompany); 
            console.log("company ---> ", company)
            setSelectedCompanyUniversal(company); // Establecemos la empresa del localStorage como seleccionada
        }
    }, [selectedCompanyUniversal, setSelectedCompanyUniversal]);

    // Manejar el cambio de selección
    const handleCompanyChange = (selectedOption) => {
        setSelectedCompanyUniversal(selectedOption); // Actualiza el contexto con la opción seleccionada
    };

    return (
        <div className="relative w-full">
            <Select
                className="w-full"
                onChange={handleCompanyChange}
                options={companyList.map((company) => ({
                    value: company.id,
                    label: company.name
                }))}
                placeholder="Seleccionar empresa"
                isSearchable={true}
                value={selectedCompanyUniversal} // Esto se asegura de que el valor se mantenga seleccionado
                classNamePrefix="select"
            />
            <IoSearch className="absolute right-11 top-3 text-gray-500" />
        </div>
    );
};

export default CompanySelector;
