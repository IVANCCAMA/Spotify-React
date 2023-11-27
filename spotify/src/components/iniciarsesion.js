import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { alfanumerico } from './form.js';
import Form from './Form/Form.tsx';
import TextInput from './Form/TextInput.tsx';
import PasswordInput from './Form/PasswordInput.tsx';

function IniciarSesion({ signOn, showAlertModal }) {
  const database = 'https://spfisbackend-production.up.railway.app/api';
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const ExisteArtista = async (nombreArtista) => {
    try {
      const query = `/usuarios/search_nom/ ?searchTerm=${nombreArtista}`;
      const response = await axios.get(`${database}${query}`);

      const artistas = response.data;
      const artistaEncontrado = artistas.find((artista) => artista.nombre_usuario === nombreArtista);

      if (artistaEncontrado && artistaEncontrado.id_usuario) {
        return artistaEncontrado;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
      return null;
    }
  };

  const validarCampos = async (campos) => {
    if (username.length > 20 || username.length < 1 || !alfanumerico(username)) {
      setIsUsernameValid(false);
      throw new Error(`Nombre de usuario o contraseña incorrectos`);
    }
    if (password.length > 20 || password.length < 8) {
      setIsPasswordValid(false);
      throw new Error(`Nombre de usuario o contraseña incorrectos`);
    }

    // username
    const id_usuario = await ExisteArtista(username);
    if (id_usuario === null) {
      setIsUsernameValid(false);
      throw new Error(`El usuario no existe, intente con otro`);
    } else if (id_usuario.tipo_usuario === "artista") {
      setIsUsernameValid(false);
      throw new Error(`El tipo de usuario no es valido`);
    }

    // password
    if (id_usuario.contrasenia_usuario !== password) {
      setIsPasswordValid(false);
      throw new Error(`Contraseña incorrecta`);
    }

    return id_usuario;
  };

  const validarForm = async () => {
    try {
      const user = await validarCampos();

      signOn(user);
      navigate('/');
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      showAlertModal(error.message);
    }
  };

  const handleUsernameInput = (newValue) => {
    if (newValue !== ' ') {
      const value = newValue.replace(/\s+/g, ' ');
      setIsUsernameValid(alfanumerico(value));
      setUsername(value);
    }
  };

  return (
    <Form
      title='Inicia sesión en React Music'
      onSubmit={validarForm}
      requiredConnection
      showAlertModal={showAlertModal}
      onClickCancelRedirectTo='/'
    >
      <TextInput
        name='username'
        label='Nombre de usuario'
        autoComplete='username'
        value={username}
        onChange={handleUsernameInput}
        onBlur={(newValue) => setUsername(newValue.trim())}
        isValid={isUsernameValid}
        placeholder='Escriba su nombre de usuario'
      /><br />

      <PasswordInput
        name='password'
        label='Contraseña'
        autoComplete='current-password'
        value={password}
        onChange={setPassword}
        isValid={isPasswordValid}
        placeholder='Escriba su contraseña'
      />
    </Form>
  );
};

export default IniciarSesion;