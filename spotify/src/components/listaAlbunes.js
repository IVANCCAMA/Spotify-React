import { Link } from "react-router-dom";
import './listaAlbunes.css';

function ListaAlbumes({ albumes, userList = false }) {
  return (
    <div className="albumes-list">
      {albumes.map((album, index) => (
        <Link
          to={`/lista-canciones${userList? "-user/": "/"}${album.id_lista}`}
          key={album.id_lista}
          className="albumes-item">
          <img
            src={album.path_image}
            alt="Álbum"
            className="albumes-image"
          />
          <div className="albumes-details">
            <span className="albumes-title">{album.titulo_lista}</span>
            <span className="artistas-name">{album.nombre_usuario}</span>
            <span className="albumes-songs">{album.cantidad_canciones} canciones</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ListaAlbumes;
