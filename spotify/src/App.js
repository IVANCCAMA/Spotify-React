import React from 'react';
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReproducirCancion  from './components/reproducirCancion';
 


function App() {
  const songs = [
    {
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      name: 'Canción ',
      artist: 'Artista',
      cover: 'url1.jpg'
    },
    {
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      name: 'Canción 2',
      artist: 'Artista 2',
      cover: 'url2.jpg'
    }
  
  ];

  return <ReproducirCancion inputSongs={songs} />;
}

export default App;
