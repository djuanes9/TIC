import React, { useContext, useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MQTTContext } from "./MQTTCliente"; // Importar el contexto MQTT

const Histograma = () => {
  const { statuses, sendMessage } = useContext(MQTTContext); // Extraer los estados y la función para enviar mensajes MQTT
  const [histogramData, setHistogramData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(""); // Estado para la fecha seleccionada
  const [hasData, setHasData] = useState(false); // Estado para controlar si hay datos o no

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
    const data = statuses["histograma/nivel"];
    
    // Verificar si el payload es un array vacío
    if (Array.isArray(data) && data.length === 0) {
      console.log("No hay datos para la fecha seleccionada.");
      setHistogramData([]); // Vaciar los datos del gráfico
      setHasData(false); // Marcar que no hay datos
    } else if (data) {
      try {
        let parsedData;

        // Verificar si 'data' ya es un objeto o cadena y evitar el uso de JSON.parse si ya es un objeto
        if (typeof data === 'object') {
          parsedData = data; // Si es un objeto, lo usamos directamente
        } else {
          parsedData = JSON.parse(data); // Si es una cadena JSON, la parseamos
        }

        console.log("BASE DE DATOS: ", parsedData);
        setHistogramData(parsedData); // Setear los datos al gráfico
        setHasData(true); // Marcar que hay datos
      } catch (error) {
        console.error("Error al procesar los datos del histograma:", error);
        setHistogramData([]); // Vaciar los datos del gráfico en caso de error
        setHasData(false); // Marcar que no hay datos
      }
    }
  }, [statuses, selectedDate]); // Asegurarse de que se ejecute también cuando cambie la fecha seleccionada

  return (
    <div className="histogram-container">
      {/* Selector de fecha */}
      <div>
        <input type="date" value={selectedDate} onChange={handleDateChange} />
        <button onClick={sendDateToNodeRed}>Consultar datos</button>
      </div>

      {/* Mostrar mensaje dependiendo de si hay o no datos */}
      <div>
        {hasData ? (
          <h3>Nivel del día: {selectedDate}</h3>
        ) : (
          <h4>No existen registros para la fecha seleccionada</h4>
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
            <Line 
              dataKey="Nivel" 
              fill="#8884d8" 
              stroke="#8884d8" 
              strokeWidth={2} 
              dot={false}
            /> {/* Línea del gráfico */}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Histograma;
