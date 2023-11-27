import axios from 'axios';
import React, { useState } from 'react';
import { SubirPortada, deleteFile, recuperarUrlPortada } from '../firebase/config';
import { alfanumerico } from './form.js';
import Form from './Form/Form.tsx';
import TextInput from './Form/TextInput.tsx';
import FileInput from './Form/FileInput.tsx';
import Select from './Form/Select.tsx';

function CrearLista({ showAlertModal }) {
  const database = 'https://spfisbackend-production.up.railway.app/api';
  const maxSize = 5 * 1024 * 1024; // 15 MB en bytes
  const formatsAllowed = ['png', 'jpg', 'jpeg'];

  const [albumTitle, setAlbumTitle] = useState('');
  const [isAlbumTitleValid, setIsAlbumTitleValid] = useState(true);
  const [artistName, setArtistName] = useState('');
  const [isArtistNameValid, setIsArtistNameValid] = useState(true);
  const [collaboratorName, setCollaboratorName] = useState('');
  const [isCollaboratorNameValid, setIsCollaboratorNameValid] = useState(true);
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

  const ExisteArtista = async (nombreArtista) => {
    try {
      const query = `/usuarios/search_nom/ ?searchTerm=${nombreArtista}`;
      const response = await axios.get(`${database}${query}`);

      const artistas = response.data;
      const artistaEncontrado = artistas.find((artista) => artista.nombre_usuario === nombreArtista);

      if (artistaEncontrado && artistaEncontrado.id_usuario) {
        return artistaEncontrado.id_usuario;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
      return null;
    }
  };

  const validarCampos = async (campos) => {
    if (albumTitle.length > 20 || albumTitle.length < 1 || !alfanumerico(albumTitle)) {
      setIsAlbumTitleValid(false);
      throw new Error(`Asegúrese de que todos los campos estén llenados correctamente`);
    }
    if (artistName.length > 20 || artistName.length < 1 || !alfanumerico(artistName)) {
      setIsArtistNameValid(false);
      throw new Error(`Asegúrese de que todos los campos estén llenados correctamente`);
    }
    if (collaboratorName.length > 20 || !alfanumerico(collaboratorName)) {
      setIsCollaboratorNameValid(false);
      throw new Error(`Asegúrese de que todos los campos estén llenados correctamente`);
    }
    if (file === null) {
      throw new Error(`No se seleccionó ningún archivo`);
    }

    // artista
    const id_usuario = await ExisteArtista(artistName);
    if (id_usuario == null) {
      setIsArtistNameValid(false);
      throw new Error(`No se pudo encontrar el artista con ese nombre`);
    }

    // titulo
    const albumes = await getlistasbyid_user(id_usuario);
    const albumExistente = albumes.find((album) => album.titulo_lista === albumTitle);
    if (albumExistente) {
      setIsAlbumTitleValid(false);
      throw new Error(`El nombre de la carpeta ya está en uso, intente otro`);
    }

    // colaborador
    if (collaboratorName.length > 0) {
      const id_colaborador = await ExisteArtista(collaboratorName);
      if (id_colaborador == null) {
        setIsCollaboratorNameValid(false);
        throw new Error(`El artista colaborador no existe, intente con otro`);
      } else if (id_colaborador === id_usuario) {
        setIsCollaboratorNameValid(false);
        throw new Error(`El artista y el colaborador no pueden ser el mismo`);
      }
    }

    // archivo
    const isFileFormatAllowed = formatsAllowed.some((format) => file.type.includes(format))
    if (!isFileFormatAllowed) {
      throw new Error(`Formato de archivo no válido`);
    }
    if (file.size > maxSize) {
      throw new Error(`Tamaño máximo de 5 MB excedido`);
    }

    return {
      id_usuario: id_usuario,
      nombre_usuario: artistName,
      titulo_lista: albumTitle,
      path_image: "",
      colaborador: collaboratorName
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
      console.error('Error al obtener la lista de usuarios:', error);
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

  const handleAlbumTitleInput = (newValue) => {
    if (newValue !== ' ') {
      const value = newValue.replace(/\s+/g, ' ');
      setIsAlbumTitleValid(alfanumerico(value));
      setAlbumTitle(value);
    }
  };

  const handleArtistNameInput = (newValue) => {
    if (newValue !== ' ') {
      const value = newValue.replace(/\s+/g, ' ');
      setIsArtistNameValid(alfanumerico(value));
      setArtistName(value);
    }
  };

  const handleCollaboratorNameInput = (newValue) => {
    if (newValue !== ' ') {
      const value = newValue.replace(/\s+/g, ' ');
      setIsCollaboratorNameValid(alfanumerico(value));
      setCollaboratorName(value);
    }
  };

  return (
    <Form
      onSubmit={validarForm}
      requiredConnection
      showAlertModal={showAlertModal}
      onclickCancelRedirectTo='/'
    >
      <TextInput
        name='titulo_lista'
        label='Título del álbum *'
        value={albumTitle}
        onChange={handleAlbumTitleInput}
        onBlur={(newValue) => setAlbumTitle(newValue.trim())}
        isValid={isAlbumTitleValid}
        placeholder='Escriba el título del álbum'
      />

      <TextInput
        name='artista'
        label='Artista *'
        value={artistName}
        onChange={handleArtistNameInput}
        onBlur={(newValue) => setArtistName(newValue.trim())}
        isValid={isArtistNameValid}
        placeholder='Escriba el nombre del artista'
      />

      <TextInput
        name='colaborador'
        label='Artista colaborador'
        value={collaboratorName}
        onChange={handleCollaboratorNameInput}
        onBlur={(newValue) => setCollaboratorName(newValue.trim())}
        isValid={isCollaboratorNameValid}
        placeholder='Escriba el nombre del artista colaborador'
      />

      <FileInput
        name='archivo'
        label='Portada del álbum *'
        fileName={file?.name}
        onChange={setFile}
        accept={'.' + formatsAllowed.join(', .')}
      />
    </Form>
  );
}

export default CrearLista;
