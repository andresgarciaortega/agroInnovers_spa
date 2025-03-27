import { useEffect, useState } from "react";
import ReporteService from "../services/LoteSeguimiento";

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
    const [data, setData] = useState([]);

    useEffect(() => {
        const syncData = async () => {
            const storedData = JSON.parse(localStorage.getItem("cache_/production-lots")) || { data: [] };

            if (!Array.isArray(storedData.data)) {
                console.error("❌ Error: La propiedad 'data' no es iterable.");
                return;
            }

            for (const item of storedData.data) {
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

                            // Si la respuesta es válida, ejecutar `handleSubmit()`
                            if (newData && !newData.error) {
                                console.log("✅ Respuesta válida. Ejecutando handleSubmit()...");

                                await handleSubmit({
                                    productionLotId: id,
                                    speciesData: item.productionLotSpecies || [],
                                    specieId: null,
                                    typeVariableId: control.id, // Usamos el ID del control como variable
                                    company_id: item.company_id,
                                    variableTrackingReports: [newData.value] // Guardamos el dato recibido
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

        syncData();
        const interval = setInterval(syncData, 60000); // Ejecutar cada 1 minuto

        return () => clearInterval(interval);
    }, []);


    // Función de guardado (adaptada para recibir datos)
    const handleSubmit = async (formData) => {
        try {
            const preparedData = {
                productionLotId: parseInt(formData.productionLotId, 10),
                speciesData: formData.speciesData,
                specieId: formData.specieId ? parseInt(formData.specieId, 10) : null,
                typeVariableId: parseInt(formData.typeVariableId, 10),
                company_id: parseInt(formData.company_id, 10),
                variableTrackingReports: formData.variableTrackingReports
            };

            const response = await ReporteService.createReporte(preparedData);
            console.log("✅ Reporte de seguimiento creado:", response);

            showErrorAlert("Reporte de seguimiento creado");
            onUpdate();
            closeModal();
        } catch (error) {
            console.error("❌ Error al crear el reporte:", error);
        }
    };


    return data;
};

export default useDataSync;
