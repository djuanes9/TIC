import React from "react";

const imgEPN = "https://daci.epn.edu.ec/images/inicio/logo_home_w.png";

function Heading() {
  return (
    <header>
      <h1 contentEditable="false" spellCheck="false">
        ESCUELA POLITÉCNICA NACIONAL
      </h1>
      <h2>Trabajo de integración Curricular</h2>
      <img className="circle-img " alt="EP" src={imgEPN} />
    </header>
  );
}

export default Heading;
