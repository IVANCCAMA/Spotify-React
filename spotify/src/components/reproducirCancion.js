// Importando módulos necesarios de React y Hooks(PERMITE UTILIZAR ESTADOS)
//useState(estado de mi componente) y useRef(elemen DOM) Hooks 
import React, { useState, useRef } from "react";
//React Icons incluir iconos de la biblioteca, visualizacion de los iconos
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa';
// Importando estilos
import './estilosReproductor.css';  
/**
 *Componente para reproducir canciones, permitiendo controlar la reproducción, pausa, y volumen.
 * @param {Object[]} canciones -Lista de canciones con su información correspondiente. 
 */
const ReproducirCancion = ({ canciones  }) => {
  // Estados para gestionar la información y comportamiento del reproductor
  const [indiceCancionActual, setIndiceCancionActual] = useState(0);//Índice de la canción actual en reproducción
  const audioRef = useRef();
  const [nombreMusica, setNombreMusica] = useState(canciones[0].nombre);// Nombre de la canción actual
  const [nombreArtista, setNombreArtista] = useState(canciones[0].artista);// Nombre del artista
  const [portadaAlbum, setPortadaAlbum] = useState(canciones[0].portada);//Imagen de la protada de cancion
  const [volumen, setVolumen] = useState(50);
  const [estaReproduciendo, setEstaReproduciendo] = useState(false); // Definir inicialmente como false
   
  /** 
   * Para Reproducción y pausar la canción
   * */ 
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
  /**
   * Cambia a la siguiente canción.
   */
  const sigCancion = () => {
      const newIndex = (indiceCancionActual + 1) % canciones.length;
      setIndiceCancionActual(newIndex); 
      setNombreMusica(canciones[newIndex].nombre); 
      setNombreArtista(canciones[newIndex].artista); 
      setPortadaAlbum(canciones[newIndex].portada); 
      if (estaReproduciendo && audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();    
      }
  };
  /**
   * Cambia el volumen de la reproducción.
   */
  const cambiarVolumen = (e) => {
    const nuevoVolumen = e.target.value; // Obtén el nuevo volumen del evento
    setVolumen(nuevoVolumen); // Actualiza el estado de volumen
    const audio = audioRef.current;
    audio.volume = nuevoVolumen / 100; // Actualiza el volumen del elemento de audio
  };

  /**
   * Cambia a la canción anterior.
   */
  const cancionAnterior = () => {
    setIndiceCancionActual((prevIndex) => (prevIndex - 1 + canciones.length) % canciones.length); // Retrocede a la canción anterior
    // Si la música está reproduciéndose, inicia la reproducción de la nueva canción
    if(estaReproduciendo && audioRef.current) { 
    audioRef.current.play();
   }
  };
     
  return (
    <div className="reproductorMusica">
      <div className="info-cancion">
        <img src={portadaAlbum} alt="portada album" className="portada-album" />
        <div className="detalles-musica">
          <span className="nombre-musica">{nombreMusica}</span>
          <span className="nombre-artista">{nombreArtista}</span>
        </div>
      </div>
    <div className="controls">
    <audio ref={audioRef} src={canciones[indiceCancionActual].url} />

      {/* Reemplazamos el texto de los botones con los iconos */}
      <button onClick={cancionAnterior} className="boton-control">
        <FaBackward/>
      </button>
      <button onClick={clicReproducirPause} className="boton-control">

        {/* Se puede alternar entre los iconos de repro y pausar dependiendo del estado de reproducción */}
        { estaReproduciendo ? <FaPause/> : <FaPlay/> }
      </button>
      <button onClick={sigCancion} className="boton-control">
        <FaForward/> 
      </button>
    </div>
    <div className="volumen" >
      <input type="range" min="0" max="100" value={volumen} className="volumen-slider" onChange={cambiarVolumen} />
    </div>
  </div>
  );
};
export default ReproducirCancion;
