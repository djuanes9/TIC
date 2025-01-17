import React, { useContext, useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MQTTContext } from "./MQTTCliente";

const COLORS = ["#00C49F", "#FF8042", "#0088FE"];

const Tiempos = ({ topic }) => {
  const { statuses } = useContext(MQTTContext); // Obtener datos del contexto MQTT
  const [tiempoData, setTiempoData] = useState([]);
  const [detalles, setDetalles] = useState({ screw: 0, mill: 0, others: 0 });

  // Suscribirse al tópico y actualizar los datos del gráfico
  useEffect(() => {
    if (statuses[topic]) {
      try {
        const data = statuses[topic];
        console.log(`Datos de tiempos recibidos (${topic}):`, data);

        // Parsear el payload si es necesario
        const parsedData = typeof data === "string" ? JSON.parse(data) : data;

        // Formatear los datos para el gráfico con las nuevas variables
        setTiempoData([
          {
            name: "Screw",
            value: parseFloat(parsedData.PorcentajeScrew),
          },
          {
            name: "Mill",
            value: parseFloat(parsedData.PorcentajeMill),
          },
          {
            name: "Others",
            value: parseFloat(parsedData.PorcentajeOthers),
          },
        ]);

        // Actualizar los detalles de tiempo
        setDetalles({
          screw: parsedData.TimeScrew,
          mill: parsedData.TimeMill,
          others: parsedData.TimeOthers,
        });
      } catch (error) {
        console.error(`Error al procesar los datos (${topic}):`, error);
      }
    }
  }, [statuses, topic]);

  return (
    <div>
      <h3>Diagrama de Tiempos</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={tiempoData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {tiempoData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ marginTop: "20px" }}>
        <p>
          <strong>Tiempo Screw:</strong> {detalles.screw} segundos
        </p>
        <p>
          <strong>Tiempo Mill:</strong> {detalles.mill} segundos
        </p>
        <p>
          <strong>Tiempo Others:</strong> {detalles.others} segundos
        </p>
      </div>
    </div>
  );
};

export default Tiempos;
