import React from "react";
import { Link } from "react-router-dom";
import './listaCanciones.css';
import groupLogo from '../logos/group.png';
import songLogo from '../logos/disc.png';

function ListaCanciones() {
  const albums = [
    { id: 1, artist: "Nombre del Artista" }
  ];

  const songs = [
    { id: 1, artist: "Nombre del Artista" },
    { id: 2, artist: "Nombre del Artista" },
    { id: 3, artist: "Nombre del Artista" },
    { id: 4, artist: "Nombre del Artista" },
    { id: 5, artist: "Nombre del Artista" }
  ];

  return (
    
    

    <div className="album2-list">
      

      {albums.map((album, index) => (
        <Link to={`/detalle-album/1`} key={album.id} className="album2-item">
          <img src={groupLogo} alt="Álbum" className="album2-logo" />
          <div className="album2-details">
            <div className="album2-title">Album {index+1}</div>
            <div className="artist-name">{album.artist}</div>
            <div className="album2-songs">5 canciones</div>
          </div>
        </Link>
        
      ))}

         <div className="song-list">
      
         {songs.map((album, index) => (
    <Link to={`/detalle-album/1`} key={album.id} className="album-item">
      <img src={songLogo} alt="Álbum" className="song-logo" />
      <div className="album-details">
        <div className="song-title">Nombre de la {index+1} Cancion</div>
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


