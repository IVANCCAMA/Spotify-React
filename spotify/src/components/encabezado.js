import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Link, useLocation } from "react-router-dom";
import "./encabezado.css"
import IniciarSesion from "./iniciarsesion";

function Encabezado({ updateShowForm }) {
  // recuperar el estado
  const isLogined = true;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  useEffect(() => { updateShowForm(showForm); }, [showForm]);

  // puede servir para controlar el direccionamiento a traves de link
  const location = useLocation();
  const isAuthRoute = location.pathname === '/iniciarsesion'
    || location.pathname === '/registro' || location.pathname === '/';
  useEffect(() => { setShowForm(false); }, [location.pathname]);

  return (
    <div className="header-Encabesado">
      {!isLogined ? (
        <>
          {isAuthRoute ? (
            <Link to="/iniciarsesion" className='btn-header'><strong>Iniciar Sesión</strong></Link>
          ) : (
            <button className='btn-header'
              onClick={() => { setShowForm(!showForm); }}>
              <strong>Iniciar Sesión</strong>
            </button>
          )}
          <Link to="/registro" className='btn-header'><strong>Regístrate</strong></Link>
        </>
      ) : (
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
            <Link to="/">Cerrar sesión</Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Encabezado;
