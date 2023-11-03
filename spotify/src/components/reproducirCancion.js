/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useRef, useContext, useEffect, useCallback} from "react";
import { FaPlay, FaPause, FaForward, FaBackward, FaVolumeOff, FaVolumeUp } from 'react-icons/fa';
import './estilosReproductor.css';  
import { ListContext } from "./ListContext";

function ReproducirCancion () {

  const { listaCancionesReproduccion, cancionSeleccionada } = useContext(ListContext);
  const [indiceCancionActual, setIndiceCancionActual] = useState(0);
  const audioRef = useRef();
  const progressIndicatorRef = useRef();
  const [nombreMusica, setNombreMusica] = useState('Nombre música');
  const [nombreArtista, setNombreArtista] = useState('Nombre artista');
  const [volumen, setVolumen] = useState(50);
  const [estaReproduciendo, setEstaReproduciendo] = useState(false); 
  // eslint-disable-next-line no-unused-vars
  const [cancionSelect, setCancionSelect] = useState(null);
  const [progreso, setProgreso] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [progressIndicatorStartX, setProgressIndicatorStartX] = useState(0);
  const [muted, setMuted] = useState(false);  // Mute - Unmuted
//agregado samca83
  const [tiempoActual, setTiempoActual] = useState("0:00");
  const [duracionTotal, setDuracionTotal] = useState("0:00");
  
  // Recupera cancion selecionada de ListaCanciones.js
  useEffect(() => {
    if (cancionSeleccionada) {
      setCancionSelect(cancionSeleccionada);
      console.log(cancionSeleccionada)
      const cancionBuscada = listaCancionesReproduccion.indexOf(cancionSeleccionada);
      setIndiceCancionActual(cancionBuscada);
      cargarCancion(cancionBuscada)

      const audio = audioRef.current;
      //agregado EdiTeo -- Para q' los estados de los icnos se cambien
      audio.play();
  
      const handleTimeUpdate = () => {
        const porcentaje = (audio.currentTime / audio.duration) * 100;
        setProgreso(porcentaje);
        //agregado samca83
        const tiempoActual = secondsToString(Math.floor(audio.currentTime));
        const duracionTotal = secondsToString(Math.floor(audio.duration));
        setTiempoActual(tiempoActual);
        setDuracionTotal(duracionTotal);
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
  const sigCancion = useCallback(() => {
    if (audioRef.current) {
      const audio= audioRef.current;
      audio.pause(); // Pausa la canción actual antes de cambiar
  
      let newIndex = (indiceCancionActual + 1) % listaCancionesReproduccion.length;
      if (!listaCancionesReproduccion[newIndex]) {
        console.error(`No se encontró una canción en el índice ${newIndex}`);
        return;
      }
  
      setIndiceCancionActual(newIndex);
      cargarCancion(newIndex);
    }
  }, [indiceCancionActual, listaCancionesReproduccion]);
  
  
//Agredado por EdiTeo
  useEffect(() => {
    const audio = audioRef.current;
  
    const handleTimeUpdate = () => {
      const porcentaje = (audio.currentTime / audio.duration) * 100;
      setProgreso(porcentaje);
    };
  
    const handleEnded = () => {
      sigCancion();
      audio.play();
      setEstaReproduciendo(true);
    };
  
    const handlePlay = () => {
      setEstaReproduciendo(true);
      audio.play();
    };
  
    const handlePause = () => {
      setEstaReproduciendo(false);
    };
  
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
  
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
///
  }, [sigCancion]);
  
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
  
      // Pausa la reproducción actual
      audio.pause();
  
      // Detiene la reproducción actual y carga la nueva canción
      audio.src = cancion.path_cancion;
  
      // Agregar un controlador de eventos para 'loadeddata'
      audio.addEventListener('loadeddata', () => {
        // La canción se ha cargado correctamente
        // Reproduce la canción si estaba reproduciéndose
        if (estaReproduciendo) {
          audio.play();
        }
      });
  
      // Reiniciar el tiempo actual del audio (opcional)
      audio.currentTime = 0;
  
      // Cargar la nueva canción
      audio.load();
    }
  };
  
  

    const cancionAnterior = useCallback(() => {
      if (indiceCancionActual !== null) {
        let newIndex = (indiceCancionActual - 1 + listaCancionesReproduccion.length) % listaCancionesReproduccion.length;
        setIndiceCancionActual(newIndex);
        console.log("porque no llega a reproducir anterior", newIndex)
        cargarCancion(newIndex);
      }
      
      
  }, [indiceCancionActual, listaCancionesReproduccion]);

  const cambiarVolumen = (e) => {
    const nuevoVolumen = e.target.value;
     if (audioRef.current) {
      const audio = audioRef.current;
      audio.volume = nuevoVolumen / 100;
      const estaEnSilencio = nuevoVolumen === "0";
  
      if (estaEnSilencio !== muted) {
        setMuted(estaEnSilencio); // Actualiza el estado de mute
        audio.muted = estaEnSilencio; // Cambia el estado de mute en el audio
      }
      setVolumen(nuevoVolumen);
    }
  };
  const audio = audioRef.current;

  /* audio.addEventListener('ended', function() {
    // La canción actual ha terminado, así que cambia a la siguiente canción
    sigCancion();
  }); */
  

  function actualizarProgreso(e) {
    if (estaReproduciendo) {
      const barraProgreso = progressIndicatorRef.current;
      const audio = audioRef.current;
      const barraRect = barraProgreso.getBoundingClientRect();
      const porcentaje = ((e.clientX - barraRect.left) / barraRect.width) * 100;
  
      const nuevaPosicion = (porcentaje / 100) * audio.duration;
      const tiempoActual = Math.max(0, Math.min(audio.duration, nuevaPosicion));
  
      // Actualiza la barra de progreso
      setProgreso((tiempoActual / audio.duration) * 100);
  
      // Actualiza el tiempo actual del reproductor de audio
      if (!isNaN(nuevaPosicion) && isFinite(nuevaPosicion)) {
        // Pausa la reproducción antes de cambiar el tiempo
        audio.pause();
        audio.currentTime = tiempoActual;
        // Comprueba si estaba pausado antes del cambio
        const estabaPausado = audio.paused;
        if (!estabaPausado) {
          // Solo reanuda la reproducción si no estaba pausado
          audio.play();
        }
  
        // Formatea y muestra el tiempo en el reproductor
        const tiempoActualFormateado = secondsToString(Math.floor(tiempoActual));
        const duracionTotal = secondsToString(Math.floor(audio.duration));
        const tiempoFormateado = `${tiempoActualFormateado} / ${duracionTotal}`;
        document.getElementById('timer').innerText = tiempoFormateado;
  
        // Escucha el evento 'ended' para cambiar de canción cuando corresponda
        audio.addEventListener('ended', function() {
          // La canción actual ha terminado, así que cambia a la siguiente canción
          sigCancion();
        });
      }
    }
  }
  
  
  //////////////BARRA DE PROGRESO 
  const iniciarArrastre = (e) => {
    if (estaReproduciendo) {
      audioRef.current.pause();
      setDragging(true);
      setDragStartX(e.clientX);
      setProgressIndicatorStartX(progressIndicatorRef.current.getBoundingClientRect().left);
      document.body.style.cursor = 'pointer';
    }
  };

  const moverCirculo = (e) => {
    if (dragging) {
      const barraProgreso = progressIndicatorRef.current;
      const barraRect = barraProgreso.getBoundingClientRect();
      const porcentaje = ((e.clientX - progressIndicatorStartX) / barraRect.width) * 100;
      setProgreso(porcentaje);
    }
  };

  const mantenerArrastreGlobal = (e) => {
    if (dragging) {
      const barraProgreso = progressIndicatorRef.current;
      const barraRect = barraProgreso.getBoundingClientRect();
      const mouseX = e.clientX;
      const barraLeft = barraRect.left;
      const barraWidth = barraRect.width;
  
      if (mouseX >= barraLeft && mouseX <= barraLeft + barraWidth) {
        const porcentaje = ((mouseX - barraLeft) / barraWidth) * 100;
        setProgreso(porcentaje);
        const nuevaPosicion = (porcentaje / 100) * audioRef.current.duration;
        audioRef.current.currentTime = nuevaPosicion;
  
        const tiempoActual = secondsToString(Math.floor(nuevaPosicion));
        const duracionTotal = secondsToString(Math.floor(audioRef.current.duration));
        const tiempoFormateado = `${tiempoActual} / ${duracionTotal}`;
        document.getElementById('timer').innerText = tiempoFormateado;
      }
    }
  };
  const finalizarArrastreGlobal = () => {
    if (dragging) {
      setDragging(false);
      document.body.style.cursor = 'default'; // Cambiar el cursor de vuelta al predeterminado
      const nuevaPosicion = (progreso / 100) * audioRef.current.duration;
      audioRef.current.currentTime = nuevaPosicion;
      audioRef.current.play(); // Continuar la reproducción
    }
  };
  
  // Agregar el event listener para el movimiento del mouse global
  useEffect(() => {
    document.addEventListener("mousemove", mantenerArrastreGlobal);
  
    return () => {
      document.removeEventListener("mousemove", mantenerArrastreGlobal);
    };
  }, [dragging]);

  useEffect(() => {
    document.addEventListener("mousemove", mantenerArrastreGlobal);
    document.addEventListener("mouseup", finalizarArrastreGlobal);
  
    return () => {
      document.removeEventListener("mousemove", mantenerArrastreGlobal);
      document.removeEventListener("mouseup", finalizarArrastreGlobal);
    };
  }, []);

  useEffect(() => {
    const mantenerArrastreGlobal = (e) => {
      if (dragging) {
        actualizarProgreso(e);
      }
    };

    document.addEventListener("mousemove", mantenerArrastreGlobal);

    return () => {
      document.removeEventListener("mousemove", mantenerArrastreGlobal);
    };
  }, [dragging]);

/////////////////////FINALIZA BARRA DE PROGRESO

  ///agregado samca83
  function secondsToString(seconds) {
    if (!isNaN(seconds)) {
      const horas = Math.floor(seconds / 3600);
      const minutos = Math.floor((seconds % 3600) / 60);
      const segundos = seconds % 60;
  
      if (horas > 0) {
        return `${horas}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
      } else {
        return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
      }
    } else {
      return '00:00'; // Manejo especial para NaN
    }
  }
  /////
 

  const mutearDesmutear = () => {
    if (audioRef.current) {
      const audio = audioRef.current;
      const estaEnSilencio = !audio.muted;
  
      if (estaEnSilencio) {
        audio.volume = 0; // Establecer el volumen en 0 si está en silencio
        setVolumen(0); // Actualizar el estado de volumen a 0
      } else {
        audio.volume = 0.5; // Establecer el volumen en 0.5 (50%) si no está en silencio
        setVolumen(50); // Actualizar el estado de volumen a 50
      }
  
      setMuted(estaEnSilencio); // Actualiza el estado de mute
      audio.muted = estaEnSilencio; // Cambia el estado de mute en el audio
    }
  };
  

  

  return (
    <div className="reproductorMusica">
      <div className="info-cancion">
        <div className="detalles-musica">
          <span className="nombre-artista">{nombreArtista}</span>
          - 
          <span className="nombre-musica">{nombreMusica}</span>
          <span className="nombre-musica">
            <div className="timer oculto" id="timer">
                {tiempoActual} / {duracionTotal}
            </div>
          </span>
        </div>
      </div>

      <div>

      </div>
        <div className="controls">
          <div className="ubiIzq">
              <div className="tiempo-actual">
                {tiempoActual}
              </div>
          </div>
          <div className="ubiCenter">
            <audio ref={audioRef} />
            <button onClick={cancionAnterior} className="boton-anterior">
              <FaBackward />
            </button>
            <button onClick={clicReproducirPause} className="boton-control">
              {estaReproduciendo ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={sigCancion} className="boton-siguiente">
              <FaForward />
            </button>  
          </div>
          <div className="ubiDer">
              <div className="duracion-total">
                {duracionTotal}
              </div>
          </div>
          
        </div>

        <div 
        className="progress-bar" 
        onClick={actualizarProgreso} 
        onMouseDown={iniciarArrastre}
        onMouseMove={moverCirculo}
        onMouseUp={finalizarArrastreGlobal}
        ref={progressIndicatorRef}
        >
          <div className="progress-line" style={{ width: `${progreso}%` }}></div>
          <div className="progress-indicator" style={{ left: `${progreso}%` }}>
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