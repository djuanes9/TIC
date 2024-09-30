import React, { useContext } from "react";
import { MQTTContext } from "./MQTTCliente"; // Importar el contexto global de MQTT
import Image from 'next/image';

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

{isConveyorActive && (
        <div className="grains">
          <Image
            src="/granos.png"
            alt="Granos"
            width={170}
            height={50} // Ajusta según el tamaño
          />
        </div>
      )}
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
