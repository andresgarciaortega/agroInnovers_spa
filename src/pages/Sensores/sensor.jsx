import React, { useState } from "react";
import { Bell, ChevronDown, Search } from "lucide-react";

const species = [
  { id: 1, commonName: "Mejera", scientificName: "Mejera", category: "Agua dulce", productionTime: "2021-03-19" },
  { id: 2, commonName: "Ciclidos", scientificName: "Ciclidos", category: "Agua dulce", productionTime: "2021-03-19" },
  { id: 3, commonName: "Salmon", scientificName: "Salmon", category: "Agua fría", productionTime: "2021-03-19" },
  { id: 4, commonName: "Bagre", scientificName: "Bagres", category: "Agua dulce", productionTime: "2021-03-19" },
  { id: 5, commonName: "Pez dorado", scientificName: "Peces dorados", category: "Agua dulce", productionTime: "2021-03-19" },
];

const companies = [
  { value: "empresa123", label: "Empresa 123" },
  { value: "empresa456", label: "Empresa 456" },
  { value: "empresa789", label: "Empresa 789" },
];

export default function Sensores() {
  const [selectedCompany, setSelectedCompany] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span className="cursor-pointer hover:text-primary">Gestionar especies</span>
          <span>{">"}</span>
          <span className="cursor-pointer hover:text-primary">Especies</span>
          {selectedCompany && (
            <>
              <span>{">"}</span>
              <span>{companies.find(c => c.value === selectedCompany)?.label}</span>
            </>
          )}
        </div>
      </header>

      <div>
        <button
          className="w-full flex justify-between items-center p-2 border border-gray-300 rounded"
          onClick={() => setOpen(!open)}
        >
          <div className="flex items-center">
            <Search className="mr-2 h-4 w-4" />
            {selectedCompany ? companies.find(c => c.value === selectedCompany)?.label : "Buscar...empresa"}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </button>
        {open && (
          <div className="border border-gray-300 rounded mt-2">
            <input
              type="text"
              placeholder="Buscar empresa..."
              className="p-2 w-full border-b border-gray-300"
            />
            <div className="p-2">
              {companies.map(company => (
                <div
                  key={company.value}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedCompany(company.value);
                    setOpen(false);
                  }}
                >
                  {company.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedCompany && (
        <>
          <div className="flex items-center justify-between my-6">
            <div className="relative w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar lista de especie"
                className="pl-8 p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              Crear especies
            </button>
          </div>

          <div className="bg-white rounded-lg shadow">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="w-[30px]"></th>
                  <th>Nombre común</th>
                  <th>Nombre científico</th>
                  <th>Categoría</th>
                  <th>Tiempo producción</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {species.map(species => (
                  <tr key={species.id} className="border-t">
                    <td>
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300 animate-spin" />
                    </td>
                    <td>{species.commonName}</td>
                    <td>{species.scientificName}</td>
                    <td>{species.category}</td>
                    <td>{species.productionTime}</td>
                    <td className="text-right">
                      <div className="flex justify-end space-x-2">
                        <button className="h-8 w-8 rounded-full bg-green-500" title="Ver"></button>
                        <button className="h-8 w-8 rounded-full bg-blue-500" title="Editar"></button>
                        <button className="h-8 w-8 rounded-full bg-red-500" title="Eliminar"></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <select defaultValue="6" className="p-2 border border-gray-300 rounded">
                <option value="6">6 filas por página</option>
                <option value="12">12 filas por página</option>
                <option value="24">24 filas por página</option>
              </select>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">6-6 de 50</span>
                <div className="flex space-x-1">
                  <button className="h-8 w-8 border border-gray-300 rounded">
                    <ChevronDown className="h-4 w-4 rotate-90" />
                  </button>
                  <button className="h-8 w-8 border border-gray-300 rounded">
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
