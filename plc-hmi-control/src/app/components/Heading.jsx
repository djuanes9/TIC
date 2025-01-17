import React from "react";

const imgEPN = "https://daci.epn.edu.ec/images/inicio/logo_home_w.png";

function Heading() {
  return (
    <header>
      <div>
        <h1 contentEditable="false" spellCheck="false">
          ESCUELA POLITÉCNICA NACIONAL
        </h1>
        <h2>Sistema de Automatización y Control Industrial</h2>
        <h3>Trabajo de Integración Curricular</h3> {/* Modificación aquí */}
      </div>
      <img className="circle-img" alt="EP" src={imgEPN} />
    </header>
  );
}

export default Heading;
