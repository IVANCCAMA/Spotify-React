import React from "react";
import { Link } from "react-router-dom";
import logo from '../logos/logo.png';
import home from '../logos/home.png';
import disc from '../logos/disc.png';
import group from '../logos/group.png';
import plus from '../logos/plus.png';
import './menuLateral.css';

function MenuLateral() {
  const menuOptions = [
    { to: '/Inicio', src: home, alt: 'Home', title: 'Inicio' },
    { separador: true },
    { to: '/Albumes', src: group, alt: 'Álbumes', title: 'Álbumes' },
    { to: '/crearAlbum', src: plus, alt: 'Crear álbum', title: 'Crear álbum' },
    // { to: '/Sencillo', src: disc, alt: 'Sencillo', title: 'Sencillo' },
    { to: '/añadirCancion', src: plus, alt: 'Cargar canción', title: 'Cargar canción' }
  ];

  return (
    <div className="menu">
      <div className="profile">
        <div className="logo">
          <img src={logo} alt="Logo" width="100" />
        </div>
      </div>

      <div className="menu-items">
        {menuOptions.map((menuOption) => (
          menuOption.separador ? (
            <div className="item separador border-b-5 border-black"></div>
          ) : (
            <div className="item">
              <Link to={menuOption.to}>
                <div className="icon">
                  <img src={menuOption.src} alt={menuOption.alt} width="30" />
                </div>
                <div className="title">{menuOption.title}</div>
              </Link>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default MenuLateral;