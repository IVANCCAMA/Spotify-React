import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Icon } from '@iconify/react';
import './perfilUsuario.css';
import { Link } from "react-router-dom";
import ListaAlbumesUser from './listaAlbunesUser';

function PerfilUsuario({ userConnected }) {
  // recuperar albumes del user
  const [albumes, setAlbumes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Recuperar información del usuario por su ID
    const fetchUserInfo = async () => {
      try {
        if (true) {          
          const response = await axios.get(`https://spfisbackend-production.up.railway.app/api/usuarios/${userConnected.id_usuario}`);
          const userData = response.data;
          setUserInfo(userData);
        }
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
      }
    };

    fetchUserInfo();
  }, [userConnected]);

  useEffect(() => {
    // Recuperar lista de canciones o lo que necesites
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://spfisbackend-production.up.railway.app/api/lista_canciones/oyente/${userConnected.id_usuario}`);
        const listaCanciones = response.data;
        listaCanciones.sort((a, b) => {
          return a.titulo_lista.localeCompare(b.titulo_lista);
        });

        setAlbumes(listaCanciones.slice(0, 6));
      } catch (error) {
        console.error('Error al obtener la lista de canciones:', error);
      }
    };

    fetchData();
  }, [userConnected.id_usuario]); // Este useEffect se ejecutará solo una vez al montar el componente


  

return (
  <div className="contendor-perfil-usuario">
    <div className="user-profile-container">
      <div className="user-profile-column">
        <Icon icon="gg:profile" color="white" width="100px" height="100px" />
      </div>
      <div className="user-info-row">
        <div>PERFIL</div>
        <div className="user-profile-alias">
          <div className="contenedor-alias">{userInfo?.nombre_usuario}</div>
        </div>
        <div>{userInfo?.cantidad_listas} listas de reproducion</div>
      </div>
    </div>
    <div className="contenedor-listas-user">
      <div className="contenedor-listas-user-1">
        <span>Listas de reproducciones</span>
        <Link to="/" className="mostrar-todo" >Mostrar todo</Link>
      </div>
      <ListaAlbumesUser albumes={albumes} style={{gridTemplateColumns: 'repeat(3, minmax(300px, 1fr))'}} />
    </div>
  </div>
);

}

export default PerfilUsuario;