import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Icon } from '@iconify/react';
import './perfilUsuario.css';
import { Link } from "react-router-dom";
import ListaAlbumes from './listaAlbunes';

function PerfilUsuario({ userConnected }) {
  const database = 'https://spfisbackend-production.up.railway.app/api';
  const [albumes, setAlbumes] = useState([]);

  const fetchData = async () => {
    try {
      const query = `/lista_canciones/oyente/${userConnected.id_usuario}`;
      const response = await axios.get(`${database}${query}`);
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

  return (
    <div className="contendor-perfil-usuario">
      <div className="user-profile-container">
        <div className="user-profile-column">
          <Icon icon="gg:profile" color="white" width="100px" height="100px" />
        </div>
        <div className="user-info-row">
          <div>PERFIL</div>
          <div className="user-profile-alias">
            <div className="contenedor-alias">{userConnected?.nombre_usuario}</div>
          </div>
          <div>{userConnected?.cantidad_listas} listas de reprodución</div>
        </div>
      </div>
      <div className="contenedor-listas-user">
        <div className="contenedor-listas-user-1">
          <span>Listas de reproducción</span>
          <Link to="/biblioteca" className="mostrar-todo" >Mostrar todo</Link>
        </div>
        <div style={{margin: "0 2em"}}> {/* xd */}
          <ListaAlbumes albumes={albumes} />
        </div>
      </div>
    </div>
  );
}

export default PerfilUsuario;