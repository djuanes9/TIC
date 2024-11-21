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

const Chart = ({ title, topic, ylabel }) => {
  const { statuses } = useContext(MQTTContext); // Extraer los estados del contexto MQTT
  const [realTimeData, setRealTimeData] = useState([]); // Estado para datos en tiempo real

  // Suscribirse a los datos desde MQTT y procesarlos en tiempo real según el tópico
  useEffect(() => {
    if (statuses[topic]) {
      // Chequea el tópico que llega como prop
      try {
        const realTimeValue = statuses[topic]; // Datos en tiempo real para el tópico
        console.log(`TIEMPO REAL (${topic}):`, realTimeValue);

        // Generar un nuevo punto con el dato recibido y una marca de tiempo
        const newPoint = {
          x: new Date().toLocaleTimeString(),
          value: realTimeValue,
        };

        setRealTimeData((prevData) => {
          const updatedData = [...prevData, newPoint];
          if (updatedData.length > 100) {
            updatedData.shift();
          }
          return updatedData;
        });
      } catch (error) {
        console.error(
          `Error al procesar el dato en tiempo real (${topic}):`,
          error
        );
      }
    }
  }, [statuses, topic]);

  return (
    <div>
      <h3>{title}</h3>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={realTimeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="x"
              label={{
                value: "Tiempo (hh:mm:ss)",
                position: "insideBottomRight",
                offset: -5,
              }}
            />
            <YAxis
              label={{ value: `${ylabel}`, angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#82ca9d"
              strokeWidth={3}
              dot={false}
              animationDuration={5}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
