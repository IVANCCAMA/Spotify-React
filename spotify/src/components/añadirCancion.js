import React from 'react';
import { useState } from 'react';
import { SubirCancion, deleteFile } from '../firebase/config';
import { Switch, Router, Link} from 'react-router-dom'
import './form.css'

const validarCampos = (campos) => {
  if (campos.campo1 == "value1") { }
  return true;
}


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
    const resultado = await SubirCancion(archivo);
    return resultado;
  } catch (error) {
    console.error('Error:', error);
  }
}

const subirBD = (archivo, url) => {
  // code
  return true;
}

const validarForm = async (e) => {
  e.preventDefault();

  // validar campos
  const campos = {
    campo1: "value1",
    campo2: "value2"
  };

  if (!validarCampos(campos)) {
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

  if (!validarFormatoArchivo(archivo)) {
    alert(`Formato de imagen no válido.`);
    return;
  }

  // validar tamanio
  if (archivo.size > (15 * 1000 * 1000)) { // megas
    alert(`Tamaño máximo de 15 MB excedido.`);
    return;
  }

  try {
    // subir el archivo a Firebase
    const resultado = await SubirCancion(archivo);

    // subir en la db
    if (!subirBD(campos, resultado)) {
      // Si ocurre un error al subir en la base de datos
      // eliminar el archivo subido en Firebase
      deleteFile(resultado.filepath);
      alert(`Error al cargar la canción. Intente más tarde.`);
      return;
    }
    alert(`Lista creada exitosamente.`);

    // Ventana para confirmar la subida

    window.location.reload();
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
};

const validar = (event) => {
  const valor = event.target.value;
  if (!/^[a-zA-Z0-9\s]*$/.test(valor)) {
    event.target.classList.add('active');
  } else if (valor.length >= 19) {
    event.target.classList.add('active');
    alert(`Nombre debe tener entre 1 a 20 caracteres.`);
    valor.value=valor.value+
    "samuel";
  }else{
    event.target.classList.remove('active');
    
  }
};

function AñadirCancion() {
  const [file, setFile] = useState(null);

  return (
    <div className="modal-form">
      <form className="modal-box" id="form" onSubmit={validarForm}>
        <div className="inter-modal">
          <div className="campo">
            <div className="input-box">
              <label htmlFor="titulo">Título de la canción *</label>
              <input autoFocus required
                type="text"
                className="validar alfanumerico"
                name="titulo"
                placeholder="Escriba el título del álbum"
                onChange={validar}
              />
            </div>
          </div>

          <div className="campo">
            <div className="input-box">
              <label htmlFor="titulo">Nombre de artista *</label>
              <input required
                type="text"
                className="validar"
                name="artista"
                placeholder="Escriba el nombre del artista"
                onChange={validar}
              />
            </div>
          </div>

          <div className="campo">
            <div className="input-box">
              <label htmlFor="ambum">Álbum *</label>
              <select name="album" required>
                <option disabled selected hidden>Ingrece el nombre del artista</option>
                {/* agregar dinamicamente la listas del artista recuperdas de la db */}
                <option value="id_list">name_list</option>
              </select>
            </div>
          </div>

          <div className="campo">
            <div className="input-box">
              <label htmlFro="genero">Género musical *</label>
              <select name="genero" required>
                <option value="id">Pop</option>
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
              <button type="button" className="btn-next">Cancelar</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AñadirCancion;
