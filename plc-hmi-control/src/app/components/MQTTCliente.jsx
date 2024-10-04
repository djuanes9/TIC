import React, { createContext, useState, useEffect } from "react";
import mqtt from "mqtt";

// Crear el contexto para manejar MQTT globalmente
export const MQTTContext = createContext();

export const MQTTProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [statuses, setStatuses] = useState({
    "SILO-101": 0,
    "CNVR-101": "OFF",
    "MILL-101": "OFF",
    "CNVR-102": "OFF",
    "VALV-101": "OFF",
    "NIVEL": "OFF",
    "status/node-red": null,  // Para el estado de Node-RED
  });

  let mqttClient; // Definir el cliente de MQTT fuera del useEffect

  useEffect(() => {
    // Conectar una única vez al broker MQTT
    mqttClient = mqtt.connect(
      "wss://2467cd533de642cd852c4b0e3426dd9e.s1.eu.hivemq.cloud:8884/mqtt",
      {
        username: "djuanes7",
        password: "Jeagdrose9",
      }
    );

    mqttClient.on("connect", () => {
      console.log("Conectado al broker MQTT");
      setIsConnected(true);

      // Suscribirse a todos los tópicos necesarios
      mqttClient.subscribe(
        ["SILO-101", "CNVR-101", "MILL-101", "CNVR-102", "NIVEL", "VALV-101", "status/node-red"],
        (err) => {
          if (err) {
            console.error("Error de suscripción: ", err);
          } else {
            console.log("Suscrito a los tópicos.");
          }
        }
      );
    });

    mqttClient.on("message", (topic, message) => {
      const msg = message.toString();
      console.log(`Mensaje recibido de ${topic}: ${msg}`);

      setStatuses((prevStatuses) => ({
        ...prevStatuses,
        [topic]:
          topic === "SILO-101" ? Number(msg) :
          topic === "status/node-red" ? msg :
          msg === "true" ? "ON" : "OFF",
      }));
    });

    mqttClient.on("error", (err) => {
      console.error("Error en MQTT: ", err);
    });

    return () => {
      mqttClient.end(); // Cierra la conexión cuando el componente se desmonte
    };
  }, []);

  // Función para enviar mensajes usando la misma conexión MQTT abierta
  const sendMessage = (topic, message) => {
    if (mqttClient && isConnected) {
      mqttClient.publish(topic, message, {}, (err) => {
        if (err) {
          console.error(`Error al publicar en el tópico ${topic}: `, err);
        } else {
          console.log(`Mensaje enviado a ${topic}: ${message}`);
        }
      });
    } else {
      console.error("No hay conexión MQTT activa para enviar mensajes.");
    }
  };

  return (
    <MQTTContext.Provider value={{ statuses, isConnected, sendMessage }}>
      {children}
    </MQTTContext.Provider>
  );
};
