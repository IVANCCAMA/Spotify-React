
import React, { useState, useRef, useContext, useEffect } from "react";
import { FaPlay, FaPause, FaForward, FaBackward, FaVolumeOff, FaVolumeUp } from 'react-icons/fa';
import './estilosReproductor.css';  
import { ListContext } from "./ListContext";

function ReproducirCancion () {

  const { listaCancionesReproduccion, cancionSeleccionada } = useContext(ListContext);
  const [indiceCancionActual, setIndiceCancionActual] = useState(0);
  const audioRef = useRef();
  const progressIndicatorRef = useRef();
  const [nombreMusica, setNombreMusica] = useState('Nombre musica');
  const [nombreArtista, setNombreArtista] = useState('Nombre artista');
  const [volumen, setVolumen] = useState(50);
  const [estaReproduciendo, setEstaReproduciendo] = useState(false); 
  const [cancionSelect, setCancionSelect] = useState(null);
  const [progreso, setProgreso] = useState(0);
  const [muted, setMuted] = useState(false);  // Mute - Unmuted
  
  // Recupera cancion selecionada de ListaCanciones.js
  useEffect(() => {
    setCancionSelect(cancionSeleccionada);
    const audio = audioRef.current;
    audio.addEventListener('timeupdate', () => {
      const porcentaje = (audio.currentTime / audio.duration) * 100;
      setProgreso(porcentaje);
    });
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

  const cambiarVolumen = (e) => {
    const nuevoVolumen = e.target.value;
    setVolumen(nuevoVolumen);
    if (audioRef.current) {
      audioRef.current.volume = nuevoVolumen / 100;
    }
  };

  const actualizarProgreso = (e) => {
    const barraProgreso = progressIndicatorRef.current;
    const audio = audioRef.current;
    const barraRect = barraProgreso.getBoundingClientRect();
    const porcentaje = ((e.clientX - barraRect.left) / barraRect.width) * 100;
    setProgreso(porcentaje);
    const nuevaPosicion = (porcentaje / 100) * audio.duration;
    audio.currentTime = nuevaPosicion;
  };

  const mutearDesmutear = () => {
    setMuted(!muted);  // Actualiza el estado de mute                    
  const estaEnSilencio = audioRef.current.muted;
    audioRef.current.muted = !estaEnSilencio; //cambio de mute a unmuted
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

      <div
        className="progress-bar"
        onClick={actualizarProgreso}
        ref={progressIndicatorRef}>
        <div className="progress-line" style={{ width: `${progreso}%` }}></div>
        <div
          className="progress-indicator"
          style={{ left: `${progreso}%` }}
        >
          <div className="progress-circle"></div>
        </div>
      </div>
      
      <div className = "contenedor">
        <button onClick={mutearDesmutear} className="boton-mute">
          {muted ? <FaVolumeOff /> : <FaVolumeUp />}
        </button>

        <div className="volumen" >      
          <input type="range" 
            min="0" 
            max="100" 
            value={volumen} 
            className="volumen-slider" 
            onChange={cambiarVolumen}
          />
        </div>
      </div>

    </div>
  );
  
};

export default ReproducirCancion;