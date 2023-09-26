import React from "react";
import { Link } from "react-router-dom";

function MenuLateral() {
  return (
    <div className="bg-teal-950 h-screen w-1/4 flex flex-col items-center">
      <div className="py-4">
        <Link to="/" className="text-white font-bold flex items-center">
          <h1>Spotify</h1>
        </Link>
      </div>
      <ul className="flex flex-col gap-1">
        <li>
          <Link className="bg-slate-200 py-2 px-4 flex items-center" to="/">
            Inicio
          </Link>
        </li>
        <li>
          <Link className="bg-slate-200 py-2 px-4 flex items-center" to="/crearLista">
            Crear Lista
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default MenuLateral;
