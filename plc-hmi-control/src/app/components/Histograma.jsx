import React, { useContext, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  Brush,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MQTTContext } from "./MQTTCliente";

const Histograma = ({ title, topic }) => {
  const { statuses, sendMessage } = useContext(MQTTContext);
  const [histogramData, setHistogramData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [hasData, setHasData] = useState(false);

  const sendDateToNodeRed = () => {
    if (selectedDate && topic) {
      sendMessage(
        "fecha/seleccionada",
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
        if (Array.isArray(data) && data.length === 0) {
          setHistogramData([]);
          setHasData(false);
        } else if (data) {
          const parsedData = typeof data === "object" ? data : JSON.parse(data);
          setHistogramData(parsedData);
          setHasData(true);
        }
      } catch {
        setHistogramData([]);
        setHasData(false);
      }
    }
  }, [statuses, topic, selectedDate]);

  return (
    <div className="histograma-container">
      {/* Título encima de los controles */}
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
          <LineChart data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Brush dataKey="x" height={30} stroke="#3961ee" />
            <Line
              dataKey="Nivel"
              fill="#3961ee"
              stroke="#3961ee"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Histograma;
