import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';

interface Message {
  topic: string;
  message: string;
}

const MQTTClient = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [topic, setTopic] = useState('');

  useEffect(() => {
    const client = mqtt.connect('wss://260739b4dbf540efbb87cd6f024aa9f0.s1.eu.hivemq.cloud:8884/mqtt', {
      username: 'djuanes9', // Reemplaza con tu nombre de usuario
      password: 'Jeagdrose1125', // Reemplaza con tu contraseña
      reconnectPeriod: 1000,
      clean: true,
      connectTimeout: 30 * 1000,
    });

    client.on('connect', () => {
      console.log('Connected to broker');
      setIsConnected(true);
    });

    client.on('error', (err) => {
      console.error('Connection error: ', err);
      client.end();
    });

    client.on('message', (topic, message) => {
      console.log(`Message received from ${topic}: ${message.toString()}`);
      setMessages(prevMessages => [...prevMessages, { topic, message: message.toString() }]);
    });

    return () => {
      if (client) client.end();
    };
  }, []);

  const subscribeToTopic = () => {
    if (topic) {
      const client = mqtt.connect('wss://260739b4dbf540efbb87cd6f024aa9f0.s1.eu.hivemq.cloud:8884/mqtt', {
        username: 'djuanes9', // Reemplaza con tu nombre de usuario
        password: 'Jeagdrose1125', // Reemplaza con tu contraseña
        reconnectPeriod: 1000,
        clean: true,
        connectTimeout: 30 * 1000,
      });

      client.on('connect', () => {
        client.subscribe(topic, (err) => {
          if (!err) {
            console.log(`Subscribed to ${topic}`);
          } else {
            console.error('Subscription error: ', err);
          }
        });
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
