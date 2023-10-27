import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { v4 } from "uuid";

const firebaseConfig = {
  apiKey: "AIzaSyACgaLJTxyd8IaRL5nm_0wnIxy4TguCBp0",
  authDomain: "reack-music.firebaseapp.com",
  projectId: "reack-music",
  storageBucket: "reack-music.appspot.com",
  messagingSenderId: "33573882667",
  appId: "1:33573882667:web:df60f1a58ff77312edd36e"

};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export async function RecuperarDuracion(file) {
  return new Promise((resolve, reject) => {
    const audio = document.createElement('audio');

    // Obtén la URL del archivo
    const fileURL = URL.createObjectURL(file);

    // Establece la fuente del elemento de audio con la URL del archivo
    audio.src = fileURL;

    // Escucha el evento 'loadedmetadata' para obtener la duración una vez que se haya cargado la metadata del audio
    audio.addEventListener('loadedmetadata', () => {
      // Obtén la duración en segundos
      const duracionSegundos = audio.duration;

      // Convierte a minutos con dos decimales
      const duracionMinutos = (parseInt(duracionSegundos / 60) + ":" + parseInt(duracionSegundos % 60));

      // Libera la URL creada para el archivo
      URL.revokeObjectURL(fileURL);

      // Resuelve la duración en minutos con dos decimales
      resolve(duracionMinutos);
    });

    // Escucha el evento 'error' para manejar errores
    audio.addEventListener('error', (error) => {
      console.error('Error al cargar el archivo de audio:', error);
      reject(error);
    });
  });
}

export async function RecuperarDuracionCorregido(file) {
  return new Promise((resolve, reject) => {
    const audio = document.createElement('audio');

    // Obtén la URL del archivo
    const fileURL = URL.createObjectURL(file);

    // Establece la fuente del elemento de audio con la URL del archivo
    audio.src = fileURL;

    // Escucha el evento 'loadedmetadata' para obtener la duración una vez que se haya cargado la metadata del audio
    audio.addEventListener('loadedmetadata', () => {
      // Obtén la duración en segundos
      const duracionSegundos = audio.duration;

      // Convierte a minutos y segundos con dos decimales
      const minutos = Math.floor(duracionSegundos / 60);
      const segundos = Math.floor(duracionSegundos % 60);

      // Formatea los minutos y segundos con dos dígitos
      const duracionMinutos = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

      // Libera la URL creada para el archivo
      URL.revokeObjectURL(fileURL);

      // Resuelve la duración en minutos y segundos con el formato deseado
      resolve(duracionMinutos);
    });

    // Escucha el evento 'error' para manejar errores
    audio.addEventListener('error', (error) => {
      console.error('Error al cargar el archivo de audio:', error);
      reject(error);
    });
  });
}

export async function SubirPortada(imageUpload) {
  const imageName = `${imageUpload.name}-${v4()}`;
  const imageRef = ref(storage, `Portadas/${imageName}`);

  await uploadBytes(imageRef, imageUpload);
  return imageName;
}

export function recuperarUrlPortada(imageName) {
  const imageRef = ref(storage, `Portadas/${imageName}`);
  return getDownloadURL(imageRef);
}

export async function SubirCancion(cancionUpload) {
  const cancionName = `${cancionUpload.name}-${v4()}`;
  const cancionRef = ref(storage, `Canciones/${cancionName}`);

  await uploadBytes(cancionRef, cancionUpload);
  return cancionName;
}

export function recuperarUrlCancion(cancionName) {
  const cancionRef = ref(storage, `Canciones/${cancionName}`);
  return getDownloadURL(cancionRef);
}

async function updateFile(file, filepath) {
  const storagePortadaRef = ref(storage, filepath);
  try {
    await uploadBytes(storagePortadaRef, file);
    const url = await getDownloadURL(storagePortadaRef);
    return {
      filepath: filepath,
      url: url,
    };
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    throw error;
  }
}

export function deleteFile(filepath) {
  const storageArchivoRef = ref(storage, filepath);
  deleteObject(storageArchivoRef).then(() => {
    alert('Archivo eliminado exitosamente.');
  }).catch((error) => {
    console.error('Error al eliminar el archivo:', error);
  });
}
