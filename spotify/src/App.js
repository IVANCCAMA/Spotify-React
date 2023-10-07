import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CrearLista from './components/crearLista';
import AñadirCancion from './components/añadirCancion';
import MenuLateral from './components/menuLateral';
import './App.css';
import ListaAlbumes from './components/listaAlbunes';

/* import Sencillo from './components/sencillo';
 */import Inicio from './components/inicioHome';
 import ListaCanciones from './components/listaCanciones';


function App() {
  return (
    <div className="boby">
      <div className="flex">
        <MenuLateral />
        <div className="container mx-auto py-4 px-20">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/Albumes" element={<ListaAlbumes />} />
            <Route path="/crearAlbum" element={<CrearLista />} />
            {/* <Route path="/Sencillo" element={<Sencillo />} /> */}
            <Route path="/añadirCancion" element={<AñadirCancion />} />
           {/*  <Route path={`/detalle-album/1`} element={<ListaCanciones />} /> */}
           <Route path="/lista-canciones/:id_lista" element={<ListaCanciones />} /> {/* Esta es la línea que mencionaste */}

          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
