import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { SubirPortada, recuperarUrl } from '../firebase/config';
import './form.css';


/* // BORRAME TEMPORAL
const artistas = [
  { id: 1, nombre: 'Shakira' },
  { id: 2, nombre: 'BadBuny' },
  { id: 5, nombre: 'Rey' },
  { id: 6, nombre: 'Carlos' },
  // ... Agrega más artistas según sea necesario
]; */

function CrearLista() {
  const [id_usuario, setId_usuario] = useState('');
  const [nombreArtista, setNombreArtista] = useState('');
  const [titulo_lista, setTitulo_lista] = useState('');
  const [path_image, setPath_image] = useState('');
  const [colaborador, setColaborador] = useState('');
  const imagenInputRef = useRef(null);
  const titulo_listaInputRef = useRef(null);
  const [imageUpload, setImageUpload] = useState(null);

  const handleCrearLista = async (event) => {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    try {
      const nuevoAlbum = {
        titulo_lista,
        nombreArtista,
        id_usuario,
        colaborador,
      };

      // Verificar si el título de la lista ya existe
      const tituloExistente = await esTituloCancionExistente(titulo_lista);
      // Colocar MODAL ERROR
      if (tituloExistente) {
        alert('El título de la lista ya existe. Por favor, elige otro título.');
        return;
      }

      // Verificar si nombre artista existe
      const artistaExistente = await ExisteArtista(nombreArtista);
      // Colocar MODAL ERROR (opcional)
      if (!artistaExistente) {
        alert('El artista no exite, intente con otro.');
        return;
      }
      alert(nombreArtista);

      /* Subir portada a Firebase */
      const portadaInfo = await SubirPortada(imageUpload); // 'imagen' debe ser el archivo de imagen
      console.log('Información de la imagen subida:', portadaInfo); 
      /* Recupera url generada por Firebase */
      const imageUrl = await recuperarUrl(portadaInfo);
      console.log("URL de la imagen en Firebase:", imageUrl);

      // Obtener la URL de la imagen subida   
      const pathImagen = imageUrl;

      // Agregar la URL de la imagen al objeto nuevoAlbum
      nuevoAlbum.path_image = pathImagen;

      console.log("Path recuperado de Firebase:", nuevoAlbum.path_image);

      // Enviar la solicitud POST al backend para crear el álbum
      const response = await axios.post('http://localhost:4000/api/lista_canciones/', nuevoAlbum);

      // Manejar la respuesta del backend
      console.log("titulo lista:", titulo_lista);
      console.log("id usuario:", id_usuario);
      console.log("id usuario:", nombreArtista);
      console.log("colaborador:",colaborador);
      console.log("path de imagen:", path_image);

      console.log('Álbum creado exitosamente:', response.data);
      resetForm();
      
    } catch (error) {
      console.error('Error al crear el álbum:', error);
    }
  };
  
  

  const resetForm = () => {
    setTitulo_lista('');
    setId_usuario('');
    setNombreArtista('');
    setColaborador('');
    setPath_image('');
    // Limpiar el input de imagen
    if (imagenInputRef.current) {
      imagenInputRef.current.value = ''; 
      imagenInputRef.current.nextElementSibling.innerText = 'Seleccionar imagen';
    }
  };

  useEffect(() => {
    // Enfocar en la entrada de "Título del álbum" al cargar la página
    if (titulo_listaInputRef.current) {
      titulo_listaInputRef.current.focus();
    }
  }, []);

  const handleTitulo_listaChange = async (event) => {
    const valor = event.target.value;
    if (/^[a-zA-Z0-9\s]*$/.test(valor) && valor.length <= 20) {
        setTitulo_lista(valor);
    }
  };
  

  const esTituloCancionExistente = async (titulo) => {
    try {
      const response = await axios.get('http://localhost:4000/api/lista_canciones/');
      const listaCanciones = response.data;

      // importante atributo titulo_lista tiene que ser igual a la BD
      return listaCanciones.some((cancion) => cancion.titulo_lista === titulo);
    } catch (error) {
      alert('Error al obtener la lista de canciones:', error);
      return false;
    }
  };
  
  const handleArtistaChange = (event) => {
    const valor = event.target.value;
    if (/^[a-zA-Z0-9\s]*$/.test(valor) && valor.length <= 20) {
      setNombreArtista(valor);
    }
  };

  const ExisteArtista = async (nombreArtista) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/usuarios/search/ ?searchTerm=${nombreArtista}`);
      const listaArtistas = response.data;
      
      // importante atributo nombre_usuario tiene que ser igual a la BD
      // Verifica si el nombre del artista existe
      const artistaEncontrado = listaArtistas.find((artista) => artista.nombre_usuario === nombreArtista);
      if (artistaEncontrado) {
        // Si encontramos el artista, establecemos su ID en el estado
        setId_usuario(artistaEncontrado.id_usuario);
        return true; // El artista existe
      } else {
        return false; // El artista no existe
      }
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
      return false; // Hubo un error
    }
  }; 

  const handleColaboradorChange = (event) => {
    const valor = event.target.value;
    if (/^[a-zA-Z0-9\s]*$/.test(valor) && valor.length <= 20) {
      setColaborador(valor);
    }
  };


  /* Subir archivo a BD */
  const handleSubirArchivo = () => {
    // Accede a la referencia del input
    const imagenInput = imagenInputRef.current;

    imagenInput.addEventListener('change', () => {
      const file = imagenInput.files[0];

      if (file) {
        const maxSize = 5 * 1024 * 1024; // 5 MB en bytes

        if (file.size > maxSize) {
          // Mostrar un mensaje de error
          alert('El tamaño del archivo no puede exceder 5 MB.');
          imagenInput.value = ''; // Limpiar el input para permitir seleccionar otro archivo
          imagenInput.nextElementSibling.innerText = 'Seleccionar imagen';
          return;
        }

        const nombreArchivo = file.name;
        imagenInput.nextElementSibling.innerText = nombreArchivo; // Actualizar el texto mostrado
        setPath_image(nombreArchivo);
        console.log(nombreArchivo);
      } else {
        imagenInput.nextElementSibling.innerText = 'Seleccionar imagen'; // Restaurar el texto original
      }
    });

    imagenInput.click();
  };

  return (
    /* Form de álbum */
    <div className="modal-form">
      <form className="modal-box" id="form" onSubmit={handleCrearLista}>
        <div className="inter-modal">

          <div className="campo">
            <div className="input-box">
              <label htmlFor="titulo_lista">Título del álbum *</label>
              <input
                type="text"
                className="validar"
                id="titulo_lista"
                placeholder='Escriba el título del álbum'
                autoFocus
                value={titulo_lista}
                onChange={handleTitulo_listaChange}
                required
                ref={titulo_listaInputRef} // Referencia al input del título
              />
            </div>
          </div>

          {/* ARREGLAR, ENVIAR ID DE ARTISTA EN VALUE, RECUPERAR DESDE BACKEND */}
          <div className="campo">
            <div className="input-box">
              <label htmlFor="artista">Artista *</label>
              {/* <select id="artista" value={id_usuario} onChange={handleArtistaChange}>
                <option value="" disabled>Selecciona un artista</option>
                {artistas.map((artista) => (
                  <option key={artista.id} value={artista.id}>
                    {artista.nombre}
                  </option>
                ))}
              </select> */}
              <input
                type="text"
                className="validar"
                id="artista"
                placeholder='Escriba el nombre del artista'
                autoFocus
                value={nombreArtista}
                onChange={handleArtistaChange}
                required
              />
            </div>
          </div>

          <div className="campo">
            <div className="input-box">
              <label htmlFor="colaborador">Artistas colaboradores</label> {/* Artistas colaboradores */}
              <input
                type="text"
                className="validar"
                id="colaborador"
                placeholder='Escriba el nombre del colaborador'
                autoFocus
                value={colaborador}
                onChange={handleColaboradorChange}
                required
              />
            </div>
          </div>
          {/* SELECCIONAR ARCHIVO */}
          <div className="campo campo-cargar-cancion">
            <div className="input-box">
              <label htmlFor="archivo">Portada del álbum</label>
              <div className= "seleccionarArchivo">
                <span className="nombreArchivo" id="nombreArchivo">Seleccionar archivo</span> {/* Mostrar nombre del archivo */}
                <input
                  type="file"
                  id="archivo"
                  style={{ display: 'none' }}
                  accept=".png, .jpg, .jpeg"
                  onChange={(event) => {
                    setImageUpload(event.target.files[0]);
                  }}
                  ref={imagenInputRef}  
                />
                <input
                  type="button"
                  className="btn-subir bg-white"
                  onClick={handleSubirArchivo}
                  value="Seleccionar archivo"
                />
              </div>
            </div>
          </div>

          <div className="campo">
            <div className="btn-box">
              <button type="submit" className="btn-next" /* onClick={uploadFile} */>
                Aceptar
              </button>
              <button className="btn-next">Cancelar</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CrearLista;
    