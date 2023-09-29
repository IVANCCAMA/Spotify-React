  import React from 'react';
  import './crearLista.css'
  
  function CrearLista() {

    // Form de lista 
  const entradas = document.querySelectorAll('.validar');

  entradas.forEach(function (entrada) {
      entrada.addEventListener('input', function(event) {
          const valor = event.target.value;
          
          const alfanumerico = /^[a-zA-Z0-9]*$/;
          if (!alfanumerico.test(valor)) {
              entrada.classList.add('active');
              // reemplazar el valor no alfanumerico
              // event.target.value = valor.replace(/[^a-zA-Z0-9]/g, '');
              console.log("valor ingresado no es alfanumerico");
          } else {
              entrada.classList.remove('active');
          }

          if (valor.length > 20) {
              // sub-string del valor hasta 20
              // entrada.value = valor.slice(0, 20);
              console.log("valor ingresado mayor a 20");
          }
      });
  });
    
    const handleSubirArchivo = () => {
      const imagen = document.getElementById('imagen');
      imagen.click(); 
    };
    return (
      <div className="modal-crear-lista">
        <form className="modal-box">
          <div className="inter-modal">
            <div className="campo">
              <div className="input-box">
                <label htmlFor="titulo">Título del álbum *</label>
                {/* Falta controlar entradas max 20 */}
                <input type="text" className="validar" id="titulo" autoFocus required />
              </div>
            </div>

            <div className="campo">
              <div className="input-box">
                <label htmlFor="artista">Artista *</label>
                <input type="text" className="validar" id="artista" autoFocus required />
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
                  className="btn-subir bg-white "
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
  };

  export default CrearLista;
