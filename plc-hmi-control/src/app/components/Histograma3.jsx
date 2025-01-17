import React, { useContext, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Brush,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MQTTContext } from "./MQTTCliente";

const Histograma2 = ({ title, topic }) => {
  const { statuses, sendMessage } = useContext(MQTTContext);
  const [histogramData, setHistogramData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [hasData, setHasData] = useState(false);

  const sendDateToNodeRed = () => {
    if (selectedDate && topic) {
      sendMessage(
        "fecha/tiempo",
        JSON.stringify({ date: selectedDate, topic })
      );
    }
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  useEffect(() => {
    if (statuses[topic]) {
      try {
        const data = statuses[topic];
        const parsedData = typeof data === "string" ? JSON.parse(data) : data;

        if (Array.isArray(parsedData) && parsedData.length > 0) {
          setHistogramData(parsedData);
          setHasData(true);
        } else {
          setHistogramData([]);
          setHasData(false);
        }
      } catch (error) {
        console.error("Error parsing data:", error);
        setHistogramData([]);
        setHasData(false);
      }
    }
  }, [statuses, topic, selectedDate]);

  return (
    <div className="histograma-container">
      <h3 className="histograma-title">{title}</h3>
      <div className="histograma-controls">
        <input type="date" value={selectedDate} onChange={handleDateChange} />
        <button onClick={sendDateToNodeRed}>Consultar datos</button>
      </div>

      <div className="histograma-message">
        {hasData ? (
          <p>Mostrando datos para: {selectedDate}</p>
        ) : (
          <p>No existen registros para la fecha seleccionada</p>
        )}
      </div>

      <div className="histograma-chart">
        <ResponsiveContainer>
          <BarChart data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Brush dataKey="x" height={30} stroke="#3961ee" />
            <Bar dataKey="Molino" fill="#3961ee" />
            <Bar dataKey="Screw" fill="#FFBB28" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Histograma2;
