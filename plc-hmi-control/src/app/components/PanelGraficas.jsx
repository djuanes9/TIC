import React, { useContext, useState, useEffect } from "react";
import { MQTTContext } from "./MQTTCliente"; // Importamos el contexto

const PanelGraficas = () => {
  const { statuses, isConnected, sendMessage, isNodeRedConnected } =
    useContext(MQTTContext); // Usamos los valores globales
  const [bandaValue, setBandaValue] = useState(50); // Estado local para el valor de SP_banda

  // Efecto para enviar el valor cada segundo
  useEffect(() => {
    const intervalId = setInterval(() => {
      sendMessage("SP_banda", String(bandaValue)); // Enviar el valor por MQTT
    }, 1000); // Cada 1000 ms (1 segundo)

    // Cleanup: limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, [bandaValue, sendMessage]); // Solo se reejecuta cuando cambia bandaValue o sendMessage

  // Función para manejar los pulsadores
  const handleButtonPress = (topic) => {
    // Publicar el valor "true" o "ON" en el tópico MQTT
    sendMessage(topic, "true");

    // Después de 1 segundo, publicar el valor "false" o "OFF"
    setTimeout(() => {
      sendMessage(topic, "false");
    }, 1000); // 1000 ms = 1 segundo
  };

  // Función para manejar el cambio del slider
  const handleBandaValueChange = (event) => {
    setBandaValue(event.target.value); // Actualizar el estado con el valor del slider
  };



  return (
    <div>
      <p>Status de conexión: {isConnected ? "Conectado" : "Desconectado"}</p>
      <p>
        Status de Node-RED: {isNodeRedConnected ? "Conectado" : "Desconectado"}
      </p>

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

      {/* Input para seleccionar el valor de 0 a 100 y enviar al tópico SP_banda */}
      <div className="Slider">
        <h3>Setipoint Banda </h3>
        <input
          id="bandaRange"
          type="range"
          min="0"
          max="100"
          value={bandaValue}
          onChange={handleBandaValueChange} // Actualizar el estado al mover el slider
          className="w-full"
        />
        <span>{bandaValue}</span> {/* Mostrar el valor actual */}
       
      </div>
    </div>
  );
};

export default PanelGraficas;
