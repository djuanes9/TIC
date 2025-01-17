
import React, { useContext } from "react";
import GaugeChart from "react-gauge-chart";
import { MQTTContext } from "./MQTTCliente";

const Gauge = React.memo(({ title, topic, maxRange }) => {
  const { statuses } = useContext(MQTTContext);
  const value = statuses[topic] || 0;

  // Normalizar el valor al rango 0-1 basado en el rango máximo
  const normalizedValue = Math.min(value / maxRange, 1);

  // Configuración de colores
  const colors = ["#FF4848", "#FFBB28", "#00C49F"]; // Rojo, Amarillo, Verde

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <h3 style={{ marginBottom: "10px" }}>{title}</h3>
      <GaugeChart
        id={`gauge-${topic}`}
        nrOfLevels={20}
        arcsLength={[0.3, 0.4, 0.3]}
        colors={colors}
        percent={normalizedValue}
        arcWidth={0.25}
        animate={false} // Evitar animaciones
        textColor="#000000"
        needleColor="#646261"
        arcPadding={0.05}
        cornerRadius={3}
        hideText={true}
      />
      <p style={{ fontSize: "24px", marginTop: "-10px" }}>
        {value} granos/seg
      </p>
    </div>
  );
});

export default Gauge;
