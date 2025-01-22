import React, { useEffect, useState } from "react";
import Select from "react-select";
import { IoSearch } from "react-icons/io5";
import CompanyService from "../../services/CompanyService";
import { useCompanyContext } from "../../context/CompanyContext";

const CompanySelector = ({ update }) => {
    const [companyList, setCompanyList] = useState([]);
    const { selectedCompanyUniversal, setSelectedCompanyUniversal, shouldUpdate, showHidden } = useCompanyContext(); // Accede al estado global

    useEffect(() => {
        console.log("update : ", showHidden)
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
        <div className={` w-100 selectorUniversal ${showHidden ? '' : 'hidden'}`}>
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
        </div>
    );
};

export default CompanySelector;
