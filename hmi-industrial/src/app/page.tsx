import { useState, useEffect } from 'react';
import mqtt, { MqttClient } from 'mqtt'; // Importar el tipo MqttClient

export default function Home() {
  // Estado para mostrar el estado del PLC
  const [status, setStatus] = useState('Desconectado');
  const [client, setClient] = useState<MqttClient | null>(null); // Estado para el cliente MQTT

  useEffect(() => {
    // Conectar al broker MQTT con autenticación
    const mqttClient = mqtt.connect('wss://260739b4dbf540efbb87cd6f024aa9f0.s1.eu.hivemq.cloud:8884/mqtt', {
      username: 'djuanes9',
      password: 'Jeagdrose1125',
      rejectUnauthorized: false, // Set to false to allow self-signed certificates
    });

    // Cuando la conexión está establecida
    mqttClient.on('connect', () => {
      console.log('Conectado al broker MQTT');
      setStatus('Conectado');
      mqttClient.subscribe('plc/status');
    });

    // Cuando se recibe un mensaje
    mqttClient.on('message', (topic, message) => {
      if (topic === 'plc/status') {
        setStatus(message.toString());
      }
    });

    // Guardar el cliente en el estado para posibles desconexiones
    setClient(mqttClient);

    // Desconectar el cliente al desmontar el componente
    return () => {
      if (client) {
        client.end();
      }
    };
  }, [client]);

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-4">Estado del PLC: {status}</h1>
      <p className="text-lg">Conexión al broker MQTT de HiveMQ.</p>
    </div>
  );
}
