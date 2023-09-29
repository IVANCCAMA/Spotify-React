import React from 'react';
import { useState } from 'react';
import { SubirCancion, deleteFile } from '../firebase/config';

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

  // validar tamanio
  if (archivo.size > (15 * 100 * 100)) { // megas
    alert(`Tamanio del archivo no admitido.`);
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

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Crear Lista</h2>

      <form onSubmit={ValidarForm}>
        <div className="mb-4">
          <label htmlFor="imagen" className="block text-gray-700">Seleccionar archivo con los formatos: mp3 o wav.</label>
          {/* <input type="file" className="w-full" name="archivo" id="archivo" onChange={e => SubirCancion(e.target.files[0])}/> */}
          {/* accept="image/jpeg, image/png" */}
          <input type="file" className="w-full" name="archivo" id="archivo" accept=".mp3, audio/wav" onChange={e => setFile(e.target.files[0])} />
        </div>

        <div className="flex justify-between">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Aceptar</button>
          <button type="button" className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md">Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default AñadirCancion;

