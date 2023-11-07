import React from "react";
import logo from '../logos/logo.png';
import './inicioHome.css';
import { Icon } from '@iconify/react';
import { Link } from "react-router-dom";
function Inicio() {
  return (
    // <div>
    <>
      <header className="header">
        <Link  to="/registro" className='boton-registro'><strong>Regístrate</strong></Link>  
        <Link to="/perfil">
          <Icon icon="gg:profile" color="white" width="65" height="65" />
        </Link>
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