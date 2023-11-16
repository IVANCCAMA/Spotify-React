import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
 
function Biblioteca({ userConnected }) {
  const [albumes, setAlbumes] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://spfisbackend-production.up.railway.app/api/lista_canciones/oyente/${userConnected.id_usuario}`);
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
  }, [userConnected]);

  return (
    <div className='albun-content'style={{gridTemplateColumns: 'repeat(3, minmax(300px, 1fr))'}}>
    <div className="albumes-list" >
      {albumes.map((album, index) => (
        <Link to={`/lista-canciones-user/${album.id_lista}`} key={album.id_lista} className="albumes-item">
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
    </div>
  );
}

export default Biblioteca;
