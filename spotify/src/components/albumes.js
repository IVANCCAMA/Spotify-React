import React, { useEffect, useState } from 'react';
import axios from "axios";
import ListaAlbumes from './listaAlbunes';
import './albumes.css';

function Albumes() {
  const [albumes, setAlbumes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://spfisbackend-production.up.railway.app/api/lista_canciones');
        const listaCanciones = response.data;
        listaCanciones.sort((a, b) => {
          return a.titulo_lista.localeCompare(b.titulo_lista);
        });

        setAlbumes(listaCanciones);
      } catch (error) {
        console.error('Error al obtener la lista de canciones:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='album-content'>
      <span className='albums-title'>Albunes</span>
      <ListaAlbumes albumes={albumes} />
    </div>
  );
}

export default Albumes;
