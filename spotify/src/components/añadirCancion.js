import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { RecuperarDuracion, SubirCancion, deleteFile, recuperarUrlCancion } from '../firebase/config';
import { alfanumerico } from './form.js';
import './form.css'
import Alerta from './alerta';

function AñadirCancion() {
  const database = 'https://spfisbackend-production.up.railway.app/api';
  const generos = ['Pop', 'Rock and Roll', 'Disco', 'Country', 'Techno',
    'Reggae', 'Salsa', 'Flamenco', 'Ranchera', 'Hip hop/Rap',
    'Reggaetón', 'Metal', 'Funk', 'Bossa Nova', 'Música melódica'];
  const [listas, setListas] = useState([]);
  const [botonHabilitado, setBotonHabilitado] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [redirectTo, setRedirectTo] = useState(null);
  useEffect(() => { mostrarNombreArchivo(); }, [listas, botonHabilitado, isModalOpen, modalMessage, redirectTo]);

  function handleCloseAndRedirect() {
    setIsModalOpen(false);
    if (redirectTo) {
      window.location.replace(redirectTo);
    }
  }

  const getlistasbyid_user = async (id_usuario) => {
    try {
      const query = `/usuarios/getlistasbyid_user/${id_usuario}`;
      const response = await axios.get(`${database}${query}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener la lista de canciones del usuario:', error);
      return null;
    }
  };

  const getcancionesbyid_user = async (id_usuario) => {
    try {
      const query = `/usuarios/getcancionesbyid_user/${id_usuario}`;
      const response = await axios.get(`${database}${query}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener las canciones del usuario:', error);
      return null;
    }
  };

  const ExisteArtista = async (nombreArtista) => {
    try {
      const query = `/usuarios/search_nom/ ?searchTerm=${nombreArtista}`;
      const response = await axios.get(`${database}${query}`);

      const artistas = response.data;
      const artistaEncontrado = artistas.find((artista) => artista.nombre_usuario === nombreArtista);

      if (artistaEncontrado && artistaEncontrado.id_usuario) {
        return artistaEncontrado.id_usuario;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
      return null;
    }
  };

  const validarCampos = async (campos) => {
    if (campos.titulo.length > 20 || campos.titulo.length < 1 || !alfanumerico(campos.titulo)) {
      document.getElementById('titulo_Cancion').classList.add('active');
      return null;
    }
    if (campos.artista.length > 20 || campos.artista.length < 1 || !alfanumerico(campos.artista)) {
      document.getElementById('artista').classList.add('active');
      return null;
    }
    if (campos.album.length < 1 || campos.genero.length < 1 || campos.archivo.length < 1) {
      console.log("No se selecciono album, genero o archivo");
      return null;
    }

    // artista
    const id_usuario = await ExisteArtista(campos.artista);
    if (id_usuario == null) {
      console.log('artista no encontrado');
      document.getElementById('artista').classList.add('active');
      return null;
    }

    // album
    const albumes = await getlistasbyid_user(id_usuario);
    const albumesUsuario = albumes.find((album) => album.titulo_lista === campos.album);
    const id_lista = albumesUsuario?.id_lista;
    if (!id_lista) {
      console.log('Álbum no encontrado');
      document.getElementById('album').classList.add('active');
      return null;
    }

    // titulo
    const canciones = await getcancionesbyid_user(id_usuario);
    const cancionExistente = canciones.find((cancion) => cancion.nombre_cancion === campos.titulo);
    if (cancionExistente) {
      console.log('el artista ya tiene una cancion con el mismo nombre');
      document.getElementById('titulo_Cancion').classList.add('active');
      return null;
    }

    // genero
    for (const genero of generos) {
      if (campos.genero === genero) {
        return {
          id_lista: id_lista,
          nombre_cancion: campos.titulo,
          path_cancion: "",
          duracion: "",
          genero: campos.genero
        };
      }
    }
    return null;
  }

  const validarFormatoArchivo = async (archivo) => {
    const formatosPermitidos = ["mpeg", "wav"];
    for (const formato of formatosPermitidos) {
      if (archivo.type.includes(formato)) {
        return true;
      }
    }
    return false;
  };

  const subirFirebase = async (archivo) => {
    try {
      const cancionInfo = await SubirCancion(archivo);
      const cancionUrl = await recuperarUrlCancion(cancionInfo);
      return { url: cancionUrl, filePath: cancionInfo };
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const subirBD = async (nuevaCancion) => {
    try {
      const query = `/canciones/`;
      const response = await axios.post(`${database}${query}`, nuevaCancion);
      return true;
    } catch (error) {
      console.error('Error al subir a la base de datos:', error);
      return false;
    }
  }

  const validarForm = async (e) => {
    // Deshabilitar el botón
    setBotonHabilitado(false);
    try {
      e.preventDefault();

      const campos = {
        titulo: eliminarEspacios(document.getElementById('titulo_Cancion').value).trim(),
        artista: eliminarEspacios(document.getElementById('artista').value).trim(),
        album: eliminarEspacios(document.getElementById('album').value).trim(),
        genero: eliminarEspacios(document.getElementById('genero').value).trim(),
        archivo: document.getElementById('archivo').files
      };

      const nuevaCancion = await validarCampos(campos);
      if (nuevaCancion === null) {
        setModalMessage(`Asegúrese de que todos los campos estén llenados correctamente.`);
        setIsModalOpen(true);
        return;
      }

      const archivo = campos.archivo[0];
      if (!await validarFormatoArchivo(archivo)) {
        setModalMessage(`Formato de archivo no válido.`);
        setIsModalOpen(true);
        return;
      }

      const maxSize = 15 * 1024 * 1024; // 15 MB en bytes
      if (archivo.size > maxSize) {
        setModalMessage(`Tamaño máximo de 15 MB excedido.`);
        setIsModalOpen(true);
        return;
      }

      try {
        const resultado = await subirFirebase(archivo);
        nuevaCancion.path_cancion = resultado.url;

        const recuperarDuracionAudio = await RecuperarDuracion(archivo);
        nuevaCancion.duracion = recuperarDuracionAudio

        const subidaExitosa = await subirBD(nuevaCancion);
        if (!subidaExitosa) {
          deleteFile(resultado.filePath);
          setModalMessage(`Error al cargar la canción. Intente más tarde.`);
          setIsModalOpen(true);
          return;
        }

        setModalMessage(`Canción creada exitosamente.`);
        setIsModalOpen(true);
        setRedirectTo("/");
      } catch (error) {
        console.error('Error:', error);
        setModalMessage(`Error al subir o procesar el archivo.`);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    } finally {
      // Una vez que se complete, habilitar el botón nuevamente
      setBotonHabilitado(true);
    }
  };

  const mostrarNombreArchivo = () => {
    const file = document.getElementById('archivo');

    if (file.files && file.files.length > 0) {
      file.previousElementSibling.innerText = file.files[0].name;
      file.previousElementSibling.style.display = 'block';
      file.nextElementSibling.value = "X";
      file.nextElementSibling.classList.add('active');
    }
  };

  const cargarListas = async () => {
    const nombreArtista = document.getElementById('artista').value;
    if (nombreArtista.length > 0) {
      try {
        const idArtistaEncontrado = await ExisteArtista(nombreArtista);
        if (idArtistaEncontrado === null) {
          setListas([]);
        } else {
          const listaAlbumes = await getlistasbyid_user(idArtistaEncontrado);
          setListas(listaAlbumes);
        }
      } catch (error) {
        console.error('Error al verificar el artista:', error);
      }
    } else {
      setListas([]);
    }
    document.getElementById('album').selectedIndex = 0;
  };

  const eliminarEspacios = (value) => {
    if (value === " ") {
      return "";
    }
    return value.replace(/\s+/g, ' ');
  };

  const handle = (e) => {
    let newValue = eliminarEspacios(e.target.value);
    if (alfanumerico(newValue)) {
      e.target.classList.remove('active');
    } else {
      e.target.classList.add('active');
    }
    if (newValue.length > 20) {
      newValue = newValue.slice(0, 20);
    }
    e.target.value = newValue;
  };

  return (
    <div className="modal-form">
      <form className="modal-box" id="form" onSubmit={validarForm}>
        <div className="inter-modal">
          <div className="campo">
            <div className="input-box">
              <label htmlFor="titulo">Título de la canción *</label>
              <input autoFocus required
                type="text"
                className="validar"
                id="titulo_Cancion"
                name="titulo_Cancion"
                placeholder="Escriba el título de la canción"
                onChange={handle}
                onBlur={(e) => { e.target.value = e.target.value.trim(); }}
              />
            </div>
          </div>

          <div className="campo">
            <div className="input-box">
              <label htmlFor="artista">Nombre de artista *</label>
              <input required
                type="text"
                className="validar"
                id="artista"
                name="artista"
                placeholder="Escriba el nombre del artista"
                onChange={(e) => { handle(e); cargarListas(); }}
                onBlur={(e) => { e.target.value = e.target.value.trim(); }}
              />
            </div>
          </div>

          <div className="campo">
            <div className="input-box">
              <label htmlFor="album">Álbum *</label>
              <select name="album" id='album' required>
                <option disabled selected hidden value="">Seleccionar lista</option>
                {listas.map((lista, index) => (
                  <option key={index} value={lista.id}>{lista.titulo_lista}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="campo">
            <div className="input-box">
              <label htmlFor="genero">Género musical *</label>
              <select name="genero" id='genero' required>
                <option disabled selected hidden value="">Seleccionar género</option>
                {generos.map((genero) => (
                  <option key={genero} value={genero}>{genero}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SELECCIONAR ARCHIVO */}
          <div className="campo campo-cargar-cancion">
            <div className="input-box">
              <label>Seleccionar canción *</label>
              <div className="seleccionarArchivo">
                <span className="nombreArchivo" id="nombreArchivo"></span>
                <input
                  type="file"
                  name="archivo"
                  id="archivo"
                  accept=".mp3, audio/wav"
                  style={{ display: 'none' }}
                  onChange={mostrarNombreArchivo}
                />
                <input required
                  type="button"
                  className="btn-subir bg-white"
                  onClick={() => { document.getElementById('archivo').click(); }}
                  value="Seleccionar canción"
                />
              </div>
            </div>
          </div>

          <div className="campo">
            <div className="btn-box">
              <button type="submit" className="btn-next" disabled={!botonHabilitado}>Aceptar</button>
              <Link to="/" className="custom-link">Cancelar</Link>
            </div>
          </div>
        </div>
      </form>
      <Alerta
        isOpen={isModalOpen}
        mensaje={modalMessage}
        onClose={handleCloseAndRedirect}
      />
    </div>
  );
};

export default AñadirCancion;
