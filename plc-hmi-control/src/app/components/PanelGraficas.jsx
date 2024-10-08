import React, { useContext } from "react";
import { MQTTContext } from "./MQTTCliente"; // Importamos el contexto

const PanelGraficas = () => {
  const { statuses, isConnected, sendMessage, isNodeRedConnected } = useContext(MQTTContext); // Usamos los valores globales

  const handleButtonPress = (topic) => {
    // Publicar el valor "true" o "ON" en el tópico MQTT
    sendMessage(topic, "true");

    // Después de 1 segundo, publicar el valor "false" o "OFF"
    setTimeout(() => {
      sendMessage(topic, "false");
    }, 1000); // 1000 ms = 1 segundo
  };

  return (
    <div>
      <p>Status de conexión: {isConnected ? "Conectado" : "Desconectado"}</p>
      {/* Mostrar estado de Node-RED */}
      <p>Status de Node-RED: {isNodeRedConnected ? "Conectado" : "Desconectado"}</p>

      <div>
        <div className="StatusItem">
          <h3>SILO-101</h3>
          <p>{statuses["SILO-101"]}%</p>
        </div>

        <div className="StatusItem">
          <h3>CNVR-101</h3>
          {statuses["CNVR-101"] === "ON" ? (
            <img src="/LedOn.png" alt="LED encendido" />
          ) : (
            <img src="/LedOff.png" alt="LED apagado" />
          )}
        </div>
        <div className="StatusItem">
          <h3>MILL-101</h3>
          {statuses["MILL-101"] === "ON" ? (
            <img src="/LedOn.png" alt="LED encendido" />
          ) : (
            <img src="/LedOff.png" alt="LED apagado" />
          )}
        </div>

        <div className="StatusItem">
          <h3>CNVR-102</h3>
          {statuses["CNVR-102"] === "ON" ? (
            <img src="/LedOn.png" alt="LED encendido" />
          ) : (
            <img src="/LedOff.png" alt="LED apagado" />
          )}
        </div>

        <div className="StatusItem">
          <h3>VALV-101</h3>
          {statuses["VALV-101"] === "ON" ? (
            <img src="/LedOn.png" alt="LED encendido" />
          ) : (
            <img src="/LedOff.png" alt="LED apagado" />
          )}
        </div>
      </div>

      <div className="buttonPanel">
        <button
          onClick={() => handleButtonPress("start")}
          className="buttonStart"
        >
          START
        </button>
        <button
          onClick={() => handleButtonPress("stop")}
          className="buttonStop"
        >
          STOP
        </button>
      </div>
    </div>
  );
};

export default PanelGraficas;
