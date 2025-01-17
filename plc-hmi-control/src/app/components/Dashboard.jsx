import React, { useState } from "react";
import Chart from "./Chart";
import Gauge from "./Gauge";
import Gauge2 from "./Gauge2";
import Histograma from "./Histograma";
import Histograma2 from "./Histograma2"; // Nuevo componente para múltiples variables
import Pesos from "./Pesos";
import "./Dashboard.css";

const Dashboard = () => {
  const [selectedHistograma, setSelectedHistograma] = useState("nivel"); // Estado para la selección

  const handleHistogramaChange = (event) => {
    setSelectedHistograma(event.target.value);
  };

  return (
    <div className="dashboard-container">
      {/* Columna de KPIs */}
      <div className="kpis-column">
        <h2 className="section-title">KPIs</h2>
        <Gauge2 title="Rendimiento" topic="rendimiento" maxRange={20} />
        <Gauge title="Calidad" topic="calidad/actual" />
      </div>

      {/* Columna de gráficos en tiempo real */}
      <div className="charts-column">
        <h2 className="section-title">Gráficos en Tiempo Real</h2>
        <Chart
          title="Gráfico Tiempo Real - Nivel"
          topic="SILO-101"
          ylabel="Nivel [%]"
        />
        <Pesos title="Gráfico Tiempo Real - Pesos" topic="peso/actual" />
      </div>

      {/* Columna de histogramas */}
      <div className="histogram-column">
        <h2 className="section-title">Histogramas</h2>
        <div className="histogram-selector">
          <label>Seleccionar Histograma:</label>
          <select value={selectedHistograma} onChange={handleHistogramaChange}>
            <option value="nivel">Nivel</option>
            <option value="peso">Peso</option>
          </select>
        </div>
        {/* Renderizar el histograma correspondiente */}
        <div className="histogram-item">
          {selectedHistograma === "nivel" ? (
            <Histograma title="Histograma - Nivel" topic="histograma/nivel" />
          ) : (
            <Histograma2 title="Histograma - Pesos" topic="histograma/pesos" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
