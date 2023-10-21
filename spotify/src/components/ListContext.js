// ListContext.js
import React, { createContext, useContext, useState } from 'react';

// Crea un contexto para la lista de canciones
export const ListContext = createContext();

// Componente proveedor para el contexto
export const ListProvider = ({ children }) => {
  const [listaCancionesReproduccion, setListaCanciones] = useState([]);
  const [cancionSeleccionada, setCancionSeleccionada] = useState(null);

  // Función para actualizar la lista de canciones
  const actualizarListaCanciones = (nuevaLista) => {
    setListaCanciones(nuevaLista);
  };

  const actualizarCancionSelecionada = (nuevaCancion) => {
    console.log('Recibido:', nuevaCancion);
  
    // Realiza una búsqueda en la lista de canciones para encontrar la canción seleccionada.
    const cancionSeleccionada = listaCancionesReproduccion.find((cancion) => cancion.id_cancion === nuevaCancion);
  
    if (cancionSeleccionada) {
      // Si se encuentra la canción, puedes establecerla como la canción seleccionada.
      setCancionSeleccionada(cancionSeleccionada);
    } else {
      console.error('Canción no encontrada en la lista:', nuevaCancion);
    }
  };
  

  return (
    <ListContext.Provider value={{ listaCancionesReproduccion, actualizarListaCanciones, cancionSeleccionada,  actualizarCancionSelecionada}}>
      {children}
    </ListContext.Provider>
  );
};

// Función personalizada para usar el contexto
export const useListContext = () => {
  return useContext(ListContext);
};
