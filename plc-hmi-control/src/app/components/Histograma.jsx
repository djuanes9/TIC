import React, { useContext, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  Brush,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MQTTContext } from "./MQTTCliente"; // Importar el contexto MQTT

const Histograma = ({ title, topic }) => {
  const { statuses, sendMessage } = useContext(MQTTContext); // Extraer los estados y la función para enviar mensajes MQTT
  const [histogramData, setHistogramData] = useState([]); // Estado para los datos del histograma
  const [selectedDate, setSelectedDate] = useState(""); // Estado para la fecha seleccionada
  const [hasData, setHasData] = useState(false); // Estado para controlar si hay datos o no

  // Función para enviar la fecha seleccionada a Node-RED vía MQTT
  const sendDateToNodeRed = () => {
    if (selectedDate && topic) {
      sendMessage(
        "fecha/seleccionada",
        JSON.stringify({ date: selectedDate, topic })
      ); // Enviar la fecha y el tópico
      console.log("Fecha y tópico enviados:", selectedDate, topic);
    }
  };

  // Manejar el cambio de la fecha seleccionada
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value); // Actualizar el estado de la fecha
  };

  // Suscribirse a los datos desde MQTT y procesarlos para el histograma según el tópico y la fecha seleccionada
  useEffect(() => {
    if (statuses[topic]) {
      // Chequea si hay datos para el tópico actual
      try {
        const data = statuses[topic];

        if (Array.isArray(data) && data.length === 0) {
          console.log("No hay datos para la fecha seleccionada.");
          setHistogramData([]); // Vaciar los datos del gráfico
          setHasData(false); // Marcar que no hay datos
        } else if (data) {
          let parsedData;

          if (typeof data === "object") {
            parsedData = data;
          } else {
            parsedData = JSON.parse(data);
          }

          console.log("Datos recibidos:", parsedData);
          setHistogramData(parsedData); // Setear los datos al gráfico
          setHasData(true); // Marcar que hay datos
        }
      } catch (error) {
        console.error(`Error al procesar los datos (${topic}):`, error);
        setHistogramData([]); // Vaciar los datos del gráfico en caso de error
        setHasData(false); // Marcar que no hay datos
      }
    }
  }, [statuses, topic, selectedDate]); // Asegurarse de que se ejecute también cuando cambie el tópico o la fecha seleccionada

  return (
    <div>
      <h3>{title}</h3>

      {/* Selector de fecha */}
      <div>
        <input type="date" value={selectedDate} onChange={handleDateChange} />
        <button onClick={sendDateToNodeRed}>Consultar datos</button>
      </div>

      {/* Mostrar mensaje dependiendo de si hay o no datos */}
      <div>
        {hasData ? (
          <h3>Fecha: {selectedDate}</h3>
        ) : (
          <h3>No existen registros para la fecha y el tópico seleccionados</h3>
        )}
      </div>

      {/* Histograma (se muestra vacío si no hay datos) */}
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" /> {/* Eje X de los datos */}
            <YAxis />
            <Tooltip />
            <Legend />
            <Brush dataKey="x" height={30} stroke="#8884d8" />
            <Line
              dataKey="Nivel" // Cambia este valor según el dato que representa el tópico
              fill="#8884d8"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Histograma;
