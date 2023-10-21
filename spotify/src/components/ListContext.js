// ListContext.js
import React, { createContext, useContext, useState } from 'react';

// Crea un contexto para la lista de canciones
export const ListContext = createContext();

// Componente proveedor para el contexto
export const ListProvider = ({ children }) => {
  const [listaCancionesReproduccion, setListaCanciones] = useState([]);

  // Función para actualizar la lista de canciones
  const actualizarListaCanciones = (nuevaLista) => {
    setListaCanciones(nuevaLista);
  };

  return (
    <ListContext.Provider value={{ listaCancionesReproduccion, actualizarListaCanciones }}>
      {children}
    </ListContext.Provider>
  );
};

// Función personalizada para usar el contexto
export const useListContext = () => {
  return useContext(ListContext);
};
