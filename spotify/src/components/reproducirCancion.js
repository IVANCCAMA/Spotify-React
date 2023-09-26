import React, { useState, useRef } from "react";
//import './index.css'; // Asegúrate de crear este archivo y añadir tus estilos.

const ReproducirCancion = ({ songs }) => {
   const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef();

  const playPauseHandler = () => {
    const audio = audioRef.current;
    if (audio.paused) audio.play();
    else audio.pause();
  };
//siguiente
  const nextSongHandler = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };
//anterior
  const prevSongHandler = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
  };

  return (
    <div className="music-player">
      <audio ref={audioRef} src={songs[currentSongIndex]} controls />
      <div className="controls">
        <button onClick={prevSongHandler}>Anterior</button>
        <button onClick={playPauseHandler}>Reproducir/Pausar</button>
        <button onClick={nextSongHandler}>Siguiente</button>
      </div>
    </div>
  );
};

export default ReproducirCancion;
