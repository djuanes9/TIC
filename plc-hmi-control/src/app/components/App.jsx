import React, { useState} from "react";
import Heading from "./Heading";
import { MQTTProvider } from "./MQTTCliente"; // Asegúrate de que MQTTCliente esté exportando el contexto correctamente
import Footer from "./Footer";
import PanelGraficas from "./PanelGraficas";
import InterfazHMI from "./InterfazHMI";
import Histograma from "./Histograma";

function App() {

  const [isHMIVisible, setIsHMIVisible] = useState(true); // Estado para alternar entre HMI e Histograma

  const toggleView = () => {
    setIsHMIVisible(!isHMIVisible);
  };

  return (
    <div>
      <Heading />
      <MQTTProvider>
        <div className="main-container">
          {/* Panel de gráficas a la izquierda */}
          <button onClick={toggleView}>
            {isHMIVisible ? "Ver Histograma" : "Ver HMI"}
          </button>

          <div className="hmiSection">
          {isHMIVisible ? <InterfazHMI /> : <Histograma />}
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

