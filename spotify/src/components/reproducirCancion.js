import { Link } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa';
import './estilosReproductor.css';

const ReproducirCancion = ({ canciones }) => {
  const [indiceCancionActual, setIndiceCancionActual] = useState(0);
  const audioRef = useRef();
  const progressIndicatorRef = useRef();
  const [nombreMusica, setNombreMusica] = useState(canciones[0].nombre);
  const [nombreArtista, setNombreArtista] = useState(canciones[0].artista);
  const [volumen, setVolumen] = useState(50);
  const [estaReproduciendo, setEstaReproduciendo] = useState(false);
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener('timeupdate', () => {
      const porcentaje = (audio.currentTime / audio.duration) * 100;
      setProgreso(porcentaje);
    });
  }, []);

  const clicReproducirPause = () => {
    if (audioRef.current) {
      const audio = audioRef.current;
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

  const sigCancion = () => {
    const newIndex = (indiceCancionActual + 1) % canciones.length;
    setIndiceCancionActual(newIndex);
    setNombreMusica(canciones[newIndex].nombre);
    setNombreArtista(canciones[newIndex].artista);
    if (estaReproduciendo && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const cancionAnterior = () => {
    const newIndex = ((indiceCancionActual - 1) + canciones.length) % canciones.length;
    setIndiceCancionActual(newIndex);
    setNombreMusica(canciones[newIndex].nombre);
    setNombreArtista(canciones[newIndex].artista);
    if (estaReproduciendo && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const cambiarVolumen = (e) => {
    const nuevoVolumen = e.target.value;
    setVolumen(nuevoVolumen);
    const audio = audioRef.current;
    audio.volume = nuevoVolumen / 100;
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

  return (
    <div className="reproductorMusica">
      <div className="info-cancion">
        <div className="detalles-musica">
          <span className="nombre-musica">{nombreMusica}</span>
          <span className="separador"> - </span>
          <span className="nombre-artista">{nombreArtista}</span>
        </div>
      </div>
      <div className="controls">
        <audio ref={audioRef} src={canciones[indiceCancionActual].url} />
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