import React, { useState } from "react";
import Chart from "./Chart";
import Gauge from "./Gauge";
import Histograma from "./Histograma";
import Tiempos from "./Tiempos";
import "./Dashboard.css";

const Maquinaria = () => {
  const [selectedHistograma, setSelectedHistograma] = useState("nivel"); // Estado para el histograma seleccionado

  const handleHistogramaChange = (event) => {
    setSelectedHistograma(event.target.value); // Cambiar entre nivel y peso
  };

  return (
    <div className="dashboard-container">
      {/* Columna de KPIs */}
      <div className="kpis-column">
        <Gauge title="Rendimiento" topic="nivel/actual" />
        <Gauge title="OEE" topic="calidad/actual" />
      </div>

      {/* Columna de gráficos en tiempo real */}
      <div className="charts-column">
        <Chart
          title="Gráfico Tiempo Real - Velocidades"
          topic="nivel/actual"
          ylabel="Velocidad (rpm)"
        />
        <Tiempos title="Tiempos de la Máquina" topic="tiempos/actual" />
        {/* Reemplaza Chart con Pesos */}
      </div>

      {/* Columna de histograma */}
      <div className="histogram-column">
        <div className="histogram-selector">
          <label>Seleccionar Histograma:</label>
          <select value={selectedHistograma} onChange={handleHistogramaChange}>
            <option value="nivel">Nivel</option>
            <option value="peso">Peso</option>
          </select>
        </div>
        {/* Mostrar histograma según selección */}
        {selectedHistograma === "nivel" ? (
          <Histograma title="Histograma - Nivel" topic="histograma/nivel" />
        ) : (
          <Histograma title="Histograma - Peso" topic="histograma/peso" />
        )}
      </div>
    </div>
  );
};

export default Maquinaria;
