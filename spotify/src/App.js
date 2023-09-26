import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CrearLista from './components/crearLista';
import MenuLateral from './components/menuLateral';

function App () {
  return (
    <div className='bg-teal-300'> 
       <div className='flex'>
        <MenuLateral/>
          <div className="container mx-auto py-4 px-20">
            <Routes>
              <Route path="/crearLista" element={< CrearLista />} />
            </Routes>
        </div>
       </div>
    </div>
  );
};

export default App;
