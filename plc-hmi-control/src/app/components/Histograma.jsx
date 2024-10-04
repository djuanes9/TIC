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
    if (statuses["histograma/nivel"]) {
      try {
        const data = JSON.parse(statuses["histograma/nivel"]); // Supongamos que el tópico MQTT manda un JSON
        
        // Transformar los datos recibidos para que coincidan con los ejes X y Y
        const transformedData = data.map((entry) => ({
          x: new Date(entry.Fecha * 1000).toLocaleDateString(),  // Convertir la fecha (timestamp) a formato legible
          y: entry.Dato  // Usar el dato recibido como valor en Y
        }));
        
        // Actualizar el estado con los datos transformados
        setHistogramData(transformedData);

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
            {/* Cambiar "name" a "x" para usar las fechas transformadas */}
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* Cambiar "value" a "y" para usar los datos recibidos */}
            <Bar dataKey="y" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Histograma;
