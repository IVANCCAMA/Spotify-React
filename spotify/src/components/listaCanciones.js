/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";
import './listaCanciones.css';
import songLogo from '../logos/play-logo.ico';
import axios from "axios";
import { ListProvider, useListContext } from './ListContext';
import listAddIcon from '@iconify-icons/icon-park-outline/list-add';
import { Icon } from '@iconify/react';

const ListaCanciones = ({ userConnected, isLogin, showAlertModal }) => {
  const { id_lista } = useParams();
  const { listaCancionesReproduccion, actualizarListaCanciones, cancionSeleccionada, actualizarCancionSelecionada } = useListContext();

  const [listaCanciones, setListaCanciones] = useState([]);
  const [infoAlbum, setinfoAlbum] = useState([]); // Nuevo estado para lista de álbumes
  const [cancionesCargadas, setCancionesCargadas] = useState(false);
  const [cancionSelect, setCancionSeleccionada] = useState(null); // Nuevo estado para el índice de la canción seleccionada
  const listMenuRef = useRef(null);
  const [songMenuStates, setSongMenuStates] = useState({}); // Estado para manejar el menú de cada canción
  const [listasReproduccion, setListasReproduccion] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');


  // Listas de reproduccion de usuario
  useEffect(() => {
    cargarListasDeUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userConnected]);

  const cargarListasDeUser = async () => {
    try {
      const listasUser = await axios.get(`https://spfisbackend-production.up.railway.app/api/lista_canciones/oyente/${userConnected.id_usuario}`);
      console.log('Listas de usuario>>>>>', listasUser.data);
      setListasReproduccion(listasUser.data)
    } catch (error) {
      console.error('Error al obtener las listas de reproduccion:', error);
    }
  }

  // Lista de canciones de un Álbum
  useEffect(() => {
    //console.log("USUARIO CONECTADO",userConnected);
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

  const handleListAdd = (cancionId) => {
    if (!isLogin) {
      showAlertModal('Funcionalidad no permitida. Por favor, inicie sesión.');
    } else {
      setSongMenuStates((prevStates) => {
        // Verifica si el menú para la canción actual está abierto
        const isMenuOpen = prevStates[cancionId];
  
        // Cierra todos los menús
        const updatedStates = { ...prevStates };
        Object.keys(updatedStates).forEach(key => updatedStates[key] = false);
  
        // Abre el menú solo si estaba cerrado previamente
        if (!isMenuOpen) {
          updatedStates[cancionId] = true;
          // Restablece la opción seleccionada a "Agregar a lista" cuando se abre el menú
          setSelectedPlaylist(-1);
        }
  
        return updatedStates;
      });
    }
  };

  // Event listener para cerrar el menú cuando se hace clic fuera
  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (!listMenuRef.current?.contains(e.target) && !Object.values(songMenuStates).some(value => value)) {
        setSongMenuStates({});
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [listMenuRef, setSongMenuStates, songMenuStates]);

  const handleIconClick = (e, cancionId) => {
    e.stopPropagation();
    handleListAdd(cancionId);
  };

  const handleAddToPlaylist = async (cancionId, listaReproduccionId) => {
    console.log("ID cancion>>", cancionId, "Lista de repro>", listaReproduccionId);
    try {
      const responseListaReproduccion = await axios.get(`https://spfisbackend-production.up.railway.app/api/canciones/completo_lista_oyente/${listaReproduccionId}`);
      const listaReproduccionActual = responseListaReproduccion.data;
      //console.log("Lista de canciones de Lista", responseListaReproduccion.data);

      // Verificar si la canción ya está en la lista de reproducción
      const cancionRepetida = listaReproduccionActual.some(cancion => cancion.id_cancion === cancionId);

      if (!cancionRepetida) {
        // Si la canción no está repetida, proceder con la solicitud de agregarla
        await axios.post('https://spfisbackend-production.up.railway.app/api/extra_playlist/', {
          id_lista: listaReproduccionId,
          id_cancion: cancionId,
        });
        console.log("Cancion agregada a Lista exitosamente");
      } else {
        // eslint-disable-next-line no-useless-concat
        let esp = "     ";
        showAlertModal("La canción ya está en la lista." + esp  + "No se permiten duplicados.");
        setSongMenuStates({});
      }

      // Lógica adicional si es necesario, por ejemplo, cerrar el menú después de agregar
      setSongMenuStates({});
    } catch (error) {
      console.error('Error al agregar la canción a la lista de reproducción:', error);
      setSongMenuStates({});
    }
  };

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
                    <Icon
                      icon={listAddIcon}
                      onClick={(e) => handleIconClick(e, cancion.id_cancion)}
                      className="list-add-icon"
                    />
                    {songMenuStates[cancion.id_cancion] && (
                      <div className='list-menu'>
                        <select
                        autoFocus
                          className='listas-repro'
                          value={selectedPlaylist}
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            setSelectedPlaylist(selectedValue);
                            console.log(selectedValue);
                            if (selectedValue !== -1) {
                              handleAddToPlaylist(cancion.id_cancion, selectedValue);
                            }
                          }}
                          onBlur={(e) => { handleIconClick(e, cancion.id_cancion) }}
                        >
                          <option key={-1} value={-1} selected>Agregar a lista</option>
                            {listasReproduccion.length > 0 ? (
                              listasReproduccion.map((listasRepro) => (
                                <option 
                                  className='listas-repro'
                                  key={listasRepro.titulo_lista}
                                  value={listasRepro.id_lista}
                                >
                                  {listasRepro.titulo_lista}
                                </option>
                              ))
                            ) : (
                              <option key={-2} value={-2} disabled className='no-listas'>No hay listas creadas</option>
                              )}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </ListProvider>
  );

}
export default ListaCanciones;