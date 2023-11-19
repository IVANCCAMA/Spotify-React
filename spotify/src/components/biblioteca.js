import React, { useEffect, useState } from 'react';
import axios from "axios";
import ListaAlbumes from './listaAlbunes';
import './albumes.css';

function Biblioteca({ userConnected }) {
  const database = 'https://spfisbackend-production.up.railway.app/api';
  const [albumes, setAlbumes] = useState([]);

  const fetchData = async () => {
    try {
      const query = `/lista_canciones/oyente/${userConnected.id_usuario}`;
      const response = await axios.get(`${database}${query}`);
      //console.log(response.data);
      const listaCanciones = response.data;
      listaCanciones.sort((a, b) => {
        return a.titulo_lista.localeCompare(b.titulo_lista);
      });

      setAlbumes(listaCanciones);
    } catch (error) {
      console.error('Error al obtener la lista de canciones:', error);
    }
  };

  // Control para que solo se ejecute 1 o 2 veces
  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userConnected])

  
  return (
    <div className='album-content'>
      <span className='albums-title'>Listas de reproducción</span>
      <ListaAlbumes albumes={albumes} userList={true} />
    </div>
  );
}

export default Biblioteca;
