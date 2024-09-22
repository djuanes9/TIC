"use client"; // Asegúrate de que este componente se ejecute en el cliente

import React, { useEffect, useState } from 'react';
import mqtt, { MqttClient } from 'mqtt';

interface Message {
  topic: string;
  message: string;
}

const MQTTClient = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [client, setClient] = useState<MqttClient | null>(null); // Cliente MQTT

  // Lista de tópicos a los que nos suscribiremos automáticamente
  const topics = ['valv1', 'motor1', 'motor2', 'mill', 'nivel'];

  useEffect(() => {
    // Conectar al broker MQTT con las credenciales
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

      // Suscribirse a los tópicos automáticamente
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

    mqttClient.on('error', (err: Error) => {
      console.error('Error de conexión:', err);
      mqttClient.end();
    });

    mqttClient.on('message', (topic: string, message: Buffer) => {
      console.log(`Mensaje recibido de ${topic}: ${message.toString()}`);
      setMessages((prevMessages) => [...prevMessages, { topic, message: message.toString() }]);
    });

    setClient(mqttClient); // Guardar el cliente para futuras publicaciones

    return () => {
      mqttClient.end();
    };
  }, []);

  // Función para publicar mensajes en los tópicos
  const publishMessage = (topic: string, message: string) => {
    if (client && isConnected) {
      client.publish(topic, message, { qos: 1 }, (err) => {
        if (err) {
          console.error(`Error al publicar en ${topic}:`, err);
        } else {
          console.log(`Mensaje publicado en ${topic}: ${message}`);
        }
      });
    }
  };

  return (
    <div>
      <h2>MQTT Client</h2>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>

      <div>
        {/* Botones para publicar en los tópicos "start" y "stop" */}
        <button onClick={() => publishMessage('start', 'true')}>Start</button>
        <button onClick={() => publishMessage('stop', 'true')}>Stop</button>
      </div>

      <h3>Messages:</h3>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.topic}:</strong> {msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MQTTClient;
