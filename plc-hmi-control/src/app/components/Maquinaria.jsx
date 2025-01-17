import React, { useState } from "react";
import Chart from "./Chart";
import Gauge from "./Gauge";
import Histograma3 from "./Histograma3";
import Pesos from "./Pesos";
import Tiempos from "./Tiempos";
import "./Dashboard.css";

const Maquinaria = () => {
  const [selectedHistograma, setSelectedHistograma] = useState("nivel"); // Estado para el histograma seleccionado
  const [viewMode, setViewMode] = useState("realtime"); // Estado para alternar entre gráfico en tiempo real e histograma

  const handleHistogramaChange = (event) => {
    setSelectedHistograma(event.target.value); // Cambiar entre nivel y peso
  };

  return (
    <div className="dashboard-container">
      {/* Columna de KPIs */}
      <div className="kpis-column">
        <h3 className="section-title">KPIs</h3>
        <Gauge title="Disponibilidad Molino" topic="disp/mill" />
        <Gauge title="Disponibilidad Screw" topic="disp/screw" />
        {/* <Gauge title="OEE" topic="oee" /> */}
      </div>

      {/* Columna de gráficos en tiempo real */}
      <div className="charts-column">
        <h3 className="section-title"> Gráfico de Tiempos</h3>
        <Tiempos
          title="Tiempos de operación Molino"
          topic="tiempos/actual"
          ylabel="Tiempo (seg)"
        />
      </div>

      {/* Columna de histogramas */}
      <div className="histogram-column">
        <h2 className="section-title">Histogramas</h2>
        <div className="histogram-selector"></div>
        {/* Renderizar el histograma correspondiente */}
        <div className="histogram-item">
          <Histograma3
            title="Tiempo de uso máquinas"
            topic="histograma/tiempo"
          />
        </div>
      </div>
    </div>
  );
};

export default Maquinaria;
