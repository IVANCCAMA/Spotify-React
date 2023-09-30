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
          <img src={logo} alt="Logo" width="200" />
        </div>
      </div>

      <div className="menu-items">
        <div className="item">
          <Link to="/Inicio">
            <img src={home} alt="Home" className="icon" width="40"/>
            <div className="title">Inicio</div>
          </Link>
        </div>

        <div className="item separador border-b-5 border-black"></div>

        <div className="item">
          <Link to="/Albumes">
            <img src={group} alt="Álbumes" className="icon" width="40"/>
            <div className="title">Álbumes</div>
          </Link>
        </div>

        <div className="item">
          <Link to="/crearAlbum"> {/* Utiliza Link y especifica la ruta */}
            <img src={plus} alt="Crear álbum" className="icon" width="40" />
            <div className="title">Crear álbum</div>
          </Link>
        </div>

        <div className="item">
          <Link to="/Sencillo">
            <img src={disc} alt="Sencillo" className="icon" width="40" />
            <div className="title">Sencillo</div>
          </Link>
        </div>

        <div className="item">
          <Link to="/CargarCancion">
            <img src={plus} alt="Cargar canción" className="icon" />
            <div className="title">Cargar canción</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MenuLateral;
