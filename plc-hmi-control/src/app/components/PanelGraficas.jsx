import React, { useContext, useState, useEffect } from "react";
import { MQTTContext } from "./MQTTCliente";

const PanelGraficas = () => {
  const { statuses, isConnected, sendMessage, isNodeRedConnected } =
    useContext(MQTTContext);
  const [bandaValue] = useState(50);

  useEffect(() => {
    const intervalId = setInterval(() => {
      sendMessage("SP_banda", String(bandaValue));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [bandaValue, sendMessage]);

  const handleButtonPress = (topic) => {
    sendMessage(topic, "true");
    setTimeout(() => {
      sendMessage(topic, "false");
    }, 1000);
  };

  return (
    <div className="hmi-right">
      {/* Texto de estado de conexión */}
      <div className="connection-status">
        <p>Status de conexión: {isConnected ? "Conectado" : "Desconectado"}</p>
        <p>
          Status de Node-RED:{" "}
          {isNodeRedConnected ? "Conectado" : "Desconectado"}
        </p>
      </div>

      {/* Contenedor de las columnas */}
      <div className="columns-container">
        {/* Sección de transmisores */}
        <div className="transmitter-section">
          <div className="status-item">
            <h3>LT-101</h3>
            <p>{statuses["LT-101"] || 0}%</p>
          </div>
          <div className="status-item">
            <h3>WT-101</h3>
            <p>{statuses["WT-101"] || 0}%</p>
          </div>
          <div className="status-item">
            <h3>WT-102</h3>
            <p>{statuses["WT-102"] || 0}%</p>
          </div>
        </div>

        {/* Sección de LSL y LSH */}
        <div className="lsl-lsh-section">
          <div className="status-item">
            <h3>LSL-101</h3>
            {statuses["LSL-101"] === "ON" ? (
              <img src="/LedOn.png" alt="LED encendido" />
            ) : (
              <img src="/LedOff.png" alt="LED apagado" />
            )}
          </div>
          <div className="status-item">
            <h3>LSH-101</h3>
            {statuses["LSH-101"] === "ON" ? (
              <img src="/LedOn.png" alt="LED encendido" />
            ) : (
              <img src="/LedOff.png" alt="LED apagado" />
            )}
          </div>
        </div>

        {/* Nueva Sección para Variables Digitales */}
        <div className="digital-section">
          <div className="status-item">
            <h3>DIGITAL-101</h3>
            {statuses["DIGITAL-101"] === "ON" ? (
              <img src="/LedOn.png" alt="LED encendido" />
            ) : (
              <img src="/LedOff.png" alt="LED apagado" />
            )}
          </div>
          <div className="status-item">
            <h3>DIGITAL-102</h3>
            {statuses["DIGITAL-102"] === "ON" ? (
              <img src="/LedOn.png" alt="LED encendido" />
            ) : (
              <img src="/LedOff.png" alt="LED apagado" />
            )}
          </div>
        </div>

        {/* Sección de estado de máquinas */}
        <div className="machine-status-section">
          <div className="status-item">
            <h3>SCRW-101</h3>
            {statuses["SCRW-101"] === "ON" ? (
              <img src="/LedOn.png" alt="LED encendido" />
            ) : (
              <img src="/LedOff.png" alt="LED apagado" />
            )}
          </div>
          <div className="status-item">
            <h3>MILL-101</h3>
            {statuses["MILL-101"] === "ON" ? (
              <img src="/LedOn.png" alt="LED encendido" />
            ) : (
              <img src="/LedOff.png" alt="LED apagado" />
            )}
          </div>
          <div className="status-item">
            <h3>CNVR-102</h3>
            {statuses["CNVR-102"] === "ON" ? (
              <img src="/LedOn.png" alt="LED encendido" />
            ) : (
              <img src="/LedOff.png" alt="LED apagado" />
            )}
          </div>
        </div>
      </div>

      {/* Botones al final */}
      <div className="button-section">
        <button
          onClick={() => handleButtonPress("start")}
          className="button-start"
        >
          START
        </button>
        <button
          onClick={() => handleButtonPress("stop")}
          className="button-stop"
        >
          STOP
        </button>
      </div>
    </div>
  );
};

export default PanelGraficas;
