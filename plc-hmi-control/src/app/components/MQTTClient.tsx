"use client";
import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';

const MQTTClient = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const client = mqtt.connect('wss://260739b4dbf540efbb87cd6f024aa9f0.s1.eu.hivemq.cloud:8884/mqtt', {
      username: 'djuanes9', // Reemplaza con tu nombre de usuario
      password: 'Jeagdrose1125', // Reemplaza con tu contraseña
      reconnectPeriod: 1000, // Reconecta automáticamente después de 1 segundo si se desconecta
      clean: true, // Mantén la sesión limpia
      connectTimeout: 30 * 1000, // Tiempo de espera de conexión
    });

    client.on('connect', () => {
      console.log('Connected to broker');
      setIsConnected(true);

      // Suscribirse a un tópico
      client.subscribe('test/topic', (err) => {
        if (!err) {
          console.log('Subscribed successfully');
        } else {
          console.error('Subscription error: ', err);
        }
      });
    });

    client.on('error', (err) => {
      console.error('Connection error: ', err);
      client.end();
    });

    client.on('message', (topic, message) => {
      console.log(`Message received from ${topic}: ${message.toString()}`);
    });

    return () => {
      if (client) client.end();
    };
  }, []);

  return (
    <div>
      <h2>MQTT Client</h2>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
    </div>
  );
};

export default MQTTClient;
