import React, { useContext } from "react";
import { MQTTContext } from "./MQTTCliente"; // Importar el contexto global de MQTT

const HMI = () => {
  const { statuses } = useContext(MQTTContext); // Extraer los estados de los tópicos desde el contexto
  const isConveyorActive = statuses["CNVR-101"] === "ON"; // Verificar si está en "ON"


  // Obtener el porcentaje de llenado del silo (de 0 a 100)
  const siloFillLevel = statuses["SILO-101"] || 0;

  return (
    <div>
      {/* Sección del SILO */}
      <div className="Silo-container">

        <div className="siloWrapper">
          <img src="/HMI.png" alt="SILO-101" className="siloImage" />
          <div
            className="siloFill"
            style={{ height: `${siloFillLevel}%` }} // Llenado dinámico
          ></div>
           {isConveyorActive && <div className="grains"></div>}
          {statuses["VALV-101"] === "ON" ? (
            <img
              src="/ValvOn.png"
              alt="LED encendido"
              className="valve-image"
            />
          ) : (
            <img src="/ValvOff.png" alt="LED apagado" className="valve-image" />
          )}
        </div>
        <p>{siloFillLevel}%</p> {/* Mostrar porcentaje debajo */}
      </div>

      {/* Aquí irían las demás secciones de HMI (CNVR, MILL, VALV, etc.) */}
    </div>
  );
};

export default HMI;
