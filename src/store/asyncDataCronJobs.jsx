import { useEffect, useState } from "react";
import ReporteService from "../services/LoteSeguimiento";
import LoteService from "../services/lotesService";
import { useCompanyContext } from "../context/CompanyContext";

const useDataSync = () => {
    const { selectedCompanyUniversal } = useCompanyContext();
    const [data, setData] = useState([]);
    const [isLotesFetched, setIsLotesFetched] = useState(false); // 🔥 Para saber si `fetchLotes` ya corrió

    // 🔄 Función para obtener lotes con o sin internet
    const fetchLotes = async () => {
        try {
            const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : "";
            if (!companyId) {
                setData([]);
                return;
            }

            console.log("▶ Iniciando petición inicial...");
            let response = [];

            if (navigator.onLine) {
                console.log("🔗 Conectado a Internet. Obteniendo datos de la API...");
                response = await LoteService.getAllLots(48);
                setData(response);
            } else {
                console.warn("🚫 Sin conexión a Internet. Cargando datos desde localStorage...");
                response = JSON.parse(localStorage.getItem("cache_/production-lots"))?.data || [];
                setData(response);
            }

            console.log("📌 Datos de lotes obtenidos:", response);
            setIsLotesFetched(true); // 🔥 Marcamos que `fetchLotes` ya se ejecutó
        } catch (error) {
            console.error("❌ Error al obtener los lotes:", error);
            setData([]);
        }
    };

    // 🔄 Función de sincronización de datos
    const syncData = async () => {
        if (!isLotesFetched) return; // 🔥 Solo ejecutar si `fetchLotes` ya corrió

        console.log("⚡ Ejecutando syncData...");
        for (const item of data) {
            const { id, lotCode, productionSpace } = item;

            if (productionSpace && productionSpace.configureMeasurementControls) {
                for (const control of productionSpace.configureMeasurementControls) {
                    const sensor = control.sensor;
                    if (!sensor) continue;

                    const Puerto_de_entrada = sensor.inputPort;
                    const Puerto_de_lectura = sensor.readingPort;

                    console.log(`🟢 Ejecutando API para Lote: ${lotCode} (ID: ${id})`);

                    try {
                        const response = await fetch(`http://127.0.0.1:1880/request?id_d=${Puerto_de_entrada}&id_s=${Puerto_de_lectura}`);
                        const newData = await response.json();

                        console.log("📌 Respuesta API de newRed:", newData);

                        if (newData && !newData.error) {
                            const now = new Date();
                            const updateDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
                            const updateTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM

                            const variableId = item.productionLotSpecies?.[0]?.specie?.variables?.[0]?.typeVariable.id || null;

                            await handleSubmit({
                                company_id: item.company_id,
                                productionLotId: id,
                                specieId: null,
                                typeVariableId: control.id,
                                variableTrackingReports: [
                                    {
                                        variableId,
                                        updateDate,
                                        updateTime,
                                        weightAmount: newData.value
                                    }
                                ]
                            });
                        }
                    } catch (error) {
                        console.error(`❌ Error en API para Lote ${lotCode} (ID: ${id})`, error);
                    }

                    // ⏳ Esperar 30 segundos antes de la siguiente petición
                    await new Promise(resolve => setTimeout(resolve, 30000));
                }
            }
        }
    };

    // 🔄 Función de guardado de reportes
    const handleSubmit = async (formData) => {
        try {
            const preparedData = {
                productionLotId: parseInt(formData.productionLotId, 10),
                specieId: null,
                typeVariableId: parseInt(formData.typeVariableId, 10),
                company_id: parseInt(formData.company_id, 10),
                variableTrackingReports: formData.variableTrackingReports
            };

            const response = await ReporteService.createReporte(preparedData);
            console.log("✅ Reporte de seguimiento creado:", response);
        } catch (error) {
            console.error("❌ Error al crear el reporte:", error);
        }
    };

    // 🔄 Efecto para ejecutar `fetchLotes` cada 30s
    useEffect(() => {
        fetchLotes(); // 🔥 Se ejecuta una vez al montar

        const interval = setInterval(fetchLotes, 30000); // 🔥 Se repite cada 30s
        return () => clearInterval(interval);
    }, [selectedCompanyUniversal]);

    // 🔄 Efecto para ejecutar `syncData` cada 1 min, pero solo si `fetchLotes` ya corrió
    useEffect(() => {
        if (!isLotesFetched) return; // 🔥 Evita ejecutar `syncData` antes de que `fetchLotes` termine

        syncData(); // 🔥 Primera ejecución inmediata

        const interval = setInterval(syncData, 60000); // 🔥 Luego cada 1 min
        return () => clearInterval(interval);
    }, [isLotesFetched]); // 🔥 Se activa solo cuando `isLotesFetched` cambia a `true`

    return data;
};

export default useDataSync;
