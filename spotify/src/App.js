import React from 'react';
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReproducirCancion  from './components/reproducirCancion';
 


function App() {
  const cancion = [
    {
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      nombre: 'Canción 1',
      artista: 'Artista 1',
      portada: 'url1.jpg'
    },
    {
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      nombre: 'Canción 2',
      artista: 'Artista 2',
      portada: 'url2.jpg'
    }
  
  ];

  return <ReproducirCancion canciones={cancion} />;
}

export default App;
