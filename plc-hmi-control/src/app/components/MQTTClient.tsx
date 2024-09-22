"use client"; // Asegúrate de que este componente se ejecute en el cliente
import React, { useEffect, useState } from 'react';
import mqtt, { MqttClient } from 'mqtt';

type StatusKeys = "SILO-101" | "CNVR-101" | "MILL-101" | "CNVR-102" | "NIVEL";

const MQTTClient = () => {
  // Estados
  const [isConnected, setIsConnected] = useState(false);
  const [statuses, setStatuses] = useState<Record<StatusKeys, string>>({
    "SILO-101": "OFF",
    "CNVR-101": "OFF",
    "MILL-101": "OFF",
    "CNVR-102": "OFF",
    "NIVEL": "OFF",
  });
  const [client, setClient] = useState<MqttClient | null>(null);

  // Efecto para conectar al broker MQTT
  useEffect(() => {
    const mqttClient = mqtt.connect('wss://260739b4dbf540efbb87cd6f024aa9f0.s1.eu.hivemq.cloud:8884/mqtt', {
      username: 'djuanes9', // Reemplaza con tu nombre de usuario
      password: 'Jeagdrose1125', // Reemplaza con tu contraseña
      reconnectPeriod: 1000,
      clean: true,
      connectTimeout: 30 * 1000,
    });

    mqttClient.on('connect', () => {
      console.log('Connected to broker');
      setIsConnected(true);

      // Suscripción a los tópicos
      mqttClient.subscribe(['SILO-101', 'CNVR-101', 'MILL-101', 'CNVR-102', 'NIVEL'], (err) => {
        if (err) {
          console.error('Subscription error: ', err);
        } else {
          console.log('Subscribed to topics');
        }
      });
    });

    mqttClient.on('error', (err: Error) => {
      console.error('Connection error: ', err);
      mqttClient.end();
    });

    mqttClient.on('message', (topic: string, message: Buffer) => {
      const msg = message.toString();
      console.log(`Message received from ${topic}: ${msg}`);

      // Actualizamos los estados de los tópicos según los mensajes recibidos
      setStatuses((prevStatuses) => ({
        ...prevStatuses,
        [topic as StatusKeys]: msg === "true" ? "ON" : "OFF", // Convierto el mensaje en ON/OFF
      }));
    });

    setClient(mqttClient); // Guardamos el cliente para usarlo más tarde

    return () => {
      mqttClient.end();
    };
  }, []);

  // Función para publicar en los tópicos
  const publishMessage = (topic: string, message: string) => {
    if (client) {
      client.publish(topic, message, {}, (err) => {
        if (err) {
          console.error('Publish error: ', err);
        } else {
          console.log(`Message ${message} sent to topic ${topic}`);
        }
      });
    }
  };

  return (
    <div className="p-4">
     <h2 className="text-black text-3xl font-bold">Grain Milling Process Control</h2>
      <p>Status: <span className={isConnected ? 'text-green-500' : 'text-red-500'}>{isConnected ? 'Conectado' : 'Desconectado'}</span></p>
      
      {/* Mostramos los estados de los tópicos */}
      {(Object.keys(statuses) as StatusKeys[]).map((key) => (
        <div key={key} className="mb-2">
          <h3 className="text-xl font-semibold">{key}</h3>
          <p className={`text-lg ${statuses[key] === "ON" ? 'text-red-500' : 'text-green-500'}`}>
            Estado: {statuses[key]}
          </p>
        </div>
      ))}

      {/* Botones para publicar en los tópicos start/stop */}
      <div className="mt-4">
        <button
          onClick={() => publishMessage('start', 'true')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Start
        </button>
        <button
          onClick={() => publishMessage('stop', 'true')}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default MQTTClient;
