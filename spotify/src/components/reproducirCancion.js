// Importando módulos necesarios de React y Hooks
//useState(estado de mi componente) y useRef(elemen DOM) Hooks 
import React, { useState, useRef } from "react";
//React Icons incluir iconos de la biblioteca
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa';

// Importando estilos
import './index.css';  

const ReproducirCancion = ({ inputSongs  }) => {
  // Estado para gestionar el índice de la canción actual
  const [indiceCancionActual, setIndiceCancionActual] = useState(0);
  // Referencia para el elemento de audio
  const audioRef = useRef();
  const [nombreMusica, setNombreMusica] = useState(inputSongs[0].name);
  const [nombreArtista, setNombreArtista] = useState(inputSongs[0].artist);
  const [portadaAlbum, setPortadaAlbum] = useState(inputSongs[0].cover);
  const [volumen, setVolumen] = useState(50);
  const [estaReproduciendo, setEstaReproduciendo] = useState(false); // Definir inicialmente como false
   
  // Función para manejar la reproducción y pausar la canción
  const clicReproducirPause = () => {
    if (audioRef.current) {
      const audio = audioRef.current;
      if (audio.paused) {
        audio.play();
        setEstaReproduciendo(true); // Actualiza a true cuando la música se está reproduciendo
      } else {
        audio.pause();
        setEstaReproduciendo(false); // Actualiza a false cuando la música está pausada
      }
    } else {
      console.error('audioRef.current no está definido');
    }
  };
  // Función para pasar a la siguiente canción
  const sigCancion = () => {
    const newIndex = (indiceCancionActual + 1) % inputSongs.length;
    setIndiceCancionActual(newIndex); 
    setNombreMusica(inputSongs[newIndex].name); 
    setNombreArtista(inputSongs[newIndex].artist); 
    setPortadaAlbum(inputSongs[newIndex].cover); 
    if (estaReproduciendo && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
    }
};
  const cambiarVolumen = (e) => {
    const newVolumen = e.target.value; // Obtén el nuevo volumen del evento
    setVolumen(newVolumen); // Actualiza el estado de volumen
    const audio = audioRef.current;
    audio.volume = newVolumen / 100; // Actualiza el volumen del elemento de audio
};
  // Función para volver a la canción anterior
  const cancionAnterior = () => {
    setIndiceCancionActual((prevIndex) => (prevIndex - 1 + inputSongs.length) % inputSongs.length); // Retrocede a la canción anterior
    if(estaReproduciendo && audioRef.current) { 
   // Si la música está reproduciéndose, inicia la reproducción de la nueva canción
    audioRef.current.play();
   }
};
     
    
  return (
    <div className="music-player">
      <div className="song-info">
        <img src={portadaAlbum} alt="album cover" className="album-cover" />
        <div className="song-details">
          <span className="song-name">{nombreMusica}</span>
          <span className="artist-name">{nombreArtista}</span>
        </div>
      </div>
    <div className="controls">
    <audio ref={audioRef} src={inputSongs[indiceCancionActual].url} />


      {/* Reemplazamos el texto de los botones con los iconos */}
      <button onClick={cancionAnterior} className="control-button">
        <FaBackward />
      </button>
      <button onClick={clicReproducirPause} className="control-button">
        {/* Se puede alternar entre los iconos de repro y pausar dependiendo del estado de reproducción */}
        { estaReproduciendo ? <FaPause /> : <FaPlay /> }
      </button>
      <button onClick={sigCancion} className="control-button">
        <FaForward />
      </button>
    </div>
    <div className="volumen" >
      <input type="range" min="0" max="100" value={volumen} className="volumen-slider" onChange={cambiarVolumen} />
    </div>
  </div>
  );
};


export default ReproducirCancion;
