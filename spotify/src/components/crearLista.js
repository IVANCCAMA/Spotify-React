import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { SubirPortada, deleteFile } from '../firebase/config';
import './form.css';

function CrearLista() {
  const [file, setFile] = useState(null);

  const validarCampos = (campos) => {
    if (campos.campo1 == "value1") { }
    return true;
  }

  const validarFormatoArchivo = (archivo) => {
    const formatosPermitidos = ["jpeg", "png"]; // jpeg === jpg
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
      const resultado = await SubirPortada(archivo);
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
    if (archivo.size > (5 * 1000 * 1000)) { // megas
      alert(`Tamaño máximo de 5 MB excedido.`);
      return;
    }

    try {
      // subir el archivo a Firebase
      const resultado = await SubirPortada(archivo);

      // subir en la db
      if (!subirBD(campos, resultado)) {
        // Si ocurre un error al subir en la base de datos
        // eliminar el archivo subido en Firebase
        deleteFile(resultado.filepath);
        alert(`Error al cargar la canción. Intente más tarde.`);
        return;
      }

      alert(`Lista creada exitosamente.`);
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
              <button className="btn-next">Cancelar</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CrearLista;
