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

    if(audioRef.current && cancionSeleccionada){
      setNombreArtista(cancionSelect.nombre_usuario);
      setNombreMusica(cancionSelect.nombre_cancion);

      const audio = audioRef.current;
      audio.src = cancionSelect.path_cancion;
      audio.currentTime = 0;

      if (!estaReproduciendo) {
        if (audio.currentTime > 0) {
          // Si el audio se ha pausado previamente y hay un tiempo de reproducción actual, reanuda desde ese punto
          audio.play().then(() => {
            audio.currentTime = audio.currentTime; // Establecer el tiempo de reproducción al valor actual
            setEstaReproduciendo(true);
            console.log('time reproduction',audio.currentTime);
          });
          console.log('time reproduction',audio.currentTime);
        } else {
          // Si es la primera vez que se reproduce la canción o si se reprodujo desde el principio, inicia la reproducción desde el principio
          audio.play();
          console.log('time reproduction',audio.currentTime);
          setEstaReproduciendo(true);
        }
      } else {
        // Pausa la canción y registra el tiempo de reproducción actual
        audio.pause();
        audio.currentTime = audio.currentTime + 100;
        console.log('time reproduction pausado', audio.currentTime);
        setEstaReproduciendo(false);
      }
  } else {
    console.error('audioRef.current no está definido o no hay una canción seleccionada');
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