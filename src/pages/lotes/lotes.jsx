"use client";

import React, { useState } from "react";

const SpeciesInfo = ({ name, value, isOpen, onToggle, details }) => {
  return (
    <div className={`collapsible ${isOpen ? "open" : ""}`}>
      <button onClick={onToggle} className="collapsible-trigger w-full flex justify-between border p-2">
        <span>{name}</span>
        <div className="flex items-center gap-2">
          <span>{value}</span>
          <span className={`transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
        </div>
      </button>
      {isOpen && details && (
        <div className="collapsible-content pt-2 px-4 text-sm space-y-2">
          <p>Etapa: {details.stage}</p>
          <p>Peso inicial: {details.initialWeight}</p>
          <div className="flex items-center justify-between">
            <p>N° individuos vivos:</p>
            <div className="flex items-center gap-2">
              <span>{details.liveCount.value}</span>
              <span className="text-xs text-gray-500">({details.liveCount.date})</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p>N° individuos muertos:</p>
            <div className="flex items-center gap-2">
              <span>{details.deadCount.value}</span>
              <span className="text-xs text-gray-500">({details.deadCount.date})</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p>{details.feed.type}</p>
            <span className="text-xs text-gray-500">({details.feed.date})</span>
          </div>
          <div className="flex items-center justify-between">
            <p>Recambio de agua:</p>
            <div className="flex items-center gap-2">
              <span>{details.waterChange.amount}</span>
              <span className="text-xs text-gray-500">({details.waterChange.date})</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Lotes = ({
  lotNumber,
  status,
  plantingDate,
  harvestDate,
  hasWarning,
  showHarvestButton,
}) => {
  const [openSpecies, setOpenSpecies] = useState(null);

  return (
    <div className="card w-full border rounded-lg shadow-sm">
      <div className="card-content p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Lote {lotNumber}</h3>
          <div className="flex gap-2">
            <button className="text-gray-500">👁</button>
            <button className="text-gray-500">📋</button>
            <button className="text-gray-500">🗑</button>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">Estado: {status}</p>
          <p className="text-sm text-gray-600">Fecha de siembra: {plantingDate}</p>
          <p className="text-sm text-gray-600">Fecha cosecha: {harvestDate}</p>

          {hasWarning && (
            <div className="text-red-500 text-sm flex items-center gap-2">
              ⚠️ <span>Faltan 5 meses y 30 días para la cosecha</span>
            </div>
          )}

          <SpeciesInfo
            name="Trucha"
            value="1150"
            isOpen={openSpecies === "trucha"}
            onToggle={() => setOpenSpecies(openSpecies === "trucha" ? null : "trucha")}
            details={{
              stage: "Alevino",
              initialWeight: "30 kg",
              liveCount: { value: 1000, date: "20/01/2024" },
              deadCount: { value: 0, date: "20/01/2024" },
              feed: { type: "Alimento 28% 6 bullets", date: "20/01/2024" },
              waterChange: { amount: "500 m3", date: "20/01/2024" },
            }}
          />
          <SpeciesInfo
            name="Tilapia"
            value="1150"
            isOpen={openSpecies === "tilapia"}
            onToggle={() => setOpenSpecies(openSpecies === "tilapia" ? null : "tilapia")}
            details={{
              stage: "Alevino",
              initialWeight: "30 kg",
              liveCount: { value: 1000, date: "20/01/2024" },
              deadCount: { value: 0, date: "20/01/2024" },
              feed: { type: "Alimento 28% 6 bullets", date: "20/01/2024" },
              waterChange: { amount: "500 m3", date: "20/01/2024" },
            }}
          />
        </div>
      </div>

      <div className="card-footer p-4 flex flex-col gap-2">
        <button className="w-full bg-blue-500 text-white py-2 rounded">Crear reporte de seguimiento</button>
        {showHarvestButton && (
          <button className="w-full border py-2 rounded">Cierre y cosecha</button>
        )}
      </div>
    </div>
  );
};

export default Lotes;
