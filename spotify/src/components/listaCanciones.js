import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import './listaCanciones.css';
import songLogo from '../logos/play-logo.png';
import axios from "axios";
import ReproducirCancion from './reproducirCancion';
import { ListProvider, useListContext } from './ListContext';


function ListaCanciones() {
  const { id_lista } = useParams();
  const { listaCancionesReproduccion, actualizarListaCanciones, cancionSeleccionada, actualizarCancionSelecionada } = useListContext();

  const [listaCanciones, setListaCanciones] = useState([]);
  const [infoAlbum, setinfoAlbum] = useState([]); // Nuevo estado para lista de álbumes
  const [cancionesCargadas, setCancionesCargadas] = useState(false); 
  const [cancionSelect, setCancionSeleccionada] = useState(null); // Nuevo estado para el índice de la canción seleccionada
  
  // Lista de canciones de un Álbum
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseCanciones = await axios.get(`https://spfisbackend-production.up.railway.app/api/canciones/completo_lista/${id_lista}`);
        const listaCanciones = responseCanciones.data;
        setListaCanciones(listaCanciones);
        setCancionesCargadas(true);
        actualizarListaCanciones(listaCanciones);
      } catch (error) {
        console.error('Error al obtener la lista de canciones:', error);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Arreglo de dependencias vacío
  
  // Infor de album
  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const responseAlbum = await axios.get(`https://spfisbackend-production.up.railway.app/api/lista_canciones/${id_lista}`);
        const infoAlbum = responseAlbum.data;
        setinfoAlbum(infoAlbum);
      } catch (error) {
        console.error('Error al obtener la lista de álbum:', error);
      }
    };
    fetchAlbum();
  }, [id_lista]);

  return (
    
  <ListProvider>
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

      {/* Listado de canciones */}
      <div className="song-config">
        {cancionesCargadas && listaCanciones.length > 0 ? (
          listaCanciones.map((cancion, index) => (
            <div key={cancion.id_cancion} className="album-item">
              <div className="song-container">
                <div className="song-details">
                  <img
                    src={cancion.path_image}
                    alt="Álbum"
                    className="album-image2"
                  />
                  <div className="titulo-cancion-logo">
                    {cancion.nombre_usuario + " - " + cancion.nombre_cancion}
                    <div className="duracion-logo">{cancion.duracion}</div>
                    </div>
                    <img src={songLogo} onClick={() => actualizarCancionSelecionada(cancion.id_cancion)} alt="Álbum" className="play-logo" />          
                    </div>
                  </div>
                {/* Aquiii ojito*/}
                <div className="duracion-logo">{cancion.duracion}</div>
                <div> 
                  <img src={songLogo} alt="Álbum" className="play-logo" onClick={() => actualizarCancionSelecionada(cancion.id_cancion)}/> 
                </div>

            </div>
          ))
        ) : (
          <p>Cargando canciones...</p>
        )}
      </div>
    </div>
  <ReproducirCancion />
  </ListProvider>
  );
  
}
export default ListaCanciones;

