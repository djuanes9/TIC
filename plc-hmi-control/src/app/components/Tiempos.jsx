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

const COLORS = ["#00C49F", "#FF8042"];

const Tiempos = ({ topic }) => {
  const { statuses } = useContext(MQTTContext); // Obtener datos del contexto MQTT
  const [tiempoData, setTiempoData] = useState([]);

  // Suscribirse al tópico y actualizar los datos del gráfico
  useEffect(() => {
    if (statuses[topic]) {
      try {
        const data = statuses[topic];
        console.log(`Datos de tiempos recibidos (${topic}):`, data);

        // Parsear el payload si es necesario
        const parsedData = typeof data === "string" ? JSON.parse(data) : data;

        // Formatear los datos para el gráfico
        setTiempoData([
          {
            name: "Encendido",
            value: parseFloat(parsedData.porcentajeEncendido),
          },
          { name: "Apagado", value: parseFloat(parsedData.porcentajeApagado) },
        ]);
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
    </div>
  );
};

export default Tiempos;
