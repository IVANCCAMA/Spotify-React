import React from 'react';

function CrearLista() {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Crear Lista</h2>

      <form>
        <div className="mb-4">
          <label htmlFor="titulo" className="block text-gray-700">Título de la Lista *</label>
          <input
            type="text"
            id="titulo"
            className="w-full p-2 border rounded-md"
            placeholder="Ingrese el título de la lista"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="tipoLista" className="block text-gray-700">Tipo de Lista</label>
          <select id="tipoLista" className="w-full p-2 border rounded-md">
            <option value="album">Álbum</option>
            <option value="sencillo">Sencillo</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="imagen" className="block text-gray-700">Subir Imagen</label>
          <input type="file" id="imagen" className="w-full" />
        </div>

        <div className="flex justify-between">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Crear</button>
          <button type="button" className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md">Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default CrearLista;
