
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
    if (cancionSeleccionada) {
        setCancionSelect(cancionSeleccionada);

        // Actualización de los nombres
        setNombreArtista(cancionSeleccionada.nombre_usuario);
        setNombreMusica(cancionSeleccionada.nombre_cancion);

        const audio = audioRef.current;
        audio.src = cancionSeleccionada.path_cancion; // Establecemos la fuente de la canción
        audio.play().then(() => {  // Inicia la reproducción de la canción automáticamente
            setEstaReproduciendo(true);
        });

        audio.addEventListener('timeupdate', () => {
            const porcentaje = (audio.currentTime / audio.duration) * 100;
            setProgreso(porcentaje);
        });
        const handleTimeUpdate = () => {
          const porcentaje = (audio.currentTime / audio.duration) * 100;
          setProgreso(porcentaje);
      };
      
      audio.addEventListener('timeupdate', handleTimeUpdate);
      
      return () => {
          audio.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [cancionSeleccionada]);



  /** 
   * Para Reproducción y pausar la canción
   * */ 
 
  const clicReproducirPause = () => {
    if(audioRef.current && cancionSeleccionada) {
        const audio = audioRef.current;

        if (!estaReproduciendo) {
            audio.play().then(() => {
                setEstaReproduciendo(true);
            });
        } else {
            audio.pause();
            setEstaReproduciendo(false);
        }
    } else {
        console.error('audioRef.current no está definido o no hay una canción seleccionada');
    }
  };
  const sigCancion = () => {
    let newIndex = indiceCancionActual + 1;
    if (newIndex >= listaCancionesReproduccion.length) {
        newIndex = 0;  // Si es la última canción, vuelve a la primera.
    }
    if (!listaCancionesReproduccion[newIndex]) {
        console.error(`No se encontró una canción en el índice ${newIndex}`);
        return;
    }
    
    setIndiceCancionActual(newIndex);
    cargarCancion(newIndex);
};


  const cargarCancion = (indice) => {
    const cancion = listaCancionesReproduccion[indice];
    if (!cancion) {
        console.error(`No se encontró una canción en el índice ${indice}`);
        return;
    }
    
    setNombreMusica(cancion.nombre_cancion || "Nombre desconocido");
    setNombreArtista(cancion.nombre_usuario || "Artista desconocido");

    if (audioRef.current) {
      const audio = audioRef.current;
      audio.src = cancion.path_cancion;
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
    if (audioRef.current) {
      const audio = audioRef.current;
      audio.volume = nuevoVolumen / 100;
      const estaEnSilencio = nuevoVolumen == 0;
  
      if (estaEnSilencio !== muted) {
        setMuted(estaEnSilencio); // Actualiza el estado de mute
        audio.muted = estaEnSilencio; // Cambia el estado de mute en el audio
      }
      setVolumen(nuevoVolumen);
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
        { muted ? <FaVolumeOff /> : <FaVolumeUp />}
        
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