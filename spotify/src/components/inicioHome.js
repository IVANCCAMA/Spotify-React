import React from "react";
import logo from '../logos/logo.png';
import './inicioHome.css';

function Inicio() {
  return (
    // <div>
    <>
      
      <div className="contenedor-imagen">
        <div className="logoInicio">
          <img src={logo} alt="" width="400" />
        </div>
      </div>
    </>
    // </div>
  );
}

export default Inicio;