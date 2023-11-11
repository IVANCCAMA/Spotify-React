import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from '../logos/logo.png';
import home from '../logos/home.png';
import group from '../logos/group.png';
import plus from '../logos/plus.png';
import './menuLateral.css';

function MenuLateral({ userType }) {
  const OyenteOptions = [
    { to: '/', src: home, alt: 'Home', title: 'Inicio' },
    { separador: true },
    { to: '/crearListaReproduccion', src: plus, alt: 'Crear lista de reproducción', title: 'Crear lista de reproducción' }
  ];
  const DistMusicOptions = [
    { to: '/', src: home, alt: 'Home', title: 'Inicio' },
    { separador: true },
    { to: '/Albumes', src: group, alt: 'Álbumes', title: 'Álbumes' },
    { to: '/crearAlbum', src: plus, alt: 'Crear álbum', title: 'Crear álbum' },
    { to: '/añadirCancion', src: plus, alt: 'Cargar canción', title: 'Cargar canción' },
  ];

  const [menuOptions, setMenuOptions] = useState([]);

  useEffect(() => {
    console.log(userType);
    switch (userType) {
      case "Oyente":
        setMenuOptions(OyenteOptions);
        break;
      case "Distribuidora musical":
        setMenuOptions(DistMusicOptions);
        break;
      default:
        setMenuOptions(OyenteOptions);
        break;
    }
  }, [userType]);

  return (
    <div className="menu">
      <div className="profile">
        <div className="logo">
          <img src={logo} alt="Logo" width="100" />
        </div>
      </div>

      <div className="menu-items">
        {menuOptions.map((menuOption, index) => (
          menuOption.separador ? (
            <div key={'separador-' + index} className="item separador border-b-5 border-black"></div>
          ) : (
            <div key={'item-' + index} className="item">
              <Link key={'link-' + index} to={menuOption.to}>
                <div key={'icon-' + index} className="icon">
                  <img key={'img-' + index} src={menuOption.src} alt={menuOption.alt} width="30" />
                </div>
                <div key={'title-' + index} className="title">{menuOption.title}</div>
              </Link>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default MenuLateral;
