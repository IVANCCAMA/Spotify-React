import React from 'react';
import { Icon } from '@iconify/react';
import { Link } from "react-router-dom";

function Encabeazado() {
    return (
        <header className="header">
            <Link  to="/iniciarsesion" className='boton-iniciarsesion'><strong>Iniciar Sesión</strong></Link> 
            <Link  to="/registro" className='boton-registro'><strong>Regístrate</strong></Link>  
            <Link to="/perfil">
                <Icon icon="gg:profile" color="white" width="65" height="65" />
            </Link>
        </header>
    );
}

export default Encabeazado;
