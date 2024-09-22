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
  const [topic, setTopic] = useState('');
  const [client, setClient] = useState<MqttClient | null>(null); // Cambiado a MqttClient

  useEffect(() => {
    const mqttClient = mqtt.connect('wss://260739b4dbf540efbb87cd6f024aa9f0.s1.eu.hivemq.cloud:8884/mqtt', {
      username: 'djuanes9', // Reemplaza con tu nombre de usuario
      password: 'Jeagdrose1125', // Reemplaza con tu contraseña
      reconnectPeriod: 1000,
      clean: true,
      connectTimeout: 30 * 1000,
    });

    mqttClient.on('connect', () => {
      console.log('Connected to broker');
      setIsConnected(true);
    });

    mqttClient.on('error', (err: Error) => {
      console.error('Connection error: ', err);
      mqttClient.end();
    });

    mqttClient.on('message', (topic: string, message: Buffer) => {
      console.log(`Message received from ${topic}: ${message.toString()}`);
      setMessages(prevMessages => [...prevMessages, { topic, message: message.toString() }]);
    });

    setClient(mqttClient); // Guarda el cliente para usarlo más tarde

    return () => {
      mqttClient.end();
    };
  }, []);

  const subscribeToTopic = () => {
    if (client && topic) {
      client.subscribe(topic, (err) => {
        if (err) {
          console.error('Subscription error: ', err);
        } else {
          console.log(`Subscribed to ${topic}`);
        }
      });
    }
  };

  return (
    <div>
      <h2>MQTT Client</h2>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <div>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic to subscribe"
        />
        <button onClick={subscribeToTopic}>Subscribe</button>
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
