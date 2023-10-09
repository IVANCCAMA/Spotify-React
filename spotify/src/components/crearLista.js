import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SubirPortada, deleteFile, recuperarUrlPortada } from '../firebase/config';
import { alfanumerico, alfanumericoVarios } from './form.js';
import './form.css';
import Alerta from './alerta';

function CrearLista() {
  const database = 'https://spfisbackend-production.up.railway.app/api';
  const [botonHabilitado, setBotonHabilitado] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  useEffect(() => { mostrarNombreArchivo(); }, [botonHabilitado, isModalOpen, modalMessage]);
  
  const [redirectTo, setRedirectTo] = useState(null);

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
      setModalMessage('El artista no existe, intente con otro.');
      setIsModalOpen(true);
      return null;
    }

    // titulo
    const albumes = await getlistasbyid_user(id_usuario);
    const albumExistente = albumes.find((album) => album.titulo_lista === campos.titulo);
    if (albumExistente) {
      document.getElementById('titulo_lista').classList.add('active');
      setModalMessage('El nombre de la carpeta ya está en uso, intente otro.');
      setIsModalOpen(true);
      return null;
    }

    // colaborador
    if (campos.colaborador.length > 0) {
      const id_colaborador = await ExisteArtista(campos.colaborador);
      if (id_colaborador == null) {
        document.getElementById('colaborador').classList.add('active');
        setModalMessage('El artista colaborador no existe, intente con otro.');
        setIsModalOpen(true);
        return null;
      } else if (id_colaborador == id_usuario) {
        document.getElementById('colaborador').classList.add('active');
        setModalMessage('El artista y el colaborador no pueden ser el mismo.');
        setIsModalOpen(true);
        return null;
      }
    }
    // const colaboradores = campos.colaborador.split(',');
    // const mismoArtista = colaboradores.some((parte) => parte.trim() === campos.artista);
    // if (mismoArtista) {
    //   console.log("no puede ser el mismo artista que el colaborador");
    //   return null;
    // }
    // // verificar que exista el colaborador
    // const id_colaboradores = [];
    // for (const artista of colaboradores) {
    //   const id_colaborador = await ExisteArtista(artista.trim());
    //   if (id_colaborador === null) {
    //     console.log("<" + artista.trim() + "> no esta registrado como artista");
    //     return null;
    //   } else {
    //     console.log("<" + artista.trim() + "> id: " + id_colaborador);
    //     id_colaboradores.push(id_colaborador);
    //   }
    // }
    // // registrat colaboradores 
    // let colaborador = "";
    // for (const artista of colaboradores) {
    //   colaborador = colaborador + ", " + artista.trim();
    // }
    // if (colaborador.length > 2) {
    //   colaborador = colaborador.slice(2);
    // }

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
      // const query = `/lista_canciones/createlist`;
      const response = await axios.post(`${database}${query}`, nuevoAlbum);
      return true;
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
      return false;
    }
  };

  const validarForm = async (e) => {
    // Deshabilitar el botón
    setBotonHabilitado(false);
    try {
      e.preventDefault();

      const campos = {
        titulo: eliminarEspacios(document.getElementById('titulo_lista').value).trim(),
        artista: eliminarEspacios(document.getElementById('artista').value).trim(),
        colaborador: eliminarEspacios(document.getElementById('colaborador').value).trim(),
        archivo: document.getElementById('archivo').files
      };

      const nuevoAlbum = await validarCampos(campos);
      if (nuevoAlbum === null) {
        setModalMessage(`Asegúrese de que todos los campos estén llenados correctamente`);
        setIsModalOpen(true);
        return;
      }

      const archivo = campos.archivo[0];
      if (!await validarFormatoArchivo(archivo)) {
        setModalMessage(`Formato de archivo no válido`);
        setIsModalOpen(true);
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 15 MB en bytes
      if (archivo.size > maxSize) {
        setModalMessage(`Tamaño máximo de 5 MB excedido`);
        setIsModalOpen(true);
        return;
      }

      try {
        const resultado = await subirFirebase(archivo);
        nuevoAlbum.path_image = resultado.url;

        const subidaExitosa = await subirBD(nuevoAlbum);
        if (!subidaExitosa) {
          deleteFile(resultado.filePath);
          setModalMessage(`Error al cargar la canción. Intente más tarde.`);
          setIsModalOpen(true);
          return;
        }

        setModalMessage(`Lista creada exitosamente`);
        setIsModalOpen(true);
        setRedirectTo("/inicio");
        
        
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
      <Alerta
        isOpen={isModalOpen}
        mensaje={modalMessage}
        onClose={handleCloseAndRedirect}
      />   
    </div>
  );
}

export default CrearLista;
