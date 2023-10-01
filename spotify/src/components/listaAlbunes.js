import React from "react";
import { Link } from "react-router-dom";
import './listaAlbunes.css';
import groupLogo from '../logos/group.png'; // Reemplaza con la ruta de tu imagen de álbum

function ListaAlbumes() {
  const albums = [
    { id: 1, title: "Album 1", artist: "Nombre del Artista 1" },
    { id: 2, title: "Album 2", artist: "Nombre del Artista 2" },
    { id: 3, title: "Album 3", artist: "Nombre del Artista 3" },
    { id: 4, title: "Album 4", artist: "Nombre del Artista 4" },
    { id: 5, title: "Album 5", artist: "Nombre del Artista 5" },
    { id: 6, title: "Album 6", artist: "Nombre del Artista 6" },
    { id: 7, title: "Album 7", artist: "Nombre del Artista 7" },
    { id: 8, title: "Album 8", artist: "Nombre del Artista 8" },
    { id: 9, title: "Album 9", artist: "Nombre del Artista 9" }
  ];

  return (
    <div className="album-list">
      {albums.map((album) => (
        <Link to={`/detalle-album/${album.id}`} key={album.id} className="album-item">
          <img src={groupLogo} alt="Álbum" className="album-logo" />
          <div>
            <div className="album-title">{album.title}</div>
            <div className="artist-name">{album.artist}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ListaAlbumes;
