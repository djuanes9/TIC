import React, { useState } from "react";
import Heading from "./Heading";
import { MQTTProvider } from "./MQTTCliente"; // Asegúrate de que MQTTCliente esté exportando el contexto correctamente
import Footer from "./Footer";
import InterfazHMI from "./InterfazHMI";
import Histograma from "./Histograma";
import TabsBar from "./TabsBar";
import Informacion from "./Informacion";
import Dashboard from "./Dashboard";
import Maquinaria from "./Maquinaria";

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
          tabs={[
            "HMI",
            "Información",
            "Histograma",
            "Máquinaria",
            "Producción",
          ]}
          onSelect={handleTabSelect}
        />

        <div className="main-container">
          {selectedTab === "HMI" && <InterfazHMI />}
          {selectedTab === "Información" && <Informacion />}
          {selectedTab === "Máquinaria" && <Maquinaria />}
          {selectedTab === "Producción" && <Dashboard />}
        </div>
      </MQTTProvider>
      <Footer />
    </div>
  );
}

export default App;
