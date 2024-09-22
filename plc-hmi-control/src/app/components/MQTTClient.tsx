"use client";
import React, { useEffect, useState, useRef } from 'react';
import mqtt, { MqttClient }  from 'mqtt';

const MQTTClient = () => {
  const [isConnected, setIsConnected] = useState(false);
    
  // Definimos que clientRef puede ser de tipo MqttClient o null
  const clientRef = useRef<MqttClient  | null>(null);




  useEffect(() => {
    const client = mqtt.connect('wss://260739b4dbf540efbb87cd6f024aa9f0.s1.eu.hivemq.cloud:8884/mqtt', {
      username: 'djuanes9', // Reemplaza con tu nombre de usuario
      password: 'Jeagdrose1125', // Reemplaza con tu contraseña
      reconnectPeriod: 1000, // Reconecta automáticamente después de 1 segundo si se desconecta
      clean: true, // Mantén la sesión limpia
      connectTimeout: 30 * 1000, // Tiempo de espera de conexión
    });

    clientRef.current = client; // Almacenamos el cliente en la referencia


    client.on('connect', () => {
      console.log('Connected to broker');
      setIsConnected(true);

     // Suscribirse a los tópicos
     const topics = ['valvula', 'motor1', 'molino', 'motor2'];
     client.subscribe(topics, (err) => {
       if (!err) {
         console.log('Subscribed to topics: ${topics.join(', ')}');
       } else {
         console.error('Subscription error: ', err);
       }
     });
   });


    client.on('error', (err) => {
      console.error('Connection error: ', err);
      client.end();
    });

 // Manejar la recepción de mensajes
 client.on('message', (topics, message) => {
  console.log('Message received from ${topics}: ${message.toString()}');
  // Aquí puedes manejar cada mensaje según el tópico
});


    return () => {
      if (client) client.end();
    };
  }, []);

  // Funciones para publicar mensajes
  const publishStart = () => {
    if (isConnected) {
   //   clientRef.publish('start', '1');
      console.log('Published to start');
    } else {
      console.error('Client not connected');
    }
  };

  const publishStop = () => {
    if (isConnected) {
    //  clientRef.publish('stop', '1');
      console.log('Published to stop');
    } else {
      console.error('Client not connected');
    }
  };

  return (
    <div>
      <h2>MQTT Client</h2>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <button onClick={publishStart} disabled={!isConnected}>Start</button>
      <button onClick={publishStop} disabled={!isConnected}>Stop</button>
    </div>
  );
};


export default MQTTClient;
