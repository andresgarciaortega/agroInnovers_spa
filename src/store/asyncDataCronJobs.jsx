import { useEffect, useState } from "react";

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
      const storedData = JSON.parse(localStorage.getItem("cache_/production-lots")) || [];

      for (const item of storedData.data) {
        const { id, productionSpace } = item;

        // Validar si tiene datos de medición
        if (productionSpace && productionSpace.configureMeasurementControls) {
          for (const control of productionSpace.configureMeasurementControls) {
            const sensor = control.sensor;
            if (!sensor) continue; // Si no tiene sensor, saltar a la siguiente iteración

            const Puerto_de_entrada = sensor.inputPort; // Puerto de entrada
            const Puerto_de_lectura = sensor.readingPort; // Puerto de lectura

            console.log(`🟢 Ejecutando API para ID: ${id}, Puerto Entrada: ${Puerto_de_entrada}, Puerto Lectura: ${Puerto_de_lectura}`);

            try {
              const response = await fetch(`http://127.0.0.1:1880/request?id_d=${Puerto_de_entrada}&id_s=${Puerto_de_lectura}`);
              const newData = await response.json();
              console.log("📌 Respuesta API de newRed:", newData);
            } catch (error) {
              console.error(`❌ Error en API para ID: ${id}`, error);
            }
          }
        }
      }
    };

    // Ejecutar al montar y cada 1 minuto verificar
    syncData();
    const interval = setInterval(syncData, 60000);

    return () => clearInterval(interval);
  }, []);

  return data;
};

export default useDataSync;
