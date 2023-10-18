import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CrearLista from './components/crearLista';
import AñadirCancion from './components/añadirCancion';
import MenuLateral from './components/menuLateral';
import './App.css';
import ListaAlbumes from './components/listaAlbunes';
import ReproducirCancion from './components/reproducirCancion';

/* import Sencillo from './components/sencillo';
 */import Inicio from './components/inicioHome';
 import ListaCanciones from './components/listaCanciones';

 function App() {
  const misCanciones = [
    {
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      nombre: 'Canción 1',
      artista: 'Artista 1',
       
    },
    {
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      nombre: 'Canción 2',
      artista: 'Artista 2',
       
    },
    {
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      nombre: 'Canción 3',
      artista: 'Artista 3',
       
    }
  
  ];
  return (
    <div className="app-container">
      <div className="sidebar">
        <MenuLateral />
      </div>
      <div className="content">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/Albumes" element={<ListaAlbumes />} />
          <Route path="/crearAlbum" element={<CrearLista />} />
          <Route path="/añadirCancion" element={<AñadirCancion />} />
          <Route path="/lista-canciones/:id_lista" element={<ListaCanciones />} />
        </Routes>
      </div>
      <div className="music-player">
      <ReproducirCancion canciones={misCanciones} />

      </div>
    </div>
  );
}


export default App;
