import React, { useContext, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MQTTContext } from "./MQTTCliente";

const Pesos = ({ title, topic }) => {
  const { statuses } = useContext(MQTTContext);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    console.log("Ejecutando useEffect para el tópico:", topic);

    const data = statuses[topic];

    if (Array.isArray(data) && data.length > 0) {
      console.log("Datos recibidos para gráfico de barras:", data);
      setBarData(data);
    } else {
      console.log(`No se encontraron datos válidos para el tópico: ${topic}`);
      setBarData([]);
    }
  }, [statuses[topic]]);

  return (
    <div>
      <h3>{title}</h3>
      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="hora"
              label={{
                value: "Tiempo (hh:mm:ss)",
                position: "insideBottomRight",
                offset: -5,
              }}
            />
            <YAxis
              label={{ value: "Peso (g)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="peso1" fill="#8884d8" />
            <Bar dataKey="peso2" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Pesos;
