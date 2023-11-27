import axios from 'axios';
import React, { useState } from 'react';
import { RecuperarDuracionCorregido, SubirCancion, deleteFile, recuperarUrlCancion } from '../firebase/config';
import { alfanumerico } from './form.js';
import Form from './Form/Form.tsx';
import TextInput from './Form/TextInput.tsx';
import FileInput from './Form/FileInput.tsx';
import Select from './Form/Select.tsx';

function AñadirCancion({ showAlertModal }) {
  const database = 'https://spfisbackend-production.up.railway.app/api';
  const maxSize = 15 * 1024 * 1024; // 15 MB en bytes
  const formatsAllowed = ['mp3', 'mpeg', 'wav'];
  const songGenres = ['Pop', 'Rock and Roll', 'Disco', 'Country', 'Techno',
    'Reggae', 'Salsa', 'Flamenco', 'Ranchera', 'Hip hop/Rap',
    'Reggaetón', 'Metal', 'Funk', 'Bossa Nova', 'Música melódica'];

  const [songTitle, setSongTitle] = useState('');
  const [isSongTitleValid, setIsSongTitleValid] = useState(true);
  const [artistName, setArtistName] = useState('');
  const [isArtistNameValid, setIsArtistNameValid] = useState(true);
  const [artistAlbums, setArtistAlbums] = useState([]);
  const [artistAlbum, setArtistAlbum] = useState('');
  const [songGenre, setSongGenre] = useState('');
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

  const getcancionesbyid_user = async (id_usuario) => {
    try {
      const query = `/usuarios/getcancionesbyid_user/${id_usuario}`;
      const response = await axios.get(`${database}${query}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener las canciones del usuario:', error);
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

  const validarCampos = async () => {
    if (songTitle.length > 20 || songTitle.length < 1 || !alfanumerico(songTitle)) {
      setIsSongTitleValid(false);
      throw new Error(`Asegúrese de que todos los campos estén llenados correctamente`);
    }
    if (artistName.length > 20 || artistName.length < 1 || !alfanumerico(artistName)) {
      setIsArtistNameValid(false);
      throw new Error(`Asegúrese de que todos los campos estén llenados correctamente`);
    }
    if (artistAlbum === 'default' || artistAlbum.length < 1) {
      throw new Error(`No se seleccionó ningún álbum`);
    }
    if (songGenre === 'default' || songGenre.length < 1) {
      throw new Error(`No se seleccionó ningún tipo de género`);
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

    // album
    const albumes = await getlistasbyid_user(id_usuario);
    const albumesUsuario = albumes.find((album) => album.titulo_lista === artistAlbum);
    const id_lista = albumesUsuario?.id_lista;
    if (!id_lista) {
      throw new Error(`No se pudo encontrar el álbum del artista`);
    }

    // titulo   (verificamos si existe)
    const canciones = await getcancionesbyid_user(id_usuario);
    const cancionExistente = canciones.find((cancion) => cancion.nombre_cancion === songTitle);
    if (cancionExistente) {
      throw new Error(`La canción existe en el álbum`);
    }

    // archivo
    const isFileFormatAllowed = formatsAllowed.some((format) => file.type.includes(format))
    if (!isFileFormatAllowed) {
      throw new Error(`Formato de archivo no válido`);
    }
    if (file.size > maxSize) {
      throw new Error(`Tamaño máximo de 15 MB excedido`);
    }

    // genero
    for (const genre of songGenres) {
      if (songGenre === genre) {
        const recuperarDuracionAudio = await RecuperarDuracionCorregido(file);
        return {
          id_lista: id_lista,
          nombre_cancion: songTitle,
          path_cancion: "",
          duracion: "",
          genero: songGenre,
          duracion: recuperarDuracionAudio
        };
      }
    }
    throw new Error(`No se reconoce el género de la canción. Intente más tarde`);
  }

  const subirFirebase = async () => {
    try {
      const cancionInfo = await SubirCancion(file);
      const cancionUrl = await recuperarUrlCancion(cancionInfo);
      return { url: cancionUrl, filePath: cancionInfo };
    } catch (error) {
      console.error('Error:', error);
      throw new Error(`Error al cargar la canción. Intente más tarde`);
    }
  }

  const subirBD = async (nuevaCancion) => {
    try {
      const query = `/canciones/`;
      await axios.post(`${database}${query}`, nuevaCancion);
      return true;
    } catch (error) {
      console.error('Error al subir a la base de datos:', error);
      return false;
    }
  }

  const validarForm = async () => {
    try {
      const nuevaCancion = await validarCampos();

      const resultado = await subirFirebase();
      nuevaCancion.path_cancion = resultado.url;

      const subidaExitosa = await subirBD(nuevaCancion);
      if (!subidaExitosa) {
        deleteFile(resultado.filePath);
        throw new Error(`Error al subir o procesar el archivo`);
      }

      showAlertModal(`Canción añadida exitosamente`, "/");
    } catch (error) {
      showAlertModal(error.message);
    }
  };

  const handleSongTitleInput = (newValue) => {
    if (newValue !== ' ') {
      const value = newValue.replace(/\s+/g, ' ');
      setIsSongTitleValid(alfanumerico(value));
      setSongTitle(value);
    }
  };

  const handleArtistNameInput = (newValue) => {
    if (newValue !== ' ') {
      const value = newValue.replace(/\s+/g, ' ');
      setIsArtistNameValid(alfanumerico(value));
      setArtistName(value);
    }
  };

  const fetchAlbumsByArtistName = async (newValue) => {
    const value = newValue.trim();
    if (value) {
      const idArtistaEncontrado = await ExisteArtista(value);
      if (idArtistaEncontrado) {
        const listaAlbumes = await getlistasbyid_user(idArtistaEncontrado);
        const arrayTransformado = listaAlbumes.map(objeto => objeto.titulo_lista);
        setArtistAlbums(arrayTransformado);
      } else {
        setArtistAlbums([]);
      }
      setArtistName(value);
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
        name='titulo'
        label='Título de la canción *'
        value={songTitle}
        onChange={handleSongTitleInput}
        onBlur={(newValue) => setSongTitle(newValue.trim())}
        isValid={isSongTitleValid}
        placeholder='Escriba el título de la canción'
      />

      <TextInput
        name='artista'
        label='Nombre de artista *'
        value={artistName}
        onChange={handleArtistNameInput}
        onBlur={fetchAlbumsByArtistName}
        isValid={isArtistNameValid}
        placeholder='Escriba el nombre del artista'
      />

      <Select
        name='album'
        label='Álbum *'
        placeholder='Seleccionar lista'
        options={artistAlbums}
        onChange={setArtistAlbum}
      />

      <Select
        name='genero'
        label='Género musical *'
        placeholder='Seleccionar género'
        options={songGenres}
        onChange={setSongGenre}
      />

      <FileInput
        name='archivo'
        label='Seleccionar canción *'
        fileName={file?.name}
        onChange={setFile}
        accept={'.' + formatsAllowed.join(', .')}
      />
    </Form>
  );
};

export default AñadirCancion;
