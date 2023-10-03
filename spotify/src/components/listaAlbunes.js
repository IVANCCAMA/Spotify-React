import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './listaAlbunes.css';
import groupLogo from '../logos/group.png';
import axios from "axios";
/* import { Routes, Route } from 'react-router-dom';
import ListaCanciones from "./listaCanciones"; */



function ListaAlbumes() {
   /*  const albums = [
      { id: 1, artist: "Nombre del Artista" },
      { id: 2, artist: "Nombre del Artista" },
      { id: 3, artist: "Nombre del adsad" },
      { id: 4, artist: "Nombre del Artista" },
      { id: 5, artist: "Nombre del Artista" },
      { id: 6, artist: "Nombre del Artista" },
      { id: 7, artist: "Nombre del Artista" },
      { id: 8, artist: "Nombre del Artista" },
      { id: 9, artist: "Nombre del Artista" }
    ];
 */const [albumes, setAlbumes] = useState([]);
 useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/lista_canciones/');
      const listaCanciones = response.data;
      setAlbumes(listaCanciones);
    } catch (error) {
      console.error('Error al obtener la lista de canciones:', error);
    }
  };

  fetchData();
}, []);

return (
  <div className="album-list">
    {albumes.map((album, index) => (
      <Link to={`/detalle-album/${album.id_lista}`} key={album.id_lista} className="album-item">
        <img src={groupLogo} alt="Álbum" className="album-logo" />
        <div className="album-details">
          <div className="album-title">{album.titulo_lista}</div> {/* Reemplaza 'albumName' con el nombre real del atributo */}
          <div className="artist-name">{album.colaborador}</div>
          <div className="album-songs">{album.cantidad_canciones}</div> {/* Reemplaza 'id_lista' con el nombre real del atributo */}
        </div>
      </Link>
    ))}
  </div>


    

  );
}
export default ListaAlbumes;


