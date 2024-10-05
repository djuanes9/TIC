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
    if (statuses["histograma/nivel"]) {
      try {
        const data = statuses["histograma/nivel"]; // Supongamos que el tópico MQTT manda un JSON
        console.log("BASE DE DATOS: ", data);
        
        if (data && data.length > 0) {
          setHistogramData(data); // Setear los datos al gráfico
          setHasData(true); // Marcar que hay datos
        } else {
          setHistogramData([]); // Vaciar los datos del gráfico si no hay resultados
          setHasData(false); // Marcar que no hay datos
        }
      } catch (error) {
        console.error("Error al parsear el JSON del histograma:", error);
        setHistogramData([]); // En caso de error, vaciar los datos
        setHasData(false); // Marcar que no hay datos
      }
    } else {
      // Si no hay datos en el estado 'statuses', vaciar el gráfico
      setHistogramData([]);
      setHasData(false);
    }
  }, [statuses, selectedDate]); // Asegurarse de que se ejecute también cuando cambie la fecha seleccionada

  return (
    <div>
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
          <h3>No existen registros para la fecha seleccionada</h3>
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
