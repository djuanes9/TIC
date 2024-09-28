"use client";
import "./globals.css";
import ReactDOM from "react-dom/client";  // Cambia la importación a 'react-dom/client'
import App from "./components/App";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);  // Usa 'createRoot'
root.render(<App />);  // Renderiza el componente usando 'root.render'
