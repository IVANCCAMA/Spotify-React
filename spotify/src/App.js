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
import ListaCancionesUser from './components/listaCancionesUser';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userConnected, setUserConnected] = useState(null);

  const login = (user) => {
    setLoggedIn(true);
    setUserConnected(user);
  };

  const logout = () => {
    setLoggedIn(false);
    setUserConnected(null);
  };

  return (
    <ListProvider>
      <div className="app-container">
        <Encabeazado loggedIn={loggedIn} signOff={logout} />
        <div className='container-super'>
          <MenuLateral userType={loggedIn ? userConnected.tipo_usuario : null} isLogin = {loggedIn} />
          <div className="content">
            <Routes>
              <Route path="/lista-canciones/:id_lista" element={<ListaCanciones />} />
              {loggedIn ? (
                <>
                  {userConnected.tipo_usuario === "Distribuidora musical" ? (
                    <>
                      <Route path="/" element={<Inicio />} />
                      <Route path="/Albumes" element={<Albumes />} />
                      <Route path="/crearAlbum" element={<CrearLista />} />
                      <Route path="/añadirCancion" element={<AñadirCancion />} />
                    </>
                  ) : (
                    <>
                      <Route path="/" element={<Albumes />} />
                      <Route path="/crearListaReproduccion" element={<CrearListaReproduccion />} />
                      <Route path="/perfil" element={< PerfilUsuario userConnected={userConnected} />} />
                      <Route path="/lista-canciones-user/:id_lista" element={<ListaCancionesUser />} />
                    </>
                  )}
                </>
              ) : (
                <>
                  <Route path="/" element={<Albumes />} />
                  <Route path="/iniciarsesion" element={< IniciarSesion signOn={login} />} />
                  <Route path="/registro" element={<Registro />} />
                </>
              )}
              <Route path="*" element={<Inicio to="/" />} />

            </Routes>
          </div>
        </div>
        <ReproducirCancion />
      </div>
    </ListProvider>
  );
}

export default App;
