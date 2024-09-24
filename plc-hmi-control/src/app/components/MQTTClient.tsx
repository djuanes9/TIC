"use client";

import React, { useEffect, useState } from "react";
import mqtt, { MqttClient } from "mqtt";

// Importa tus imágenes SVG
import SiloSvg from ".../public/silo.svg";  
import ConveyorSvg from ".../public/conveyor.svg";
import MillSvg from ".../public/mill.svg";

interface Message {
  topic: string;
  message: string;
}

type StatusKeys = "SILO-101" | "CNVR-101" | "MILL-101" | "CNVR-102" | "NIVEL";

const MQTTClient = () => {
  const [isConnected, setIsConnected] = useState(false);
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

  useEffect(() => {
    const mqttClient: MqttClient = mqtt.connect("wss://your-broker-url", {
      username: "YOUR_USERNAME",
      password: "YOUR_PASSWORD",
    });

    mqttClient.on("connect", () => {
      console.log("Connected to broker");
      setIsConnected(true);

      // Suscribirse a los tópicos
      mqttClient.subscribe(
        ["SILO-101", "CNVR-101", "MILL-101", "CNVR-102", "NIVEL"],
        (err) => {
          if (err) {
            console.error("Subscription error: ", err);
          } else {
            console.log("Subscribed to topics.");
          }
        }
      );
    });

    mqttClient.on("message", (topic: string, message: Buffer) => {
      const msg = message.toString();
      console.log(`Received message from ${topic}: ${msg}`);

      setStatuses((prevStatuses) => ({
        ...prevStatuses,
        [topic as StatusKeys]: topic === "SILO-101" ? Number(msg) : (msg === "true" ? "ON" : "OFF"),
      }));
    });

    mqttClient.on("error", (err) => {
      console.error("MQTT error: ", err);
    });

    return () => {
      mqttClient.end();
    };
  }, []);

  const sendMessage = (topic: string, message: string) => {
    if (!isConnected) {
      console.log("Not connected");
      return;
    }

    const mqttClient: MqttClient = mqtt.connect("wss://your-broker-url", {
      username: "YOUR_USERNAME",
      password: "YOUR_PASSWORD",
    });

    mqttClient.publish(topic, message);
  };

  return (
    <div className="p-6">
      <h1 className="text-black text-3xl font-bold">Grain Milling Process Control</h1>
      <h2 className="text-xl font-semibold">MQTT HMI</h2>
      <p>Status: {isConnected ? "Conectado" : "Desconectado"}</p>

      <div className="mt-4 grid grid-cols-2 gap-8">
        {/* Sección de Silo */}
        <div>
          <strong>SILO-101</strong>
          <p>Nivel: {statuses["SILO-101"]}%</p>
          <img
            src={SiloSvg}
            alt="Silo"
            className={`w-32 h-32 ${statuses["SILO-101"] > 0 ? "opacity-100" : "opacity-50"}`}
            style={{
              filter: `grayscale(${100 - statuses["SILO-101"]}%)`  // Más nivel, menos gris
            }}
          />
        </div>

        {/* Conveyor CNVR-101 */}
        <div>
          <strong>CNVR-101</strong>
          <p className={`ml-4 ${statuses["CNVR-101"] === "ON" ? "text-red-500" : "text-green-500"}`}>
            Estado: {statuses["CNVR-101"]}
          </p>
          <img
            src={ConveyorSvg}
            alt="Conveyor"
            className={`w-32 h-32 ${statuses["CNVR-101"] === "ON" ? "opacity-100" : "opacity-50"}`}
          />
        </div>

        {/* Molino MILL-101 */}
        <div>
          <strong>MILL-101</strong>
          <p className={`ml-4 ${statuses["MILL-101"] === "ON" ? "text-red-500" : "text-green-500"}`}>
            Estado: {statuses["MILL-101"]}
          </p>
          <img
            src={MillSvg}
            alt="Mill"
            className={`w-32 h-32 ${statuses["MILL-101"] === "ON" ? "opacity-100" : "opacity-50"}`}
          />
        </div>

        {/* Conveyor CNVR-102 */}
        <div>
          <strong>CNVR-102</strong>
          <p className={`ml-4 ${statuses["CNVR-102"] === "ON" ? "text-red-500" : "text-green-500"}`}>
            Estado: {statuses["CNVR-102"]}
          </p>
          <img
            src={ConveyorSvg}
            alt="Conveyor"
            className={`w-32 h-32 ${statuses["CNVR-102"] === "ON" ? "opacity-100" : "opacity-50"}`}
          />
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={() => sendMessage("start", "true")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
        >
          Start
        </button>
        <button
          onClick={() => sendMessage("stop", "true")}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default MQTTClient;
