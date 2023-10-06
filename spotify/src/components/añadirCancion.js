import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { RecuperarDuracion, SubirCancion, deleteFile, recuperarUrlCancion } from '../firebase/config';
import './form.css'

import Alerta from './alerta';


function AñadirCancion() {
  const generos = [ 'Pop', 'Rock and Roll', 'Disco', 'Country', 'Techno', 
                    'Reggae', 'Salsa', 'Flamenco', 'Ranchera', 'Hip hop/Rap', 
                    'Reggaetón', 'Metal', 'Funk', 'Bossa Nova', 'Música melódica' ];
  /* const [file, setFile] = useState(null); */
  const [listas, setListas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [idAlbum, setidAlbum] = useState(null);
  const [generoSeleccionado, setGeneroSeleccionado] = useState('');
  const timeoutRef = useRef(null);
  let idArtistaEncontrado;

  const validarCampos = async (nuevaCancion) => {
    const tituloExistente = await esTituloCancionExistente(nuevaCancion.titulo_lista);

    if (tituloExistente) {
      // MODAL
      setModalMessage('El título de la canción ya existe. Por favor, elige otro título.');
      setIsModalOpen(true);
      return false;
    }
    return true;
  }

  const esTituloCancionExistente = async (titulo) => {
    try {
      const response = await axios.get('https://backreactmusic.onrender.com/api/canciones/');
      const canciones = response.data;

      console.log("objeto canciones>>", canciones);
      // importante atributo titulo_lista tiene que ser igual a la BD

      return canciones.some((cancion) => cancion.nombre_cancion === titulo);
    } catch (error) {
      setModalMessage('Error al obtener las canciones:', error);
      setIsModalOpen(true);
      return false;
    }
  };

  const validarFormatoArchivo = (archivo) => {
    const formatosPermitidos = ["mpeg", "wav"]; // mpeg === mp3
    console.log(archivo);
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

      console.log("url cancion >>>>", CancionUrl)
      return CancionUrl;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const subirBD = async (nuevaCancion) => {
    try {
      console.log("Datos recuperados:>>>>>> ",nuevaCancion);

      const response = await axios.post('https://backreactmusic.onrender.com/api/canciones/', nuevaCancion);
      console.log('Canción creado exitosamente:', response.data);
      return true;
    } catch (error) {
      console.error('Error al subir a la base de datos:', error);
      return false; // Hubo un error
    }
  }

  /* VALIDAR FORM PAR ASUBIR A BD */
  const validarForm = async (e) => {
    e.preventDefault();

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

  // Validar tamaño del archivo (15 MB)
  const maxSize = 15 * 1024 * 1024; // 15 MB en bytes
  if (archivo.size > maxSize) {
    setModalMessage('Tamaño máximo de 15 MB excedido.');
    setIsModalOpen(true);
    return;
  }

  try {
    // Subir el archivo a Firebase
    const resultado = await subirFirebase(archivo);
    nuevaCancion.path_cancion = resultado;
    
    // Recupera tiempo de duracion
    const recuperarDuracionAudio = await RecuperarDuracion(archivo);
    nuevaCancion.duracion = recuperarDuracionAudio
    console.log("tiempo duracion:", recuperarDuracionAudio);
    // Subir en la base de datos

    /* const recuperarIdAlbum = await RecuperarIdAlbum(); */
    

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


  const motrarNombreArchivo = () => {
    const file = document.getElementById('archivo');

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

  /* ------------- CARGAR LISTAS EN COMBOBOX --------------- */
  const cargarListas = async () => {
    const artista = document.getElementById('artista');
    const selectElement = document.getElementById('selectList');
  
    const nombreArtista = artista.value;
    console.log("nombre recuperado de imput",nombreArtista);
  
    if (nombreArtista.length > 0) {
      try {
        // Obtén la lista del artista desde la base de datos
        idArtistaEncontrado = await ExisteArtista(nombreArtista);
        
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
      selectElement.selectedIndex = 1;
    }
  };
  
  const listaAlbumesArtista = async (id_usuarioArtistaL) => {
    try {
      const response = await axios.get('https://backreactmusic.onrender.com/api/lista_canciones/');
      const listaCompleta = response.data;
  
      // Filtrar álbumes por el id_usuario
      const albumesUsuario = listaCompleta.filter((album) => album.id_usuario === id_usuarioArtistaL);
      
      return albumesUsuario;
    } catch (error) {
      console.error('Error al obtener la lista de álbumes:', error);
      throw error; // Lanza el error para que pueda ser manejado por el código que llama a esta función
    }
  };
  
  
  const ExisteArtista = async (nombreArtista) => {
    try {
      const response = await axios.get(`https://backreactmusic.onrender.com/api/usuarios/search_nom/ ?searchTerm=${nombreArtista}`);
      
      const artistas = response.data;
  
      const artistaEncontrado = artistas.find((artista) => artista.nombre_usuario === nombreArtista);

    if (artistaEncontrado && artistaEncontrado.id_usuario) {
      console.log('Artista encontrado, ID:', artistaEncontrado.id_usuario);
      return artistaEncontrado.id_usuario; // Devuelve el ID del artista si se encuentra
    }
  
      console.log('Artista no encontrado');
      return null; // Devuelve null si no se encuentra el artista
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
      return null; // Maneja los errores devolviendo null
    }
  };

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

    // Establecer un nuevo timeout para llamar a cargarListas después de un momento de inactividad
    

    timeoutRef.current = setTimeout(() => {
      cargarListas(nombreArtista);
    }, 2000); // Espera 500 milisegundos (0.5 segundos) antes de llamar a cargarListas
  };

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
              <input autoFocus 
                type="text"
                className="validar"
                id="titulo_Cancion"
                name="titulo"
                placeholder="Escriba el título de la canción"
                onChange={validar}
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
                onChange={handleArtistaChange}
              />
            </div>
          </div>

          <div className="campo">
      <div className="input-box">
        <label htmlFor="album">Álbum *</label>
        <select name="album" id='selectList'  onChange={handleAlbumSelectChange}>
          <option disabled hidden value="null">Seleccionar lista</option>
          <option disabled selected hidden value="null">Ingrese el nombre del artista</option>
          {listas.map((lista) => (
            <option key={lista.id} value={lista.id}>{lista.titulo_lista}</option>
          ))}
        </select>
      </div>
    </div>
         

          <div className="campo">
            <div className="input-box">
              <label htmlFor="genero">Género musical *</label>
              <select name="genero"  onChange={handleGeneroChange} >
                <option value="">Seleccionar género</option>
                <option value="Pop">Pop</option>
                <option value="id">Rock and Roll</option>
                <option value="id">Country</option>
                <option value="id">Disco</option>
                <option value="id">Techno</option>
                <option value="id">Reggae</option>
                <option value="id">Salsa</option>
                <option value="id">Flamenco</option>
                <option value="id">Ranchera</option>
                <option value="id">Hip hop/Rap</option>
                <option value="id">Reggaetón</option>
                <option value="id">Metal</option>
                <option value="id">Funk</option>
                <option value="id">Bossa Nova</option>
                <option value="id">Música melódica</option>
              </select>
            </div>
          </div>

          {/* SELECCIONAR ARCHIVO */}
          <div className="campo campo-cargar-cancion">
            <div className="input-box">
              <label htmlFor="archivo">Canción</label>
              <div className="seleccionarArchivo">
                <span className="nombreArchivo" id="nombreArchivo"></span> {/* Mostrar nombre del archivo */}
                <input
                  type="file"
                  name="archivo"
                  id="archivo"
                  accept=".mp3, audio/wav"
                  style={{ display: 'none' }}
                />
                <input
                  type="button"
                  className="btn-subir bg-white"
                  onClick={motrarNombreArchivo}
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
    </div>
  );
};
export default AñadirCancion;
