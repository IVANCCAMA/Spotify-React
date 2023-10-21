import React, { useState, useRef, useContext, useEffect } from "react";
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa';
import './estilosReproductor.css';  
import { ListContext } from "./ListContext";

function ReproducirCancion () {

  const { listaCancionesReproduccion, cancionSeleccionada } = useContext(ListContext);
  const [indiceCancionActual, setIndiceCancionActual] = useState(null);//Índice de la canción actual en reproducción
  const audioRef = useRef();
  const [nombreMusica, setNombreMusica] = useState('Nombre musica');// Nombre de la canción actual
  const [nombreArtista, setNombreArtista] = useState('Nombre artista');// Nombre del artista
  const [volumen, setVolumen] = useState(50);
  const [estaReproduciendo, setEstaReproduciendo] = useState(false); 
  const [cancionSelect, setCancionSelect] = useState(null);
  
  // Recupera cancion selecionada de ListaCanciones.js
  useEffect(() => {
    setCancionSelect(cancionSeleccionada);
  }, [cancionSeleccionada]);
  /** 
   * Para Reproducción y pausar la canción
   * */ 
  const clicReproducirPause = () => {
    //setIndiceCancionActual(cancionSeleccionada);
    console.log('lista recuperada',listaCancionesReproduccion);
    console.log('cancion selecionada', cancionSelect);
    setNombreArtista(cancionSelect.nombre_usuario);
    setNombreMusica(cancionSelect.nombre_cancion);

    if (audioRef.current) {
      const audio = audioRef.current;
      audio.src = cancionSelect.path_cancion;
      if (audio.paused) {
        audio.play();
        setEstaReproduciendo(true);
      } else {
        audio.pause();
        setEstaReproduciendo(false);
      }
    } else {
      console.error('audioRef.current no está definido');
    }
  };
  /**
   * Cambia a la siguiente canción.
   */
  const sigCancion = () => {
    if (indiceCancionActual !== null) {
      const newIndex = (indiceCancionActual + 1) % listaCancionesReproduccion.length;
      setIndiceCancionActual(newIndex);
      cargarCancion(newIndex);
    } else {
      console.log('no hay indice seleccionado');
    }
  };

  const cargarCancion = (indice) => {
    const cancion = listaCancionesReproduccion[indice];
    setNombreMusica(cancion.nombre);
    setNombreArtista(cancion.artista);

    if (audioRef.current) {
      const audio = audioRef.current;
      audio.src = cancion.url;
      audio.load(); // Carga la nueva canción
      if (estaReproduciendo) {
        audio.play();
      }
    }
  };

  const cancionAnterior = () => {
    if (indiceCancionActual !== null) {
      const newIndex = (indiceCancionActual - 1 + listaCancionesReproduccion.length) % listaCancionesReproduccion.length;
      setIndiceCancionActual(newIndex);
      cargarCancion(newIndex);
    }
  };
  /**
   * Cambia el volumen de la reproducción.
   */
  const cambiarVolumen = (e) => {
    const nuevoVolumen = e.target.value;
    setVolumen(nuevoVolumen);

    if (audioRef.current) {
      audioRef.current.volume = nuevoVolumen / 100;
    }
  };
   // <img src={portadaAlbum} alt="portada album" className="portada-album" /> */
   return (
    <div className="reproductorMusica">
      <div className="info-cancion">
        <div className="detalles-musica">
          <span className="nombre-artista">{nombreArtista}</span>
          - 
          <span className="nombre-musica">{nombreMusica}</span>
        </div>
      </div>

      <div className="controls">
        <audio ref={audioRef} />
        <button onClick={cancionAnterior} className="boton-control">
          <FaBackward />
            </button>
              <button onClick={clicReproducirPause} className="boton-control">
                {estaReproduciendo ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={sigCancion} className="boton-control">
          <FaForward />
        </button>
      </div>

      <div className="volumen">
        <input
          type="range"
          min="0"
          max="100"
          value={volumen}
          className="volumen-slider"
          onChange={cambiarVolumen}
        />
      </div>
    </div>
  );
};
export default ReproducirCancion;