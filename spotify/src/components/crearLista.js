import React from 'react';

function CrearLista() {
  return (
    <div className="max-w-md mx-auto p-6 bg-white  shadow-md ">
      <form>
        <div className="mb-4">
          <label htmlFor="titulo" className="block text-gray-700">Título de la Lista *</label>
          <input
            type="text"
            id="titulo"
            className="w-full p-2 border "
            placeholder="Ingrese el título de la lista"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="tipoLista" className="block text-gray-700">Tipo de Lista</label>
          <select id="tipoLista" className="w-full p-2 border ">
            <option value="album">Álbum</option>
            <option value="sencillo">Sencillo</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="imagen" className="block text-gray-700">Subir Imagen</label>
          <input type="file" id="imagen" className="w-full" />
        </div>

        <div className="flex justify-between">
          <button type="submit" className="px-1 py-1 bg-blue-500 text-white ">Aceptar</button>
          <button type="button" className="px-1 py-1 bg-gray-300 text-gray-700 ">Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default CrearLista;
