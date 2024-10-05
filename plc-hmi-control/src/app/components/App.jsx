import React, { useState} from "react";
import Heading from "./Heading";
import { MQTTProvider } from "./MQTTCliente"; // Asegúrate de que MQTTCliente esté exportando el contexto correctamente
import Footer from "./Footer";
import PanelGraficas from "./PanelGraficas";
import InterfazHMI from "./InterfazHMI";
import Histograma from "./Histograma";
import Chart from "./Chart"

function App() {

  const [isHMIVisible, setIsHMIVisible] = useState(true); // Estado para alternar entre HMI e Histograma
  const [isHistoVisible,  setIsHistoVisible] = useState(true); // Estado para alternar entre HMI e Histograma

  const toggleView = () => {
    setIsHMIVisible(!isHMIVisible);
  };

  const toggleView2 = () => {
    setIsHistoVisible(!isHistoVisible);
  };

  return (
    <div>
      <Heading />
      <MQTTProvider>
        <div className="main-container">
          {/* Panel de gráficas a la izquierda */}
          <div>
          <button onClick={toggleView} className="ButHisto">
            {isHMIVisible ? "Ver Gráficos" : "Ver HMI"}
          </button>
          <button onClick={toggleView2} className="ButHisto" visibility={isHMIVisible ? "visible" : "hidden"}>
            {isHistoVisible ? "Ver Histograma" : "Ver Chart"}
          </button>
          </div>
          

          <div className="hmiSection">
          {isHMIVisible ? <InterfazHMI /> :  isHistoVisible ? <Chart /> : <Histograma />}
          </div>
          <div className="StatusPanel">
            <PanelGraficas />

            {/* HMI a la derecha */}
          </div>
        </div>
      </MQTTProvider>
      <Footer />
    </div>
  );
}

export default App;

