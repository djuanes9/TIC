import React, { useContext, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MQTTContext } from "./MQTTCliente"; // Importar el contexto MQTT

const Chart = () => {
  const { statuses } = useContext(MQTTContext); // Extraer los estados del contexto MQTT
  const [realTimeData, setRealTimeData] = useState([]); // Estado para datos en tiempo real

  useEffect(() => {
    if (statuses["nivel/actual"] !== undefined) {
      try {
        const realTimeValue = parseFloat(statuses["nivel/actual"]); // Asegúrate de que el dato es numérico
        if (!isNaN(realTimeValue)) {
          console.log("TIEMPO REAL: ", realTimeValue);

          // Generar un nuevo punto con el número recibido y una marca de tiempo (x)
          const newPoint = {
            x: new Date().toLocaleTimeString(), // Usamos la hora actual como 'x'
            Nivel: realTimeValue, // El valor numérico es 'y'
          };

          setRealTimeData((prevData) => {
            const updatedData = [...prevData, newPoint]; // Añadir el nuevo dato

            // Limitar a 100 entradas
            if (updatedData.length > 100) {
              updatedData.shift(); // Eliminar el primer elemento si excede los 100
            }

            return updatedData;
          });
        }
      } catch (error) {
        console.error("Error al procesar el dato en tiempo real:", error);
      }
    }
  }, [statuses["nivel/actual"]]); // Escucha solo los cambios en 'nivel/actual'

  return (
    <div>
      <h1>Gráfico Tiempo Real</h1>

      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <LineChart data={realTimeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" /> {/* Eje X: Tiempo */}
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Nivel"
              stroke="#82ca9d" // Color personalizado
              strokeWidth={3} // Grosor de la línea
              dot={false} // Quitar los puntos en los datos
              animationDuration={5} // Duración de la animación
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
