import React, { useState } from "react";
import Chart from "./Chart";
import Gauge from "./Gauge";
import Histograma from "./Histograma";
import Pesos from "./Pesos"; // Importa el componente Pesos
import "./Dashboard.css";

const Dashboard = () => {
  const [selectedHistograma, setSelectedHistograma] = useState("nivel"); // Estado para el histograma seleccionado

  const handleHistogramaChange = (event) => {
    setSelectedHistograma(event.target.value); // Cambiar entre nivel y peso
  };

  return (
    <div className="dashboard-container">
      {/* Columna de KPIs */}
      <div className="kpis-column">
        <Gauge title="Disponibilidad" topic="nivel/actual" />
        <Gauge title="Calidad" topic="calidad/actual" />
      </div>

      {/* Columna de gráficos en tiempo real */}
      <div className="charts-column">
        <Chart
          title="Gráfico Tiempo Real - Nivel"
          topic="SILO-101"
          ylabel="Nivel [%]"
        />
        <Pesos title="Gráfico Tiempo Real - Pesos" topic="peso/actual" />{" "}
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

export default Dashboard;
