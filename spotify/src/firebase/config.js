// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
const analytics = getAnalytics(app);

export const storage = getStorage(app);

function NombrarCancion(file) {
    // Como se manejaran los nombres?
    // name unicas
    return "Canciones/" + v4();
}

export async function SubirCancion(file) {
    // quisiera crear un directorio para cada cacion
    // ejm: Canciones/name/audio
    // Canciones/name/{audio, lyrics, description,...}
    return updateFile(file, NombrarCancion(file));
}

function NombrarPortada(file) {
    // Como se manejaran los nombres?
    // name unicas
    return "Portadas/" + v4();
}

export async function SubirPortada(file) {
    // quisiera crear un directorio para cada portada
    // ejm: Portadas/name/imagen
    return updateFile(file, NombrarPortada(file));
}

async function updateFile(file, filepath) {
    const storagePortadaRef = ref(storage, filepath);
    await uploadBytes(storagePortadaRef, file);
    const url = await getDownloadURL(storagePortadaRef);
    return url;
}
