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
        if (!isLotesFetched) return;

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
                            const updateDate = now.toISOString().split('T')[0];
                            const updateTime = now.toTimeString().split(' ')[0].substring(0, 5);

                            // Obtener la primera especie del lote de producción
                            const productionLotSpecies = item.productionLotSpecies?.[0];
                            // Obtener la primera variable de la especie
                            const variable = productionLotSpecies?.specie?.variables?.[0];
                            // Obtener el ID del tipo de variable
                            const typeVariableId = variable?.typeVariable?.id || null;
                            // Obtener el ID de la variable misma
                            const variableId = variable?.id || null;
                            console.log("va a guardar")
                            await handleSubmit({
                                company_id: item.company_id,
                                productionLotId: id,
                                specieId: productionLotSpecies?.specie?.id || null,
                                typeVariableId: typeVariableId, // Usamos el ID del tipo de variable
                                variableTrackingReports: [
                                    {
                                        variableId: variableId, // Usamos el ID de la variable
                                        updateDate,
                                        updateTime,
                                        weightAmount: newData.value
                                    }
                                ]
                            });




                            // Llamar a la API del actuador después de guardar
                            if (control.actuator) {
                                console.log("activando actuador")
                                const actuatorInputPort = control.actuator.inputPort;
                                const actuatorActivationPort = control.actuator.activationPort;
                                const actuatorUrl = `http://127.0.0.1:1880/request?id_c=${actuatorInputPort}&id_a=${actuatorActivationPort}&state=true`;
                                console.log("respuesta activación actuador : ", actuatorUrl)

                                console.log(`🟠 Activando actuador para Lote: ${lotCode} (ID: ${id})`);
                                console.log(`URL de activación: ${actuatorUrl}`);

                                try {
                                    const actuatorResponse = await fetch(actuatorUrl);
                                    const actuatorData = await actuatorResponse.json();
                                    console.log("📌 Respuesta API de actuador:", actuatorData);
                                } catch (error) {
                                    console.error(`❌ Error al activar actuador para Lote ${lotCode} (ID: ${id})`, error);
                                }
                            }



                        }

                    } catch (error) {
                        console.error(`❌ Error en API para Lote ${lotCode} (ID: ${id})`, error);
                    }

                    await new Promise(resolve => setTimeout(resolve, 30000));
                }
            }
        }
    };

    // 🔄 Función de guardado de reportes
    const handleSubmit = async (formData) => {
        console.log("va a guardando ", formData)

        try {
            const preparedData = {
                productionLotId: parseInt(formData.productionLotId, 10),
                specieId: null,
                speciesData: true,
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
        if (!isLotesFetched) console.log("ya se cargo "); // 🔥 Evita ejecutar `syncData` antes de que `fetchLotes` termine

        if (!isLotesFetched) return; // 🔥 Evita ejecutar `syncData` antes de que `fetchLotes` termine

        syncData(); // 🔥 Primera ejecución inmediata

        const interval = setInterval(syncData, 60000); // 🔥 Luego cada 1 min
        return () => clearInterval(interval);
    }, [isLotesFetched]); // 🔥 Se activa solo cuando `isLotesFetched` cambia a `true`

    return data;
};

export default useDataSync;
