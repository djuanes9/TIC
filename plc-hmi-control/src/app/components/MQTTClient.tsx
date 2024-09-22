"use client";

import React, { useEffect, useState } from "react";
import mqtt, { MqttClient } from "mqtt";

const MQTTClientHMI = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [topicStates, setTopicStates] = useState({
    valv1: false,
    motor1: false,
    motor2: false,
    mill: false,
    nivel: false,
  });
  const [client, setClient] = useState<MqttClient | null>(null);

  // Tópicos a los que nos suscribiremos
  const topics = ["valv1", "motor1", "motor2", "mill", "nivel"];

  useEffect(() => {
    const mqttClient = mqtt.connect('wss://260739b4dbf540efbb87cd6f024aa9f0.s1.eu.hivemq.cloud:8884/mqtt', {
      username: 'djuanes9', // Reemplaza con tu nombre de usuario
      password: 'Jeagdrose1125', // Reemplaza con tu contraseña
      reconnectPeriod: 1000,
      clean: true,
      connectTimeout: 30 * 1000,
    });

    mqttClient.on("connect", () => {
      setIsConnected(true);
      topics.forEach((topic) => {
        mqttClient.subscribe(topic, (err) => {
          if (err) {
            console.error(`Error al suscribirse a ${topic}:`, err);
          } else {
            console.log(`Suscrito a ${topic}`);
          }
        });
      });
    });

    mqttClient.on("message", (topic: string, message: Buffer) => {
      const msg = message.toString() === "true";
      setTopicStates((prev) => ({ ...prev, [topic]: msg }));
    });

    setClient(mqttClient);

    return () => {
      mqttClient.end();
    };
  }, []);

  const publishMessage = (topic: string) => {
    if (client && isConnected) {
      client.publish(topic, "true", { qos: 1 }, (err) => {
        if (err) {
          console.error(`Error al publicar en ${topic}:`, err);
        } else {
          console.log(`Mensaje publicado en ${topic}: true`);
        }
      });
    }
  };

  // Funcion para asignar colores segun estado
  const getStatusColor = (state: boolean) => (state ? "bg-red-500" : "bg-green-500");

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">MQTT HMI</h2>
      <p className="mb-4">Status: {isConnected ? "Conectado" : "Desconectado"}</p>

      <div className="grid grid-cols-4 gap-4">
        {/* SILO-101 */}
        <div className={`p-4 rounded-lg ${getStatusColor(topicStates.valv1)}`}>
          <h3 className="font-bold">SILO-101</h3>
          <p>Estado: {topicStates.valv1 ? "ON" : "OFF"}</p>
        </div>

        {/* CNVR-101 */}
        <div className={`p-4 rounded-lg ${getStatusColor(topicStates.motor1)}`}>
          <h3 className="font-bold">CNVR-101</h3>
          <p>Estado: {topicStates.motor1 ? "ON" : "OFF"}</p>
        </div>

        {/* MILL-101 */}
        <div className={`p-4 rounded-lg ${getStatusColor(topicStates.mill)}`}>
          <h3 className="font-bold">MILL-101</h3>
          <p>Estado: {topicStates.mill ? "ON" : "OFF"}</p>
        </div>

        {/* CNVR-102 */}
        <div className={`p-4 rounded-lg ${getStatusColor(topicStates.motor2)}`}>
          <h3 className="font-bold">CNVR-102</h3>
          <p>Estado: {topicStates.motor2 ? "ON" : "OFF"}</p>
        </div>

        {/* Nivel */}
        <div className={`p-4 rounded-lg ${getStatusColor(topicStates.nivel)}`}>
          <h3 className="font-bold">NIVEL</h3>
          <p>Estado: {topicStates.nivel ? "ON" : "OFF"}</p>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => publishMessage("start")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
        >
          Start
        </button>
        <button
          onClick={() => publishMessage("stop")}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default MQTTClientHMI;
