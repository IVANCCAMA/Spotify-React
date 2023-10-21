import React, { useState, useRef, useContext } from "react";
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa';
import './estilosReproductor.css';  
import { ListContext } from "./ListContext";

function ReproducirCancion () {

  const { listaCancionesReproduccion } = useContext(ListContext);
  const [indiceCancionActual, setIndiceCancionActual] = useState(null);//Índice de la canción actual en reproducción
  const [audioRef, setAudioRef]= useState('');
  const [nombreMusica, setNombreMusica] = useState('Nombre musica');// Nombre de la canción actual
  const [nombreArtista, setNombreArtista] = useState('Nombre artista');// Nombre del artista
  const [volumen, setVolumen] = useState(50);
  const [estaReproduciendo, setEstaReproduciendo] = useState(false); // Definir inicialmente como false
  const [listaCanciones, setListaCanciones] = useState([]);
  /** 
   * Para Reproducción y pausar la canción
   * */ 
  const clicReproducirPause = () => {
    console.log('canciones recibidas>>>', listaCancionesReproduccion);
    setListaCanciones(listaCancionesReproduccion)
  };
  /**
   * Cambia a la siguiente canción.
   */
  const sigCancion = () => {
      const newIndex = (indiceCancionActual + 1) % listaCanciones.length;
      setIndiceCancionActual(newIndex); 
      setNombreMusica(listaCanciones[newIndex].nombre); 
      setNombreArtista(listaCanciones[newIndex].artista); 
      //setPortadaAlbum(canciones[newIndex].portada); 
      if (estaReproduciendo && audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();    
      }
  };
  const cancionAnterior = () => {
    const newIndex = ((indiceCancionActual - 1) + listaCanciones.length) % listaCanciones.length;
    setIndiceCancionActual(newIndex);
    setNombreMusica(listaCanciones[newIndex].nombre); 
    setNombreArtista(listaCanciones[newIndex].artista); 
    if(estaReproduciendo && audioRef.current) { 
      audioRef.current.currentTime = 0;
       audioRef.current.play();
   }
  };
  /**
   * Cambia el volumen de la reproducción.
   */
  const cambiarVolumen = (e) => {
    const nuevoVolumen = e.target.value;
    setVolumen(nuevoVolumen); 
    const audio = audioRef.current;
    audio.volume = nuevoVolumen / 100; 
  };
   // <img src={portadaAlbum} alt="portada album" className="portada-album" /> */
  return (
    <div className="reproductorMusica">
      <div className="info-cancion">
       
        <div className="detalles-musica">
          <span className=".nombre-musica">{nombreMusica}</span>
          <span className=".separador"> - </span>
          <span className=".nombre-artista">{nombreArtista}</span>
        </div>
      </div>
    <div className="controls">
    {/* <audio ref={audioRef} src={canciones[indiceCancionActual].url} /> */}

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