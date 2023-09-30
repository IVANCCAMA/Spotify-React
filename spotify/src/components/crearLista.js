import React, { useState, useEffect, useRef } from 'react';
import './crearLista.css';

function CrearLista() {
  const [titulo, setTitulo] = useState('');
  const [artista, setArtista] = useState('');
  const tituloInputRef = useRef(null);

  useEffect(() => {
    // Enfocar en la entrada de "Título del álbum" al cargar la página
    if (tituloInputRef.current) {
      tituloInputRef.current.focus();
    }
  }, []);

  const handleTituloChange = (event) => {
    const valor = event.target.value;
    if (/^[a-zA-Z0-9]*$/.test(valor) && valor.length <= 20) {
      setTitulo(valor);
    }
  };

  const handleArtistaChange = (event) => {
    const valor = event.target.value;
    if (/^[a-zA-Z0-9]*$/.test(valor) && valor.length <= 20) {
      setArtista(valor);
    }
  };

  const handleSubirArchivo = () => {
    const imagen = document.getElementById('imagen');
    imagen.click();
  };

  return (
    /* Form de lista */
    <div className="modal-crear-lista">
      <form className="modal-box">
        <div className="inter-modal">
          <div className="campo">
            <div className="input-box">
              <label htmlFor="titulo">Título del álbum *</label>
              <input
                type="text"
                className="validar"
                id="titulo"
                autoFocus
                value={titulo}
                onChange={handleTituloChange}
                required
                ref={tituloInputRef}  // Referencia al input del título
              />
            </div>
          </div>

          <div className="campo">
            <div className="input-box">
              <label htmlFor="artista">Artista *</label>
              <input
                type="text"
                className="validar"
                id="artista"
                value={artista}
                onChange={handleArtistaChange}
                required
              />
            </div>
          </div>

          <div className="campo">
            <div className="input-box">
              <label htmlFor="colaboradores">Artistas colaboradores</label>
              <select id="colaboradores">
                <option value="null" selected></option>
                <option value="id">Shakira</option>
              </select>
            </div>
          </div>

          <div className="campo">
            <div className="input-box">
              <label htmlFor="portada">Portada del álbum</label>
              <input
                type="button"
                className="btn-subir bg-white"
                onClick={handleSubirArchivo}
                value="Seleccionar imagen"
              />
              <input type="file" id="imagen" style={{ display: 'none' }} />
            </div>
          </div>

          <div className="campo">
            <div className="btn-box">
              <button className="btn-next">Aceptar</button>
              <button className="btn-next">Cancelar</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CrearLista;
