import MQTTClient from './components/MQTTClient';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <MQTTClient />
    </div>
  );
};

export default Home;
