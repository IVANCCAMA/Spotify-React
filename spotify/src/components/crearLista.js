import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SubirPortada, deleteFile, recuperarUrlPortada } from '../firebase/config';
import { alfanumerico } from './form.js';
import './form.css';

function CrearLista({ showAlertModal }) {
  const database = 'https://spfisbackend-production.up.railway.app/api';
  const [botonHabilitado, setBotonHabilitado] = useState(true);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine); // Verifica si hay conexión inicialmente

  const handleOnlineStatusChange = () => {
    setIsOnline(window.navigator.onLine);
  };

  useEffect(() => {
    mostrarNombreArchivo();
  }, [botonHabilitado]);

  useEffect(() => {
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

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
      document.getElementById('titulo_lista').classList.add('active');
      return null;
    }
    if (campos.artista.length > 20 || campos.artista.length < 1 || !alfanumerico(campos.artista)) {
      document.getElementById('artista').classList.add('active');
      return null;
    }
    if (campos.colaborador.length > 20 || !alfanumerico(campos.colaborador)) {
      document.getElementById('colaborador').classList.add('active');
      return null;
    }
    if (campos.archivo.length < 1) {
      console.log("No se selecciono archivo");
      return null;
    }

    // artista
    const id_usuario = await ExisteArtista(campos.artista);
    if (id_usuario == null) {
      document.getElementById('artista').classList.add('active');
      showAlertModal('El artista no existe, intente con otro');
      return null;
    }

    // titulo
    const albumes = await getlistasbyid_user(id_usuario);
    const albumExistente = albumes.find((album) => album.titulo_lista === campos.titulo);
    if (albumExistente) {
      document.getElementById('titulo_lista').classList.add('active');
      showAlertModal('El nombre de la carpeta ya está en uso, intente otro');
      return null;
    }

    // colaborador
    if (campos.colaborador.length > 0) {
      const id_colaborador = await ExisteArtista(campos.colaborador);
      if (id_colaborador == null) {
        document.getElementById('colaborador').classList.add('active');
        showAlertModal('El artista colaborador no existe, intente con otro');
        return null;
      } else if (id_colaborador === id_usuario) {
        document.getElementById('colaborador').classList.add('active');
        showAlertModal('El artista y el colaborador no pueden ser el mismo');
        return null;
      }
    }

    return {
      id_usuario: id_usuario,
      nombre_usuario: campos.artista,
      titulo_lista: campos.titulo,
      path_image: "",
      // colaborador: colaborador
      colaborador: campos.colaborador
    };
  };

  const validarFormatoArchivo = async (archivo) => {
    const formatosPermitidos = ["jpeg", "png"];
    for (const formato of formatosPermitidos) {
      if (archivo.type.includes(formato)) {
        return true;
      }
    }
    return false;
  };

  const subirFirebase = async (archivo) => {
    try {
      const portadaInfo = await SubirPortada(archivo);
      const imageUrl = await recuperarUrlPortada(portadaInfo);
      return { url: imageUrl, filePath: portadaInfo };
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const subirBD = async (nuevoAlbum) => {
    try {
      const query = `/lista_canciones/`;
      await axios.post(`${database}${query}`, nuevoAlbum);
      return true;
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
      return false;
    }
  };

  const validarForm = async (e) => {

    setBotonHabilitado(false);
    try {
      if (isOnline) {
        e.preventDefault();

        const campos = {
          titulo: eliminarEspacios(document.getElementById('titulo_lista').value).trim(),
          artista: eliminarEspacios(document.getElementById('artista').value).trim(),
          colaborador: eliminarEspacios(document.getElementById('colaborador').value).trim(),
          archivo: document.getElementById('archivo').files
        };

        const nuevoAlbum = await validarCampos(campos);
        if (nuevoAlbum === null) {
          showAlertModal(`Asegúrese de que todos los campos estén llenados correctamente`);
          return;
        }

        const archivo = campos.archivo[0];
        if (!await validarFormatoArchivo(archivo)) {
          showAlertModal(`Formato de archivo no válido`);
          return;
        }

        const maxSize = 5 * 1024 * 1024; // 15 MB en bytes
        if (archivo.size > maxSize) {
          showAlertModal(`Tamaño máximo de 5 MB excedido`);
          return;
        }

        try {
          const resultado = await subirFirebase(archivo);
          nuevoAlbum.path_image = resultado.url;

          const subidaExitosa = await subirBD(nuevoAlbum);
          if (!subidaExitosa) {
            deleteFile(resultado.filePath);
            e.preventDefault();
            showAlertModal(`Error al cargar la canción. Intente más tarde`);
            return;
          }
          showAlertModal(`Lista creada exitosamente`, "/");
        } catch (error) {
          console.error('Error:', error);
          showAlertModal(`Error al subir o procesar el archivo`);
        }
      } else {
        e.preventDefault();
        showAlertModal('Hubo un error al crear la carpeta, Intenta nuevamente');
      }
    } catch (error) {
      e.preventDefault();
      showAlertModal('Hubo un error al crear la carpeta, Intenta nuevamente');
    } finally {
      // Una vez que se complete, habilitar el botón nuevamente
      setBotonHabilitado(true);
    }
  };

  const mostrarNombreArchivo = async () => {
    const file = document.getElementById('archivo');

    if (file.files && file.files.length > 0) {
      file.previousElementSibling.innerText = file.files[0].name;
      file.previousElementSibling.style.display = 'block';
      file.nextElementSibling.value = "X";
      file.nextElementSibling.classList.add('active');
    }
  };

  const eliminarEspacios = (value) => {
    if (value === " ") {
      return "";
    }
    return value.replace(/\s+/g, ' ');
  };

  const handle = (e, alfanumericoFunc) => {
    let newValue = eliminarEspacios(e.target.value);
    if (alfanumericoFunc(newValue)) {
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
              <label htmlFor="titulo_lista">Título del álbum *</label>
              <input autoFocus required
                type="text"
                className="validar"
                id="titulo_lista"
                name="titulo_lista"
                placeholder="Escriba el título del álbum"
                onChange={(e) => { handle(e, alfanumerico); }}
                onBlur={(e) => { e.target.value = e.target.value.trim(); }}
              />
            </div>
          </div>

          <div className="campo">
            <div className="input-box">
              <label htmlFor="artista">Artista *</label>
              <input required
                type="text"
                className="validar"
                id="artista"
                name="artista"
                placeholder="Escriba el nombre del artista"
                onChange={(e) => { handle(e, alfanumerico); }}
                onBlur={(e) => { e.target.value = e.target.value.trim(); }}
              />
            </div>
          </div>

          <div className="campo">
            <div className="input-box">
              <label htmlFor="colaborador">Artista colaborador</label>
              <input
                type="text"
                className="validarNoRequiered"
                id="colaborador"
                name="colaborador"

                placeholder="Escriba el nombre del artista colaborador"
                onChange={(e) => {
                  if (e.target.value.length > 0 && e.target.value.length < 21) {
                    e.target.classList.remove('active'); e.target.classList.add('valid');
                  }
                  handle(e, alfanumerico);
                }}
                onBlur={(e) => {
                  e.target.value = e.target.value.trim();
                  if (e.target.value.length < 1) {
                    e.target.classList.remove('active'); e.target.classList.remove('valid');
                  }
                }}
              />
            </div>
          </div>

          {/* SELECCIONAR ARCHIVO */}
          <div className="campo campo-cargar-cancion">
            <div className="input-box">
              <label>Portada del álbum *</label>
              <div className="seleccionarArchivo">
                <span className="nombreArchivo" id="nombreArchivo"></span> {/* Mostrar nombre del archivo */}
                <input
                  type="file"
                  name="archivo"
                  id="archivo"
                  accept=".png, .jpg, .jpeg"
                  style={{ display: 'none' }}
                  onChange={mostrarNombreArchivo}
                />
                <input
                  type="button"
                  className="btn-subir bg-white"
                  onClick={() => { document.getElementById('archivo').click(); }}
                  value="Seleccionar imagen"
                />
              </div>
            </div>
          </div>

          <div className="campo">
            <div className="btn-box">
              <button type="submit" className="btn-next" disabled={!botonHabilitado}>Aceptar</button>
              <Link to="/"><button to="/" className="custom-link">Cancelar</button></Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CrearLista;
