"use client";
import React, { createContext, useState, useEffect } from "react";
import mqtt from "mqtt";

// Crear el contexto para manejar MQTT globalmente
export const MQTTContext = createContext();

export const MQTTProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false); // Estado de conexión
  const [statuses, setStatuses] = useState({
    "SILO-101": 0,
    "CNVR-101": "OFF",
    "MILL-101": "OFF",
    "SIV-101": "OFF",
    "VALV-101": "OFF",
    NIVEL: "OFF",
    "status/node-red": null,
    "histograma/nivel": null,
    "nivel/actual": 0,
    "wt1/actual": 0,
    "wt2/actual": 0,
    "peso/actual": null,
    "tiempos/actual": null,
    "calidad/actual": 0,
    "configuracion/salida": null,
  });

  const [mqttClient, setMqttClient] = useState(null); // Estado para almacenar el cliente MQTT
  const [lastPing, setLastPing] = useState(null); // Estado para almacenar el último "ping" de Node-RED
  const [isNodeRedConnected, setIsNodeRedConnected] = useState(false); // Estado de conexión de Node-RED

  // Función para inicializar la conexión MQTT
  const initializeMQTTConnection = () => {
    if (!mqttClient) {
      console.log("Intentando conectar al broker MQTT...");
      const client = mqtt.connect(
        "wss://2467cd533de642cd852c4b0e3426dd9e.s1.eu.hivemq.cloud:8884/mqtt",
        {
          username: "djuanes7",
          password: "Jeagdrose9", // Actualiza con los credenciales correctos
          reconnectPeriod: 5000, // Intentar reconectar cada 5 segundos si se pierde la conexión
          connectTimeout: 30 * 1000, // Tiempo de espera para la conexión
        }
      );

      setMqttClient(client);

      client.on("connect", () => {
        console.log("Conectado al broker MQTT");
        setIsConnected(true);

        client.subscribe(
          [
            "SILO-101",
            "CNVR-101",
            "MILL-101",
            "SIV-101",
            "NIVEL",
            "VALV-101",
            "status/node-red",
            "histograma/nivel",
            "nivel/actual",
            "wt1/actual",
            "wt2/actual",
            "peso/actual",
            "calidad/actual",
            "tiempos/actual",
            "configuracion/salida",
          ],
          (err) => {
            if (err) {
              console.error("Error de suscripción: ", err);
            } else {
              console.log("Suscrito a los tópicos.");
            }
          }
        );
      });

      client.on("message", (topic, message) => {
        const msg = message.toString();
        console.log(`Mensaje recibido de ${topic}: ${msg}`);

        setStatuses((prevStatuses) => {
          if (topic === "lista/config") {
            try {
              const parsedArray = JSON.parse(msg); // Parseamos el mensaje a un array
              return {
                ...prevStatuses,
                [topic]: Array.isArray(parsedArray) ? parsedArray : [], // Solo guardamos si es un array
              };
            } catch (error) {
              console.error(`Error al parsear el mensaje en ${topic}:`, error);
              return prevStatuses; // Si falla, no modificar el estado
            }
          }

          if (topic === "peso/actual") {
            try {
              // Intentamos parsear el mensaje como JSON
              const parsedMsg = JSON.parse(msg);
              return {
                ...prevStatuses,
                [topic]: parsedMsg, // Asignamos el objeto parseado al estado
              };
            } catch (error) {
              console.error(`Error al parsear el mensaje en ${topic}:`, error);
              return prevStatuses; // Si falla, no modificar el estado
            }
          }
          if (topic === "tiempos/actual") {
            try {
              // Intentamos parsear el mensaje como JSON
              const parsedMsg = JSON.parse(msg);
              return {
                ...prevStatuses,
                [topic]: parsedMsg, // Asignamos el objeto parseado al estado
              };
            } catch (error) {
              console.error(`Error al parsear el mensaje en ${topic}:`, error);
              return prevStatuses; // Si falla, no modificar el estado
            }
          }
          if (topic === "configuracion/salida") {
            try {
              // Intentamos parsear el mensaje como JSON
              const parsedMsg = JSON.parse(msg);
              return {
                ...prevStatuses,
                [topic]: parsedMsg, // Asignamos el objeto parseado al estado
              };
            } catch (error) {
              console.error(`Error al parsear el mensaje en ${topic}:`, error);
              return prevStatuses; // Si falla, no modificar el estado
            }
          }

          if (topic === "histograma/nivel") {
            try {
              // Intentamos parsear el mensaje como JSON
              const parsedMsg = JSON.parse(msg);
              return {
                ...prevStatuses,
                [topic]: parsedMsg, // Asignamos el objeto parseado al estado
              };
            } catch (error) {
              console.error(`Error al parsear el mensaje en ${topic}:`, error);
              return prevStatuses; // Si falla, no modificar el estado
            }
          }

          // Para otros tópicos, tratarlos como valores simples
          return {
            ...prevStatuses,
            [topic]:
              topic === "SILO-101"
                ? Number(msg) // Para "SILO-101", convertir a número
                : topic === "nivel/actual"
                ? Number(msg) // Para "SILO-101", convertir a número
                : topic === "wt1/actual"
                ? Number(msg) // Para "SILO-101", convertir a número
                : topic === "wt2/actual"
                ? Number(msg) // Para "SILO-101", convertir a número
                : topic === "calidad/actual"
                ? Number(msg) // Para "SILO-101", convertir a número
                : topic === "status/node-red"
                ? msg // Dejar texto para "status/node-red"
                : msg === "true"
                ? "ON"
                : "OFF", // Asignar "ON" o "OFF" para booleanos
          };
        });

        // Si el mensaje proviene de "status/node-red", actualizamos el tiempo del último ping
        if (topic === "status/node-red") {
          setLastPing(Date.now());
          setIsNodeRedConnected(true); // Node-RED está conectado si recibimos el ping
        }
      });

      client.on("error", (err) => {
        console.error("Error en MQTT: ", err);
      });

      client.on("reconnect", () => {
        console.log("Intentando reconectar al broker MQTT...");
      });

      client.on("offline", () => {
        console.log("El cliente MQTT está desconectado.");
        setIsConnected(false);
      });
    }
  };

  // Inicializar la conexión MQTT al cargar el componente
  useEffect(() => {
    initializeMQTTConnection(); // Iniciar la conexión una vez

    return () => {
      if (mqttClient) {
        mqttClient.end(); // Cierra la conexión cuando el componente se desmonte
      }
    };
  }, [mqttClient]);

  // Verificar si Node-RED ha dejado de enviar pings
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastPing && Date.now() - lastPing > 10000) {
        // Si han pasado más de 10 segundos sin recibir un ping
        setIsNodeRedConnected(false); // Node-RED está desconectado
      }
    }, 5000); // Verificar cada 5 segundos

    return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
  }, [lastPing]);

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
    <MQTTContext.Provider
      value={{ statuses, isConnected, sendMessage, isNodeRedConnected }}
    >
      {children}
    </MQTTContext.Provider>
  );
};
