import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import CrearLista from './components/crearLista';
import AñadirCancion from './components/añadirCancion';
import MenuLateral from './components/menuLateral';
import Registro from './components/registro';
import './App.css';
import Albumes from './components/albumes';
import ReproducirCancion from './components/reproducirCancion';
import Inicio from './components/inicioHome';
import ListaCanciones from './components/listaCanciones';
import { ListProvider } from './components/ListContext';
import PerfilUsuario from './components/perfilUsuario';
import Encabeazado from "./components/encabezado";
import CrearListaReproduccion from './components/listaReproduccion';
import IniciarSesion from "./components/iniciarsesion";

function App() {
  const [showForm, setShowForm] = useState(false);
  const location = useLocation();
  const isLoginRoute = location.pathname === '/iniciarsesion';

  return (
    <ListProvider>
      <div className="app-container">
        <Encabeazado updateShowForm={(showForm) => { setShowForm(showForm); }} />
        <div className='container-super'>
          <MenuLateral />
          <div className="content">
            {!isLoginRoute && <IniciarSesion showForm={showForm} />}
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/Albumes" element={<Albumes />} />
              <Route path="/crearAlbum" element={<CrearLista />} />
              <Route path="/crearListaReproduccion" element={<CrearListaReproduccion />} />
              <Route path="/añadirCancion" element={<AñadirCancion />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/perfil" element={< PerfilUsuario />} />
              <Route path="/lista-canciones/:id_lista" element={<ListaCanciones />} />
              <Route path="/iniciarsesion" element={< IniciarSesion />} />
            </Routes>
          </div>
        </div>
        <ReproducirCancion />
      </div>
    </ListProvider>
  );
}

export default App;
