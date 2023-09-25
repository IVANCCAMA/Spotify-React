import React, { useRef } from 'react';

function ReproducirCancion({src}) {
  const audioRef = useRef(); // Referencia al elemento audio
  
  const handlePlay = () => {
    audioRef.current.currentTime = 0; // Reiniciar la canción al inicio
    audioRef.current.play(); // Reproducir la canción
  };
  
  return (
    <div>
      <button onClick={handlePlay}>Reproducir Canción</button>
      <audio ref={audioRef} src={src} />
    </div>
  );
}

export default ReproducirCancion;
