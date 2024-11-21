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
    CalidadIdeal: 90,
    TiempoPlanificado: 60,
    VelocidadOperacion: 20,
  });

  const [configuracionActual, setConfiguracionActual] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Procesar los datos de MQTT para el tópico configuracion/salida
  useEffect(() => {
    if (statuses["configuracion/salida"]) {
      try {
        let data = statuses["configuracion/salida"];

        // Manejo flexible para objetos o strings
        if (typeof data === "string") {
          data = JSON.parse(data);
        }

        // Extraer el primer elemento del array recibido
        if (Array.isArray(data) && data.length > 0) {
          console.log("Datos procesados para el modal:", data[0]);
          setConfiguracionActual(data[0]); // Usamos el primer elemento del array
        } else {
          console.warn("El JSON recibido está vacío o no es un array válido.");
          setConfiguracionActual(null);
        }
      } catch (error) {
        console.error("Error al procesar configuracion/salida:", error);
        setConfiguracionActual(null);
      }
    }
  }, [statuses]);

  // Obtener fecha y hora actual en el formato necesario
  const obtenerFechaYHora = () => {
    const now = new Date();
    return {
      hora: now.toTimeString().split(" ")[0], // hh:mm:ss
      dia: now.getDate(),
      mes: now.getMonth() + 1, // Meses en JS empiezan desde 0
      anio: now.getFullYear(),
    };
  };

  // Solicitar la última configuración y mostrar modal solo cuando hay datos válidos
  const handleSolicitarUltimaConfig = () => {
    sendMessage("request/config", "Solicitar última configuración");

    // Agregar un pequeño retraso para esperar datos
    setTimeout(() => {
      if (statuses["configuracion/salida"] && configuracionActual) {
        setShowModal(true);
      } else {
        alert("No se han recibido datos. Por favor, intente nuevamente.");
      }
    }, 1200);
  };

  const handleCerrarModal = () => {
    setShowModal(false);
  };

  const handleActualizar = (e) => {
    e.preventDefault();
    const fechaYHora = obtenerFechaYHora();

    const configuracionConFecha = {
      ...configuracion,
      ...fechaYHora, // Agregamos hora, día, mes y año al payload
    };
    sendMessage("configuracion/entrada", JSON.stringify(configuracionConFecha));
    alert("Configuración actualizada correctamente.");
  };

  // Función para manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setConfiguracion((prevConfig) => ({
      ...prevConfig,
      [name]: type === "number" ? parseFloat(value) || 0 : value, // Convertir a número si es necesario
    }));
  };

  return (
    <div className="form-container">
      <h2>Configuración del Sistema</h2>

      {/* Formulario para enviar nueva configuración */}
      <form>
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
          <label>Nivel Silo Mínimo:</label>
          <input
            type="number"
            name="NivelSiloMin"
            value={configuracion.NivelSiloMin}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Nivel Silo Máximo:</label>
          <input
            type="number"
            name="NivelSiloMax"
            value={configuracion.NivelSiloMax}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Calidad Ideal:</label>
          <input
            type="number"
            name="CalidadIdeal"
            value={configuracion.CalidadIdeal}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Tiempo Planificado (minutos):</label>
          <input
            type="number"
            name="TiempoPlanificado"
            value={configuracion.TiempoPlanificado}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Velocidad de Operación (gramos/min):</label>
          <input
            type="number"
            name="VelocidadOperacion"
            value={configuracion.VelocidadOperacion}
            onChange={handleChange}
          />
        </div>
        <button className="btn-submit" type="button" onClick={handleActualizar}>
          Actualizar Configuración
        </button>
      </form>
      {/* Botón para solicitar configuración */}
      <button className="btn-request" onClick={handleSolicitarUltimaConfig}>
        Ver Configuración Actual
      </button>

      {/* Modal para mostrar la configuración */}
      {showModal && configuracionActual && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Última Configuración</h3>
            <table className="config-table">
              <tbody>
                <tr>
                  <td>
                    <strong>Producto Inicial:</strong>
                  </td>
                  <td>{configuracionActual.NameProdInicio}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Producto Final:</strong>
                  </td>
                  <td>{configuracionActual.NameProdFinal}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Nivel Silo Mínimo:</strong>
                  </td>
                  <td>{configuracionActual.NivelSiloMin}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Nivel Silo Máximo:</strong>
                  </td>
                  <td>{configuracionActual.NivelSiloMax}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Calidad Ideal:</strong>
                  </td>
                  <td>{configuracionActual.CalidadIdeal}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Tiempo Planificado:</strong>
                  </td>
                  <td>{configuracionActual.TiempoPlanificado} minutos</td>
                </tr>
                <tr>
                  <td>
                    <strong>Velocidad de Operación:</strong>
                  </td>
                  <td>{configuracionActual.VelocidadOperacion} gramos/min</td>
                </tr>
                <tr>
                  <td>
                    <strong>Hora:</strong>
                  </td>
                  <td>{configuracionActual.hora}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Fecha:</strong>
                  </td>
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
