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
import Alerta from './components/alerta';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userConnected, setUserConnected] = useState(null);

  const [modalMessage, setModalMessage] = useState("");
  const [redirectTo, setRedirectTo] = useState(null);

  // reasignar al default al reload
  const location = useLocation();
  useEffect(() => {
    setModalMessage("");
    setRedirectTo(null);
  }, [location.pathname]);

  /**
   * Modal Alerta para mostrar errores.
   *
   * @param {string} mensaje - Mensaje de error.
   * @param {string} [redirectTo=null] - Route para redireccionar tras confirmar el error.
   * @returns {} Abre el modal Alerta.
   */
  const showAlertModal = (mensaje, redirectTo = null) => {
    setModalMessage(mensaje);
    setRedirectTo(redirectTo);
  }

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
          <MenuLateral
            isLogin={loggedIn}
            userType={loggedIn ? userConnected.tipo_usuario : null}
            showAlertModal={showAlertModal}
          />
          <div className="content">
            <Alerta
              mensaje={modalMessage}
              redirectTo={redirectTo}
              setModalMessage={setModalMessage}
            />

            <Routes>

              <Route path="/lista-canciones/:id_lista" element={<ListaCanciones isLogin={loggedIn} showAlertModal={showAlertModal} />} />

              <Route path="/lista-canciones/:id_lista" element={<ListaCanciones />} />
              {loggedIn ? (
                <>
                  {userConnected.tipo_usuario === "Distribuidora musical" ? (
                    <>
                      <Route path="/" element={<Inicio />} />
                      <Route path="/Albumes" element={<Albumes />} />
                      <Route path="/crearAlbum" element={<CrearLista showAlertModal={showAlertModal} />} />
                      <Route path="/añadirCancion" element={<AñadirCancion showAlertModal={showAlertModal} />} />
                    </>
                  ) : (
                    <>
                      <Route path="/" element={<Albumes />} />
                      <Route path="/crearListaReproduccion" element={<CrearListaReproduccion showAlertModal={showAlertModal} />} />
                      <Route path="/perfil" element={< PerfilUsuario userConnected={userConnected} />} />
                      <Route path="/lista-canciones-user/:id_lista" element={<ListaCancionesUser />} />
                    </>
                  )}
                </>
              ) : (
                <>
                  <Route path="/" element={<Albumes />} />
                  <Route path="/iniciarsesion" element={< IniciarSesion signOn={login} showAlertModal={showAlertModal} />} />
                  <Route path="/registro" element={<Registro showAlertModal={showAlertModal} />} />
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
