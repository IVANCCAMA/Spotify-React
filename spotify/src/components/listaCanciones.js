
import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import './listaCanciones.css';
import groupLogo from '../logos/group.png';
import songLogo from '../logos/play-logo.png';
import axios from "axios";

function ListaCanciones() {
  const { id_lista } = useParams();
  
  const [listaCanciones, setListaCanciones] = useState([]);
  const [listaAlbum, setListaAlbum] = useState([]); // Nuevo estado para lista de álbumes
  /* Lista de canciones de un Album */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseCanciones = await axios.get(`http://localhost:4000/api/canciones/completo_lista/${id_lista}`);
        const listaCancionesAlbum = responseCanciones.data;
        console.log("Listas de canciones recuperadas:", listaCancionesAlbum);
        setListaCanciones(listaCancionesAlbum);
      } catch (error) {
        console.error('Error al obtener la lista de canciones:', error);
      }
    };
/* Informacion de album */
    const fetchAlbum = async () => {
      try {
        const responseAlbum = await axios.get(`http://localhost:4000/api/lista_canciones/${id_lista}`);
        const listaAlbum = responseAlbum.data;
        console.log("Listas de álbum recuperadas:", listaAlbum);
        setListaAlbum(listaAlbum);
      } catch (error) {
        console.error('Error al obtener la lista de álbum:', error);
      }
    };

    fetchData();
    fetchAlbum();
  }, [id_lista]); 

  

  return (
    <div className="album-info">
      {Array.isArray(listaAlbum) && listaAlbum.map((album, index) => (
        <Link to={`/lista-canciones/${album.id_lista}`} key={album.id_lista} className="album-item">
          <img
            src={album.path_image}
            alt="Álbum"
            className="album-logo album-image" // Clase album-image para la imagen
          />
          <div className="album-details">
            <div className="album-title">{album.titulo_lista}</div>
            <div className="artist-name">{album.colaborador}</div>
            <div className="album-songs">{album.cantidad_canciones} canciones</div>
          </div>
        </Link>
      ))}
      <div className="song-list">
        {Array.isArray(listaCanciones) && listaCanciones.map((canciones, index) => (
          <Link to={`/detalle-cancion/${canciones.id_cancion}`} key={canciones.id_cancion} className="album-item">
            <div className="song-container">
              <img
                  src={canciones.path_image}
                  alt="Álbum"
                  className="album-logo album-image"
                />
              <div className="song-details">
                
                <div className="album-title">{canciones.nombre_cancion}</div>
                <div className="album-title">{canciones.duracion}</div>
              </div>
              <img src={songLogo} alt="Álbum" className="album-logo" />
            </div>
            
          </Link> 
        ))}
      </div>
    </div>
  );
  
}
export default ListaCanciones;

/* <div className="album-info">
      
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
            
    </div>

*/


