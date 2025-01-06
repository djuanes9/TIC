import React, { useState, useEffect } from "react";
import Heading from "./Heading";
import { MQTTProvider } from "./MQTTCliente";
import Footer from "./Footer";
import InterfazHMI from "./InterfazHMI";
import Histograma from "./Histograma";
import TabsBar from "./TabsBar";
import Informacion from "./Informacion";
import Dashboard from "./Dashboard";
import Maquinaria from "./Maquinaria";
import Login from "./Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para autenticación
  const [userRole, setUserRole] = useState(null); // Estado para el rol del usuario
  const [userName, setUserName] = useState(""); // Estado para el nombre del usuario
  const [selectedTab, setSelectedTab] = useState("HMI"); // Estado para la pestaña seleccionada

  // Cargar sesión al iniciar la aplicación
  useEffect(() => {
    const savedAuth = localStorage.getItem("isAuthenticated");
    const savedRole = localStorage.getItem("userRole");
    const savedUser = localStorage.getItem("userName");

    if (savedAuth === "true" && savedRole && savedUser) {
      setIsAuthenticated(true);
      setUserRole(savedRole);
      setUserName(savedUser);
    }
  }, []);

  // Función para manejar autenticación
  const handleLogin = (username, password) => {
    // Simulación de validación de usuario
    if (username === "admin" && password === "admin123") {
      setIsAuthenticated(true);
      setUserRole("admin");
      setUserName("Administrador");
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("userName", "Administrador");
    } else if (username === "user" && password === "user123") {
      setIsAuthenticated(true);
      setUserRole("user");
      setUserName("Usuario");
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", "user");
      localStorage.setItem("userName", "Usuario");
    } else {
      alert("Credenciales incorrectas");
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName("");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
  };

  // Función para manejar el cambio de pestaña
  const handleTabSelect = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div>
      <Heading />
      {!isAuthenticated ? (
        // Mostrar página de login si no está autenticado
        <Login onLogin={handleLogin} />
      ) : (
        // Mostrar aplicación principal si está autenticado
        <div>
          <MQTTProvider>
            <TabsBar
              tabs={[
                "HMI",
                "Información",
                "Máquinaria",
                "Producción",
              ]}
              onSelect={handleTabSelect}
              user={userName} // Pasar el nombre del usuario
              role={userRole} // Pasar el nivel de acceso
              onLogout={handleLogout} // Función de cerrar sesión
            />
            <div className="main-container">
              {selectedTab === "HMI" && <InterfazHMI />}
              {selectedTab === "Información" && <Informacion />}
              {selectedTab === "Histograma" && <Histograma />}
              {selectedTab === "Máquinaria" && <Maquinaria />}
              {selectedTab === "Producción" && <Dashboard />}
            </div>
          </MQTTProvider>
          <Footer />
        </div>
      )}
    </div>
  );
}

export default App;
