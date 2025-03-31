import React, { useEffect, useState } from "react";
import Select from "react-select";
import { IoSearch } from "react-icons/io5";
import CompanyService from "../../services/CompanyService";
import { useCompanyContext } from "../../context/CompanyContext";

const CompanySelector = ({ update }) => {
    const [companyList, setCompanyList] = useState([]);
    const { selectedCompanyUniversal, setSelectedCompanyUniversal, shouldUpdate, showHidden } = useCompanyContext();

    // 1. Cargar lista de empresas
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
    }, [shouldUpdate]);

    // 2. Sincronizar contexto con localStorage (mejorado)
    useEffect(() => {
        const handleStorageSync = () => {
            const savedCompany = JSON.parse(localStorage.getItem("selectedCompany"));
            
            // Si hay cambios en el localStorage y es diferente al contexto
            if (savedCompany && (!selectedCompanyUniversal || savedCompany.value !== selectedCompanyUniversal.value)) {
                setSelectedCompanyUniversal(savedCompany);
            }
            
            // Si no hay nada en el localStorage pero hay algo en el contexto, limpiar
            if (!savedCompany && selectedCompanyUniversal) {
                setSelectedCompanyUniversal(null);
            }
        };

        // Ejecutar al montar y escuchar cambios de storage
        handleStorageSync();
        window.addEventListener('storage', handleStorageSync);

        return () => {
            window.removeEventListener('storage', handleStorageSync);
        };
    }, [selectedCompanyUniversal, setSelectedCompanyUniversal]);

    // 3. Manejar cambio de selección (actualiza contexto y localStorage)
    const handleCompanyChange = (selectedOption) => {
        setSelectedCompanyUniversal(selectedOption);
        localStorage.setItem("selectedCompany", JSON.stringify(selectedOption));
    };

    return (
        <div className={`w-100 selectorUniversal ${showHidden ? '' : 'hidden'}`}>
            <Select
                className="w-full"
                onChange={handleCompanyChange}
                options={companyList.map((company) => ({
                    value: company.id,
                    label: company.name
                }))}
                placeholder="Seleccionar empresa"
                isSearchable={true}
                value={selectedCompanyUniversal}
                classNamePrefix="select"
            />
        </div>
    );
};

export default CompanySelector;