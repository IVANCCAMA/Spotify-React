import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { SubirPortada, deleteFile, recuperarUrlPortada } from '../firebase/config';
import { alfanumerico } from './form.js';
import Form from './Form/Form.tsx';
import TextInput from './Form/TextInput.tsx';
import FileInput from './Form/FileInput.tsx';

function CrearListaReproduccion({ showAlertModal, userConnected }) {
  const database = 'https://spfisbackend-production.up.railway.app/api';

  const maxSize = 5 * 1024 * 1024; // 5 MB en bytes
  const formatsAllowed = ['png', 'jpg', 'jpeg'];

  const [playlistTitle, setPlaylistTitle] = useState('');
  const [isPlaylistTitleVaild, setIsPlaylistTitleVaild] = useState(true);
  const [file, setFile] = useState(null);

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

  const validarCampos = async () => {
    if (playlistTitle.length > 20 || playlistTitle.length < 1 || !alfanumerico(playlistTitle)) {
      setIsPlaylistTitleVaild(false);
      throw new Error(`Asegúrese de que todos los campos estén llenados correctamente`);
    }
    if (file === null) {
      throw new Error(`No se seleccionó ningún archivo`);
    }

    const albumes = await getlistasbyid_user(userConnected.id_usuario);
    const albumExistente = albumes.find((album) => album.titulo_lista === playlistTitle);
    if (albumExistente) {
      setIsPlaylistTitleVaild(false);
      throw new Error(`El nombre de la carpeta ya está en uso, intente otro`);
    }

    const isFileFormatAllowed = formatsAllowed.some((format) => file.type.includes(format))
    if (!isFileFormatAllowed) {
      throw new Error(`Formato de archivo no válido`);
    }
    if (file.size > maxSize) {
      throw new Error(`Tamaño máximo de 5 MB excedido`);
    }

    return {
      id_usuario: userConnected.id_usuario,
      titulo_lista: playlistTitle,
      path_image: ''
    };
  };

  const subirFirebase = async () => {
    try {
      const portadaInfo = await SubirPortada(file);
      const imageUrl = await recuperarUrlPortada(portadaInfo);
      return { url: imageUrl, filePath: portadaInfo };
    } catch (error) {
      console.error('Error:', error);
      throw new Error(`Error al cargar la imágen. Intente más tarde`);
    }
  };

  const subirBD = async (nuevoAlbum) => {
    try {
      const query = `/lista_canciones/`;
      await axios.post(`${database}${query}`, nuevoAlbum);
      return true;
    } catch (error) {
      console.error('Error al subir a la base de datos:', error);
      return false;
    }
  };

  const validarForm = async () => {
    try {
      const nuevoAlbum = await validarCampos();

      const resultado = await subirFirebase();
      nuevoAlbum.path_image = resultado.url;

      const subidaExitosa = await subirBD(nuevoAlbum);
      if (!subidaExitosa) {
        deleteFile(resultado.filePath);
        throw new Error(`Error al subir o procesar el archivo`);
      }

      showAlertModal(`Lista creada exitosamente`, "/");
    } catch (error) {
      showAlertModal(error.message);
    }
  };

  const handleTextInput = (newValue) => {
    if (newValue !== ' ') {
      const value = newValue.replace(/\s+/g, ' ');
      setIsPlaylistTitleVaild(alfanumerico(value));
      setPlaylistTitle(value);
    }
  };

  return (
    <Form
      title='Crear lista'
      onSubmit={validarForm}
      requiredConnection
      showAlertModal={showAlertModal}
      onClickCancelRedirectTo='/biblioteca'
    >
      <TextInput
        name='titulo_lista'
        label='Nombre de la lista *'
        value={playlistTitle}
        onChange={handleTextInput}
        onBlur={(newValue) => setPlaylistTitle(playlistTitle.trim())}
        isValid={isPlaylistTitleVaild}
        placeholder='Escriba el nombre de la lista'
      />

      <FileInput
        name='archivo'
        label='Portada de la lista *'
        fileName={file?.name}
        onChange={setFile}
        accept={'.' + formatsAllowed.join(', .')}
      />
    </Form>
  );
}

export default CrearListaReproduccion;
