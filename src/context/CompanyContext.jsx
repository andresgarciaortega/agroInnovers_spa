import React, { createContext, useContext, useState, useEffect } from "react";

const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [selectedCompanyUniversal, setSelectedCompanyUniversal] = useState(() => {
    const savedCompany = localStorage.getItem("selectedCompany");
    return savedCompany ? JSON.parse(savedCompany) : null;
  });

  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [showHidden, setShowHidden] = useState(() => {
    const savedHiddenState = localStorage.getItem("selectorHidden");
    return savedHiddenState ? JSON.parse(savedHiddenState) : true;
  });

  const triggerUpdate = () => {
    setShouldUpdate((prev) => !prev);
  };

  const hiddenSelect = (tipo) => {
    setShowHidden(tipo);
    localStorage.setItem("selectorHidden", JSON.stringify(tipo));
  };

  useEffect(() => {
    if (selectedCompanyUniversal) {
      localStorage.setItem(
        "selectedCompany",
        JSON.stringify(selectedCompanyUniversal)
      );
    }
  }, [selectedCompanyUniversal]);

  useEffect(() => {
    localStorage.setItem("selectorHidden", JSON.stringify(showHidden));
  }, [showHidden]);

  return (
    <CompanyContext.Provider
      value={{
        selectedCompanyUniversal,
        setSelectedCompanyUniversal,
        shouldUpdate,
        triggerUpdate,
        showHidden,
        hiddenSelect,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompanyContext = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompanyContext must be used within a CompanyProvider");
  }
  return context;
};

export default CompanyContext;