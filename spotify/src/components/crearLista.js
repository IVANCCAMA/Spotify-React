import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { SubirPortada, deleteFile, recuperarUrl } from '../firebase/config';
import './form.css';

function CrearLista() {
  const [file, setFile] = useState(null);

  const esTituloCancionExistente = async (titulo) => {
    try {
      const response = await axios.get('http://localhost:4000/api/lista_canciones/');
      const listaCanciones = response.data;

      // importante atributo titulo_lista tiene que ser igual a la BD
      return listaCanciones.some((cancion) => cancion.titulo_lista === titulo);
    } catch (error) {
      alert('Error al obtener la lista de canciones:', error);
      return false;
    }
  };

  const redirigirAlbumes =()=>{
    //location.href="/Albumes"
    window.location.reload()
  };
  
  const ExisteArtista = async (nombreArtista) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/usuarios/search_nom/ ?searchTerm=${nombreArtista}`);
      const listaArtistas = response.data;
      console.log(listaArtistas.nombre_usuario);
      // importante atributo nombre_usuario tiene que ser igual a la BD
      // Verifica si el nombre del artista existe
      const artistaEncontrado = listaArtistas.find((artista) => artista.nombre_usuario === nombreArtista);
      return artistaEncontrado;
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
      return "0"; // Hubo un error
    }
  }; 

  const validarCampos = async (nuevoAlbum) => {
    const tituloExistente = await esTituloCancionExistente(nuevoAlbum.titulo_lista);

    if (tituloExistente) {
      // MODAL
      alert('El título de la lista ya existe. Por favor, elige otro título.');
      return false;
    }

    const artistaExistente = await ExisteArtista(nuevoAlbum.nombreArtista);

    if (artistaExistente) {
      alert('El artista no existe, intente con otro.');
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
      const imageUrl = await recuperarUrl(portadaInfo);
      return imageUrl;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const subirBD = async (nuevoAlbum) => {
    try {
      const response = await axios.post('http://localhost:4000/api/lista_canciones/', nuevoAlbum);
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
      titulo_lista: document.getElementById("titulo_lista").value,
      nombreArtista: document.getElementById("artista").value,
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

    if (!await validarFormatoArchivo(archivo)) {
      alert(`Formato de imagen no válido.`);
      return;
    }

    // validar tamanio
    if (archivo.size > (5 * 1000 * 1000)) { // megas
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

      alert(`Lista creada exitosamente.`);
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
      event.target.classList.add('active');
      alert(`Nombre debe tener entre 1 a 20 caracteres.`);
    } else {
      event.target.classList.remove('active');
    }
  }

  const validarVarios = (event) => {
    const valor = event.target.value;
    if (/^[a-zA-Z0-9\s]*$/.test(valor)) {
      event.target.classList.remove('active');
    } else if (/,+[\s]*$/.test(valor)) {
      event.target.classList.add('active');
    } else if (/[,a-zA-Z0-9\s]*$/.test(valor)) {
      event.target.classList.remove('active');
    } else {
      event.target.classList.add('active');
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
              <input
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
              <button type="button" onClick={redirigirAlbumes} className="b-next">Cancelar</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CrearLista;
