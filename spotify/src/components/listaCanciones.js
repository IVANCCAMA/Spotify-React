
import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import './listaCanciones.css';
import groupLogo from '../logos/group.png';
import songLogo from '../logos/play-logo.png';
import axios from "axios";

function ListaCanciones() {
  const { id_lista } = useParams();
  const [listaCanciones, setListaCanciones] = useState([]);
  const [infoAlbum, setinfoAlbum] = useState([]); // Nuevo estado para lista de álbumes
  
  // Lista de canciones de un Álbum
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseCanciones = await axios.get(`https://spfisbackend-production.up.railway.app/api/canciones/completo_lista/${id_lista}`);
        const listaCancionesAlbum = responseCanciones.data;
        console.log("Listas de canciones recuperadas:", listaCancionesAlbum);
        setListaCanciones(listaCancionesAlbum);
      } catch (error) {
        console.error('Error al obtener la lista de canciones:', error);
      }
    };
    fetchData();
  }, [id_lista]);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const responseAlbum = await axios.get(`https://spfisbackend-production.up.railway.app/api/lista_canciones/${id_lista}`);
        const infoAlbum = responseAlbum.data;
        console.log("INFORMACION ALBUM RECUPERADA:", infoAlbum);
        setinfoAlbum(infoAlbum);
      } catch (error) {
        console.error('Error al obtener la lista de álbum:', error);
      }
    };
    fetchAlbum();
  }, [id_lista]);

  

  return (
    <div className='general-config'>
      {/* Info de álbum */}
      <div className='album-config'>
        {/* Columna 1: Imagen del álbum */}
        <div key={infoAlbum.id_lista} className="album-portada">
          <img
            src={infoAlbum.path_image}
            /* className='album-image' */
            alt="Álbum"
            style={{ width: '111px', height: '111px', objectFit: 'cover' }}  // Ajustamos el estilo de la imagen
          />
        </div>

        {/* Columna 2: Datos del álbum */}
        <div className="album-details">  {/* Añadimos un margen izquierdo */}
          <div className="album-title2">{infoAlbum.titulo_lista}</div>
          <div className="artist-name">{infoAlbum.nombre_usuario}</div> {/* ARREGLAR */}
          <div className="album-songs">{infoAlbum.cantidad_canciones} canciones</div>
        </div>
      </div>

      {/* Listado de canciones de álbum */}
      <div className="song-config">
        {Array.isArray(listaCanciones) && listaCanciones.map((canciones, index) => (
          <Link to={`/detalle-cancion/${canciones.id_cancion}`} key={canciones.id_cancion} className="album-item">

            <div className="song-container">
              <div className="song-details">
              <img
                  src={canciones.path_image}
                  alt="Álbum"
                  className="album-image2"
                />
                <div className="titulo-cancion-logo">{canciones.nombre_usuario + " - " +  canciones.nombre_cancion}</div>
                <div className="duracion-logo">{canciones.duracion}</div>
              </div>
              <img src={songLogo} alt="Álbum" className="play-logo" />
            </div>
            
          </Link> 

        ))}
      </div>

      
      
      
    </div>
  );
  
}
export default ListaCanciones;

