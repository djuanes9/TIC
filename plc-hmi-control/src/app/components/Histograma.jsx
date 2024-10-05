import React, { useContext, useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MQTTContext } from "./MQTTCliente"; // Importar el contexto MQTT

const Histograma = () => {
  const { statuses, sendMessage } = useContext(MQTTContext); // Extraer los estados y la función para enviar mensajes MQTT
  const [histogramData, setHistogramData] = useState([]); // Datos de la base de datos
  const [realTimeData, setRealTimeData] = useState([]); // Datos en tiempo real
  const [chartData, setChartData] = useState([]); // Datos que mostrarás en el chart (base de datos o tiempo real)
  const [selectedDate, setSelectedDate] = useState(""); // Estado para la fecha seleccionada
  const [viewMode, setViewMode] = useState("historical"); // "historical" o "realTime"

  // Función para enviar la fecha seleccionada a Node-RED vía MQTT
  const sendDateToNodeRed = () => {
    if (selectedDate) {
      const formattedDate = new Date(selectedDate).toISOString(); // Ajustar formato si es necesario
      sendMessage("fecha/seleccionada", formattedDate); // Enviar fecha al tópico correspondiente
      console.log("Fecha enviada:", formattedDate);
    }
  };

  // Manejar el cambio de la fecha seleccionada
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value); // Actualizar el estado de la fecha
  };

  // Manejar la suscripción a datos en tiempo real
  const subscribeToRealTimeData = () => {
    sendMessage("nivel/actual", "start"); // Suscribirse al tópico en tiempo real
    console.log("Suscrito al tópico en tiempo real");
    setViewMode("realTime"); // Cambiar el modo de visualización a tiempo real
  };

  // Función para mostrar datos históricos
  const displayHistoricalData = () => {
    setViewMode("historical"); // Cambiar el modo de visualización a histórico
  };

  // Procesar datos recibidos por MQTT
  useEffect(() => {
    // Datos del histograma (base de datos)
    if (statuses["histograma/nivel"]) {
      try {
        const data = statuses["histograma/nivel"];
        console.log("BASE DE DATOS:", data);
        setHistogramData(data); // Guardar datos del histograma
        if (viewMode === "historical") {
          setChartData(data); // Si estamos en modo histórico, actualizar los datos del chart
        }
      } catch (error) {
        console.error("Error al procesar los datos del histograma:", error);
      }
    }

    // Datos en tiempo real
    if (statuses["nivel/actual"]) {
      try {
        const realTimeValue = statuses["nivel/actual"];
        console.log("TIEMPO REAL:", realTimeValue);

        const newPoint = {
          x: new Date().toLocaleTimeString(),
          y: realTimeValue
        };

        setRealTimeData((prevData) => {
          const updatedData = [...prevData, newPoint];
          if (updatedData.length > 100) {
            updatedData.shift(); // Eliminar el primer dato si hay más de 100
          }
          if (viewMode === "realTime") {
            setChartData(updatedData); // Si estamos en modo realTime, actualizar los datos del chart
          }
          return updatedData;
        });
      } catch (error) {
        console.error("Error al procesar los datos en tiempo real:", error);
      }
    }
  }, [statuses, viewMode]); // Escuchar por cambios en los datos y el modo de visualización

  return (
    <div>
      {/* Selector de fecha */}
      <div>
        <input type="date" value={selectedDate} onChange={handleDateChange} />
        <button onClick={() => { sendDateToNodeRed(); displayHistoricalData(); }}>
          Consultar datos
        </button>
      </div>

      {/* Botón para activar datos en tiempo real */}
      <div>
        <button onClick={subscribeToRealTimeData}>Ver datos en tiempo real</button>
      </div>

      {/* Un solo gráfico que cambia entre datos históricos y en tiempo real */}
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" /> {/* Eje X: Tiempo */}
            <YAxis />
            <Tooltip />
            <Legend />
            {/* Línea para los datos seleccionados */}
            <Line 
              type="monotone" 
              dataKey="y" 
              stroke={viewMode === "historical" ? "#8884d8" : "#82ca9d"} // Color cambia según el modo
              strokeWidth={3}  // Grosor de la línea
              dot={false}      // Sin puntos en los datos
              animationDuration={500} // Duración de la animación
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Histograma;
