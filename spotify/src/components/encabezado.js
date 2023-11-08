import React from 'react';
import { Icon } from '@iconify/react';
import { Link } from "react-router-dom";
import "./encabezado.css"

function Encabeazado() {
    return (
        <header className="header">
            <Link  to="/registro" className='boton-registro'><strong>Regístrate</strong></Link>  
            <Link to="/perfil">
                <Icon icon="gg:profile" color="white" width="45" height="45" />
            </Link>
        </header>
    );
}

export default Encabeazado;
