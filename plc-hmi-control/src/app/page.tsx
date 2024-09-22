import MQTTClient from './components/MQTTClient';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Grain Milling Process Control</h1>
      <MQTTClient />
    </div>
  );
};

export default Home;
