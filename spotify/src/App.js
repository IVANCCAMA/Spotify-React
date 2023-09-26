import React from 'react';
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReproducirCancion  from './components/reproducirCancion';
 
//Prueba para ver la ejecucion nomas

function App() {
  const songs = [
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', //EJMPLO
  ];

  return <ReproducirCancion songs={songs} />;
}

export default App;
