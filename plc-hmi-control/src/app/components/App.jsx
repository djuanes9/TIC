import React, { useState } from "react";
import Heading from "./Heading";
import { MQTTProvider } from "./MQTTCliente"; // Asegúrate de que MQTTCliente esté exportando el contexto correctamente
import Footer from "./Footer";
import PanelGraficas from "./PanelGraficas";
import InterfazHMI from "./InterfazHMI";
import Histograma from "./Histograma";
import Chart from "./Chart"

function App() {

  const [isHMIVisible, setIsHMIVisible] = useState(true); // Estado para alternar entre HMI e Histograma
  const [isHistoVisible, setIsHistoVisible] = useState(true); // Estado para alternar entre Chart e Histograma

  // Toggle para HMI o Gráficos
  const toggleView = () => {
    setIsHMIVisible(!isHMIVisible);
  };

  // Toggle entre Chart e Histograma
  const toggleView2 = () => {
    setIsHistoVisible(!isHistoVisible);
  };

  return (
    <div>
      <Heading />
      <MQTTProvider>
        <div className="main-container">
          {/* Panel de botones a la izquierda */}
          <div>
            {/* Botón para alternar entre HMI y Gráficos */}
            <button onClick={toggleView} className="ButHisto">
              {isHMIVisible ? "Ver Gráficos" : "Ver HMI"}
            </button>

            {/* Mostrar el botón de alternar Chart/Histograma solo cuando estamos viendo gráficos */}
            {!isHMIVisible && (
              <button onClick={toggleView2} className="ButHisto">
                {isHistoVisible ? "Ver Histograma" : "Ver Chart"}
              </button>
            )}
          </div>

          {/* Sección principal que alterna entre HMI y Gráficos */}
          <div className="hmiSection">
            {isHMIVisible ? <InterfazHMI /> : isHistoVisible ? <Chart /> : <Histograma />}
          </div>

          {/* Panel de estado */}
          <div className="StatusPanel">
            <PanelGraficas />
          </div>
        </div>
      </MQTTProvider>
      <Footer />
    </div>
  );
}

export default App;
