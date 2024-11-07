import React, { useState } from "react";
import Heading from "./Heading";
import { MQTTProvider } from "./MQTTCliente"; // Asegúrate de que MQTTCliente esté exportando el contexto correctamente
import Footer from "./Footer";
import PanelGraficas from "./PanelGraficas";
import InterfazHMI from "./InterfazHMI";
import Histograma from "./Histograma";
import Chart from "./Chart";
import TabsBar from "./TabsBar";

function App() {
  const [selectedTab, setSelectedTab] = useState("HMI"); // Estado para la pestaña seleccionada

  // Función para manejar el cambio de pestaña
  const handleTabSelect = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div>
      <Heading />
      <MQTTProvider>
        <TabsBar
          tabs={["HMI", "Gráficos", "Histograma", "Análisis"]}
          onSelect={handleTabSelect}
        />

        <div className="main-container">
          <div className="button-container">
            {/* Opcional: Puedes colocar otros botones si necesitas acciones adicionales */}
          </div>

          {/* Sección principal que muestra el contenido según la pestaña seleccionada */}
          <div className="hmi-nuevo">
            {selectedTab === "HMI" && <InterfazHMI />}
            {selectedTab === "Gráficos" && <Chart />}
            {selectedTab === "Histograma" && <Histograma />}
            {selectedTab === "Análisis" && <PanelGraficas />}
          </div>
        </div>
      </MQTTProvider>
      <Footer />
    </div>
  );
}

export default App;
