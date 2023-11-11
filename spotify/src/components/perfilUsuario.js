import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Icon } from '@iconify/react';
import './perfilUsuario.css';
import { Link } from "react-router-dom";
import ListaAlbumes from './listaAlbunes';

function PerfilUsuario({ userConnected }) {
  // recuperar albumes del user
  const [albumes, setAlbumes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://spfisbackend-production.up.railway.app/api/lista_canciones');
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
  }, []);

  return (
    <div className="contendor-perfil-usuario">
      <div className="user-profile-container">
        <div className="user-profile-column">
          <Icon icon="gg:profile" color="white" width="100px" height="100px" />
        </div>
        <div className="user-info-row">
          <div>PERFIL</div>
          <div className="user-profile-alias">
            <div className="contenedor-alias">Alias del oyente</div>
          </div>
          <div>n listas de reproducción</div>
        </div>
      </div>
      <div className="contenedor-listas-user">
        <div className="contenedor-listas-user-1">
          <span>Listas de reproducciones</span>
          <Link to="/" className="mostrar-todo" >Mostar todo</Link>
        </div>
        <ListaAlbumes albumes={albumes} />
      </div>
    </div>
  );
}

export default PerfilUsuario;