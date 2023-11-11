import React, { useEffect, useState } from "react";
import { Icon } from '@iconify/react';
import './perfilUsuario.css';
import { Link } from "react-router-dom";
import './listaAlbunes';
import axios from "axios"


function PerfilUsuario() {

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
        <div className="contendor-perfil-usuario">
            <div className="user-profile-container">
                <div className="user-profile-column">
                    <Icon icon="gg:profile" color="white" width="100px" height="100px" />
                </div>
                <div className="user-info-row">
                    <div>PERFIL</div>
                    <div className="user-profile-alias">
                        <div className="contenedor-alias">Alias del oyente</div>
                        <button className="contenedor-editar">
                            <Icon icon="material-symbols:edit-outline" color="white" width={16} height={16} />
                            <div>Editar</div>
                        </button>
                    </div>
                    <div>n listas de reproducción</div>
                </div>
            </div>
            <div className="contenedor-listas-user">
                <div className="contenedor-listas-user-1">
                    <div>Listas de reproducciones</div>
                    <Link to="/" className="mostrar-todo" >Mostar todo</Link>
                </div>
            </div>



            <div className="listas-usuer">
                <div className="albumes-list">
                    {albumes.map((album, index) => (
                        <Link to={`/lista-canciones/${album.id_lista}`} key={album.id_lista} className="albumes-item">
                            <img
                                src={album.path_image}
                                alt="Álbum"
                                className="albumes-image"
                            />
                            <div className="albumes-details">
                                <div className="albumes-title">{album.titulo_lista}</div>
                                <div className="artistas-name">{album.nombre_usuario}</div>
                                <div className="albumes-songs">{album.cantidad_canciones} canciones</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default PerfilUsuario;