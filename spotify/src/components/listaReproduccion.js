import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SubirPortada, deleteFile, recuperarUrlPortada } from '../firebase/config';
import { alfanumerico } from './form.js';
import './form.css';

function CrearListaReproduccion({ setIsModalOpen, setModalMessage, setRedirectTo }) {
  const database = 'https://spfisbackend-production.up.railway.app/api';
  const [botonHabilitado, setBotonHabilitado] = useState(true);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine); // Verifica si hay conexión inicialmente

  const handleOnlineStatusChange = () => {
    setIsOnline(window.navigator.onLine);
  };

  useEffect(() => {
    mostrarNombreArchivo();
  }, [botonHabilitado, setIsModalOpen, setModalMessage]);

  useEffect(() => {
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  const validarCampos = async (campos) => {
    if (campos.titulo.length > 20 || campos.titulo.length < 1 || !alfanumerico(campos.titulo)) {
      document.getElementById('titulo_lista').classList.add('active');
      return null;
    }
    if (campos.archivo.length < 1) {
      console.log("No se selecciono archivo");
      return null;
    }
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
      await axios.post(`${database}${query}`, nuevoAlbum);
      return true;
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
      return false;
    }
  };

  const validarForm = async (e) => {
    setBotonHabilitado(false);
    try {
      if (isOnline) {
        e.preventDefault();

        const campos = {
          titulo: eliminarEspacios(document.getElementById('titulo_lista').value).trim(),
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
            e.preventDefault();
            setModalMessage(`Error al cargar la imágen. Intente más tarde`);
            setIsModalOpen(true);
            return;
          }
          setModalMessage(`Lista creada exitosamente`);
          setIsModalOpen(true);
          setRedirectTo("/");

        } catch (error) {
          console.error('Error:', error);
          setModalMessage(`Error al subir o procesar el archivo`);
          setIsModalOpen(true);
        }
      } else {
        e.preventDefault();
        setModalMessage('Hubo un error al crear la carpeta, Intenta nuevamente');
        setIsModalOpen(true);
      }
    } catch (error) {
      e.preventDefault();
      setModalMessage('Hubo un error al crear la lista, Intenta nuevamente');
      setIsModalOpen(true);
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
          <div className="form-title">
            <span>Crear lista</span>
          </div>
          
          <div className="campo">
            <div className="input-box">
              <label htmlFor="titulo_lista">Nombre de la lista *</label>
              <input autoFocus required
                type="text"
                className="validar"
                id="titulo_lista"
                name="titulo_lista"
                placeholder="Escriba el nombre de la lista"
                onChange={(e) => { handle(e, alfanumerico); }}
                onBlur={(e) => { e.target.value = e.target.value.trim(); }}
              />
            </div>
          </div>

          {/* SELECCIONAR ARCHIVO */}
          <div className="campo campo-cargar-cancion">
            <div className="input-box">
              <label>Portada de la lista</label>
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
    </div>
  );
}

export default CrearListaReproduccion;
