import React from "react";
import Heading from "./Heading";
import { MQTTProvider } from "./MQTTCliente"; // Asegúrate de que MQTTCliente esté exportando el contexto correctamente
import Footer from "./Footer";
import PanelGraficas from "./PanelGraficas";
import InterfazHMI from "./InterfazHMI";

function App() {
  return (
    <div>
      <Heading />
      <MQTTProvider>
   {/*     <div className="main-container " style={{ display: "inline-block", justifyContent: "space-between" }}>*/}
   <div className="main-container">

          {/* Panel de gráficas a la izquierda */}
          <InterfazHMI />
          <PanelGraficas />

          {/* HMI a la derecha */}
        </div>
      </MQTTProvider>
      <Footer />
    </div>
  );
}

export default App;
