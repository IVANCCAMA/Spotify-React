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

export function SubirCancion(file) {
  // quisiera crear un directorio para cada cacion
  // ejm: Canciones/name/audio
  // Canciones/name/{audio, lyrics, description,...}
  return updateFile(file, NombrarCancion(file));
}

export function SubirPortada(imageUpload) {
  const imageRef = ref(storage, `Portadas/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then(() => {
      alert("subido a firebase exitosamente")
    });
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
      console.log('Archivo eliminado exitosamente.');
    })
    .catch((error) => {
      console.error('Error al eliminar el archivo:', error);
    });
}
