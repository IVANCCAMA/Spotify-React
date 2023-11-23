import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link } from "react-router-dom";
import "./encabezado.css"

function Encabezado({ loggedIn, signOff }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="header-Encabesado">
      {loggedIn ? (
        <>
          <button className='btn-header' style={{ backgroundColor: '#006666' }}
            onBlur={() => { setIsMenuOpen(false); }}
            onClick={() => { setIsMenuOpen(!isMenuOpen); }}>
            <Icon icon="gg:profile" color="white" width="45" height="45" />
          </button>

          <div
            className="menu-options"
            style={{ scale: isMenuOpen ? '1' : '0' }}>
            <Link to="/perfil">Perfil</Link>
            <button
              onClick={() => {
                signOff();
                window.location.replace("/");
              }}>
              Cerrar sesión
            </button>
          </div>
        </>
      ) : (
        <>
          <Link to="/registro" className='btn-registro'><strong>Regístrate</strong></Link>
          <Link to="/iniciarsesion" className='btn-inicioSesion'><strong>Iniciar sesión</strong></Link>
        </>
      )}
    </div>
  );
}

export default Encabezado;
