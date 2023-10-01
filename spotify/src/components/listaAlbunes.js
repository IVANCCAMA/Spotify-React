import React from "react";
import { Link } from "react-router-dom";
import group from '../logos/group.png';
import './listaAlbunes.css';


function ListaAlbumes() {
  return (
    
    <div className="lista">
        <div className="item">
          <Link to="/ListaCanciones">
            <img src={group} alt="Álbumes" className="icon" width="40"/>
            <div className="title">Album 1</div>
          </Link>
        </div>

    </div>
      
    
  );
}

export default ListaAlbumes;