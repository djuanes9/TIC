import React, { useContext, useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MQTTContext } from "./MQTTCliente"; // Importar el contexto MQTT

const Chart = () => {
  const { statuses} = useContext(MQTTContext); // Extraer los estados y la función para enviar mensajes MQTT
  const [setHistogramData] = useState([]);
  const [realTimeData, setRealTimeData] = useState([]); // Estado para datos en tiempo real



  // Suscribirse a los datos JSON desde MQTT y procesarlos para el histograma
  useEffect(() => {
    if (statuses["histograma/nivel"]) {
      try {
        const data = statuses["histograma/nivel"]; // Datos del histograma (base de datos)
        console.log("BASE DE DATOS: ", data);
        setHistogramData(data); // Setear los datos al gráfico
      } catch (error) {
        console.error("Error al parsear el JSON del histograma:", error);
      }
    }

    if (statuses["nivel/actual"]) {
      try {
        const realTimeValue = statuses["nivel/actual"]; // Aquí recibes solo el número
        console.log("TIEMPO REAL: ", realTimeValue);
  
        // Generar un nuevo punto con el número recibido y una marca de tiempo (x)
        const newPoint = {
          x: new Date().toLocaleTimeString(), // Usamos la hora actual como 'x'
          y: realTimeValue                   // El valor numérico es 'y'
        };
  
        setRealTimeData((prevData) => {
          const updatedData = [...prevData, newPoint]; // Añadir el nuevo dato
          
          // Limitar a 100 entradas
          if (updatedData.length > 100) {
            updatedData.shift(); // Eliminar el primer elemento si excede los 100
          }

          return updatedData;
        });
      } catch (error) {
        console.error("Error al parsear el dato en tiempo real:", error);
      }
    }
  }, [statuses]);

  return (
    <div>
 
      {/* Botón para activar datos en tiempo real */}
      <div>
    <h1>Gráfico Tiempo Real</h1>
      </div>

      {/* Histograma en tiempo real */}
      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <LineChart data={realTimeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" /> {/* Eje X: Tiempo */}
            <YAxis />
            <Tooltip />
            <Legend />
            {/* Línea para datos en tiempo real */}
            <Line 
              type="monotone" 
              dataKey="y" 
              stroke="#82ca9d" // Color personalizado
              strokeWidth={3}  // Grosor de la línea
              dot={false}      // Quitar los puntos en los datos
              animationDuration={5} // Duración de la animación
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
