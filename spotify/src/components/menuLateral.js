import React from "react";
import { Link } from "react-router-dom";
import logo from '../logos/logo.png';
import home from '../logos/home.png';
import disc from '../logos/disc.png';
import group from '../logos/group.png';
import plus from '../logos/plus.png';
import './menuLateral.css';

function MenuLateral() {
  return (
    <div className="menu">
      <div className="profile">
        <div className="logo">
          <img src={logo} alt="Logo" width="100" />
        </div>
      </div>

      <div className="menu-items">
        <div className="item">
          <Link to="/Inicio">
            <div className="icon">
              <img src={home} alt="Home"  width="25" />
            </div>
            <div className="title">Inicio</div>
          </Link>
        </div>

        <div className="item separador border-b-5 border-black"></div>

        <div className="item">
          <Link to="/Albumes">
            <div className="icon">
              <img src={group} alt="Álbumes" width="30" />
            </div>
            <div className="title">Álbumes</div>
          </Link>
        </div>

        <div className="item">
          <Link to="/crearAlbum">
            <div className="icon">
              <img src={plus} alt="Crear álbum" width="30" />
            </div>
            <div className="title">Crear álbum</div>
          </Link>
        </div>

        <div className="item">
          <Link to="/Sencillo">
            <div className="icon">
              <img src={disc} alt="Sencillo" width="30" />
            </div>
            <div className="title">Sencillo</div>
          </Link>
        </div>

        <div className="item">
          <Link to="/añadirCancion">

            <div className="icon">
              <img src={plus} alt="Cargar canción" width="30" />
            </div>

            <div className="title">Cargar canción</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MenuLateral;