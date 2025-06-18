import { useEffect, useState } from "react";
import ReporteService from "../services/LoteSeguimiento";
import LoteService from "../services/lotesService";
import { useCompanyContext } from "../context/CompanyContext";
import SystemMonitory from "../services/monitoreo";

const useDataSync = () => {
    const { selectedCompanyUniversal } = useCompanyContext();
    const [data, setData] = useState([]);
    const [isLotesFetched, setIsLotesFetched] = useState(false); // 🔥 Para saber si `fetchLotes` ya corrió
    const [uuidObtenido, setuuidObtenido] = useState()
    // 🔄 Función para obtener lotes con o sin internet
    const fetchLotes = async () => {

        let uuidRespuesta = ''
        try {
            const uuidResponse = await fetch('http://localhost:1880/serial_id');
            if (uuidResponse.ok) {
                const uuid = await uuidResponse.json();
                ("response : ", uuid)
                if (uuid?.serial_pi) {
                    uuidRespuesta = uuid.serial_pi;
                    setuuidObtenido(uuid.serial_pi);
                    localStorage.setItem("uuid", uuid.serial_pi);
                }
            }
        } catch (uuidError) {
            console.warn("No se pudo obtener el UUID del dispositivo:", uuidError);
        }


        try {
            const companyId = await SystemMonitory.getMotitoriesByUUID(uuidRespuesta);
            if (!companyId) {
                return;
            }

            let response = [];

            if (navigator.onLine) {
                response = await LoteService.getAllLots(companyId.company_id);
                setData(response);
            }
            // else {
            //     console.warn("🚫 Sin conexión a Internet. Cargando datos desde localStorage...");
            //     response = JSON.parse(localStorage.getItem("cache_/production-lots"))?.data || [];
            //     setData(response);
            // }

            setIsLotesFetched(true); // 🔥 Marcamos que `fetchLotes` ya se ejecutó
        } catch (error) {
            console.error("❌ Error al obtener los lotes:", error);
            setData([]);
        }
    };

    // 🔄 Función de sincronización de datos
    const syncData = async () => {
        if (!isLotesFetched) return;
        if (!uuidObtenido) {
            console.warn("UUID no disponible. Cancelando sincronización.");
            return;
        }
        // Procesar cada lote secuencialmente
        for (const item of data) {
            const { id, lotCode, productionSpace, status } = item;
            const ipFija = item?.productionSpace?.monitoringSystemId?.ipFija || '';

            // Filtrar por estado y coincidencia de UUID con ipFija
            if (status !== "Producción" || ipFija !== uuidObtenido) {
                continue;
            }

            if (!productionSpace?.configureMeasurementControls) {
                continue;
            }
            // Procesar cada control de medición secuencialmente
            for (const control of productionSpace.configureMeasurementControls) {
                const sensor = control.sensor;
                if (!sensor) {
                    continue;
                }
                const Puerto_de_entrada = sensor.inputPort;
                const Puerto_de_lectura = sensor.readingPort;
                try {
                    // 1. Lectura del sensor con tiempo mínimo de espera
                    const startTime = Date.now();
                    const response = await fetch(`http://127.0.0.1:1880/request?id_d=${Puerto_de_entrada}&id_s=${Puerto_de_lectura}`);
                    const newData = await response.json();

                    if (newData.error) {
                        console.error(`❌ Error en lectura del sensor: ${newData.error}`);
                        continue; // Saltar a siguiente control si hay error
                    }

                    // 2. Procesamiento de datos
                    const now = new Date();
                    const updateDate = now.toISOString().split('T')[0];
                    const updateTime = now.toTimeString().split(' ')[0].substring(0, 5);

                    const productionLotSpecies = item.productionLotSpecies?.[0];
                    const variable = productionLotSpecies?.specie?.variables?.[0];
                    const typeVariableId = control.variable_production.typeVariable.id || null;
                    const variableId = variable?.id || null;

                    // 3. Guardado de datos
                    await handleSubmit({
                        company_id: item.company_id,
                        productionLotId: id,
                        specieId: productionLotSpecies?.specie?.id || null,
                        typeVariableId,
                        variableTrackingReports: [
                            {
                                variableId,
                                updateDate,
                                updateTime,
                                weightAmount: newData.value.toString()  // Convertir el valor a string
                            }
                        ]
                    });

                    // 4. Activación de actuador si existe
                    if (control.actuator) {
                        const actuatorInputPort = control.actuator.inputPort;
                        const actuatorActivationPort = control.actuator.activationPort;
                        const actuatorUrl = `http://127.0.0.1:1880/request?id_c=${actuatorInputPort}&id_a=${actuatorActivationPort}&state=true`;

                        try {
                            const actuatorResponse = await fetch(actuatorUrl);
                            const actuatorData = await actuatorResponse.json();
                        } catch (error) {
                            console.error(`❌ Error al activar actuador para Lote ${lotCode} (ID: ${id})`, error);
                        }
                    }

                    // 5. Calcular tiempo restante para cumplir con el mínimo de 20 segundos
                    const elapsed = Date.now() - startTime;
                    const remainingTime = Math.max(20000 - elapsed, 0);
                    await new Promise(resolve => setTimeout(resolve, remainingTime));

                } catch (error) {
                    console.error(`❌ Error en procesamiento para Lote ${lotCode} (ID: ${id})`, error);
                    // Esperar 20 segundos incluso si hay error
                    await new Promise(resolve => setTimeout(resolve, 20000));
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
                speciesData: true,
                typeVariableId: parseInt(formData.typeVariableId, 10),
                company_id: parseInt(formData.company_id, 10),
                variableTrackingReports: formData.variableTrackingReports
            };

            const response = await ReporteService.createReporte(preparedData);
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

        const interval = setInterval(syncData, 15000); // 🔥 Luego cada 1 min
        return () => clearInterval(interval);
    }, [isLotesFetched]); // 🔥 Se activa solo cuando `isLotesFetched` cambia a `true`

    return data;
};

export default useDataSync;
