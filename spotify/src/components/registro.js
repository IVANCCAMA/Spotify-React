import axios from 'axios';
import React, { useState } from 'react';
import { alfanumerico, verificarString } from './form.js';
import Form from './Form/Form.tsx';
import TextInput from './Form/TextInput.tsx';
import PasswordInput from './Form/PasswordInput.tsx';
import Select from './Form/Select.tsx';

function Registro({ showAlertModal }) {
  const database = 'https://spfisbackend-production.up.railway.app/api';
  const userTypes = ['Distribuidora musical', 'Oyente'];
  const requirements = [
    { validOption: "longitudMin", p: "La contraseña debe tener al menos 8 caracteres" },
    { validOption: "mayusculas", p: "La contraseña debe tener al menos una letra mayúscula" },
    { validOption: "minusculas", p: "La contraseña debe tener al menos una letra minúscula" },
    { validOption: "numeros", p: "La contraseña debe tener al menos un número" },
    { validOption: "specialChars", p: "La contraseña debe tener al menos un carácter especial" }
  ];

  const [username, setUsername] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [showInformation, setShowInformation] = useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(true);
  const [userType, setUserType] = useState('');

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
    if (username.length > 20 || username.length < 1 || !alfanumerico(username)) {
      setIsUsernameValid(false);
      throw new Error(`Asegúrese de que todos los campos estén llenados correctamente`);
    }
    if (password.length > 20 || password.length < 1) {
      setIsPasswordValid(false);
      throw new Error(`Asegúrese de que todos los campos estén llenados correctamente`);
    }
    if (passwordConfirmation.length > 20 || passwordConfirmation.length < 1) {
      setIsPasswordConfirmed(false);
      throw new Error(`Asegúrese de que todos los campos estén llenados correctamente`);
    }
    if (userType === 'default' || userType.length < 1) {
      throw new Error(`No se seleccionó ningún tipo de usuario`);
    }

    // nombre
    const id_usuario = await ExisteArtista(username);
    if (id_usuario != null) {
      setIsUsernameValid(false);
      throw new Error(`El nombre que deseas registrar ya está en uso, escoge otro`);
    }

    // passwprd
    for (const req of requirements) {
      if (!verificarString(password, "", req.validOption)) {
        setIsPasswordValid(false);
        throw new Error(`La contraseña no cumple con las especificaciones`);
      }
    }

    // passwordConfirm
    if (password !== passwordConfirmation) {
      setIsPasswordConfirmed(false);
      throw new Error(`La confirmacion y la contraseña no coinciden`);
    }

    // userTypes
    for (const type of userTypes) {
      if (userType === type) {
        return {
          nombre_usuario: username,
          correo_usuario: `${username.replace(/ /g, '_')}@localhost`,
          contrasenia_usuario: password,
          tipo_usuario: userType,
          fecha_nacimiento: '2020-08-03'
        };
      }
    }
    throw new Error(`No se reconoce el tipo de usuario. Intente más tarde`);
  }

  const subirBD = async (newUser) => {
    try {
      const query = `/usuarios/`;
      await axios.post(`${database}${query}`, newUser);
      return true;
    } catch (error) {
      console.error('Error al subir a la base de datos:', error);
      return false;
    }
  }

  const validarForm = async () => {
    try {
      const newUser = await validarCampos();

      const subidaExitosa = await subirBD(newUser);
      if (!subidaExitosa) {
        throw new Error(`Error al crear usuario. Intente más tarde`);
      }

      showAlertModal(`Registro creado exitosamente`, "/iniciarsesion");
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      showAlertModal(error.message);
    }
  };

  const handleTextInput = (newValue) => {
    if (newValue !== ' ') {
      const value = newValue.replace(/\s+/g, ' ');
      setIsUsernameValid(alfanumerico(value));
      setUsername(value);
    }
  };

  const handlePassword = (newValue) => {
    const validRequirements = requirements.every(req =>
      verificarString(newValue, "", req.validOption));

    setPassword(newValue);
    setIsPasswordValid(validRequirements);
    setIsPasswordConfirmed(passwordConfirmation === newValue);
  }

  const handlePasswordConfirmation = (newValue) => {
    setPasswordConfirmation(newValue);
    setIsPasswordConfirmed(password === newValue);
  };

  return (
    <Form
      onSubmit={validarForm}
      requiredConnection
      showAlertModal={showAlertModal}
      onclickCancelRedirectTo='/'
    >
      <TextInput
        name='username'
        label='Nombre *'
        autoComplete='new-username'
        value={username}
        onChange={handleTextInput}
        onBlur={(newValue) => setUsername(username.trim())}
        isValid={isUsernameValid}
        placeholder='Escriba su nombre'
      />

      <PasswordInput
        name='password'
        label='Contraseña *'
        autoComplete='new-password'
        value={password}
        onChange={handlePassword}
        onFocus={() => setShowInformation(true)}
        onBlur={() => setShowInformation(false)}
        isValid={isPasswordValid}
        placeholder='Escriba su contraseña'
      >
        <div className="ventana-informacion" style={{ display: showInformation ? 'block' : 'none' }}>
          {requirements.map((req) => (
            <p key={req.validOption} className={verificarString(password, "", req.validOption) ? 'active' : ''}>{req.p}</p>
          ))}
        </div>
      </PasswordInput>

      <PasswordInput
        name='passwordConfirm'
        label='Confirmar contraseña *'
        autoComplete='new-password'
        value={passwordConfirmation}
        onChange={handlePasswordConfirmation}
        isValid={isPasswordConfirmed}
        placeholder='Confirme su contraseña'
      />

      <Select
        name='userType'
        label='Tipo de usuario *'
        placeholder='Seleccionar tipo de usuario'
        options={userTypes}
        onChange={setUserType}
      />
    </Form>
  );
};

export default Registro;
