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
  // ejemlpo de guardar el user
  const [userConnected, setUserConnected] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const location = useLocation();
  const isLoginRoute = location.pathname === '/iniciarsesion' || location.pathname === '/crearAlbum'
  || location.pathname === '/crearListaReproduccion' || location.pathname === '/añadirCancion'
  || location.pathname === '/registro';

  return (
    <ListProvider>
      <div className="app-container">
        <Encabeazado
          updateShowForm={(showForm) => { setShowForm(showForm); }}
          userConnected={userConnected}
          signOff={(shouldSignOff) => { if (shouldSignOff) { setUserConnected(null); } }}
        />
        <div className='container-super'>
          <MenuLateral
            userConnected={userConnected}
          />
          <div className="content">
            {!isLoginRoute &&
              <IniciarSesion
                signOn={(user) => { setUserConnected(user); }}
                showForm={showForm}
              />
            }

            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/Albumes" element={<Albumes />} />
              <Route path="/iniciarsesion" element={< IniciarSesion
                signOn={(user) => { setUserConnected(user); }} />} />
              <Route path="/crearAlbum" element={<CrearLista />} />
              <Route path="/crearListaReproduccion" element={<CrearListaReproduccion />} />
              <Route path="/añadirCancion" element={<AñadirCancion />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/perfil" element={< PerfilUsuario userConnected={userConnected} />} />
              <Route path="/lista-canciones/:id_lista" element={<ListaCanciones />} />
            </Routes>
          </div>
        </div>
        <ReproducirCancion />
      </div>
    </ListProvider>
  );
}

export default App;
