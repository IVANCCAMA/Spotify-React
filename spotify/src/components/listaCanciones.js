import React from "react";
import { Link } from "react-router-dom";
import './listaCanciones.css';
import groupLogo from '../logos/group.png';

function ListaCanciones() {
  const albums = [
    { id: 1, artist: "Nombre del Artista" }
  ];

  const songs = [
    { id: 1, artist: "Nombre del Artista" },
    { id: 2, artist: "Nombre del Artista" },
    { id: 3, artist: "Nombre del Artista" },
    { id: 4, artist: "Nombre del Artista" },
    { id: 5, artist: "Nombre del Artista" },
    { id: 6, artist: "Nombre del Artista" },
    { id: 7, artist: "Nombre del Artista" },
    { id: 8, artist: "Nombre del Artista" },
    { id: 9, artist: "Nombre del Artista" }
  ];

  return (
    <div className="album2-list">
      {albums.map((album, index) => (
        <Link to={`/detalle-album/${album.id}`} key={album.id} className="album-item">
          <img src={groupLogo} alt="Álbum" className="album-logo" />
          <div className="album-details">
            <div className="album-title">Album {index + 1}</div>
            <div className="artist-name">{album.artist}</div>
            <div className="album-songs">0 canciones</div>
          </div>
        </Link>
      ))}

      <div className="song-list">
        {songs.map((album, index) => (
          <Link to={`/detalle-album/${album.id}`} key={album.id} className="album-item">
            <img src={groupLogo} alt="Álbum" className="album-logo" />
            <div className="album-details">
              <div className="song-title">Album {index + 1}</div>
              <div className="artist-name">{album.artist}</div>
            </div>
          </Link>

        ))}
      </div>
    </div>
  );
}

export default ListaCanciones;
