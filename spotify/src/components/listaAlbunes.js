import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './listaAlbunes.css';
import axios from "axios";
 
function ListaAlbumes() {
  const [albumes, setAlbumes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://spfisbackend-production.up.railway.app/api/lista_canciones');
        const listaCanciones = response.data;
        listaCanciones.sort((a, b) => {
          return a.titulo_lista.localeCompare(b.titulo_lista);
        });

        setAlbumes(listaCanciones);
      } catch (error) {
        console.error('Error al obtener la lista de canciones:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="albumes-list">
      {albumes.map((album, index) => (
        <Link to={`/lista-canciones/${album.id_lista}`} key={album.id_lista} className="albumes-item">
          <img
            src={album.path_image}
            alt="Álbum"
            className="albumes-image"
          />
          <div className="albumes-details">
            <div className="albumes-title">{album.titulo_lista}</div>
            <div className="artistas-name">{album.nombre_usuario}</div>
            <div className="albumes-songs">{album.cantidad_canciones} canciones</div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ListaAlbumes;
