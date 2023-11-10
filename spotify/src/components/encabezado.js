import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link } from "react-router-dom";
import "./encabezado.css"

function Encabezado() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
      <header className="header-Encabesado">
        <Link to="/iniciarsesion" className='boton-iniciarsesion'><strong>Iniciar Sesión</strong></Link>
        <Link to="/registro" className='boton-registro'><strong>Regístrate</strong></Link>
        <button onClick={toggleMenu}>
          <Icon icon="gg:profile" color="white" width="45" height="45" />
        </button>
        {isMenuOpen && (
          <div className="menu-options">
            <Link to="/perfil" onClick={closeMenu}>Perfil</Link>
            <Link to="/" onClick={closeMenu}>Cerrar sesión</Link>
          </div>
        )}
      </header>
  );
}

export default Encabezado;
