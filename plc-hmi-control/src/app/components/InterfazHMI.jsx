import React, { useContext } from "react";
import PanelGraficas from "./PanelGraficas";
import { MQTTContext } from "./MQTTCliente"; // Importar el contexto global de MQTT

const HMI = () => {
  const { statuses } = useContext(MQTTContext); // Extraer los estados de los tópicos desde el contexto

  // Obtener el porcentaje de llenado del silo (de 0 a 100)
  const siloFillLevel = statuses["SILO-101"] || 0;
  const isConveyorActive = statuses["CNVR-101"] === "ON"; // Verificar si está en "ON"

  return (
    <div className="hmi-container">
      {/* Sección del SILO */}

      <div className="hmi-left">
        <div className="siloWrapper">
          <img src="/HMI.png" alt="SILO-101" className="siloImage" />
          {/* Contenedor específico para el llenado */}
          <div className="siloFillContainer">
            <div
              className="siloFill"
              style={{ height: `${siloFillLevel}%` }} // Llenado dinámico
            ></div>
            <div></div>
            {/* Solo aplicar la clase 'grains' cuando el conveyor está activo */}
            {isConveyorActive && <div className="grains"></div>}
          </div>

          {statuses["VALV-101"] === "ON" ? (
            <img
              src="/ValvOn.png"
              alt="LED encendido"
              className="valve-image"
            />
          ) : (
            <img src="/ValvOff.png" alt="LED apagado" className="valve-image" />
          )}

          {statuses["CNVR-101"] === "ON" ? (
            <img src="/screwOn.png" alt="LED encendido" className="M1-image" />
          ) : (
            <img src="/ScrewOff.png" alt="Scew Off" className="M1-image" />
          )}

          {statuses["MILL-101"] === "ON" ? (
            <img src="/MillOn.png" alt="LED encendido" className="Mill-image" />
          ) : (
            <img src="/MillOff.png" alt="LED apagado" className="Mill-image" />
          )}

          {statuses["SIV-101"] === "ON" ? (
            <img src="/SivOn.png" alt="LED encendido" className="M2-image" />
          ) : (
            <img src="/SivOff.png" alt="LED apagado" className="M2-image" />
          )}
        </div>
        <p>{siloFillLevel}%</p> {/* Mostrar porcentaje debajo */}
      </div>
      <div className="hmi-right">
        <PanelGraficas />
      </div>
    </div>
  );
};

export default HMI;
