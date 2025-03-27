import { useEffect, useState } from "react";
import ReporteService from "../services/LoteSeguimiento";
import LoteService from "../services/lotesService";
import { useCompanyContext } from "../context/CompanyContext";

// Función auxiliar para calcular si ya pasó el tiempo requerido
const hasTimeElapsed = (lastValidation, frequency, unit) => {
    if (!lastValidation) return true; // Si no hay fecha previa, ejecutar de inmediato

    const now = new Date();
    const lastValidationDate = new Date(lastValidation);
    let nextExecutionDate = new Date(lastValidationDate);

    switch (unit) {
        case "meses":
            nextExecutionDate.setMonth(nextExecutionDate.getMonth() + frequency);
            break;
        case "semanas":
            nextExecutionDate.setDate(nextExecutionDate.getDate() + frequency * 7);
            break;
        case "días":
            nextExecutionDate.setDate(nextExecutionDate.getDate() + frequency);
            break;
        case "horas":
            nextExecutionDate.setHours(nextExecutionDate.getHours() + frequency);
            break;
        case "minutos":
            nextExecutionDate.setMinutes(nextExecutionDate.getMinutes() + frequency);
            break;
        default:
            return false;
    }

    return now >= nextExecutionDate;
};

// Hook personalizado para sincronizar datos según la frecuencia
const useDataSync = () => {
    const { selectedCompanyUniversal } = useCompanyContext();
    const [data, setData] = useState();

    console.log("▶ Iniciando petición inicial...");
 
    // Función para obtener lotes con o sin internet
    const fetchLotes = async () => {
        try {
            const companyId = selectedCompanyUniversal ? selectedCompanyUniversal.value : "";
            if (!companyId) {
                setData([]);
                return [];
            }
    
            if (navigator.onLine) {
                console.log("🔗 Conectado a Internet. Obteniendo datos de la API...");
                const response = await LoteService.getAllLots(48);
                console.log("companyId : ", companyId)
                console.log(" response : ", response)
                setData(response);
                return response; // 🔥 Aquí se devuelve la data correctamente
            } else {
                console.warn("🚫 Sin conexión a Internet. Cargando datos desde localStorage...");
                const storedData = JSON.parse(localStorage.getItem("cache_/production-lots")) || { data: [] };
                setData(storedData.data);
                return storedData.data; // 🔥 También se devuelve en caso de no estar en línea
            }
        } catch (error) {
            console.error("❌ Error al obtener los lotes:", error);
            setData([]);
            return []; // 🔥 Se devuelve un array vacío en caso de error
        }
    };
    


    // Función de sincronización de datos
    const syncData = async () => {
        const dataPeticion = await fetchLotes(); // 🔥 Ahora capturamos los datos devueltos
        console.log("📌 Datos obtenidos:", dataPeticion);
    
        if (!Array.isArray(dataPeticion) || dataPeticion.length === 0) return; // 🔥 Usamos dataPeticion en lugar de data
    
        for (const item of dataPeticion) { // 🔥 Usamos dataPeticion aquí
            const { id, lotCode, productionSpace } = item;
    
            if (productionSpace && productionSpace.configureMeasurementControls) {
                for (const control of productionSpace.configureMeasurementControls) {
                    const sensor = control.sensor;
                    if (!sensor) continue;
    
                    const Puerto_de_entrada = sensor.inputPort;
                    const Puerto_de_lectura = sensor.readingPort;
    
                    console.log(`🟢 Ejecutando API para Lote: ${lotCode} (ID: ${id}), Puerto Entrada: ${Puerto_de_entrada}, Puerto Lectura: ${Puerto_de_lectura}`);
    
                    try {
                        const response = await fetch(`http://127.0.0.1:1880/request?id_d=${Puerto_de_entrada}&id_s=${Puerto_de_lectura}`);
                        const newData = await response.json();
    
                        console.log("📌 Respuesta API de newRed:", newData);
    
                        if (newData && !newData.error) {
                            console.log("✅ Respuesta válida. Ejecutando handleSubmit()...");
    
                            // 📅 Obtener fecha y hora del sistema
                            const now = new Date();
                            const updateDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
                            const updateTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
    
                            // 🟢 Determinar variableId desde el JSON correctamente
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
    

    // Función de guardado de reportes
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

    useEffect(() => {
        syncData();
        const interval = setInterval(syncData, 60000); // Ejecutar cada 1 minuto

        return () => clearInterval(interval);
    }, [selectedCompanyUniversal]);

    return data;
};

export default useDataSync;
