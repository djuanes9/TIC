"use client";
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
    NIVEL: "OFF",
  });

  useEffect(() => {
    const mqttClient = mqtt.connect(
      "wss://2467cd533de642cd852c4b0e3426dd9e.s1.eu.hivemq.cloud:8884/mqtt",
      {
        username: "djuanes7",
        password: "Jeagdrose9",
      }
    );

    mqttClient.on("connect", () => {
      console.log("Conectado al broker MQTT");
      setIsConnected(true);

      mqttClient.subscribe(
        ["SILO-101", "CNVR-101", "MILL-101", "CNVR-102", "NIVEL", "VALV-101"],
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
          topic === "SILO-101" ? Number(msg) : msg === "true" ? "ON" : "OFF",
      }));
    });

    mqttClient.on("error", (err) => {
      console.error("Error en MQTT: ", err);
    });

    return () => {
      mqttClient.end(); // Cierra la conexión cuando el componente se desmonte
    };
  }, []);

  // Función para enviar mensajes
  const sendMessage = (topic, message) => {
    const mqttClient = mqtt.connect(
      "wss://2467cd533de642cd852c4b0e3426dd9e.s1.eu.hivemq.cloud:8884/mqtt",
      {
        username: "djuanes7",
        password: "Jeagdrose9",
      }
    );

    mqttClient.publish(topic, message, {}, (err) => {
      if (err) {
        console.error(`Error al publicar en el tópico ${topic}: `, err);
      } else {
        console.log(`Mensaje enviado a ${topic}: ${message}`);
      }
    });
  };

  return (
    <MQTTContext.Provider value={{ statuses, isConnected, sendMessage }}>
      {children}
    </MQTTContext.Provider>
  );
};
