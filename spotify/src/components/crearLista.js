import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { SubirPortada, storage } from '../firebase/config';
import './crearLista.css';

// BORRAME TEMPORAL
const artistas = [
  { id: 1, nombre: 'Shakira' },
  { id: 2, nombre: 'BadBuny' },
  { id: 5, nombre: 'Rey' },
  { id: 6, nombre: 'Carlos' },
  // ... Agrega más artistas según sea necesario
];


function CrearLista() {
  const [id_usuario, setId_usuario] = useState('');
  const [titulo_lista, setTitulo_lista] = useState('');
  const [path_image, setPath_image] = useState('');
  const [colaborador, setColaborador] = useState('');
  const imagenInputRef = useRef(null);
  const [imagen, setImagen] = useState(null);
  const titulo_listaInputRef = useRef(null);

  const handleCrearLista = async (event) => {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    try {
      const nuevoAlbum = {
        id_usuario,
        titulo_lista,
        colaborador,
      };

      // Subir portada y obtener informacion
        const portadaInfo = await SubirPortada(); // 'imagen' debe ser el archivo de imagen
        console.log('Información de la imagen subida:', portadaInfo);

      // Obtener la URL de la imagen subida
      const pathImagen = portadaInfo.url;

      // Agregar la URL de la imagen al objeto nuevoAlbum
      nuevoAlbum.path_image = pathImagen;

      console.log("Path recuperado de Firebase:", nuevoAlbum.path_image);

      // Enviar la solicitud POST al backend para crear el álbum
      const response = await axios.post('http://localhost:4000/api/lista_canciones/', nuevoAlbum);

      // Manejar la respuesta del backend
      console.log("titulo lista:", titulo_lista);
      console.log("id usuario:", id_usuario);
      console.log("colaborador:",colaborador);
      console.log("path de imagen:", path_image);

      console.log('Álbum creado exitosamente:', response.data);
      resetForm();
      
    } catch (error) {
      console.error('Error al crear el álbum:', error);
    }
  };

  const resetForm = () => {
    setId_usuario('');
    setColaborador('');
    setPath_image('');
    setTitulo_lista('');
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

  const handleTitulo_listaChange = (event) => {
    const valor = event.target.value;
    if (/^[a-zA-Z0-9\s]*$/.test(valor) && valor.length <= 20) {
      setTitulo_lista(valor);
    }
  };
  
  const handleArtistaChange = (event) => {
    const valorSeleccionado = event.target.value;
    setId_usuario(valorSeleccionado);
  };

  const handleColaboradorChange = (event) => {
    const valor = event.target.value;
    if (/^[a-zA-Z0-9\s]*$/.test(valor) && valor.length <= 20) {
      setColaborador(valor);
    }
  };

  const handleImagenChange = (file) => {
    setImagen(file);
  };

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
    <div className="modal-crear-lista">
      <form className="modal-box" onSubmit={handleCrearLista}>
        <div className="inter-modal">

          <div className="campo">
            <div className="input-box">
              <label htmlFor="titulo_lista">Título del álbum *</label>
              <input
                type="text"
                className="validar"
                id="titulo_lista"
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
              <select id="artista" value={id_usuario} onChange={handleArtistaChange}>
                <option value="" disabled>Selecciona un artista</option>
                {artistas.map((artista) => (
                  <option key={artista.id} value={artista.id}>
                    {artista.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="campo">
            <div className="input-box">
              <label htmlFor="colaborador">Artista colaborador *</label> {/* Artistas colaboradores */}
              <input
                type="text"
                className="validar"
                id="colaborador"
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
              <button type="submit" className="btn-next">
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
    