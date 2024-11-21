import React, { useContext } from "react";
import GaugeChart from "react-gauge-chart";
import { MQTTContext } from "./MQTTCliente";

const Gauge = ({ title, topic }) => {
  const { statuses } = useContext(MQTTContext);
  const value = statuses[topic] || 0;

  console.log(`Valor de ${topic} en Gauge (${title}):`, value);

  // Convertir el valor a un rango entre 0 y 1 para el gauge
  const normalizedValue = value / 100;

  // Configuración de colores
  const colors = ["#FF4848", "#FFBB28", "#00C49F"]; // Rojo, Amarillo, Verde

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <h3 style={{ marginBottom: "10px" }}>{title}</h3>
      <GaugeChart
        id={`gauge-${topic}`}
        nrOfLevels={20} // Número de niveles (segmentos) en el arco
        arcsLength={[0.3, 0.4, 0.3]} // Proporción de cada color en el arco
        colors={colors} // Colores para el arco
        percent={normalizedValue} // Valor normalizado entre 0 y 1
        arcWidth={0.25} // Grosor del arco
        animate={false} // Evitar animaciones para mejorar rendimiento
        textColor="#000000" // Color del texto
        needleColor="#646261"
        arcPadding={0.05}
        cornerRadius={3}
        hideText={true}
      />
      <p style={{ fontSize: "24px", marginTop: "-10px" }}>{value}%</p>
    </div>
  );
};

export default Gauge;
