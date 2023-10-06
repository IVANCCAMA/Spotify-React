import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { SubirPortada, deleteFile, recuperarUrlPortada } from '../firebase/config';
import { Link } from 'react-router-dom';
import './form.css';
import { alfanumerico } from './form.js';
import Alerta from './alerta';

function CrearLista() {
  const database = 'https://spfisbackend-production.up.railway.app/api';
  const [file, setFile] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const esTituloCancionExistente = async (titulo) => {
    try {
      const query = `/lista_canciones/`;
      const response = await axios.get(`${database}${query}`);
      const listaCanciones = response.data;

      // importante atributo titulo_lista tiene que ser igual a la BD
      return listaCanciones.some((cancion) => cancion.titulo_lista === titulo);
    } catch (error) {
      setModalMessage('Error al obtener la lista de canciones:', error);
      setIsModalOpen(true);
      return false;
    }
  };

  const ExisteArtista = async (nombreArtista) => {
    try {
      const query = `/usuarios/search_nom/ ?searchTerm=${nombreArtista}`;
      const response = await axios.get(`${database}${query}`);
      if (response.status === 200) { return response.data[0].id_usuario; }
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
      return false; // Hubo un error
    }

  };
  const validarCampos = async (nuevoAlbum) => {



    console.log(nuevoAlbum)

    const tituloExistente = await esTituloCancionExistente(nuevoAlbum.titulo_lista);
    console.log(nuevoAlbum.titulo_lista);
    if (tituloExistente) {
      // MODAL
      setModalMessage('El nombre de la carpeta ya está en uso, intente otro.');
      setIsModalOpen(true);
      return false;
    }

    const artistaExistente = await ExisteArtista(nuevoAlbum.nombre_usuario);

    console.log(artistaExistente);
    if (!artistaExistente) {
      setModalMessage('El artista no existe, intente con otro.');
      setIsModalOpen(true);
      return false;
    }
    if (!/^[a-zA-Z0-9\s]*$/.test(nuevoAlbum.titulo_lista)
      || !/^[a-zA-Z0-9\s]*$/.test(nuevoAlbum.nombre_usuario)
      || !/^[a-zA-Z0-9\s]*$/.test(nuevoAlbum.colaborador)
      || nuevoAlbum.colaborador.length > 20 || nuevoAlbum.colaborador.length < 1
      || nuevoAlbum.titulo_lista.length > 20 || nuevoAlbum.titulo_lista.length < 1
      || nuevoAlbum.nombre_usuario.length > 20 || nuevoAlbum.nombre_usuario.length < 1
    ) {
      return false;
    }

    nuevoAlbum.id_usuarioArtista = artistaExistente;
    return true;
  };

  const validarFormatoArchivo = async (archivo) => {
    const formatosPermitidos = ["jpeg", "png"]; // jpeg === jpg
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
      return imageUrl;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const subirBD = async (nuevoAlbum) => {
    try {
      console.log(nuevoAlbum);
      const query = `/lista_canciones/createlist`;
      const response = await axios.post(`${database}${query}`, nuevoAlbum);
      console.log('Álbum creado exitosamente:', response.data);
      return true;
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
      return false; // Hubo un error
    }
  };

  const validarForm = async (e) => {
    e.preventDefault();

    const nuevoAlbum = {
      titulo_lista: document.getElementById("titulo_lista").value,
      nombre_usuario: document.getElementById("artista").value,
      colaborador: document.getElementById("colaborador").value
    };

    if (!await validarCampos(nuevoAlbum)) {
      setModalMessage(`Asegúrese de que todos los campos estén llenados correctamente.`);
      setIsModalOpen(true);
      return;
    }

    const archivos = document.getElementById('archivo');
    if (archivos.files.length < 1) {
      setModalMessage(`Seleccione un archivo.`);
      setIsModalOpen(true);
      return;
    }
    const archivo = archivos.files[0];
    if (!await validarFormatoArchivo(archivo)) {
      setModalMessage('Formato de imagen no válido.');
      setIsModalOpen(true);
      return;
    }

    // validar tamanio
    if (archivo.size > (5 * 1024 * 1024)) { // megas
      setModalMessage(`Tamaño máximo de 5 MB excedido.`);
      setIsModalOpen(true);
      return;
    }

    try {
      // subir el archivo a Firebase
      const resultado = await subirFirebase(archivo);
      nuevoAlbum.path_image = resultado;

      // subir en la db
      if (!await subirBD(nuevoAlbum)) {
        // Si ocurre un error al subir en la base de datos
        // eliminar el archivo subido en Firebase
        deleteFile(resultado.filepath);
        setModalMessage(`Error al cargar la canción. Intente más tarde.`);
        setIsModalOpen(true);
        return;
      }
      console.log(nuevoAlbum)
      setModalMessage(`Lista creada exitosamente.`);
      setIsModalOpen(true);
      window.location.replace("/inicio");
    } catch (error) {
      console.error('Error:', error);
      setModalMessage(`Error al subir o procesar el archivo.`);
      setIsModalOpen(true);
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
  
  const handle = async (e) => {
    let newValue = eliminarEspacios(e.target.value);
    if (alfanumerico(newValue)) {
      e.target.classList.remove('active');
    } else {
      e.target.classList.add('active');
    }
    if (newValue.length > 20) {
      e.target.classList.add('active');
      setModalMessage(`Nombre debe tener entre 1 a 20 caracteres.`);
      setIsModalOpen(true);
      newValue = newValue.slice(0, 20);
      e.target.classList.remove('active');
    }
    e.target.value = newValue;
  };
  const validarVarios = (event) => {
    const valor = event.target.value;
    if (!/^[a-zA-Z0-9\s,]*$/.test(valor)) {
      event.target.classList.add('active');
    } else if (/^[a-zA-Z0-9\s]*$/.test(valor)) {
      event.target.classList.remove('active');
    } else if (/,+[\s]*$/.test(valor)) {
      event.target.classList.add('active');
    } else if (/[,a-zA-Z0-9\s]*$/.test(valor)) {
      event.target.classList.remove('active');
    } else {
      event.target.classList.add('active');
    }
    if (valor.length > 20) {
      event.target.classList.add('active');
      setModalMessage(`Nombre debe tener entre 1 a 20 caracteres.`);
      setIsModalOpen(true);
      event.target.value = valor.slice(0, 20);
      event.target.classList.remove('active');
    }
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
                onChange={handle}
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
                onChange={handle}
              />
            </div>
          </div>

          <div className="campo">
            <div className="input-box">
              <label htmlFor="colaborador">Artista colaborador *</label>
              <input required
                type="text"
                className="validar"
                id="colaborador"
                name="colaborador"
                placeholder="Escriba el nombre de el/los artista/s"
                onChange={validarVarios}
              />
            </div>
          </div>

          {/* SELECCIONAR ARCHIVO */}
          <div className="campo campo-cargar-cancion">
            <div className="input-box">
              <label htmlFor="archivo">Portada del álbum</label>
              <div className="seleccionarArchivo">
                <span className="nombreArchivo" id="nombreArchivo"></span> {/* Mostrar nombre del archivo */}
                <input
                  type="file"
                  name="archivo"
                  id="archivo"
                  accept=".png, .jpg, .jpeg"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const archivos = Array.from(e.target.files);
                    const archivosFiltrados = archivos.filter(validarFormatoArchivo);

                    if (archivosFiltrados.length > 0) {
                      await setFile(archivosFiltrados);
                      mostrarNombreArchivo();
                    } else { await setFile(); }
                  }
                  }
                />
                <input
                  type="button"
                  className="btn-subir bg-white"
                  onClick={() => { document.getElementById('archivo').click(); }}
                  value="Seleccionar archivo"
                />
              </div>
            </div>
          </div>

          <div className="campo">
            <div className="btn-box">
              <button type="submit" className="btn-next">
                Aceptar
              </button>
              <Link to="/Albumes"  ><button to="/Albumes" className="custom-link">Cancelar</button></Link>
            </div>
          </div>
        </div>
      </form>

      <Alerta
        isOpen={isModalOpen}
        mensaje={modalMessage}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default CrearLista;
