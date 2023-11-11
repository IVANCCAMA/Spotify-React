import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link, useLocation } from "react-router-dom"; // Importar useLocation
import "./encabezado.css"

function Encabezado() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isAuthRoute = location.pathname === '/iniciarsesion' || location.pathname === '/registro';

  return (
    <div>
      <header className="header-Encabesado">
        {!isAuthRoute && (
          <>
            <Link to="/iniciarsesion" className='boton-iniciarsesion'><strong>Iniciar Sesión</strong></Link>
            <Link to="/registro" className='boton-registro'><strong>Regístrate</strong></Link>
          </>
        )}
        {!isAuthRoute && (
          <button onClick={toggleMenu}>
            <Icon icon="gg:profile" color="white" width="45" height="45" />
          </button>
        )}
        {isMenuOpen && (
          <div className="menu-options">
            <Link to="/perfil">Perfil</Link>
            <Link to="/">Cerrar sesión</Link>
          </div>
        )}
      </header>
    </div>
  );
}

export default Encabezado;
