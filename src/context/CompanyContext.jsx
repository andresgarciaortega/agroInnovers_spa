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

    const [shouldUpdate, setShouldUpdate] = useState(false);
    const [showHidden, setSshowHidden] = useState(true);

    const triggerUpdate = () => {
        setShouldUpdate((prev) => !prev); // Cambiará de `true` a `false` y viceversa
    };

    const hiddenSelect = (tipo) => {
        console.log("showHidden : ", showHidden)
        setSshowHidden(tipo); // Cambiará de `true` a `false` y viceversa
    };


    // Guardar la empresa seleccionada en localStorage cada vez que cambie
    useEffect(() => {
        if (selectedCompanyUniversal) {
            localStorage.setItem("selectedCompany", JSON.stringify(selectedCompanyUniversal)); // Guardamos el ID y nombre
        }
    }, [selectedCompanyUniversal]);

    return ( 
        <CompanyContext.Provider value={{ selectedCompanyUniversal, setSelectedCompanyUniversal, shouldUpdate, triggerUpdate, showHidden, hiddenSelect  }}>
            {children}
        </CompanyContext.Provider>
    );
};  

// Hook para acceder al contexto de forma sencilla
export const useCompanyContext = () => useContext(CompanyContext);
