import React from 'react';
import { useState } from 'react';
import { SubirCancion, deleteFile } from '../firebase/config';
import './añadirCancion.css'

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
    alert(`Error en los campos.`);
    return;
  }

  // validar formato del archivo
  const archivos = document.getElementById('archivo');
  // se puede agregar varios archivos a la vez (por lote)
  const archivo = archivos.files[0];

  if (!validarFormatoArchivo(archivo)) {
    alert(`Formato del archivo no admitido.`);
    return;
  }

  // validar tamanio
  if (archivo.size > (15 * 1000 * 1000)) { // megas
    alert(`Tamanio del archivo no admitido.`);
    return;
  }

  try {
    // subir el archivo a Firebase
    const resultado = await SubirCancion(archivo);
    alert(`Archivo subido correctamente.`);

    // subir en la db
    if (!subirBD(campos, resultado)) {
      // Si ocurre un error al subir en la base de datos
      // eliminar el archivo subido en Firebase
      deleteFile(resultado.filepath);
      alert(`Archivo eliminado de Firebase.`);
      return;
    }

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

function AñadirCancion() {
  const [file, setFile] = useState(null);

  // const motrarNombreArchivo = () => {
  //   const imagen = document.getElementById('archivo');
  //   imagen.click(); 
  // };

  return (
    <div className="modal-añadir-cancion">
      <form className="modal-box" onSubmit={validarForm}>
        <div className="inter-modal">
          <div className="campo">
            <div className="input-box">
              <label htmlFor="titulo">Título de la canción *</label>
              <input type="text" className="validar" id="titulo" autoFocus required />
            </div>
          </div>

          <div className="campo">
            <div className="input-box">
              <label htmlFor="ambum">Album</label>
              <select id="album">
                <option value="null" selected></option>
                <option value="id">Album1</option>
              </select>
            </div>
          </div>

          <div className="campo">
            <div className="input-box">
              <label htmlFro="genero">Genero *</label>
              <select id="genero">
                <option value="null" selected></option>
                <option value="id">Genero1</option>
              </select>
            </div>
          </div>

          {/* SELECCIONAR ARCHIVO */}
          <div className="campo campo-cargar-cancion">
            <div className="input-box">
              <label htmlFor="archivo">Canción</label>
              <div className= "seleccionarArchivo">
                <span className="nombreArchivo" id="nombreArchivo">Seleccionar archivo</span> {/* Mostrar nombre del archivo */}
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

