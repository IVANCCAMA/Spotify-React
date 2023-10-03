// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { v4 } from "uuid";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCs6pP0fGf6I_OdTcXjkZh7LxMoHx6Wqc",
  authDomain: "spotify-lite-2bd06.firebaseapp.com",
  projectId: "spotify-lite-2bd06",
  storageBucket: "spotify-lite-2bd06.appspot.com",
  messagingSenderId: "581134679882",
  appId: "1:581134679882:web:0c2e6c62a82a93ef130bb3",
  measurementId: "G-XDY2S2CBPC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

function NombrarCancion(file) {
  // Como se manejaran los nombres?
  // name unicas
  return "Canciones/" + v4();
}

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
      const duracionMinutos = (duracionSegundos / 60).toFixed(2);
      
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



export function SubirPortada(imageUpload) {
  const imageName = `${imageUpload.name}-${v4()}`;
  const imageRef = ref(storage, `Portadas/${imageName}`);
  
    return uploadBytes(imageRef, imageUpload).then(() => {
      console.log("imagen subida a firebase exitosamente");
      return imageName; // Retorna el nombre único de la imagen
    });
}

export function recuperarUrl(imageName){
  const imageRef = ref(storage, `Portadas/${imageName}`);
  return getDownloadURL(imageRef);
}

export function SubirCancion(cancionUpload) {
  const cancionName = `${cancionUpload.name}-${v4()}`;
  const cancionRef = ref(storage, `Canciones/${cancionName}`);
  
    return uploadBytes(cancionRef, cancionUpload).then(() => {
      console.log("cancion subida a firebase exitosamente");
      return cancionName; // Retorna el nombre único de la imagen
    });
}

export function recuperarUrlCancion(cancionName){
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
    })
    .catch((error) => {
      console.error('Error al eliminar el archivo:', error);
    });
}
