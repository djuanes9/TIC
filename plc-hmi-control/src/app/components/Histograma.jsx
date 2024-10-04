import React, { useContext, useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { MQTTContext } from "./MQTTCliente"; // Importar el contexto MQTT

const Histograma = () => {
  const { statuses, sendMessage } = useContext(MQTTContext); // Extraer los estados y la función para enviar mensajes MQTT
  const [histogramData, setHistogramData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(""); // Estado para la fecha seleccionada

  // Función para enviar la fecha seleccionada a Node-RED vía MQTT
  const sendDateToNodeRed = () => {
    if (selectedDate) {
      sendMessage("fecha/seleccionada", selectedDate); // Tópico que enviaremos
      console.log("Fecha enviada:", selectedDate);
    }
  };

  // Manejar el cambio de la fecha seleccionada
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value); // Actualizar el estado de la fecha
  };

  // Suscribirse a los datos JSON desde MQTT y procesarlos para el histograma
  useEffect(() => {
    if (statuses["TOPICO-HISTOGRAMA"]) {
      try {
        const data = JSON.parse(statuses["TOPICO-HISTOGRAMA"]); // Supongamos que el tópico MQTT manda un JSON
        setHistogramData(data);
      } catch (error) {
        console.error("Error al parsear el JSON del histograma:", error);
      }
    }
  }, [statuses]);

  return (
    <div>
      {/* Selector de fecha */}
      <div>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={handleDateChange} 
        />
        <button onClick={sendDateToNodeRed}>Consultar datos</button>
      </div>

      {/* Histograma */}
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Histograma;
