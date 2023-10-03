
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './listaCanciones.css';
import groupLogo from '../logos/group.png';
import songLogo from '../logos/disc.png';
import axios from "axios";

function ListaCanciones() {
  const albums = [
    { id: 1, artist: "Nombre del Artista" }
  ];

  const [songs, setSongs] = useState([]);
  useEffect(() => {
   const fetchData = async () => {
     try {
       const response = await axios.get('http://localhost:4000/api/canciones/');
       const listaCanciones = response.data;
       setSongs(listaCanciones);
     } catch (error) {
       console.error('Error al obtener la lista de canciones:', error);
     }
   };
 
   fetchData();
 }, []);

  return (



    <div className="album2-list">



      {albums.map((album, index) => (
        <Link to={'/detalle-album/1'} key={album.id} className="album2-item">

          <img src={groupLogo} alt="Álbum" className="album2-logo" />
          <div className="album2-details">
            <div className="album2-title">Album {index+1}</div>
            <div className="artist-name">{album.artist}</div>
            <div className="album2-songs">5 canciones</div>
          </div>
        </Link>

      ))}

         <div className="song-list">

         {songs.map((canciones, index) => (
    <Link to={'/detalle-album/1'} key={canciones.id} className="album-item">
      <img src={songLogo} alt="Álbum" className="song-logo" />
      <div className="album-details">
        <div className="song-title">{canciones.nombre_cancion}</div>
        <div className="artist-name">{songs.artist}</div>
      </div>
    </Link> 

  ))}



    </div>


    </div>

  );
}
export default ListaCanciones;

/* ${album.id}

*/


