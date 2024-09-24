"use client";

import React, { useEffect, useState } from "react";
import mqtt from "mqtt";

const MQTTClient = () => {
  const [isConnected, setIsConnected] = useState(false);

  // Estados para almacenar el estado de los tópicos
  const [statuses, setStatuses] = useState<{
    "SILO-101": number;
    "CNVR-101": string;
    "MILL-101": string;
    "CNVR-102": string;
    NIVEL: string;
  }>({
    "SILO-101": 0,   // Inicializado en 0 (para un valor entre 0 y 100)
    "CNVR-101": "OFF",
    "MILL-101": "OFF",
    "CNVR-102": "OFF",
    NIVEL: "OFF",
  });

  // Efecto para conectarse al broker MQTT
  useEffect(() => {
    const mqttClient = mqtt.connect('wss://260739b4dbf540efbb87cd6f024aa9f0.s1.eu.hivemq.cloud:8884/mqtt', {
      username: 'djuanes9', // Reemplaza con tu nombre de usuario
      password: 'Jeagdrose1125', // Reemplaza con tu contraseña
    });

    mqttClient.on("connect", () => {
      console.log("Conectado al broker MQTT");
      setIsConnected(true);

      // Suscribirse a los tópicos relevantes
      mqttClient.subscribe(
        ["SILO-101", "CNVR-101", "MILL-101", "CNVR-102", "NIVEL"],
        (err) => {
          if (err) {
            console.error("Error de suscripción: ", err);
          } else {
            console.log("Suscrito a los tópicos.");
          }
        }
      );
    });

    // Recibir mensajes de los tópicos
    mqttClient.on("message", (topic: string, message: Buffer) => {
      const msg = message.toString();
      console.log(`Mensaje recibido de ${topic}: ${msg}`);

      setStatuses((prevStatuses) => ({
        ...prevStatuses,
        // Para "SILO-101", guardamos un número, para los otros, "ON" o "OFF"
        [topic as keyof typeof statuses]: topic === "SILO-101" ? Number(msg) : (msg === "true" ? "ON" : "OFF"),
      }));
    });

    mqttClient.on("error", (err) => {
      console.error("Error en MQTT: ", err);
    });

    return () => {
      mqttClient.end();  // Cerrar la conexión cuando el componente se desmonte
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-black mb-4">Grain Milling Process Control</h1>
      <p>Status de conexión: {isConnected ? "Conectado" : "Desconectado"}</p>

      {/* Mostrar los estados de los tópicos */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        {/* SILO-101 */}
        <div className="p-4 border rounded">
          <h3 className="text-xl font-semibold text-black">SILO-101</h3>
          <p>Nivel: {statuses["SILO-101"]}%</p>
        </div>

        {/* CNVR-101 */}
        <div className="p-4 border rounded">
          <h3 className="text-xl font-semibold text-black">CNVR-101</h3>
          <p className={statuses["CNVR-101"] === "ON" ? "text-red-500" : "text-green-500"}>
            Estado: {statuses["CNVR-101"]}
          </p>
        </div>

        {/* MILL-101 */}
        <div className="p-4 border rounded">
          <h3 className="text-xl font-semibold">MILL-101</h3>
          <p className={statuses["MILL-101"] === "ON" ? "text-red-500" : "text-green-500"}>
            Estado: {statuses["MILL-101"]}
          </p>
        </div>

        {/* CNVR-102 */}
        <div className="p-4 border rounded">
          <h3 className="text-xl font-semibold">CNVR-102</h3>
          <p className={statuses["CNVR-102"] === "ON" ? "text-red-500" : "text-green-500"}>
            Estado: {statuses["CNVR-102"]}
          </p>
        </div>

        {/* NIVEL */}
        <div className="p-4 border rounded">
          <h3 className="text-xl font-semibold">NIVEL</h3>
          <p className={statuses["NIVEL"] === "ON" ? "text-red-500" : "text-green-500"}>
            Estado: {statuses["NIVEL"]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MQTTClient;
