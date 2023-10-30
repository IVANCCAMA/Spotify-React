import React from "react";
import logo from '../logos/logo.png';
import './inicioHome.css';
import { Link } from "react-router-dom";
function Inicio() {
  return (
    // <div>
    <>
      <header className="header">
        <Link to="/registro" className='boton-registro'>Regístrate</Link>
      </header>
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