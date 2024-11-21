import React, { createContext, useContext, useState, useEffect } from "react";

// Crear el contexto
const CompanyContext = createContext();

// Proveedor del contexto
export const CompanyProvider = ({ children }) => {
    const [selectedCompanyUniversal, setSelectedCompanyUniversal] = useState(() => {
        // Intentar leer la empresa guardada en localStorage
        const savedCompany = localStorage.getItem("selectedCompany");
        return savedCompany ? JSON.parse(savedCompany) : {}; // Si no existe, dejarlo en null
    });

    // Guardar la empresa seleccionada en localStorage cada vez que cambie
    useEffect(() => {
        if (selectedCompanyUniversal) {
            localStorage.setItem("selectedCompany", JSON.stringify(selectedCompanyUniversal)); // Guardamos el ID y nombre
        }
    }, [selectedCompanyUniversal]);

    return (
        <CompanyContext.Provider value={{ selectedCompanyUniversal, setSelectedCompanyUniversal }}>
            {children}
        </CompanyContext.Provider>
    );
};

// Hook para acceder al contexto de forma sencilla
export const useCompanyContext = () => useContext(CompanyContext);
