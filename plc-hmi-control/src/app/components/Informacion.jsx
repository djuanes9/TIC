import React, { useState, useEffect, useContext } from "react";
import { MQTTContext } from "./MQTTCliente";
import "./Info.css";

const Informacion = () => {
  const { sendMessage, statuses } = useContext(MQTTContext);

  const [configuracion, setConfiguracion] = useState({
    NameProdInicio: "Grano Descascarillado",
    NameProdFinal: "Grano Molido",
    NivelSiloMin: 10,
    NivelSiloMax: 90,
    CalidadIdeal: 50,
    TiempoPlanificado: 6,
  });

  const [configuracionActual, setConfiguracionActual] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const configuracionSalida = statuses["configuracion/salida"];

    if (configuracionSalida) {
      try {
        let data = configuracionSalida;

        if (typeof data === "string") {
          data = JSON.parse(data);
        }

        if (Array.isArray(data) && data.length > 0) {
          setConfiguracionActual(data[0]);
        } else {
          if (process.env.NODE_ENV === "development") {
            console.warn("El JSON recibido está vacío o no es un array válido.");
          }
          setConfiguracionActual(null);
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Error al procesar configuracion/salida:", error);
        }
        setConfiguracionActual(null);
      }
    }
  }, [statuses]);

  const obtenerFechaYHora = () => {
    const now = new Date();
    return {
      hora: now.toTimeString().split(" ")[0],
      dia: now.getDate(),
      mes: now.getMonth() + 1,
      anio: now.getFullYear(),
    };
  };

  const esperarDatos = (reintentos = 10) => {
    return new Promise((resolve, reject) => {
      const intervalo = setInterval(() => {
        if (statuses["configuracion/salida"] && configuracionActual) {
          clearInterval(intervalo);
          resolve(true);
        } else if (reintentos <= 0) {
          clearInterval(intervalo);
          reject(new Error("No se han recibido datos en el tiempo esperado."));
        }
        reintentos -= 1;
      }, 500); // Verifica cada 500 ms
    });
  };

  const handleSolicitarUltimaConfig = async () => {
    setLoading(true);
    sendMessage("request/config", "Solicitar última configuración");

    try {
      await esperarDatos(10); // Espera hasta 5 segundos (10 intentos de 500 ms)
      setLoading(false);
      setShowModal(true);
    } catch (error) {
      setLoading(false);
      alert("No se han recibido datos. Por favor, intente nuevamente.");
    }
  };

  const handleCerrarModal = () => {
    setShowModal(false);
  };

  const handleActualizar = (e) => {
    e.preventDefault();
    const fechaYHora = obtenerFechaYHora();

    const configuracionConFecha = {
      ...configuracion,
      ...fechaYHora,
    };
    sendMessage("configuracion/entrada", JSON.stringify(configuracionConFecha));
    alert("Configuración actualizada correctamente.");
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setConfiguracion((prevConfig) => ({
      ...prevConfig,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <div className="form-container">
      <h2>Configuración del Sistema</h2>

      <form className="config-form">
        <div className="form-group">
          <label>Nombre del Producto Inicial:</label>
          <input
            type="text"
            name="NameProdInicio"
            value={configuracion.NameProdInicio}
            onChange={(e) =>
              setConfiguracion({
                ...configuracion,
                NameProdInicio: e.target.value,
              })
            }
          />
        </div>
        <div className="form-group">
          <label>Nombre del Producto Final:</label>
          <input
            type="text"
            name="NameProdFinal"
            value={configuracion.NameProdFinal}
            onChange={(e) =>
              setConfiguracion({
                ...configuracion,
                NameProdFinal: e.target.value,
              })
            }
          />
        </div>
        <div className="form-group">
          <label>Nivel Silo Mínimo (%):</label>
          <input
            type="number"
            name="NivelSiloMin"
            value={configuracion.NivelSiloMin}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Nivel Silo Máximo (%):</label>
          <input
            type="number"
            name="NivelSiloMax"
            value={configuracion.NivelSiloMax}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Calidad Ideal (%):</label>
          <input
            type="number"
            name="CalidadIdeal"
            value={configuracion.CalidadIdeal}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Tiempo Molino (segundos):</label>
          <input
            type="number"
            name="TiempoPlanificado"
            value={configuracion.TiempoPlanificado}
            onChange={handleChange}
          />
        </div>
      </form>
      <button className="btn-submit" type="button" onClick={handleActualizar}>
        Actualizar Configuración
      </button>
      <button className="btn-request" onClick={handleSolicitarUltimaConfig}>
        Ver Configuración Actual
      </button>

      {loading && <p>Cargando configuración...</p>}

      {showModal && configuracionActual && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Última Configuración</h3>
            <table className="config-table">
              <tbody>
                <tr>
                  <td>Producto Inicial:</td>
                  <td>{configuracionActual.NameProdInicio}</td>
                </tr>
                <tr>
                  <td>Producto Final:</td>
                  <td>{configuracionActual.NameProdFinal}</td>
                </tr>
                <tr>
                  <td>Nivel Silo Mínimo:</td>
                  <td>{configuracionActual.NivelSiloMin}</td>
                </tr>
                <tr>
                  <td>Nivel Silo Máximo:</td>
                  <td>{configuracionActual.NivelSiloMax}</td>
                </tr>
                <tr>
                  <td>Calidad Ideal:</td>
                  <td>{configuracionActual.CalidadIdeal}</td>
                </tr>
                <tr>
                  <td>Tiempo Planificado:</td>
                  <td>{configuracionActual.TiempoPlanificado} minutos</td>
                </tr>
                <tr>
                  <td>Velocidad de Operación:</td>
                  <td>{configuracionActual.VelocidadOperacion} gramos/min</td>
                </tr>
                <tr>
                  <td>Hora:</td>
                  <td>{configuracionActual.hora}</td>
                </tr>
                <tr>
                  <td>Fecha:</td>
                  <td>{`${configuracionActual.dia}/${configuracionActual.mes}/${configuracionActual.anio}`}</td>
                </tr>
              </tbody>
            </table>
            <button className="btn-close" onClick={handleCerrarModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Informacion;
