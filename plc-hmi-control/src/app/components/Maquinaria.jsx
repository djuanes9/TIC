import React, { useState } from "react";
import Chart from "./Chart";
import Gauge from "./Gauge";
import Histograma from "./Histograma";
import Tiempos from "./Tiempos";
import "./Dashboard.css";

const Maquinaria = () => {
  const [selectedHistograma, setSelectedHistograma] = useState("nivel"); // Estado para el histograma seleccionado
  const [viewMode, setViewMode] = useState("realtime"); // Estado para alternar entre gráfico en tiempo real e histograma

  const handleHistogramaChange = (event) => {
    setSelectedHistograma(event.target.value); // Cambiar entre nivel y peso
  };

  const toggleViewMode = () => {
    setViewMode((prevMode) =>
      prevMode === "realtime" ? "histogram" : "realtime"
    ); // Alternar vista
  };

  return (
    <div className="dashboard-container">
      {/* Columna de KPIs */}
      <div className="kpis-column">
        <h3 className="section-title">KPIs</h3>
        <Gauge title="Disponibilidad" topic="nivel/actual" />
        <Gauge title="OEE" topic="calidad/actual" />
      </div>

      {/* Columna de gráficos en tiempo real */}
      <div className="charts-column">
        <h3 className="section-title">Gráficos en Tiempo Real</h3>
        <Chart
          title="Tiempos de operación Molino"
          topic="nivel/actual"
          ylabel="Velocidad (rpm)"
        />
        <Tiempos title="Tiempos de la Máquina" topic="tiempos/actual" />
      </div>

      {/* Columna de histograma o gráfico en tiempo real */}
      <div className="histogram-column">
        <h3 className="section-title">Histograma / Gráfico</h3>
        <div className="view-mode-selector">
          <button className="toggle-button" onClick={toggleViewMode}>
            {viewMode === "realtime"
              ? "Ver Histograma"
              : "Ver Gráfico en Tiempo Real"}
          </button>
        </div>
        {viewMode === "realtime" ? (
          <Chart
            title="Gráfico en Tiempo Real - Molino"
            topic="grafico/tiempo-real"
            ylabel="Tiempo (segundos)"
          />
        ) : (
          <div>
            <div className="histogram-selector">
              <label>Seleccionar Histograma:</label>
              <select
                value={selectedHistograma}
                onChange={handleHistogramaChange}
              >
                <option value="nivel">Nivel</option>
                <option value="peso">Peso</option>
              </select>
            </div>
            {selectedHistograma === "nivel" ? (
              <Histograma title="Histograma - Nivel" topic="histograma/nivel" />
            ) : (
              <Histograma title="Histograma - Peso" topic="histograma/peso" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Maquinaria;
