
import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import './listaCanciones.css';
import groupLogo from '../logos/group.png';
import songLogo from '../logos/disc.png';
import axios from "axios";

function ListaCanciones() {
  const { id_lista } = useParams();
  
  const [listaCanciones, setListaCanciones] = useState([]);
  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/canciones/completo_lista/${id_lista}`);
      const listaCancionesAlbum = response.data;
      // verificar existencia
      console.log("Listas recuperadas>>>:",listaCancionesAlbum);
      setListaCanciones(listaCancionesAlbum);
    } catch (error) {
      console.error('Error al obtener la lista de canciones:', error);
    }
  };

    fetchData();
  }, []);

  return (
    <div className="album2-list">
      {/* Mostar lista de canciones  */}
      <div className="song-list">
          {listaCanciones.map((canciones, index) => (
            <Link to={`/detalle-cancion/${canciones.id_cancion}`} key={canciones.id_cancion} className="album-item">
              <img src={songLogo} 
              alt="Álbum" 
              className="song-logo" 
              />
              <div className="album-details">
              <div className="song-title">{canciones.nombre_cancion}</div>
              <div className="artist-name">{canciones.duracion}</div>
              </div>
            </Link> 
          ))}
      </div>
      
      <div>
        <h2>Detalles del Álbum {id_lista}</h2>
      </div>
            
    </div>
  );
}
export default ListaCanciones;

/* ${album.id}

*/


