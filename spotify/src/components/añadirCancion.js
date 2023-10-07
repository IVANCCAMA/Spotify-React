import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { RecuperarDuracion, SubirCancion, deleteFile, recuperarUrlCancion } from '../firebase/config';
import { alfanumerico } from './form.js';
import { RecuperarDuracion, SubirCancion, deleteFile, recuperarUrlCancion } from '../firebase/config';
import './form.css'
import Alerta from './alerta';

import Alerta from './alerta';


function AñadirCancion() {
  const generos = [ 'Pop', 'Rock and Roll', 'Disco', 'Country', 'Techno', 
                    'Reggae', 'Salsa', 'Flamenco', 'Ranchera', 'Hip hop/Rap', 
                    'Reggaetón', 'Metal', 'Funk', 'Bossa Nova', 'Música melódica' ];
  /* const [file, setFile] = useState(null); */
  const [listas, setListas] = useState([]);
  useEffect(() => { mostrarNombreArchivo(); }, [listas]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [idAlbum, setidAlbum] = useState(null);
  const [generoSeleccionado, setGeneroSeleccionado] = useState('');
  const timeoutRef = useRef(null);
  let idArtistaEncontrado;

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
      console.log("todos los campos son requeridos");
      return null;
    }

    // artista
    const id_usuario = await ExisteArtista(campos.artista);
    if (id_usuario == null) {
      console.log('artista no encontrado');
      return null;
    }

    // album
    const albumesArtista = await listaAlbumesArtista(id_usuario);
    const albumesUsuario = albumesArtista.find((album) => album.titulo_lista === campos.album);
    const id_lista = albumesUsuario?.id_lista;

    if (!id_lista) {
      console.log('Álbum no encontrado');
      return null;
    }

    // titulo
    const query = `/canciones/completo_lista/${id_lista}`;
    const response = await axios.get(`${database}${query}`);
    const canciones = response.data;
    const cancionExistente = canciones.find((cancion) => cancion.nombre_cancion === campos.titulo);
    if (cancionExistente) {
      console.log('el album ya tiene una cancion con el mismo nombre');
      return null;
    }
    // verificar que el artista no tenga una cancion con el mismo nombre
    // back: dado un id_user devolver todas las canciones que tiene ese user

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
  const validarCampos = async (nuevaCancion) => {
    const tituloExistente = await esTituloCancionExistente(nuevaCancion.titulo_lista);

    if (tituloExistente) {
      // MODAL
      setModalMessage('El título de la canción ya existe. Por favor, elige otro título.');
      setIsModalOpen(true);
      return false;
    }
    return null;
  }

  const esTituloCancionExistente = async (titulo) => {
    try {
      const query = `/canciones/`;
      const response = await axios.get(`${database}${query}`);
      const canciones = response.data;
      return canciones.some((cancion) => cancion.nombre_cancion === titulo);
    } catch (error) {
      setModalMessage('Error al obtener las canciones:', error);
      setIsModalOpen(true);
      setModalMessage('Error al obtener las canciones:', error);
      setIsModalOpen(true);
      return false;
    }
  };

  const validarFormatoArchivo = (archivo) => {
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
      const CancionUrl = await recuperarUrlCancion(cancionInfo);
      return CancionUrl;
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
    e.preventDefault();
  /* VALIDAR FORM PAR ASUBIR A BD */
  const validarForm = async (e) => {
    e.preventDefault();

    const campos = {
      titulo: document.getElementById('titulo_Cancion').value,
      artista: document.getElementById('artista').value,
      album: document.getElementById('album').value,
      genero: document.getElementById('genero').value,
      archivo: document.getElementById('archivo').files
    };

    const nuevaCancion = await validarCampos(campos);
    if (nuevaCancion === null) {
      setModalMessage(`Asegúrese de que todos los campos estén llenados correctamente.`);
      setIsModalOpen(true);
      return;
    }

    const archivo = archivo.files[0];
    if (!validarFormatoArchivo(archivo)) {
      setModalMessage(`Formato de archivo no válido.`);
      setIsModalOpen(true);
      return;
    }
  // Obtener valores de los campos

    const nuevaCancion = {
      id_lista: idAlbum,
      duracion: "",
      nombre_cancion: document.getElementById("titulo_Cancion").value,
      nombreArtista: document.getElementById("artista").value,// Puedes obtener la duración del archivo si es posible
      nombreAlbum: "",
      genero: generoSeleccionado
    };

    //const generoSeleccionado = document.getElementById("generoSeleccionado").value;
    const archivos = document.getElementById('archivo').files;

    /* // Validar campos
    if (!idLista || !tituloCancion || !nombreArtista || archivos.length === 0) {
      alert(`Asegúrese de que todos los campos estén llenados correctamente.`);
      return;idLista
    } */

  // Validar formato del archivo
  if (archivos.length < 1) { return; }
  const archivo = archivos[0];
  if (!validarFormatoArchivo(archivo)) {
    setModalMessage('Formato de archivo no válido.');
    setIsModalOpen(true);
    return;
  }

    const maxSize = 15 * 1024 * 1024; // 15 MB en bytes
    if (archivo.size > maxSize) {
      setModalMessage(`Tamaño máximo de 15 MB excedido.`);
      setIsModalOpen(true);
      return;
    }
  // Validar tamaño del archivo (15 MB)
  const maxSize = 15 * 1024 * 1024; // 15 MB en bytes
  if (archivo.size > maxSize) {
    setModalMessage('Tamaño máximo de 15 MB excedido.');
    setIsModalOpen(true);
    return;
  }

    try {
      const resultado = await subirFirebase(archivo);
      nuevaCancion.path_cancion = resultado;

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
      window.location.replace("/Albumes");
    } catch (error) {
      console.error('Error:', error);
      setModalMessage(`Error al subir o procesar el archivo.`);
      setIsModalOpen(true);
    }
  };
    const subidaExitosa = await subirBD(nuevaCancion);
    
    if (!subidaExitosa) {
      // Si ocurre un error al subir en la base de datos
      // eliminar el archivo subido en Firebase
      deleteFile(resultado.filePath);
      setModalMessage('Error al cargar la canción. Intente más tarde.');
      setIsModalOpen(true);
      return;
    }
    
    setModalMessage('Canción creada exitosamente.');
    setIsModalOpen(true);
    window.location.reload();
  } catch (error) {
    console.error('Error:', error);
    setModalMessage('Error al subir o procesar el archivo.');
    setIsModalOpen(true);
  }
};


  const mostrarNombreArchivo = () => {
    const file = document.getElementById('archivo');

    if (file.files && file.files.length > 0) {
      file.previousElementSibling.innerText = file.files[0].name;
      file.previousElementSibling.style.display = 'block';
      file.nextElementSibling.value = "X";
      file.nextElementSibling.classList.add('active');
    file.addEventListener('change', () => {
      if (file.files && file.files.length > 0) {
        const nombreArchivo = file.files[0].name;
        file.previousElementSibling.innerText = nombreArchivo; // Actualizar el texto mostrado
        file.previousElementSibling.style.display = 'block';
        file.nextElementSibling.value = "X";
        file.nextElementSibling.classList.add('active');
      }
    });
    file.click();
  };

  const validar = (e) => {
    const valor  = e.target.value;
    if (!/^[a-zA-Z0-9\s,]*$/.test(valor)) {
      e.target.classList.add('active');
    }else if (/^[a-zA-Z0-9\s]*$/.test(valor)) {
      e.target.classList.remove('active');
    } else if (/,+[\s]*$/.test(valor)) {
      e.target.classList.add('active');
    } else if (/[,a-zA-Z0-9\s]*$/.test(valor)) {
      e.target.classList.remove('active');
    } else {
      e.target.classList.add('active');
    }
    if (valor.length > 20) {
      e.target.value = valor.slice(0, 20);
      e.target.classList.add('active');
      setModalMessage('Nombre debe tener entre 1 a 20 caracteres.');
      setIsModalOpen(true);
      //event.target.classList.remove('active');
    }
  };

  const cargarListas = async () => {
    const nombreArtista = document.getElementById('artista').value;
    const artista = document.getElementById('artista');
    const selectElement = document.getElementById('selectList');
  
    const nombreArtista = artista.value;
    console.log("nombre recuperado de imput",nombreArtista);
  
    if (nombreArtista.length > 0) {
      try {
        idArtistaEncontrado = await ExisteArtista(nombreArtista);
        if (idArtistaEncontrado == null) {
          setListas([]);
        } else {
          const listaAlbumes = await listaAlbumesArtista(idArtistaEncontrado);
          setListas(listaAlbumes);
        }
        
        console.log("nombre recupearadod>>><",nombreArtista);
        console.log("id de artista encontrado>>:", idArtistaEncontrado);
        if (idArtistaEncontrado === null) {
          setModalMessage('El artista no existe, intente con otro.');
          setIsModalOpen(true);
          return;
        }

        const listaAlbumes = await listaAlbumesArtista(idArtistaEncontrado);
        console.log("Lista de Albumes de usuario>>: ", listaAlbumes)
        
        // Usa la información del artista para establecer las listas
        setListas(listaAlbumes);
        console.log("Listas Albunes seteadas>>: ", listas)
        
  
        // También puedes establecer otra información del artista si es necesario
        // setIdUsuario(infoArtista.id_usuario);
  
        selectElement.selectedIndex = 0;
      } catch (error) {
        console.error('Error al verificar el artista:', error);
      }
    } else {
      setListas([]);
    }
    document.getElementById('album').selectedIndex = 0;
  };

  const listaAlbumesArtista = async (id_usuarioArtistaL) => {
    try {
      const query = `/lista_canciones/`;
      const response = await axios.get(`${database}${query}`);
      const listaCompleta = response.data;

      const albumesUsuario = listaCompleta.filter((album) => album.id_usuario === id_usuarioArtistaL);

      return albumesUsuario;
    } catch (error) {
      console.error('Error al obtener la lista de álbumes:', error);
      throw error;
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

  const eliminarEspacios = (value) => {
    if (value === " ") {
      return "";
  const handleArtistaChange = (e) => {
    const nombreArtista  = e.target.value;
    if (!/^[a-zA-Z0-9\s,]*$/.test(nombreArtista )) {
      e.target.classList.add('active');
    }else if (/^[a-zA-Z0-9\s]*$/.test(nombreArtista )) {
      e.target.classList.remove('active');
    } else if (/,+[\s]*$/.test(nombreArtista )) {
      e.target.classList.add('active');
    } else if (/[,a-zA-Z0-9\s]*$/.test(nombreArtista )) {
      e.target.classList.remove('active');
    } else {
      e.target.classList.add('active');
    }
    if (nombreArtista.length > 20) {
      e.target.value = nombreArtista.slice(0, 20);
      e.target.classList.add('active');
      setModalMessage('Nombre debe tener entre 1 a 20 caracteres.');
      setIsModalOpen(true);

      //event.target.classList.remove('active');
    }

    // Cancelar el timeout anterior si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    return value.replace(/\s+/g, ' ');

    // Establecer un nuevo timeout para llamar a cargarListas después de un momento de inactividad
    

    timeoutRef.current = setTimeout(() => {
      cargarListas(nombreArtista);
    }, 2000); // Espera 500 milisegundos (0.5 segundos) antes de llamar a cargarListas
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
  const handleGeneroChange = (event) => {
    /* setGeneroSeleccionado(event.target.value);  */
    const selectedGenero = event.target.value;
    setGeneroSeleccionado(selectedGenero);
  };

  const handleAlbumSelectChange = async (event) => {
    const selectedId = event.target.value;
    setSelectedAlbum(selectedId);
    try {
      const idAlbumEncontrado = await idArtistaAlbum(selectedId);
      setidAlbum(idAlbumEncontrado);

      if (idAlbumEncontrado === null) {
        setModalMessage('El album no existe, intente con otro.');
        setIsModalOpen(true);
        return;
      }
    } catch (error) {
      
    }
  };

  const idArtistaAlbum = async (nombreAlbum) => {
    try {
      const response = await axios.get(`https://backreactmusic.onrender.com/api/lista_canciones/`);
      
      const listasAlbumes = response.data;
  
      const idAlbumEncontrado = listasAlbumes.find((album) => album.titulo_lista === nombreAlbum);

    if (idAlbumEncontrado && idAlbumEncontrado.titulo_lista) {
      console.log('Album encontrado con, ID:', idAlbumEncontrado.id_lista);
      return idAlbumEncontrado.id_lista; // Devuelve el ID del artista si se encuentra
    }
  
      console.log('Album no encontrado');
      return null; // Devuelve null si no se encuentra el artista
    } catch (error) {
      console.error('Error al obtener la lista de Albumes:', error);
      return null; // Maneja los errores devolviendo null
    }
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
              <label htmlFor="archivo">Seleccionar canción *</label>
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
                  value="Seleccionar archivo"
                />
              </div>             
            </div>         
          </div>

          <div className="campo">
            <div className="btn-box">
              <button type="submit" className="btn-next">Aceptar</button>
              <Link to="/Inicio" className="custom-link">Cancelar</Link>
            </div>
          </div>
        </div>
      </form>

      <Alerta
        isOpen={isModalOpen}
        mensaje={modalMessage}
        onClose={() => setIsModalOpen(false)}
      />
      <Alerta 
        isOpen={isModalOpen} 
        mensaje={modalMessage} 
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
export default AñadirCancion;
