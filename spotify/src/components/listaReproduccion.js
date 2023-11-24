import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { SubirPortada, deleteFile, recuperarUrlPortada } from '../firebase/config';
import { alfanumerico } from './form.js';
// import './form.css';
import Form from './Form/Form.tsx';
import TextInput from './Form/TextInput.tsx';

function CrearListaReproduccion({ showAlertModal, userConnected }) {
  const database = 'https://spfisbackend-production.up.railway.app/api';
  const [botonHabilitado, setBotonHabilitado] = useState(true);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine); // Verifica si hay conexión inicialmente

  const handleOnlineStatusChange = () => {
    setIsOnline(window.navigator.onLine);
  };

  useEffect(() => {
    mostrarNombreArchivo();
  }, [botonHabilitado, showAlertModal]);

  useEffect(() => {
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  const getlistasbyid_user = async (id_usuario) => {
    try {
      const query = `/usuarios/getlistasbyid_user/${id_usuario}`;
      const response = await axios.get(`${database}${query}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener la lista de canciones del usuario:', error);
      return null;
    }
  };

  const validarCampos = async (campos) => {
    if (campos.titulo.length > 20 || campos.titulo.length < 1 || !alfanumerico(campos.titulo)) {
      setIsValidTitle(false);
      return null;
    }
    if (campos.archivo.length < 1) {
      console.log("No se selecciono archivo");
      return null;
    }

    const albumes = await getlistasbyid_user(userConnected.id_usuario);
    const albumExistente = albumes.find((album) => album.titulo_lista === campos.titulo);
    if (albumExistente) {
      setIsValidTitle(false);
      showAlertModal('El nombre de la carpeta ya está en uso, intente otro');
      return null;
    }

    return {
      id_usuario: userConnected.id_usuario,
      titulo_lista: campos.titulo,
      path_image: ""
    };
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
          titulo: title,
          archivo: document.getElementById('archivo').files
        };

        const nuevoAlbum = await validarCampos(campos);
        if (nuevoAlbum === null) {
          showAlertModal(`Asegúrese de que todos los campos estén llenados correctamente`);
          return;
        }

        const archivo = campos.archivo[0];
        if (!await validarFormatoArchivo(archivo)) {
          showAlertModal(`Formato de archivo no válido`);
          return;
        }

        const maxSize = 5 * 1024 * 1024; // 15 MB en bytes
        if (archivo.size > maxSize) {
          showAlertModal(`Tamaño máximo de 5 MB excedido`);
          return;
        }

        try {
          const resultado = await subirFirebase(archivo);
          nuevoAlbum.path_image = resultado.url;

          const subidaExitosa = await subirBD(nuevoAlbum);
          if (!subidaExitosa) {
            deleteFile(resultado.filePath);
            e.preventDefault();
            showAlertModal(`Error al cargar la imágen. Intente más tarde`);
            return;
          }
          showAlertModal(`Lista creada exitosamente`, "/");
        } catch (error) {
          console.error('Error:', error);
          showAlertModal(`Error al subir o procesar el archivo`);
        }
      } else {
        e.preventDefault();
        showAlertModal('Hubo un error al crear la carpeta, Intenta nuevamente');
      }
    } catch (error) {
      e.preventDefault();
      showAlertModal('Hubo un error al crear la lista, Intenta nuevamente');
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

  const [title, setTitle] = useState('');
  const [isValidTitle, setIsValidTitle] = useState(false);

  const handle = (value) => {
    const newValue = eliminarEspacios(value);
    setIsValidTitle(alfanumerico(newValue));
    setTitle(newValue);
  };

  return (
    <Form
      title="Crear lista"
      onSubmit={validarForm}
      botonHabilitado={botonHabilitado} 
      >
      
      <TextInput
        name='titulo_lista'
        label='Nombre de la lista *'
        value={title}
        onChange={handle}
        isValid={isValidTitle}
        placeholder='Escriba el nombre de la lista' />

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
              accept=""
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

    </Form>
  );
}

export default CrearListaReproduccion;
