import React, { useContext, useState, useEffect } from "react";
import { MQTTContext } from "./MQTTCliente";

const PanelGraficas = ({ userRole }) => {
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
    <div className="panel-graficas-container">
      {/* Estado de conexión */}
      <div className="connection-status">
        <p>Status de conexión: {isConnected ? "Conectado" : "Desconectado"}</p>
        <p>
          Status de Node-RED:{" "}
          {isNodeRedConnected ? "Conectado" : "Desconectado"}
        </p>
      </div>

      {/* Contenedor de columnas */}
      <div className="columns-wrapper">
        {/* Columna izquierda */}
        <div className="column">
          <h4>Estados Maquinaria</h4>
          <div className="column-items">
            <div className="status-item">
              <h3>VALV-101</h3>
              {statuses["VALV-101"] === "ON" ? (
                <img src="/LedOn.png" alt="Encendido" />
              ) : (
                <img src="/LedOff.png" alt="Apagado" />
              )}
            </div>
            <div className="status-item">
              <h3>SCRW-101</h3>
              {statuses["CNVR-101"] === "ON" ? (
                <img src="/LedOn.png" alt="Encendido" />
              ) : (
                <img src="/LedOff.png" alt="Apagado" />
              )}
            </div>
            <div className="status-item">
              <h3>MILL-101</h3>
              {statuses["MILL-101"] === "ON" ? (
                <img src="/LedOn.png" alt="Encendido" />
              ) : (
                <img src="/LedOff.png" alt="Apagado" />
              )}
            </div>
            <div className="status-item">
              <h3>SIV-101</h3>
              {statuses["SIV-101"] === "ON" ? (
                <img src="/LedOn.png" alt="Encendido" />
              ) : (
                <img src="/LedOff.png" alt="Apagado" />
              )}
            </div>
            <div className="status-item">
              <h3>SRV-102</h3>
              {statuses["SRV-102"] === "ON" ? (
                <img src="/LedOn.png" alt="Encendido" />
              ) : (
                <img src="/LedOff.png" alt="Apagado" />
              )}
            </div>
            <div className="status-item">
              <h3>SRV-103</h3>
              {statuses["SRV-103"] === "ON" ? (
                <img src="/LedOn.png" alt="Encendido" />
              ) : (
                <img src="/LedOff.png" alt="Apagado" />
              )}
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="column">
          <h4>Transmisores </h4>
          <div className="column-items">
            <div className="status-item">
              <h3>LT-101</h3>
              <p>{statuses["SILO-101"] || 0}%</p>
            </div>
            <div className="status-item">
              <h3>WT-101</h3>
              <p>{statuses["wt1/actual"] || 0} gr</p>
            </div>
            <div className="status-item">
              <h3>WT-102</h3>
              <p>{statuses["wt2/actual"] || 0} gr</p>
            </div>
            <h4>Alarmas</h4>
            <div className="status-item">
              <h3>LSL-101</h3>
              {statuses["LSL-101"] === "ON" ? (
                <img src="/LedOn.png" alt="Encendido" />
              ) : (
                <img src="/LedOff.png" alt="Apagado" />
              )}
            </div>
            <div className="status-item">
              <h3>LSH-101</h3>
              {statuses["LSH-101"] === "ON" ? (
                <img src="/LedOn.png" alt="Encendido" />
              ) : (
                <img src="/LedOff.png" alt="Apagado" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Botones de control (solo visibles para admin) */}
      {userRole === "admin" && (
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
      )}
    </div>
  );
};

export default PanelGraficas;
