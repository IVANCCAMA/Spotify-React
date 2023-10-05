import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { SubirPortada, deleteFile, recuperarUrlPortada } from '../firebase/config';
import { Link } from 'react-router-dom';
import './form.css';

function CrearLista() {
  const database = 'https://backreactmusic.onrender.com/api';
  const [file, setFile] = useState(null);

  const esTituloCancionExistente = async (titulo) => {
    try {
      const query = `/lista_canciones/`;
      const response = await axios.get(`${database}${query}`);
      const listaCanciones = response.data;

      // importante atributo titulo_lista tiene que ser igual a la BD
      return listaCanciones.some((cancion) => cancion.titulo_lista === titulo);
    } catch (error) {
      alert('Error al obtener la lista de canciones:', error);
      return false;
    }
  };

  const ExisteArtista = async (nombreArtista) => {
    try {
      const query = `/usuarios/search_nom/ ?searchTerm=${nombreArtista}`;
      const response = await axios.get(`${database}${query}`);
      console.log(response.data[0].id_usuario)
      if(response.status ==200){  return response.data[0].id_usuario;}
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
      return false; // Hubo un error
    }
  }; 
  const quitarEspacios= async(titulo)=>{

    
    titulo=titulo.trim();
    while (titulo.search("  ")!=-1){
      titulo=titulo.replace("  "," ");
    }
    return titulo;
  }
  const validarCampos = async (nuevoAlbum) => {
    nuevoAlbum.titulo_lista=quitarEspacios(nuevoAlbum.titulo_listaTem);
    console.log(nuevoAlbum.titulo_lista)
    const tituloExistente = await esTituloCancionExistente(nuevoAlbum.titulo_lista);

    if (tituloExistente) {
      // MODAL
      alert('El nombre de la carpeta ya está en uso, intente otro');
      return false;
    }

    const artistaExistente = await ExisteArtista(nuevoAlbum.nombre_usuario);

    console.log(artistaExistente);
    if (!artistaExistente) {
      alert('El artista no existe, intente con otro.');
      return false;
    } 
    if(!/^[a-zA-Z0-9\s]*$/.test(nuevoAlbum.titulo_lista) // vericamos que esten con caracteres alfanumericos
      | !/^[a-zA-Z0-9\s]*$/.test(nuevoAlbum.nombre_usuario)
      | !/^[a-zA-Z0-9\s]*$/.test(nuevoAlbum.colaborador)
      | nuevoAlbum.colaborador.length>20| nuevoAlbum.colaborador.length==0
      | nuevoAlbum.titulo_lista.length>20| nuevoAlbum.titulo_lista.length==0
      | nuevoAlbum.nombre_usuario.length>20| nuevoAlbum.nombre_usuario.length==0
    ){
      return false;
    }

    nuevoAlbum.id_usuarioArtista = artistaExistente;
    return true;
  }

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
      console.log(imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('Error:', error);
    }
  }

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
  }
  const validarForm = async (e) => {
    e.preventDefault();

    // validar campos
    const nuevoAlbum = {
      titulo_listaTem: document.getElementById("titulo_lista").value,
      nombre_usuario: document.getElementById("artista").value,
      colaborador: document.getElementById("colaborador").value
    };
    
    if (!await validarCampos(nuevoAlbum)) {
      alert(`Asegúrese de que todos los campos estén llenados correctamente.`);
      return;
    }

    // validar formato del archivo
    const archivos = document.getElementById('archivo');
    if (archivos.files.length < 1) {
      alert(`Seleccione un archivo.`);
      return;
    }
    const archivo = archivos.files[0];
    console.log(archivos)
    if (!await validarFormatoArchivo(archivo)) {
      alert(`Formato de imagen no válido.`);
      return;
    }

    // validar tamanio
    if (archivo.size > (5 *1024*1024)) { // megas
      alert(`Tamaño máximo de 5 MB excedido.`);
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
        alert(`Error al cargar la canción. Intente más tarde.`);
        return;
      }
      
      await alert(`Lista creada exitosamente.`);
      window.location.replace("/inicio");
      // window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      alert(`Error al subir o procesar el archivo.`);
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
  }

  const validar = (event) => {
    const valor = event.target.value;
    if (!/^[a-zA-Z0-9\s]*$/.test(valor)) {
      event.target.classList.add('active');
    } else if (valor.length > 20) {
      event.target.value = valor.slice(0, 20);
      event.target.classList.add('active');
      alert(`Nombre debe tener entre 1 a 20 caracteres.`);
      //event.target.classList.remove('active');
    } else {
      event.target.classList.remove('active');
    }
  }

  const validarVarios = (event) => {
    const valor = event.target.value;
    if (!/^[a-zA-Z0-9\s,]*$/.test(valor)) {
      event.target.classList.add('active');
    }else if (/^[a-zA-Z0-9\s]*$/.test(valor)) {
      event.target.classList.remove('active');
    } else if (/,+[\s]*$/.test(valor)) {
      event.target.classList.add('active');
    } else if (/[,a-zA-Z0-9\s]*$/.test(valor)) {
      event.target.classList.remove('active');
    } else {
      event.target.classList.add('active');
      
    }
    if (valor.length > 20) {
      event.target.value = valor.slice(0, 20);
      event.target.classList.add('active');
      alert(`Nombre debe tener entre 1 a 20 caracteres.`);
      //event.target.classList.remove('active');
    }
  }

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
                onChange={validar}
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
                onChange={validar}
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
              <button type="submit" className="btn-next">
                Aceptar
              </button>
              <Link to="/Albumes"  ><button to="/Albumes" className="custom-link">Cancelar</button></Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CrearLista;
