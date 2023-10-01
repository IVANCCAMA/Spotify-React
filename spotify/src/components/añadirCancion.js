import React from 'react';
import { useState } from 'react';
import { SubirCancion, deleteFile } from '../firebase/config';
import './añadirCancion.css'

const validarCampos = (campos) => {
  if (campos.campo1 == "value1") {}
  return true;
}

const validarFormatoArchivo = (archivo) => {
  const formatosPermitidos = ["mpeg", "wav"]; // mpeg === mp3
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

const ValidarForm = async (e) => {
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

  try {
    // subir el archivo a Firebase
    const resultado = await SubirCancion(archivo);
    alert(`Archivo subido correctamente.`);

    // subir en la db
    if (subirBD(campos, resultado)) {
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

function AñadirCancion() {
  const [file, setFile] = useState(null);

  // const handleSubirArchivo = () => {
  //   const imagen = document.getElementById('archivo');
  //   imagen.click(); 

  
  // };

  const handleSubirArchivo = () => {
    const imagenInput = document.getElementById('archivo');

    imagenInput.addEventListener('change', () => {
      if (imagenInput.files && imagenInput.files.length > 0) {
        const nombreArchivo = imagenInput.files[0].name;
        imagenInput.nextElementSibling.innerText = nombreArchivo; // Actualizar el texto mostrado
      } else {
        imagenInput.nextElementSibling.innerText = 'Seleccionar imagen'; // Restaurar el texto original
      }
    });

    imagenInput.click();
  };  
  return (
    <div className="modal-añadir-cancion">
      <form className="modal-box" onSubmit={ValidarForm}>
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

          <div className="campo">
            <div className="input-box">
              <label htmlFor="imagen" className="">Canción</label>
              {/* <input type="file" className="w-full" name="archivo" id="archivo" onChange={e => SubirCancion(e.target.files[0])}/> */}
              {/* accept="image/jpeg, image/png" */}
              <input 
                type="button"
                className="bnt-subir bg-white"
                onClick={handleSubirArchivo}
                value="Seleccionar audio"
              />
              <input
                 type="file" 
                 className="" 
                 name="archivo" 
                 id="archivo" 
                 accept=".mp3, audio/wav" 
                 style={{display: 'none'}}
                   />
              <span id="nombreAudio">Seleccionar audio</span>
            </div>
          </div>

          {/* SELECCIONAR ARCHIVO */}
          <div className="campo">
            <div className="input-box">
              <label htmlFor="portada">Portada del álbum</label>
              <input
                type="button"
                className="btn-subir bg-white"
                onClick={handleSubirArchivo}
                value="Seleccionar imagen"
              />
              <input 
                type="file" 
                id="imagen" 
                style={{ display: 'none' }} 
                accept=".png, .jpg, .jpeg"
              />
              <span id="nombreArchivo">Seleccionar imagen</span> {/* Mostrar nombre del archivo */}
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

